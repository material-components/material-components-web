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

const Jimp = require('jimp');
const childProcess = require('mz/child_process');
const detectPort = require('detect-port');
const express = require('express');
const os = require('os');
const osName = require('os-name');
const path = require('path');
const serveIndex = require('serve-index');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {Approvals, DiffImageResult, Dimensions, GitStatus, GoldenScreenshot, LibraryVersion} = mdcProto;
const {ReportData, ReportMeta, Screenshot, Screenshots, ScreenshotList, TestFile, User, UserAgents} = mdcProto;
const {InclusionType, CaptureState} = Screenshot;

const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const DiffBaseParser = require('./diff-base-parser');
const FileCache = require('./file-cache');
const GitHubApi = require('./github-api');
const GitRepo = require('./git-repo');
const LocalStorage = require('./local-storage');
const Logger = require('./logger');
const GoldenIo = require('./golden-io');
const UserAgentStore = require('./user-agent-store');
const {GCS_BUCKET} = require('./constants');

const USERNAME = os.userInfo().username;
const TEMP_DIR = os.tmpdir();

class ReportBuilder {
  constructor() {
    /**
     * @type {!CbtApi}
     * @private
     */
    this.cbtApi_ = new CbtApi();

    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!DiffBaseParser}
     * @private
     */
    this.diffBaseParser_ = new DiffBaseParser();

    /**
     * @type {!FileCache}
     * @private
     */
    this.fileCache_ = new FileCache();

    /**
     * @type {!GitHubApi}
     * @private
     */
    this.gitHubApi_ = new GitHubApi();

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
     * @type {!Logger}
     * @private
     */
    this.logger_ = new Logger(__filename);

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
    /** @type {!mdc.proto.ReportData} */
    const reportData = ReportData.fromObject(require(runReportJsonFile.absolute_path));
    reportData.approvals = Approvals.create();
    this.populateMaps(reportData.user_agents, reportData.screenshots);
    this.populateApprovals_(reportData);
    return reportData;
  }

  /**
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForCapture(goldenDiffBase) {
    this.logger_.foldStart('screenshot.init', 'ReportBuilder#initForCapture()');

    if (this.cli_.isOnline()) {
      await this.cbtApi_.fetchAvailableDevices();
    }

    /** @type {!mdc.proto.ReportMeta} */
    const reportMeta = await this.createReportMetaProto_(goldenDiffBase);
    /** @type {!mdc.proto.UserAgents} */
    const userAgents = await this.createUserAgentsProto_();

    await this.localStorage_.copyAssetsToTempDir(reportMeta);

    // In offline mode, we start a local web server to test on instead of using GCS.
    if (this.cli_.isOffline()) {
      await this.startTemporaryHttpServer_(reportMeta);
    }

    const screenshots = await this.createScreenshotsProto_({reportMeta, userAgents, goldenDiffBase});

    const reportData = ReportData.create({
      meta: reportMeta,
      user_agents: userAgents,
      screenshots: screenshots,
      approvals: Approvals.create(),
    });

    await this.prefetchGoldenImages_(reportData);
    await this.validateRunParameters_(reportData);

    this.logger_.foldEnd('screenshot.init');

    return reportData;
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
   * @param {!mdc.proto.UserAgents} userAgents
   * @param {!mdc.proto.Screenshots} screenshots
   */
  populateMaps(userAgents, screenshots) {
    // TODO(acdvorak): Figure out why the report page is randomly sorted. E.g.:
    // https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/12/04_49_09_427/report/report.html
    // https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/12/04_48_52_974/report/report.html
    // https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/12/04_49_40_160/report/report.html
    const sort = (a, b) => this.compareScreenshotsForSorting_(a, b);

    screenshots.expected_screenshot_list.sort(sort);
    screenshots.actual_screenshot_list.sort(sort);
    screenshots.runnable_screenshot_list.sort(sort);
    screenshots.skipped_screenshot_list.sort(sort);
    screenshots.comparable_screenshot_list.sort(sort);
    screenshots.added_screenshot_list.sort(sort);
    screenshots.removed_screenshot_list.sort(sort);
    screenshots.changed_screenshot_list.sort(sort);
    screenshots.unchanged_screenshot_list.sort(sort);

    // This field gets stripped out when the report is serialized to JSON, so we need to recalculate it.
    if (screenshots.comparable_screenshot_list.length === 0) {
      screenshots.comparable_screenshot_list.push(
        ...(screenshots.changed_screenshot_list),
        ...(screenshots.unchanged_screenshot_list)
      );
      screenshots.comparable_screenshot_list.sort(sort);
    }

    // This field gets stripped out when the report is serialized to JSON, so we need to recalculate it.
    if (screenshots.runnable_screenshot_list.length === 0) {
      screenshots.runnable_screenshot_list.push(
        ...(screenshots.added_screenshot_list),
        ...(screenshots.changed_screenshot_list),
        ...(screenshots.unchanged_screenshot_list)
      );
      screenshots.runnable_screenshot_list.sort(sort);
    }

    screenshots.expected_screenshot_browser_map = this.groupByBrowser_(screenshots.expected_screenshot_list);
    screenshots.actual_screenshot_browser_map = this.groupByBrowser_(screenshots.actual_screenshot_list);
    screenshots.runnable_screenshot_browser_map = this.groupByBrowser_(screenshots.runnable_screenshot_list);
    screenshots.skipped_screenshot_browser_map = this.groupByBrowser_(screenshots.skipped_screenshot_list);
    screenshots.comparable_screenshot_browser_map = this.groupByBrowser_(screenshots.comparable_screenshot_list);
    screenshots.added_screenshot_browser_map = this.groupByBrowser_(screenshots.added_screenshot_list);
    screenshots.removed_screenshot_browser_map = this.groupByBrowser_(screenshots.removed_screenshot_list);
    screenshots.changed_screenshot_browser_map = this.groupByBrowser_(screenshots.changed_screenshot_list);
    screenshots.unchanged_screenshot_browser_map = this.groupByBrowser_(screenshots.unchanged_screenshot_list);

    screenshots.expected_screenshot_page_map = this.groupByPage_(screenshots.expected_screenshot_list);
    screenshots.actual_screenshot_page_map = this.groupByPage_(screenshots.actual_screenshot_list);
    screenshots.runnable_screenshot_page_map = this.groupByPage_(screenshots.runnable_screenshot_list);
    screenshots.skipped_screenshot_page_map = this.groupByPage_(screenshots.skipped_screenshot_list);
    screenshots.comparable_screenshot_page_map = this.groupByPage_(screenshots.comparable_screenshot_list);
    screenshots.added_screenshot_page_map = this.groupByPage_(screenshots.added_screenshot_list);
    screenshots.removed_screenshot_page_map = this.groupByPage_(screenshots.removed_screenshot_list);
    screenshots.changed_screenshot_page_map = this.groupByPage_(screenshots.changed_screenshot_list);
    screenshots.unchanged_screenshot_page_map = this.groupByPage_(screenshots.unchanged_screenshot_list);

    screenshots.runnable_test_page_urls = Object.keys(screenshots.runnable_screenshot_page_map);
    screenshots.skipped_test_page_urls = Object.keys(screenshots.skipped_screenshot_page_map);
    screenshots.runnable_browser_icon_urls = this.getBrowserIconUrls_(userAgents.runnable_user_agents);
    screenshots.skipped_browser_icon_urls = this.getBrowserIconUrls_(userAgents.skipped_user_agents);
    screenshots.runnable_screenshot_keys = this.getScreenshotsKeys_(screenshots.runnable_screenshot_list);
    screenshots.skipped_screenshot_keys = this.getScreenshotsKeys_(screenshots.skipped_screenshot_list);
  }

  /**
   * @param {!Array<!mdc.proto.UserAgent>} userAgents
   * @return {!Array<string>}
   * @private
   */
  getBrowserIconUrls_(userAgents) {
    return userAgents.map((userAgent) => userAgent.browser_icon_url);
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} screenshots
   * @return {!Array<string>}
   * @private
   */
  getScreenshotsKeys_(screenshots) {
    return screenshots.map((screenshot) => {
      // TODO(acdvorak): Document the ':' separator format
      return `${screenshot.html_file_path}:${screenshot.user_agent.alias}`;
    });
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!GoldenFile>}
   */
  async approveChanges(reportData) {
    /** @type {!GoldenFile} */
    const newGoldenFile = await this.goldenIo_.readFromLocalFile();

    for (const screenshot of reportData.approvals.changed_screenshot_list) {
      newGoldenFile.setScreenshotImageUrl(GoldenScreenshot.create({
        html_file_path: screenshot.html_file_path,
        html_file_url: screenshot.actual_html_file.public_url,
        user_agent_alias: screenshot.user_agent.alias,
        screenshot_image_path: screenshot.actual_image_file.relative_path,
        screenshot_image_url: screenshot.actual_image_file.public_url,
      }));
    }

    for (const screenshot of reportData.approvals.added_screenshot_list) {
      newGoldenFile.setScreenshotImageUrl(GoldenScreenshot.create({
        html_file_path: screenshot.html_file_path,
        html_file_url: screenshot.actual_html_file.public_url,
        user_agent_alias: screenshot.user_agent.alias,
        screenshot_image_path: screenshot.actual_image_file.relative_path,
        screenshot_image_url: screenshot.actual_image_file.public_url,
      }));
    }

    for (const screenshot of reportData.approvals.removed_screenshot_list) {
      newGoldenFile.removeScreenshotImageUrl({
        htmlFilePath: screenshot.html_file_path,
        userAgentAlias: screenshot.user_agent.alias,
      });
    }

    return newGoldenFile;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   * @private
   */
  async prefetchGoldenImages_(reportData) {
    // TODO(acdvorak): Figure out how to handle offline mode for prefetching and diffing
    console.log('Fetching golden images...');
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
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<!mdc.proto.ReportMeta>}
   * @private
   */
  async createReportMetaProto_(goldenDiffBase) {
    const isOnline = this.cli_.isOnline();

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

    this.localStorage_.mkdirpForDirsSync(
      localAssetBaseDir,
      localScreenshotImageBaseDir,
      localDiffImageBaseDir,
      localReportBaseDir,
    );

    const mdcVersionString = require('../../../../lerna.json').version;
    const hostOsName = osName(os.platform(), os.release());

    const gitStatus = GitStatus.fromObject(await this.gitRepo_.getStatus());

    /** @type {!mdc.proto.DiffBase} */
    const snapshotDiffBase = await this.diffBaseParser_.parseSnapshotDiffBase();

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

      user: User.create({
        name: await this.gitRepo_.getUserName(),
        email: await this.gitRepo_.getUserEmail(),
        username: USERNAME,
      }),
      host_os_name: hostOsName,
      host_os_icon_url: this.getHostOsIconUrl_(hostOsName),
      cli_invocation: this.getCliInvocation_(),

      git_status: gitStatus,
      golden_diff_base: goldenDiffBase,
      snapshot_diff_base: snapshotDiffBase,

      node_version: LibraryVersion.create({
        version_string: await this.getExecutableVersion_('node'),
      }),
      npm_version: LibraryVersion.create({
        version_string: await this.getExecutableVersion_('npm'),
      }),
      mdc_version: LibraryVersion.create({
        version_string: mdcVersionString,
      }),
    });
  }

  /**
   * @param {string} hostOsName
   * @return {?string}
   * @private
   */
  getHostOsIconUrl_(hostOsName) {
    // TODO(acdvorak): De-dupe and centralize icon URLs
    const map = {
      'mac': 'https://png.icons8.com/ios/48/000000/mac-os-filled.png',
      'windows': 'https://png.icons8.com/color/48/000000/windows8.png',
      'linux': 'https://png.icons8.com/color/50/000000/linux.png',
    };
    for (const [key, url] of Object.entries(map)) {
      if (hostOsName.toLowerCase().startsWith(key)) {
        return url;
      }
    }
    return null;
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
   * @param {!mdc.proto.UserAgents} allUserAgents
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<!mdc.proto.Screenshots>}
   * @private
   */
  async createScreenshotsProto_({reportMeta, userAgents, goldenDiffBase}) {
    /** @type {!GoldenFile} */
    const goldenFile = await this.goldenIo_.readFromDiffBase(goldenDiffBase);

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const expectedScreenshots = await this.getExpectedScreenshots_(goldenFile);

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const actualScreenshots = await this.getActualScreenshots_({goldenFile, reportMeta, userAgents});

    // TODO(acdvorak): Rename `Screenshots`
    return this.sortAndGroupScreenshots_(userAgents, Screenshots.create({
      expected_screenshot_list: expectedScreenshots,
      actual_screenshot_list: actualScreenshots,
      runnable_screenshot_list: actualScreenshots.filter((screenshot) => screenshot.is_runnable),
      skipped_screenshot_list: actualScreenshots.filter((screenshot) => !screenshot.is_runnable),
      added_screenshot_list: this.getAddedScreenshots_({expectedScreenshots, actualScreenshots}),
      removed_screenshot_list: await this.getRemovedScreenshots_({expectedScreenshots, actualScreenshots}),
      comparable_screenshot_list: this.getComparableScreenshots_({expectedScreenshots, actualScreenshots}),
    }));
  }

  /**
   * @param {!mdc.proto.UserAgents} userAgents
   * @param {!mdc.proto.Screenshots} screenshots
   * @return {!mdc.proto.Screenshots}
   * @private
   */
  sortAndGroupScreenshots_(userAgents, screenshots) {
    this.setAllStates_(screenshots.skipped_screenshot_list, InclusionType.SKIP, CaptureState.SKIPPED);
    this.setAllStates_(screenshots.added_screenshot_list, InclusionType.ADD, CaptureState.QUEUED);
    this.setAllStates_(screenshots.removed_screenshot_list, InclusionType.REMOVE, CaptureState.SKIPPED);
    this.setAllStates_(screenshots.comparable_screenshot_list, InclusionType.COMPARE, CaptureState.QUEUED);

    this.populateMaps(userAgents, screenshots);

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
   * @param {!mdc.proto.UserAgents} userAgents
   * @return {!Promise<!Array<!mdc.proto.Screenshot>>}
   * @private
   */
  async getActualScreenshots_({goldenFile, reportMeta, userAgents}) {
    const allUserAgents = userAgents.all_user_agents;

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
        const maxRetries = this.cli_.isOnline() ? this.cli_.retries : 0;
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
          retry_count: 0,
          max_retries: maxRetries,
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
   * @return {!Promise<!Array<!mdc.proto.Screenshot>>}
   * @private
   */
  async getRemovedScreenshots_({expectedScreenshots, actualScreenshots}) {
    /** @type {!Array<!mdc.proto.Screenshot>} */
    const removedScreenshots = [];

    for (const expectedScreenshot of expectedScreenshots) {
      const actualScreenshot = this.findScreenshotForComparison_({
        screenshots: actualScreenshots,
        screenshot: expectedScreenshot,
      });

      if (!actualScreenshot) {
        const expectedImageUrl = expectedScreenshot.expected_image_file.public_url;
        const expectedJimpImage = await Jimp.read(await this.fileCache_.downloadFileToBuffer(expectedImageUrl));
        const {width, height} = expectedJimpImage.bitmap;
        expectedScreenshot.diff_image_result = DiffImageResult.create({
          expected_image_dimensions: Dimensions.create({width, height}),
        });
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
