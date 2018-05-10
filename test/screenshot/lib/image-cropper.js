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
   * Automatically crops an image based on its background color.
   * @param {!Buffer} imageData Uncropped image buffer
   * @return {!Promise<!Buffer>} Cropped image buffer
   */
  async autoCropImage(imageData) {
    return jimp.read(imageData)
      .then(
        (image) => {
          return new Promise((resolve, reject) => {
            const {rows, cols} = this.getCropMatches_(image);
            const cropRect = this.getCropRect_({rows, cols});
            const {x, y, w, h} = cropRect;

            image
              .crop(x, y, w, h)
              .getBuffer(jimp.MIME_PNG, (err, buffer) => {
                return err ? reject(err) : resolve(buffer);
              })
            ;
          });
        },
        (err) => Promise.reject(err)
      );
  }

  /**
   * @param {!Jimp} jimpImage
   * @return {{rows: !Array<!Array<boolean>, cols: !Array<!Array<boolean>}}
   * @private
   */
  getCropMatches_(jimpImage) {
    const trimColors = [0x333333FF];
    const rows = [];
    const cols = [];

    jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, (x, y) => {
      if (!rows[y]) {
        rows[y] = [];
      }
      if (!cols[x]) {
        cols[x] = [];
      }
      const isMatch = trimColors.includes(jimpImage.getPixelColor(x, y));
      rows[y][x] = isMatch;
      cols[x][y] = isMatch;
    });

    return {rows, cols};
  }

  /**
   * @param {!Array<!Array<boolean>>} rows
   * @param {!Array<!Array<boolean>>} cols
   * @return {{x: number, y: number, w: number, h: number}}
   * @private
   */
  getCropRect_({rows, cols}) {
    const HIGH_MATCH_PERCENTAGE = 0.95;
    const LOW_MATCH_PERCENTAGE = 0.67;

    const amounts = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    for (const row of rows) {
      if (matchPercentage(row) > HIGH_MATCH_PERCENTAGE) {
        amounts.top++;
      } else {
        break;
      }
    }

    // `reverse()` mutates the array in-place, so we call `concat()` first to create a copy of the array.
    for (const row of rows.concat().reverse()) {
      if (matchPercentage(row) > HIGH_MATCH_PERCENTAGE) {
        amounts.bottom++;
      } else {
        break;
      }
    }


    for (const col of cols) {
      if (matchPercentage(skipCroppedRows(col)) > HIGH_MATCH_PERCENTAGE) {
        amounts.left++;
      } else {
        break;
      }
    }

    /* eslint-disable max-len */
    // `reverse()` mutates the array in-place, so we call `concat()` first to create a copy of the array.
    for (const col of cols.concat().reverse()) {
      // Use a lower match percentage on the right side of the image in order to crop Edge popovers:
      // https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/05/08/20_40_45_142/c6cc25f87/mdc-button/classes/baseline.html.win10e17_edge17.png
      if (matchPercentage(skipCroppedRows(col)) > LOW_MATCH_PERCENTAGE) {
        amounts.right++;
      } else {
        break;
      }
    }
    /* eslint-enable max-len */

    return {
      x: amounts.left,
      y: amounts.top,
      w: cols.length - amounts.right - amounts.left,
      h: rows.length - amounts.bottom - amounts.top,
    };

    function skipCroppedRows(col) {
      const startRowIndex = amounts.top;
      const endRowIndex = rows.length - amounts.bottom;
      return col.slice(startRowIndex, endRowIndex);
    }

    function matchPercentage(matchList) {
      const numMatchingPixelsInRow = matchList.filter((isMatch) => isMatch).length;
      return numMatchingPixelsInRow / matchList.length;
    }
  }
}

module.exports = ImageCropper;
