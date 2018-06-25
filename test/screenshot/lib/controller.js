/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('mz/fs');
const path = require('path');
const request = require('request-promise-native');

const CbtUserAgent = require('./cbt-user-agent');
const CloudStorage = require('./cloud-storage');
const CliArgParser = require('./cli-arg-parser');
const GitRepo = require('./git-repo');
const ImageCache = require('./image-cache');
const ImageCropper = require('./image-cropper');
const ImageDiffer = require('./image-differ');
const LocalStorage = require('./local-storage');
const ReportGenerator = require('./report-generator');
const Screenshot = require('./screenshot');
const SnapshotStore = require('./snapshot-store');
const {UploadableFile} = require('./types');

/**
 * High-level screenshot workflow controller that provides composable async methods to:
 * 1. Upload files to GCS
 * 2. Capture screenshots with CBT
 * 3. Update local golden.json with new screenshot URLs
 * 4. Diff captured screenshots against existing golden.json
 */
class Controller {
  constructor() {
    /**
     * @type {!CliArgParser}
     * @private
     */
    this.cliArgs_ = new CliArgParser();

    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();

    /**
     * @type {!CloudStorage}
     * @private
     */
    this.cloudStorage_ = new CloudStorage();

    /**
     * @type {!ImageCache}
     * @private
     */
    this.imageCache_ = new ImageCache();

    /**
     * @type {!ImageCropper}
     * @private
     */
    this.imageCropper_ = new ImageCropper();

    /**
     * @type {!ImageDiffer}
     * @private
     */
    this.imageDiffer_ = new ImageDiffer({imageCache: this.imageCache_});

    /**
     * @type {!SnapshotStore}
     * @private
     */
    this.snapshotStore_ = new SnapshotStore();

    /**
     * Unique timestamped directory path to prevent collisions between developers.
     * @type {?string}
     * @private
     */
    this.baseUploadDir_ = null;
  }

  /**
   * @return {!Promise<!RunReport>}
   */
  async initForApproval() {
    /** @type {!RunReport} */
    const runReport = await request({
      method: 'GET',
      uri: this.cliArgs_.runReportJsonUrl,
      json: true, // Automatically stringify the request body and parse the response body as JSON
    });

    runReport.runResult.approvedGoldenJsonData = await this.snapshotStore_.fromApproval(runReport);

    return runReport;
  }

  /**
   * @return {!Promise<!RunReport>}
   */
  async initForDemo() {
    this.baseUploadDir_ = await this.cloudStorage_.generateUniqueUploadDir();

    return {
      runTarget: null,
      runResult: null,
    };
  }

  /**
   * @return {!Promise<!RunReport>}
   */
  async initForTest() {
    this.baseUploadDir_ = await this.cloudStorage_.generateUniqueUploadDir();

    await this.gitRepo_.fetch();

    return {
      runTarget: await this.getRunTarget_(),
      runResult: null,
    };
  }

  /**
   * @return {!Promise<!RunTarget>}
   * @private
   */
  async getRunTarget_() {
    const {runnableUserAgents, skippedUserAgents} = await CbtUserAgent.fetchUserAgents();
    const {runnableTestCases, skippedTestCases} = await this.localStorage_.fetchTestCases(this.baseUploadDir_);

    console.log('');

    this.logTargetTestCases_('SKIPPING', skippedTestCases);
    this.logTargetTestCases_('RUNNING', runnableTestCases);

    this.logTargetUserAgents_('SKIPPING', skippedUserAgents);
    this.logTargetUserAgents_('RUNNING', runnableUserAgents);

    if (runnableTestCases.length === 0) {
      throw new Error(
        'No URLs matched your filters! ' +
        'Try using less restrictive CLI flags (e.g., `--url=button/classes/baseline`).'
      );
    }

    if (runnableUserAgents.length === 0) {
      throw new Error(
        'No browsers matched your filters! ' +
        'Try using less restrictive CLI flags (e.g., `--browser=chrome`).'
      );
    }

    const baseGoldenJsonData = await this.snapshotStore_.fromDiffBase();

    return {
      runnableUserAgents,
      skippedUserAgents,
      runnableTestCases,
      skippedTestCases,
      baseGoldenJsonData,
    };
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!RunReport>}
   */
  async uploadAllAssets(runReport) {
    await this.cloudStorage_.uploadAllAssets(this.baseUploadDir_);

    const {runnableTestCases} = await this.localStorage_.fetchTestCases(this.baseUploadDir_);
    this.logTargetTestCases_('UPLOADED', runnableTestCases);

    return runReport;
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!RunReport>}
   */
  async captureAllPages(runReport) {
    const {runnableTestCases} = runReport.runTarget;

    await Promise.all(runnableTestCases.map((testCase, testCaseIndex) => {
      return this.captureOnePage_(testCase, testCaseIndex, runnableTestCases.length);
    }));

    this.logCaptureAllPagesSuccess_(runnableTestCases);

    return runReport;
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {number} testCaseQueueIndex
   * @param {number} testCaseQueueLength
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async captureOnePage_(testCase, testCaseQueueIndex, testCaseQueueLength) {
    return Screenshot
      .captureOneUrl(testCase.htmlFile.publicUrl)
      .then(
        (cbtInfo) => this.handleCapturePageSuccess_(testCase, cbtInfo, testCaseQueueIndex, testCaseQueueLength),
        (err) => this.handleCapturePageFailure_(testCase, err, testCaseQueueIndex, testCaseQueueLength)
      );
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {number} testCaseQueueIndex
   * @param {number} testCaseQueueLength
   * @param {!Object} cbtScreenshotInfo
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async handleCapturePageSuccess_(testCase, cbtScreenshotInfo, testCaseQueueIndex, testCaseQueueLength) {
    // We don't use CBT's screenshot versioning features, so there should only ever be one version.
    // Each "result" is an individual browser screenshot for a single URL.
    const results = cbtScreenshotInfo.versions[0].results;
    return Promise.all(results.map((cbtResult, cbtResultIndex) => {
      return this.uploadScreenshotImage_(
        testCase,
        cbtResult,
        testCaseQueueIndex * results.length + cbtResultIndex,
        testCaseQueueLength * results.length
      );
    }));
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!T} err
   * @param {number} testCaseQueueIndex
   * @param {number} testCaseQueueLength
   * @return {!Promise<!T>}
   * @template T
   * @private
   */
  async handleCapturePageFailure_(testCase, err, testCaseQueueIndex, testCaseQueueLength) {
    console.error('\n\n\nERROR capturing screenshot with CrossBrowserTesting:\n\n');
    console.error(`  - ${testCase.htmlFile.publicUrl}`);
    console.error(`  - Test case ${testCaseQueueIndex + 1} of ${testCaseQueueLength}`);
    console.error(err);
    return Promise.reject(err);
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!Object} cbtResult
   * @param {number} uploadQueueIndex
   * @param {number} uploadQueueLength
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async uploadScreenshotImage_(testCase, cbtResult, uploadQueueIndex, uploadQueueLength) {
    const cbtImageUrl = cbtResult.images.chromeless;
    if (!cbtImageUrl) {
      console.error('cbtResult:\n', cbtResult);
      throw new Error('cbtResult.images.chromeless is null');
    }

    const osApiName = cbtResult.os.api_name;
    const browserApiName = cbtResult.browser.api_name;

    const imageName = `${this.getBrowserFileName_(osApiName, browserApiName)}.png`;
    const imageData = await this.downloadAndCropImage_(cbtImageUrl);
    const imageFile = new UploadableFile({
      destinationBaseUrl: this.cliArgs_.gcsBaseUrl,
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: `${testCase.htmlFile.destinationRelativeFilePath}.${imageName}`,
      fileContent: imageData,
      userAgent: await CbtUserAgent.fetchBrowserByApiName(osApiName, browserApiName),
      queueIndex: uploadQueueIndex,
      queueLength: uploadQueueLength,
    });

    testCase.screenshotImageFiles.push(imageFile);

    return this.cloudStorage_.uploadFile(imageFile);
  }

  /**
   * @param {string} osApiName
   * @param {string} browserApiName
   * @return {string}
   * @private
   */
  getBrowserFileName_(osApiName, browserApiName) {
    // Remove MS Edge version number from Windows OS API name. E.g.: "Win10-E17" -> "Win10".
    // TODO(acdvorak): Why does the CBT browser API return "Win10" but the screenshot info API returns "Win10-E17"?
    osApiName = osApiName.replace(/-E\d+$/, '');
    return `${osApiName}_${browserApiName}`.toLowerCase().replace(/[^\w.]+/g, '');
  }

  /**
   * @param {string} uri
   * @return {!Promise<!Buffer>}
   * @private
   */
  async downloadAndCropImage_(uri) {
    return this.imageCropper_.autoCropImage(await this.imageCache_.getImageBuffer(uri));
  }

  /**
   * Writes the given changes to a `golden.json` file.
   * If the file already exists, it will be overwritten.
   * @param {!RunReport} runReport
   * @return {!Promise<!RunReport>}
   */
  async updateGoldenJson(runReport) {
    await this.snapshotStore_.writeToDisk(runReport);
    return runReport;
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!RunReport>}
   */
  async diffGoldenJson(runReport) {
    const {runnableTestCases} = runReport.runTarget;

    /** @type {!Array<!ImageDiffJson>} */
    const {diffs, added, removed, unchanged, skipped} = await this.imageDiffer_.compareAllPages({
      runReport,
      actualSuite: await this.snapshotStore_.fromTestCases(runnableTestCases),
      expectedSuite: await this.snapshotStore_.fromDiffBase(),
    });

    await Promise.all(diffs.map((diff, index) => {
      return this.uploadOneDiffImage_(diff, index, diffs.length);
    }));

    console.log('\n\nDONE diffing screenshot images!\n\n');

    runReport.runResult = {diffs, added, removed, unchanged, skipped};

    return runReport;
  }

  /**
   * @param {!ImageDiffJson} diff
   * @param {number} queueIndex
   * @param {number} queueLength
   * @return {!Promise<void>}
   * @private
   */
  async uploadOneDiffImage_(diff, queueIndex, queueLength) {
    /** @type {?CbtUserAgent} */
    const userAgent = await CbtUserAgent.fetchBrowserByAlias(diff.userAgentAlias);
    const browserFileName = this.getBrowserFileName_(userAgent.device.api_name, userAgent.browser.api_name);

    /** @type {!UploadableFile} */
    const diffImageFile = await this.cloudStorage_.uploadFile(new UploadableFile({
      destinationBaseUrl: this.cliArgs_.gcsBaseUrl,
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: `${diff.htmlFilePath}.${browserFileName}.diff.png`,
      fileContent: diff.diffImageBuffer,
      queueIndex,
      queueLength,
      userAgent,
    }));

    diff.diffImageUrl = diffImageFile.publicUrl;
    diff.diffImageBuffer = null; // free up memory
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!RunReport>}
   */
  async uploadDiffReport(runReport) {
    let nextQueueIndex = 0;

    /**
     * @param {string} filename
     * @param {number} queueLength
     * @return {!UploadableFile}
     */
    const createFile = ({filename, queueLength}) => {
      return new UploadableFile({
        destinationBaseUrl: this.cliArgs_.gcsBaseUrl,
        destinationParentDirectory: this.baseUploadDir_,
        destinationRelativeFilePath: filename,
        queueIndex: nextQueueIndex++,
        queueLength,
      });
    };

    const [reportPageFile, reportJsonFile] = [
      'report.html', 'report.json',
    ].map((filename, index, array) => {
      return createFile({filename, queueLength: array.length});
    });

    runReport.runResult.publicReportPageUrl = reportPageFile.publicUrl;
    runReport.runResult.publicReportJsonUrl = reportJsonFile.publicUrl;

    const reportGenerator = new ReportGenerator(runReport);
    const reportHtml = await reportGenerator.generateHtml();
    const reportJson = JSON.stringify(runReport, null, 2);

    reportPageFile.fileContent = reportHtml;
    reportJsonFile.fileContent = reportJson;

    /**
     * @param {!UploadableFile} file
     * @return {!Promise<!UploadableFile>}
     */
    const writeFile = async (file) => {
      const filePath = path.join(this.cliArgs_.testDir, file.destinationRelativeFilePath);
      console.log(`Writing ${filePath} to disk...`);
      await fs.writeFile(filePath, file.fileContent, {encoding: 'utf8'});
      return this.cloudStorage_.uploadFile(file);
    };

    await Promise.all([reportPageFile, reportJsonFile].map((file) => {
      return writeFile(file);
    }));

    console.log('\n\nDONE uploading diff report to GCS!\n\n');
    console.log(reportPageFile.publicUrl);

    return runReport;
  }

  /**
   * @param {string} verb
   * @param {!Array<!UploadableTestCase>} testCases
   * @private
   */
  logTargetTestCases_(verb, testCases) {
    if (testCases.length === 0) {
      return;
    }

    const num = testCases.length;
    const plural = num === 1 ? '' : 's';

    console.log(`${verb} ${num} test case${plural}:`);
    testCases.forEach((testCase) => {
      console.log(`  - ${testCase.htmlFile.publicUrl}`);
    });
    console.log('');
  }

  /**
   * @param {string} verb
   * @param {!Array<!CbtUserAgent>} userAgents
   * @private
   */
  logTargetUserAgents_(verb, userAgents) {
    if (userAgents.length === 0) {
      return;
    }

    const num = userAgents.length;
    const plural = num === 1 ? '' : 's';

    console.log(`${verb} ${num} user agent${plural}:`);
    userAgents.forEach((userAgent) => {
      console.log(`  - ${userAgent.alias} -> ${userAgent.fullCbtApiName}`);
    });
    console.log('');
  }

  /**
   * @param {!Array<!UploadableTestCase>} runnableTestCases
   * @private
   */
  logCaptureAllPagesSuccess_(runnableTestCases) {
    console.log('\n\nDONE capturing screenshot images!\n\n');

    runnableTestCases.forEach((testCase) => {
      console.log(`${testCase.htmlFile.publicUrl}:`);
      testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
        console.log(`  - ${screenshotImageFile.publicUrl}`);
      });
      console.log('');
    });
  }
}

module.exports = Controller;
