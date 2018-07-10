/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('mz/fs');
const mkdirp = require('mkdirp');
const path = require('path');

const pb = require('../proto/types.pb').mdc.proto;
const {TestFile, UserAgent, WebDriverCapabilities} = pb;
const {FormFactorType} = UserAgent;

const Base64 = require('base64-js');
const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const ImageCropper = require('./image-cropper');
const {Builder} = require('selenium-webdriver');

class SeleniumApi {
  constructor() {
    /**
     * @type {!CbtApi}
     * @private
     */
    this.cbtApi_ = new CbtApi();

    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!ImageCropper}
     * @private
     */
    this.imageCropper_ = new ImageCropper();
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages(reportData) {
    for (const userAgent of reportData.user_agents.runnable_user_agents) {
      await this.captureAllPagesInBrowser_({reportData, userAgent});
    }
    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!Promise<void>}
   * @private
   */
  async captureAllPagesInBrowser_({reportData, userAgent}) {
    /** @type {!IWebDriver} */
    const driver = await this.createWebDriver_(userAgent);

    try {
      await this.driveBrowser_({reportData, userAgent, driver});
    } finally {
      await driver.quit();
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.UserAgent} userAgent
   * @param {!IWebDriver} driver
   * @return {!Promise<void>}
   * @private
   */
  async driveBrowser_({reportData, userAgent, driver}) {
    // await driver.get('http://www.google.com/ncr');
    // await driver.findElement(By.name('q')).sendKeys('webdriver');
    // await driver.findElement(By.name('btnK')).click();
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    // await driver.sleep(1000 * 10);

    const meta = reportData.meta;

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const screenshotQueue = reportData.screenshots.runnable_screenshot_browser_map[userAgent.alias].screenshots;

    /** @type {!mdc.proto.WebDriverCapabilities} */
    const caps = await this.getWebDriverCapabilities_(driver);

    for (const screenshot of screenshotQueue) {
      const htmlFilePath = screenshot.test_page_file.relative_path;
      const htmlFileUrl = screenshot.test_page_file.public_url;

      const imageBuffer = await this.capturePageAsPng_({driver, userAgent, url: htmlFileUrl});

      const imageFilePathRelative = `${htmlFilePath}.${caps.image_filename_suffix}.png`;
      const imageFilePathAbsolute = path.resolve(meta.local_screenshot_image_base_dir, imageFilePathRelative);

      mkdirp.sync(path.dirname(imageFilePathAbsolute));
      await fs.writeFile(imageFilePathAbsolute, imageBuffer, {encoding: null});

      screenshot.user_agent.webdriver_capabilities = caps;
      screenshot.actual_image_file = TestFile.create({
        relative_path: imageFilePathRelative,
        absolute_path: imageFilePathAbsolute,
        public_url: meta.remote_upload_base_url + meta.remote_upload_base_dir + imageFilePathRelative,
      });
    }
  }

  /**
   * @param {!IWebDriver} driver
   * @param {!mdc.proto.UserAgent} userAgent
   * @param {string} url
   * @return {!Promise<!Buffer>} Buffer containing PNG image data for the cropped screenshot image
   * @private
   */
  async capturePageAsPng_({driver, userAgent, url}) {
    console.log(`GET "${url}"...`);
    await driver.get(url);

    // TODO(acdvorak): Set this value dynamically
    // TODO(acdvorak): This blows up on mobile browsers
    // NOTE(acdvorak): Setting smaller window dimensions appears to speed up the tests significantly.
    if (userAgent.form_factor_type === FormFactorType.DESKTOP) {
      // TODO(acdvorak): Better `catch()` handler
      await driver.manage().window().setRect({width: 400, height: 800}).catch(() => undefined);
    }

    // TODO(acdvorak): Implement "fullpage" screenshots?
    // We can find the device's pixel ratio by capturing a screenshot and comparing the image dimensions with the
    // viewport dimensions reported by the JS running on the page.

    const uncroppedScreenshotPngBase64 = await driver.takeScreenshot();
    const uncroppedScreenshotPngBuffer = Buffer.from(Base64.toByteArray(uncroppedScreenshotPngBase64));

    return this.imageCropper_.autoCropImage(uncroppedScreenshotPngBuffer);
  }
  /**
   * @param {!mdc.proto.UserAgent} userAgent}
   * @return {!Promise<!IWebDriver>}
   */
  async createWebDriver_(userAgent) {
    // TODO(acdvorak): Centralize where `selenium_id` comes from; rename `selenium_id`?
    const driverBuilder = new Builder().forBrowser(userAgent.selenium_id);

    if (await this.cli_.isOnline()) {
      await this.cbtApi_.configureWebDriver({driverBuilder, userAgent});
    }

    return await driverBuilder.build();
  }

  /**
   * @param {!IWebDriver} driver
   * @return {!Promise<!mdc.proto.WebDriverCapabilities>}
   * @private
   */
  async getWebDriverCapabilities_(driver) {
    // TODO(acdvorak): Why is this returning an empty object?
    /** @type {!Object<string, *>} */
    const caps = await driver.getCapabilities();

    // TODO(acdvorak): Fix
    console.log('');
    console.log('WEBDRIVER CAPABILITIES:');
    console.log('');
    console.log(JSON.stringify(caps, null, 2));
    console.log('');

    const proto = WebDriverCapabilities.create({
      browser_name: caps['browserName'],
      browser_version: caps['browserVersion'] || caps['version'],
      platform_name: caps['platformName'] || caps['platform'],
      platform_version: caps['platformVersion'],

      is_headless: caps['moz:headless'] || false,
      is_rotatable: caps['rotatable'] || false,
      has_touch_screen: caps['hasTouchScreen'] || false,
      supports_native_events: caps['nativeEvents'] || false,
    });

    proto.image_filename_suffix = [
      proto.platform_name,
      proto.platform_version,
      proto.browser_name,
      proto.browser_version,
    ].join('_');

    return proto;
  }
}

// TODO(acdvorak): Implement this check
function reachedParallelExecutionLimit(requestError) {
  try {
    // The try/catch is necessary because some of these properties might not exist.
    return requestError.response.body.message.includes('maximum number of parallel');
  } catch (e) {
    return false;
  }
}

// TODO(acdvorak): Implement this check
function isBadUrl(requestError) {
  try {
    // The try/catch is necessary because some of these properties might not exist.
    return requestError.response.body.message.includes('URL check failed');
  } catch (e) {
    return false;
  }
}

// TODO(acdvorak): Implement this check
function isServerError(requestError) {
  return requestError.statusCode >= 500 && requestError.statusCode < 600;
}

module.exports = SeleniumApi;
