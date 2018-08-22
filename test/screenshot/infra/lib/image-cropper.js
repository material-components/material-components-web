/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const Jimp = require('jimp');

const TRIM_COLOR_CSS_VALUE = '#abc123'; // Value must match `$test-viewport-trim-color` in `fixture.scss`

/**
 * Fractional value (0 to 1 inclusive) indicating the minimum percentage of pixels in a row or column that must
 * match the trim color in order for that row or column to be cropped out.
 * @type {number}
 */
const TRIM_COLOR_PIXEL_MATCH_FRACTION = 0.05;

/**
 * Maximum distance (0 to 255 inclusive) that a pixel's R, G, and B color channels can be from the corresponding
 * channels in the trim color in order to be considered a "match" with the trim color.
 * @type {number}
 */
const TRIM_COLOR_CHANNEL_DISTANCE = 20;

/**
 * Maximum distance (in pixels) from the top-left corner of the image to the top and left trim borders.
 * @type {number}
 */
const TRIM_COLOR_TOP_LEFT_DISTANCE = 20;

class ImageCropper {
  constructor() {
    /**
     * @type {!RGBA}
     * @private
     */
    this.trimColorRGB_ = ImageCropper.parseTrimColorRGB_();
  }

  /**
   * Automatically crops an image based on its background color.
   * @param {!Buffer} imageData Uncropped image buffer
   * @return {!Promise<!Buffer>} Cropped image buffer
   */
  async autoCropImage(imageData) {
    return Jimp.read(imageData)
      .then(
        (jimpImage) => {
          return new Promise((resolve, reject) => {
            const {x, y, w, h} = this.getCropRect_(jimpImage);
            jimpImage
              .crop(x, y, w, h)
              .getBuffer(Jimp.MIME_PNG, (err, buffer) => {
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

    const left = this.getCropAmount_(cols, TRIM_COLOR_TOP_LEFT_DISTANCE);
    const top = this.getCropAmount_(rows, TRIM_COLOR_TOP_LEFT_DISTANCE);
    const right = this.getCropAmount_(cols.slice(left).reverse());
    const bottom = this.getCropAmount_(rows.slice(top).reverse());

    const rect = {
      x: left,
      y: top,
      w: cols.length - left - right,
      h: rows.length - top - bottom,
    };

    if (rect.x < 0 || rect.y < 0 || rect.w < 1 || rect.h < 1) {
      const rectStr = JSON.stringify(rect);
      const imageStr = JSON.stringify({w: cols.length, h: rows.length});
      throw new Error(`Invalid cropping rect: ${rectStr} (source image: ${imageStr})`);
    }

    return rect;
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
      const pixelColorRGB = Jimp.intToRGBA(jimpImage.getPixelColor(x, y));
      const isTrimColor = this.isTrimColor_(pixelColorRGB);
      rows[y][x] = isTrimColor;
      cols[x][y] = isTrimColor;
    });

    return {rows, cols};
  }

  /**
   * @param {!RGBA} pixelColorRGB
   * @return {boolean}
   * @private
   */
  isTrimColor_(pixelColorRGB) {
    return (
      Math.abs(pixelColorRGB.r - this.trimColorRGB_.r) < TRIM_COLOR_CHANNEL_DISTANCE &&
      Math.abs(pixelColorRGB.g - this.trimColorRGB_.g) < TRIM_COLOR_CHANNEL_DISTANCE &&
      Math.abs(pixelColorRGB.b - this.trimColorRGB_.b) < TRIM_COLOR_CHANNEL_DISTANCE
    );
  }

  /**
   * @param {!Array<!Array<boolean>>} rows
   * @param {number} max
   * @return {number}
   * @private
   */
  getCropAmount_(rows, max = rows.length - 1) {
    let foundTrimColor = false;

    for (const [rowIndex, row] of rows.entries()) {
      const isTrimColor = this.getMatchPercentage_(row) >= TRIM_COLOR_PIXEL_MATCH_FRACTION;

      if (isTrimColor) {
        foundTrimColor = true;
        continue;
      }

      if (foundTrimColor) {
        return rowIndex < max ? rowIndex : 0;
      }
    }

    return 0;
  }

  /**
   * @param {!Array<boolean>} row
   * @return {number}
   * @private
   */
  getMatchPercentage_(row) {
    const numMatchingPixelsInRow = row.filter((isMatch) => isMatch).length;
    return numMatchingPixelsInRow / row.length;
  }

  /**
   * @return {!RGBA}
   * @private
   */
  static parseTrimColorRGB_() {
    const [, r, g, b] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(TRIM_COLOR_CSS_VALUE);
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: 255,
    };
  }
}

module.exports = ImageCropper;
