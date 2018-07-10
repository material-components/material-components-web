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

const proto = require('../proto/types.pb').mdc.proto;
const {TestFile, UserAgent} = proto;
const {BrowserVendorType, FormFactorType} = UserAgent;
const {NormalizedCapabilities, RawCapabilities} = proto.selenium;

const Base64 = require('base64-js');
const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const ImageCropper = require('./image-cropper');
const {Browser, Builder} = require('selenium-webdriver');

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
   * @param {!mdc.proto.UserAgent} userAgent}
   * @return {!Promise<!IWebDriver>}
   */
  async createWebDriver_(userAgent) {
    const driverBuilder = new Builder();

    /** @type {!mdc.proto.selenium.RawCapabilities} */
    const desiredCapabilities = await this.getDesiredCapabilities_(userAgent);

    userAgent.desired_capabilities = desiredCapabilities;
    driverBuilder.withCapabilities(userAgent.desired_capabilities);

    const isOnline = await this.cli_.isOnline();
    if (isOnline) {
      driverBuilder.usingServer(this.cbtApi_.getSeleniumServerUrl());
    }

    console.log('');
    console.log(`Starting ${desiredCapabilities.browserName} ${userAgent.browser_version_name}...`);

    /** @type {!IWebDriver} */
    const driver = await driverBuilder.build();

    /** @type {!mdc.proto.selenium.RawCapabilities} */
    const actualCapabilities = await this.getActualCapabilities_(driver);

    console.log('actualCapabilities:', actualCapabilities);

    /** @type {!mdc.proto.selenium.NormalizedCapabilities} */
    const normalizedCapabilities = this.normalizeRawCapabilities_(actualCapabilities);

    const browserName = normalizedCapabilities.browser_name;
    const browserVersion = normalizedCapabilities.browser_version;

    userAgent.actual_capabilities = actualCapabilities;
    userAgent.normalized_capabilities = normalizedCapabilities;
    userAgent.browser_version_value = browserVersion;
    userAgent.image_filename_suffix = this.getImageFileNameSuffix_(userAgent);

    console.log(`${browserName} ${browserVersion} is running!`);
    console.log('');

    return driver;
  }

  /**
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!mdc.proto.selenium.RawCapabilities}
   * @private
   */
  async getDesiredCapabilities_(userAgent) {
    const isOnline = await this.cli_.isOnline();
    if (isOnline) {
      return await this.cbtApi_.getDesiredCapabilities(userAgent);
    }

    const browserVendorMap = {
      [BrowserVendorType.CHROME]: Browser.CHROME,
      [BrowserVendorType.EDGE]: Browser.EDGE,
      [BrowserVendorType.FIREFOX]: Browser.FIREFOX,
      [BrowserVendorType.IE]: Browser.IE,
      [BrowserVendorType.SAFARI]: Browser.SAFARI,
    };
    return RawCapabilities.create({
      browserName: browserVendorMap[userAgent.browser_vendor_type],
    });
  }

  /**
   * @param {!IWebDriver} driver
   * @return {!Promise<!mdc.proto.selenium.RawCapabilities>}
   * @private
   */
  async getActualCapabilities_(driver) {
    /** @type {!Capabilities} */
    const driverCaps = await driver.getCapabilities();

    /** @type {!mdc.proto.selenium.RawCapabilities} */
    const actualCaps = RawCapabilities.create();

    for (const key of driverCaps.keys()) {
      actualCaps[key] = driverCaps.get(key);
    }

    return actualCaps;
  }

  /**
   * @param {!mdc.proto.selenium.RawCapabilities} rawCapabilities
   * @return {mdc.proto.selenium.NormalizedCapabilities}
   * @private
   */
  normalizeRawCapabilities_(rawCapabilities) {
    const rawOsName = (rawCapabilities.platformName || rawCapabilities.platform || '').toLowerCase();
    const rawOsVersion = rawCapabilities.platformVersion || '';
    const rawBrowserName = rawCapabilities.browserName;
    const rawBrowserVersion = rawCapabilities.browserVersion || rawCapabilities.version || '';

    const isMac = rawOsName.startsWith('mac') || rawOsName.startsWith('darwin');
    const isIos = rawOsName.startsWith('ipad') || rawOsName.startsWith('iphone');
    const isAndroid = rawOsName.startsWith('android');
    const isEdge = rawBrowserName === Browser.EDGE;
    const isIE = rawBrowserName === Browser.IE;

    const normalizedOsName = isMac ? 'mac' : isIos ? 'ios' : isAndroid ? 'android' : 'windows';
    const normalizedOsVersion = rawOsVersion.replace(/(?:\.0)+$/, ''); // "10.0.0" -> "10"
    const normalizedBrowserName = isEdge ? 'edge' : isIE ? 'ie' : rawBrowserName.toLowerCase();
    const [normalizedBrowserVersion] = rawBrowserVersion.split('.');

    return NormalizedCapabilities.create({
      os_name: normalizedOsName,
      os_version: normalizedOsVersion,
      browser_name: normalizedBrowserName,
      browser_version: normalizedBrowserVersion,
    });
  }

  /**
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {string}
   * @private
   */
  getImageFileNameSuffix_(userAgent) {
    /* eslint-disable camelcase */
    const {os_name, browser_name, browser_version} = userAgent.normalized_capabilities;
    return [os_name, browser_name, browser_version].filter((value) => !!value).join('_');
    /* eslint-enable camelcase */
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

    for (const screenshot of screenshotQueue) {
      const htmlFilePath = screenshot.test_page_file.relative_path;
      const htmlFileUrl = screenshot.test_page_file.public_url;

      const imageBuffer = await this.capturePageAsPng_({driver, userAgent, url: htmlFileUrl});

      const imageFileNameSuffix = userAgent.image_filename_suffix;
      const imageFilePathRelative = `${htmlFilePath}.${imageFileNameSuffix}.png`;
      const imageFilePathAbsolute = path.resolve(meta.local_screenshot_image_base_dir, imageFilePathRelative);

      mkdirp.sync(path.dirname(imageFilePathAbsolute));
      await fs.writeFile(imageFilePathAbsolute, imageBuffer, {encoding: null});

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
