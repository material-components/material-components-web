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
 * @fileoverview Executes a webpack config file and returns its module exports as a string.
 */

const fsx = require('fs-extra');
const jsonStringifySafe = require('json-stringify-safe');
const path = require('path');

const MockEnv = require('./mock-env');

const PROJECT_ROOT_ABSOLUTE_PATH = path.resolve(__dirname, '../../');

module.exports = class {
  /**
   * Simulates the `npm run build`, `npm run build:min`, and `npm run dev` commands, returning both the
   * actual generated config object exported by the webpack config file, as well as the expected (golden) config object.
   * @param {string} configPath Path to a webpack.config.js file
   * @param {string} goldenPath Path to a JSON file containing the expected module exports
   * @param {string} npmCmd Command passed to `npm run` - e.g., `dev`, `build:min`, `test:buildconfig`
   * @param {string=} mdcEnv One of ["", "development", "production"]
   * @param {boolean=} bootstrapGolden If `true`, the actual config exports are written to the golden file
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

    env.mock('npm_lifecycle_event', npmCmd);
    env.mock('MDC_ENV', mdcEnv);

    const fsTextOpts = {encoding: 'utf8'};
    const generatedWebpackConfig = redactProjectRootPath(serialize(requireFresh(configPath)));

    if (bootstrapGolden) {
      fsx.writeFileSync(goldenPath, generatedWebpackConfig, fsTextOpts);
    }

    const expectedWebpackConfig = redactProjectRootPath(fsx.readFileSync(goldenPath, fsTextOpts));

    env.restoreAll();

    return {
      generatedWebpackConfig,
      expectedWebpackConfig,
    };
  }
};

/**
 * Same as `require`, but bypasses the module cache, forcing Node to reevaluate the requested module file.
 * @param {string} module
 * @return {*}
 */
function requireFresh(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

/**
 * Stringifies the given JS object to a serializable JSON format. Cyclical references are omitted.
 * @param {!Object|!Array} obj
 * @return {string}
 */
function serialize(obj) {
  return jsonStringifySafe(obj, null, 2);
}

/**
 * Removes all occurrences of the MDC Web repo's root directory path from the given string.
 * @param {string} str
 * @return {string}
 */
function redactProjectRootPath(str) {
  return str.split(PROJECT_ROOT_ABSOLUTE_PATH).join('');
}
