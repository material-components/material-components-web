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

const Cli = require('./cli');
const CloudStorage = require('./cloud-storage');
const GitRepo = require('./git-repo');
const GoldenIo = require('./golden-io');
const ImageDiffer = require('./image-differ');
const ReportBuilder = require('./report-builder');
const SeleniumApi = require('./selenium-api');

class SeleniumController {
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
     * @type {!ImageDiffer}
     * @private
     */
    this.imageDiffer_ = new ImageDiffer();

    /**
     * @type {!ReportBuilder}
     * @private
     */
    this.reportBuilder_ = new ReportBuilder();

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
    if (isOnline) {
      await this.gitRepo_.fetch();
    }
    return this.reportBuilder_.initForCapture();
  }

  /**
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async initForDemo() {
    const isOnline = await this.cli_.isOnline();
    if (isOnline) {
      await this.gitRepo_.fetch();
    }
    return this.reportBuilder_.initForDemo();
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async uploadAllAssets(reportData) {
    await this.cloudStorage_.uploadAllAssets(reportData);
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages(reportData) {
    await this.seleniumApi_.captureAllPages(reportData);
    await this.cloudStorage_.uploadAllScreenshots(reportData);
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async compareAllScreenshots(reportData) {
    await this.imageDiffer_.compareAllScreenshots(reportData);
    await this.cloudStorage_.uploadAllDiffs(reportData);
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async generateDiffReport(reportData) {
    await this.report.compareAllScreenshots(reportData); // TODO(acdvorak): Finish
    await this.cloudStorage_.uploadAllDiffs(reportData);

    console.log('\n\nDONE uploading diff report to GCS!\n\n');
    console.log(reportPageFile.publicUrl);

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async updateGoldenJson(reportData) {
    /** @type {!GoldenFile} */
    const newGoldenFile = await this.goldenIo_.approveSelectedGoldens(reportData);
    await this.goldenIo_.writeToDisk(newGoldenFile);
    return reportData;
  }
}

module.exports = SeleniumController;
