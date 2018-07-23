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

const request = require('request-promise-native');
const stringify = require('json-stable-stringify');

const Cli = require('./cli');
const DiffBaseParser = require('./diff-base-parser');
const GitRepo = require('./git-repo');
const GoldenFile = require('./golden-file');
const LocalStorage = require('./local-storage');
const {GOLDEN_JSON_RELATIVE_PATH} = require('./constants');

/**
 * Reads and writes a `golden.json` or `snapshot.json` file.
 */
class GoldenIo {
  constructor() {
    /**
     * @type {!Cli}
     * @private
     */
    this.cli_ = new Cli();

    /**
     * @type {!DiffBaseParser}
     * @private
     */
    this.diffBaseParser_ = new DiffBaseParser();

    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();

    /**
     * @type {!Object<string, !GoldenFile>}
     * @private
     */
    this.cachedGoldenJsonMap_ = {};
  }

  /**
   * @return {!Promise<!GoldenFile>}
   */
  async readFromLocalFile() {
    return new GoldenFile(JSON.parse(await this.localStorage_.readTextFile(GOLDEN_JSON_RELATIVE_PATH)));
  }

  /**
   * Parses the `golden.json` file specified by the `--diff-base` CLI arg.
   * @param {string=} rawDiffBase
   * @return {!Promise<!GoldenFile>}
   */
  async readFromDiffBase(rawDiffBase = this.cli_.diffBase) {
    if (!this.cachedGoldenJsonMap_[rawDiffBase]) {
      const goldenJson = JSON.parse(await this.readFromDiffBase_(rawDiffBase));
      this.cachedGoldenJsonMap_[rawDiffBase] = new GoldenFile(goldenJson);
    }

    // Deep copy to avoid mutating shared state
    return new GoldenFile(this.cachedGoldenJsonMap_[rawDiffBase].toJSON());
  }

  /**
   * @param {string} rawDiffBase
   * @return {!Promise<string>}
   * @private
   */
  async readFromDiffBase_(rawDiffBase) {
    /** @type {!mdc.proto.DiffBase} */
    const parsedDiffBase = await this.diffBaseParser_.parseDiffBase(rawDiffBase);

    const publicUrl = parsedDiffBase.public_url;
    if (publicUrl) {
      return request({
        method: 'GET',
        uri: publicUrl,
      });
    }

    const localFilePath = parsedDiffBase.local_file_path;
    if (localFilePath) {
      return this.localStorage_.readTextFile(localFilePath);
    }

    const rev = parsedDiffBase.git_revision;
    if (rev) {
      return this.gitRepo_.getFileAtRevision(rev.golden_json_file_path, rev.commit);
    }

    const serialized = JSON.stringify({parsedDiffBase, meta}, null, 2);
    throw new Error(
      `Unable to parse '--diff-base=${rawDiffBase}': Expected a URL, local file path, or git ref.\n${serialized}`
    );
  }

  /**
   * @param {!GoldenFile} newGoldenFile
   * @return {!Promise<void>}
   */
  async writeToLocalFile(newGoldenFile) {
    const goldenJsonFilePath = GOLDEN_JSON_RELATIVE_PATH;
    const goldenJsonFileContent = await this.stringify_(newGoldenFile);

    await this.localStorage_.writeTextFile(goldenJsonFilePath, goldenJsonFileContent);

    console.log(`DONE updating "${goldenJsonFilePath}"!`);
  }

  /**
   * @param {!Object|!Array} object
   * @return {!Promise<string>}
   */
  async stringify_(object) {
    return stringify(object, {space: '  '}) + '\n';
  }
}

module.exports = GoldenIo;
