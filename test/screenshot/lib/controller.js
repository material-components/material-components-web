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

const fs = require('fs');
const glob = require('glob');
const request = require('request-promise-native');
const util = require('util');

const Screenshot = require('./screenshot');
const {Storage, UploadableFile, UploadableTestCase} = require('./storage');

const readFileAsync = util.promisify(fs.readFile);

/**
 * High-level screenshot workflow controller that provides composable async methods to:
 * 1. Upload files to GCS
 * 2. Capture screenshots with CBT
 * 3. [COMING SOON] Update local golden.json with new screenshot URLs
 * 4. [COMING SOON] Diff captured screenshots against existing golden.json
 */
class Controller {
  /**
   * @param {string} sourceDir Relative or absolute path to the local `test/screenshot/` directory.
   */
  constructor({sourceDir}) {
    /**
     * @type {string}
     * @private
     */
    this.sourceDir_ = sourceDir;

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
  }

  async initialize() {
    this.baseUploadDir_ = await this.storage_.generateUniqueUploadDir();
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
    const uploadPromises = assetFileRelativePaths.map((path) => {
      return this.uploadOneAsset_(path, testCases);
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
      destinationParentDirectory: `${this.baseUploadDir_}/assets`,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await readFileAsync(`${this.sourceDir_}/${assetFileRelativePath}`),
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
    const isHtmlFile = assetFile.destinationRelativeFilePath.endsWith('.html');
    if (isHtmlFile) {
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
    const sanitize = (apiName) => apiName.toLowerCase().replace(/\W+/g, '');

    const os = sanitize(cbtResult.os.api_name);
    const browser = sanitize(cbtResult.browser.api_name);
    const imageName = `${os}_${browser}_ltr.png`;

    const imageData = await this.downloadImage_(cbtResult.images.chromeless);
    const imageFile = new UploadableFile({
      destinationParentDirectory: `${this.baseUploadDir_}/screenshots`,
      destinationRelativeFilePath: `${testCase.htmlFile.destinationRelativeFilePath}/${imageName}`,
      fileContent: imageData,
    });

    testCase.screenshotImageFiles.push(imageFile);

    return this.storage_.uploadFile(imageFile);
  }

  /**
   * @param {string} uri
   * @return {!Promise<!Buffer>}
   * @private
   */
  async downloadImage_(uri) {
    // For binary data, set `encoding: null` to return the response body as a `Buffer` instead of a `string`.
    // https://github.com/request/request#requestoptions-callback
    return request({uri, encoding: null})
      .then(
        (body) => body,
        (err) => {
          console.error(`FAILED to download "${uri}"`);
          return Promise.reject(err);
        }
      );
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
