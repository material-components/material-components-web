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

const USE_SAUCE = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);
const PROGRESS = USE_SAUCE ? 'dots' : 'progress';

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

module.exports = function(config) {
  config.set({
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
              'packages/!(mdc-auto-init)/**/*',
              'packages/!(mdc-base)/**/*',
              'packages/!(mdc-checkbox)/**/*',
              'packages/!(mdc-chips)/**/*',
              'packages/!(mdc-data-table)/**/*',
              'packages/!(mdc-dialog)/**/*',
              'packages/!(mdc-dom)/**/*',
              'packages/!(mdc-drawer)/**/*',
              'packages/!(mdc-floating-label)/**/*',
              'packages/!(mdc-form-field)/**/*',
              'packages/!(mdc-icon-button)/**/*',
              'packages/!(mdc-line-ripple)/**/*',
              'packages/!(mdc-linear-progress)/**/*',
              'packages/!(mdc-list)/**/*',
              'packages/!(mdc-menu)/**/*',
              'packages/!(mdc-menu-surface)/**/*',
              'packages/!(mdc-notched-outline)/**/*',
              'packages/!(mdc-radio)/**/*',
              'packages/!(mdc-ripple)/**/*',
              'packages/!(mdc-select)/**/*',
              'packages/!(mdc-slider)/**/*',
              'packages/!(mdc-snackbar)/**/*',
              'packages/!(mdc-switch)/**/*',
              'packages/!(mdc-tab-bar)/**/*',
              'packages/!(mdc-tab-indicator)/**/*',
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
    reporters: [PROGRESS, 'karma-typescript'],
  });

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
