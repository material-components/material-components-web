/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

const VError = require('verror');
const del = require('del');
const fs = require('mz/fs');
const fsx = require('fs-extra');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');

const GitRepo = require('./git-repo');
const Logger = require('./logger');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

class LocalStorage {
  constructor() {
    /**
     * @type {!GitRepo}
     * @private
     */
    this.gitRepo_ = new GitRepo();

    /**
     * @type {!Logger}
     * @private
     */
    this.logger_ = new Logger();
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @return {!Promise<void>}
   */
  async copyAssetsToTempDir(reportMeta) {
    /** @type {!Array<string>} */
    const allAssetFileRelativePaths = await this.getAssetFileSourcePaths_();

    const fileCopyPromises = [];

    this.logger_.debug(`Copying ${allAssetFileRelativePaths.length} files to temp dir...`);

    for (const assetFileRelativePath of allAssetFileRelativePaths) {
      const assetFileshortPath = assetFileRelativePath.replace(TEST_DIR_RELATIVE_PATH, '');
      const sourceFilePathAbsolute = path.resolve(assetFileRelativePath);
      const destionationFilePathAbsolute = path.resolve(reportMeta.local_asset_base_dir, assetFileshortPath);

      mkdirp.sync(path.dirname(destionationFilePathAbsolute));
      fileCopyPromises.push(fs.copyFile(sourceFilePathAbsolute, destionationFilePathAbsolute));
    }

    await Promise.all(fileCopyPromises);

    this.logger_.debug(`Copied ${allAssetFileRelativePaths.length} files to temp dir!`);
  }

  /**
   * @param {!mdc.proto.ReportMeta} reportMeta
   * @return {!Promise<!Array<string>>}
   */
  async getTestPageDestinationPaths(reportMeta) {
    const cwd = reportMeta.local_asset_base_dir;
    try {
      return glob.sync('**/spec/mdc-*/**/*.html', {cwd, nodir: true, ignore: ['**/index.html']});
    } catch (err) {
      throw new VError(err, `Failed to run LocalStorage.getTestPageDestinationPaths(${cwd})`);
    }
  }

  /**
   * @param {string} filePath
   * @param {string} fileContent
   * @return {!Promise<void>}
   */
  async writeTextFile(filePath, fileContent) {
    if (!fileContent.endsWith('\n')) {
      fileContent += '\n';
    }
    try {
      mkdirp.sync(path.dirname(filePath));
      await fs.writeFile(filePath, fileContent, {encoding: 'utf8'});
    } catch (err) {
      const serialized = JSON.stringify({filePath, fileContent: fileContent.length + ' bytes'});
      throw new VError(err, `Failed to run LocalStorage.writeTextFile(${serialized})`);
    }
  }

  /**
   * @param {string} filePath
   * @param {!Buffer} fileContent
   * @param {?string=} encoding
   * @return {!Promise<void>}
   */
  async writeBinaryFile(filePath, fileContent, encoding = null) {
    try {
      mkdirp.sync(path.dirname(filePath));
      await fs.writeFile(filePath, fileContent, {encoding});
    } catch (err) {
      const serialized = JSON.stringify({filePath, fileContent: fileContent.length + ' bytes', encoding});
      throw new VError(err, `Failed to run LocalStorage.writeBinaryFile(${serialized})`);
    }
  }

  /**
   * @param {string} filePath
   * @return {!Promise<string>}
   */
  async readTextFile(filePath) {
    try {
      return await fs.readFile(filePath, {encoding: 'utf8'});
    } catch (err) {
      throw new VError(err, `Failed to run LocalStorage.readTextFile(${filePath})`);
    }
  }

  /**
   * @param {string} filePath
   * @return {string}
   */
  readTextFileSync(filePath) {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
  }

  /**
   * @param {string} filePath
   * @param {string=} encoding
   * @return {!Promise<!Buffer>}
   */
  async readBinaryFile(filePath, encoding = null) {
    try {
      return await fs.readFile(filePath, {encoding});
    } catch (err) {
      throw new VError(err, `Failed to run LocalStorage.readBinaryFile(${filePath}, ${encoding})`);
    }
  }

  /**
   * @param {string} pattern
   * @param {string=} cwd
   * @return {!Array<string>}
   */
  globFiles(pattern, cwd = process.cwd()) {
    return glob.sync(pattern, {
      cwd,
      nodir: true,
      dot: true,
      ignore: ['**/node_modules/**'],
    });
  }

  /**
   * @param {string} pattern
   * @param {string=} cwd
   * @return {!Array<string>}
   */
  globDirs(pattern, cwd = process.cwd()) {
    if (!pattern.endsWith('/')) {
      pattern += '/';
    }
    return glob.sync(pattern, {
      cwd,
      nodir: false,
      dot: false,
      ignore: ['**/node_modules/**'],
    });
  }

  /**
   * @param {string} src
   * @param {string} dest
   * @return {!Promise<void>}
   */
  async copy(src, dest) {
    try {
      return await fsx.copy(src, dest);
    } catch (err) {
      throw new VError(err, `Failed to run LocalStorage.copy(${src}, ${dest})`);
    }
  }

  /**
   * @param {string|!Array<string>} pathPatterns
   * @return {!Promise<*>}
   */
  async delete(pathPatterns) {
    try {
      return await del(pathPatterns);
    } catch (err) {
      throw new VError(err, `Failed to run LocalStorage.delete(${pathPatterns} patterns)`);
    }
  }

  /**
   * @param {string} filePath
   * @return {!Promise<boolean>}
   */
  async exists(filePath) {
    try {
      return await fs.exists(filePath);
    } catch (err) {
      throw new VError(err, `Failed to run LocalStorage.exists(${filePath})`);
    }
  }

  /**
   * @param {string} filePaths
   */
  mkdirpForFilesSync(...filePaths) {
    filePaths.forEach((filePath) => mkdirp.sync(path.dirname(filePath)));
  }

  /**
   * @param {string} dirPaths
   */
  mkdirpForDirsSync(...dirPaths) {
    dirPaths.forEach((dirPath) => mkdirp.sync(dirPath));
  }

  /**
   * @return {!Promise<!Array<string>>} File paths relative to the git repo. E.g.: "test/screenshot/browser.json".
   * @private
   */
  async getAssetFileSourcePaths_() {
    const cwd = TEST_DIR_RELATIVE_PATH;

    this.logger_.debug(`Finding all files in "${cwd}"...`);

    /** @type {!Array<string>} */
    const allFilePaths = glob.sync('**/*', {cwd, nodir: true});

    this.logger_.debug(`Found ${allFilePaths.length.toLocaleString()} files in "${cwd}"!`);

    return (await this.filterIgnoredFiles_(allFilePaths)).sort();
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
      const pathParts = relativePath.split(path.sep);
      const isBuildOutputDir = pathParts.includes('out');
      const isIndexHtmlFile = pathParts[pathParts.length - 1] === 'index.html';
      const isIgnoredFile = ignoredTopLevelFilesAndDirs.includes(relativePath);
      return isBuildOutputDir || isIndexHtmlFile || !isIgnoredFile;
    });
  }
}

module.exports = LocalStorage;
