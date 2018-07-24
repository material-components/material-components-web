/**
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

'use strict';

const VError = require('verror');
const simpleGit = require('simple-git/promise');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {User} = mdcProto;

let hasFetched = false;

class GitRepo {
  constructor(workingDirPath = undefined) {
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

    console.log('Fetching remote git commits...');

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
  }

  /**
   * @param {string=} ref
   * @return {!Promise<string>}
   */
  async getFullCommitHash(ref = 'HEAD') {
    return this.exec_('revparse', [ref]);
  }

  /**
   * @param {string=} ref
   * @return {!Promise<string>}
   */
  async getBranchName(ref = 'HEAD') {
    return this.exec_('revparse', ['--abbrev-ref', ref]);
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
    return this.exec_('revparse', ['--symbolic-full-name', ref]);
  }

  /**
   * @param {string} filePath Relative to the local Git repo
   * @param {string=} revision Git revision (branch name or commit hash).
   *   E.g., "master", "origin/master", "feat/foo/bar", "e450da9".
   * @return {!Promise<string>}
   */
  async getFileAtRevision(filePath, revision = 'master') {
    try {
      return this.repo_.show([`${revision}:${filePath}`]);
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
      return this.repo_.status();
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
    try {
      return this.repo_.checkIgnore(filePaths);
    } catch (err) {
      throw new VError(err, `Failed to run GitRepo.getIgnoredPaths(${filePaths.length} file paths)`);
    }
  }

  /**
   * @param {string=} commit
   * @return {!Promise<!mdc.proto.User>}
   */
  async getCommitAuthor(commit = undefined) {
    /** @type {!Array<!DefaultLogFields>} */
    const logEntries = await this.getLog([commit]);
    const logEntry = logEntries[0];
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
