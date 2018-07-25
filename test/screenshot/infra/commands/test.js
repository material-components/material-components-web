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

const VError = require('verror');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const GitRevision = mdcProto.GitRevision;

const BuildCommand = require('./build');
const Cli = require('../lib/cli');
const CliColor = require('../lib/logger').colors;
const Controller = require('../lib/controller');
const DiffBaseParser = require('../lib/diff-base-parser');
const Duration = require('../lib/duration');
const GitHubApi = require('../lib/github-api');
const ImageDiffer = require('../lib/image-differ');
const Logger = require('../lib/logger');
const getStackTrace = require('../lib/stacktrace')('TestCommand');
const {ExitCode} = require('../lib/constants');

// TODO(acdvorak): Refactor most of this class out into a separate file
class TestCommand {
  constructor() {
    this.cli_ = new Cli();
    this.diffBaseParser_ = new DiffBaseParser();
    this.gitHubApi_ = new GitHubApi();
    this.imageDiffer_ = new ImageDiffer();
    this.logger_ = new Logger(__filename);
  }

  /**
   * @return {!Promise<number|undefined>} Process exit code. If no exit code is returned, `0` is assumed.
   */
  async runAsync() {
    await this.build_();

    if (this.isExternalPr_()) {
      this.logExternalPr_();
      return ExitCode.OK;
    }

    /** @type {!mdc.proto.DiffBase} */
    const snapshotDiffBase = await this.diffBaseParser_.parseGoldenDiffBase();
    const snapshotGitRev = snapshotDiffBase.git_revision;

    const isTravisPr = snapshotGitRev && snapshotGitRev.type === GitRevision.Type.TRAVIS_PR;
    const isTestable = isTravisPr ? snapshotGitRev.pr_file_paths.length > 0 : true;

    if (!isTestable) {
      this.logUntestablePr_(snapshotGitRev.pr_number);
      return ExitCode.OK;
    }

    // TODO(acdvorak): Find a better word than "local"
    /** @type {!mdc.proto.ReportData} */
    const localDiffReportData = await this.diffAgainstLocal_(snapshotDiffBase);
    const localDiffExitCode = this.getExitCode_(localDiffReportData);
    if (localDiffExitCode !== ExitCode.OK) {
      this.logTestResults_(localDiffReportData);
      return localDiffExitCode;
    }

    if (isTravisPr) {
      /** @type {!mdc.proto.ReportData} */
      const masterDiffReportData = await this.diffAgainstMaster_({localDiffReportData, snapshotGitRev});
      this.logTestResults_(localDiffReportData);
      this.logTestResults_(masterDiffReportData);
    } else {
      this.logTestResults_(localDiffReportData);
    }

    // Diffs against master shouldn't fail the Travis job.
    return ExitCode.OK;
  }

  async build_() {
    const buildCommand = new BuildCommand();
    await buildCommand.runAsync();
  }

  /**
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<!mdc.proto.ReportData>}
   * @private
   */
  async diffAgainstLocal_(goldenDiffBase) {
    const controller = new Controller();

    /** @type {!mdc.proto.ReportData} */
    const reportData = await controller.initForCapture(goldenDiffBase);

    try {
      await this.gitHubApi_.setPullRequestStatusAuto(reportData);
      await controller.uploadAllAssets(reportData);
      await controller.captureAllPages(reportData);

      controller.populateMaps(reportData);

      await controller.uploadAllImages(reportData);
      await controller.generateReportPage(reportData);

      await this.gitHubApi_.setPullRequestStatusAuto(reportData);

      this.logComparisonResults_(reportData);
    } catch (err) {
      await this.gitHubApi_.setPullRequestError();
      throw new VError(err, getStackTrace('diffAgainstLocal_'));
    }

    return reportData;
  }

  /**
   * TODO(acdvorak): Rename this method
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @param {!Array<!mdc.proto.Screenshot>} capturedScreenshots
   * @param {string} startTimeIsoUtc
   * @return {!Promise<!mdc.proto.ReportData>}
   * @private
   */
  async diffAgainstMasterImpl_({goldenDiffBase, capturedScreenshots, startTimeIsoUtc}) {
    const controller = new Controller();

    /** @type {!mdc.proto.ReportData} */
    const reportData = await controller.initForCapture(goldenDiffBase);

    try {
      await controller.uploadAllAssets(reportData);
      await this.copyAndCompareScreenshots_({reportData, capturedScreenshots, startTimeIsoUtc});

      controller.populateMaps(reportData);

      await controller.uploadAllImages(reportData);
      await controller.generateReportPage(reportData);

      this.logComparisonResults_(reportData);
    } catch (err) {
      await this.gitHubApi_.setPullRequestError();
      throw new VError(err, getStackTrace('diffAgainstMasterImpl_'));
    }

    return reportData;
  }

  /**
   * TODO(acdvorak): Rename this method
   * @param {!mdc.proto.ReportData} localDiffReportData
   * @param {!mdc.proto.GitRevision} snapshotGitRev
   * @return {!Promise<!mdc.proto.ReportData>}
   * @private
   */
  async diffAgainstMaster_({localDiffReportData, snapshotGitRev}) {
    const localScreenshots = localDiffReportData.screenshots;

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const capturedScreenshots = [].concat(
      localScreenshots.changed_screenshot_list,
      localScreenshots.added_screenshot_list,
      localScreenshots.removed_screenshot_list,
      localScreenshots.unchanged_screenshot_list,
    );

    /** @type {!mdc.proto.DiffBase} */
    const masterDiffBase = await this.diffBaseParser_.parseMasterDiffBase();

    /** @type {!mdc.proto.ReportData} */
    const masterDiffReportData = await this.diffAgainstMasterImpl_({
      goldenDiffBase: masterDiffBase,
      capturedScreenshots,
      startTimeIsoUtc: localDiffReportData.meta.start_time_iso_utc,
    });

    const prNumber = snapshotGitRev.pr_number;
    const comment = this.getPrComment_({masterDiffReportData, snapshotGitRev});
    await this.gitHubApi_.createPullRequestComment({prNumber, comment});

    return masterDiffReportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!Array<!mdc.proto.Screenshot>} capturedScreenshots
   * @param {string} startTimeIsoUtc
   * @return {!Promise<void>}
   * @private
   */
  async copyAndCompareScreenshots_({reportData, capturedScreenshots, startTimeIsoUtc}) {
    const num = capturedScreenshots.length;
    const plural = num === 1 ? '' : 's';
    this.logger_.foldStart('screenshot.compare_master', `Comparing ${num} screenshot${plural} to master`);

    const promises = [];
    const screenshots = reportData.screenshots;
    const masterScreenshots = screenshots.actual_screenshot_list;

    for (const masterScreenshot of masterScreenshots) {
      for (const capturedScreenshot of capturedScreenshots) {
        if (capturedScreenshot.html_file_path !== masterScreenshot.html_file_path ||
            capturedScreenshot.user_agent.alias !== masterScreenshot.user_agent.alias) {
          continue;
        }
        promises.push(new Promise(async (resolve) => {
          masterScreenshot.actual_html_file = capturedScreenshot.actual_html_file;
          masterScreenshot.actual_image_file = capturedScreenshot.actual_image_file;
          masterScreenshot.capture_state = capturedScreenshot.capture_state;

          /** @type {!mdc.proto.DiffImageResult} */
          const diffImageResult = await this.imageDiffer_.compareOneScreenshot({
            meta: reportData.meta,
            screenshot: masterScreenshot,
          });

          masterScreenshot.diff_image_result = diffImageResult;
          masterScreenshot.diff_image_file = diffImageResult.diff_image_file;

          if (diffImageResult.has_changed) {
            reportData.screenshots.changed_screenshot_list.push(masterScreenshot);
          } else {
            reportData.screenshots.unchanged_screenshot_list.push(masterScreenshot);
          }
          reportData.screenshots.comparable_screenshot_list.push(masterScreenshot);

          resolve();
        }));
      }
    }

    await Promise.all(promises);

    const endTimeIsoUtc = new Date().toISOString();
    reportData.meta.start_time_iso_utc = startTimeIsoUtc;
    reportData.meta.end_time_iso_utc = endTimeIsoUtc;
    reportData.meta.duration_ms = Duration.elapsed(startTimeIsoUtc, endTimeIsoUtc).toMillis();

    this.logger_.foldEnd('screenshot.compare_master');
  }

  /**
   * @param {!mdc.proto.ReportData} masterDiffReportData
   * @param {!mdc.proto.GitRevision} snapshotGitRev
   * @return {string}
   * @private
   */
  getPrComment_({masterDiffReportData, snapshotGitRev}) {
    const reportPageUrl = masterDiffReportData.meta.report_html_file.public_url;
    const masterScreenshots = masterDiffReportData.screenshots;

    const listMarkdown = [
      this.getChangelistMarkdown_(
        'Changed', masterScreenshots.changed_screenshot_list, masterScreenshots.changed_screenshot_page_map
      ),
      this.getChangelistMarkdown_(
        'Added', masterScreenshots.added_screenshot_list, masterScreenshots.added_screenshot_page_map
      ),
      this.getChangelistMarkdown_(
        'Removed', masterScreenshots.removed_screenshot_list, masterScreenshots.removed_screenshot_page_map
      ),
    ].filter((str) => Boolean(str)).join('\n\n');

    let contentMarkdown;

    const numChanged =
      masterScreenshots.changed_screenshot_list.length +
      masterScreenshots.added_screenshot_list.length +
      masterScreenshots.removed_screenshot_list.length;

    if (listMarkdown) {
      contentMarkdown = `
<details>
  <summary><b>${numChanged} screenshot${numChanged === 1 ? '' : 's'} changed ⚠️</b></summary>
  <div>

${listMarkdown}

  </div>
</details>
`.trim();
    } else {
      contentMarkdown = '### No diffs! 💯🎉';
    }

    return `
🤖 Beep boop!

### Screenshot test report

Commit ${snapshotGitRev.commit} vs. \`master\`:

* ${reportPageUrl}

${contentMarkdown}
`.trim();
  }

  /**
   * @param {string} verb
   * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
   * @param {!Object<string, !mdc.proto.ScreenshotList>} screenshotMap
   */
  getChangelistMarkdown_(verb, screenshotArray, screenshotMap) {
    const numHtmlFiles = Object.keys(screenshotMap).length;
    if (numHtmlFiles === 0) {
      return null;
    }

    const listItemMarkdown = Object.entries(screenshotMap).map(([htmlFilePath, screenshotList]) => {
      const browserIconMarkup = this.getAllBrowserIcons_(screenshotList.screenshots);
      const firstScreenshot = screenshotList.screenshots[0];
      const htmlFileUrl = (firstScreenshot.actual_html_file || firstScreenshot.expected_html_file).public_url;

      return `
* [\`${htmlFilePath}\`](${htmlFileUrl}) ${browserIconMarkup}
`.trim();
    }).join('\n');

    return `
#### ${screenshotArray.length} ${verb}:

${listItemMarkdown}
`;
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
   * @return {string}
   * @private
   */
  getAllBrowserIcons_(screenshotArray) {
    return screenshotArray.map((screenshot) => {
      return this.getOneBrowserIcon_(screenshot);
    }).join(' ');
  }

  /**
   * @param screenshot
   * @return {string}
   * @private
   */
  getOneBrowserIcon_(screenshot) {
    const imgFile = screenshot.diff_image_file || screenshot.actual_image_file || screenshot.expected_image_file;
    const linkUrl = imgFile.public_url;

    const untrimmed = `
<a href="${linkUrl}"
   title="${screenshot.user_agent.alias}">
  <img src="${screenshot.user_agent.browser_icon_url}" width="16" height="16">
</a>
`;
    return untrimmed.trim().replace(/>\n *</g, '><');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!ExitCode|number}
   */
  getExitCode_(reportData) {
    // TODO(acdvorak): Store this directly in the proto so we don't have to recalculate it all over the place
    const numChanges =
      reportData.screenshots.changed_screenshot_list.length +
      reportData.screenshots.added_screenshot_list.length +
      reportData.screenshots.removed_screenshot_list.length;

    const isOnline = this.cli_.isOnline();
    if (isOnline && numChanges > 0) {
      return ExitCode.CHANGES_FOUND;
    }
    return ExitCode.OK;
  }

  /**
   * @return {boolean}
   * @private
   */
  isExternalPr_() {
    return Boolean(
      process.env.TRAVIS_PULL_REQUEST_SLUG &&
      !process.env.TRAVIS_PULL_REQUEST_SLUG.startsWith('material-components/')
    );
  }

  /**
   * @private
   */
  logExternalPr_() {
    this.logger_.warn(`

${CliColor.bold.red('Screenshot tests are not supported on external PRs for security reasons.')}

See ${CliColor.underline('https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions')}
for more information.

${CliColor.bold.red('Skipping screenshot tests.')}
`);
  }

  /**
   * @param {number} prNumber
   * @private
   */
  logUntestablePr_(prNumber) {
    this.logger_.warn(`

${CliColor.underline(`PR #${prNumber}`)} does not contain any testable source file changes.

${CliColor.bold.green('Skipping screenshot tests.')}
`);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @private
   */
  logComparisonResults_(reportData) {
    this.logger_.foldStart('screenshot.diff_results', 'Diff results');
    this.logComparisonResultSet_('Skipped', reportData.screenshots.skipped_screenshot_list);
    this.logComparisonResultSet_('Unchanged', reportData.screenshots.unchanged_screenshot_list);
    this.logComparisonResultSet_('Removed', reportData.screenshots.removed_screenshot_list);
    this.logComparisonResultSet_('Added', reportData.screenshots.added_screenshot_list);
    this.logComparisonResultSet_('Changed', reportData.screenshots.changed_screenshot_list);
    this.logger_.foldEnd('screenshot.diff_results');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @private
   */
  logTestResults_(reportData) {
    // TODO(acdvorak): Store this directly in the proto so we don't have to recalculate it all over the place
    const numChanges =
      reportData.screenshots.changed_screenshot_list.length +
      reportData.screenshots.added_screenshot_list.length +
      reportData.screenshots.removed_screenshot_list.length;

    const boldRed = CliColor.bold.red;
    const boldGreen = CliColor.bold.green;
    const color = numChanges === 0 ? boldGreen : boldRed;

    const goldenDisplayName = this.getDisplayName_(reportData.meta.golden_diff_base);
    const snapshotDisplayName = this.getDisplayName_(reportData.meta.snapshot_diff_base);

    const changedMsg = `${numChanges} screenshot${numChanges === 1 ? '' : 's'} changed!`;
    const reportPageUrl = reportData.meta.report_html_file.public_url;

    const headingPlain = 'Screenshot Test Results';
    const headingColor = CliColor.bold(headingPlain);
    const headingUnderline = ''.padEnd(headingPlain.length, '=');

    this.logger_.log(`

${headingColor}
${headingUnderline}

  - Golden:   ${goldenDisplayName}
  - Snapshot: ${snapshotDisplayName}
  - Changes:  ${color(changedMsg)}
  - Report:   ${color(reportPageUrl)}
`.trimRight());
  }

  /**
   * @param {!mdc.proto.DiffBase} diffBase
   * @return {string}
   * @private
   */
  getDisplayName_(diffBase) {
    const gitRev = diffBase.git_revision;
    if (gitRev) {
      const commitShort = gitRev.commit.substr(0, 7);
      if (gitRev.pr_number) {
        return `PR #${gitRev.pr_number} (commit ${commitShort})`;
      }
      if (gitRev.tag) {
        return `${gitRev.tag} (commit ${commitShort})`;
      }
      if (gitRev.branch) {
        return `${gitRev.remote ? `${gitRev.remote}/${gitRev.branch}` : gitRev.branch} (commit ${commitShort})`;
      }
      return commitShort;
    }
    return diffBase.local_file_path || diffBase.public_url;
  }

  /**
   * @param {string} title
   * @param {!Array<!mdc.proto.Screenshot>} screenshots
   * @private
   */
  logComparisonResultSet_(title, screenshots) {
    const num = screenshots.length;
    console.log(`${title} ${num} screenshot${num === 1 ? '' : 's'}${num > 0 ? ':' : ''}`);
    for (const screenshot of screenshots) {
      console.log(`  - ${screenshot.html_file_path} > ${screenshot.user_agent.alias}`);
    }
    console.log('');
  }
}

module.exports = TestCommand;
