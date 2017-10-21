/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

// Browser config object generator: https://app.crossbrowsertesting.com/selenium/run

const DEFAULTS = {
  allBrowsers: {
    'record_video': 'true',
    'record_network': 'true',
  },
  desktop: {
    // Leave screenResolution unspecified. CBT appears to use 1366x768 by default for all browsers/OSes. Not every
    // browser/OS supports every resolution, so explicitly specifying one can cause errors if that resolution isn't
    // supported by one of the browser/OS configurations.
    // 'screenResolution': '1366x768',
  },
  mobile: {
    'deviceOrientation': 'portrait',
  },
};

const BROWSERS = {
  desktop: {
    mac: {
      safari: {
        latest: {
          'browserName': 'Safari',
          'version': '10',
          'platform': 'Mac OSX 10.12', // TODO(acdvorak): Can we comment this out?
        },
        previous: {
          'browserName': 'Safari',
          'version': '9',
          'platform': 'Mac OSX 10.11', // TODO(acdvorak): Can we comment this out?
        },
      },
    },

    windows: {
      chrome: {
        latest: {
          'browserName': 'Chrome',
          'version': '61x64',
          'platform': 'Windows 10',
        },
        previous: {
          'browserName': 'Chrome',
          'version': '60x64',
          'platform': 'Windows 10',
        },
      },

      firefox: {
        latest: {
          'browserName': 'Firefox',
          'version': '55x64',
          'platform': 'Windows 10',
        },
        previous: {
          'browserName': 'Firefox',
          'version': '54x64',
          'platform': 'Windows 10',
        },
      },

      edge: {
        latest: {
          'browserName': 'MicrosoftEdge',
          'version': '15',
          'platform': 'Windows 10',
        },
        previous: {
          'browserName': 'MicrosoftEdge',
          'version': '14',
          'platform': 'Windows 10',
        },
      },

      ie: {
        latest: {
          'browserName': 'Internet Explorer',
          'version': '11',
          'platform': 'Windows 10',
        },
        previous: {
          'browserName': 'Internet Explorer',
          'version': '10',
          'platform': 'Windows 7 64-Bit',
        },
      },
    },
  },

  mobile: {
    android: {
      v07: {
        'browserName': 'Chrome',
        'deviceName': 'Nexus 6P',
        'platformVersion': '7.0',
        'platformName': 'Android',
      },
      v06: {
        'browserName': 'Chrome',
        'deviceName': 'Nexus 9',
        'platformVersion': '6.0',
        'platformName': 'Android',
      },
      v05: {
        'browserName': 'Chrome',
        'deviceName': 'Nexus 6',
        'platformVersion': '5.0',
        'platformName': 'Android',
      },
      // v04: {
      //   'browserName': 'Chrome',
      //   'deviceName': 'Galaxy Note 3',
      //   'platformVersion': '4.4',
      //   'platformName': 'Android',
      // },
    },

    ios: {
      v10: {
        'browserName': 'Safari',
        'deviceName': 'iPhone 7 Simulator',
        'platformVersion': '10.0',
        'platformName': 'iOS',
      },
      v09: {
        'browserName': 'Safari',
        'deviceName': 'iPhone 6s Simulator',
        'platformVersion': '9.3',
        'platformName': 'iOS',
      },
    },
  },
};

// TODO(acdvorak): Use builder pattern instead?
class CbtBrowserConfig {
  static allBrowsers(...overrides) {
    return [
      ...this.desktop(...overrides),
      ...this.mobile(...overrides),
    ];
  }

  static desktop(...overrides) {
    return this.merge_(
      [
        BROWSERS.desktop.mac.safari.latest,
        // BROWSERS.desktop.mac.safari.previous,
        BROWSERS.desktop.windows.chrome.latest,
        // BROWSERS.desktop.windows.chrome.previous,
        BROWSERS.desktop.windows.firefox.latest,
        // BROWSERS.desktop.windows.firefox.previous,
        BROWSERS.desktop.windows.edge.latest,
        // BROWSERS.desktop.windows.edge.previous,
        BROWSERS.desktop.windows.ie.latest,
        // BROWSERS.desktop.windows.ie.previous,
      ],
      DEFAULTS.allBrowsers,
      DEFAULTS.desktop,
      ...overrides);
  }

  static mobile(...overrides) {
    return this.merge_(
      [
        // BROWSERS.mobile.android.v07,
        // BROWSERS.mobile.android.v06,
        // BROWSERS.mobile.android.v05,
        // BROWSERS.mobile.ios.v10,
        // BROWSERS.mobile.ios.v09,
      ],
      DEFAULTS.allBrowsers,
      DEFAULTS.mobile,
      ...overrides);
  }

  static merge_(browsers, ...overrides) {
    return browsers
      .map((browser) => Object.assign(browser, ...overrides))
      // CBT's API uses the name `password` instead of `authkey`,
      .map((browser) => Object.assign({password: browser.authkey}, browser));
  }
}

module.exports = {CbtBrowserConfig};
