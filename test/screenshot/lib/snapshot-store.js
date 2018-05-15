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

const GitRepo = require('./git-repo');
const CliArgParser = require('./cli-arg-parser');

const HTTP_URL_REGEX = new RegExp('^https?://');

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
   * @param {string} jsonFilePath
   * @return {!Promise<void>}
   */
  async writeToDisk({jsonData, jsonFilePath}) {
    const jsonFileContent = stringify(jsonData, {space: '  '}) + '\n';
    await fs.writeFile(jsonFilePath, jsonFileContent);
    console.log(`\n\nDONE updating "${jsonFilePath}"!\n\n`);
  }

  /**
   * Parses the `golden.json` file from the `master` Git branch.
   * @param {string} jsonFilePath
   * @return {!Promise<!SnapshotSuiteJson>}
   */
  async fromMaster(jsonFilePath) {
    const goldenJsonStr = await this.fetchGoldenJsonString_(jsonFilePath);
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
   * @param {string} defaultGoldenPath
   * @return {!Promise<string>}
   * @private
   */
  async fetchGoldenJsonString_(defaultGoldenPath) {
    const rawDiffBase = this.cliArgs_.diffBase;

    // Diff against a public `golden.json` URL.
    // E.g.: `--mdc-diff-base=https://storage.googleapis.com/.../golden.json`
    const isUrl = HTTP_URL_REGEX.test(rawDiffBase);
    if (isUrl) {
      return request({
        method: 'GET',
        uri: rawDiffBase,
      });
    }

    // Diff against a local `golden.json` file.
    // E.g.: `--mdc-diff-base=/tmp/golden.json`
    const isLocalFile = await fs.exists(rawDiffBase);
    if (isLocalFile) {
      return fs.readFile(rawDiffBase, {encoding: 'utf8'});
    }

    const [inputGoldenRef, inputGoldenPath] = rawDiffBase.split(':');
    const goldenFilePath = inputGoldenPath || defaultGoldenPath;
    const fullGoldenRef = await this.gitRepo_.getFullSymbolicName(inputGoldenRef);

    // Diff against a specific git commit.
    // E.g.: `--mdc-diff-base=abcd1234`
    if (!fullGoldenRef) {
      return this.gitRepo_.getFileAtRevision(goldenFilePath, inputGoldenRef);
    }

    const [, remoteRef] = fullGoldenRef.split(new RegExp('^refs/remotes/'));
    const [, localRef] = fullGoldenRef.split(new RegExp('^refs/heads/'));
    const [, tagRef] = fullGoldenRef.split(new RegExp('^refs/tags/'));

    // Diff against a remote git branch.
    // E.g.: `--mdc-diff-base=origin/master` or `--mdc-diff-base=origin/feat/button/my-fancy-feature`
    if (remoteRef) {
      const remoteNames = await this.gitRepo_.getRemoteNames();
      console.log('');
      console.log('remoteRef:', remoteRef);
      console.log('remoteNames:', remoteNames);
      console.log('');
      const remoteName = remoteNames.find((curRemoteName) => remoteRef.startsWith(curRemoteName + '/'));
      const remoteBranch = remoteRef.substr(remoteName.length + 1); // add 1 for forward-slash separator
      await this.gitRepo_.fetch(remoteBranch, remoteName);
      return this.gitRepo_.getFileAtRevision(goldenFilePath, remoteRef);
    }

    // Diff against a remote git tag.
    // E.g.: `--mdc-diff-base=v0.34.1`
    if (tagRef) {
      await this.gitRepo_.fetch(tagRef);
      return this.gitRepo_.getFileAtRevision(goldenFilePath, tagRef);
    }

    // Diff against a local git branch.
    // E.g.: `--mdc-diff-base=master` or `--mdc-diff-base=HEAD`
    return this.gitRepo_.getFileAtRevision(goldenFilePath, localRef);
  }
}

module.exports = SnapshotStore;
