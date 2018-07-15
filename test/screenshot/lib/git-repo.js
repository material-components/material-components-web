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

const gitHubApi = require('@octokit/rest');
const simpleGit = require('simple-git/promise');

class GitRepo {
  constructor(workingDirPath = undefined) {
    /**
     * @type {!SimpleGit}
     * @private
     */
    this.repo_ = simpleGit(workingDirPath);

    /**
     * @type {!GitHubApi}
     * @private
     */
    this.gitHub_ = gitHubApi();
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
    console.log('Fetching remote git commits...');

    const prFetchRef = '+refs/pull/*/head:refs/remotes/origin/pr/*';
    const existingFetchRefs = (await this.exec_('raw', ['config', '--get-all', 'remote.origin.fetch'])).split('\n');

    if (!existingFetchRefs.includes(prFetchRef)) {
      await this.exec_('raw', ['config', '--add', 'remote.origin.fetch', prFetchRef]);
    }

    await this.repo_.fetch(['--tags', ...args]);
  }

  /**
   * @param {string=} ref
   * @return {!Promise<string>}
   */
  async getShortCommitHash(ref = 'HEAD') {
    return this.exec_('revparse', ['--short', ref]);
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
    return this.repo_.show([`${revision}:${filePath}`]);
  }

  /**
   * @return {!Promise<!Array<string>>}
   */
  async getRemoteNames() {
    return (await this.repo_.getRemotes()).map((remote) => remote.name);
  }

  /**
   * @return {!Promise<!StatusSummary>}
   */
  async getStatus() {
    return this.repo_.status();
  }

  /**
   * @param {!Array<string>=} args
   * @return {!Promise<!Array<!DefaultLogFields>>}
   */
  async getLog(args = []) {
    const logEntries = await this.repo_.log([...args]);
    return logEntries.all.concat(); // convert TypeScript ReadonlyArray to mutable Array
  }

  /**
   * @param {!Array<string>} filePaths
   * @return {!Promise<!Array<string>>}
   */
  async getIgnoredPaths(filePaths) {
    return this.repo_.checkIgnore(filePaths);
  }

  /**
   * @param {string=} branch
   * @return {!Promise<?number>}
   */
  async getPullRequestNumber(branch = undefined) {
    branch = branch || await this.getBranchName();

    const allPRs = await this.gitHub_.pullRequests.getAll({
      owner: 'material-components',
      repo: 'material-components-web',
      per_page: 100,
    });

    const filteredPRs = allPRs.data.filter((pr) => pr.head.ref === branch);

    const pr = filteredPRs[0];
    return pr ? pr.number : null;
  }

  /**
   * @param prNumber
   * @return {!Promise<!Array<!github.proto.PullRequestFile>>}
   */
  async getPullRequestFiles(prNumber) {
    /** @type {!github.proto.PullRequestFileResponse} */
    const fileResponse = await this.gitHub_.pullRequests.getFiles({
      owner: 'material-components',
      repo: 'material-components-web',
      number: prNumber,
      per_page: 300,
    });
    return fileResponse.data;
  }

  /**
   * @param {string} cmd
   * @param {!Array<string>=} argList
   * @return {!Promise<string>}
   * @private
   */
  async exec_(cmd, argList = []) {
    return (await this.repo_[cmd](argList) || '').trim();
  }
}

module.exports = GitRepo;
