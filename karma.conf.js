/**
 * @license
 * Copyright 2016 Google Inc.
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

const path = require('path');
const webpackConfig = require('./webpack.config')[0];

const USING_TRAVISCI = Boolean(process.env.TRAVIS);
const USING_SL = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);

const LOCAL_LAUNCHERS = {
  /** See https://github.com/travis-ci/travis-ci/issues/8836#issuecomment-348248951 */
  'ChromeHeadlessNoSandbox': {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox'],
  },
};

const SAUCE_LAUNCHERS = {
  /*
   * Chrome (desktop)
   */

  'sl-chrome-stable': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'macOS 10.12',
    extendedDebugging: true,
  },
  // 'sl-chrome-beta': {
  //   base: 'SauceLabs',
  //   browserName: 'chrome',
  //   version: 'dev',
  //   platform: 'macOS 10.12',
  //   extendedDebugging: true,
  // },
  // 'sl-chrome-previous': {
  //   base: 'SauceLabs',
  //   browserName: 'chrome',
  //   version: 'latest-1',
  //   platform: 'macOS 10.12',
  //   extendedDebugging: true,
  // },

  /*
   * Firefox
   */

  'sl-firefox-stable': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 10',
    extendedDebugging: true,
  },
  // 'sl-firefox-previous': {
  //   base: 'SauceLabs',
  //   browserName: 'firefox',
  //   version: 'latest-1',
  //   platform: 'Windows 10',
  //   extendedDebugging: true,
  // },

  /*
   * IE
   */

  'sl-ie': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10',
  },

  /*
   * Edge
   */

  // TODO(sgomes): Re-enable Edge and Safari after Sauce Labs problems are fixed.
  // 'sl-edge': {
  //   base: 'SauceLabs',
  //   browserName: 'microsoftedge',
  //   version: 'latest',
  //   platform: 'Windows 10',
  // },

  /*
   * Safari (desktop)
   */

  // 'sl-safari-stable': {
  //   base: 'SauceLabs',
  //   browserName: 'safari',
  //   version: 'latest',
  //   platform: 'macOS 10.12',
  // },
  // 'sl-safari-previous': {
  //   base: 'SauceLabs',
  //   browserName: 'safari',
  //   version: '9.0',
  //   platform: 'OS X 10.11',
  // },

  /*
   * Safari (mobile)
   */

  'sl-ios-safari-latest': {
    base: 'SauceLabs',
    deviceName: 'iPhone Simulator',
    platformVersion: '11.0',
    platformName: 'iOS',
    browserName: 'Safari',
  },
  // 'sl-ios-safari-previous': {
  //   base: 'SauceLabs',
  //   deviceName: 'iPhone Simulator',
  //   platformVersion: '9.3',
  //   platformName: 'iOS',
  //   browserName: 'Safari',
  // },
};

const getLaunchers = () => USING_SL ? SAUCE_LAUNCHERS : LOCAL_LAUNCHERS;
const getBrowsers = () => USING_TRAVISCI ? Object.keys(getLaunchers()) : ['Chrome'];

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/unit/index.js',
    ],
    preprocessors: {
      'test/unit/index.js': ['webpack', 'sourcemap'],
    },
    reporters: ['dots', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: getBrowsers(),
    browserDisconnectTimeout: 40000,
    browserNoActivityTimeout: 120000,
    captureTimeout: 240000,
    concurrency: USING_SL ? 4 : Infinity,
    customLaunchers: getLaunchers(),

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {type: 'lcovonly', subdir: '.'},
        {type: 'json', subdir: '.', file: 'coverage.json'},
        {type: 'html'},
      ],
    },

    client: {
      mocha: {
        reporter: 'html',
        ui: 'qunit',

        // Number of milliseconds to wait for an individual `test(...)` function to complete.
        // The default is 2000.
        timeout: 10000,
      },
    },

    webpack: Object.assign({}, webpackConfig, {
      devtool: 'inline-source-map',
      module: Object.assign({}, webpackConfig.module, {
        // Cover source files when not debugging tests. Otherwise, omit coverage instrumenting to get
        // uncluttered source maps.
        rules: webpackConfig.module.rules.concat([config.singleRun ? {
          test: /\.js$/,
          include: path.resolve('./packages'),
          exclude: [
            /node_modules/,
            /adapter.js/,
          ],
          loader: 'istanbul-instrumenter-loader',
          query: {esModules: true},
        } : undefined]).filter(Boolean),
      }),
    }),

    webpackMiddleware: {
      noInfo: true,
    },
  });

  if (USING_SL) {
    const sauceLabsConfig = {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
    };

    if (USING_TRAVISCI) {
      // See https://github.com/karma-runner/karma-sauce-launcher/issues/73
      Object.assign(sauceLabsConfig, {
        testName: 'Material Components Web Unit Tests - CI',
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        startConnect: false,
      });
    }

    config.set({
      sauceLabs: sauceLabsConfig,
      // Attempt to de-flake Sauce Labs tests on TravisCI.
      transports: ['polling'],
      browserDisconnectTolerance: 3,
    });
  }
};
