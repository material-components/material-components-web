/**
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

/**
 * @fileoverview Runs a webpack config file and returns its module exports as a string.
 */

const fsx = require('fs-extra');
const jsonStringifySafe = require('json-stringify-safe');
const path = require('path');

const MockEnv = require('./mock-env');

const PROJECT_ROOT_ABSOLUTE_PATH = path.resolve(__dirname, '../../');

module.exports = class {
  /**
   * Simulates a build command (`npm run build`, `npm run build:min`, or `npm run dev`), and returns both the generated
   * config object exported by the webpack config file as well as the expected (golden) config object.
   *
   * @param {string} configPath Path to a webpack.config.js file
   * @param {string} goldenPath Path to a JSON file containing the expected module exports
   * @param {string} npmCmd Command passed to `npm run` (e.g., `dev`, `build:min`, `test:buildconfig`)
   * @param {string=} mdcEnv One of ["", "development", "production"]
   * @param {boolean=} bootstrapGolden If `true`, the actual generated config exports will be written to the golden file
   * @return {{generatedWebpackConfig: string, expectedWebpackConfig: string}} Stringified JSON representations of both
   *   the actual and expected webpack config exports.
   */
  setupTest({
    configPath,
    goldenPath,
    npmCmd,
    mdcEnv = '',
    bootstrapGolden = false,
  }) {
    const env = new MockEnv();

    try {
      env.mock('npm_lifecycle_event', npmCmd);
      env.mock('MDC_ENV', mdcEnv);

      const generatedWebpackConfig = normalizeForDiffing(serialize(requireUncached(configPath)));

      if (bootstrapGolden) {
        fsx.writeFileSync(goldenPath, generatedWebpackConfig, {encoding: 'utf8'});
      }

      const expectedWebpackConfig = normalizeForDiffing(fsx.readFileSync(goldenPath, {encoding: 'utf8'}));

      return {
        generatedWebpackConfig,
        expectedWebpackConfig,
      };
    } finally {
      env.restoreAll();
    }
  }
};

/**
 * Same as `require()`, but bypasses the module cache, forcing Node to reevaluate the requested module file.
 * This is necessary to allow tests to set their own environment variables.
 * Note that only the requested module is purged from the cache, not its dependencies.
 * @param {string} module
 * @return {*}
 */
function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

/**
 * Stringifies the given object to JSON. Only the object's own enumerable properties are serialized. Circular references
 * and function values are omitted.
 * @param {!Object|!Array} obj
 * @return {string}
 */
function serialize(obj) {
  return jsonStringifySafe(obj, null, 2);
}

/**
 * Removes strings that can vary across machines, such as the path to the local MDC Web repo.
 * @param {string} configString
 * @return {string}
 */
function normalizeForDiffing(configString) {
  return ensureTrailingNewline(replaceAll(configString, PROJECT_ROOT_ABSOLUTE_PATH, ''));
}

/**
 * Replaces all occurrences of `find` with `replace` in the given string (`str`).
 * @param {string} str
 * @param {string} find
 * @param {string} replace
 * @return {string}
 */
function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

/**
 * Ensures that the given string ends with a newline character (`\n`).
 * @param {string} str
 * @return {string}
 */
function ensureTrailingNewline(str) {
  return str.endsWith('\n') ? str : str + '\n';
}
