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

    /**
     * @type {?SnapshotSuiteJson}
     * @private
     */
    this.cachedGoldenJsonFromDiffBase_ = null;
  }

  /**
   * Writes the data to the given `golden.json` file path.
   * @param {!Array<!UploadableTestCase>} testCases
   * @param {!Array<!ImageDiffJson>} diffs
   * @return {!Promise<void>}
   */
  async writeToDisk({testCases, diffs}) {
    const jsonData = await this.getJsonData_({testCases, diffs});
    const jsonFilePath = this.cliArgs_.goldenPath;
    const jsonFileContent = stringify(jsonData, {space: '  '}) + '\n';

    await fs.writeFile(jsonFilePath, jsonFileContent);

    console.log(`\n\nDONE updating "${jsonFilePath}"!\n\n`);
  }

  async getJsonData_({testCases, diffs}) {
    let jsonData;

    if (this.cliArgs_.hasAnyFilters()) {
      // Selective update: Keep existing `golden.json`, and only update screenshots that have changed.
      jsonData = await this.partialUpdate_({testCases, diffs});
    } else {
      // Full update: Overwrite existing `golden.json` with new data, but retain unchanged screenshots.
      jsonData = await this.fullUpdate_({testCases, diffs});
    }

    return jsonData;
  }

  async partialUpdate_({testCases, diffs}) {
    const oldJsonData = await this.fromDiffBase();
    const newJsonData = await this.fromTestCases(testCases);
    const jsonData = this.deepCloneJson_(oldJsonData);

    diffs.forEach((diff) => {
      const htmlFilePath = diff.htmlFilePath;
      const browserKey = diff.browserKey;
      if (jsonData[htmlFilePath]) {
        jsonData[htmlFilePath].publicUrl = newJsonData[htmlFilePath].publicUrl;
        jsonData[htmlFilePath].screenshots[browserKey] = newJsonData[htmlFilePath].screenshots[browserKey];
      } else {
        jsonData[htmlFilePath] = this.deepCloneJson_(newJsonData[htmlFilePath]);
      }
    });

    return jsonData;
  }

  async fullUpdate_({testCases, diffs}) {
    const oldJsonData = await this.fromDiffBase();
    const newJsonData = await this.fromTestCases(testCases);
    const jsonData = this.deepCloneJson_(newJsonData);

    for (const [htmlFilePath, page] of Object.entries(jsonData)) {
      if (!oldJsonData[htmlFilePath]) {
        continue;
      }

      let pageHasChanges = false;

      for (const [browserKey, newUrl] of Object.entries(page.screenshots)) {
        const changedUrl = diffs.find((diff) => diff.htmlFilePath === htmlFilePath && diff.browserKey === browserKey);
        const oldUrl = oldJsonData[htmlFilePath].screenshots[browserKey];
        if (!changedUrl && oldUrl) {
          page.screenshots[browserKey] = oldUrl;
        }

        if (changedUrl) {
          pageHasChanges = true;
        }
      }

      if (!pageHasChanges) {
        page.publicUrl = oldJsonData[htmlFilePath].publicUrl;
      }
    }

    return jsonData;
  }

  /**
   * Parses the `golden.json` file specified by the `--mdc-diff-base` CLI arg.
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromDiffBase() {
    if (!this.cachedGoldenJsonFromDiffBase_) {
      this.cachedGoldenJsonFromDiffBase_ = JSON.parse(await this.fetchGoldenJsonString_());
    }

    // Deep-clone the cached object to avoid accidental mutation of shared state
    return this.deepCloneJson_(this.cachedGoldenJsonFromDiffBase_);
  }

  deepCloneJson_(json) {
    return JSON.parse(JSON.stringify(json));
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
