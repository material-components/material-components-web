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
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<!GoldenFile>}
   */
  async readFromDiffBase(goldenDiffBase) {
    const key = goldenDiffBase.input_string;
    if (!this.cachedGoldenJsonMap_[key]) {
      const goldenJson = JSON.parse(await this.readFromDiffBase_(goldenDiffBase));
      this.cachedGoldenJsonMap_[key] = new GoldenFile(goldenJson);
    }

    // Deep copy to avoid mutating shared state
    return new GoldenFile(this.cachedGoldenJsonMap_[key].toJSON());
  }

  /**
   * @param {!mdc.proto.DiffBase} goldenDiffBase
   * @return {!Promise<string>}
   * @private
   */
  async readFromDiffBase_(goldenDiffBase) {
    const publicUrl = goldenDiffBase.public_url;
    if (publicUrl) {
      return request({
        method: 'GET',
        uri: publicUrl,
      });
    }

    const localFilePath = goldenDiffBase.local_file_path;
    if (localFilePath) {
      return this.localStorage_.readTextFile(localFilePath);
    }

    const rev = goldenDiffBase.git_revision;
    if (rev) {
      return this.gitRepo_.getFileAtRevision(rev.golden_json_file_path, rev.commit);
    }

    const serialized = JSON.stringify({goldenDiffBase}, null, 2);
    throw new Error(
      `
Unable to parse '--diff-base=${goldenDiffBase.input_string}': Expected a URL, local file path, or git ref.
${serialized}
`.trim()
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
