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

const VError = require('verror');
const octokit = require('@octokit/rest');

const GitRepo = require('./git-repo');
const getStackTrace = require('./stacktrace')('GitHubApi');

class GitHubApi {
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

  constructor() {
    this.gitRepo_ = new GitRepo();
    this.octokit_ = octokit();
    this.isTravis_ = process.env.TRAVIS === 'true';
    this.isAuthenticated_ = false;
    this.authenticate_();
  }

  /** @private */
  authenticate_() {
    let token;

    try {
      token = require('../auth/github.json').api_key.personal_access_token;
    } catch (err) {
      // Not running on Travis
      return;
    }

    this.octokit_.authenticate({
      type: 'oauth',
      token: token,
    });

    this.isAuthenticated_ = true;
  }

  /**
   * @param {string} state
   * @param {string} targetUrl
   * @param {string=} description
   * @return {!Promise<?Github.AnyResponse>}
   */
  async setPullRequestStatus({state, targetUrl, description = undefined}) {
    if (!this.isTravis_ || !this.isAuthenticated_) {
      return null;
    }

    const travisPrSha = process.env.TRAVIS_PULL_REQUEST_SHA;
    const travisCommit = process.env.TRAVIS_COMMIT;
    const sha = travisPrSha || travisCommit || await this.gitRepo_.getFullCommitHash();

    let stackTrace;

    try {
      stackTrace = getStackTrace('setPullRequestStatus');
      return await this.octokit_.repos.createStatus({
        owner: 'material-components',
        repo: 'material-components-web',
        sha,
        state,
        target_url: targetUrl,
        description,
        context: 'screenshot-test/butter-bot',
      });
    } catch (err) {
      throw new VError(err, `Failed to set commit status:\n${stackTrace}`);
    }
  }

  /**
   * @param {number} prNumber
   * @param {string} comment
   * @return {!Promise<?Github.AnyResponse>}
   */
  async createPullRequestComment({prNumber, comment}) {
    if (!this.isTravis_ || !this.isAuthenticated_) {
      return null;
    }

    let stackTrace;

    try {
      stackTrace = getStackTrace('createPullRequestComment');
      return await this.octokit_.issues.createComment({
        owner: 'material-components',
        repo: 'material-components-web',
        number: prNumber,
        body: comment,
      });
    } catch (err) {
      throw new VError(err, `Failed to create comment on PR #${prNumber}:\n${stackTrace}`);
    }
  }

  /**
   * @param {string=} branch
   * @return {!Promise<?number>}
   */
  async getPullRequestNumber(branch = undefined) {
    branch = branch || await this.gitRepo_.getBranchName();

    let allPrsResponse;
    let stackTrace;

    try {
      stackTrace = getStackTrace('getPullRequestNumber');
      allPrsResponse = await this.octokit_.pullRequests.getAll({
        owner: 'material-components',
        repo: 'material-components-web',
        per_page: 100,
      });
    } catch (err) {
      throw new VError(err, `Failed to get pull request number for branch "${branch}":\n${stackTrace}`);
    }

    const filteredPRs = allPrsResponse.data.filter((pr) => pr.head.ref === branch);

    const pr = filteredPRs[0];
    return pr ? pr.number : null;
  }

  /**
   * @param {number} prNumber
   * @return {!Promise<string>}
   */
  async getPullRequestBaseBranch(prNumber) {
    let prResponse;
    let stackTrace;

    try {
      stackTrace = getStackTrace('getPullRequestBaseBranch');
      prResponse = await this.octokit_.pullRequests.get({
        owner: 'material-components',
        repo: 'material-components-web',
        number: prNumber,
      });
    } catch (err) {
      throw new VError(err, `Failed to get the base branch for PR #${prNumber}:\n${stackTrace}`);
    }

    if (!prResponse.data) {
      const serialized = JSON.stringify(prResponse, null, 2);
      throw new Error(`Unable to fetch data for GitHub PR #${prNumber}:\n${serialized}`);
    }

    return `origin/${prResponse.data.base.ref}`;
  }
}

module.exports = GitHubApi;
