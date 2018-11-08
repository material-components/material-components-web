/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
    this.logger_ = new Logger();

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
      await this.cbtApi_.killZombieSeleniumTests();
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
    this.logger_.foldStart('screenshot.upload_assets', 'Controller.uploadAllAssets()');
    await this.cloudStorage_.uploadAllAssets(reportData);
    this.logger_.foldEnd('screenshot.upload_assets');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async captureAllPages(reportData) {
    this.logger_.foldStart('screenshot.capture_images', 'Controller.captureAllPages()');

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
  async uploadAllScreenshotImages(reportData) {
    this.logger_.foldStart('screenshot.upload_screenshots', 'Controller.uploadAllScreenshotImages()');
    await this.cloudStorage_.uploadAllScreenshotImages(reportData);
    this.logger_.foldEnd('screenshot.upload_screenshots');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async uploadAllDiffImages(reportData) {
    this.logger_.foldStart('screenshot.upload_diffs', 'Controller.uploadAllDiffImages()');
    await this.cloudStorage_.uploadAllDiffImages(reportData);
    this.logger_.foldEnd('screenshot.upload_diffs');
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  async generateReportPage(reportData) {
    this.logger_.foldStart('screenshot.generate_report', 'Controller.generateReportPage()');
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
