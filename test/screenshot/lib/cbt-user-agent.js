/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable key-spacing, no-unused-vars */

const CbtApi = require('./cbt-api');
const Cli = require('./cli');
const os = require('os');
const {Browser: SeleniumBrowser, Builder: SeleniumBuilder} = require('selenium-webdriver');

const cbtApi = new CbtApi();
const cli = new Cli();

/* eslint-disable max-len */
/**
 * Map of `CbtBrowser#icon_class` values to public URLs for their browser icons.
 * TODO(acdvorak): Download these files to the git repo so they work offline.
 * @type {!Object<string, string>}
 */
const BROWSER_ICONS = {
  'chrome': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/chrome/chrome.svg',
  'firefox': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/firefox/firefox.svg',
  'edge': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/edge/edge.svg',
  'ie': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/archive/internet-explorer_9-11/internet-explorer_9-11.svg',
  'safari': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/safari/safari.svg',
  'safari-mobile': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/safari-ios/safari-ios.svg',
  'opera': 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.8.0/opera/opera.svg',
};
/* eslint-enable max-len */

const CBT_FILTERS = {
  formFactor: {
    any:     () => (device) => true,
    desktop: () => (device) => device.device === 'desktop',
    mobile:  () => (device) => device.device === 'mobile' && device.device_type !== 'tablet',
  },

  operatingSystemName: {
    any:     () => (device) => true,
    android: () => (device) => device.type === 'Android',
    ios:     () => (device) => device.type === 'iPhone',
    mac:     () => (device) => device.type === 'Mac',
    windows: () => (device) => device.type === 'Windows',
  },

  browserName: {
    any:     () => (browser) => true,
    chrome:  () => (browser) => browser.type === 'Chrome' || browser.type === 'Chrome Mobile',
    edge:    () => (browser) => browser.type === 'Microsoft Edge',
    firefox: () => (browser) => browser.type === 'Firefox',
    ie:      () => (browser) => browser.type === 'Internet Explorer',
    opera:   () => (browser) => browser.type === 'Opera',
    safari:  () => (browser) => browser.type === 'Safari' || browser.type === 'Mobile Safari',
  },

  browserVersion: {
    any:      (desiredVersion) => (actualVersion) => true,
    exactly:  (desiredVersion) => (actualVersion) => compareVersions(actualVersion, desiredVersion) === 0,
    latest:   (n = 1) => (actualVersion, actualVersionIndex, actualVersionListSortedDesc) => {
      // Array is sorted by `filterBrowsersByVersion()`
      return actualVersionListSortedDesc
        .slice(0, n)
        .includes(actualVersion)
      ;
    },
    previous: (n = 1) => (actualVersion, actualVersionIndex, actualVersionListSortedDesc) => {
      // Array is sorted by `filterBrowsersByVersion()`
      return actualVersionListSortedDesc
        .slice(1, 1 + n)
        .includes(actualVersion)
      ;
    },
  },
};

let allUserAgentsPromise;
let runnableAliasesCache;

/**
 * Map of Selenium browser name (see Selenium's `Browser` enum) to a boolean indicating whether the driver is available.
 * @type {!Map<string, boolean>}
 */
let isLocalBrowserAvailableCache = new Map();

module.exports = {
  fetchUserAgentSet,
  fetchBrowserByApiName,
  fetchBrowserByAlias,
};

/**
 * Fetches the CBT API representations of all user agents listed in `browser.json`.
 * CLI filters (e.g., `--browser`) are ignored.
 * @return {!Promise<!CbtUserAgentSet>}
 */
async function fetchUserAgentSet() {
  if (!allUserAgentsPromise) {
    if (await cli.isOnline()) {
      allUserAgentsPromise = fetchOnlineUserAgents();
    } else {
      allUserAgentsPromise = fetchOfflineUserAgents();
    }
  }

  return allUserAgentsPromise;
}

/**
 * @return {!Promise<!CbtUserAgentSet>}
 */
async function fetchOnlineUserAgents() {
  const cbtDevices = await cbtApi.fetchAvailableDevices();
  const allAliases = getAllAliases();
  const allUserAgents = findAllMatchingUAs(allAliases, cbtDevices);
  return {
    allUserAgents,
    runnableUserAgents: allUserAgents.filter((userAgent) => userAgent.isRunnable),
    skippedUserAgents: allUserAgents.filter((userAgent) => !userAgent.isRunnable),
  };
}

/**
 * @return {!Promise<!CbtUserAgentSet>}
 */
async function fetchOfflineUserAgents() {
  /** @type {!Array<!CbtUserAgent>} */ const allUserAgents = [];
  /** @type {!Array<!CbtUserAgent>} */ const runnableUserAgents = [];
  /** @type {!Array<!CbtUserAgent>} */ const skippedUserAgents = [];

  /** @type {!Array<!UserAgentAlias>} */
  const allAliases = getAllAliases().map((alias) => UserAgentAlias.parse(alias));

  for (const userAgentAlias of allAliases) {
    /** @type {!CbtUserAgent} */
    const userAgent = await createLocalUserAgent(userAgentAlias);

    allUserAgents.push(userAgent);
    if (userAgent.isRunnable) {
      runnableUserAgents.push(userAgent);
    } else {
      skippedUserAgents.push(userAgent);
    }
  }

  return {
    allUserAgents,
    runnableUserAgents,
    skippedUserAgents,
  };
}

/**
 * @param {!UserAgentAlias} userAgentAlias
 * @return {!CbtUserAgent}
 */
async function createLocalUserAgent(userAgentAlias) {
  /** @type {!CbtDevice} */ const device = createLocalDevice();
  /** @type {!CbtBrowser} */ const browser = createLocalBrowser(userAgentAlias);

  const alias = userAgentAlias.toString();

  // TODO(acdvorak): Document the '|' separator format (CBT's API)
  // TODO(acdvorak): Centralize the formatting/parsing CBT, Selenium, and Alias strings
  const fullCbtApiName = `${device.api_name}|${browser.api_name}`;

  // TODO(acdvorak): Rename *some* usages of the words "runnable/skipped" with "included/excluded".
  // TODO(acdvorak): Differentiate between "runnable" (CLI args + is available locally) and "included" (CLI args only).
  const isIncluded = userAgentAlias.isDesktop() && getRunnableAliases().includes(alias);
  const isRunnable = isIncluded && await isLocalBrowserAvailableCached(userAgentAlias);

  return {
    fullCbtApiName,
    alias,
    device,
    browser,
    isRunnable,
  };
}

/**
 * @param {!UserAgentAlias} userAgentAlias
 * @return {!Promise<boolean>}
 */
async function isLocalBrowserAvailableCached(userAgentAlias) {
  const seleniumBrowserName = getSeleniumBrowserName(userAgentAlias);
  if (!isLocalBrowserAvailableCache.has(seleniumBrowserName)) {
    const isAvailable = await isLocalBrowserAvailableUncached(userAgentAlias);
    isLocalBrowserAvailableCache.set(seleniumBrowserName, isAvailable);
  }
  return isLocalBrowserAvailableCache.get(seleniumBrowserName);
}

/**
 * @param {!UserAgentAlias} userAgentAlias
 * @return {!Promise<boolean>}
 */
async function isLocalBrowserAvailableUncached(userAgentAlias) {
  const seleniumBrowserName = getSeleniumBrowserName(userAgentAlias);
  try {
    return new SeleniumBuilder()
      .forBrowser(seleniumBrowserName)
      .build()
      .then(
        async (driver) => {
          await driver.quit();
          return true;
        },
        () => false
      );
  } catch (err) {
    return false;
  }
}

/**
 * @return {!CbtDevice}
 */
function createLocalDevice() {
  const localOsType = os.type().toLowerCase().replace(/\W+/g, '');
  if (/^darwin/.test(localOsType)) {
    return {
      api_name: 'Mac10.13',
      name: 'Mac OSX 10.13',
      version: 'Mac OSX 10.13',
      type: 'Mac',
      device: 'desktop',
      device_type: null,
      browsers: [],
      resolutions: [],
      parsedVersionNumber: '10.13',
    };
  }
  return {
    api_name: 'Win10',
    name: 'Windows 10',
    version: 'Windows 10',
    type: 'Windows',
    device: 'desktop',
    device_type: null,
    browsers: [],
    resolutions: [],
    parsedVersionNumber: '10',
  };
}

/**
 * @param {!UserAgentAlias} userAgentAlias
 * @return {!CbtBrowser}
 */
function createLocalBrowser(userAgentAlias) {
  const seleniumBrowserName = getSeleniumBrowserName(userAgentAlias);
  if (seleniumBrowserName === SeleniumBrowser.FIREFOX) {
    // TODO(acdvorak): Figure out version numbers
    return {
      api_name: 'FF59',
      name: 'Firefox 59',
      version: '59',
      type: 'Firefox',
      device: 'desktop',
      icon_class: 'firefox',
      selenium_version: '3.8.1',
      webdriver_type: 'geckodriver',
      webdriver_version: '0.19.0',
      parsedVersionNumber: '59',
      parsedIconUrl: null,
    };
  }
  if (seleniumBrowserName === SeleniumBrowser.SAFARI) {
    return {
      api_name: 'Safari11',
      name: 'Safari 11',
      version: '11',
      type: 'Safari',
      device: 'desktop',
      icon_class: 'safari',
      selenium_version: '3.11.0',
      webdriver_type: 'safaridriver',
      webdriver_version: null,
      parsedVersionNumber: '11',
      parsedIconUrl: null,
    };
  }
  if (seleniumBrowserName === SeleniumBrowser.EDGE) {
    return {
      api_name: 'Edge17',
      name: 'Microsoft Edge 17',
      version: '17',
      type: 'Microsoft Edge',
      device: 'desktop',
      icon_class: 'edge',
      selenium_version: '3.4.0',
      webdriver_type: 'microsoftwebdriver',
      webdriver_version: '17',
      parsedVersionNumber: '17',
      parsedIconUrl: null,
    };
  }
  if (seleniumBrowserName === SeleniumBrowser.IE) {
    return {
      api_name: 'IE11',
      name: 'Internet Explorer 11',
      version: '11',
      type: 'Internet Explorer',
      device: 'desktop',
      icon_class: 'ie',
      selenium_version: '2.46.0',
      webdriver_type: 'iedriver',
      webdriver_version: '2.46.0',
      parsedVersionNumber: '11',
      parsedIconUrl: null,
    };
  }
  return {
    api_name: 'Chrome66x64',
    name: 'Google Chrome 66 (64-bit)',
    version: '66',
    type: 'Chrome',
    device: 'desktop',
    icon_class: 'chrome',
    selenium_version: '3.4.0',
    webdriver_type: 'chromedriver',
    webdriver_version: '2.37',
    parsedVersionNumber: '66',
    parsedIconUrl: null,
  };
}

/**
 * @param {!UserAgentAlias} userAgentAlias
 * @return {string}
 */
function getSeleniumBrowserName(userAgentAlias) {
  return SeleniumBrowser[userAgentAlias.browserName.toUpperCase()];
}

/**
 * Returns the CBT API representation of the given device/browser.
 * @param {string} cbtDeviceApiName
 * @param {string} cbtBrowserApiName
 * @return {!Promise<?CbtUserAgent>}
 */
async function fetchBrowserByApiName(cbtDeviceApiName, cbtBrowserApiName) {
  // TODO(acdvorak): Why does the CBT browser API return "Win10" but the screenshot info API returns "Win10-E17"?
  cbtDeviceApiName = cbtDeviceApiName.replace(/-E\d+$/, '');

  const {allUserAgents} = await fetchUserAgentSet();
  return allUserAgents.find((userAgent) => {
    return userAgent.device.api_name === cbtDeviceApiName
      && userAgent.browser.api_name === cbtBrowserApiName;
  });
}

/**
 * @param {string} userAgentAlias
 * @return {!Promise<?CbtUserAgent>}
 */
async function fetchBrowserByAlias(userAgentAlias) {
  const {allUserAgents} = await fetchUserAgentSet();
  return allUserAgents.find((userAgent) => {
    return userAgent.alias === userAgentAlias;
  });
}

/**
 * @return {!Array<string>}
 */
function getAllAliases() {
  return require('../browser.json').user_agent_aliases;
}

/**
 * @return {!Array<string>}
 */
function getRunnableAliases() {
  return runnableAliasesCache || (runnableAliasesCache = getAllAliases().filter(isAliasRunnable));
}

function isAliasRunnable(alias) {
  const isIncluded =
    cli.includeBrowserPatterns.length === 0 ||
    cli.includeBrowserPatterns.some((pattern) => pattern.test(alias));
  const isExcluded =
    cli.excludeBrowserPatterns.some((pattern) => pattern.test(alias));
  return isIncluded && !isExcluded;
}

/**
 * @param {!Array<string>} userAgentAliases
 * @param {!Array<!CbtDevice>} cbtDevices
 * @return {!Array<!CbtUserAgent>}
 */
function findAllMatchingUAs(userAgentAliases, cbtDevices) {
  return userAgentAliases.map((userAgentAlias) => findOneMatchingUA(userAgentAlias, cbtDevices));
}

/**
 * @param {string} userAgentAlias
 * @param {!Array<!CbtDevice>} cbtDevices
 * @return {!CbtUserAgent}
 */
function findOneMatchingUA(userAgentAlias, cbtDevices) {
  // Avoid mutating the object passed by the caller
  cbtDevices = deepCopyJson(cbtDevices);

  const {formFactor, operatingSystemName, browserName, browserVersion} = UserAgentAlias.parse(userAgentAlias);

  const devices = cbtDevices
    .filter(CBT_FILTERS.formFactor[formFactor]())
    .filter(CBT_FILTERS.operatingSystemName[operatingSystemName]())
  ;

  filterBrowsersByName(
    devices,
    CBT_FILTERS.browserName[browserName]()
  );

  filterBrowsersByVersion(
    devices,
    CBT_FILTERS.browserVersion[browserVersion]
      ? CBT_FILTERS.browserVersion[browserVersion]()
      : CBT_FILTERS.browserVersion.exactly(browserVersion)
  );

  const [firstDevice] = devices
    .filter((device) => device.browsers.length > 0)
    .sort(compareDeviceOrBrowserDisplayOrder)
    .reverse()
  ;

  const [firstBrowser] = firstDevice.browsers;

  return {
    /**
     * API documentation for the name format can be found at:
     * https://crossbrowsertesting.com/apidocs/v3/screenshots.html#!/default/post_screenshot_list
     */
    fullCbtApiName: `${firstDevice.api_name}|${firstBrowser.api_name}`,
    alias: userAgentAlias,
    device: firstDevice,
    browser: firstBrowser,
    isRunnable: getRunnableAliases().includes(userAgentAlias),
  };
}

/**
 * Mutates `devices` in-place by removing browsers that do not match the given filter.
 * @param {!Array<!CbtDevice>} devices
 * @param {function(browser: !CbtBrowser): boolean} browserNameFilter
 */
function filterBrowsersByName(devices, browserNameFilter) {
  devices.forEach((device) => {
    device.browsers = device.browsers
      .filter((browser) => is64Bit(browser, device.browsers))
      .filter(browserNameFilter)
      .map((browser) => {
        browser.parsedVersionNumber = parseVersionNumber(browser.version).join('.');
        browser.parsedIconUrl = BROWSER_ICONS[browser.icon_class];
        return browser;
      })
      .sort(compareDeviceOrBrowserDisplayOrder)
      .reverse()
    ;
    device.parsedVersionNumber = parseVersionNumber(device.version).join('.');
  });
}

/**
 * Mutates `devices` in-place by removing browsers that do not match the given filter.
 * @param {!Array<!CbtDevice>} devices
 * @param {function(version: string): boolean} browserVersionFilter
 */
function filterBrowsersByVersion(devices, browserVersionFilter) {
  const allBrowserVersions = new Set();

  // When this function is called, `devices` should only contain a single browser vendor (e.g., "chrome") at multiple
  // versions.
  devices.forEach((device) => {
    device.browsers.forEach((browser) => {
      allBrowserVersions.add(browser.version);
    });
  });

  // Certain filters (`latest` and `previous`) need access to the entire array of available versions, sorted from
  // newest to oldest.
  const sortedBrowserVersionList = Array.from(allBrowserVersions).sort(compareVersions).reverse();
  const matchingBrowserVersions = new Set(sortedBrowserVersionList.filter(browserVersionFilter));

  devices.forEach((device) => {
    device.browsers = device.browsers.filter((browser) => matchingBrowserVersions.has(browser.version));
  });
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

function compareDeviceOrBrowserDisplayOrder(browser1, browser2) {
  const nameDiff = browser1.name.localeCompare(browser2.name, 'en-US', {numeric: true});
  const versionDiff = compareVersions(browser1.version, browser2.version);
  return nameDiff || versionDiff;
}

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

function is64Bit(browser, otherBrowsers) {
  return !otherBrowsers.some((otherBrowser) => otherBrowser.api_name === browser.api_name + 'x64');
}

function deepCopyJson(json) {
  return JSON.parse(JSON.stringify(json));
}
