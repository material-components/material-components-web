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

const CbtApi = require('./cbt-api');
const cbtApi = new CbtApi();

const CBT_FILTERS = {
  formFactor: {
    any:     () => (device) => true,
    desktop: () => (device) => device.device === 'desktop',
    mobile:  () => (device) => device.device === 'mobile',
  },

  operatingSystemName: {
    any:     () => (device) => true,
    android: () => (device) => device.type === 'Android',
    ios:     () => (device) => device.type === 'iPad' || device.type === 'iPhone',
    mac:     () => (device) => device.type === 'Mac',
    windows: () => (device) => device.type === 'Windows',
  },

  userAgentName: {
    any:     () => (userAgent) => true,
    chrome:  () => (userAgent) => userAgent.type === 'Chrome' || userAgent.type === 'Chrome Mobile',
    edge:    () => (userAgent) => userAgent.type === 'Microsoft Edge',
    firefox: () => (userAgent) => userAgent.type === 'Firefox',
    ie:      () => (userAgent) => userAgent.type === 'Internet Explorer',
    opera:   () => (userAgent) => userAgent.type === 'Opera',
    safari:  () => (userAgent) => userAgent.type === 'Safari' || userAgent.type === 'Mobile Safari',
  },

  userAgentVersion: {
    any:     (desiredVersion) => (actualVersion) => true,
    exactly: (desiredVersion) => (actualVersion) => compareVersions(actualVersion, desiredVersion) === 0,
    latest: (n = 1) => (actualVersion, actualVersionIndex, actualVersionListSortedDesc) => {
      return actualVersionListSortedDesc
        .slice(0, n)
        .includes(actualVersion)
      ;
    },
    previous: (n = 1) => (actualVersion, actualVersionIndex, actualVersionListSortedDesc) => {
      return actualVersionListSortedDesc
        .slice(1, 1 + n)
        .includes(actualVersion)
      ;
    },
  },
};

let browserConfigsPromise;

module.exports = {
  fetchBrowserConfigs,
  fetchBrowserConfigFromApiName,
};

async function fetchBrowserConfigs() {
  return browserConfigsPromise || (browserConfigsPromise = new Promise((resolve, reject) => {
    cbtApi.fetchAvailableBrowsers()
      .then(
        (cbtBrowsers) => {
          const browserSpecs = require('../browser.json').browserSpecs;
          const browserConfigs = getMatchingApiConfigs(browserSpecs, cbtBrowsers);

          // Log it
          const loggableConfigs = browserConfigs.map((config) => `${config.spec}: ${config.fullApiName}`);
          console.log('\n\nCBT browser configs:\n\n', loggableConfigs, '\n\n');

          resolve(browserConfigs);
        },
        (err) => reject(err)
      );
  }));
}

async function fetchBrowserConfigFromApiName(deviceApiName, userAgentApiName) {
  const browserConfigs = await fetchBrowserConfigs();
  return browserConfigs.find((curConfig) => {
    // TODO(acdvorak): Why does the CBT browser API return "Win10" but the screenshot info API returns "Win10-E17"?
    return curConfig.device.api_name.replace(/-E\d+$/, '') === deviceApiName.replace(/-E\d+$/, '')
      && curConfig.userAgent.api_name === userAgentApiName;
  });
}

function getMatchingApiConfigs(browserSpecs, cbtBrowsers) {
  return browserSpecs.map((browserSpec) => getMatchingApiConfig(browserSpec, cbtBrowsers));
}

function getMatchingApiConfig(browserSpec, cbtBrowsers) {
  // Avoid mutating the object passed by the caller
  cbtBrowsers = deepCopyJson(cbtBrowsers);

  const [_, formFactor, operatingSystemName, userAgentName, userAgentVersion] =
    /^([a-z]+)_([a-z]+)_([a-z]+)@([a-z0-9.]+)$/.exec(browserSpec);

  const devices = cbtBrowsers
    .filter(CBT_FILTERS.formFactor[formFactor]())
    .filter(CBT_FILTERS.operatingSystemName[operatingSystemName]())
  ;

  filterBrowsersByName(
    devices,
    CBT_FILTERS.userAgentName[userAgentName]()
  );

  filterBrowsersByVersion(
    devices,
    CBT_FILTERS.userAgentVersion[userAgentVersion]
      ? CBT_FILTERS.userAgentVersion[userAgentVersion]()
      : CBT_FILTERS.userAgentVersion.exactly(userAgentVersion)
  );

  const [firstDevice] = devices
    .filter((device) => device.browsers.length > 0)
    .sort(compareDeviceOrBrowserDisplayOrder)
    .reverse()
  ;

  const [firstUserAgent] = firstDevice.browsers;

  return {
    /**
     * API documentation for the name format can be found at:
     * https://crossbrowsertesting.com/apidocs/v3/screenshots.html#!/default/post_screenshots
     */
    fullApiName: `${firstDevice.api_name}|${firstUserAgent.api_name}`,
    spec: browserSpec,
    device: firstDevice,
    userAgent: firstUserAgent,
  };
}

function filterBrowsersByName(devices, userAgentNameFilter) {
  devices.forEach((device) => {
    device.browsers = device.browsers
      .filter((browser) => is64Bit(browser, device.browsers))
      .filter(userAgentNameFilter)
      .map((browser) => {
        browser.parsedVersionNumber = parseVersionNumber(browser.version).join('.');
        return browser;
      })
      .sort(compareDeviceOrBrowserDisplayOrder)
      .reverse()
    ;
    device.parsedVersionNumber = parseVersionNumber(device.version).join('.');
  });
}

function filterBrowsersByVersion(devices, userAgentVersionFilter) {
  const userAgentVersionSet = new Set();

  devices.forEach((device) => {
    device.browsers.forEach((browser) => {
      userAgentVersionSet.add(browser.version);
    });
  });

  const userAgentVersionListSorted = Array.from(userAgentVersionSet).sort(compareVersions).reverse();
  const matchingUserAgentVersionSet = new Set(userAgentVersionListSorted.filter(userAgentVersionFilter));

  devices.forEach((device) => {
    device.browsers = device.browsers.filter((browser) => matchingUserAgentVersionSet.has(browser.version));
  });

  return devices;
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
