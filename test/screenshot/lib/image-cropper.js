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

const jimp = require('jimp');

class ImageCropper {
  /**
   * @param {!Buffer} imageData Uncropped image buffer
   * @return {!Promise<!Buffer>} Cropped image buffer
   */
  async autoCropImage(imageData) {
    return jimp.read(imageData)
      .then(
        (image) => {
          return new Promise((resolve, reject) => {
            image
              .autocrop()
              .getBuffer(jimp.MIME_PNG, (err, buffer) => {
                return err ? reject(err) : resolve(buffer);
              });
          });
        },
        (err) => Promise.reject(err)
      );
  }
}

module.exports = ImageCropper;
