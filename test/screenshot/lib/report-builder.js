/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const childProcess = require('mz/child_process');
const detectPort = require('detect-port');
const express = require('express');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const serveIndex = require('serve-index');

const mdcProto = require('../proto/types.pb').mdc.proto;
const {LibraryVersion, ReportData, ReportMeta} = mdcProto;
const {Screenshot, Screenshots, ScreenshotList, TestFile, User, UserAgents} = mdcProto;
const {InclusionType, CaptureState} = Screenshot;

const Cli = require('./cli');
const FileCache = require('./file-cache');
const GitRepo = require('./git-repo');
const LocalStorage = require('./local-storage');
const GoldenIo = require('./golden-io');
const UserAgentStore = require('./user-agent-store');
const {GCS_BUCKET} = require('./constants');

const USERNAME = os.userInfo().username;
const TEMP_DIR = os.tmpdir();

class ReportBuilder {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!FileCache}
     * @private
     */
    this.fileCache_ = new FileCache();

    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!GoldenIo}
     * @private
     */
    this.goldenIo_ = new GoldenIo();

    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();

    /**
     * @type {!UserAgentStore}
     * @private
     */
    this.userAgentStore_ = new UserAgentStore();
  }

  /**
   * @param {string} runReportJsonUrl
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForApproval({runReportJsonUrl}) {
    /** @type {!mdc.proto.TestFile} */
    const runReportJsonFile = await this.fileCache_.downloadUrlToDisk(runReportJsonUrl, 'utf8');
    const reportData = ReportData.fromObject(require(runReportJsonFile.absolute_path));
    this.populateApprovals_(reportData);
    return reportData;
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForCapture() {
    const isOnline = await this.cli_.isOnline();
    const reportMeta = await this.createReportMetaProto_();
    const userAgents = await this.createUserAgentsProto_();

    await this.localStorage_.copyAssetsToTempDir(reportMeta);

    // In offline mode, we start a local web server to test on instead of using GCS.
    if (!isOnline) {
      await this.startTemporaryHttpServer_(reportMeta);
    }

    const allUserAgents = userAgents.all_user_agents;
    const screenshots = await this.createScreenshotsProto_({reportMeta, allUserAgents});

    const reportData = ReportData.create({
      meta: reportMeta,
      user_agents: userAgents,
      screenshots: screenshots,
    });

    await this.prefetchGoldenImages_(reportData);
    await this.validateRunParameters_(reportData);

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   * @private
   */
  async prefetchGoldenImages_(reportData) {
    // TODO(acdvorak): Figure out how to handle offline mode for prefetching and diffing
    console.log('Prefetching golden images...');
    await Promise.all(
      reportData.screenshots.expected_screenshot_list.map((expectedScreenshot) => {
        return this.prefetchScreenshotImages_(expectedScreenshot);
      })
    );
  }

  /**
   * @param {!mdc.proto.Screenshot} screenshot
   * @private
   */
  async prefetchScreenshotImages_(screenshot) {
    const actualImageFile = screenshot.actual_image_file;
    const expectedImageFile = screenshot.expected_image_file;
    const testPageFile = screenshot.actual_html_file;
    const diffImageFile = screenshot.diff_image_result ? screenshot.diff_image_result.diff_image_file : null;

    const urls = [
      actualImageFile ? actualImageFile.public_url : null,
      expectedImageFile ? expectedImageFile.public_url : null,
      testPageFile ? testPageFile.public_url : null,
      diffImageFile ? diffImageFile.public_url : null,
    ];

    await Promise.all(
      urls
        .filter((url) => Boolean(url))
        .map((url) => this.fileCache_.downloadUrlToDisk(url))
    );
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForDemo() {
    return ReportData.create({
      meta: await this.createReportMetaProto_(),
    });
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @private
   */
  populateApprovals_(reportData) {
    /** @type {!Array<!mdc.proto.Screenshot>} */
    const screenshots = reportData.screenshots.runnable_screenshot_list;

    // Changed
    if (this.cli_.all || this.cli_.allChanged) {
      reportData.screenshots.changed_screenshot_list.forEach((screenshot) => {
        reportData.approvals.changed_screenshot_list.push(screenshot);
      });
    } else {
      this.cli_.changed.forEach((approvalId) => {
        reportData.approvals.changed_screenshot_list.push(this.findScreenshotForApproval_({screenshots, approvalId}));
      });
    }

    // Added
    if (this.cli_.all || this.cli_.allAdded) {
      reportData.screenshots.added_screenshot_list.forEach((screenshot) => {
        reportData.approvals.added_screenshot_list.push(screenshot);
      });
    } else {
      this.cli_.added.forEach((approvalId) => {
        reportData.approvals.added_screenshot_list.push(this.findScreenshotForApproval_({screenshots, approvalId}));
      });
    }

    // Removed
    if (this.cli_.all || this.cli_.allRemoved) {
      reportData.screenshots.removed_screenshot_list.forEach((screenshot) => {
        reportData.approvals.removed_screenshot_list.push(screenshot);
      });
    } else {
      this.cli_.removed.forEach((approvalId) => {
        reportData.approvals.removed_screenshot_list.push(this.findScreenshotForApproval_({screenshots, approvalId}));
      });
    }
  }

  /**
   * @return {!Promise<!mdc.proto.ReportMeta>}
   * @private
   */
  async createReportMetaProto_() {
    const isOnline = await this.cli_.isOnline();

    // We only need to start up a local web server if the user is running in offline mode.
    // Otherwise, HTML files are uploaded to (and served) by GCS.
    const localTemporaryHttpPort = isOnline ? null : await detectPort(9000);

    const remoteUploadBaseDir = await this.generateUniqueUploadDir_();
    const remoteUploadBaseUrl = isOnline
      ? `https://storage.googleapis.com/${GCS_BUCKET}/`
      : `http://localhost:${localTemporaryHttpPort}/`;

    // TODO(acdvorak): Centralize/standardize this?
    const localTemporaryHttpDir = path.join(TEMP_DIR, 'mdc-web/assets');
    const localAssetBaseDir = path.join(localTemporaryHttpDir, remoteUploadBaseDir);
    const localScreenshotImageBaseDir = path.join(TEMP_DIR, 'mdc-web/screenshots', remoteUploadBaseDir);
    const localDiffImageBaseDir = path.join(TEMP_DIR, 'mdc-web/diffs', remoteUploadBaseDir);
    const localReportBaseDir = path.join(TEMP_DIR, 'mdc-web/report', remoteUploadBaseDir);

    // TODO(acdvorak): Centralize file writing and automatically call mkdirp
    mkdirp.sync(path.dirname(localAssetBaseDir));
    mkdirp.sync(path.dirname(localScreenshotImageBaseDir));
    mkdirp.sync(path.dirname(localDiffImageBaseDir));
    mkdirp.sync(path.dirname(localReportBaseDir));

    const mdcVersionString = require('../../../lerna.json').version;

    return ReportMeta.create({
      start_time_iso_utc: new Date().toISOString(),

      remote_upload_base_url: remoteUploadBaseUrl,
      remote_upload_base_dir: remoteUploadBaseDir,

      local_asset_base_dir: localAssetBaseDir,
      local_screenshot_image_base_dir: localScreenshotImageBaseDir,
      local_diff_image_base_dir: localDiffImageBaseDir,
      local_report_base_dir: localReportBaseDir,

      local_temporary_http_dir: localTemporaryHttpDir,
      local_temporary_http_port: localTemporaryHttpPort,

      cli_invocation: this.getCliInvocation_(),
      diff_base: await this.cli_.parseDiffBase(),
      user: User.create({
        name: await this.gitRepo_.getUserName(),
        email: await this.gitRepo_.getUserEmail(),
        username: USERNAME,
      }),

      node_version: LibraryVersion.create({
        version_string: await this.getExecutableVersion_('node'),
      }),
      npm_version: LibraryVersion.create({
        version_string: await this.getExecutableVersion_('npm'),
      }),
      mdc_version: LibraryVersion.create({
        version_string: mdcVersionString,
        commit_offset: await this.getCommitDistance_(mdcVersionString),
      }),
    });
  }

  /**
   * @return {string}
   * @private
   */
  getCliInvocation_() {
    const [nodeBinPath, scriptPath, ...scriptArgs] = process.argv;
    const nodeBinPathRedacted = nodeBinPath.replace(process.env.HOME, '~');
    const scriptPathRedacted = scriptPath.replace(process.env.PWD, '.');
    const nodeArgs = process.execArgv;
    return [nodeBinPathRedacted, ...nodeArgs, scriptPathRedacted, ...scriptArgs]
      .map((arg) => {
        // Heuristic for "safe" characters that don't need to be escaped or wrapped in single quotes to be copy/pasted
        // and run in a shell. This includes the letters a-z and A-Z, the numbers 0-9,
        // See https://ascii.cl/
        if (/^[,-9@-Z_a-z=~]+$/.test(arg)) {
          return arg;
        }
        return `'${arg.replace(/'/g, "\\'")}'`;
      })
      .join(' ')
    ;
  }

  /**
   * @param {string} cmd
   * @return {!Promise<string>}
   * @private
   */
  async getExecutableVersion_(cmd) {
    const options = {cwd: process.env.PWD, env: process.env};
    const stdOut = await childProcess.exec(`${cmd} --version`, options);
    return stdOut[0].trim().replace(/^v/, ''); // `node --version` returns "v8.11.0", so we strip the leading 'v'
  }

  /**
   * @param {string} mdcVersion
   * @return {!Promise<number>}
   */
  async getCommitDistance_(mdcVersion) {
    return (await this.gitRepo_.getLog([`v${mdcVersion}..HEAD`])).length;
  }

  /**
   * @return {!Promise<!mdc.proto.UserAgents>}
   * @private
   */
  async createUserAgentsProto_() {
    /** @type {!Array<!mdc.proto.UserAgent>} */
    const allUserAgents = await this.userAgentStore_.getAllUserAgents();
    return UserAgents.create({
      all_user_agents: allUserAgents,
      runnable_user_agents: allUserAgents.filter((ua) => ua.is_runnable),
      skipped_user_agents: allUserAgents.filter((ua) => !ua.is_runnable),
    });
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @param {!Array<!mdc.proto.UserAgent>} allUserAgents
   * @return {!Promise<!mdc.proto.Screenshots>}
   * @private
   */
  async createScreenshotsProto_({reportMeta, allUserAgents}) {
    /** @type {!GoldenFile} */
    const goldenFile = await this.goldenIo_.readFromDiffBase();

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const expectedScreenshots = await this.getExpectedScreenshots_(goldenFile);

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const actualScreenshots = await this.getActualScreenshots_({goldenFile, reportMeta, allUserAgents});

    // TODO(acdvorak): Rename `Screenshots`
    return this.sortAndGroupScreenshots_(Screenshots.create({
      expected_screenshot_list: expectedScreenshots,
      actual_screenshot_list: actualScreenshots,
      runnable_screenshot_list: actualScreenshots.filter((screenshot) => screenshot.is_runnable),
      skipped_screenshot_list: actualScreenshots.filter((screenshot) => !screenshot.is_runnable),
      added_screenshot_list: this.getAddedScreenshots_({expectedScreenshots, actualScreenshots}),
      removed_screenshot_list: this.getRemovedScreenshots_({expectedScreenshots, actualScreenshots}),
      comparable_screenshot_list: this.getComparableScreenshots_({expectedScreenshots, actualScreenshots}),
    }));
  }

  /**
   * @param {!mdc.proto.Screenshots} screenshots
   * @return {!mdc.proto.Screenshots}
   * @private
   */
  sortAndGroupScreenshots_(screenshots) {
    this.setAllStates_(screenshots.skipped_screenshot_list, InclusionType.SKIP, CaptureState.SKIPPED);
    this.setAllStates_(screenshots.added_screenshot_list, InclusionType.ADD, CaptureState.QUEUED);
    this.setAllStates_(screenshots.removed_screenshot_list, InclusionType.REMOVE, CaptureState.SKIPPED);
    this.setAllStates_(screenshots.comparable_screenshot_list, InclusionType.COMPARE, CaptureState.QUEUED);

    const sort = (a, b) => this.compareScreenshotsForSorting_(a, b);

    screenshots.expected_screenshot_list.sort(sort);
    screenshots.actual_screenshot_list.sort(sort);
    screenshots.runnable_screenshot_list.sort(sort);
    screenshots.skipped_screenshot_list.sort(sort);
    screenshots.added_screenshot_list.sort(sort);
    screenshots.removed_screenshot_list.sort(sort);
    screenshots.comparable_screenshot_list.sort(sort);

    screenshots.expected_screenshot_browser_map = this.groupByBrowser_(screenshots.expected_screenshot_list);
    screenshots.actual_screenshot_browser_map = this.groupByBrowser_(screenshots.actual_screenshot_list);
    screenshots.runnable_screenshot_browser_map = this.groupByBrowser_(screenshots.runnable_screenshot_list);
    screenshots.skipped_screenshot_browser_map = this.groupByBrowser_(screenshots.skipped_screenshot_list);
    screenshots.added_screenshot_browser_map = this.groupByBrowser_(screenshots.added_screenshot_list);
    screenshots.removed_screenshot_browser_map = this.groupByBrowser_(screenshots.removed_screenshot_list);
    screenshots.comparable_screenshot_browser_map = this.groupByBrowser_(screenshots.comparable_screenshot_list);

    screenshots.expected_screenshot_page_map = this.groupByPage_(screenshots.expected_screenshot_list);
    screenshots.actual_screenshot_page_map = this.groupByPage_(screenshots.actual_screenshot_list);
    screenshots.runnable_screenshot_page_map = this.groupByPage_(screenshots.runnable_screenshot_list);
    screenshots.skipped_screenshot_page_map = this.groupByPage_(screenshots.skipped_screenshot_list);
    screenshots.added_screenshot_page_map = this.groupByPage_(screenshots.added_screenshot_list);
    screenshots.removed_screenshot_page_map = this.groupByPage_(screenshots.removed_screenshot_list);
    screenshots.comparable_screenshot_page_map = this.groupByPage_(screenshots.comparable_screenshot_list);

    return screenshots;
  }

  /**
   * TODO(acdvorak): De-dupe this method with other JS files
   * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
   * @return {!Object<string, !mdc.proto.ScreenshotList>}
   * @private
   */
  groupByBrowser_(screenshotArray) {
    const browserMap = {};
    screenshotArray.forEach((screenshot) => {
      const userAgentAlias = screenshot.user_agent.alias;
      browserMap[userAgentAlias] = browserMap[userAgentAlias] || ScreenshotList.create({screenshots: []});
      browserMap[userAgentAlias].screenshots.push(screenshot);
    });
    return browserMap;
  }

  /**
   * TODO(acdvorak): De-dupe this method with other JS files
   * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
   * @return {!Object<string, !mdc.proto.ScreenshotList>}
   * @private
   */
  groupByPage_(screenshotArray) {
    const pageMap = {};
    screenshotArray.forEach((screenshot) => {
      const htmlFilePath = screenshot.html_file_path;
      pageMap[htmlFilePath] = pageMap[htmlFilePath] || ScreenshotList.create({screenshots: []});
      pageMap[htmlFilePath].screenshots.push(screenshot);
    });
    return pageMap;
  }

  /**
   * @param {!GoldenFile} goldenFile
   * @return {!Promise<!Array<!mdc.proto.Screenshot>>}
   * @private
   */
  async getExpectedScreenshots_(goldenFile) {
    const downloadFileAndGetPath = async (url) => {
      return (await this.fileCache_.downloadUrlToDisk(url)).absolute_path;
    };

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const expectedScreenshots = [];
    const goldenScreenshots = goldenFile.getGoldenScreenshots();

    for (const goldenScreenshot of goldenScreenshots) {
      const goldenScreenshotProto = Screenshot.create({
        html_file_path: goldenScreenshot.html_file_path,
        expected_html_file: TestFile.create({
          public_url: goldenScreenshot.html_file_url,
          relative_path: goldenScreenshot.html_file_path,
          absolute_path: await downloadFileAndGetPath(goldenScreenshot.html_file_url),
        }),
        expected_image_file: TestFile.create({
          public_url: goldenScreenshot.screenshot_image_url,
          relative_path: goldenScreenshot.screenshot_image_path,
          absolute_path: await downloadFileAndGetPath(goldenScreenshot.screenshot_image_url),
        }),
        user_agent: await this.userAgentStore_.getUserAgent(goldenScreenshot.user_agent_alias),
      });
      expectedScreenshots.push(goldenScreenshotProto);
    }

    return expectedScreenshots;
  }

  /**
   * @param {!GoldenFile} goldenFile
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @param {!Array<!mdc.proto.UserAgent>} allUserAgents
   * @return {!Promise<!Array<!mdc.proto.Screenshot>>}
   * @private
   */
  async getActualScreenshots_({goldenFile, reportMeta, allUserAgents}) {
    /** @type {!Array<!mdc.proto.Screenshot>} */
    const allScreenshots = [];

    /** @type {!Array<string>} */
    const htmlFilePaths = await this.localStorage_.getTestPageDestinationPaths(reportMeta);

    for (const htmlFilePath of htmlFilePaths) {
      const isHtmlFileRunnable = this.isRunnableTestPage_(htmlFilePath);

      const expectedHtmlFile = goldenFile.findHtmlFile(htmlFilePath);
      const actualHtmlFile = TestFile.create({
        relative_path: htmlFilePath,
        absolute_path: path.resolve(reportMeta.local_asset_base_dir, htmlFilePath),
        public_url: reportMeta.remote_upload_base_url + reportMeta.remote_upload_base_dir + htmlFilePath,
      });

      for (const userAgent of allUserAgents) {
        const userAgentAlias = userAgent.alias;
        const isScreenshotRunnable = isHtmlFileRunnable && userAgent.is_runnable;
        const expectedScreenshotImageUrl = goldenFile.getScreenshotImageUrl({htmlFilePath, userAgentAlias});

        /** @type {?mdc.proto.TestFile} */
        const expectedImageFile =
          expectedScreenshotImageUrl
            ? await this.fileCache_.downloadUrlToDisk(expectedScreenshotImageUrl)
            : null;

        allScreenshots.push(Screenshot.create({
          is_runnable: isScreenshotRunnable,
          user_agent: userAgent,
          html_file_path: htmlFilePath,
          expected_html_file: expectedHtmlFile,
          actual_html_file: actualHtmlFile,
          expected_image_file: expectedImageFile,
        }));
      }
    }

    return allScreenshots;
  }

  /**
   * @param {string} htmlFilePath
   * @return {boolean}
   * @private
   */
  isRunnableTestPage_(htmlFilePath) {
    const isIncluded =
      this.cli_.includeUrlPatterns.length === 0 ||
      this.cli_.includeUrlPatterns.some((pattern) => pattern.test(htmlFilePath));
    const isExcluded = this.cli_.excludeUrlPatterns.some((pattern) => pattern.test(htmlFilePath));
    return isIncluded && !isExcluded;
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} expectedScreenshots
   * @param {!Array<!mdc.proto.Screenshot>} actualScreenshots
   * @return {!Array<!mdc.proto.Screenshot>}
   * @private
   */
  getComparableScreenshots_({expectedScreenshots, actualScreenshots}) {
    return actualScreenshots.filter((actualScreenshot) => {
      if (!actualScreenshot.is_runnable) {
        return false;
      }
      const expectedScreenshot = this.findScreenshotForComparison_({
        screenshots: expectedScreenshots,
        screenshot: actualScreenshot,
      });
      return expectedScreenshot;
    });
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} expectedScreenshots
   * @param {!Array<!mdc.proto.Screenshot>} actualScreenshots
   * @return {!Array<!mdc.proto.Screenshot>}
   * @private
   */
  getAddedScreenshots_({expectedScreenshots, actualScreenshots}) {
    return actualScreenshots.filter((actualScreenshot) => {
      if (!actualScreenshot.is_runnable) {
        return false;
      }
      const expectedScreenshot = this.findScreenshotForComparison_({
        screenshots: expectedScreenshots,
        screenshot: actualScreenshot,
      });
      return !expectedScreenshot;
    });
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} expectedScreenshots
   * @param {!Array<!mdc.proto.Screenshot>} actualScreenshots
   * @return {!Array<!mdc.proto.Screenshot>}
   * @private
   */
  getRemovedScreenshots_({expectedScreenshots, actualScreenshots}) {
    /** @type {!Array<!mdc.proto.Screenshot>} */
    const removedScreenshots = [];

    for (const expectedScreenshot of expectedScreenshots) {
      const actualScreenshot = this.findScreenshotForComparison_({
        screenshots: actualScreenshots,
        screenshot: expectedScreenshot,
      });

      if (!actualScreenshot) {
        removedScreenshots.push(expectedScreenshot);
      }
    }

    return removedScreenshots;
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} screenshots
   * @param {!mdc.proto.Screenshot} screenshot
   * @return {?mdc.proto.Screenshot}
   * @private
   */
  findScreenshotForComparison_({screenshots, screenshot}) {
    return screenshots.find((otherScreenshot) => {
      return (
        otherScreenshot.html_file_path === screenshot.html_file_path &&
        otherScreenshot.user_agent.alias === screenshot.user_agent.alias
      );
    });
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} screenshots
   * @param {!mdc.proto.ApprovalId} approvalId
   * @return {?mdc.proto.Screenshot}
   * @private
   */
  findScreenshotForApproval_({screenshots, approvalId}) {
    return screenshots.find((otherScreenshot) => {
      return (
        otherScreenshot.html_file_path === approvalId.html_file_path &&
        otherScreenshot.user_agent.alias === approvalId.user_agent_alias
      );
    });
  }

  /**
   * Generates a unique directory path for a batch of uploaded files.
   * @return {!Promise<string>}
   */
  async generateUniqueUploadDir_() {
    const {year, month, day, hour, minute, second, ms} = this.getUtcDateTime_();
    return `${USERNAME}/${year}/${month}/${day}/${hour}_${minute}_${second}_${ms}/`;
  }

  /**
   * Returns the date and time in UTC as a map of component parts. Each part value is padded with leading zeros.
   * @return {{year: string, month: string, day: string, hour: string, minute: string, second: string, ms: string}}
   * @private
   */
  getUtcDateTime_() {
    const pad = (number, length = 2) => String(number).padStart(length, '0');
    const date = new Date();

    return {
      year: pad(date.getUTCFullYear()),
      month: pad(date.getUTCMonth() + 1), // getUTCMonth() returns a zero-based value (e.g., January is `0`)
      day: pad(date.getUTCDate()),
      hour: pad(date.getUTCHours()),
      minute: pad(date.getUTCMinutes()),
      second: pad(date.getUTCSeconds()),
      ms: pad(date.getUTCMilliseconds(), 3),
    };
  }

  setAllStates_(screenshots, inclusionType, captureState) {
    for (const screenshot of screenshots) {
      screenshot.inclusion_type = inclusionType;
      screenshot.capture_state = captureState;
    }
  }

  /**
   * @param {!mdc.proto.Screenshot} a
   * @param {!mdc.proto.Screenshot} b
   * @return {number}
   * @private
   */
  compareScreenshotsForSorting_(a, b) {
    const getHtmlFilePath = (screenshot) => screenshot.html_file_path || '';
    const getUserAgentAlias = (screenshot) => screenshot.user_agent.alias || '';

    return getHtmlFilePath(a).localeCompare(getHtmlFilePath(b), 'en-US') ||
      getUserAgentAlias(a).localeCompare(getUserAgentAlias(b), 'en-US');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @private
   */
  validateRunParameters_(reportData) {
    if (reportData.user_agents.runnable_user_agents.length === 0) {
      throw new Error(
        'No browsers matched your filters! ' +
        'Try using less restrictive CLI flags (e.g., `--browser=chrome`).'
      );
    }

    if (reportData.screenshots.runnable_screenshot_list.length === 0) {
      throw new Error(
        'No test page URLs matched your filters! ' +
        'Try using less restrictive CLI flags (e.g., `--url=button/classes/baseline`).'
      );
    }

    console.log();
    this.logRunParameters_('Skipping', reportData.screenshots.skipped_screenshot_list);
    this.logRunParameters_('Removing', reportData.screenshots.removed_screenshot_list);
    this.logRunParameters_('Adding', reportData.screenshots.added_screenshot_list);
    this.logRunParameters_('Comparing', reportData.screenshots.comparable_screenshot_list);
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @return {!Promise<number>}
   * @private
   */
  async startTemporaryHttpServer_(reportMeta) {
    const dir = reportMeta.local_temporary_http_dir;
    const port = reportMeta.local_temporary_http_port;
    const app = express();
    app.use('/', express.static(dir), serveIndex(dir));
    return new Promise((resolve) => {
      console.log(`Temporary HTTP server running on http://localhost:${port}/`);
      app.listen(port, () => {
        resolve(port);
      });
    });
  }

  /**
   * @param {string} verb
   * @param {!Array<!mdc.proto.Screenshot>} screenshots
   * @private
   */
  logRunParameters_(verb, screenshots) {
    const count = screenshots.length;
    const plural = count === 1 ? '' : 's:';

    console.log(`${verb} ${count} screenshot${plural}`);
    if (count > 0) {
      for (const screenshot of screenshots) {
        const htmlFile = screenshot.actual_html_file || screenshot.expected_html_file;
        const publicUrl = htmlFile.public_url;
        console.log(`  - ${publicUrl} > ${screenshot.user_agent.alias}`);
      }
    }
    console.log();
  }
}

module.exports = ReportBuilder;
