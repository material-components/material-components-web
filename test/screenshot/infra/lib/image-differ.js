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
    });
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.TestFile} actualImageFile
   * @param {?mdc.proto.TestFile} expectedImageFile
   * @return {!Promise<!mdc.proto.DiffImageResult>}
   * @private
   */
  async compareOneImage_({meta, actualImageFile, expectedImageFile}) {
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
    const {diffImageBuffer, diffImageResult} = await this.analyzeComparisonResult_({
      expectedImageBuffer,
      actualImageBuffer,
      resembleComparisonResult,
    });
    diffImageResult.diff_image_file = diffImageFile;

    await this.localStorage_.writeBinaryFile(diffImageFile.absolute_path, diffImageBuffer);

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
   * @return {!Promise<{diffImageBuffer: !Buffer, diffImageResult: !mdc.proto.DiffImageResult}>}
   * @private
   */
  async analyzeComparisonResult_({expectedImageBuffer, actualImageBuffer, resembleComparisonResult}) {
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
    const minChangedPixelCount = require('../../diffing.json').flaky_tests.min_changed_pixel_count;
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
