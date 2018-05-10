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

const simpleGit = require('simple-git/promise');

class GitRepo {
  constructor(workingDirPath = undefined) {
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
   * @param {string} branch
   * @param {string=} remote
   * @return {!Promise<void>}
   */
  async fetch(branch, remote = 'origin') {
    return this.repo_.fetch([remote, branch]);
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
   * @param {string} filePath Relative to the local Git repo
   * @param {string=} revision Git revision (branch name or commit hash).
   *   E.g., "master", "origin/master", "feat/foo/bar", "e450da9".
   * @return {!Promise<string>}
   */
  async getFileAtRevision(filePath, revision = 'master') {
    return this.repo_.show([`${revision}:${filePath}`]);
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
