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
 * High-level screenshot test executor with composable methods to:
 * 1. Upload files to GCS
 * 2. Capture screenshots with CBT
 * 3. [SOON] Write captured screenshot URLs to a golden.json file
 * 4. [SOON] Diff captured screenshots against the existing golden.json file
 */
class Controller {
  /**
   * @param {string} sourceDir Relative or absolute path to the local `test/screenshot/` directory.
   */
  constructor({sourceDir}) {
    /** @type {string} */
    this.sourceDir_ = sourceDir;

    /** @type {!Storage} */
    this.storage = new Storage();

    /** @type {!Array<!UploadableTestCase>} */
    this.testCases = [];

    /** @type {?string} */
    this.baseUploadDir_ = null;
  }

  /**
   * @return {!Promise<!Array<!UploadableTestCase>>}
   */
  async uploadAllAssets() {
    if (this.testCases.length > 0) {
      throw new Error('Controller cannot be started more than once');
    }

    /**
     * Relative paths of all asset files (HTML, CSS, JS) that will be uploaded.
     * @type {!Array<string>}
     */
    const assetFileRelativePaths = glob.sync('**/*', {cwd: this.sourceDir_, nodir: true});

    return Promise.all(assetFileRelativePaths.map((path) => this.uploadOneAsset(path)))
      .then(
        () => this.logTestCases_(),
        (err) => Promise.reject(err)
      )
      .then(
        () => this.testCases,
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {string} assetFileRelativePath
   * @return {!Promise<!UploadableFile>}
   */
  async uploadOneAsset(assetFileRelativePath) {
    const baseUploadDir = await this.getBaseUploadDir_();
    const assetFile = new UploadableFile({
      destinationParentDirectory: `${baseUploadDir}/assets`,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await readFileAsync(`${this.sourceDir_}/${assetFileRelativePath}`),
    });

    return this.storage.uploadFile(assetFile)
      .then(
        () => this.handleUploadOneAssetSuccess_(assetFile),
        (err) => this.handleUploadOneAssetFailure_(err)
      )
      .then(
        () => assetFile,
        (err) => this.handleUploadOneAssetFailure_(err)
      );
  }

  /**
   * @param {!UploadableFile} assetFile
   * @return {!Promise<!Array<!UploadableFile>>}
   * @private
   */
  async handleUploadOneAssetSuccess_(assetFile) {
    const isHtmlFile = assetFile.destinationRelativeFilePath.endsWith('.html');
    if (isHtmlFile) {
      const testCase = new UploadableTestCase({htmlFile: assetFile});
      this.testCases.push(testCase);
    }
    return Promise.resolve(assetFile);
  }

  /**
   * @param {T} err
   * @return {!Promise<T>}
   * @template T
   * @private
   */
  async handleUploadOneAssetFailure_(err) {
    return Promise.reject(err);
  }

  /**
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!Array<!Array<!UploadableFile>>>}
   */
  async captureAllPages(testCases) {
    return Promise.all(testCases.map((testCase) => this.captureOnePage(testCase)));
  }

  /**
   * @param {!UploadableTestCase} testCase
   * @return {!Promise<!Array<!UploadableFile>>}
   */
  async captureOnePage(testCase) {
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
   * @param {T} err
   * @return {!Promise<T>}
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

    const baseUploadDir = await this.getBaseUploadDir_();
    const imageData = await this.downloadImage_(cbtResult.images.chromeless);
    const imageFile = new UploadableFile({
      destinationParentDirectory: `${baseUploadDir}/screenshots`,
      destinationRelativeFilePath: `${testCase.htmlFile.destinationRelativeFilePath}/${imageName}`,
      fileContent: imageData,
    });

    testCase.screenshotImageFiles.push(imageFile);

    return this.storage.uploadFile(imageFile);
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
   * Unique timestamped directory path to prevent collisions between developers.
   * @type {string}
   * @return {!Promise<string>}
   * @private
   */
  async getBaseUploadDir_() {
    return this.baseUploadDir_ || (this.baseUploadDir_ = await this.storage.generateUniqueUploadDir());
  }

  /** @private */
  logTestCases_() {
    console.log('\n\nDONE!\n\n');

    this.testCases.forEach((testCase) => {
      console.log(`${testCase.htmlFile.publicUrl}:`);
      testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
        console.log(`  - ${screenshotImageFile.publicUrl}`);
      });
      console.log('');
    });
  }
}

module.exports = Controller;
