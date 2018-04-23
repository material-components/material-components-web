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

  // Every batch of files gets uploaded to a unique timestamped directory to prevent collisions between developers.
  const uploadDir = await storage.generateUniqueUploadDir();

  /** @type {!Array<string>} */
  const assetFileRelativePaths = glob.sync('**/*', {cwd: SCREENSHOT_TEST_DIR_ABSOLUTE_PATH, nodir: true});

  const screenshotMap = new Map();

  const promises = assetFileRelativePaths.map(async (assetFileRelativePath) => {
    screenshotMap.set(assetFileRelativePath, {file: null, screenshots: []});

    const assetFileAbsolutePath = path.join(SCREENSHOT_TEST_DIR_ABSOLUTE_PATH, assetFileRelativePath);

    return storage
      .uploadFile({
        uploadDir: `${uploadDir}assets/`,
        relativeGcsFilePath: assetFileRelativePath,
        fileContents: await readFileAsync(assetFileAbsolutePath),
      })
      .then(
        handleAssetUploadSuccess,
        handleAssetUploadFailure
      );
  });

  Promise.all(promises)
    .then(
      (assetFiles) => {
        console.log('');
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
        console.log('');
        console.log('');
      },
      (err) => {
        return Promise.reject(err);
      }
    );

  let numHtmlFiles = 0;

  return promises;

  function handleAssetUploadSuccess(assetFile) {
    screenshotMap.set(assetFile.relativePath, {file: assetFile, screenshots: []});

    if (assetFile.relativePath.endsWith('.html')) {
      if (numHtmlFiles > 0) {
        // return Promise.resolve(assetFile);
      }

      numHtmlFiles++;

      return Screenshot
        .captureOneUrl(assetFile.fullUrl)
        .then(
          (screenshotInfo) => handleScreenshotCaptureSuccess(assetFile, screenshotInfo),
          (err) => handleScreenshotCaptureFailure(assetFile, err)
        );
    }

    return Promise.resolve(assetFile);
  }

  function handleAssetUploadFailure(err) {
    console.error('\n\nERROR uploading HTML/CSS/JS assets to Google Cloud Storage!\n\n');
    console.error(err);
  }

  async function handleScreenshotCaptureSuccess(assetFile, screenshotInfo) {
    const screenshots = [];

    screenshotMap.set(assetFile.relativePath, {file: assetFile, screenshots: screenshots});

    // We don't use CBT's screenshot versioning features, so there should only ever be one version.
    // Each "result" is an individual browser screenshot for a single URL.
    return Promise.all(
      screenshotInfo.versions[0].results.map(async (result) => {
        const imageName =
          `${result.os.api_name}_${result.browser.api_name}_ltr`
            .toLowerCase()
            .replace(/\W+/g, '');
        const imageFileName = `${imageName}.png`;

        return (
          storage
            .uploadFile({
              uploadDir: `${uploadDir}screenshots/`,
              relativeGcsFilePath: `${assetFile.relativePath}/${imageFileName}`,
              fileContents: await downloadImage(result.images.chromeless),
            })
            .then(
              (imageFile) => {
                screenshots.push(imageFile);
                return imageFile;
              },
              (err) => Promise.reject(err)
            )
        );
      })
    );
  }

  function handleScreenshotCaptureFailure(assetFile, err) {
    console.error('\n\n\nERROR capturing screenshot with CrossBrowserTesting:\n\n');
    console.error(`  - ${assetFile.fullUrl}`);
    console.error(err);
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
}
