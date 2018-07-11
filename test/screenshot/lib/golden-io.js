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

const proto = require('../proto/types.pb').mdc.proto;
const {GoldenScreenshot} = proto;

const Cli = require('./cli');
const GitRepo = require('./git-repo');
const GoldenFile = require('./golden-file');

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
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

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
    return new GoldenFile(JSON.parse(await fs.readFile(this.cli_.goldenPath, {encoding: 'utf8'})));
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
    const parsedDiffBase = await this.cli_.parseDiffBase({rawDiffBase});

    const publicUrl = parsedDiffBase.public_url;
    if (publicUrl) {
      return request({
        method: 'GET',
        uri: publicUrl,
      });
    }

    const localFilePath = parsedDiffBase.file_path;
    if (localFilePath) {
      return fs.readFile(localFilePath, {encoding: 'utf8'});
    }

    const rev = parsedDiffBase.git_revision;
    if (rev) {
      return this.gitRepo_.getFileAtRevision(rev.snapshot_file_path, rev.commit);
    }

    throw new Error(`Unable to parse '--diff-base=${rawDiffBase}': Expected a URL, local file path, or git ref`);
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<!GoldenFile>}
   */
  async approveSelectedGoldens(reportData) {
    /** @type {!GoldenFile} */
    const newGoldenFile = await this.readFromLocalFile();

    for (const screenshot of reportData.approvals.changed_screenshot_list) {
      newGoldenFile.setScreenshotImageUrl(GoldenScreenshot.create({
        html_file_path: screenshot.actual_html_file.relative_path,
        html_file_url: screenshot.actual_html_file.public_url,
        user_agent_alias: screenshot.user_agent.alias,
        screenshot_image_path: screenshot.actual_image_file.relative_path,
        screenshot_image_url: screenshot.actual_image_file.public_url,
      }));
    }

    for (const screenshot of reportData.approvals.added_screenshot_list) {
      newGoldenFile.setScreenshotImageUrl(GoldenScreenshot.create({
        html_file_path: screenshot.actual_html_file.relative_path,
        html_file_url: screenshot.actual_html_file.public_url,
        user_agent_alias: screenshot.user_agent.alias,
        screenshot_image_path: screenshot.actual_image_file.relative_path,
        screenshot_image_url: screenshot.actual_image_file.public_url,
      }));
    }

    for (const screenshot of reportData.approvals.removed_screenshot_list) {
      newGoldenFile.removeScreenshotImageUrl({
        html_file_path: screenshot.actual_html_file.relative_path,
        user_agent_alias: screenshot.user_agent.alias,
      });
    }

    return newGoldenFile;
  }

  /**
   * @param {!GoldenFile} newGoldenFile
   * @return {!Promise<void>}
   */
  async writeToDisk(newGoldenFile) {
    const goldenJsonFilePath = this.cli_.goldenPath;
    const goldenJsonFileContent = await this.stringify_(newGoldenFile);

    await fs.writeFile(goldenJsonFilePath, goldenJsonFileContent);

    console.log(`DONE updating "${goldenJsonFilePath}"!`);
  }

  /**
   * @param {!Object|!Array} object
   * @return {!Promise<string>}
   */
  async stringify_(object) {
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

module.exports = GoldenIo;
