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

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {GitRevision} = mdcProto;

const Cli = require('./cli');
const CloudStorage = require('./cloud-storage');
const Duration = require('./duration');
const GitRepo = require('./git-repo');
const GoldenIo = require('./golden-io');
const Logger = require('./logger');
const ReportBuilder = require('./report-builder');
const ReportWriter = require('./report-writer');
const SeleniumApi = require('./selenium-api');
const {ExitCode} = require('./constants');

class Controller {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!CloudStorage}
     * @private
     */
    this.cloudStorage_ = new CloudStorage();

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
     * @type {!Logger}
     * @private
     */
    this.logger_ = new Logger(__filename);

    /**
     * @type {!ReportBuilder}
     * @private
     */
    this.reportBuilder_ = new ReportBuilder();

    /**
     * @type {!ReportWriter}
     * @private
     */
    this.reportWriter_ = new ReportWriter();

    /**
     * @type {!SeleniumApi}
     * @private
     */
    this.seleniumApi_ = new SeleniumApi();
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForApproval() {
    const runReportJsonUrl = this.cli_.runReportJsonUrl;
    return this.reportBuilder_.initForApproval({runReportJsonUrl});
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForCapture() {
    const isOnline = await this.cli_.isOnline();
    const shouldFetch = this.cli_.shouldFetch;
    if (isOnline && shouldFetch) {
      await this.gitRepo_.fetch();
    }
    return this.reportBuilder_.initForCapture();
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForDemo() {
    const isOnline = await this.cli_.isOnline();
    const shouldFetch = this.cli_.shouldFetch;
    if (isOnline && shouldFetch) {
      await this.gitRepo_.fetch();
    }
    return this.reportBuilder_.initForDemo();
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {{isTestable: boolean, prNumber: ?number}}
   */
  checkIsTestable(reportData) {
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
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async uploadAllAssets(reportData) {
    this.logger_.foldStart('screenshot.upload', 'Controller#uploadAllAssets()');
    await this.cloudStorage_.uploadAllAssets(reportData);
    this.logger_.foldEnd('screenshot.upload');
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages(reportData) {
    this.logger_.foldStart('screenshot.capture', 'Controller#captureAllPages()');
    await this.seleniumApi_.captureAllPages(reportData);
    await this.cloudStorage_.uploadAllScreenshots(reportData);
    this.logger_.foldEnd('screenshot.capture');
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async compareAllScreenshots(reportData) {
    this.logger_.foldStart('screenshot.compare', 'Controller#compareAllScreenshots()');

    await this.reportBuilder_.populateScreenshotMaps(reportData.user_agents, reportData.screenshots);
    await this.cloudStorage_.uploadAllDiffs(reportData);

    this.logComparisonResults_(reportData);

    // TODO(acdvorak): Where should this go?
    const meta = reportData.meta;
    meta.end_time_iso_utc = new Date().toISOString();
    meta.duration_ms = Duration.elapsed(meta.start_time_iso_utc, meta.end_time_iso_utc).toMillis();

    this.logger_.foldEnd('screenshot.compare');

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async generateReportPage(reportData) {
    this.logger_.foldStart('screenshot.report', 'Controller#generateReportPage()');

    await this.reportWriter_.generateReportPage(reportData);
    await this.cloudStorage_.uploadDiffReport(reportData);

    this.logger_.foldEnd('screenshot.report');

    // TODO(acdvorak): Store this directly in the proto so we don't have to recalculate it all over the place
    const numChanges =
      reportData.screenshots.changed_screenshot_list.length +
      reportData.screenshots.added_screenshot_list.length +
      reportData.screenshots.removed_screenshot_list.length;

    if (numChanges > 0) {
      this.logger_.error(`\n\n${numChanges} screenshot${numChanges === 1 ? '' : 's'} changed!\n`);
    } else {
      this.logger_.log(`\n\n${numChanges} screenshot${numChanges === 1 ? '' : 's'} changed!\n`);
    }
    this.logger_.log('Diff report:', Logger.colors.bold.red(reportData.meta.report_html_file.public_url));

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<number>}
   */
  async getTestExitCode(reportData) {
    const isOnline = await this.cli_.isOnline();

    // TODO(acdvorak): Store this directly in the proto so we don't have to recalculate it all over the place
    const numChanges =
      reportData.screenshots.changed_screenshot_list.length +
      reportData.screenshots.added_screenshot_list.length +
      reportData.screenshots.removed_screenshot_list.length;

    if (numChanges === 0) {
      return ExitCode.OK;
    }

    if (isOnline) {
      if (process.env.TRAVIS === 'true') {
        return ExitCode.OK;
      }
      return ExitCode.CHANGES_FOUND;
    }

    // Allow the report HTTP server to keep running by waiting for a promise that never resolves.
    console.log('\nPress Ctrl-C to kill the report server');
    await new Promise(() => {});
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async approveChanges(reportData) {
    /** @type {!GoldenFile} */
    const newGoldenFile = await this.reportBuilder_.approveChanges(reportData);
    await this.goldenIo_.writeToLocalFile(newGoldenFile);
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @private
   */
  logComparisonResults_(reportData) {
    console.log('');
    this.logComparisonResultSet_('Skipped', reportData.screenshots.skipped_screenshot_list);
    this.logComparisonResultSet_('Unchanged', reportData.screenshots.unchanged_screenshot_list);
    this.logComparisonResultSet_('Removed', reportData.screenshots.removed_screenshot_list);
    this.logComparisonResultSet_('Added', reportData.screenshots.added_screenshot_list);
    this.logComparisonResultSet_('Changed', reportData.screenshots.changed_screenshot_list);
  }

  /**
   * @param {!Array<!mdc.proto.Screenshot>} screenshots
   * @private
   */
  logComparisonResultSet_(title, screenshots) {
    console.log(`${title} ${screenshots.length} screenshot${screenshots.length === 1 ? '' : 's'}:`);
    for (const screenshot of screenshots) {
      console.log(`  - ${screenshot.html_file_path} > ${screenshot.user_agent.alias}`);
    }
    console.log('');
  }
}

module.exports = Controller;
