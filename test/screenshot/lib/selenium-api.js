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

const Jimp = require('jimp');
const UserAgentParser = require('useragent');
const fs = require('mz/fs');
const mkdirp = require('mkdirp');
const path = require('path');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const seleniumProto = require('../proto/selenium.pb').selenium.proto;

const {Screenshot, TestFile, UserAgent} = mdcProto;
const {CaptureState} = Screenshot;
const {BrowserVendorType, FormFactorType, Navigator} = UserAgent;
const {RawCapabilities} = seleniumProto;

const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const Constants = require('./constants');
const Duration = require('./duration');
const ImageCropper = require('./image-cropper');
const ImageDiffer = require('./image-differ');
const {Browser, Builder, By, until} = require('selenium-webdriver');
const {CBT_CONCURRENCY_POLL_INTERVAL_MS, CBT_CONCURRENCY_MAX_WAIT_MS} = Constants;
const {SELENIUM_FONT_LOAD_WAIT_MS} = Constants;

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

    /**
     * @type {!ImageDiffer}
     * @private
     */
    this.imageDiffer_ = new ImageDiffer();
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages(reportData) {
    const maxParallelTests = await this.getMaxParallelTests_();
    const runnableUserAgents = reportData.user_agents.runnable_user_agents;

    let runningUserAgents;
    let queuedUserAgents = runnableUserAgents.slice();

    function getLoggableAliases(userAgentAliases) {
      return userAgentAliases.length > 0 ? userAgentAliases.join(', ') : '(none)';
    }

    while (queuedUserAgents.length > 0) {
      runningUserAgents = queuedUserAgents.slice(0, maxParallelTests);
      queuedUserAgents = queuedUserAgents.slice(maxParallelTests);
      const runningUserAgentAliases = runningUserAgents.map((ua) => ua.alias);
      const queuedUserAgentAliases = queuedUserAgents.map((ua) => ua.alias);
      const runningUserAgentLoggable = getLoggableAliases(runningUserAgentAliases);
      const queuedUserAgentLoggable = getLoggableAliases(queuedUserAgentAliases);
      console.log('Running user agents:', runningUserAgentLoggable);
      console.log('Queued user agents:', queuedUserAgentLoggable);
      await this.captureAllPagesInAllBrowsers_({reportData, userAgents: runningUserAgents});
    }

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!Array<!mdc.proto.UserAgent>} userAgents
   * @return {!Promise<void>}
   * @private
   */
  async captureAllPagesInAllBrowsers_({reportData, userAgents}) {
    const promises = [];
    for (const userAgent of userAgents) {
      promises.push(this.captureAllPagesInOneBrowser_({reportData, userAgent}));
    }
    await Promise.all(promises);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!Promise<void>}
   * @private
   */
  async captureAllPagesInOneBrowser_({reportData, userAgent}) {
    /** @type {!IWebDriver} */
    const driver = await this.createWebDriver_({reportData, userAgent});

    const logResult = (verb) => {
      /* eslint-disable camelcase */
      const {os_name, os_version, browser_name, browser_version} = userAgent.navigator;
      console.log(`${verb} ${browser_name} ${browser_version} on ${os_name} ${os_version}!`);
      /* eslint-enable camelcase */
    };

    try {
      await this.driveBrowser_({reportData, userAgent, driver});
      logResult('Finished');
    } catch (err) {
      logResult('Failed');
      throw err;
    } finally {
      logResult('Quitting');
      await driver.quit();
    }
  }

  /**
   * @return {!Promise<number>}
   * @private
   */
  async getMaxParallelTests_() {
    const startTimeMs = Date.now();

    while (true) {
      /** @type {!mdc.proto.cbt.CbtConcurrencyStats} */
      const stats = await this.cbtApi_.fetchConcurrencyStats();
      const active = stats.active_concurrent_selenium_tests;
      const max = stats.max_concurrent_selenium_tests;

      if (active === max) {
        const elapsedTimeMs = Date.now() - startTimeMs;
        const elapsedTimeHuman = Duration.millis(elapsedTimeMs).toHumanShort();
        if (elapsedTimeMs > CBT_CONCURRENCY_MAX_WAIT_MS) {
          throw new Error(`Timed out waiting for CBT resources to become available after ${elapsedTimeHuman}`);
        }

        const waitTimeMs = CBT_CONCURRENCY_POLL_INTERVAL_MS;
        const waitTimeHuman = Duration.millis(waitTimeMs).toHumanShort();
        console.warn(
          `Parallel execution limit reached. ${max} tests are already running on CBT. Will retry in ${waitTimeHuman}...`
        );
        await this.sleep_(waitTimeMs);
        continue;
      }

      if (this.cli_.maxParallels) {
        return max - active;
      }

      // If nobody else is running any tests, run half the number of concurrent tests allowed by our CBT account.
      // This gives us _some_ parallelism while still allowing other users to run their tests.
      // If someone else is already running tests, only run one test at a time.
      return active === 0 ? Math.ceil(max / 2) : 1;
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!Promise<!IWebDriver>}
   */
  async createWebDriver_({reportData, userAgent}) {
    const meta = reportData.meta;
    const driverBuilder = new Builder();

    /** @type {!selenium.proto.RawCapabilities} */
    const desiredCapabilities = await this.getDesiredCapabilities_({meta, userAgent});
    userAgent.desired_capabilities = desiredCapabilities;
    driverBuilder.withCapabilities(desiredCapabilities);

    const isOnline = await this.cli_.isOnline();
    if (isOnline) {
      driverBuilder.usingServer(this.cbtApi_.getSeleniumServerUrl());
    }

    console.log(`Starting ${userAgent.alias}...`);

    /** @type {!IWebDriver} */
    const driver = await driverBuilder.build();

    /** @type {!selenium.proto.RawCapabilities} */
    const actualCapabilities = await this.getActualCapabilities_(driver);

    /** @type {!mdc.proto.UserAgent.Navigator} */
    const navigator = await this.getUserAgentNavigator_(driver);

    /* eslint-disable camelcase */
    const {os_name, os_version, browser_name, browser_version} = navigator;

    userAgent.navigator = navigator;
    userAgent.actual_capabilities = actualCapabilities;
    userAgent.browser_version_value = browser_version;
    userAgent.image_filename_suffix = this.getImageFileNameSuffix_(userAgent);

    console.log(`Started ${browser_name} ${browser_version} on ${os_name} ${os_version}!`);
    /* eslint-enable camelcase */

    return driver;
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!selenium.proto.RawCapabilities}
   * @private
   */
  async getDesiredCapabilities_({meta, userAgent}) {
    const isOnline = await this.cli_.isOnline();
    if (isOnline) {
      return await this.cbtApi_.getDesiredCapabilities_({meta, userAgent});
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
   * @return {!Promise<!selenium.proto.RawCapabilities>}
   * @private
   */
  async getActualCapabilities_(driver) {
    /** @type {!Capabilities} */
    const driverCaps = await driver.getCapabilities();

    /** @type {!selenium.proto.RawCapabilities} */
    const actualCaps = RawCapabilities.create();

    for (const key of driverCaps.keys()) {
      actualCaps[key] = driverCaps.get(key);
    }

    return actualCaps;
  }

  /**
   * @param {!IWebDriver} driver
   * @return {mdc.proto.UserAgent.Navigator}
   * @private
   */
  async getUserAgentNavigator_(driver) {
    const uaString = await driver.executeScript('return window.navigator.userAgent;');
    const uaParsed = UserAgentParser.parse(uaString);

    // TODO(acdvorak): Clean this up
    const navigator = Navigator.create({
      os_name: uaParsed.os.family.toLowerCase().startsWith('mac') ? 'Mac' : uaParsed.os.family,
      os_version: uaParsed.os.toVersion().replace(/(?:\.0)+$/, ''),
      browser_name: uaParsed.family.replace(/\s*Mobile\s*/, ''),
      browser_version: uaParsed.toVersion().replace(/(?:\.0)+$/, ''),
    });

    // TODO(acdvorak): De-dupe
    /* eslint-disable camelcase */
    const {browser_name, browser_version, os_name, os_version} = navigator;
    navigator.full_name = [browser_name, browser_version, 'on', os_name, os_version].join(' ');
    /* eslint-enable camelcase */

    return navigator;
  }

  /**
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {string}
   * @private
   */
  getImageFileNameSuffix_(userAgent) {
    /* eslint-disable camelcase */
    const {os_name, browser_name, browser_version} = userAgent.navigator;
    return [os_name, browser_name, browser_version].map((value) => {
      // TODO(acdvorak): Clean this up
      return value.toLowerCase().replace(/\..+$/, '').replace(/[^a-z0-9]+/ig, '');
    }).join('_');
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
    if (userAgent.form_factor_type === FormFactorType.DESKTOP) {
      /** @type {!Window} */
      const window = driver.manage().window();

      // Resize the browser window to roughly match a mobile browser.
      // This reduces the byte size of the screenshot image, which speeds up the test significantly.
      // TODO(acdvorak): Set this value dynamically
      await window.setRect({x: 0, y: 0, width: 400, height: 800}).catch(() => undefined);
    }

    const meta = reportData.meta;

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const screenshotQueue = reportData.screenshots.runnable_screenshot_browser_map[userAgent.alias].screenshots;

    for (const screenshot of screenshotQueue) {
      screenshot.capture_state = CaptureState.RUNNING;

      const diffImageResult = await this.takeScreenshotWithRetries_({driver, userAgent, screenshot, meta});

      screenshot.capture_state = CaptureState.DIFFED;
      screenshot.diff_image_result = diffImageResult;
      screenshot.diff_image_file = diffImageResult.diff_image_file;

      if (diffImageResult.has_changed) {
        reportData.screenshots.changed_screenshot_list.push(screenshot);
      } else {
        reportData.screenshots.unchanged_screenshot_list.push(screenshot);
      }
    }
  }

  /**
   * @param {!IWebDriver} driver
   * @param {!mdc.proto.UserAgent} userAgent
   * @param {!mdc.proto.Screenshot} screenshot
   * @param {!mdc.proto.ReportMeta} meta
   * @return {!Promise<!mdc.proto.DiffImageResult>}
   * @private
   */
  async takeScreenshotWithRetries_({driver, userAgent, screenshot, meta}) {
    const htmlFilePath = screenshot.html_file_path;
    let delayMs = 0;

    /** @type {?mdc.proto.DiffImageResult} */
    let diffImageResult = null;

    /** @type {?number} */
    let changedPixelCount = null;

    while (screenshot.retry_count <= screenshot.max_retries) {
      if (screenshot.retry_count > 0) {
        const {width, height} = diffImageResult.diff_image_dimensions;
        const retryMsg = `Retrying ${htmlFilePath} > ${userAgent.alias}`;
        const countMsg = `attempt ${screenshot.retry_count} of ${screenshot.max_retries}`;
        const pixelMsg = `${changedPixelCount.toLocaleString()} pixels differed`;
        const deltaMsg = `${diffImageResult.changed_pixel_percentage}% of ${width}x${height}`;
        console.warn(`${retryMsg} (${countMsg}). ${pixelMsg} (${deltaMsg})`);
        delayMs = 1000;
      }

      screenshot.actual_image_file = await this.takeScreenshotWithoutRetries_({
        meta, screenshot, userAgent, driver, delayMs,
      });
      diffImageResult = await this.imageDiffer_.compareOneScreenshot({meta, screenshot});

      if (!diffImageResult.has_changed) {
        break;
      }

      changedPixelCount = diffImageResult.changed_pixel_count;
      screenshot.retry_count++;
    }

    return diffImageResult;
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.Screenshot} screenshot
   * @param {!mdc.proto.UserAgent} userAgent
   * @param {!IWebDriver} driver
   * @param {number=} delayMs
   * @return {!Promise<!mdc.proto.TestFile>}
   * @private
   */
  async takeScreenshotWithoutRetries_({meta, screenshot, userAgent, driver, delayMs = 0}) {
    const htmlFilePath = screenshot.html_file_path;
    const htmlFileUrl = screenshot.actual_html_file.public_url;
    const imageBuffer = await this.capturePageAsPng_({driver, userAgent, url: htmlFileUrl, delayMs});
    const imageFileNameSuffix = userAgent.image_filename_suffix;
    const imageFilePathRelative = `${htmlFilePath}.${imageFileNameSuffix}.png`;
    const imageFilePathAbsolute = path.resolve(meta.local_screenshot_image_base_dir, imageFilePathRelative);

    mkdirp.sync(path.dirname(imageFilePathAbsolute));
    await fs.writeFile(imageFilePathAbsolute, imageBuffer, {encoding: null});

    return TestFile.create({
      relative_path: imageFilePathRelative,
      absolute_path: imageFilePathAbsolute,
      public_url: meta.remote_upload_base_url + meta.remote_upload_base_dir + imageFilePathRelative,
    });
  }

  /**
   * @param {!IWebDriver} driver
   * @param {!mdc.proto.UserAgent} userAgent
   * @param {string} url
   * @param {number=} delayMs
   * @return {!Promise<!Buffer>} Buffer containing PNG image data for the cropped screenshot image
   * @private
   */
  async capturePageAsPng_({driver, userAgent, url, delayMs = 0}) {
    console.log(`GET ${url} > ${userAgent.alias}...`);

    await driver.get(url);
    await driver.executeScript('window.mdc.testFixture.attachFontObserver();');
    await driver.wait(until.elementLocated(By.css('[data-fonts-loaded]')), SELENIUM_FONT_LOAD_WAIT_MS);

    if (delayMs > 0) {
      await driver.sleep(delayMs);
    }

    const uncroppedImageBuffer = Buffer.from(await driver.takeScreenshot(), 'base64');
    const croppedImageBuffer = await this.imageCropper_.autoCropImage(uncroppedImageBuffer);

    const uncroppedJimpImage = await Jimp.read(uncroppedImageBuffer);
    const croppedJimpImage = await Jimp.read(croppedImageBuffer);

    const {width: uncroppedWidth, height: uncroppedHeight} = uncroppedJimpImage.bitmap;
    const {width: croppedWidth, height: croppedHeight} = croppedJimpImage.bitmap;

    console.info(`
Cropped ${url} > ${userAgent.alias} image from ${uncroppedWidth}x${uncroppedHeight} to ${croppedWidth}x${croppedHeight}
`.trim());

    return croppedImageBuffer;
  }

  /**
   * @param {number} ms
   * @return {!Promise<void>}
   * @private
   */
  async sleep_(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = SeleniumApi;
