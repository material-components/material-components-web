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

const childProcess = require('child_process');
const fs = require('mz/fs');
const glob = require('glob');

const CbtUserAgent = require('./cbt-user-agent');
const CliArgParser = require('./cli-arg-parser');
const ImageCache = require('./image-cache');
const ImageCropper = require('./image-cropper');
const ImageDiffer = require('./image-differ');
const ReportGenerator = require('./report-generator');
const Screenshot = require('./screenshot');
const SnapshotStore = require('./snapshot-store');
const {Storage, UploadableFile, UploadableTestCase} = require('./storage');

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
     * @type {!Storage}
     * @private
     */
    this.storage_ = new Storage();

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

  async initialize() {
    this.baseUploadDir_ = await this.storage_.generateUniqueUploadDir();

    if (await this.cliArgs_.shouldBuild()) {
      childProcess.spawnSync('npm', ['run', 'screenshot:build'], {shell: true, stdio: 'inherit'});
    }
  }

  /**
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async uploadAllAssets() {
    /** @type {!Array<!UploadableTestCase>} */
    const testCases = [];

    /**
     * Relative paths of all asset files (HTML, CSS, JS) that will be uploaded.
     * @type {!Array<string>}
     */
    const assetFileRelativePaths = glob.sync('**/*', {cwd: this.cliArgs_.testDir, nodir: true});

    /** @type {!Array<!Promise<!UploadableFile>>} */
    const uploadPromises = assetFileRelativePaths.map((assetFileRelativePath, assetFileIndex) => {
      return this.uploadOneAsset_(assetFileRelativePath, testCases, assetFileIndex, assetFileRelativePaths.length);
    });

    return Promise.all(uploadPromises)
      .then(
        () => {
          this.logUploadAllAssetsSuccess_(testCases);
          return testCases;
        },
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {string} assetFileRelativePath
   * @param {!Array<!UploadableTestCase>} testCases
   * @param {number} queueIndex
   * @param {number} queueLength
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async uploadOneAsset_(assetFileRelativePath, testCases, queueIndex, queueLength) {
    const assetFile = new UploadableFile({
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await fs.readFile(`${this.cliArgs_.testDir}/${assetFileRelativePath}`),
      queueIndex,
      queueLength,
    });

    return this.storage_.uploadFile(assetFile)
      .then(
        () => this.handleUploadOneAssetSuccess_(assetFile, testCases),
        (err) => this.handleUploadOneAssetFailure_(err)
      );
  }

  /**
   * @param {!UploadableFile} assetFile
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async handleUploadOneAssetSuccess_(assetFile, testCases) {
    const relativePath = assetFile.destinationRelativeFilePath;
    const isHtmlFile = relativePath.endsWith('.html');
    const isIncluded =
      this.cliArgs_.includeUrlPatterns.length === 0 ||
      this.cliArgs_.includeUrlPatterns.some((pattern) => pattern.test(relativePath));
    const isExcluded = this.cliArgs_.excludeUrlPatterns.some((pattern) => pattern.test(relativePath));
    const shouldInclude = isIncluded && !isExcluded;

    if (isHtmlFile && shouldInclude) {
      testCases.push(new UploadableTestCase({htmlFile: assetFile}));
    }

    return assetFile;
  }

  /**
   * @param {!T} err
   * @return {!Promise<!T>}
   * @template T
   * @private
   */
  async handleUploadOneAssetFailure_(err) {
    return Promise.reject(err);
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async captureAllPages(testCases) {
    const capturePromises = testCases.map((testCase, testCaseIndex) => {
      return this.captureOnePage_(testCase, testCaseIndex, testCases.length);
    });

    return Promise.all(capturePromises)
      .then(
        () => {
          this.logCaptureAllPagesSuccess_(testCases);
          return testCases;
        },
        (err) => Promise.reject(err)
      );
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
    console.error(`  - Test case ${testCaseQueueIndex} of ${testCaseQueueLength}`);
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

    const imageName = `${osApiName}_${browserApiName}.png`.toLowerCase().replace(/[^\w.]+/g, '');
    const imageData = await this.downloadAndCropImage_(cbtImageUrl);
    const imageFile = new UploadableFile({
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: `${testCase.htmlFile.destinationRelativeFilePath}.${imageName}`,
      fileContent: imageData,
      userAgent: await CbtUserAgent.fetchBrowserByApiName(osApiName, browserApiName),
      queueIndex: uploadQueueIndex,
      queueLength: uploadQueueLength,
    });

    testCase.screenshotImageFiles.push(imageFile);

    return this.storage_.uploadFile(imageFile);
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
   * Writes the given `testCases` to a `golden.json` file.
   * If the file already exists, it will be overwritten.
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async updateGoldenJson({testCases}) {
    const jsonData = await this.snapshotStore_.fromTestCases(testCases);
    await this.snapshotStore_.writeToDisk(jsonData);
    return testCases;
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<{diffs: !Array<!ImageDiffJson>, testCases: !Array<!UploadableTestCase>}>}
   */
  async diffGoldenJson(testCases) {
    /** @type {!Array<!ImageDiffJson>} */
    const diffs = await this.imageDiffer_.compareAllPages({
      actualSuite: await this.snapshotStore_.fromTestCases(testCases),
      expectedSuite: await this.snapshotStore_.fromDiffBase(),
    });

    return Promise.all(diffs.map((diff, index) => this.uploadOneDiffImage_(diff, index, diffs.length)))
      .then(
        () => {
          diffs.sort((a, b) => {
            return a.htmlFilePath.localeCompare(b.htmlFilePath, 'en-US') ||
              a.browserKey.localeCompare(b.browserKey, 'en-US');
          });
          console.log('\n\nDONE diffing screenshot images!\n\n');
          console.log(diffs);
          console.log(`\n\nFound ${diffs.length} screenshot diffs!\n\n`);
          return {diffs, testCases};
        },
        (err) => Promise.reject(err)
      )
    ;
  }

  /**
   * @param {!ImageDiffJson} diff
   * @param {number} queueIndex
   * @param {number} queueLength
   * @return {!Promise<void>}
   * @private
   */
  async uploadOneDiffImage_(diff, queueIndex, queueLength) {
    /** @type {!UploadableFile} */
    const diffImageFile = await this.storage_.uploadFile(new UploadableFile({
      destinationParentDirectory: `${this.baseUploadDir_}/screenshots`,
      destinationRelativeFilePath: `${diff.htmlFilePath}/${diff.browserKey}.diff.png`,
      fileContent: diff.diffImageBuffer,
      queueIndex,
      queueLength,
    }));

    diff.diffImageUrl = diffImageFile.publicUrl;
    diff.diffImageBuffer = null; // free up memory
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @param {!Array<!ImageDiffJson>} diffs
   * @return {!Promise<string>}
   */
  async uploadDiffReport({testCases, diffs}) {
    const reportGenerator = new ReportGenerator({testCases, diffs});

    /** @type {!UploadableFile} */
    const reportFile = await this.storage_.uploadFile(new UploadableFile({
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: 'report.html',
      fileContent: await reportGenerator.generateHtml(),
      queueIndex: 0,
      queueLength: 1,
    }));

    console.log('\n\nDONE uploading diff report to GCS!\n\n');
    console.log(reportFile.publicUrl);

    return reportFile.publicUrl;
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @private
   */
  logUploadAllAssetsSuccess_(testCases) {
    const publicHtmlFileUrls = testCases.map((testCase) => testCase.htmlFile.publicUrl).sort();
    console.log('\n\nDONE uploading asset files to GCS!\n\n');
    console.log(publicHtmlFileUrls.join('\n'));
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @private
   */
  logCaptureAllPagesSuccess_(testCases) {
    console.log('\n\nDONE capturing screenshot images!\n\n');

    testCases.forEach((testCase) => {
      console.log(`${testCase.htmlFile.publicUrl}:`);
      testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
        console.log(`  - ${screenshotImageFile.publicUrl}`);
      });
      console.log('');
    });
  }
}

module.exports = Controller;
