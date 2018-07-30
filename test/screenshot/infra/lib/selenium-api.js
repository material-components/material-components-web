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
const VError = require('verror');
const UserAgentParser = require('useragent');
const colors = require('colors/safe');
const path = require('path');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const seleniumProto = require('../proto/selenium.pb').selenium.proto;

const {Screenshot, TestFile, UserAgent} = mdcProto;
const {CaptureState, InclusionType} = Screenshot;
const {BrowserVendorType, Navigator} = UserAgent;
const {RawCapabilities} = seleniumProto;

const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const Constants = require('./constants');
const Duration = require('./duration');
const GitHubApi = require('./github-api');
const ImageCropper = require('./image-cropper');
const ImageDiffer = require('./image-differ');
const LocalStorage = require('./local-storage');
const {Browser, Builder, By, logging, until} = require('selenium-webdriver');
const {CBT_CONCURRENCY_POLL_INTERVAL_MS, CBT_CONCURRENCY_MAX_WAIT_MS, ExitCode} = Constants;
const {SELENIUM_FONT_LOAD_WAIT_MS} = Constants;

/**
 * @typedef {{
 *   name: string,
 *   color: !CliColor,
 * }} CliStatus
 */

const CliStatuses = {
  ACTIVE: {name: 'Active', color: colors.bold.cyan},
  QUEUED: {name: 'Queued', color: colors.cyan},
  WAITING: {name: 'Waiting', color: colors.magenta},
  STARTING: {name: 'Starting', color: colors.green},
  STARTED: {name: 'Started', color: colors.bold.green},
  GET: {name: 'Get', color: colors.bold.white},
  CROP: {name: 'Crop', color: colors.white},
  PASS: {name: 'Pass', color: colors.green},
  ADD: {name: 'Add', color: colors.bgGreen.black},
  FAIL: {name: 'Fail', color: colors.red},
  RETRY: {name: 'Retry', color: colors.magenta},
  CAPTURED: {name: 'Captured', color: colors.bold.grey},
  FINISHED: {name: 'Finished', color: colors.bold.green},
  FAILED: {name: 'Failed', color: colors.bold.red},
  QUITTING: {name: 'Quitting', color: colors.white},
};

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
     * @type {!GitHubApi}
     * @private
     */
    this.gitHubApi_ = new GitHubApi();

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

    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();

    /**
     * @type {!Set<string>}
     * @private
     */
    this.seleniumSessionIds_ = new Set();

    /**
     * @type {number}
     * @private
     */
    this.numPending_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.numCompleted_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.numChanged_ = 0;

    /**
     * @type {boolean}
     * @private
     */
    this.isKilled_ = false;

    if (this.cli_.isOnline()) {
      this.killBrowsersOnExit_();
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages(reportData) {
    const runnableUserAgents = reportData.user_agents.runnable_user_agents;
    let queuedUserAgents = runnableUserAgents.slice();
    let runningUserAgents;

    this.numPending_ = reportData.screenshots.runnable_screenshot_list.length;
    this.numCompleted_ = 0;

    function getLoggableAliases(userAgentAliases) {
      return userAgentAliases.length > 0 ? userAgentAliases.join(', ') : '(none)';
    }

    while (queuedUserAgents.length > 0) {
      const maxParallelTests = await this.getMaxParallelTests_();
      runningUserAgents = queuedUserAgents.slice(0, maxParallelTests);
      queuedUserAgents = queuedUserAgents.slice(maxParallelTests);
      const runningUserAgentAliases = runningUserAgents.map((ua) => ua.alias);
      const queuedUserAgentAliases = queuedUserAgents.map((ua) => ua.alias);
      const runningUserAgentLoggable = getLoggableAliases(runningUserAgentAliases);
      const queuedUserAgentLoggable = getLoggableAliases(queuedUserAgentAliases);
      this.logStatus_(CliStatuses.ACTIVE, runningUserAgentLoggable);
      this.logStatus_(CliStatuses.QUEUED, queuedUserAgentLoggable);
      await this.captureAllPagesInAllBrowsers_({reportData, userAgents: runningUserAgents});
    }

    console.log('');

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

    /** @type {!Session} */
    const session = await driver.getSession();
    const seleniumSessionId = session.getId();
    let changedScreenshots;

    this.seleniumSessionIds_.add(seleniumSessionId);

    const logResult = (status, ...args) => {
      /* eslint-disable camelcase */
      const {os_name, os_version, browser_name, browser_version} = userAgent.navigator;
      this.logStatus_(status, `${browser_name} ${browser_version} on ${os_name} ${os_version}!`, ...args);
      /* eslint-enable camelcase */
    };

    try {
      changedScreenshots = (await this.driveBrowser_({reportData, userAgent, driver})).changedScreenshots;
      await this.printBrowserConsoleLogs_(driver);
      logResult(CliStatuses.FINISHED);
    } catch (err) {
      logResult(CliStatuses.FAILED);
      await this.killBrowsers_();
      throw new VError(err, 'Failed to drive web browser');
    } finally {
      logResult(CliStatuses.QUITTING);
      await driver.quit();
      this.seleniumSessionIds_.delete(seleniumSessionId);
    }

    if (this.cli_.isOnline()) {
      await this.cbtApi_.setTestScore({
        seleniumSessionId,
        changedScreenshots,
      });
    }
  }

  /**
   * @param {!IWebDriver} driver
   * @return {!Promise<void>}
   * @private
   */
  async printBrowserConsoleLogs_(driver) {
    const log = driver.manage().logs();

    // Chrome is the only browser that supports logging as of 2018-07-20.
    const logEntries = (await log.get(logging.Type.BROWSER).catch(() => [])).filter((logEntry) => {
      // Ignore messages about missing favicon
      return logEntry.message.indexOf('favicon.ico') === -1;
    });

    if (logEntries.length > 0) {
      const messageColor = colors.bold.red('Browser console log:');
      console.log(`\n\n${messageColor}\n`, JSON.stringify(logEntries, null, 2), '\n');
    }
  }

  /**
   * @return {!Promise<number>}
   * @private
   */
  async getMaxParallelTests_() {
    if (this.cli_.isOffline()) {
      return 1;
    }

    const startTimeMs = Date.now();

    while (true) {
      /** @type {!cbt.proto.CbtConcurrencyStats} */
      const stats = await this.cbtApi_.fetchConcurrencyStats();
      const active = stats.active_concurrent_selenium_tests;
      const max = stats.max_concurrent_selenium_tests;
      const available = max - active;

      if (!available) {
        const elapsedTimeMs = Date.now() - startTimeMs;
        const elapsedTimeHuman = Duration.millis(elapsedTimeMs).toHumanShort();
        if (elapsedTimeMs > CBT_CONCURRENCY_MAX_WAIT_MS) {
          throw new Error(`Timed out waiting for CBT resources to become available after ${elapsedTimeHuman}`);
        }

        const waitTimeMs = CBT_CONCURRENCY_POLL_INTERVAL_MS;
        const waitTimeHuman = Duration.millis(waitTimeMs).toHumanShort();
        this.logStatus_(
          CliStatuses.WAITING,
          `Parallel execution limit reached. ${max} tests are already running on CBT. Will retry in ${waitTimeHuman}...`
        );
        await this.sleep_(waitTimeMs);
        continue;
      }

      const requested = Math.min(this.cli_.parallels, available);

      // If nobody else is running any tests, run half the number of concurrent tests allowed by our CBT account.
      // This gives us _some_ parallelism while still allowing other users to run their tests.
      // If someone else is already running tests, only run one test at a time.
      const half = active === 0 ? Math.ceil(max / 2) : 1;

      return requested === 0 ? half : requested;
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

    const isOnline = this.cli_.isOnline();
    if (isOnline) {
      driverBuilder.usingServer(this.cbtApi_.getSeleniumServerUrl());
    }

    this.logStatus_(CliStatuses.STARTING, `${userAgent.alias}...`);

    /** @type {!IWebDriver} */
    const driver = await this.buildWebDriverWithRetries_(driverBuilder);

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

    this.logStatus_(CliStatuses.STARTED, `${browser_name} ${browser_version} on ${os_name} ${os_version}!`);
    /* eslint-enable camelcase */

    return driver;
  }

  /**
   * @param {!Builder} driverBuilder
   * @param {number=} startTimeMs
   * @return {!Promise<!IWebDriver>}
   * @private
   */
  async buildWebDriverWithRetries_(driverBuilder, startTimeMs = Date.now()) {
    try {
      return await driverBuilder.build();
    } catch (err) {
      if (err.message.indexOf('maximum number of parallel') === -1) {
        throw new VError(err, 'WebDriver instance could not be created');
      }
    }

    /** @type {!cbt.proto.CbtConcurrencyStats} */
    const concurrencyStats = await this.cbtApi_.fetchConcurrencyStats();
    const max = concurrencyStats.max_concurrent_selenium_tests;

    // TODO(acdvorak): De-dupe this with getMaxParallelTests_()
    const elapsedTimeMs = Date.now() - startTimeMs;
    const elapsedTimeHuman = Duration.millis(elapsedTimeMs).toHumanShort();
    if (elapsedTimeMs > CBT_CONCURRENCY_MAX_WAIT_MS) {
      throw new Error(`Timed out waiting for CBT resources to become available after ${elapsedTimeHuman}`);
    }

    // TODO(acdvorak): De-dupe this with getMaxParallelTests_()
    const waitTimeMs = CBT_CONCURRENCY_POLL_INTERVAL_MS;
    const waitTimeHuman = Duration.millis(waitTimeMs).toHumanShort();
    this.logStatus_(
      CliStatuses.WAITING,
      `Parallel execution limit reached. ${max} tests are already running on CBT. Will retry in ${waitTimeHuman}...`
    );
    await this.sleep_(waitTimeMs);

    return this.buildWebDriverWithRetries_(driverBuilder, startTimeMs);
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!selenium.proto.RawCapabilities}
   * @private
   */
  async getDesiredCapabilities_({meta, userAgent}) {
    if (this.cli_.isOnline()) {
      return this.cbtApi_.getDesiredCapabilities({meta, userAgent});
    }
    return this.createDesiredCapabilitiesOffline_({userAgent});
  }

  /**
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!selenium.proto.RawCapabilities}
   * @private
   */
  createDesiredCapabilitiesOffline_({userAgent}) {
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
   * @return {Promise<{
   *   changedScreenshots: !Array<!mdc.proto.Screenshot>,
   *   unchangedScreenshots: !Array<!mdc.proto.Screenshot>,
   * }>}
   * @private
   */
  async driveBrowser_({reportData, userAgent, driver}) {
    const meta = reportData.meta;

    /** @type {!Array<!mdc.proto.Screenshot>} */ const changedScreenshots = [];
    /** @type {!Array<!mdc.proto.Screenshot>} */ const unchangedScreenshots = [];

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const screenshotQueueAll = reportData.screenshots.runnable_screenshot_browser_map[userAgent.alias].screenshots;

    // TODO(acdvorak): Find a better way to do this
    const screenshotQueues = [
      [true, screenshotQueueAll.filter((screenshot) => this.isSmallComponent_(screenshot.html_file_path))],
      [false, screenshotQueueAll.filter((screenshot) => !this.isSmallComponent_(screenshot.html_file_path))],
    ];

    for (const [isSmallComponent, screenshotQueue] of screenshotQueues) {
      if (screenshotQueue.length === 0) {
        continue;
      }

      await this.resizeWindow_({driver, isSmallComponent});

      for (const screenshot of screenshotQueue) {
        screenshot.capture_state = CaptureState.RUNNING;

        const diffImageResult = await this.takeScreenshotWithRetries_({driver, userAgent, screenshot, meta});

        screenshot.capture_state = CaptureState.DIFFED;
        screenshot.diff_image_result = diffImageResult;
        screenshot.diff_image_file = diffImageResult.diff_image_file;

        this.numPending_--;
        this.numCompleted_++;

        const message = `${screenshot.actual_html_file.public_url} > ${screenshot.user_agent.alias}`;

        if (diffImageResult.has_changed) {
          changedScreenshots.push(screenshot);
          this.numChanged_++;
          this.logStatus_(CliStatuses.FAIL, message);
        } else {
          unchangedScreenshots.push(screenshot);

          if (screenshot.inclusion_type === InclusionType.ADD) {
            this.logStatus_(CliStatuses.ADD, message);
          } else {
            this.logStatus_(CliStatuses.PASS, message);
          }
        }
      }
    }

    reportData.screenshots.changed_screenshot_list.push(...changedScreenshots);
    reportData.screenshots.unchanged_screenshot_list.push(...unchangedScreenshots);

    return {changedScreenshots, unchangedScreenshots};
  }

  /**
   * @param {string} url
   * @return {boolean}
   * @private
   */
  isSmallComponent_(url) {
    // TODO(acdvorak): Find a better way to do this
    const smallComponentNames = [
      'animation', 'button', 'card', 'checkbox', 'chips', 'elevation', 'fab', 'icon-button', 'icon-toggle',
      'list', 'menu', 'radio', 'ripple', 'select', 'switch', 'textfield', 'theme', 'tooltip', 'typography',
    ];
    return new RegExp(`/mdc-(${smallComponentNames.join('|')})/`).test(url);
  }

  /**
   * @param {!IWebDriver} driver
   * @param {boolean} isSmallComponent
   * @return {!Promise<{x: number, y: number, width: number, height: number}>}
   * @private
   */
  async resizeWindow_({driver, isSmallComponent}) {
    /** @type {!Window} */
    const window = driver.manage().window();
    const rect = isSmallComponent
      ? {x: 0, y: 0, width: 400, height: 768}
      : {x: 0, y: 0, width: 1366, height: 768}
    ;
    await window.setRect(rect).catch(() => undefined);
    return rect;
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
    let delayMs = 0;

    /** @type {?mdc.proto.DiffImageResult} */
    let diffImageResult = null;
    let changedPixelCount = 0;
    let changedPixelFraction = 0;
    const maxPixelFraction = require('../../diffing.json').flaky_tests.max_auto_retry_changed_pixel_fraction;

    while (screenshot.retry_count <= screenshot.max_retries && changedPixelFraction <= maxPixelFraction) {
      if (screenshot.retry_count > 0) {
        const {width, height} = diffImageResult.diff_image_dimensions;
        const whichMsg = `${screenshot.actual_html_file.public_url} > ${userAgent.alias}`;
        const countMsg = `attempt ${screenshot.retry_count} of ${screenshot.max_retries}`;
        const pixelMsg = `${changedPixelCount.toLocaleString()} pixels differed`;
        const deltaMsg = `${diffImageResult.changed_pixel_percentage}% of ${width}x${height}`;
        this.logStatus_(CliStatuses.RETRY, `${whichMsg} (${countMsg}). ${pixelMsg} (${deltaMsg})`);
        delayMs = 500;
      }

      screenshot.actual_image_file = await this.takeScreenshotWithoutRetries_({
        meta, screenshot, userAgent, driver, delayMs,
      });
      diffImageResult = await this.imageDiffer_.compareOneScreenshot({meta, screenshot});

      if (!diffImageResult.has_changed) {
        break;
      }

      changedPixelCount = diffImageResult.changed_pixel_count;
      changedPixelFraction = diffImageResult.changed_pixel_fraction;
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

    await this.localStorage_.writeBinaryFile(imageFilePathAbsolute, imageBuffer);

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
    this.logStatus_(CliStatuses.GET, `${url} > ${userAgent.alias}...`);

    const isOnline = this.cli_.isOnline();
    const fontTimeoutMs = isOnline ? SELENIUM_FONT_LOAD_WAIT_MS : 500;

    await driver.get(url);
    await driver.wait(until.elementLocated(By.css('[data-fonts-loaded]')), fontTimeoutMs).catch(() => 0);

    if (delayMs > 0) {
      await driver.sleep(delayMs);
    }

    const uncroppedImageBuffer = Buffer.from(await driver.takeScreenshot(), 'base64');
    const croppedImageBuffer = await this.imageCropper_.autoCropImage(uncroppedImageBuffer);

    const uncroppedJimpImage = await Jimp.read(uncroppedImageBuffer);
    const croppedJimpImage = await Jimp.read(croppedImageBuffer);

    const {width: uncroppedWidth, height: uncroppedHeight} = uncroppedJimpImage.bitmap;
    const {width: croppedWidth, height: croppedHeight} = croppedJimpImage.bitmap;

    const message = `${url} > ${userAgent.alias} screenshot from ` +
      `${uncroppedWidth}x${uncroppedHeight} to ${croppedWidth}x${croppedHeight}`;
    this.logStatus_(CliStatuses.CROP, message);

    return croppedImageBuffer;
  }

  /** @private */
  killBrowsersOnExit_() {
    // catches ctrl+c event
    process.on('SIGINT', () => {
      const exit = () => process.exit(ExitCode.SIGINT);
      this.killBrowsers_().then(exit, exit);
    });

    // catches "kill pid"
    process.on('SIGTERM', () => {
      const exit = () => process.exit(ExitCode.SIGTERM);
      this.killBrowsers_().then(exit, exit);
    });

    process.on('uncaughtException', (err) => {
      console.error(err);
      const exit = () => process.exit(ExitCode.UNCAUGHT_EXCEPTION);
      this.killBrowsers_().then(exit, exit);
    });

    process.on('unhandledRejection', (err) => {
      console.error(err);
      const exit = () => process.exit(ExitCode.UNHANDLED_PROMISE_REJECTION);
      this.killBrowsers_().then(exit, exit);
    });
  }

  /** @private */
  async killBrowsers_() {
    if (this.cli_.isOffline()) {
      return;
    }

    const ids = Array.from(this.seleniumSessionIds_);
    const wasAlreadyKilled = this.isKilled_;

    if (!wasAlreadyKilled) {
      console.log('\n');
    }

    this.isKilled_ = true;

    await this.cbtApi_.killSeleniumTests(ids, /* silent */ wasAlreadyKilled);

    if (!wasAlreadyKilled && ids.length > 0) {
      console.log('\nWaiting for CBT cancellation requests to complete...');
      await this.sleep_(Duration.seconds(4).toMillis());
    }
  }

  /**
   * @param {number} ms
   * @return {!Promise<void>}
   * @private
   */
  async sleep_(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * @param {!CliStatus} status
   * @param {*} args
   * @private
   */
  logStatus_(status, ...args) {
    // Don't output misleading errors
    if (this.isKilled_) {
      return;
    }

    // https://stackoverflow.com/a/6774395/467582
    const escape = String.fromCodePoint(27);
    const eraseCurrentLine = `\r${escape}[K`;
    const maxStatusWidth = Object.values(CliStatuses).map((status) => status.name.length).sort().reverse()[0];
    const statusName = status.name.toUpperCase();
    const paddingSpaces = ''.padStart(maxStatusWidth - statusName.length, ' ');

    console.log(eraseCurrentLine + paddingSpaces + status.color(statusName) + ':', ...args);

    const numDone = this.numCompleted_;
    const strDone = numDone.toLocaleString();

    const numTotal = numDone + this.numPending_;
    const strTotal = numTotal.toLocaleString();

    const numChanged = this.numChanged_;
    const strChanged = numChanged.toLocaleString();

    const numPercent = numTotal > 0 ? (100 * numDone / numTotal) : 0;
    const strPercent = numPercent.toFixed(1);

    if (process.env.TRAVIS === 'true') {
      this.gitHubApi_.setPullRequestStatusManual({
        state: GitHubApi.PullRequestState.PENDING,
        description: `${strDone} of ${strTotal} (${strPercent}%) - ${strChanged} diffs`,
      });
      return;
    }

    const pending = this.numPending_;
    const completed = numDone;
    const total = pending + completed;
    const percent = (total === 0 ? 0 : (100 * completed / total).toFixed(1));

    const colorCaptured = CliStatuses.CAPTURED.color(CliStatuses.CAPTURED.name.toUpperCase());
    const colorCompleted = colors.bold.white(completed.toLocaleString());
    const colorTotal = colors.bold.white(total.toLocaleString());
    const colorPercent = colors.bold.white(`${percent}%`);

    process.stdout.write(`${colorCaptured}: ${colorCompleted} of ${colorTotal} screenshots (${colorPercent} complete)`);
  }
}

module.exports = SeleniumApi;
