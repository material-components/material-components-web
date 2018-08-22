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

'use strict';

const Jimp = require('jimp');
const compareImages = require('resemblejs/compareImages');
const path = require('path');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {DiffImageResult, Dimensions, TestFile} = mdcProto;

const LocalStorage = require('./local-storage');

/**
 * Computes the difference between two screenshot images and generates an image that highlights the pixels that changed.
 */
class ImageDiffer {
  constructor() {
    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.Screenshot} screenshot
   * @return {!Promise<!mdc.proto.DiffImageResult>}
   */
  async compareOneScreenshot({meta, screenshot}) {
    return await this.compareOneImage_({
      meta,
      actualImageFile: screenshot.actual_image_file,
      expectedImageFile: screenshot.expected_image_file,
      flakeConfig: screenshot.flake_config,
    });
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.TestFile} actualImageFile
   * @param {?mdc.proto.TestFile} expectedImageFile
   * @param {!mdc.proto.FlakeConfig} flakeConfig
   * @return {!Promise<!mdc.proto.DiffImageResult>}
   * @private
   */
  async compareOneImage_({meta, actualImageFile, expectedImageFile, flakeConfig}) {
    const actualImageBuffer = await this.localStorage_.readBinaryFile(actualImageFile.absolute_path);

    if (!expectedImageFile) {
      const actualJimpImage = await Jimp.read(actualImageBuffer);
      return DiffImageResult.create({
        actual_image_dimensions: Dimensions.create({
          width: actualJimpImage.bitmap.width,
          height: actualJimpImage.bitmap.height,
        }),
      });
    }

    const expectedImageBuffer = await this.localStorage_.readBinaryFile(expectedImageFile.absolute_path);

    /** @type {!ResembleApiComparisonResult} */
    const resembleComparisonResult = await this.computeDiff_({actualImageBuffer, expectedImageBuffer});

    const diffImageFile = this.createDiffImageFile_({meta, actualImageFile});
    const {
      /** @type {!Buffer} */
      diffImageBuffer,
      /** @type {!mdc.proto.DiffImageResult} */
      diffImageResult,
    } = await this.analyzeComparisonResult_({
      expectedImageBuffer,
      actualImageBuffer,
      resembleComparisonResult,
      flakeConfig,
    });

    diffImageResult.diff_image_file = diffImageFile;

    // TODO(acdvorak): Only write file if all retries fail, and do it in `selenium-api.js`.
    if (diffImageResult.changed_pixel_count > 0) {
      await this.localStorage_.writeBinaryFile(diffImageFile.absolute_path, diffImageBuffer);
    }

    return diffImageResult;
  }

  /**
   * @param {!Buffer} actualImageBuffer
   * @param {!Buffer} expectedImageBuffer
   * @return {!Promise<!ResembleApiComparisonResult>}
   * @private
   */
  async computeDiff_({actualImageBuffer, expectedImageBuffer}) {
    const options = require('../../diffing.json').resemble_config;
    return await compareImages(
      actualImageBuffer,
      expectedImageBuffer,
      options
    );
  }

  /**
   * @param {!Buffer} expectedImageBuffer
   * @param {!Buffer} actualImageBuffer
   * @param {!ResembleApiComparisonResult} resembleComparisonResult
   * @param {!mdc.proto.FlakeConfig} flakeConfig
   * @return {!Promise<{diffImageBuffer: !Buffer, diffImageResult: !mdc.proto.DiffImageResult}>}
   * @private
   */
  async analyzeComparisonResult_({expectedImageBuffer, actualImageBuffer, resembleComparisonResult, flakeConfig}) {
    /** @type {!Buffer} */
    const diffImageBuffer = resembleComparisonResult.getBuffer();

    /** @type {!Jimp.Jimp} */ const expectedJimpImage = await Jimp.read(expectedImageBuffer);
    /** @type {!Jimp.Jimp} */ const actualJimpImage = await Jimp.read(actualImageBuffer);
    /** @type {!Jimp.Jimp} */ const diffJimpImage = await Jimp.read(diffImageBuffer);

    function roundPercentage(rawPercentage) {
      let roundPower = Math.pow(10, 1);
      if (rawPercentage < 1) {
        const leadingFractionalZeroDigits = String(rawPercentage).replace(/^0\.(0*).*$/g, '$1').length + 1;
        roundPower = Math.pow(10, leadingFractionalZeroDigits);
      }
      return Math.ceil(rawPercentage * roundPower) / roundPower;
    }

    const diffPixelRawPercentage = resembleComparisonResult.rawMisMatchPercentage;
    const diffPixelRoundPercentage = roundPercentage(diffPixelRawPercentage);
    const diffPixelFraction = diffPixelRawPercentage / 100;
    const diffPixelCount = Math.ceil(diffPixelFraction * diffJimpImage.bitmap.width * diffJimpImage.bitmap.height);
    const minChangedPixelCount = flakeConfig.min_changed_pixel_count;
    const hasChanged = diffPixelCount >= minChangedPixelCount;
    const diffImageResult = DiffImageResult.create({
      expected_image_dimensions: Dimensions.create({
        width: expectedJimpImage.bitmap.width,
        height: expectedJimpImage.bitmap.height,
      }),
      actual_image_dimensions: Dimensions.create({
        width: actualJimpImage.bitmap.width,
        height: actualJimpImage.bitmap.height,
      }),
      diff_image_dimensions: Dimensions.create({
        width: diffJimpImage.bitmap.width,
        height: diffJimpImage.bitmap.height,
      }),
      changed_pixel_count: diffPixelCount,
      changed_pixel_fraction: diffPixelFraction,
      changed_pixel_percentage: diffPixelRoundPercentage,
      has_changed: hasChanged,
    });

    return {diffImageBuffer, diffImageResult};
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.TestFile} actualImageFile
   * @return {!mdc.proto.TestFile}
   * @private
   */
  createDiffImageFile_({meta, actualImageFile}) {
    const diffImageRelativePath = actualImageFile.relative_path.replace(/\.png$/, '.diff.png');
    const diffImageAbsolutePath = path.join(meta.local_diff_image_base_dir, diffImageRelativePath);
    const diffImagePublicUrl = meta.remote_upload_base_url + meta.remote_upload_base_dir + diffImageRelativePath;

    return TestFile.create({
      public_url: diffImagePublicUrl,
      relative_path: diffImageRelativePath,
      absolute_path: diffImageAbsolutePath,
    });
  }
}

module.exports = ImageDiffer;
