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

const compareImages = require('resemblejs/compareImages');

class ImageDiffer {
  constructor({imageCache}) {
    /**
     * @type {!ImageCache}
     * @private
     */
    this.imageCache_ = imageCache;
  }

  async compare({
    actualStore,
    expectedStore,
  }) {
    // TODO(acdvorak): Diff images and upload diffs to GCS in parallel
    // TODO(acdvorak): Handle golden.json key mismatches between master and current

    const diffs = [];

    const actualJsonData = actualStore.jsonData;
    const expectedJsonData = expectedStore.jsonData;

    for (const [htmlFilePath, actualCapture] of Object.entries(actualJsonData)) {
      const expectedCapture = expectedJsonData[htmlFilePath];
      if (!expectedCapture) {
        continue;
      }

      const actualScreenshots = actualCapture.screenshots;
      const expectedScreenshots = expectedCapture.screenshots;

      for (const [browserKey, actualImageUrl] of Object.entries(actualScreenshots)) {
        const expectedImageUrl = expectedScreenshots[browserKey];
        if (!expectedImageUrl) {
          continue;
        }

        const [actualImageBuffer, expectedImageBuffer] = await Promise.all([
          this.imageCache_.getImageBuffer(actualImageUrl),
          this.imageCache_.getImageBuffer(expectedImageUrl),
        ]);

        const diffResult = await this.computeDiff_({
          actualImageBuffer,
          expectedImageBuffer,
        });

        if (diffResult.rawMisMatchPercentage < 0.01) {
          continue;
        }

        diffs.push({
          htmlFilePath,
          browserKey,
          actualImageUrl,
          expectedImageUrl,
          diffImageBuffer: diffResult.getBuffer(),
          diffImageUrl: null,
        });
      }
    }

    return diffs;
  }

  /**
   * @param {!Buffer} actualImageBuffer
   * @param {!Buffer} expectedImageBuffer
   * @return {!Promise<!ResembleData>}
   * @private
   */
  async computeDiff_({
    actualImageBuffer,
    expectedImageBuffer,
  }) {
    const options = {
      output: {
        errorColor: {
          red: 255,
          green: 0,
          blue: 255,
          alpha: 150,
        },
        errorType: ErrorType.movementDifferenceIntensity,
        transparency: 0.3,
      },
      ignore: [Ignore.antialiasing],
    };

    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    return await compareImages(
      actualImageBuffer,
      expectedImageBuffer,
      options
    );
  }
}

module.exports = ImageDiffer;

const ErrorType = {
  flat: 'flat',
  movement: 'movement',
  flatDifferenceIntensity: 'flatDifferenceIntensity',
  movementDifferenceIntensity: 'movementDifferenceIntensity',
  diffOnly: 'diffOnly',
};

const Ignore = {
  nothing: 'nothing',
  less: 'less',
  antialiasing: 'antialiasing',
  colors: 'colors',
  alpha: 'alpha',
};

/**
 * @typedef {{
 *   top: number,
 *   left: number,
 *   bottom: number,
 *   right: number,
 * }}
 */
// eslint-disable-next-line no-unused-vars
let BoundingBox;

/**
 * @typedef {{
 *   rawMisMatchPercentage: number,
 *   misMatchPercentage: string,
 *   diffBounds: !BoundingBox,
 *   analysisTime: number,
 *   getImageDataUrl: function(text: string): string,
 *   getBuffer: function(includeOriginal: boolean): !Buffer,
 * }}
 */
// eslint-disable-next-line no-unused-vars
let ResembleData;
