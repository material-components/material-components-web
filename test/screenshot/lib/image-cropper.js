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

const TRIM_COLOR_CSS_VALUE = '#abc123'; // Value must match `$test-trim-color` in `fixture.scss`

class ImageCropper {
  constructor() {
    /**
     * @type {number}
     * @private
     */
    this.trimColorInt_ = ImageCropper.getTrimColorAsInt_();
  }
  /**
   * Automatically crops an image based on its background color.
   * @param {!Buffer} imageData Uncropped image buffer
   * @return {!Promise<!Buffer>} Cropped image buffer
   */
  async autoCropImage(imageData) {
    return jimp.read(imageData)
      .then(
        (jimpImage) => {
          return new Promise((resolve, reject) => {
            const {x, y, w, h} = this.getCropRect_(jimpImage);
            jimpImage
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
   * @return {{x: number, y: number, w: number, h: number}}
   * @private
   */
  getCropRect_(jimpImage) {
    const {rows, cols} = this.findPixelsWithTrimColor_(jimpImage);

    const left = this.getCropAmount_(cols);
    const top = this.getCropAmount_(rows);
    const right = this.getCropAmount_(cols.slice(left).reverse());
    const bottom = this.getCropAmount_(rows.slice(top).reverse());

    const cropAmounts = {
      left,
      top,
      right,
      bottom,
    };

    const rect = {
      x: cropAmounts.left,
      y: cropAmounts.top,
      w: cols.length - cropAmounts.left - cropAmounts.right,
      h: rows.length - cropAmounts.top - cropAmounts.bottom,
    };

    console.log('image rect:', {w: cols.length, h: rows.length});
    console.log('crop rect:', rect);

    return rect;
  }

  getCropAmount_(rows) {
    const MIN_MATCH_PERCENTAGE = 0.05;
    let foundTrimColor = false;

    for (const [rowIndex, row] of rows.entries()) {
      const isTrimColor = this.getMatchPercentage_(row) >= MIN_MATCH_PERCENTAGE;

      if (isTrimColor) {
        foundTrimColor = true;
        continue;
      }

      if (foundTrimColor) {
        return rowIndex;
      }
    }

    return 0;
  }

  getMatchPercentage_(row) {
    const numMatchingPixelsInRow = row.filter((isMatch) => isMatch).length;
    return numMatchingPixelsInRow / row.length;
  }

  /**
   * @param {!Jimp} jimpImage
   * @return {{rows: !Array<!Array<boolean>, cols: !Array<!Array<boolean>}}
   * @private
   */
  findPixelsWithTrimColor_(jimpImage) {
    const rows = [];
    const cols = [];

    jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, (x, y) => {
      if (!rows[y]) {
        rows[y] = [];
      }
      if (!cols[x]) {
        cols[x] = [];
      }
      const pixelColorIng = jimpImage.getPixelColor(x, y);
      const isTrimColor = this.isTrimColor_(pixelColorIng);
      rows[y][x] = isTrimColor;
      cols[x][y] = isTrimColor;
    });

    return {rows, cols};
  }

  isTrimColor_(pixelColorInt) {
    const pixel = jimp.intToRGBA(pixelColorInt);
    const trim = jimp.intToRGBA(this.trimColorInt_);
    return (
      Math.abs(pixel.r - trim.r) < 20 &&
      Math.abs(pixel.g - trim.g) < 20 &&
      Math.abs(pixel.b - trim.b) < 20
    );
  }

  /**
   * @return {number}
   * @private
   */
  static getTrimColorAsInt_() {
    const [, r, g, b] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(TRIM_COLOR_CSS_VALUE);
    return jimp.rgbaToInt(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 255);
  }
}

module.exports = ImageCropper;
