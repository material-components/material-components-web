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
const fsx = require('fs-extra');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');

const GitRepo = require('./git-repo');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

class LocalStorage {
  constructor() {
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
    const allAssetFileRelativePaths = await this.getAssetFileSourcePaths_();

    const fileCopyPromises = [];

    for (const assetFileRelativePath of allAssetFileRelativePaths) {
      const assetFileshortPath = assetFileRelativePath.replace(TEST_DIR_RELATIVE_PATH, '');
      const sourceFilePathAbsolute = path.resolve(assetFileRelativePath);
      const destionationFilePathAbsolute = path.resolve(reportMeta.local_asset_base_dir, assetFileshortPath);

      mkdirp.sync(path.dirname(destionationFilePathAbsolute));
      fileCopyPromises.push(fs.copyFile(sourceFilePathAbsolute, destionationFilePathAbsolute));
    }

    await Promise.all(fileCopyPromises);
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
   * @param {string} filePath
   * @param {string|!Buffer} fileContent
   * @return {!Promise<void>}
   */
  async writeTextFile(filePath, fileContent) {
    mkdirp.sync(path.dirname(filePath));
    await fs.writeFile(filePath, fileContent, {encoding: 'utf8'});
  }

  /**
   * @param {string} filePath
   * @param {!Buffer} fileContent
   * @return {!Promise<void>}
   */
  async writeBinaryFile(filePath, fileContent) {
    mkdirp.sync(path.dirname(filePath));
    await fs.writeFile(filePath, fileContent, {encoding: null});
  }

  /**
   * @param {string} filePath
   * @return {!Promise<string>}
   */
  async readTextFile(filePath) {
    return fs.readFile(filePath, {encoding: 'utf8'});
  }

  /**
   * @param {string} filePath
   * @return {!Promise<string>}
   */
  readTextFileSync(filePath) {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
  }

  /**
   * @param {string} filePath
   * @return {!Promise<string>}
   */
  async readBinaryFile(filePath) {
    return fs.readFile(filePath, {encoding: null});
  }

  /**
   * @param {string} pattern
   * @param {string=} cwd
   * @return {!Array<string>}
   */
  glob(pattern, cwd = process.cwd()) {
    return glob.sync(pattern, {cwd, nodir: true});
  }

  /**
   * @param {string} src
   * @param {string} dest
   * @return {!Promise<void>}
   */
  async copy(src, dest) {
    return fsx.copy(src, dest);
  }

  /**
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   * @private
   */
  async getAssetFileSourcePaths_() {
    const cwd = TEST_DIR_RELATIVE_PATH;
    return (await this.filterIgnoredFiles_(glob.sync('**/*', {cwd, nodir: true}))).sort();
  }

  /**
   * @param {!Array<string>} shortPaths File paths relative to the asset directory. E.g.: "browser.json".
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   * @private
   */
  async filterIgnoredFiles_(shortPaths) {
    const relativePaths = shortPaths.map((name) => path.join(TEST_DIR_RELATIVE_PATH, name));

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
