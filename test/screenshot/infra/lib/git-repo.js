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
const simpleGit = require('simple-git/promise');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {User} = mdcProto;

const Logger = require('./logger');

let hasFetched = false;

class GitRepo {
  constructor(workingDirPath = undefined) {
    /**
     * @type {!Logger}
     * @private
     */
    this.logger_ = new Logger();

    /**
     * @type {!SimpleGit}
     * @private
     */
    this.repo_ = simpleGit(workingDirPath);
  }

  /**
   * @return {!Promise<string>}
   */
  async getUserName() {
    return this.exec_('raw', ['config', 'user.name']);
  }

  /**
   * @return {!Promise<string>}
   */
  async getUserEmail() {
    return this.exec_('raw', ['config', 'user.email']);
  }

  /**
   * @param {!Array<string>} args
   * @return {!Promise<void>}
   */
  async fetch(args = []) {
    if (hasFetched) {
      return;
    }
    hasFetched = true;

    this.logger_.debug('Fetching remote git commits...');

    const prFetchRef = '+refs/pull/*/head:refs/remotes/origin/pr/*';
    const existingFetchRefs = (await this.exec_('raw', ['config', '--get-all', 'remote.origin.fetch'])).split('\n');

    if (!existingFetchRefs.includes(prFetchRef)) {
      await this.exec_('raw', ['config', '--add', 'remote.origin.fetch', prFetchRef]);
    }

    try {
      await this.repo_.fetch(['--tags', ...args]);
    } catch (err) {
      const serialized = JSON.stringify(args);
      throw new VError(err, `Failed to run GitRepo.fetch(${serialized})`);
    }

    this.logger_.debug('Fetched remote git commits!');
  }

  /**
   * @param {string=} ref
   * @return {!Promise<string>}
   */
  async getFullCommitHash(ref = 'HEAD') {
    const hash = await this.exec_('revparse', [ref]);
    if (!hash) {
      throw new Error(`Unable to get commit hash for git ref "${ref}"`);
    }
    return hash;
  }

  /**
   * @param {string=} ref
   * @return {!Promise<string>}
   */
  async getBranchName(ref = 'HEAD') {
    const branch = await this.exec_('revparse', ['--abbrev-ref', ref]);
    if (!branch) {
      throw new Error(`Unable to get branch name for git ref "${ref}"`);
    }
    return branch;
  }

  /**
   * Examples:
   * ```
   * getFullSymbolicName("master")        = "refs/heads/master"
   * getFullSymbolicName("origin/master") = "refs/remotes/origin/master"
   * getFullSymbolicName("HEAD")          = "refs/heads/feat/button/my-fancy-feature"
   * getFullSymbolicName("v0.34.1")       = "refs/tags/v0.34.1"
   * ```
   * @param {string=} ref
   * @return {!Promise<string>}
   */
  async getFullSymbolicName(ref = 'HEAD') {
    const fullName = await this.exec_('revparse', ['--symbolic-full-name', ref]);
    if (!fullName) {
      throw new Error(`Unable to get full symbolic name for git ref "${ref}"`);
    }
    return fullName;
  }

  /**
   * @param {string} filePath Relative to the local Git repo
   * @param {string=} revision Git revision (branch name or commit hash).
   *   E.g., "master", "origin/master", "feat/foo/bar", "e450da9".
   * @return {!Promise<string>}
   */
  async getFileAtRevision(filePath, revision = 'master') {
    try {
      return await this.repo_.show([`${revision}:${filePath}`]);
    } catch (err) {
      const serialized = JSON.stringify(args);
      throw new VError(err, `Failed to run GitRepo.getFileAtRevision(${serialized})`);
    }
  }

  /**
   * @return {!Promise<!Array<string>>}
   */
  async getRemoteNames() {
    try {
      return (await this.repo_.getRemotes()).map((remote) => remote.name);
    } catch (err) {
      throw new VError(err, 'Failed to run GitRepo.getRemoteNames()');
    }
  }

  /**
   * @return {!Promise<!StatusSummary>}
   */
  async getStatus() {
    try {
      return await this.repo_.status();
    } catch (err) {
      throw new VError(err, 'Failed to run GitRepo.getStatus()');
    }
  }

  /**
   * @param {!Array<string>=} args
   * @return {!Promise<!Array<!DefaultLogFields>>}
   */
  async getLog(args = []) {
    try {
      const logEntries = await this.repo_.log([...args]);
      return logEntries.all.concat(); // convert TypeScript ReadonlyArray to mutable Array
    } catch (err) {
      const serialized = JSON.stringify(args);
      throw new VError(err, `Failed to run GitRepo.getLog(${serialized})`);
    }
  }

  /**
   * @param {!Array<string>} filePaths
   * @return {!Promise<!Array<string>>}
   */
  async getIgnoredPaths(filePaths) {
    this.logger_.debug(`Finding files ignored by git from ${filePaths.length.toLocaleString()} paths...`);
    const batchSize = 1000;
    const allIgnoredPaths = [];
    // If we try to pass too many file paths to git, glibc throws "Error: spawn E2BIG".
    for (let i = 0; i < filePaths.length; i += batchSize) {
      const curIgnoredPaths = await this.getIgnoredPathsImpl_(filePaths.slice(i, i + batchSize));
      allIgnoredPaths.push(...curIgnoredPaths);
    }
    this.logger_.debug(`Found ${allIgnoredPaths.length.toLocaleString()} file paths ignored by git!`);
    return allIgnoredPaths;
  }

  /**
   * @param {!Array<string>} filePaths
   * @return {!Promise<!Array<string>>}
   */
  async getIgnoredPathsImpl_(filePaths) {
    try {
      return await this.repo_.checkIgnore(filePaths);
    } catch (err) {
      throw new VError(err, `Unable to check gitignore status of ${filePaths.length} file paths`);
    }
  }

  /**
   * @param {string} commit
   * @param {string} stackTrace
   * @return {!Promise<!mdc.proto.User>}
   */
  async getCommitAuthor(commit, stackTrace) {
    /** @type {!Array<!DefaultLogFields>} */
    let logEntries;

    try {
      logEntries = await this.getLog([commit]);
    } catch (err) {
      throw new VError(err, `Unable to get author for commit "${commit}":\n${stackTrace}`);
    }

    const logEntry = logEntries[0];
    if (!logEntry) {
      throw new VError(err, `Unable to get author for commit "${commit}":\n${stackTrace}`);
    }

    return User.create({
      name: logEntry.author_name,
      email: logEntry.author_email,
    });
  }

  /**
   * @param {string} cmd
   * @param {!Array<string>=} argList
   * @return {!Promise<string>}
   * @private
   */
  async exec_(cmd, argList = []) {
    try {
      return (await this.repo_[cmd](argList) || '').trim();
    } catch (err) {
      const serialized = JSON.stringify([cmd, ...argList]);
      throw new VError(err, `Failed to run GitRepo.exec_(${serialized})`);
    }
  }
}

module.exports = GitRepo;
