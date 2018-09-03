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

require('url-search-params-polyfill');

const Jimp = require('jimp');
const VError = require('verror');
const UserAgentParser = require('useragent');
const path = require('path');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const seleniumProto = require('../proto/selenium.pb').selenium.proto;

const {CropResult, Screenshot, TestFile, UserAgent} = mdcProto;
const {CaptureState, InclusionType} = Screenshot;
const {BrowserVendorType, Navigator} = UserAgent;
const {RawCapabilities} = seleniumProto;

const Analytics = require('./analytics');
const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const CliColor = require('./logger').colors;
const Constants = require('./constants');
const Duration = require('./duration');
const GitHubApi = require('./github-api');
const ImageCropper = require('./image-cropper');
const ImageDiffer = require('./image-differ');
const LocalStorage = require('./local-storage');
const getStackTrace = require('./stacktrace')('SeleniumApi');
const {Browser, Builder, By, logging, until} = require('selenium-webdriver');
const {CBT_CONCURRENCY_POLL_INTERVAL_MS, CBT_CONCURRENCY_MAX_WAIT_MS, ExitCode} = Constants;

/**
 * @typedef {{
 *   name: string,
 *   color: !AnsiColor,
 * }} CliStatus
 */

const CliStatuses = {
  ACTIVE: {name: 'Active', color: CliColor.bold.cyan},
  QUEUED: {name: 'Queued', color: CliColor.cyan},
  WAITING: {name: 'Waiting', color: CliColor.magenta},
  STARTING: {name: 'Starting', color: CliColor.green},
  STARTED: {name: 'Started', color: CliColor.bold.green},
  GET: {name: 'Get', color: CliColor.bold.white},
  PASS: {name: 'Pass', color: CliColor.green},
  ADD: {name: 'Add', color: CliColor.bgGreen.black},
  FAIL: {name: 'Fail', color: CliColor.red},
  RETRY: {name: 'Retry', color: CliColor.magenta},
  CAPTURED: {name: 'Captured', color: CliColor.bold.grey},
  FINISHED: {name: 'Finished', color: CliColor.bold.green},
  ERROR: {name: 'Error', color: CliColor.bold.red},
  QUITTING: {name: 'Quitting', color: CliColor.white},
};

class SeleniumApi {
  constructor() {
    /**
     * @type {!Analytics}
     * @private
     */
    this.analytics_ = new Analytics();

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

    /**
     * @type {boolean}
     * @private
     */
    this.isKillRequested_ = false;

    /**
     * @type {number}
     * @private
     */
    this.numSessionsStarted_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.numSessionsEnded_ = 0;

    /**
     * @type {?number}
     * @private
     */
    this.prevNumWaiting_ = null;

    if (this.cli_.isOnline()) {
      this.killBrowsersOnExit_();
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages(reportData) {
    /** @type {string|undefined} */
    let stackTrace;

    try {
      stackTrace = getStackTrace('captureAllPages');
      return await this.captureAllPages_(reportData);
    } catch (err) {
      throw new VError(err, stackTrace);
    } finally {
      await this.killBrowsersGracefully_();
    }
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!mdc.proto.ReportData>}
   */
  async captureAllPages_(reportData) {
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

      /** @type {string|undefined} */
      let stackTrace;

      try {
        stackTrace = getStackTrace('captureAllPages_');
        await this.captureAllPagesInAllBrowsers_({reportData, userAgents: runningUserAgents});
      } catch (err) {
        throw new VError(err, stackTrace);
      }
    }

    // The CLI status line "CAPTURED: 3 of 4 screenshots (75.0% complete)" does not end with a newline. This allows it
    // to be deleted and overwritten in the terminal. We need to print an extra newline here to move the cursor past it.
    console.log('');
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
    /** @type {!VError|!Error|undefined} */
    let runtimeError;

    /** @type {!IWebDriver|undefined} */
    let driver;

    /** @type {string|undefined} */
    let stackTrace;

    this.numSessionsStarted_++;

    try {
      stackTrace = getStackTrace('captureAllPagesInOneBrowser_');
      driver = await this.createWebDriver_({reportData, userAgent});
    } catch (err) {
      runtimeError = new VError(err, stackTrace);
      this.numSessionsEnded_++;
    }

    if (runtimeError) {
      throw runtimeError;
    }

    /** @type {!Session} */
    const session = await driver.getSession();
    const sessionId = session.getId();

    /** @type {?Array<!mdc.proto.Screenshot>} */
    let changedScreenshots;

    this.seleniumSessionIds_.add(sessionId);

    try {
      stackTrace = getStackTrace('captureAllPagesInOneBrowser_');
      changedScreenshots = await this.driveBrowser_({reportData, userAgent, driver});
      this.logSession_(CliStatuses.FINISHED, userAgent);
    } catch (err) {
      runtimeError = new VError(err, stackTrace);
      this.logSession_(CliStatuses.ERROR, userAgent);
    } finally {
      this.numSessionsEnded_++;
      this.logSession_(CliStatuses.QUITTING, userAgent);
      await driver.quit().catch(() => 0);
    }

    if (runtimeError) {
      throw runtimeError;
    }

    if (!changedScreenshots) {
      return;
    }

    this.seleniumSessionIds_.delete(sessionId);

    await this.printBrowserConsoleLogs_(driver);

    if (this.cli_.isOnline()) {
      await this.cbtApi_.setTestScore({
        seleniumSessionId: sessionId,
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
      const messageColor = CliColor.bold.red('Browser console log:');
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

      if (available === 0) {
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

      const cliParallels = this.cli_.parallels;
      if (cliParallels > 0) {
        return Math.min(cliParallels, available);
      }

      // If nobody else is running any tests, run half the number of concurrent tests allowed by our CBT account.
      // This gives us _some_ parallelism while still allowing other users to run their tests.
      if (active === 0) {
        return Math.floor(max / 2);
      }

      // If someone else is already running tests, only run one test at a time.
      return 1;
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

    /** @type {!Session} */
    const session = await driver.getSession();
    const sessionId = session.getId();

    userAgent.navigator = navigator;
    userAgent.browser_version_value = navigator.browser_version;
    userAgent.selenium_session_id = sessionId;
    userAgent.selenium_result_url = await this.cbtApi_.getPublicTestResultUrl(sessionId);
    userAgent.actual_capabilities = actualCapabilities;
    userAgent.image_filename_suffix = this.getImageFileNameSuffix_(userAgent);

    this.logSession_(CliStatuses.STARTED, userAgent);

    return driver;
  }

  /**
   * @param {!Builder} driverBuilder
   * @param {number=} startTimeMs
   * @return {!Promise<!IWebDriver>}
   * @private
   */
  async buildWebDriverWithRetries_(driverBuilder, startTimeMs = Date.now()) {
    // TODO(acdvorak): De-dupe this with getMaxParallelTests_()
    const elapsedTimeMs = Date.now() - startTimeMs;
    const elapsedTimeHuman = Duration.millis(elapsedTimeMs).toHumanShort();
    if (elapsedTimeMs > CBT_CONCURRENCY_MAX_WAIT_MS) {
      throw new Error(`Timed out waiting for CBT resources to become available after ${elapsedTimeHuman}`);
    }

    /** @type {string|undefined} */
    let stackTrace;

    try {
      stackTrace = getStackTrace('buildWebDriverWithRetries_');
      return await driverBuilder.build();
    } catch (err) {
      if (err.message.indexOf('maximum number of parallel') === -1) {
        throw new VError(err, stackTrace);
      }
    }

    /** @type {!cbt.proto.CbtConcurrencyStats} */
    const concurrencyStats = await this.cbtApi_.fetchConcurrencyStats();
    const max = concurrencyStats.max_concurrent_selenium_tests;

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
   * @return {!Promise<?Array<!mdc.proto.Screenshot>>} Changed screenshots
   * @private
   */
  async driveBrowser_({reportData, userAgent, driver}) {
    const meta = reportData.meta;

    /** @type {!Array<!mdc.proto.Screenshot>} */ const changedScreenshots = [];
    /** @type {!Array<!mdc.proto.Screenshot>} */ const unchangedScreenshots = [];

    /** @type {!Array<!mdc.proto.Screenshot>} */
    const screenshotQueueAll = reportData.screenshots.runnable_screenshot_browser_map[userAgent.alias].screenshots;

    // Populate `userAgent.navigator`
    screenshotQueueAll.forEach((screenshot) => {
      screenshot.user_agent = userAgent;
    });

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

        if (this.isKillRequested_ || this.isKilled_) {
          return null;
        }

        await this.takeScreenshotWithRetries_({driver, screenshot, meta});

        this.numPending_--;
        this.numCompleted_++;

        const message = this.createStatusMessage_(screenshot);

        if (screenshot.diff_image_result.has_changed) {
          changedScreenshots.push(screenshot);
          this.numChanged_++;
          this.logStatus_(CliStatuses.FAIL, message);
        } else if (screenshot.inclusion_type === InclusionType.ADD) {
          this.logStatus_(CliStatuses.ADD, message);
        } else {
          unchangedScreenshots.push(screenshot);
          this.logStatus_(CliStatuses.PASS, message);
        }
      }
    }

    reportData.screenshots.changed_screenshot_list.push(...changedScreenshots);
    reportData.screenshots.unchanged_screenshot_list.push(...unchangedScreenshots);

    return changedScreenshots;
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

    // TODO(acdvorak): Put these values in `test/screenshot/diffing.json` or `constants.js`
    const rect = isSmallComponent
      ? {x: 0, y: 0, width: 400, height: 768}
      : {x: 0, y: 0, width: 1366, height: 768}
    ;

    await window.setRect(rect).catch(() => undefined);
    return rect;
  }

  /**
   * @param {!IWebDriver} driver
   * @param {!mdc.proto.Screenshot} screenshot
   * @param {!mdc.proto.ReportMeta} meta
   * @return {!Promise<void>}
   * @private
   */
  async takeScreenshotWithRetries_({driver, screenshot, meta}) {
    const maxRetries = screenshot.flake_config.max_retries;
    const maxPixelFraction = screenshot.flake_config.max_changed_pixel_fraction_to_retry;

    const getChangedPixelFraction = () => {
      return screenshot.diff_image_result ? screenshot.diff_image_result.changed_pixel_fraction : 0;
    };

    while (true) {
      if (this.isKillRequested_ || this.isKilled_) {
        return;
      }

      const isRetryCountExceeded = screenshot.retry_count > maxRetries;
      const isPixelFractionExceeded = getChangedPixelFraction() > maxPixelFraction;
      if (isRetryCountExceeded || isPixelFractionExceeded) {
        break;
      }

      if (screenshot.retry_count > 0) {
        this.logRetry_(screenshot);
      }

      screenshot.actual_image_file = await this.takeScreenshotWithoutRetries_({meta, screenshot, driver});
      screenshot.diff_image_result = await this.imageDiffer_.compareOneScreenshot({meta, screenshot});
      screenshot.diff_image_file = screenshot.diff_image_result.diff_image_file;

      if (!screenshot.diff_image_result.has_changed) {
        break;
      }

      screenshot.retry_count++;
    }

    screenshot.capture_state = CaptureState.DIFFED;
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.Screenshot} screenshot
   * @param {!IWebDriver} driver
   * @return {!Promise<!mdc.proto.TestFile>}
   * @private
   */
  async takeScreenshotWithoutRetries_({meta, screenshot, driver}) {
    const userAgent = screenshot.user_agent;
    const htmlFilePath = screenshot.html_file_path;
    const htmlFileUrl = screenshot.actual_html_file.public_url;
    const imageBuffer = await this.capturePageAsPng_({driver, screenshot, url: htmlFileUrl});
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
   * @param {!mdc.proto.Screenshot} screenshot
   * @param {string} url
   * @return {!Promise<!Buffer>} Buffer containing PNG image data for the cropped screenshot image
   * @private
   */
  async capturePageAsPng_({driver, screenshot, url}) {
    const userAgent = screenshot.user_agent;
    const flakeConfig = screenshot.flake_config;

    const urlWithQsParams = this.analytics_.getUrl({
      url,
      source: 'cbt',
      type: 'selenium',
      extraParams: {
        font_face_observer_timeout_ms: flakeConfig.font_face_observer_timeout_ms,
        fonts_loaded_reflow_delay_ms: flakeConfig.fonts_loaded_reflow_delay_ms,
      },
    });

    this.logStatus_(CliStatuses.GET, `${this.createUrlAliasMessage_(urlWithQsParams, userAgent)}...`);

    const isOnline = this.cli_.isOnline();
    const fontLoadTimeoutMs = isOnline ? flakeConfig.font_face_observer_timeout_ms : 500;

    await driver.get(urlWithQsParams);
    await driver.wait(until.elementLocated(By.css('[data-fonts-loaded]')), fontLoadTimeoutMs).catch(() => 0);

    const delayMs = flakeConfig.retry_delay_ms;
    if (delayMs > 0) {
      await driver.sleep(delayMs);
    }

    const uncroppedImageBuffer = Buffer.from(await driver.takeScreenshot(), 'base64');
    const croppedImageBuffer = await this.imageCropper_.autoCropImage(uncroppedImageBuffer);

    const uncroppedJimpImage = await Jimp.read(uncroppedImageBuffer);
    const croppedJimpImage = await Jimp.read(croppedImageBuffer);

    const {width: uncroppedWidth, height: uncroppedHeight} = uncroppedJimpImage.bitmap;
    const {width: croppedWidth, height: croppedHeight} = croppedJimpImage.bitmap;

    screenshot.crop_result = CropResult.create({
      uncropped_width: uncroppedWidth,
      uncropped_height: uncroppedHeight,
      cropped_width: croppedWidth,
      cropped_height: croppedHeight,
    });

    return croppedImageBuffer;
  }

  /** @private */
  killBrowsersOnExit_() {
    // catches ctrl+c event
    process.on('SIGINT', () => {
      const exit = () => process.exit(ExitCode.SIGINT);
      this.killBrowsersGracefully_().then(exit, exit);
    });

    // catches "kill pid"
    process.on('SIGTERM', () => {
      const exit = () => process.exit(ExitCode.SIGTERM);
      this.killBrowsersGracefully_().then(exit, exit);
    });

    process.on('uncaughtException', (err) => {
      console.error(err);
      const exit = () => process.exit(ExitCode.UNCAUGHT_EXCEPTION);
      this.killBrowsersGracefully_().then(exit, exit);
    });

    process.on('unhandledRejection', (err) => {
      console.error(err);
      const exit = () => process.exit(ExitCode.UNHANDLED_PROMISE_REJECTION);
      this.killBrowsersGracefully_().then(exit, exit);
    });
  }

  /**
   * @return {!Promise<void>}
   * @private
   */
  async killBrowsersGracefully_() {
    this.isKillRequested_ = true;

    const numStarted = this.numSessionsStarted_;
    if (numStarted === 0) {
      return;
    }

    return new Promise((resolve) => {
      const startTimeMs = Date.now();
      const timer = setInterval(() => {
        this.checkIfBrowsersCanBeKilled_(timer, startTimeMs, resolve);
      }, 1000);
    });
  }

  /**
   * @param {!Object} timer
   * @param {number} startTimeMs
   * @param {function()} resolve
   * @private
   */
  checkIfBrowsersCanBeKilled_(timer, startTimeMs, resolve) {
    const numStarted = this.numSessionsStarted_;
    const numEnded = this.numSessionsEnded_;

    const isFinished = numStarted > 0 && numStarted === numEnded;
    const isTimedOut = Duration.hasElapsed(Constants.SELENIUM_KILL_WAIT_MS, startTimeMs);

    if (isFinished || isTimedOut) {
      clearInterval(timer);
      this.killBrowsersImmediately_().then(resolve);
      return;
    }

    const numWaiting = numStarted - numEnded;

    if (numWaiting === 0) {
      clearInterval(timer);
      return;
    }

    // Reduce log spam. Don't print the same message twice in a row.
    if (numWaiting === this.prevNumWaiting_) {
      return;
    }

    const plural = numWaiting === 1 ? '' : 's';
    console.log('');
    console.log(
      CliColor.magenta(
        `Waiting for ${numWaiting} Selenium session${plural} to exit gracefully...`
      )
    );
    console.log('');

    this.prevNumWaiting_ = numWaiting;
  }

  /** @private */
  async killBrowsersImmediately_() {
    if (this.cli_.isOffline()) {
      return;
    }

    const ids = Array.from(this.seleniumSessionIds_);
    const wasAlreadyKilled = this.isKilled_;

    if (!wasAlreadyKilled) {
      console.log('');
      console.log('');
    }

    this.isKilled_ = true;

    await this.cbtApi_.killSeleniumTests(ids, /* silent */ wasAlreadyKilled);
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
   * @param {!mdc.proto.Screenshot} screenshot
   * @return {string}
   * @private
   */
  createStatusMessage_(screenshot) {
    const actualHtmlFileUrlPlain = this.analytics_.getUrl({
      url: screenshot.actual_html_file.public_url,
      source: 'cli',
      type: 'progress',
    });

    let cropColor = '';
    if (screenshot.crop_result && screenshot.crop_result.uncropped_height > 0) {
      const {
        cropped_height: croppedHeight,
        cropped_width: croppedWidth,
        uncropped_height: uncroppedHeight,
        uncropped_width: uncroppedWidth,
      } = screenshot.crop_result;

      const from = CliColor.bold(`${uncroppedWidth}x${uncroppedHeight}`);
      const to = CliColor.bold(`${croppedWidth}x${croppedHeight}`);

      if (croppedHeight === uncroppedHeight && croppedWidth === uncroppedWidth) {
        cropColor = ` (${from}, not cropped)`;
      } else {
        cropColor = ` (cropped from ${from} to ${to})`;
      }
    }

    return this.createUrlAliasMessage_(actualHtmlFileUrlPlain, screenshot.user_agent) + cropColor;
  }

  /**
   * @param {string} url
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {string}
   * @private
   */
  createUrlAliasMessage_(url, userAgent) {
    const userAgentColor = CliColor.bold.italic;
    return `${this.cli_.colorizeUrl(url)} > ${userAgentColor(userAgent.alias)}`;
  }

  /**
   * @param {!CliStatus} status
   * @param {!mdc.proto.UserAgent} userAgent
   * @private
   */
  logSession_(status, userAgent) {
    const navigator = userAgent.navigator;
    const browser = CliColor.bold(`${navigator.browser_name} ${navigator.browser_version}`);
    const os = `${navigator.os_name} ${navigator.os_version}`;
    const sessionId = userAgent.selenium_session_id;
    const publicCbtUrl = CliColor.yellow.underline(userAgent.selenium_result_url);

    this.logStatus_(status, `${browser} on ${os}! - video: ${publicCbtUrl} (Selenium session ID: ${sessionId})`);
  }

  /**
   * @param {!mdc.proto.Screenshot} screenshot
   * @private
   */
  logRetry_(screenshot) {
    const diffImageResult = screenshot.diff_image_result;
    const maxRetries = screenshot.flake_config.max_retries;
    const changedPixelCount = diffImageResult.changed_pixel_count;
    const userAgent = screenshot.user_agent;
    const {width, height} = diffImageResult.diff_image_dimensions;

    const actualHtmlFileUrl = this.analytics_.getUrl({
      url: screenshot.actual_html_file.public_url,
      source: 'cli',
      type: 'progress',
    });

    const bold = CliColor.bold;
    const magenta = CliColor.bold.magenta;

    const whichMsg = this.createUrlAliasMessage_(actualHtmlFileUrl, userAgent);
    const countMsg = `attempt ${magenta(screenshot.retry_count)} of ${magenta(maxRetries)}`;
    const pixelMsg = `${bold(changedPixelCount.toLocaleString())} pixels differed`;
    const deltaMsg = `${bold(`${diffImageResult.changed_pixel_percentage}%`)} of ${bold(`${width}x${height}`)}`;

    this.logStatus_(CliStatuses.RETRY, `${whichMsg} (${countMsg}). ${pixelMsg} (${deltaMsg})`);
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

    if (this.isKillRequested_) {
      return;
    }

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
        description: `${strDone} of ${strTotal} (${strPercent}%) - ${strChanged} diff${numChanged === 1 ? '' : 's'}`,
      });
      return;
    }

    const pending = this.numPending_;
    const completed = numDone;
    const total = pending + completed;
    const percent = (total === 0 ? 0 : (100 * completed / total).toFixed(1));

    const colorCaptured = CliStatuses.CAPTURED.color(CliStatuses.CAPTURED.name.toUpperCase());
    const colorCompleted = CliColor.bold.white(completed.toLocaleString());
    const colorTotal = CliColor.bold.white(total.toLocaleString());
    const colorPercent = CliColor.bold.white(`${percent}%`);

    process.stdout.write(`${colorCaptured}: ${colorCompleted} of ${colorTotal} screenshots (${colorPercent} complete)`);
  }
}

module.exports = SeleniumApi;
