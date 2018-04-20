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

const AssetUploader = require('./asset-uploader');
const Screenshot = require('./lib/screenshot');

AssetUploader.upload().then(handleUploadSuccess, handleUploadFailure);

function handleUploadSuccess(files) {
  const htmlFileUrls =
    files
      .filter((file) => file.relativePath.endsWith('.html'))
      .map((file) => file.fullUrl)
      .sort();

  console.log('\n\nDONE uploading HTML/CSS/JS assets to Google Cloud Storage!\n\n');
  console.log(htmlFileUrls.join('\n'));
  console.log('');
  console.log('');

  Screenshot.capture(htmlFileUrls)
    .then(
      (screenshotInfos) => {
        console.log('\n\n\nSUCCESS!\n\n');
        screenshotInfos.forEach(logScreenshotInfo);
      },
      (err) => {
        console.error('\n\n\nERROR:\n\n');
        console.error(err);
      }
    );
}

function handleUploadFailure(err) {
  console.error('\n\nERROR uploading HTML/CSS/JS assets to Google Cloud Storage!\n\n');
  console.error(err);
}

function logScreenshotInfo(infoResponseBody) {
  console.log(infoResponseBody.url);

  // We don't use CBT's screenshot versioning features, so there should only ever be one version.
  // Each "result" is an individual browser screenshot for a single URL.
  infoResponseBody.versions[0].results.forEach((result) => {
    logScreenshotInfoResult(result);
  });

  console.log('');
}

function logScreenshotInfoResult(result) {
  console.log(`
  - ${result.os.device} > ${result.os.name} > ${result.browser.name}:
      ${result.images.chromeless}
`.replace(/[\n\r\f]+$/g, ''));
}
