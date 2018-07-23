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
const DiffBaseParser = require('../lib/diff-base-parser');
const Duration = require('../lib/duration');
const Controller = require('../lib/controller');
const GitHubApi = require('../lib/github-api');
const ImageDiffer = require('../lib/image-differ');
const Logger = require('../lib/logger');
const {ExitCode} = require('../lib/constants');

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
    const buildCommand = new BuildCommand();
    await buildCommand.runAsync();

    const cliDiffBase = this.cli_.diffBase;

    /** @type {!mdc.proto.DiffBase} */
    const snapshotDiffBase = await this.diffBaseParser_.parseGoldenDiffBase(cliDiffBase);

    /** @type {!mdc.proto.ReportData} */
    const localDiffReportData = await this.diffEmAll_(snapshotDiffBase);

    const {isTestable, prNumber} = this.checkIsTestable_(localDiffReportData);
    if (!isTestable) {
      const underline = CliColor.underline;
      const boldGreen = CliColor.bold.green;
      this.logger_.warn(`
${underline(`PR #${prNumber}`)} does not contain any testable source file changes.

${boldGreen('Skipping screenshot tests.')}
`);
      return ExitCode.OK;
    }

    await this.gitHubApi_.setPullRequestStatusAuto(localDiffReportData);

    const localDiffExitCode = this.getExitCode_(localDiffReportData);
    if (localDiffExitCode !== ExitCode.OK) {
      return localDiffExitCode;
    }

    const snapshotGitRev = snapshotDiffBase.git_revision;
    const isTravisPr = snapshotGitRev && snapshotGitRev.type === GitRevision.Type.TRAVIS_PR;
    if (!isTravisPr) {
      return ExitCode.OK;
    }

    // TODO(acdvorak): Find a better way
    if (cliDiffBase.startsWith('origin/master')) {
      return ExitCode.OK;
    }

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
    const masterDiffReportData = await this.diffEmAll_(masterDiffBase, capturedScreenshots);

    masterDiffReportData.meta.start_time_iso_utc = localDiffReportData.meta.start_time_iso_utc;
    masterDiffReportData.meta.end_time_iso_utc = new Date().toISOString();
    masterDiffReportData.meta.duration_ms = Duration.elapsed(
      masterDiffReportData.meta.start_time_iso_utc,
      masterDiffReportData.meta.end_time_iso_utc
    ).toMillis();

    const comment = this.getPrComment_(masterDiffReportData, snapshotGitRev);
    await this.gitHubApi_.createPullRequestComment(
      snapshotGitRev.pr_number,
      comment
    );

    return ExitCode.OK;
  }

  /**
   * TODO(acdvorak): Pass diffbase through the stack instead of using `Cli#diffBase`
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @param {!Array<!mdc.proto.Screenshot>} capturedScreenshots
   * @return {!Promise<!mdc.proto.ReportData>}
   * @private
   */
  async diffEmAll_(goldenDiffBase, capturedScreenshots = []) {
    const controller = new Controller();

    /** @type {!mdc.proto.ReportData} */
    const reportData = await controller.initForCapture(goldenDiffBase);

    try {
      if (capturedScreenshots.length === 0) {
        await this.gitHubApi_.setPullRequestStatusAuto(reportData);
      }

      await controller.uploadAllAssets(reportData);

      if (capturedScreenshots.length === 0) {
        await controller.captureAllPages(reportData);
      } else {
        await this.copyAndCompareScreenshots_({reportData, capturedScreenshots});
      }

      controller.populateMaps(reportData);

      await controller.uploadAllImages(reportData);
      await controller.generateReportPage(reportData);

      if (capturedScreenshots.length === 0) {
        await this.gitHubApi_.setPullRequestStatusAuto(reportData);
      }
    } catch (err) {
      await this.gitHubApi_.setPullRequestError();
      throw new VError(err, 'Failed to run screenshot tests');
    }

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {{isTestable: boolean, prNumber: ?number}}
   */
  checkIsTestable_(reportData) {
    const goldenGitRevision = reportData.meta.golden_diff_base.git_revision;
    const shouldSkipScreenshotTests =
      goldenGitRevision &&
      goldenGitRevision.type === GitRevision.Type.TRAVIS_PR &&
      goldenGitRevision.pr_file_paths.length === 0;

    return {
      isTestable: !shouldSkipScreenshotTests,
      prNumber: goldenGitRevision ? goldenGitRevision.pr_number : null,
    };
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!Array<!mdc.proto.Screenshot>} capturedScreenshots
   * @return {!Promise<void>}
   * @private
   */
  async copyAndCompareScreenshots_({reportData, capturedScreenshots}) {
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
          console.log(`Comparing ${masterScreenshot.html_file_path} > ${masterScreenshot.user_agent.alias}...`);
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

          console.log(`Compared ${masterScreenshot.html_file_path} > ${masterScreenshot.user_agent.alias}!`);

          resolve();
        }));
      }
    }

    await Promise.all(promises);

    this.logger_.foldEnd('screenshot.compare_master');
  }

  /**
   * @param {!mdc.proto.ReportData} masterDiffReportData
   * @param {!mdc.proto.GitRevision} snapshotGitRev
   * @return {string}
   * @private
   */
  getPrComment_(masterDiffReportData, snapshotGitRev) {
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
      contentMarkdown = this.getCongratulatoryMarkdown_();
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
   * @return {string}
   * @private
   */
  getCongratulatoryMarkdown_() {
    return `
### No diffs! 💯🎉

<details>
  <summary><b>0 screenshots changed</b></summary>
  <div>

<br>

${this.getRandomCongratulatoryMemeImage_()}

  </div>
</details>
`;
  }

  /**
   * @return {string}
   * @private
   */
  getRandomCongratulatoryMemeImage_() {
    const memes = {
      'Chow Yun Fat Approves':
        'https://user-images.githubusercontent.com/409245/43050443-c4a34bc6-8dbd-11e8-8386-a330df5e29be.gif',
      "You're Awesome - Bill Murray":
        'https://user-images.githubusercontent.com/409245/43050464-122754fa-8dbe-11e8-9ef8-6bd806f1fff8.jpg',
      'Bender Wants Applause - Futurama':
        'https://user-images.githubusercontent.com/409245/43051279-4b62ec26-8dcc-11e8-81af-2147368a5bbd.png',
      'High Five Handshake':
        'https://user-images.githubusercontent.com/409245/43050618-dbd7f06e-8dc0-11e8-8a7c-4fe1b0a63f49.gif',
    };
    const entries = Object.entries(memes);
    const index = Math.round(Math.random() * 1e16) % entries.length;
    const [alt, src] = entries[index];
    return `<img src="${src}" alt="${alt}" height="200">`;
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
}

module.exports = TestCommand;
