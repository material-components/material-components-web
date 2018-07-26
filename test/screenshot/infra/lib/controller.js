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

const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const CloudStorage = require('./cloud-storage');
const Duration = require('./duration');
const GoldenIo = require('./golden-io');
const Logger = require('./logger');
const ReportBuilder = require('./report-builder');
const ReportWriter = require('./report-writer');
const SeleniumApi = require('./selenium-api');
const getStackTrace = require('./stacktrace')('Controller');

class Controller {
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
     * @type {!CloudStorage}
     * @private
     */
    this.cloudStorage_ = new CloudStorage();

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
    return await this.reportBuilder_.initForApproval({runReportJsonUrl});
  }

  /**
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForCapture(goldenDiffBase) {
    const isOnline = this.cli_.isOnline();
    if (isOnline) {
      await this.cbtApi_.killStalledSeleniumTests();
    }
    return await this.reportBuilder_.initForCapture(goldenDiffBase);
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForDemo() {
    return await this.reportBuilder_.initForDemo();
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async uploadAllAssets(reportData) {
    this.logger_.foldStart('screenshot.upload_assets', 'Controller#uploadAllAssets()');
    await this.cloudStorage_.uploadAllAssets(reportData);
    this.logger_.foldEnd('screenshot.upload_assets');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async captureAllPages(reportData) {
    this.logger_.foldStart('screenshot.capture_images', 'Controller#captureAllPages()');

    let stackTrace;

    try {
      stackTrace = getStackTrace('captureAllPages');
      await this.seleniumApi_.captureAllPages(reportData);
    } catch (err) {
      throw new VError(err, stackTrace);
    }

    const meta = reportData.meta;
    meta.end_time_iso_utc = new Date().toISOString();
    meta.duration_ms = Duration.elapsed(meta.start_time_iso_utc, meta.end_time_iso_utc).toMillis();

    this.logger_.foldEnd('screenshot.capture_images');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  populateMaps(reportData) {
    this.reportBuilder_.populateMaps(reportData.user_agents, reportData.screenshots);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async uploadAllImages(reportData) {
    this.logger_.foldStart('screenshot.upload_images', 'Controller#uploadAllImages()');
    await this.cloudStorage_.uploadAllScreenshots(reportData);
    await this.cloudStorage_.uploadAllDiffs(reportData);
    this.logger_.foldEnd('screenshot.upload_images');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async generateReportPage(reportData) {
    this.logger_.foldStart('screenshot.generate_report', 'Controller#generateReportPage()');
    await this.reportWriter_.generateReportPage(reportData);
    await this.cloudStorage_.uploadDiffReport(reportData);
    this.logger_.foldEnd('screenshot.generate_report');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async approveChanges(reportData) {
    /** @type {!GoldenFile} */
    const newGoldenFile = await this.reportBuilder_.approveChanges(reportData);
    await this.goldenIo_.writeToLocalFile(newGoldenFile);
  }
}

module.exports = Controller;
