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
const webpackConfig = require('./webpack.config')[1];

const USE_SAUCE = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);
// If true, runs new suite of Jasmine foundation unit tests.
// Otherwise, runs old Mocha unit tests.
const USE_JASMINE = Boolean(process.env.USE_JASMINE);

// Files to include in Jasmine tests.
const FILES_TO_USE = [
  'packages/*/!(node_modules)/**/!(*.d).ts',
  'packages/*/!(*.d).ts',
  'testing/**/*.ts',
];

// Files to exclude in Jasmine tests.
const EXCLUDE_FILES = [
  'packages/**/*.scss.test.ts',
  'testing/featuretargeting/**',
  'testing/ts-node.register.js',
  'scripts/**/*.ts',
];

const HEADLESS_LAUNCHERS = {
  'ChromeHeadlessNoSandbox': {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox'],
  },
  'FirefoxHeadless': {
    base: 'Firefox',
    flags: ['-headless'],
  },
};

const SAUCE_LAUNCHERS = {
  'sl-ie': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10',
  },
};

const customLaunchers = Object.assign({}, USE_SAUCE ? SAUCE_LAUNCHERS : {}, HEADLESS_LAUNCHERS);
const browsers = USE_SAUCE ? Object.keys(customLaunchers) : ['Chrome'];
const istanbulInstrumenterLoader = {
  use: [{
    loader: 'istanbul-instrumenter-loader',
    options: {esModules: true},
  }],
  exclude: [
    /node_modules/,
    /adapter.[jt]s$/,
    /animation\/.*$/,
    /base\/.*$/,
    /checkbox\/.*$/,
    /chips\/.*$/,
    /constants.[jt]s$/,
    /data-table\/.*$/,
    /floating-label\/.*$/,
    /form-field\/.*$/,
    /icon-button\/.*$/,
    /line-ripple\/.*$/,
    /list\/.*$/,
    /menu\/.*$/,
    /menu-surface\/.*$/,
    /notched-outline\/.*$/,
    /radio\/.*$/,
    /slider\/.*$/,
    /switch\/.*$/,
    /tab-bar\/.*$/,
    /tab-scroller\/.*$/,
    /tab\/.*$/,
    /textfield\/.*$/,
    /top-app-bar\/.*$/,
  ],
  include: path.resolve('./packages'),
};

const mochaConfig = {
  basePath: '',
  // Refer https://github.com/karma-runner/karma-mocha
  frameworks: ['mocha'],
  files: [
    // Refer https://github.com/babel/karma-babel-preprocessor
    'node_modules/@babel/polyfill/dist/polyfill.js',
    'test/unit/index.js',
  ],
  preprocessors: {
    'test/unit/index.js': ['webpack', 'sourcemap'],
  },
  reporters: ['progress', 'coverage-istanbul'],

  coverageIstanbulReporter: {
    'dir': 'coverage',
    'reports': ['html', 'lcovonly', 'json'],
    'report-config': {
      lcovonly: {subdir: '.'},
      json: {subdir: '.', file: 'coverage.json'},
    },
    // Set 'emitWarning = true' to NOT fail tests if the thresholds are not met
    'emitWarning': false,
    'thresholds': {
      statements: 95,
      branches: 95,
      lines: 95,
      functions: 95,
    },
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

  webpackMiddleware: {
    noInfo: true,
    stats: 'minimal',
  },
};

const jasmineConfig = {
  basePath: '',
  files: FILES_TO_USE,
  exclude: EXCLUDE_FILES,
  frameworks: ['jasmine', 'karma-typescript'],
  karmaTypescriptConfig: {
    exclude: EXCLUDE_FILES,
    coverageOptions: {
      threshold: {
        global: {
          // TODO: Raise threshold to at least 90% after more tests have been migrated.
          statements: 80,
          branches: 70,
          functions: 50,
          lines: 80,
          excludes: [
            'adapter.ts',
            'constants.ts',
            'testing/**/*.ts',
            'packages/!(mdc-animation)/**/*',
            'packages/!(mdc-base)/**/*',
            'packages/!(mdc-checkbox)/**/*',
            'packages/!(mdc-chips)/**/*',
            'packages/!(mdc-data-table)/**/*',
            'packages/!(mdc-floating-label)/**/*',
            'packages/!(mdc-form-field)/**/*',
            'packages/!(mdc-icon-button)/**/*',
            'packages/!(mdc-line-ripple)/**/*',
            'packages/!(mdc-list)/**/*',
            'packages/!(mdc-menu)/**/*',
            'packages/!(mdc-menu-surface)/**/*',
            'packages/!(mdc-notched-outline)/**/*',
            'packages/!(mdc-radio)/**/*',
            'packages/!(mdc-slider)/**/*',
            'packages/!(mdc-switch)/**/*',
            'packages/!(mdc-tab-bar)/**/*',
            'packages/!(mdc-tab-scroller)/**/*',
            'packages/!(mdc-tab)/**/*',
            'packages/!(mdc-textfield)/**/*',
            'packages/!(mdc-top-app-bar)/**/*',
          ],
        },
      },
    },
    reports: {
      html: 'coverage',
      lcovonly: 'coverage',
      json: {
        directory: 'coverage',
        filename: 'coverage.json',
      },
    },
    tsconfig: './tsconfig-base.json',
  },
  preprocessors: FILES_TO_USE.reduce((obj, file) => {
    obj[file] = 'karma-typescript';
    return obj;
  }, {}),
  reporters: ['progress', 'karma-typescript'],
};

module.exports = function(config) {
  config.set(Object.assign(USE_JASMINE ? jasmineConfig : mochaConfig, {
    logLevel: config.LOG_INFO,
    port: 9876,
    colors: true,
    browsers: browsers,
    browserDisconnectTimeout: 40000,
    browserNoActivityTimeout: 120000,
    captureTimeout: 240000,
    concurrency: USE_SAUCE ? 10 : Infinity,
    customLaunchers: customLaunchers,
  }));

  if (!USE_JASMINE) {
    // Need to set webpack here rather than in `mochaConfig` to read `config.singleRun`.
    config.set({
      // Refer https://github.com/webpack-contrib/karma-webpack
      webpack: Object.assign({}, webpackConfig, {
        plugins: [], // Exclude UglifyJs plugin from test build.
        mode: 'development',
        module: Object.assign({}, webpackConfig.module, {
          // Cover source files when not debugging tests. Otherwise, omit coverage instrumenting to get
          // uncluttered source maps.
          rules: webpackConfig.module.rules.concat(config.singleRun ? [Object.assign({
            enforce: 'post',
            test: /\.ts$/,
          }, istanbulInstrumenterLoader), Object.assign({
            test: /\.js$/,
          }, istanbulInstrumenterLoader)] : []),
        }),
      }),
    });
  }

  if (USE_SAUCE) {
    const sauceLabsConfig = {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      testName: 'Material Components Web Unit Tests - CI',
      build: process.env.SAUCE_BUILD_ID,
      tunnelIdentifier: process.env.SAUCE_TUNNEL_ID,
    };

    config.set({
      sauceLabs: sauceLabsConfig,
      // Attempt to de-flake Sauce Labs tests.
      transports: ['polling'],
      browserDisconnectTolerance: 3,
    });
  }
};
