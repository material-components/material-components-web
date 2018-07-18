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

const octokit = require('@octokit/rest');
const GitRepo = require('./git-repo');

class GitHubApi {
  constructor() {
    this.gitRepo_ = new GitRepo();
    this.octokit_ = octokit();
    this.authenticate_();
  }

  /**
   * @private
   */
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

  /**
   * @param {!mdc.proto.ReportData} reportData
   * @return {!Promise<*>}
   */
  async setPullRequestStatus(reportData) {
    const meta = reportData.meta;
    const prNumber = Number(process.env.TRAVIS_PULL_REQUEST);
    if (!prNumber) {
      return;
    }

    const screenshots = reportData.screenshots;
    const numUnchanged = screenshots.unchanged_screenshot_list.length;
    const numChanged =
      screenshots.changed_screenshot_list.length +
      screenshots.added_screenshot_list.length +
      screenshots.removed_screenshot_list.length;
    const reportFileUrl = meta.report_html_file ? meta.report_html_file.public_url : null;

    let state;
    let targetUrl;
    let description;

    if (reportFileUrl) {
      if (numChanged > 0) {
        state = GitHubApi.PullRequestState.FAILURE;
        description = `${numChanged.toLocaleString()} screenshots differ from PR's golden.json`;
      } else {
        state = GitHubApi.PullRequestState.SUCCESS;
        description = `All ${numUnchanged.toLocaleString()} screenshots match PR's golden.json`;
      }

      targetUrl = meta.report_html_file.public_url;
    } else {
      const numScreenshotsFormatted = screenshots.runnable_screenshot_list.length.toLocaleString();
      state = GitHubApi.PullRequestState.PENDING;
      targetUrl = `https://travis-ci.org/material-components/material-components-web/jobs/${process.env.TRAVIS_JOB_ID}`;
      description = `Running ${numScreenshotsFormatted} screenshot tests`;
    }

    return await this.createStatus_({state, targetUrl, description});
  }

  async setPullRequestError() {
    const prNumber = Number(process.env.TRAVIS_PULL_REQUEST);
    if (!prNumber) {
      return;
    }

    return await this.createStatus_({
      state: GitHubApi.PullRequestState.ERROR,
      targetUrl: `https://travis-ci.org/material-components/material-components-web/jobs/${process.env.TRAVIS_JOB_ID}`,
      description: 'Error running screenshot tests',
    });
  }

  /**
   * @param {string} state
   * @param {string} targetUrl
   * @param {string=} description
   * @return {!Promise<*>}
   * @private
   */
  async createStatus_({state, targetUrl, description = undefined}) {
    return await this.octokit_.repos.createStatus({
      owner: 'material-components',
      repo: 'material-components-web',
      sha: await this.gitRepo_.getFullCommitHash(process.env.TRAVIS_PULL_REQUEST_SHA),
      state,
      target_url: targetUrl,
      description,
      context: 'screenshot-test/butter-bot',
    });
  }

  /**
   * @param {string=} branch
   * @return {!Promise<?number>}
   */
  async getPullRequestNumber(branch = undefined) {
    branch = branch || await this.gitRepo_.getBranchName();

    const allPRs = await this.octokit_.pullRequests.getAll({
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
    const fileResponse = await this.octokit_.pullRequests.getFiles({
      owner: 'material-components',
      repo: 'material-components-web',
      number: prNumber,
      per_page: 300,
    });
    return fileResponse.data;
  }
}

module.exports = GitHubApi;
