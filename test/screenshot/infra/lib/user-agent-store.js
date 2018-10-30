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

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {UserAgent} = mdcProto;
const {FormFactorType, OsVendorType, BrowserVendorType, BrowserVersionType} = UserAgent;

const Cli = require('./cli');
const ChromeDriver = require('selenium-webdriver/chrome');
const EdgeDriver = require('selenium-webdriver/edge');
const FirefoxDriver = require('selenium-webdriver/firefox');
const IeDriver = require('selenium-webdriver/ie');
const SafariDriver = require('selenium-webdriver/safari');

class UserAgentStore {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();
  }

  /**
   * @param {string} alias
   * @return {!Promise<?mdc.proto.UserAgent>}
   */
  async getUserAgent(alias) {
    return this.parseAlias_(alias);
  }

  /**
   * @return {!Promise<!Array<!UserAgent>>}
   */
  async getAllUserAgents() {
    const allUserAgents = [];
    for (const alias of this.getAllAliases_()) {
      allUserAgents.push(await this.parseAlias_(alias));
    }
    return allUserAgents;
  }

  /**
   * @return {!Array<string>}
   * @private
   */
  getAllAliases_() {
    return require('../../browser.json').user_agent_aliases;
  }

  /**
   * @param {string} alias
   * @return {!mdc.proto.UserAgent}
   * @private
   */
  async parseAlias_(alias) {
    const aliasRegExp = /^([a-z]+)_([a-z]+)_([a-z]+)@([a-z0-9.]+)((?:_(?:highcontrast|disablefontsmoothing|rtl))*)$/;
    const matchArray = aliasRegExp.exec(alias);
    if (!matchArray) {
      // TODO(acdvorak): Better error message
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected format: 'desktop_windows_chrome@latest'.
        `.trim()
      );
    }

    const [, formFactorName, osVendorName, browserVendorName, browserVersionName, optionString] = matchArray;

    const getEnumKeysLowerCase = (enumeration) => {
      return Object.keys(enumeration).filter((key) => key !== 'UNKNOWN').map((key) => key.toLowerCase());
    };

    // In proto3, the first enum value must always be 0.
    const findEnumValue = (enumeration, key, defaultValue = 0) => {
      for (const [k, v] of Object.entries(enumeration)) {
        if (k.toLowerCase() === key) {
          return v;
        }
      }
      return defaultValue;
    };

    const formFactorType = findEnumValue(FormFactorType, formFactorName);
    const osVendorType = findEnumValue(OsVendorType, osVendorName);
    const browserVendorType = findEnumValue(BrowserVendorType, browserVendorName);
    const browserVersionType = findEnumValue(BrowserVersionType, browserVersionName, BrowserVersionType.EXACT);

    const validFormFactors = getEnumKeysLowerCase(FormFactorType);
    const validOsVendors = getEnumKeysLowerCase(OsVendorType);
    const validBrowserVendors = getEnumKeysLowerCase(BrowserVendorType);

    const isValidFormFactor = formFactorType !== FormFactorType.UNKNOWN;
    const isValidOsVendor = osVendorType !== OsVendorType.UNKNOWN;
    const isValidBrowserVendor = browserVendorType !== BrowserVendorType.UNKNOWN;

    if (!isValidFormFactor) {
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected form factor to be one of [${validFormFactors}], but got '${formFactorName}'.
        `.trim()
      );
    }

    if (!isValidOsVendor) {
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected operating system to be one of [${validOsVendors}], but got '${osVendorName}'.
        `.trim()
      );
    }

    if (!isValidBrowserVendor) {
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected browser vendor to be one of [${validBrowserVendors}], but got '${browserVendorName}'.
        `.trim()
      );
    }

    const isOnline = this.cli_.isOnline();
    const isEnabledByCli = this.isAliasEnabled_(alias);
    const isAvailableLocally = await this.isAvailableLocally_(browserVendorType);
    const isRunnable = isEnabledByCli && (isOnline || isAvailableLocally);
    const browserIconUrl = this.getBrowserIconUrl_(browserVendorType);
    const osIconUrl = this.getOsIconUrl_(browserVendorType);

    /**
     * Skip the first leading underscore (e.g., "_highcontrast_rtl" -> ["highcontrast", "rtl"]).
     * @type {!Array<string>}
     */
    const options = optionString.split('_').slice(1);

    return UserAgent.create({
      alias,

      form_factor_name: formFactorName,
      os_vendor_name: osVendorName,
      browser_vendor_name: browserVendorName,
      browser_version_name: browserVersionName,
      browser_version_value: browserVersionName,

      form_factor_type: formFactorType,
      os_vendor_type: osVendorType,
      browser_vendor_type: browserVendorType,
      browser_version_type: browserVersionType,

      is_enabled_by_cli: isEnabledByCli,
      is_available_locally: isAvailableLocally,
      is_runnable: isRunnable,

      browser_icon_url: browserIconUrl,
      os_icon_url: osIconUrl,

      raw_options: options,
      is_high_contrast_mode: options.includes('highcontrast'),
      is_font_smoothing_disabled: options.includes('disablefontsmoothing'),
      is_rtl: options.includes('rtl'),
    });
  }

  /**
   * @param {string} alias
   * @return {boolean}
   * @private
   */
  isAliasEnabled_(alias) {
    const isIncluded =
      this.cli_.includeBrowserPatterns.length === 0 ||
      this.cli_.includeBrowserPatterns.some((pattern) => pattern.test(alias));
    const isExcluded =
      this.cli_.excludeBrowserPatterns.some((pattern) => pattern.test(alias));
    return isIncluded && !isExcluded;
  }

  /**
   * @param {!mdc.proto.UserAgent.BrowserVendorType} browserVendorType
   * @return {!Promise<boolean>}
   * @private
   */
  async isAvailableLocally_(browserVendorType) {
    const map = {
      [BrowserVendorType.CHROME]: Boolean(ChromeDriver.locateSynchronously()),
      [BrowserVendorType.EDGE]: Boolean(EdgeDriver.locateSynchronously()),
      [BrowserVendorType.FIREFOX]: Boolean(FirefoxDriver.locateSynchronously()),
      [BrowserVendorType.IE]: Boolean(IeDriver.locateSynchronously()),
      [BrowserVendorType.SAFARI]: Boolean(SafariDriver.locateSynchronously()),
    };
    return map[browserVendorType];
  }

  /**
   * @param {mdc.proto.UserAgent.BrowserVendorType} browserVendorType
   * @return {string}
   * @private
   */
  getBrowserIconUrl_(browserVendorType) {
    /* eslint-disable max-len */
    const map = {
      [BrowserVendorType.CHROME]: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.10.0/chrome/chrome_16x16.png',
      [BrowserVendorType.EDGE]: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.10.0/edge/edge_16x16.png',
      [BrowserVendorType.FIREFOX]: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.10.0/firefox/firefox_16x16.png',
      [BrowserVendorType.IE]: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.10.0/archive/internet-explorer_9-11/internet-explorer_9-11_16x16.png',
      [BrowserVendorType.SAFARI]: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.10.0/safari/safari_16x16.png',
    };
    /* eslint-enable max-len */
    return map[browserVendorType];
  }

  /**
   * @param {mdc.proto.UserAgent.OsVendorType} osVendorType
   * @return {string}
   * @private
   */
  getOsIconUrl_(osVendorType) {
    // TODO(acdvorak): De-dupe and centralize icon URLs
    const map = {
      [OsVendorType.ANDROID]: 'https://png.icons8.com/color/48/000000/android-os.png',
      [OsVendorType.IOS]: 'https://png.icons8.com/color/50/000000/ios-logo.png',
      [OsVendorType.MAC]: 'https://png.icons8.com/ios/48/000000/mac-os-filled.png',
      [OsVendorType.WINDOWS]: 'https://png.icons8.com/color/48/000000/windows8.png',
    };
    return map[osVendorType];
  }
}

module.exports = UserAgentStore;
