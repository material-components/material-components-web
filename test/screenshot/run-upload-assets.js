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

const {Storage, UploadableFile} = require('./lib/storage');

const SCREENSHOT_TEST_DIR_RELATIVE_PATH = 'test/screenshot/';
const SCREENSHOT_TEST_DIR_ABSOLUTE_PATH = path.resolve(SCREENSHOT_TEST_DIR_RELATIVE_PATH);

const readFileAsync = util.promisify(fs.readFile);

run();

async function run() {
  const storage = new Storage();

  /**
   * Unique timestamped directory path to prevent collisions between developers.
   * @type {string}
   */
  const baseUploadDir = await storage.generateUniqueUploadDir();

  /**
   * @type {!Array<string>}
   */
  const htmlFileUrls = [];

  return uploadAllAssets();

  /**
   * @return {!Promise<!Array<string>>}
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
          logHtmlFiles();
          return htmlFileUrls;
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
      destinationParentDirectory: `${baseUploadDir}/assets`,
      destinationRelativeFilePath: assetFileRelativePath,
      fileContent: await readFileAsync(`${SCREENSHOT_TEST_DIR_ABSOLUTE_PATH}/${assetFileRelativePath}`),
    });

    const uploadPromise = storage.uploadFile(assetFile);

    return uploadPromise.then(
      () => handleOneAssetUploadSuccess(assetFile),
      (err) => handleOneAssetUploadFailure(err)
    );
  }

  /**
   * @param {!UploadableFile} assetFile
   * @return {!Promise<!UploadableFile>}
   */
  function handleOneAssetUploadSuccess(assetFile) {
    const isHtmlFile = assetFile.destinationRelativeFilePath.endsWith('.html');
    if (isHtmlFile) {
      htmlFileUrls.push(assetFile.publicUrl);
    }
    return Promise.resolve(assetFile);
  }

  /**
   * @param {T} err
   * @return {!Promise<T>}
   * @template T
   */
  function handleOneAssetUploadFailure(err) {
    return Promise.reject(err);
  }

  function logHtmlFiles() {
    console.log('\n\nDONE!\n\n');
    console.log(htmlFileUrls.concat().sort().join('\n'));
  }
}
