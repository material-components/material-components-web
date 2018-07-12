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

const {GOLDEN_JSON_RELATIVE_PATH} = require('./constants');

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
     * @type {!Object<string, !SnapshotSuiteJson>}
     * @private
     */
    this.cachedGoldenJsonMap_ = {};
  }

  /**
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromLocalFile() {
    return JSON.parse(await fs.readFile(GOLDEN_JSON_RELATIVE_PATH, {encoding: 'utf8'}));
  }

  /**
   * Parses the `golden.json` file specified by the `--diff-base` CLI arg.
   * @param {string=} diffBase
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromDiffBase(diffBase = this.cliArgs_.diffBase) {
    if (!this.cachedGoldenJsonMap_[diffBase]) {
      this.cachedGoldenJsonMap_[diffBase] = JSON.parse(await this.fetchGoldenJsonString_(diffBase));
    }

    // Deep-clone the cached object to avoid accidental mutation of shared state
    return this.deepCloneJson_(this.cachedGoldenJsonMap_[diffBase]);
  }

  /**
   * @param {string} diffBase
   * @return {!Promise<string>}
   * @private
   */
  async fetchGoldenJsonString_(diffBase) {
    /** @type {!DiffSource} */
    const diffSource = await this.cliArgs_.parseDiffBase({rawDiffBase: diffBase});

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
    throw new Error(`Unable to parse '--diff-base=${rawDiffBase}': Expected a URL, local file path, or git ref`);
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
   * @param {!RunReport} fullRunReport
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromApproval(fullRunReport) {
    const approvedRunReport = this.filterReportForApproval_(fullRunReport);

    // Update the user's local `golden.json` file in-place.
    const newGolden = this.deepCloneJson_(await this.fromLocalFile());

    approvedRunReport.runResult.diffs.forEach((diff) => {
      newGolden[diff.htmlFilePath] = newGolden[diff.htmlFilePath] || {
        publicUrl: diff.snapshotPageUrl,
        screenshots: {},
      };
      newGolden[diff.htmlFilePath].publicUrl = diff.snapshotPageUrl;
      newGolden[diff.htmlFilePath].screenshots[diff.userAgentAlias] = diff.actualImageUrl;
    });

    approvedRunReport.runResult.added.forEach((diff) => {
      newGolden[diff.htmlFilePath] = newGolden[diff.htmlFilePath] || {
        publicUrl: diff.snapshotPageUrl,
        screenshots: {},
      };
      newGolden[diff.htmlFilePath].publicUrl = diff.snapshotPageUrl;
      newGolden[diff.htmlFilePath].screenshots[diff.userAgentAlias] = diff.actualImageUrl;
    });

    approvedRunReport.runResult.removed.forEach((diff) => {
      if (!newGolden[diff.htmlFilePath]) {
        return;
      }
      delete newGolden[diff.htmlFilePath].screenshots[diff.userAgentAlias];
      if (Object.keys(newGolden[diff.htmlFilePath].screenshots).length === 0) {
        delete newGolden[diff.htmlFilePath];
      }
    });

    return newGolden;
  }

  /**
   * @param {!RunReport} fullRunReport
   * @return {!RunReport}
   */
  filterReportForApproval_(fullRunReport) {
    const approvedRunReport = this.deepCloneJson_(fullRunReport);

    if (this.cliArgs_.all) {
      return approvedRunReport;
    }

    if (!this.cliArgs_.allDiffs) {
      approvedRunReport.runResult.diffs = approvedRunReport.runResult.diffs.filter((diff) => {
        // TODO(acdvorak): Document the ':' separator format
        const isApproved = this.cliArgs_.diffs.has(`${diff.htmlFilePath}:${diff.userAgentAlias}`);
        if (!isApproved) {
          approvedRunReport.runResult.skipped.push(diff);
        }
        return isApproved;
      });
    }

    if (!this.cliArgs_.allAdded) {
      approvedRunReport.runResult.added = approvedRunReport.runResult.added.filter((diff) => {
        // TODO(acdvorak): Document the ':' separator format
        const isApproved = this.cliArgs_.added.has(`${diff.htmlFilePath}:${diff.userAgentAlias}`);
        if (!isApproved) {
          approvedRunReport.runResult.skipped.push(diff);
        }
        return isApproved;
      });
    }

    if (!this.cliArgs_.allRemoved) {
      approvedRunReport.runResult.removed = approvedRunReport.runResult.removed.filter((diff) => {
        // TODO(acdvorak): Document the ':' separator format
        const isApproved = this.cliArgs_.removed.has(`${diff.htmlFilePath}:${diff.userAgentAlias}`);
        if (!isApproved) {
          approvedRunReport.runResult.skipped.push(diff);
        }
        return isApproved;
      });
    }

    return approvedRunReport;
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<void>}
   */
  async writeToDisk(runReport) {
    const jsonFileContent = await this.toJson_(runReport.runResult.approvedGoldenJsonData);
    await fs.writeFile(GOLDEN_JSON_RELATIVE_PATH, jsonFileContent);

    console.log(`DONE updating "${GOLDEN_JSON_RELATIVE_PATH}"!`);
  }

  /**
   * @param {!Object|!Array} object
   * @return {!Promise<string>}
   */
  async toJson_(object) {
    return stringify(object, {space: '  '}) + '\n';
  }

  /**
   * Creates a deep clone of the given `source` object's own enumerable properties.
   * Non-JSON-serializable properties (such as functions or symbols) are silently discarded.
   * The returned value is structurally equivalent, but not referentially equal, to the input.
   * In Java parlance:
   *   clone.equals(source) // true
   *   clone == source      // false
   * @param {!T} source JSON object to clone
   * @return {!T} Deep clone of `source` object
   * @template T
   * @private
   */
  deepCloneJson_(source) {
    return JSON.parse(JSON.stringify(source));
  }
}

module.exports = SnapshotStore;
