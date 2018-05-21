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

const fs = require('mz/fs');
const request = require('request-promise-native');
const stringify = require('json-stable-stringify');

const CliArgParser = require('./cli-arg-parser');
const GitRepo = require('./git-repo');

/**
 * Reads and writes a `golden.json` or `snapshot.json` file.
 */
class SnapshotStore {
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
   * Writes the data to the given `golden.json` file path.
   * @param {!SnapshotSuiteJson} jsonData
   * @return {!Promise<void>}
   */
  async writeToDisk(jsonData) {
    const jsonFilePath = this.cliArgs_.goldenPath;
    const jsonFileContent = stringify(jsonData, {space: '  '}) + '\n';
    await fs.writeFile(jsonFilePath, jsonFileContent);
    console.log(`\n\nDONE updating "${jsonFilePath}"!\n\n`);
  }

  /**
   * Parses the `golden.json` file specified by the `--mdc-diff-base` CLI arg.
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromDiffBase() {
    const goldenJsonStr = await this.fetchGoldenJsonString_();
    return JSON.parse(goldenJsonStr);
  }

  /**
   * Transforms the given test cases into `golden.json` format.
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromTestCases(testCases) {
    const jsonData = {};

    testCases.forEach((testCase) => {
      const htmlFileKey = testCase.htmlFile.destinationRelativeFilePath;
      const htmlFileUrl = testCase.htmlFile.publicUrl;

      jsonData[htmlFileKey] = {
        publicUrl: htmlFileUrl,
        screenshots: {},
      };

      testCase.screenshotImageFiles.forEach((screenshotImageFile) => {
        const screenshotKey = screenshotImageFile.userAgent.alias;
        const screenshotUrl = screenshotImageFile.publicUrl;

        jsonData[htmlFileKey].screenshots[screenshotKey] = screenshotUrl;
      });
    });

    return jsonData;
  }

  /**
   * @return {!Promise<string>}
   * @private
   */
  async fetchGoldenJsonString_() {
    /** @type {!DiffSource} */
    const diffSource = await this.cliArgs_.parseDiffBase();

    const publicUrl = diffSource.publicUrl;
    if (publicUrl) {
      return request({
        method: 'GET',
        uri: publicUrl,
      });
    }

    const localFilePath = diffSource.localFilePath;
    if (localFilePath) {
      return fs.readFile(localFilePath, {encoding: 'utf8'});
    }

    const rev = diffSource.gitRevision;
    if (rev) {
      return this.gitRepo_.getFileAtRevision(rev.snapshotFilePath, rev.commit);
    }

    const rawDiffBase = this.cliArgs_.diffBase;
    throw new Error(`Unable to parse '--mdc-diff-base=${rawDiffBase}': Expected a URL, local file path, or git ref`);
  }
}

module.exports = SnapshotStore;
