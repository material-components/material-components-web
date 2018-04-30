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

const fs = require('mz/fs');
const fsx = require('fs-extra');
const os = require('os');
const path = require('path');
const request = require('request-promise-native');

/**
 * Downloads image files from public URLs and saves them to a stable path in the TEMP directory for later retrieval.
 */
class ImageCache {
  constructor() {
    /**
     * @type {string}
     * @private
     */
    this.tempDirPath_ = path.join(os.tmpdir(), 'mdc-web-image-cache');
  }

  /**
   * @param {string} uri
   * @return {!Promise<!Buffer>}
   */
  async getImageBuffer(uri) {
    await fsx.ensureDir(this.tempDirPath_);

    const imageFileName = this.getFilename_(uri);
    const imageFilePath = path.join(this.tempDirPath_, imageFileName);

    if (await fs.exists(imageFilePath)) {
      return await fs.readFile(imageFilePath);
    }

    const imageData = await this.downloadImage_(uri);

    fs.writeFile(imageFilePath, imageData)
      .catch(async (err) => {
        console.error(`getImageBuffer("${uri}"):`);
        console.error(err);
        if (await fs.exists(imageFilePath)) {
          await fs.unlink(imageFilePath);
        }
        return Promise.reject(err);
      });

    return imageData;
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
   * @param {string} uri
   * @return {string}
   * @private
   */
  getFilename_(uri) {
    return uri
      .replace(/[^a-zA-Z0-9_.-]+/g, '_')
      .replace(/_{2,}/g, '_')
    ;
  }
}

module.exports = ImageCache;
