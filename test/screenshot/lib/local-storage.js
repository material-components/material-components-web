/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('mz/fs');
const glob = require('glob');
const path = require('path');

const CliArgParser = require('./cli-arg-parser');
const GitRepo = require('./git-repo');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');
const {UploadableTestCase, UploadableFile} = require('./types');

class LocalStorage {
  constructor() {
    /**
     * @type {!CliArgParser}
     * @private
     */
    this.cliArgs_ = new CliArgParser();

    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();
  }

  /**
   * @return {!Promise<!Array<string>>} File/dir paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   */
  async fetchAllTopLevelAssetFileAndDirPaths() {
    return (await this.filterIgnoredFiles_(await fs.readdir(TEST_DIR_RELATIVE_PATH))).sort();
  }

  /**
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   */
  async fetchAllAssetFilePaths() {
    return (await this.filterIgnoredFiles_(glob.sync('**/*', {cwd: TEST_DIR_RELATIVE_PATH, nodir: true}))).sort();
  }

  /**
   * @return {!Promise<{
   *   allTestCases: !Array<!UploadableTestCase>,
   *   runnableTestCases: !Array<!UploadableTestCase>,
   *   skippedTestCases: !Array<!UploadableTestCase>,
   * }>}
   */
  async fetchTestCases(baseUploadDir) {
    /** @type {!Array<!UploadableTestCase>} */
    const allTestCases = (await this.fetchAllAssetFilePaths())
      .filter((relativeFilePath) => {
        return relativeFilePath.endsWith('.html') && relativeFilePath.includes('/mdc-');
      })
      .map((relativeFilePath) => {
        const isRunnable = this.isRunnableTestCase_(relativeFilePath);
        return new UploadableTestCase({
          htmlFile: new UploadableFile({
            destinationBaseUrl: this.cliArgs_.gcsBaseUrl,
            destinationParentDirectory: baseUploadDir,
            destinationRelativeFilePath: relativeFilePath.replace(TEST_DIR_RELATIVE_PATH, ''),
          }),
          isRunnable,
        });
      })
    ;

    const runnableTestCases = allTestCases.filter((testCase) => testCase.isRunnable);
    const skippedTestCases = allTestCases.filter((testCase) => !testCase.isRunnable);

    runnableTestCases.forEach((testCase, index) => {
      testCase.htmlFile.queueIndex = index;
      testCase.htmlFile.queueLength = runnableTestCases.length;
    });

    return {
      allTestCases,
      runnableTestCases,
      skippedTestCases,
    };
  }

  /**
   * @param {!Array<string>} shortPaths File paths relative to the asset directory. E.g.: "browser.json".
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   * @private
   */
  async filterIgnoredFiles_(shortPaths) {
    const relativePaths = shortPaths.map((name) => path.join(TEST_DIR_RELATIVE_PATH, name));

    /** @type {!Array<string>} */
    const ignoredTopLevelFilesAndDirs = await this.gitRepo_.getIgnoredPaths(relativePaths);

    return relativePaths.filter((relativePath) => {
      const isBuildOutputDir = relativePath.split(path.sep).includes('out');
      const isIgnoredFile = ignoredTopLevelFilesAndDirs.includes(relativePath);
      return isBuildOutputDir || !isIgnoredFile;
    });
  }

  /**
   * @param {string} relativeHtmlFilePath
   * @return {boolean}
   * @private
   */
  isRunnableTestCase_(relativeHtmlFilePath) {
    const relativePath = relativeHtmlFilePath;
    const isIncluded =
      this.cliArgs_.includeUrlPatterns.length === 0 ||
      this.cliArgs_.includeUrlPatterns.some((pattern) => pattern.test(relativePath));
    const isExcluded = this.cliArgs_.excludeUrlPatterns.some((pattern) => pattern.test(relativePath));
    return isIncluded && !isExcluded;
  }
}

module.exports = LocalStorage;
