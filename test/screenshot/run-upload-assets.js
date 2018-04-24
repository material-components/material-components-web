/**
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
const path = require('path');
const util = require('util');

const Storage = require('./lib/storage');

const SCREENSHOT_TEST_DIR_RELATIVE_PATH = 'test/screenshot/';
const SCREENSHOT_TEST_DIR_ABSOLUTE_PATH = path.resolve(SCREENSHOT_TEST_DIR_RELATIVE_PATH);

const readFileAsync = util.promisify(fs.readFile);

captureAllScreenshots();

async function captureAllScreenshots() {
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
   * List of public URLs to uploaded HTML files.
   * @type {!Array<string>}
   */
  const htmlFileUrls = [];

  return uploadAllAssets();

  async function uploadAllAssets() {
    const uploadPromises = assetFileRelativePaths.map(uploadOneAsset);
    const allDonePromise = Promise.all(uploadPromises);
    allDonePromise.then(logHtmlFiles);
    return allDonePromise;
  }

  async function uploadOneAsset(assetFileRelativePath) {
    return storage
      .uploadFile({
        uploadDir: `${uploadDir}assets/`,
        relativeGcsFilePath: assetFileRelativePath,
        fileContents: await readFileAsync(`${SCREENSHOT_TEST_DIR_ABSOLUTE_PATH}/${assetFileRelativePath}`),
      })
      .then(
        handleOneAssetUploadSuccess,
        handleOneAssetUploadFailure
      );
  }

  function handleOneAssetUploadSuccess(assetFile) {
    if (assetFile.relativePath.endsWith('.html')) {
      htmlFileUrls.push(assetFile.fullUrl);
    }
  }

  function handleOneAssetUploadFailure(err) {
    return Promise.reject(err);
  }

  function logHtmlFiles() {
    console.log('\n\nDONE!\n\n');
    console.log(htmlFileUrls.concat().sort().join('\n'));
  }
}
