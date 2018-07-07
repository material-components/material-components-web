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
const fs = require('mz/fs');

const pb = require('./types.pb');
const {ImageDiffResult, Screenshot, TestFile} = pb.mdc.test.screenshot;
const {CaptureState} = Screenshot;

/**
 * Computes the difference between two screenshot images and generates an image that highlights the pixels that changed.
 */
class ImageDiffer {
  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @return {!Promise<void>}
   */
  async compareAllScreenshots(reportData) {
    for (const screenshot of reportData.screenshots.comparable_screenshot_list) {
      screenshot.image_diff_result = await this.compareOneImage({
        reportData,
        actualImageFile: screenshot.actual_image_file.absolute_path,
        expectedImageFile: screenshot.expected_image_file.absolute_path,
      });
      screenshot.capture_state = CaptureState.DIFFED;
    }
  }

  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @param {!mdc.test.screenshot.TestFile} actualImageFile
   * @param {!mdc.test.screenshot.TestFile} expectedImageFile
   * @return {!Promise<!mdc.test.screenshot.ImageDiffResult>}
   */
  async compareOneImage({reportData, actualImageFile, expectedImageFile}) {
    const reportMeta = reportData.meta;

    // TODO(acdvorak): Fix bug here
    const actualImageBuffer = await fs.readFile(actualImageFile.absolute_path);
    const expectedImageBuffer = await fs.readFile(expectedImageFile.absolute_path);

    /** @type {!ResembleApiComparisonResult} */
    const resembleComparisonResult = await this.computeDiff_({actualImageBuffer, expectedImageBuffer});

    const diffImageFile = this.createDiffImageFile_({reportMeta, actualImageFile});
    const {diffImageBuffer, diffPixelFraction, diffPixelCount} =
      await this.analyzeComparisonResult_(resembleComparisonResult);
    await fs.writeFile(diffImageFile.absolute_path, diffImageBuffer, {encoding: null});

    return ImageDiffResult.create({
      diff_image_file: diffImageFile,
      diff_pixel_count: diffPixelCount,
      diff_pixel_fraction: diffPixelFraction,
      has_changed: diffPixelCount >= require('../resemble.json').mdc_screenshot_test.min_diff_pixel_count,
    });
  }

  /**
   * @param {!ResembleApiComparisonResult} resembleComparisonResult
   * @return {!Promise<{diffImageBuffer: !Buffer, diffPixelFraction: number, diffPixelCount: number}>}
   * @private
   */
  async analyzeComparisonResult_(resembleComparisonResult) {
    /** @type {!Buffer} */
    const diffImageBuffer = resembleComparisonResult.getBuffer();

    /** @type {!Jimp.Jimp} */
    const jimpImage = await Jimp.read(diffImageBuffer);

    const {width, height} = jimpImage.bitmap;
    const diffPixelFraction = resembleComparisonResult.rawMisMatchPercentage;
    const diffPixelCount = diffPixelFraction * width * height;

    return {diffImageBuffer, diffPixelFraction, diffPixelCount};
  }

  /**
   * @param {!mdc.test.screenshot.ReportMeta} reportMeta
   * @param {!mdc.test.screenshot.TestFile} actualImageFile
   * @return {!mdc.test.screenshot.TestFile}
   * @private
   */
  createDiffImageFile_({reportMeta, actualImageFile}) {
    const diffImageRelativePath = actualImageFile.relative_path.replace(/\.png$/, '.diff.png');
    const diffImageAbsolutePath = path.join(
      reportMeta.local_diff_image_base_dir,
      diffImageRelativePath
    );
    const diffImagePublicUrl = path.join(
      reportMeta.remote_upload_base_url,
      reportMeta.remote_upload_base_dir,
      diffImageRelativePath
    );

    return TestFile.create({
      public_url: diffImagePublicUrl,
      relative_path: diffImageRelativePath,
      absolute_path: diffImageAbsolutePath,
    });
  }

  /**
   * @param {!Buffer} actualImageBuffer
   * @param {!Buffer} expectedImageBuffer
   * @return {!Promise<!ResembleApiComparisonResult>}
   * @private
   */
  async computeDiff_({actualImageBuffer, expectedImageBuffer}) {
    const options = require('../resemble.json');
    return await compareImages(
      actualImageBuffer,
      expectedImageBuffer,
      options
    );
  }
}

module.exports = ImageDiffer;
