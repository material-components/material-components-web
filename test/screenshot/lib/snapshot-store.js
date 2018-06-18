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
   * @param {!RunReport} runReport
   * @return {!SnapshotSuiteJson}
   */
  fromApproval(runReport) {
    const approvedRunReport = this.filterReportForApproval_(runReport);

    const newGolden = this.deepCloneJson_(approvedRunReport.runTarget.baseGoldenJsonData);

    runReport.runResult.diffs.forEach((diff) => {
      newGolden[diff.htmlFilePath].publicUrl = diff.snapshotPageUrl;
      newGolden[diff.htmlFilePath].screenshots[diff.userAgentAlias] = diff.actualImageUrl;
    });

    runReport.runResult.added.forEach((diff) => {
      newGolden[diff.htmlFilePath] = newGolden[diff.htmlFilePath] || {
        publicUrl: diff.snapshotPageUrl,
        screenshots: {},
      };
      newGolden[diff.htmlFilePath].publicUrl = diff.snapshotPageUrl;
      newGolden[diff.htmlFilePath].screenshots[diff.userAgentAlias] = diff.actualImageUrl;
    });

    runReport.runResult.removed.forEach((diff) => {
      delete newGolden[diff.htmlFilePath].screenshots[diff.userAgentAlias];
      if (newGolden[diff.htmlFilePath].screenshots.length === 0) {
        delete newGolden[diff.htmlFilePath];
      }
    });

    // TODO(acdvorak): Is this necessary?
    approvedRunReport.runResult.approvedGoldenJsonData = newGolden;

    return newGolden;
  }

  /**
   * @param {!RunReport} runReport
   * @return {!RunReport}
   */
  filterReportForApproval_(runReport) {
    const approvedRunReport = this.deepCloneJson_(runReport);

    if (this.cliArgs_.all) {
      return approvedRunReport;
    }

    if (!this.cliArgs_.allDiffs) {
      runReport.runResult.diffs = runReport.runResult.diffs.filter((diff) => {
        // TODO(acdvorak): Document the ':' separator format
        const isApproved = this.cliArgs_.diffs.has(`${diff.htmlFilePath}:${diff.userAgentAlias}`);
        if (!isApproved) {
          runReport.runResult.skipped.push(diff);
        }
        return isApproved;
      });
    }

    if (!this.cliArgs_.allAdded) {
      runReport.runResult.added = runReport.runResult.added.filter((diff) => {
        // TODO(acdvorak): Document the ':' separator format
        const isApproved = this.cliArgs_.added.has(`${diff.htmlFilePath}:${diff.userAgentAlias}`);
        if (!isApproved) {
          runReport.runResult.skipped.push(diff);
        }
        return isApproved;
      });
    }

    if (!this.cliArgs_.allRemoved) {
      runReport.runResult.removed = runReport.runResult.removed.filter((diff) => {
        // TODO(acdvorak): Document the ':' separator format
        const isApproved = this.cliArgs_.removed.has(`${diff.htmlFilePath}:${diff.userAgentAlias}`);
        if (!isApproved) {
          runReport.runResult.skipped.push(diff);
        }
        return isApproved;
      });
    }

    return approvedRunReport;
  }

  /**
   * @param {!RunReport} runReport
   * @return {!Promise<string>}
   */
  async getSnapshotJsonString(runReport) {
    /** @type {!SnapshotSuiteJson} */
    const snapshot = this.deepCloneJson_(runReport.runTarget.baseGoldenJsonData);

    runReport.runResult.diffs.forEach((diff) => {
      snapshot[diff.htmlFilePath].screenshots[diff.userAgentAlias] = diff.actualImageUrl;
    });

    runReport.runResult.added.forEach((diff) => {
      snapshot[diff.htmlFilePath] = snapshot[diff.htmlFilePath] || {
        publicUrl: diff.snapshotPageUrl,
        screenshots: {},
      };
      snapshot[diff.htmlFilePath].screenshots[diff.userAgentAlias] = diff.actualImageUrl;
    });

    runReport.runResult.removed.forEach((diff) => {
      delete snapshot[diff.htmlFilePath].screenshots[diff.userAgentAlias];
      if (Object.keys(snapshot[diff.htmlFilePath].screenshots).length === 0) {
        delete snapshot[diff.htmlFilePath];
      }
    });

    return stringify(snapshot, {space: '  '}) + '\n';
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
