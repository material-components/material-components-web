/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const request = require('request-promise-native');
const util = require('util');

const Screenshot = require('./lib/screenshot');
const Storage = require('./lib/storage');
const {TestCase, UploadableFile} = require('./lib/status');

const SCREENSHOT_TEST_DIR_RELATIVE_PATH = 'test/screenshot/';
const SCREENSHOT_TEST_DIR_ABSOLUTE_PATH = path.resolve(SCREENSHOT_TEST_DIR_RELATIVE_PATH);

const readFileAsync = util.promisify(fs.readFile);

runScreenshotTests();

async function runScreenshotTests() {
  const testCases = [];
  const storage = new Storage();

  /**
   * Unique timestamped directory path to prevent collisions between developers.
   * @type {string}
   */
  const baseUploadDir = await storage.generateUniqueUploadDir();

  return uploadAllAssets();

  /**
   * @return {!Promise<!Array<!TestCase>>}
   */
  async function uploadAllAssets() {
    /**
     * Relative paths of all asset files (HTML, CSS, JS) that will be uploaded.
     * @type {!Array<string>}
     */
    const assetFileRelativePaths = glob.sync('**/*', {cwd: SCREENSHOT_TEST_DIR_ABSOLUTE_PATH, nodir: true});

    return Promise.all(assetFileRelativePaths.map(uploadOneAsset))
      .then(
        () => {
          logTestCases();
          return testCases;
        },
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {string} assetFileRelativePath
   * @return {!Promise<!UploadableFile>}
   */
  async function uploadOneAsset(assetFileRelativePath) {
    const assetFile = new UploadableFile({
      destinationParentDirectory: `${baseUploadDir}assets/`,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await readFileAsync(`${SCREENSHOT_TEST_DIR_ABSOLUTE_PATH}/${assetFileRelativePath}`),
    });
    const isHtmlFile = assetFile.destinationRelativeFilePath.endsWith('.html');
    const uploadPromise = storage.uploadFile(assetFile);

    if (isHtmlFile) {
      const testCase = new TestCase({assetFile});
      testCases.push(testCase);

      return uploadPromise
        .then(
          () => capturePage(testCase),
          (err) => Promise.reject(err)
        )
        .then(
          () => assetFile,
          (err) => Promise.reject(err)
        );
    }

    return uploadPromise
      .then(
        () => assetFile,
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {!TestCase} testCase
   * @return {!Promise<!Array<!UploadableFile>>}
   */
  function capturePage(testCase) {
    /** @type {!UploadableFile} */
    const assetFile = testCase.assetFile;

    return Screenshot
      .captureOneUrl(assetFile.publicUrl)
      .then(
        (cbtInfo) => handleCapturePageSuccess(testCase, cbtInfo),
        (err) => handleCapturePageFailure(testCase, err)
      );
  }

  /**
   * @param {!TestCase} testCase
   * @param {!Object} cbtScreenshotInfo
   * @return {!Promise<!Array<!UploadableFile>>}
   */
  async function handleCapturePageSuccess(testCase, cbtScreenshotInfo) {
    // We don't use CBT's screenshot versioning features, so there should only ever be one version.
    // Each "result" is an individual browser screenshot for a single URL.
    return Promise.all(cbtScreenshotInfo.versions[0].results.map((cbtResult) => {
      return uploadScreenshotImage(testCase, cbtResult);
    }));
  }

  /**
   * @param {!TestCase} testCase
   * @param {*} err
   * @return {!Promise<*>}
   */
  function handleCapturePageFailure(testCase, err) {
    console.error('\n\n\nERROR capturing screenshot with CrossBrowserTesting:\n\n');
    console.error(`  - ${testCase.assetFile.publicUrl}`);
    console.error(err);
    return Promise.reject(err);
  }

  /**
   * @param {!TestCase} testCase
   * @param {!Object} cbtResult
   * @return {!Promise<!UploadableFile>}
   */
  async function uploadScreenshotImage(testCase, cbtResult) {
    const sanitize = (apiName) => apiName.toLowerCase().replace(/\W+/g, '');

    const os = sanitize(cbtResult.os.api_name);
    const browser = sanitize(cbtResult.browser.api_name);
    const imageName = `${os}_${browser}_ltr.png`;
    const imageData = await downloadImage(cbtResult.images.chromeless);

    const assetFile = testCase.assetFile;
    const imageFile = new UploadableFile({
      destinationParentDirectory: `${baseUploadDir}screenshots/`,
      destinationRelativeFilePath: `${assetFile.destinationRelativeFilePath}/${imageName}`,
      fileContent: imageData,
    });

    testCase.screenshotImageFiles.push(imageFile);

    return storage.uploadFile(imageFile);
  }

  /**
   * @param {string} uri
   * @return {!Promise<!Buffer>}
   */
  async function downloadImage(uri) {
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

  function logTestCases() {
    console.log('');

    testCases.forEach((testCase) => {
      /** @type {!UploadableFile} */
      const assetFile = testCase.assetFile;

      if (assetFile.destinationRelativeFilePath.endsWith('.html')) {
        console.log(`${assetFile.publicUrl}:`);
        testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
          console.log(`  - ${screenshotImageFile.publicUrl}`);
        });
        console.log('');
      }
    });
  }
}
