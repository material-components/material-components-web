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

// https://github.com/babel/babel-preset-env/issues/112#issuecomment-269761545
require('babel-polyfill');
require('karma-cbt-launcher');

const USING_TRAVISCI = Boolean(process.env.TRAVIS);
const USING_CBT = Boolean(process.env.MDC_CBT_USERNAME && process.env.MDC_CBT_AUTHKEY);

const LOCAL_LAUNCHERS = {
  /** See https://github.com/travis-ci/travis-ci/issues/8836#issuecomment-348248951 */
  'ChromeHeadlessNoSandbox': {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox'],
  },
};

// Config generator: https://app.crossbrowsertesting.com/selenium/run
const CBT_LAUNCHERS = {
  'Chrome': {
    base: 'CrossBrowserTesting',
    browserName: 'Chrome',
    platform: 'Windows 10',
  },
  'Firefox': {
    base: 'CrossBrowserTesting',
    browserName: 'Firefox',
    platform: 'Windows 10',
  },
  'Internet Explorer': {
    base: 'CrossBrowserTesting',
    browserName: 'Internet Explorer',
    version: '11',
    platform: 'Windows 10',
  },
  'MicrosoftEdge': {
    base: 'CrossBrowserTesting',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
  },
  'Safari': {
    base: 'CrossBrowserTesting',
    browserName: 'Safari',
    deviceName: 'iPhone X Simulator',
    platformVersion: '11.0',
    platformName: 'iOS',
    deviceOrientation: 'landscape',
  },
};

const getLaunchers = () => USING_CBT ? CBT_LAUNCHERS : LOCAL_LAUNCHERS;
const getBrowsers = () => USING_TRAVISCI ? Object.keys(getLaunchers()) : ['Chrome'];

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: [
      'karma-*',
    ],
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
    concurrency: USING_CBT ? 2 : Infinity,
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

  if (USING_CBT) {
    const cbtConfig = {
      username: process.env.MDC_CBT_USERNAME,
      authkey: process.env.MDC_CBT_AUTHKEY,
    };

    if (USING_TRAVISCI) {
      // See https://github.com/karma-runner/karma-sauce-launcher/issues/73
      Object.assign(cbtConfig, {
        // testName: 'Material Components Web Unit Tests - CI',
        // tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        // startConnect: false,
      });
    }

    config.set({
      cbtConfig,
      // Attempt to de-flake Sauce Labs tests on TravisCI.
      transports: ['polling'],
      browserDisconnectTolerance: 3,
    });
  }
};
