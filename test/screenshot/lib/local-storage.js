/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('mz/fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');

const Cli = require('./cli');
const GitRepo = require('./git-repo');

class LocalStorage {
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
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @return {!Promise<void>}
   */
  async copyAssetsToTempDir(reportMeta) {
    /** @type {!Array<string>} */
    const allAssetFileRelativePaths = await this.getAssetFileSourcePaths();

    const fileCopyPromises = [];

    for (const assetFileRelativePath of allAssetFileRelativePaths) {
      const assetFileshortPath = assetFileRelativePath.replace(this.cli_.testDir, '');
      const sourceFilePathAbsolute = path.resolve(assetFileRelativePath);
      const destionationFilePathAbsolute = path.resolve(reportMeta.local_asset_base_dir, assetFileshortPath);

      mkdirp.sync(path.dirname(destionationFilePathAbsolute));
      fileCopyPromises.push(fs.copyFile(sourceFilePathAbsolute, destionationFilePathAbsolute));
    }

    await Promise.all(fileCopyPromises);
  }

  /**
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   */
  async getAssetFileSourcePaths() {
    const cwd = this.cli_.testDir;
    return (await this.filterIgnoredFiles_(glob.sync('**/*', {cwd, nodir: true}))).sort();
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   */
  async getTestPageDestinationPaths(reportMeta) {
    const cwd = reportMeta.local_asset_base_dir;
    return glob.sync('**/mdc-*/**/*.html', {cwd, nodir: true});
  }

  /**
   * @param {!Array<string>} shortPaths File paths relative to the asset directory. E.g.: "browser.json".
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   * @private
   */
  async filterIgnoredFiles_(shortPaths) {
    const relativePaths = shortPaths.map((name) => path.join(this.cli_.testDir, name));

    /** @type {!Array<string>} */
    const ignoredTopLevelFilesAndDirs = await this.gitRepo_.getIgnoredPaths(relativePaths);

    return relativePaths.filter((relativePath) => {
      const isBuildOutputDir = relativePath.split(path.sep).includes('out');
      const isIgnoredFile = ignoredTopLevelFilesAndDirs.includes(relativePath);
      return isBuildOutputDir || !isIgnoredFile;
    });
  }
}

module.exports = LocalStorage;
