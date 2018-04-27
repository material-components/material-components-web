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
let ResembleDiffBounds;

/**
 * @typedef {{
 *   rawMisMatchPercentage: number,
 *   misMatchPercentage: string,
 *   diffBounds: !ResembleDiffBounds,
 *   analysisTime: number,
 *   getImageDataUrl: function(text: string): string,
 *   getBuffer: function(includeOriginal: boolean): !Buffer,
 * }}
 */
// eslint-disable-next-line no-unused-vars
let ResembleData;

class ImageDiffer {
  constructor() {}

  /**
   * @param {!Buffer} snapshotImageData
   * @param {!Buffer} goldenImageData
   * @return {!Promise<!ResembleData>}
   * @private
   */
  async getDiff({
    snapshotImageData,
    goldenImageData,
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
      snapshotImageData,
      goldenImageData,
      options
    );
  }
}

module.exports = ImageDiffer;
