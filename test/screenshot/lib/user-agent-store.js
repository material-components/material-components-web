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

const pb = require('./types.pb');
const {UserAgent} = pb.mdc.test.screenshot;
const {FormFactorType, OsVendorType, BrowserVendorType, BrowserVersionType} = UserAgent;

const Cli = require('./cli');
const {Browser: SeleniumBrowser, Builder: SeleniumBuilder} = require('selenium-webdriver');

class UserAgentStore {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();
  }

  /**
   * @param {boolean} isOnline
   * @return {!Promise<!Array<!UserAgent>>}
   */
  async getAllUserAgents({isOnline}) {
    const allUserAgents = [];
    for (const alias of this.getAllAliases()) {
      allUserAgents.push(await this.parseAlias_({alias, isOnline}));
    }
    return allUserAgents;
  }

  /**
   * @param {string} alias
   * @return {!Promise<?mdc.test.screenshot.UserAgent>}
   */
  async findUserAgentByAlias(alias) {
    /** @type {!Array<!mdc.test.screenshot.UserAgent>} */
    const allUserAgents = await this.getAllUserAgents({isOnline: /* skip local browser check */ true});
    return allUserAgents.find((userAgent) => userAgent.alias === alias);
  }

  /**
   * @param {string} alias
   * @param {boolean} isOnline
   * @return {!mdc.test.screenshot.UserAgent}
   * @private
   */
  async parseAlias_({alias, isOnline}) {
    const matchArray = /^([a-z]+)_([a-z]+)_([a-z]+)@([a-z0-9.]+)$/.exec(alias);
    if (!matchArray) {
      // TODO(acdvorak): Better error message
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected format: 'desktop_windows_chrome@latest'.
        `.trim()
      );
    }

    const [, formFactorName, osVendorName, browserVendorName, browserVersionName] = matchArray;

    const getEnumKeysLowerCase = (enumeration) => {
      return Object.keys(enumeration).map((key) => key.toLowerCase());
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
Expected form factor to be one of [${validFormFactors}], but got '${formFactorType}'.
        `.trim()
      );
    }

    if (!isValidOsVendor) {
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected operating system to be one of [${validOsVendors}], but got '${osVendor}'.
        `.trim()
      );
    }

    if (!isValidBrowserVendor) {
      throw new Error(`
Invalid user agent alias: '${alias}'.
Expected browser vendor to be one of [${validBrowserVendors}], but got '${browserVendor}'.
        `.trim()
      );
    }

    const seleniumId = SeleniumBrowser[browserVendorName.toUpperCase()];
    const isEnabledByCli = this.isAliasEnabled_(alias);
    const isAvailableLocally = !isOnline && await this.isAvailableLocally_(seleniumId);
    const isRunnable = isEnabledByCli && (isOnline || isAvailableLocally);

    return UserAgent.create({
      alias,
      form_factor_type: formFactorType,
      os_vendor_type: osVendorType,
      browser_vendor_type: browserVendorType,
      browser_version_type: browserVersionType,
      browser_version_value: browserVersionName, // TODO(acdvorak): Resolve "latest" to "11"?
      selenium_id: seleniumId,
      is_enabled_by_cli: isEnabledByCli,
      is_available_locally: isAvailableLocally,
      is_runnable: isRunnable,
    });
  }

  /**
   * @param {string} seleniumId
   * @return {!Promise<boolean>}
   * @private
   */
  async isAvailableLocally_(seleniumId) {
    try {
      const driver = await new SeleniumBuilder().forBrowser(seleniumId).build();
      await driver.quit();
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @return {!Array<string>}
   */
  getAllAliases() {
    return require('../browser.json').user_agent_aliases;
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
}

module.exports = UserAgentStore;
