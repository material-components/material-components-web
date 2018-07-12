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
const mkdirp = require('mkdirp');
const path = require('path');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {DiffImageResult, Dimensions, Screenshot, ScreenshotList, TestFile} = mdcProto;
const {CaptureState} = Screenshot;

/**
 * Computes the difference between two screenshot images and generates an image that highlights the pixels that changed.
 */
class ImageDiffer {
  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<void>}
   */
  async compareAllScreenshots(reportData) {
    const screenshots = reportData.screenshots.comparable_screenshot_list;

    console.log(`Diffing ${screenshots.length} screenshots...`);

    await Promise.all(screenshots.map((screenshot) => {
      return this.compareOneScreenshot_({reportData, screenshot});
    }));

    reportData.screenshots.changed_screenshot_browser_map =
      this.groupByBrowser_(reportData.screenshots.changed_screenshot_list);
    reportData.screenshots.changed_screenshot_page_map =
      this.groupByPage_(reportData.screenshots.changed_screenshot_list);

    reportData.screenshots.unchanged_screenshot_browser_map =
      this.groupByBrowser_(reportData.screenshots.unchanged_screenshot_list);
    reportData.screenshots.unchanged_screenshot_page_map =
      this.groupByPage_(reportData.screenshots.unchanged_screenshot_list);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.Screenshot} screenshot
   * @return {!Promise<void>}
   * @private
   */
  async compareOneScreenshot_({reportData, screenshot}) {
    /** @type {!mdc.proto.DiffImageResult} */
    const diffImageResult = await this.compareOneImage_({
      reportData,
      actualImageFile: screenshot.actual_image_file,
      expectedImageFile: screenshot.expected_image_file,
    });

    screenshot.diff_image_result = diffImageResult;
    screenshot.diff_image_file = diffImageResult.diff_image_file;
    screenshot.capture_state = CaptureState.DIFFED;

    if (diffImageResult.has_changed) {
      reportData.screenshots.changed_screenshot_list.push(screenshot);
    } else {
      reportData.screenshots.unchanged_screenshot_list.push(screenshot);
    }
  }

  /**
   * TODO(acdvorak): De-dupe this method with ReportBuilder
   * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
   * @return {!Object<string, !mdc.proto.ScreenshotList>}
   * @private
   */
  groupByBrowser_(screenshotArray) {
    const browserMap = {};
    screenshotArray.forEach((screenshot) => {
      const userAgentAlias = screenshot.user_agent.alias;
      browserMap[userAgentAlias] = browserMap[userAgentAlias] || ScreenshotList.create({screenshots: []});
      browserMap[userAgentAlias].screenshots.push(screenshot);
    });
    return browserMap;
  }

  /**
   * TODO(acdvorak): De-dupe this method with ReportBuilder
   * @param {!Array<!mdc.proto.Screenshot>} screenshotArray
   * @return {!Object<string, !mdc.proto.ScreenshotList>}
   * @private
   */
  groupByPage_(screenshotArray) {
    const pageMap = {};
    screenshotArray.forEach((screenshot) => {
      const htmlFilePath = screenshot.html_file_path;
      pageMap[htmlFilePath] = pageMap[htmlFilePath] || ScreenshotList.create({screenshots: []});
      pageMap[htmlFilePath].screenshots.push(screenshot);
    });
    return pageMap;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.TestFile} actualImageFile
   * @param {!mdc.proto.TestFile} expectedImageFile
   * @return {!Promise<!mdc.proto.DiffImageResult>}
   * @private
   */
  async compareOneImage_({reportData, actualImageFile, expectedImageFile}) {
    const reportMeta = reportData.meta;

    // TODO(acdvorak): Fix bug here
    // TODO(acdvorak): Which bug? Offline comparison? What else? Maybe the paths don't always get set correctly?
    const actualImageBuffer = await fs.readFile(actualImageFile.absolute_path);
    const expectedImageBuffer = await fs.readFile(expectedImageFile.absolute_path);

    /** @type {!ResembleApiComparisonResult} */
    const resembleComparisonResult = await this.computeDiff_({actualImageBuffer, expectedImageBuffer});

    const diffImageFile = this.createDiffImageFile_({reportMeta, actualImageFile});
    const {diffImageBuffer, diffImageResult} = await this.analyzeComparisonResult_({
      expectedImageBuffer,
      actualImageBuffer,
      resembleComparisonResult,
    });
    diffImageResult.diff_image_file = diffImageFile;

    mkdirp.sync(path.dirname(diffImageFile.absolute_path));
    await fs.writeFile(diffImageFile.absolute_path, diffImageBuffer, {encoding: null});

    return diffImageResult;
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
      has_changed: diffPixelCount >= require('../resemble.json').mdc_screenshot_test.min_changed_pixel_count,
    });

    return {diffImageBuffer, diffImageResult};
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @param {!mdc.proto.TestFile} actualImageFile
   * @return {!mdc.proto.TestFile}
   * @private
   */
  createDiffImageFile_({reportMeta, actualImageFile}) {
    const diffImageRelativePath = actualImageFile.relative_path.replace(/\.png$/, '.diff.png');
    const diffImageAbsolutePath = path.join(
      reportMeta.local_diff_image_base_dir,
      diffImageRelativePath
    );
    const diffImagePublicUrl =
      reportMeta.remote_upload_base_url +
      reportMeta.remote_upload_base_dir +
      diffImageRelativePath;

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
