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
const UserAgentParser = require('useragent');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const seleniumProto = require('../proto/selenium.pb').selenium.proto;

const {TestFile, UserAgent} = mdcProto;
const {BrowserVendorType, FormFactorType, Navigator} = UserAgent;
const {RawCapabilities} = seleniumProto;

const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const Duration = require('./duration');
const ImageCropper = require('./image-cropper');
const {Browser, Builder, By, until} = require('selenium-webdriver');
const {CBT_CONCURRENCY_POLL_INTERVAL_MS, CBT_CONCURRENCY_MAX_WAIT_MS} = require('./constants');

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
      await this.captureAllPagesInBrowsers_({reportData, userAgents: runningUserAgents});
    }

    return reportData;
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!Array<!mdc.proto.UserAgent>} userAgents
   * @return {!Promise<void>}
   * @private
   */
  async captureAllPagesInBrowsers_({reportData, userAgents}) {
    const promises = [];
    for (const userAgent of userAgents) {
      promises.push(this.captureAllPagesInBrowser_({reportData, userAgent}));
    }
    await Promise.all(promises);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!Promise<void>}
   * @private
   */
  async captureAllPagesInBrowser_({reportData, userAgent}) {
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
    // await driver.get('http://www.google.com/ncr');
    // await driver.findElement(By.name('q')).sendKeys('webdriver');
    // await driver.findElement(By.name('btnK')).click();
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    // await driver.sleep(1000 * 10);

    // TODO(acdvorak): Set this value dynamically
    // TODO(acdvorak): This blows up on mobile browsers
    // NOTE(acdvorak): Setting smaller window dimensions appears to speed up the tests significantly.
    if (userAgent.form_factor_type === FormFactorType.DESKTOP) {
      // TODO(acdvorak): Better `catch()` handler
      /** @type {!Window} */
      const window = driver.manage().window();
      await window.setRect({x: 0, y: 0, width: 400, height: 800}).catch(() => undefined);
    }

    const meta = reportData.meta;

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const screenshotQueue = reportData.screenshots.runnable_screenshot_browser_map[userAgent.alias].screenshots;

    for (const screenshot of screenshotQueue) {
      const htmlFilePath = screenshot.html_file_path;
      const htmlFileUrl = screenshot.actual_html_file.public_url;

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
    console.log(`GET "${url}" > ${userAgent.alias}...`);

    await driver.get(url);
    await driver.executeScript(`
var timeout;
var interval;
var callback = arguments[arguments.length - 1];

interval = setInterval(function() {
  if (window.mdc) {
    window.mdc.testFixture.waitForFontsToLoad(function() { /*callback();*/ });
    clearInterval(interval);
    clearTimeout(timeout);
  }
}, 100);

timeout = setTimeout(function() {
  /*callback();*/
  clearInterval(interval);
  clearTimeout(timeout);
}, 1000);
`);
    // TODO(acdvorak): Create a constant for font loading timeout values
    await driver.wait(until.elementLocated(By.css('[data-fonts-loaded]')), 3000);

    const uncroppedBase64Str = await driver.takeScreenshot();
    const uncroppedPngBuffer = Buffer.from(uncroppedBase64Str, 'base64');

    return this.imageCropper_.autoCropImage(uncroppedPngBuffer);
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
