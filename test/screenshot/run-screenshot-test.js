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

const SCREENSHOT_TEST_DIR_RELATIVE_PATH = 'test/screenshot/';
const SCREENSHOT_TEST_DIR_ABSOLUTE_PATH = path.resolve(SCREENSHOT_TEST_DIR_RELATIVE_PATH);

const readFileAsync = util.promisify(fs.readFile);

runScreenshotTests();

async function runScreenshotTests() {
  const storage = new Storage();

  /**
   * Unique timestamped directory path to prevent collisions between developers.
   * @type {string}
   */
  const uploadDir = await storage.generateUniqueUploadDir();

  /**
   * Relative paths of all files to be uploaded as assets (HTML, CSS, JS).
   * @type {!Array<string>}
   */
  const assetFileRelativePaths = glob.sync('**/*', {cwd: SCREENSHOT_TEST_DIR_ABSOLUTE_PATH, nodir: true});

  /**
   * Map of `assetFileRelativePath` to `Object`.
   * @type {Map<string, {file, screenshots}>}
   */
  const screenshotMap = new Map();

  return uploadAllAssets();

  async function uploadAllAssets() {
    const uploadPromises = assetFileRelativePaths.map(uploadOneAsset);
    const allDonePromise = Promise.all(uploadPromises);
    allDonePromise.then(logCapturedScreenshots);
    return allDonePromise;
  }

  async function uploadOneAsset(assetFileRelativePath) {
    screenshotMap.set(assetFileRelativePath, {file: null, screenshots: []});
    return storage
      .uploadFile({
        uploadDir: `${uploadDir}assets/`,
        relativeGcsFilePath: assetFileRelativePath,
        fileContents: await readFileAsync(`${SCREENSHOT_TEST_DIR_ABSOLUTE_PATH}/${assetFileRelativePath}`),
      })
      .then(
        handleUploadOneAssetSuccess,
        handleUploadOneAssetFailure
      );
  }

  function handleUploadOneAssetSuccess(assetFile) {
    screenshotMap.set(assetFile.relativePath, {file: assetFile, screenshots: []});
    if (assetFile.relativePath.endsWith('.html')) {
      return capturePage(assetFile);
    }
    return Promise.resolve(assetFile);
  }

  function handleUploadOneAssetFailure(err) {
    return Promise.reject(err);
  }

  function capturePage(assetFile) {
    return Screenshot
      .captureOneUrl(assetFile.fullUrl)
      .then(
        (screenshotInfo) => handleCapturePageSuccess(assetFile, screenshotInfo),
        (err) => handleCapturePageFailure(assetFile, err)
      );
  }

  async function handleCapturePageSuccess(assetFile, screenshotInfo) {
    const screenshots = [];

    screenshotMap.set(assetFile.relativePath, {file: assetFile, screenshots: screenshots});

    // We don't use CBT's screenshot versioning features, so there should only ever be one version.
    // Each "result" is an individual browser screenshot for a single URL.
    const imageUploadPromises = screenshotInfo.versions[0].results.map((cbtResult) => {
      return uploadScreenshotImage(assetFile, cbtResult);
    });

    imageUploadPromises.forEach((imageUploadPromise) => {
      imageUploadPromise.then((imageFile) => screenshots.push(imageFile));
    });

    return Promise.all(imageUploadPromises);
  }

  function handleCapturePageFailure(assetFile, err) {
    console.error('\n\n\nERROR capturing screenshot with CrossBrowserTesting:\n\n');
    console.error(`  - ${assetFile.fullUrl}`);
    console.error(err);
  }

  async function uploadScreenshotImage(assetFile, cbtResult) {
    const sanitize = (apiName) => apiName.toLowerCase().replace(/\W+/g, '');

    const os = sanitize(cbtResult.os.api_name);
    const browser = sanitize(cbtResult.browser.api_name);
    const imageName = `${os}_${browser}_ltr.png`;
    const imageData = await downloadImage(cbtResult.images.chromeless);

    return storage
      .uploadFile({
        uploadDir: `${uploadDir}screenshots/`,
        relativeGcsFilePath: `${assetFile.relativePath}/${imageName}`,
        fileContents: imageData,
      });
  }

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

  function logCapturedScreenshots() {
    console.log('');
    screenshotMap.forEach((assetFileData, relativeAssetFilePath) => {
      if (relativeAssetFilePath.endsWith('.html')) {
        console.log(`${assetFileData.file.fullUrl}:`);
        assetFileData.screenshots.forEach((imageFile) => {
          console.log(`  - ${imageFile.fullUrl}`);
        });
        console.log('');
      }
    });
  }
}
