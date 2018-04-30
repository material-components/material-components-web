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

  /**
   * @param {!GoldenStore} actualStore
   * @param {!GoldenStore} expectedStore
   * @return {!Promise<!Array<!ImageDiff>>}
   */
  async compare({
    actualStore,
    expectedStore,
  }) {
    /** @type {!Array<!Promise<!Array<!ImageDiff>>>} */
    const pagePromises = [];

    const actualJsonData = actualStore.jsonData;
    const expectedJsonData = expectedStore.jsonData;

    for (const [htmlFilePath, actualCapture] of Object.entries(actualJsonData)) {
      const expectedCapture = expectedJsonData[htmlFilePath];
      if (!expectedCapture) {
        continue;
      }

      pagePromises.push(
        this.compareOnePage_({
          htmlFilePath,
          actualCapture,
          expectedCapture,
        })
      );
    }

    // Flatten the array of arrays
    const diffResults = [].concat(...(await Promise.all(pagePromises)));

    // Filter out images with no diffs
    return diffResults.filter((diffResult) => Boolean(diffResult.diffImageBuffer));
  }

  /**
   * @param {string} htmlFilePath
   * @param {!CaptureJson} actualCapture
   * @param {!CaptureJson} expectedCapture
   * @return {!Promise<!Array<!ImageDiff>>}
   * @private
   */
  async compareOnePage_({
    htmlFilePath,
    actualCapture,
    expectedCapture,
  }) {
    /** @type {!Array<!Promise<!ImageDiff>>} */
    const imagePromises = [];

    const actualScreenshots = actualCapture.screenshots;
    const expectedScreenshots = expectedCapture.screenshots;

    for (const [browserKey, actualImageUrl] of Object.entries(actualScreenshots)) {
      const expectedImageUrl = expectedScreenshots[browserKey];
      if (!expectedImageUrl) {
        continue;
      }

      imagePromises.push(
        this.compareOneImage_({actualImageUrl, expectedImageUrl})
          .then(
            (diffImageBuffer) => ({
              htmlFilePath,
              browserKey,
              expectedImageUrl,
              actualImageUrl,
              diffImageUrl: null, // populated by `Controller`
              diffImageBuffer,
            }),
            (err) => Promise.reject(err)
          )
      );
    }

    return Promise.all(imagePromises);
  }

  /**
   * @param {string} actualImageUrl
   * @param {string} expectedImageUrl
   * @return {!Promise<?Buffer>}
   * @private
   */
  async compareOneImage_({
    actualImageUrl,
    expectedImageUrl,
  }) {
    console.log(`➡ Comparing snapshot to golden: "${actualImageUrl}" vs. "${expectedImageUrl}"...`);

    const [actualImageBuffer, expectedImageBuffer] = await Promise.all([
      this.imageCache_.getImageBuffer(actualImageUrl),
      this.imageCache_.getImageBuffer(expectedImageUrl),
    ]);

    const diffResult = await this.computeDiff_({
      actualImageBuffer,
      expectedImageBuffer,
    });

    if (diffResult.rawMisMatchPercentage < 0.01) {
      console.log(`✔ No diffs found for "${actualImageUrl}"!`);
      return null;
    }

    console.log(`✗︎ Image "${actualImageUrl}" has changed!`);
    return diffResult.getBuffer();
  }

  /**
   * @param {!Buffer} actualImageBuffer
   * @param {!Buffer} expectedImageBuffer
   * @return {!Promise<!ResembleApiComparisonResult>}
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
        errorType: ResembleApiErrorType.movementDifferenceIntensity,
        transparency: 0.3,
      },
      ignore: [ResembleApiIgnore.antialiasing],
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


/*
 * JSON typedefs
 */


/**
 * @typedef {{
 *   publicUrl: string,
 *   screenshots: !Object,
 * }}
 */
// eslint-disable-next-line no-unused-vars
let CaptureJson;

/**
 * @typedef {{
 *   htmlFilePath: string,
 *   browserKey: string,
 *   actualImageUrl: string,
 *   expectedImageUrl: string,
 *   diffImageBuffer ?Buffer,
 *   diffImageUrl: string,
 * }}
 */
// eslint-disable-next-line no-unused-vars
let ImageDiff;


/*
 * Resemble.js API externs
 */


/** @enum {string} */
const ResembleApiErrorType = {
  flat: 'flat',
  movement: 'movement',
  flatDifferenceIntensity: 'flatDifferenceIntensity',
  movementDifferenceIntensity: 'movementDifferenceIntensity',
  diffOnly: 'diffOnly',
};

/** @enum {string} */
const ResembleApiIgnore = {
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
let ResembleApiBoundingBox;

/**
 * @typedef {{
 *   rawMisMatchPercentage: number,
 *   misMatchPercentage: string,
 *   diffBounds: !ResembleApiBoundingBox,
 *   analysisTime: number,
 *   getImageDataUrl: function(text: string): string,
 *   getBuffer: function(includeOriginal: boolean): !Buffer,
 * }}
 */
// eslint-disable-next-line no-unused-vars
let ResembleApiComparisonResult;
