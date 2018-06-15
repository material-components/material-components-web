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
   * @param {!RunReport} runReport
   * @return {!Promise<string>}
   */
  async getSnapshotJsonString(runReport) {
    const jsonData = await this.getJsonData_(runReport);
    return stringify(jsonData, {space: '  '}) + '\n';
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<void>}
   */
  async writeToDisk(runReport) {
    const jsonFileContent = await this.getSnapshotJsonString(runReport);
    const jsonFilePath = this.cliArgs_.goldenPath;

    await fs.writeFile(jsonFilePath, jsonFileContent);

    console.log(`\n\nDONE updating "${jsonFilePath}"!\n\n`);
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

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!SnapshotSuiteJson>}
   * @private
   */
  async getJsonData_(runReport) {
    return this.cliArgs_.hasAnyFilters()
      ? await this.updateFilteredScreenshots_(runReport)
      : await this.updateAllScreenshots_(runReport);
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!SnapshotSuiteJson>}
   * @private
   */
  async updateFilteredScreenshots_(runReport) {
    const {runnableTestCases} = runReport.runTarget;
    const {diffs} = runReport.runResult;
    const oldJsonData = await this.fromDiffBase();
    const newJsonData = await this.fromTestCases(runnableTestCases);
    const jsonData = this.deepCloneJson_(oldJsonData);

    diffs.forEach((diff) => {
      const htmlFilePath = diff.htmlFilePath;
      const browserKey = diff.browserKey;
      const newPage = newJsonData[htmlFilePath];
      if (jsonData[htmlFilePath]) {
        jsonData[htmlFilePath].publicUrl = newPage.publicUrl;
        jsonData[htmlFilePath].screenshots[browserKey] = newPage.screenshots[browserKey];
      } else {
        jsonData[htmlFilePath] = this.deepCloneJson_(newPage);
      }
    });

    return jsonData;
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<!SnapshotSuiteJson>}
   * @private
   */
  async updateAllScreenshots_(runReport) {
    const {runnableTestCases} = runReport.runTarget;
    const {diffs} = runReport.runResult;
    const oldJsonData = await this.fromDiffBase();
    const newJsonData = await this.fromTestCases(runnableTestCases);

    const existsInOldJsonData = ([htmlFilePath]) => htmlFilePath in oldJsonData;

    /** @type {!Array<[string, !SnapshotPageJson]>} */
    const newMatchingPageEntries = Object.entries(newJsonData).filter(existsInOldJsonData);

    // TODO(acdvorak): Refactor this method for clarity. See
    // https://github.com/material-components/material-components-web/pull/2777#discussion_r190439992
    for (const [htmlFilePath, newPage] of newMatchingPageEntries) {
      let pageHasDiffs = false;

      for (const browserKey of Object.keys(newPage.screenshots)) {
        const oldUrl = oldJsonData[htmlFilePath].screenshots[browserKey];
        const screenshotHasDiff = diffs.find((diff) => {
          return diff.htmlFilePath === htmlFilePath && diff.browserKey === browserKey;
        });

        if (oldUrl && !screenshotHasDiff) {
          newPage.screenshots[browserKey] = oldUrl;
        }

        if (screenshotHasDiff) {
          pageHasDiffs = true;
        }
      }

      if (!pageHasDiffs) {
        newPage.publicUrl = oldJsonData[htmlFilePath].publicUrl;
      }
    }

    return newJsonData;
  }

  /**
   * Creates a deep clone of the given `source` object's own enumerable properties.
   * Non-JSON-serializable properties (such as functions or symbols) are silently discarded.
   * The returned value is structurally equivalent, but not referentially equal, to the input.
   * In Java parlance:
   *   clone.equals(source) // true
   *   clone == source      // false
   * @param {!Object} source JSON object to clone
   * @return {!Object} Deep clone of `source` object
   * @private
   */
  deepCloneJson_(source) {
    return JSON.parse(JSON.stringify(source));
  }
}

module.exports = SnapshotStore;
