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

// const webdriver = require('selenium-webdriver');

const fs = require('mz/fs');
const mkdirp = require('mkdirp');
const path = require('path');

const pb = require('./types.pb');
const {TestFile, WebDriverCapabilities} = pb.mdc.test.screenshot;

const Base64 = require('base64-js');
const ImageCropper = require('./image-cropper');
const {Builder, Capabilities} = require('selenium-webdriver');

// const {By, until} = require('selenium-webdriver');

class SeleniumApi {
  constructor() {
    /**
     * @type {!ImageCropper}
     * @private
     */
    this.imageCropper_ = new ImageCropper();
  }

  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @return {!Promise<!mdc.test.screenshot.ReportData>}
   */
  async captureAllPages(reportData) {
    for (const userAgent of reportData.user_agents.runnable_user_agents) {
      await this.captureAllPagesInBrowser_({reportData, userAgent});
    }
    return reportData;
  }

  /**
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @param {!mdc.test.screenshot.UserAgent} userAgent
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
   * @param {!mdc.test.screenshot.ReportData} reportData
   * @param {!mdc.test.screenshot.UserAgent} userAgent
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

    /** @type {!Array<!mdc.test.screenshot.Screenshot>} */
    const screenshotQueue = reportData.screenshots.runnable_screenshot_browser_map[userAgent.alias].screenshots;

    /** @type {!mdc.test.screenshot.WebDriverCapabilities} */
    const caps = await this.getWebDriverCapabilities_(driver);

    for (const screenshot of screenshotQueue) {
      const htmlFilePath = screenshot.test_page_file.relative_path;
      const imageBuffer = await this.capturePageAsPng_({driver, htmlFilePath});

      const imageFilePathRelative = `${htmlFilePath}.${caps.image_filename_suffix}.png`;
      const imageFilePathAbsolute = path.resolve(meta.local_screenshot_image_base_dir, imageFilePathRelative);

      mkdirp.sync(path.dirname(imageFilePathAbsolute));
      await fs.writeFile(imageFilePathAbsolute, imageBuffer, {encoding: null});

      screenshot.user_agent.webdriver_capabilities = caps;
      screenshot.actual_image_file = TestFile.create({
        relative_path: imageFilePathRelative,
        absolute_path: imageFilePathAbsolute,
        public_url: path.join(meta.remote_upload_base_url, meta.remote_upload_base_dir, imageFilePathRelative),
      });
    }
  }

  /**
   * @param {!IWebDriver} driver
   * @param {string} htmlFilePath
   * @return {!Promise<!Buffer>} Buffer containing PNG image data for the cropped screenshot image
   * @private
   */
  async capturePageAsPng_({driver, htmlFilePath}) {
    // TODO(acdvorak): Use uploaded GCS URL instead of localhost, but make it configurable for local testing too
    await driver.get(`http://localhost:8080/${htmlFilePath}`);

    // TODO(acdvorak): Implement "fullpage" screenshots?
    // We can find the device's pixel ratio by capturing a screenshot and comparing the image dimensions with the
    // viewport dimensions reported by the JS running on the page.

    const uncroppedScreenshotPngBase64 = await driver.takeScreenshot();
    const uncroppedScreenshotPngBuffer = Buffer.from(Base64.toByteArray(uncroppedScreenshotPngBase64));

    return this.imageCropper_.autoCropImage(uncroppedScreenshotPngBuffer);
  }
  /**
   * @param {!mdc.test.screenshot.UserAgent} userAgent}
   * @return {!Promise<!IWebDriver>}
   */
  async createWebDriver_(userAgent) {
    const builder = new Builder()
      // .usingServer(this.cbtApi_.proxyServerUrl)
      .withCapabilities(
        new Capabilities()
          .setBrowserName(userAgent.selenium_id)
          .set('name', 'Prototype by advorak@google.com')
          .set('build', 'prototype-test')

          // These don't seem to do anything, but they're in CBT's examples:
          // https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/
          // https://github.com/crossbrowsertesting/selenium-webdriverjs/blob/master/parallel/google-search.js
          // .set('browser_api_name', 'FF59x64')
          // .set('os_api_name', 'Win10')
          // .set('username', MDC_CBT_USERNAME)
          // .set('password', MDC_CBT_AUTHKEY)
      )
    ;
    return await builder.build();
  }

  /**
   * @param {!IWebDriver} driver
   * @return {!Promise<!mdc.test.screenshot.WebDriverCapabilities>}
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
      browserName: caps['browserName'],
      browserVersion: caps['browserVersion'] || caps['version'],
      platformName: caps['platformName'] || caps['platform'],
      platformVersion: caps['platformVersion'],

      is_headless: caps['moz:headless'] || false,
      is_rotatable: caps['rotatable'] || false,
      has_touch_screen: caps['hasTouchScreen'] || false,
      supports_native_events: caps['nativeEvents'] || false,
    });

    proto.image_filename_suffix = [
      proto.platformName,
      proto.platformVersion,
      proto.browserName,
      proto.browserVersion,
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
