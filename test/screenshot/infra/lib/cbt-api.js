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

const VError = require('verror');
const request = require('request-promise-native');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const cbtProto = require('../proto/cbt.pb').cbt.proto;
const seleniumProto = require('../proto/selenium.pb').selenium.proto;

const {UserAgent} = mdcProto;
const {FormFactorType, OsVendorType, BrowserVendorType, BrowserVersionType} = UserAgent;
const {CbtAccount, CbtActiveTestCounts, CbtConcurrencyStats} = cbtProto;
const {RawCapabilities} = seleniumProto;

const Cli = require('./cli');
/** @type {!AnsiColor} */
const CliColor = require('./logger').colors;
const DiffBaseParser = require('./diff-base-parser');
const Duration = require('./duration');
const Logger = require('./logger');
const getStackTrace = require('./stacktrace')('CbtApi');

const MDC_CBT_USERNAME = process.env.MDC_CBT_USERNAME;
const MDC_CBT_AUTHKEY = process.env.MDC_CBT_AUTHKEY;
const REST_API_BASE_URL = 'https://crossbrowsertesting.com/api/v3';
const SELENIUM_SERVER_URL = `http://${MDC_CBT_USERNAME}:${MDC_CBT_AUTHKEY}@hub.crossbrowsertesting.com:80/wd/hub`;
const {ExitCode, CBT_HTTP_MAX_RETRIES, SELENIUM_ZOMBIE_SESSION_DURATION_MS} = require('./constants');

/** @type {?Promise<!Array<!cbt.proto.CbtDevice>>} */
let allDevicesPromise;

class CbtApi {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!DiffBaseParser}
     * @private
     */
    this.diffBaseParser_ = new DiffBaseParser();

    /**
     * @type {!Logger}
     * @private
     */
    this.logger_ = new Logger();

    this.validateEnvVars_();
  }

  getSeleniumServerUrl() {
    return SELENIUM_SERVER_URL;
  }

  /** @private */
  validateEnvVars_() {
    if (!MDC_CBT_USERNAME) {
      console.error(`
ERROR: Required environment variable 'MDC_CBT_USERNAME' is not set.

Please add the following to your ~/.bash_profile or ~/.bashrc file:

    export MDC_CBT_USERNAME='...'
    export MDC_CBT_AUTHKEY='...'

Credentials can be found on the CBT account page:
https://crossbrowsertesting.com/account
`);
      process.exit(ExitCode.MISSING_ENV_VAR);
    }

    if (!MDC_CBT_AUTHKEY) {
      console.error(`
ERROR: Required environment variable 'MDC_CBT_AUTHKEY' is not set.

Please add the following to your ~/.bash_profile or ~/.bashrc file:

    export MDC_CBT_USERNAME='...'
    export MDC_CBT_AUTHKEY='...'

Credentials can be found on the CBT Account page:
https://crossbrowsertesting.com/account
`);
      process.exit(ExitCode.MISSING_ENV_VAR);
    }
  }

  /**
   * @return {!Promise<!cbt.proto.CbtConcurrencyStats>}
   */
  async fetchConcurrencyStats() {
    const [accountJson, activesJson] = await Promise.all([
      this.sendRequest_(getStackTrace('fetchConcurrencyStats'), 'GET', '/account'),
      this.sendRequest_(getStackTrace('fetchConcurrencyStats'), 'GET', '/account/activeTestCounts'),
    ]);

    const account = CbtAccount.fromObject(accountJson);
    const actives = CbtActiveTestCounts.fromObject(activesJson);

    return CbtConcurrencyStats.create({
      max_minutes: account.subscription.package.package_minutes,
      used_minutes: Math.ceil(account.subscription.usage.team.automated.total),

      max_concurrent_selenium_tests: account.subscription.package.max_concurrent_selenium,
      active_concurrent_selenium_tests: actives.team.automated,

      max_screenshot_count_per_test: account.subscription.package.max_screenshot_count_per_test,
    });
  }

  /**
   * @return {!Promise<!Array<!cbt.proto.CbtDevice>>}
   */
  async fetchAvailableDevices() {
    if (allDevicesPromise) {
      return allDevicesPromise;
    }

    this.logger_.debug('Fetching devices and browsers from CBT...');

    const stackTrace = getStackTrace('fetchAvailableDevices');
    allDevicesPromise = this.sendRequest_(stackTrace, 'GET', '/selenium/browsers');

    /** @type {!Array<!cbt.proto.CbtDevice>} */
    const allDevices = await allDevicesPromise;

    this.logger_.debug(`Fetched ${allDevices.length} devices from CBT!`);

    return allDevices;
  }

  /**
   * @param {string} sessionId
   * @return {!Promise<string>}
   */
  async getPublicTestResultUrl(sessionId) {
    const stackTrace = getStackTrace('getPublicTestResultUrl');
    const responseBody = await this.sendRequest_(stackTrace, 'GET', `/selenium/${sessionId}`);
    return responseBody['show_result_public_url'];
  }

  /**
   * @param {string} seleniumSessionId
   * @param {!Array<!mdc.proto.Screenshot>} changedScreenshots
   * @return {!Promise<void>}
   */
  async setTestScore({seleniumSessionId, changedScreenshots}) {
    const stackTrace = getStackTrace('fetchAvailableDevices');
    return this.sendRequest_(stackTrace, 'PUT', `/selenium/${seleniumSessionId}`, {
      action: 'set_score',
      score: changedScreenshots.length === 0 ? 'pass' : 'fail',
    }).catch((reason) => {
      console.error(CliColor.red('ERROR:'), reason);
      console.error(getStackTrace('setTestScore'));
    });
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!Promise<!selenium.proto.RawCapabilities>}
   */
  async getDesiredCapabilities({meta, userAgent}) {
    // TODO(acdvorak): Create a type for this
    /** @type {{device: !cbt.proto.CbtDevice, browser: !cbt.proto.CbtBrowser}} */
    const matchingCbtUserAgent = await this.getMatchingCbtUserAgent_(userAgent);

    const {cbtBuildName, cbtTestName} = await this.getCbtTestNameAndBuildNameForReport_(meta);

    /** @type {!selenium.proto.RawCapabilities} */
    const defaultCaps = {
      name: `${cbtTestName} - `,
      build: cbtBuildName,

      high_contrast: userAgent.is_high_contrast_mode ? 'black' : false,
      font_smoothing: userAgent.is_font_smoothing_disabled !== true,

      // TODO(acdvorak): Expose these as CLI flags
      record_video: true,
      record_network: true,
      max_duration: 3600, // in seconds
      idle_timeout: 600, // in seconds
    };

    /** @type {!selenium.proto.RawCapabilities} */
    const deviceCaps = matchingCbtUserAgent.device.caps;

    /** @type {!selenium.proto.RawCapabilities} */
    const browserCaps = matchingCbtUserAgent.browser.caps;

    return RawCapabilities.create(Object.assign({}, defaultCaps, deviceCaps, browserCaps));
  }

  /**
   * @param {!mdc.proto.UserAgent} userAgent
   * @return {!Promise<{device: !cbt.proto.CbtDevice, browser: !cbt.proto.CbtBrowser}>}
   * @private
   */
  async getMatchingCbtUserAgent_(userAgent) {
    /** @type {!Array<!cbt.proto.CbtDevice>} */
    const allCbtDevices = await this.fetchAvailableDevices();

    const formFactorMap = {
      [FormFactorType.DESKTOP]: ['desktop'],
      [FormFactorType.MOBILE]: ['mobile'],
    };

    const osVendorMap = {
      [OsVendorType.ANDROID]: ['Android'],
      [OsVendorType.IOS]: ['iPhone', 'iPad'],
      [OsVendorType.MAC]: ['Mac'],
      [OsVendorType.WINDOWS]: ['Windows'],
    };

    const browserVendorMap = {
      [BrowserVendorType.CHROME]: ['Chrome', 'Chrome Mobile'],
      [BrowserVendorType.EDGE]: ['Microsoft Edge'],
      [BrowserVendorType.FIREFOX]: ['Firefox'],
      [BrowserVendorType.IE]: ['Internet Explorer'],
      [BrowserVendorType.SAFARI]: ['Safari', 'Mobile Safari'],
    };

    const requiredFormFactors = formFactorMap[userAgent.form_factor_type];
    const requiredOsVendors = osVendorMap[userAgent.os_vendor_type];
    const requiredBrowserVendors = browserVendorMap[userAgent.browser_vendor_type];

    /** @type {!Set<string>} */
    const allBrowserApiNames = new Set();
    for (const cbtDevice of allCbtDevices) {
      for (const cbtBrowser of cbtDevice.browsers) {
        allBrowserApiNames.add(cbtBrowser.api_name);
      }
    }

    /** @type {!Array<{device: !cbt.proto.CbtDevice, browser: !cbt.proto.CbtBrowser}>} */
    const matchingCbtUserAgents = [];

    for (const cbtDevice of allCbtDevices) {
      const isMatchingDevice =
        requiredFormFactors.includes(cbtDevice.device) &&
        requiredOsVendors.includes(cbtDevice.type);

      if (!isMatchingDevice) {
        continue;
      }

      for (const cbtBrowser of cbtDevice.browsers) {
        if (!requiredBrowserVendors.includes(cbtBrowser.type)) {
          continue;
        }

        // Skip 32-bit browsers when a 64-bit version is also available
        if (allBrowserApiNames.has(cbtBrowser.api_name + 'x64')) {
          continue;
        }

        matchingCbtUserAgents.push({
          device: cbtDevice,
          browser: cbtBrowser,
        });
      }
    }

    /**
     * @param {string} version1 e.g., "6"
     * @param {string} version2 e.g., "6.0.2"
     * @return {number} Negative if `version1` is less than `version2`;
     *   positive if `version1` is greater than `version2`;
     *   otherwise zero if they are equal.
     */
    function compareVersions(version1, version2) {
      const v1 = parseVersionNumber(version1);
      const v2 = parseVersionNumber(version2);

      // Ensure both arrays are the same length by padding the shorter array with `0`
      v1.forEach((num, idx) => v2[idx] = v2[idx] || 0);
      v2.forEach((num, idx) => v1[idx] = v1[idx] || 0);

      // Subtract each element in v2 from the element with the same index in v1
      const deltas = v1.map((num, idx) => num - v2[idx]);

      // Return the first non-zero delta
      return deltas.filter((num) => num !== 0)[0] || 0;
    }

    /**
     * @param {string} version
     * @return {number[]}
     */
    function parseVersionNumber(version) {
      const numeric = String(version)
        .replace(/ 64-bit$/i, '')
        .replace(/ Beta$/i, '')
        .replace(/ Preview$/i, '')
        .replace(/ Home$/i, '')
        .replace(/ Service Pack \d$/i, '')
        .replace(/^(?:Windows )?XP ?/i, '5.1')
        .replace(/^(?:Windows )?Vista ?/i, '6.0')
        .replace(/^(?:Windows|Win) ?/i, '')
        .replace(/^(?:Mac OS X|Mac OSX|MacOS|OSX|Mac) ?/i, '')
        .replace(/(?:\.0+)+$/g, '')
      ;
      return numeric.split('.').map(Number);
    }

    matchingCbtUserAgents
      .sort((a, b) => {
        return (
          compareVersions(a.device.version, b.device.version) ||
          compareVersions(a.browser.version, b.browser.version) ||
          (a.device.sort_order - b.device.sort_order)
        );
      })
      .reverse()
    ;

    // Exact
    if (userAgent.browser_version_type === BrowserVersionType.EXACT) {
      return matchingCbtUserAgents.find((cbtUserAgent) => {
        const curBrowserVersion = parseVersionNumber(cbtUserAgent.browser.version);
        const requiredBrowserVersion = parseVersionNumber(userAgent.browser_version_value);
        return requiredBrowserVersion.every((number, index) => number === curBrowserVersion[index]);
      });
    }

    // Previous
    if (userAgent.browser_version_type === BrowserVersionType.PREVIOUS) {
      return matchingCbtUserAgents[1];
    }

    // Latest
    return matchingCbtUserAgents[0];
  }

  /**
   * @param {!mdc.proto.ReportMeta} meta
   * @return {{cbtBuildName: string, cbtTestName: string}}
   * @private
   */
  async getCbtTestNameAndBuildNameForReport_(meta) {
    /** @type {?mdc.proto.GitRevision} */
    const travisGitRev = await this.diffBaseParser_.getTravisGitRevision();
    if (travisGitRev) {
      return this.getCbtTestNameAndBuildNameForGitRev_(travisGitRev);
    }

    const snapshotDiffBase = meta.snapshot_diff_base;
    const snapshotGitRev = snapshotDiffBase.git_revision;
    if (snapshotGitRev) {
      return this.getCbtTestNameAndBuildNameForGitRev_(snapshotGitRev);
    }

    const serialized = JSON.stringify(meta, null, 2);
    throw new Error(`Unable to generate CBT test/build name for metadata:\n${serialized}`);
  }

  /**
   * @param {!mdc.proto.GitRevision} gitRev
   * @return {{cbtBuildName: string, cbtTestName: string}}
   * @private
   */
  getCbtTestNameAndBuildNameForGitRev_(gitRev) {
    const nameParts = [
      gitRev.author.email,
      gitRev.commit ? gitRev.commit.substr(0, 7) : null,
      gitRev.branch ? gitRev.branch : null,
      gitRev.tag ? gitRev.tag : null,
      gitRev.pr_number ? `PR #${gitRev.pr_number}` : null,
    ].filter((part) => part);
    return {
      cbtTestName: nameParts.slice(0, -1).join(' - '),
      cbtBuildName: nameParts.slice(-1)[0],
    };
  }

  /**
   * @return {!Promise<void>}
   */
  async killZombieSeleniumTests() {
    // NOTE: This only returns Selenium tests running on the authenticated CBT user's account.
    // It does NOT return Selenium tests running under other CBT user accounts.
    /** @type {!CbtSeleniumListResponse} */
    const listResponse = await this.sendRequest_(
      getStackTrace('killZombieSeleniumTests'),
      'GET', '/selenium?active=true&num=100'
    );

    if (!listResponse.selenium) {
      this.warnMalformedResponse_(listResponse, 'list');
      return;
    }

    this.logSeleniumSessions_(listResponse.selenium, 'Active Selenium sessions');

    const activeSeleniumTestIds = listResponse.selenium.map((session) => session.selenium_test_id);

    /** @type {!Array<!CbtSeleniumInfoResponse>} */
    const infoResponses = await Promise.all(activeSeleniumTestIds.map((seleniumTestId) => {
      const infoStackTrace = getStackTrace('killZombieSeleniumTests');
      return this.sendRequest_(infoStackTrace, 'GET', `/selenium/${seleniumTestId}`);
    }));

    this.logSeleniumSessions_(infoResponses, 'Selenium sessions info');

    const stalledSeleniumTestIds = [];

    for (let i = 0; i < infoResponses.length; i++) {
      const infoResponse = infoResponses[i];
      if (!infoResponse.commands) {
        this.warnMalformedResponse_(infoResponse, 'info', activeSeleniumTestIds[i]);
        continue;
      }

      const lastCommand = infoResponse.commands[infoResponse.commands.length - 1];
      let timestampMs = null;

      if (lastCommand) {
        // At least one Selenium command was received.
        timestampMs = new Date(lastCommand.date_issued).getTime();
      } else {
        // No Selenium commands have been received yet.
        timestampMs = new Date(infoResponse.start_date || infoResponse.startup_finish_date).getTime();
      }

      if (timestampMs > 0 && Duration.hasElapsed(SELENIUM_ZOMBIE_SESSION_DURATION_MS, timestampMs)) {
        stalledSeleniumTestIds.push(infoResponse.selenium_test_id);
      }
    }

    await this.killSeleniumTests(stalledSeleniumTestIds);
  }

  /**
   * @param {!Array<number|string>} seleniumTestOrSessionIds
   * @param {boolean=} silent
   * @return {!Promise<void>}
   */
  async killSeleniumTests(seleniumTestOrSessionIds, silent = false) {
    await Promise.all(seleniumTestOrSessionIds.map(async (seleniumTestOrSessionId) => {
      const log = (colorVerb) => {
        if (silent) {
          return;
        }
        console.log(`${colorVerb} Selenium test ID ${CliColor.bold(seleniumTestOrSessionId)}`);
      };

      log(CliColor.magenta('Killing'));

      const stackTrace = getStackTrace('killSeleniumTests');
      const requestPromise = this.sendRequest_(stackTrace, 'DELETE', `/selenium/${seleniumTestOrSessionId}`).then(
        () => {
          log(CliColor.bold.magenta('Killed'));
        },
        (err) => {
          log(CliColor.red('Failed'));
          console.warn(err);
        }
      );

      return await requestPromise;
    }));

    console.log('');
  }

  /**
   * @param {string} stackTrace
   * @param {string} method
   * @param {string} endpoint
   * @param {!Object=} body
   * @param {number=} retryCount
   * @return {!Promise<!Object<string, *>|!Array<*>>}
   * @private
   */
  async sendRequest_(stackTrace, method, endpoint, body = undefined, retryCount = 0) {
    const uri = `${REST_API_BASE_URL}${endpoint}`;

    if (this.cli_.isOffline()) {
      console.warn(
        `${CliColor.magenta('WARNING')}:`,
        new Error('CbtApi.sendRequest_() should not be called in --offline mode')
      );
      return [];
    }

    try {
      return await request({
        method,
        uri,
        auth: {
          username: MDC_CBT_USERNAME,
          password: MDC_CBT_AUTHKEY,
        },
        body,
        json: true, // Automatically stringify the request body and parse the response body as JSON
      });
    } catch (err) {
      if (++retryCount <= CBT_HTTP_MAX_RETRIES) {
        this.logRetry_(method, uri, err, stackTrace, retryCount);
        return this.sendRequest_(stackTrace, method, endpoint, body, retryCount);
      }
      throw new VError(err, `CBT API request failed: ${method} ${uri}:\n${stackTrace}`);
    }
  }

  logRetry_(method, uri, err, stackTrace, retryCount) {
    const colorLabel = CliColor.magenta('CBT API request failed:');
    const colorMethod = CliColor.bold(method);
    const colorUri = CliColor.underline(uri);
    console.error('');
    console.error('');
    console.error(`${colorLabel} ${colorMethod} ${colorUri}`);
    console.error('');
    console.error(err);
    console.error('');
    console.error(stackTrace);
    console.error('');

    const colorRetrying = CliColor.magenta('Retrying request');
    const colorAttemptCount = CliColor.bold.magenta(retryCount);
    const colorMaxRetries = CliColor.bold.magenta(CBT_HTTP_MAX_RETRIES);
    console.error(`${colorRetrying} (attempt ${colorAttemptCount} of ${colorMaxRetries})...`);
    console.error('');
  }

  /**
   * @param {!Array<!CbtSeleniumListItem|!CbtSeleniumInfoResponse>} sessions
   * @param {string} description
   * @private
   */
  logSeleniumSessions_(sessions, description) {
    const jsonStr = JSON.stringify(sessions.map((session) => {
      return {
        selenium_test_id: session.selenium_test_id,
        selenium_session_id: session.selenium_session_id,
        start_date: session.start_date,
        startup_finish_date: session.startup_finish_date,
        finish_date: session.finish_date,
        active: session.active,
        state: session.state,
        show_result_web_url: session.show_result_web_url,
        show_result_public_url: session.show_result_public_url,
        commands: session.commands ? session.commands.length : undefined,
      };
    }), null, 2);

    const descriptionColor = CliColor.cyan(description);
    console.log(`${descriptionColor}:\n\n${jsonStr}\n`);
  }

  /**
   * @param {?Object} httpResponseBody
   * @param {string} friendlyName
   * @param {string=} seleniumTestId
   * @private
   */
  warnMalformedResponse_(httpResponseBody, friendlyName, seleniumTestId = undefined) {
    const warning = CliColor.magenta('WARNING');
    const whatFor = seleniumTestId ? ` for Selenium test ID ${seleniumTestId}` : '';
    const jsonStr = JSON.stringify(httpResponseBody, null, 2);
    console.warn(`${warning}: Malformed ${friendlyName} response from CBT${whatFor}:\n\n${jsonStr}\n`);
  }
}

module.exports = CbtApi;
