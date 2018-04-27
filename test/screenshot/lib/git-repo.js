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
  async getShortCommitHash() {
    return await this.exec_('revparse', ['--short', 'HEAD']);
  }

  /**
   * @return {!Promise<string>}
   */
  async getBranchName() {
    return await this.exec_('revparse', ['--abbrev-ref', 'HEAD']);
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
