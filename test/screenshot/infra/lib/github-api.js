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

const Octokit = require('@octokit/rest');

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
    this.octokit_ = new Octokit(this.getAuthToken_());
    this.isTravis_ = process.env.TRAVIS === 'true';
  }

  /**
   * @return {({auth: string}|undefined)}
   * @private
   */
  getAuthToken_() {
    let token;

    try {
      token = require('../auth/github.json').api_key.personal_access_token;
      console.log('GitHubApi.getAuthToken_(): AUTHENTICATED!');
      this.isAuthenticated_ = true;
      return {auth: token};
    } catch (err) {
      // Not running on Travis
      console.log('GitHubApi.getAuthToken_(): NOT AUTHENTICATED!');
      this.isAuthenticated_ = false;
    }
  }

  /**
   * @param {string} state
   * @param {string} targetUrl
   * @param {string=} description
   * @return {!Promise<?Github.AnyResponse>}
   */
  async setPullRequestStatus({state, targetUrl, description = undefined}) {
    if (!this.isTravis_ || !this.isAuthenticated_) {
      console.log(`GitHubApi.setPullRequestStatus(): ${!this.isTravis_ ? 'NOT TRAVIS' : 'NOT AUTHENTICATED'}!`);
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
      console.warn(`Failed to set commit status:\n${stackTrace}\n\n`, err);
      return null;
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
      console.warn(`Failed to create comment on PR #${prNumber}:\n${stackTrace}\n\n`, err);
      return null;
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
      allPrsResponse = await this.octokit_.pulls.list({
        owner: 'material-components',
        repo: 'material-components-web',
        per_page: 100,
      });
    } catch (err) {
      console.warn(`Failed to get pull request number for branch "${branch}":\n${stackTrace}\n\n`, err);
      return null;
    }

    const filteredPRs = allPrsResponse.data.filter((pr) => pr.head.ref === branch);

    const pr = filteredPRs[0];
    return pr ? pr.number : null;
  }

  /**
   * @param {number} prNumber
   * @return {!Promise<?string>}
   */
  async getPullRequestBaseBranch(prNumber) {
    let prResponse;
    let stackTrace;

    try {
      stackTrace = getStackTrace('getPullRequestBaseBranch');
      prResponse = await this.octokit_.pulls.get({
        owner: 'material-components',
        repo: 'material-components-web',
        number: prNumber,
      });
    } catch (err) {
      console.warn(`Failed to get the base branch for PR #${prNumber}:\n${stackTrace}\n\n`, err);
      return null;
    }

    if (!prResponse.data) {
      const serialized = JSON.stringify(prResponse, null, 2);
      console.warn(`Unable to fetch data for GitHub PR #${prNumber}:\n${serialized}`);
      return null;
    }

    return `origin/${prResponse.data.base.ref}`;
  }
}

module.exports = GitHubApi;
