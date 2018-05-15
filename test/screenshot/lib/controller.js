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
const glob = require('glob');
const path = require('path');

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
  /**
   * @param {string} sourceDir Relative path to the local `test/screenshot/` directory, relative to Node's $PWD.
   */
  constructor({sourceDir}) {
    /**
     * @type {string}
     * @private
     */
    this.sourceDir_ = sourceDir;

    /**
     * @type {string}
     * @private
     */
    this.goldenJsonFilePath_ = path.join(this.sourceDir_, 'golden.json');

    /**
     * @type {!Storage}
     * @private
     */
    this.storage_ = new Storage();

    /**
     * Unique timestamped directory path to prevent collisions between developers.
     * @type {?string}
     * @private
     */
    this.baseUploadDir_ = null;

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
  }

  async initialize() {
    this.baseUploadDir_ = await this.storage_.generateUniqueUploadDir();
    this.cliArgs_ = new CliArgParser();
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
    const assetFileRelativePaths = glob.sync('**/*', {cwd: this.sourceDir_, nodir: true});

    /** @type {!Array<!Promise<!UploadableFile>>} */
    const uploadPromises = assetFileRelativePaths.map((assetFileRelativePath) => {
      return this.uploadOneAsset_(assetFileRelativePath, testCases);
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
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async uploadOneAsset_(assetFileRelativePath, testCases) {
    const assetFile = new UploadableFile({
      destinationParentDirectory: this.baseUploadDir_,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await fs.readFile(`${this.sourceDir_}/${assetFileRelativePath}`),
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
    const capturePromises = testCases.map((testCase) => {
      return this.captureOnePage_(testCase);
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
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async captureOnePage_(testCase) {
    return Screenshot
      .captureOneUrl(testCase.htmlFile.publicUrl)
      .then(
        (cbtInfo) => this.handleCapturePageSuccess_(testCase, cbtInfo),
        (err) => this.handleCapturePageFailure_(testCase, err)
      );
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!Object} cbtScreenshotInfo
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async handleCapturePageSuccess_(testCase, cbtScreenshotInfo) {
    // We don't use CBT's screenshot versioning features, so there should only ever be one version.
    // Each "result" is an individual browser screenshot for a single URL.
    return Promise.all(cbtScreenshotInfo.versions[0].results.map((cbtResult) => {
      return this.uploadScreenshotImage_(testCase, cbtResult);
    }));
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!T} err
   * @return {!Promise<!T>}
   * @template T
   * @private
   */
  async handleCapturePageFailure_(testCase, err) {
    console.error('\n\n\nERROR capturing screenshot with CrossBrowserTesting:\n\n');
    console.error(`  - ${testCase.htmlFile.publicUrl}`);
    console.error(err);
    return Promise.reject(err);
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @param {!Object} cbtResult
   * @return {!Promise<!UploadableFile>}
   * @private
   */
  async uploadScreenshotImage_(testCase, cbtResult) {
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
   * Writes the given `testCases` to a `golden.json` file in `sourceDir_`.
   * If the file already exists, it will be overwritten.
   * @param {!Array<!UploadableTestCase>} testCases
   * @param {string} diffReportUrl
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async updateGoldenJson({testCases, diffReportUrl}) {
    const snapshotStore = await SnapshotStore.fromTestCases(testCases);
    await snapshotStore.writeToDisk({jsonFilePath: this.goldenJsonFilePath_, diffReportUrl});
    return testCases;
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<{diffs: !Array<!ImageDiffJson>, testCases: !Array<!UploadableTestCase>}>}
   */
  async diffGoldenJson(testCases) {
    /** @type {!Array<!ImageDiffJson>} */
    const diffs = await this.imageDiffer_.compareAllPages({
      actualStore: await SnapshotStore.fromTestCases(testCases),
      expectedStore: await SnapshotStore.fromMaster(this.goldenJsonFilePath_),
    });

    return Promise.all(diffs.map((diff) => this.uploadOneDiffImage_(diff)))
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
   * @return {!Promise<void>}
   * @private
   */
  async uploadOneDiffImage_(diff) {
    /** @type {!UploadableFile} */
    const diffImageFile = await this.storage_.uploadFile(new UploadableFile({
      destinationParentDirectory: `${this.baseUploadDir_}/screenshots`,
      destinationRelativeFilePath: `${diff.htmlFilePath}/${diff.browserKey}.diff.png`,
      fileContent: diff.diffImageBuffer,
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
