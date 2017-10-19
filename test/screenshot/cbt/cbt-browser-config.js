// Browser config object generator: https://app.crossbrowsertesting.com/selenium/run

const DEFAULTS = {
  common: {
    record_video: 'true',
    record_network: 'true',
  },
  desktop: {
    'screenResolution': '1400x900',
  },
  mobile: {
  },
};

// TODO(acdvorak): Use builder pattern instead?
class CbtBrowserConfig {
  static all(...overrides) {
    return [
      ...this.desktop(...overrides),
      ...this.mobile(...overrides),
    ];
  }

  static desktop(...overrides) {
    return this.merge_(
      [
        {
          'browserName': 'Chrome',
          'version': '48x64',
          'platform': 'Mac OSX 10.8',
        },
        {
          'browserName': 'Firefox',
          'version': '46',
          'platform': 'Mac OSX 10.8',
        },
        {
          'browserName': 'Safari',
          'version': '6.2',
          'platform': 'Mac OSX 10.8',
        },
      ],
      DEFAULTS.common,
      DEFAULTS.desktop,
      ...overrides);
  }

  static mobile(...overrides) {
    return this.merge_(
      [
        {
          'browserName': 'Safari',
          'deviceName': 'iPad 3 Simulator',
          'platformVersion': '6.1',
          'platformName': 'iOS',
          'deviceOrientation': 'landscape',
        },
      ],
      DEFAULTS.common,
      DEFAULTS.mobile,
      ...overrides);
  }

  static merge_(browsers, ...overrides) {
    return browsers
      .map((browser) => Object.assign(browser, ...overrides))
      .map((browser) => Object.assign({password: browser.authkey}, browser));
  }
}

module.exports = {CbtBrowserConfig};
