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
const stringify = require('json-stable-stringify');

const GitRepo = require('./git-repo');
const CliArgParser = require('./cli-arg-parser');

/**
 * Reads and writes a `golden.json` or `snapshot.json` file.
 */
class SnapshotStore {
  /**
   * @param {!GoldenJson} jsonData
   */
  constructor({jsonData}) {
    /**
     * @type {!GoldenJson}
     */
    this.jsonData = jsonData;
  }

  /**
   * Writes the data to the given `golden.json` file path.
   * @param {string} jsonFilePath
   * @param {string} diffReportUrl
   * @return {!Promise<void>}
   */
  async writeToDisk({jsonFilePath, diffReportUrl}) {
    this.jsonData.diffReportUrl = diffReportUrl;
    const jsonFileContent = stringify(this.jsonData, {space: '  '}) + '\n';
    await fs.writeFile(jsonFilePath, jsonFileContent);
    console.log(`\n\nDONE updating "${jsonFilePath}"!\n\n`);
  }

  /**
   * Parses the `golden.json` file from the `master` Git branch.
   * @param {string} jsonFilePath
   * @return {!Promise<!SnapshotStore>}
   */
  static async fromMaster(jsonFilePath) {
    const cliArgs = new CliArgParser();
    const mdcGitRepo = new GitRepo();
    await mdcGitRepo.fetch(cliArgs.diffBase);
    const goldenJsonStr = await mdcGitRepo.getFileAtRevision(jsonFilePath, cliArgs.diffBase);
    return new SnapshotStore({
      jsonData: JSON.parse(goldenJsonStr),
    });
  }

  /**
   * Transforms the given test cases into `golden.json` format.
   * @param {!Array<!UploadableTestCase>} testCases
   * @return {!Promise<!SnapshotStore>}
   */
  static async fromTestCases(testCases) {
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

    return new SnapshotStore({jsonData});
  }
}

module.exports = SnapshotStore;
