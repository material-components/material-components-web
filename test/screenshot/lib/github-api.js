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

const octocat = require('@octokit/rest');
const GitRepo = require('./git-repo');

class GitHubApi {
  constructor() {
    this.gitRepo_ = new GitRepo();
    this.octocat_ = octocat();
    this.authenticate_();
  }

  authenticate_() {
    let token;

    try {
      token = require('../auth/github.json').api_key.personal_access_token;
    } catch (err) {
      // Not running on Travis
      return;
    }

    this.octocat_.authenticate({
      type: 'oauth',
      token: token,
    });
  }

  /**
   * @return {{PENDING: string, SUCCESS: string, FAILURE: string, ERROR: string}}
   * @constructor
   */
  static get PullRequestState() {
    return {
      PENDING: 'pending',
      SUCCESS: 'success',
      FAILURE: 'failure',
      ERROR: 'error',
    };
  }

  async setPullRequestStatus({state, targetUrl = undefined, description = undefined}) {
    const result = await this.octocat_.repos.createStatus({
      owner: 'material-components',
      repo: 'material-components-web',
      sha: await this.gitRepo_.getFullCommitHash(),
      state,
      target_url: targetUrl,
      description,
    });
  }

  /**
   * @param {string=} branch
   * @return {!Promise<?number>}
   */
  async getPullRequestNumber(branch = undefined) {
    branch = branch || await this.gitRepo_.getBranchName();

    const allPRs = await this.octocat_.pullRequests.getAll({
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
    const fileResponse = await this.octocat_.pullRequests.getFiles({
      owner: 'material-components',
      repo: 'material-components-web',
      number: prNumber,
      per_page: 300,
    });
    return fileResponse.data;
  }
}

module.exports = GitHubApi;
