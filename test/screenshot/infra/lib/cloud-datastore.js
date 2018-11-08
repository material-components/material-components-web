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

const Datastore = require('@google-cloud/datastore');
const {ShieldState} = require('../types/status-types');

const KIND = 'ScreenshotStatus';

class CloudDatastore {
  constructor() {
    /**
     * @type {!Datastore}
     * @private
     */
    this.datastore_ = new Datastore({});
  }

  /**
   * @param {string} gitRef
   * @param {?ShieldState=} shieldState
   * @return {!Promise<?DatastoreScreenshotStatus>}
   */
  async getScreenshotStatus(gitRef, shieldState = undefined) {
    if (!this.isAuthenticated_()) {
      return null;
    }
    return (
      await this.getScreenshotStatus_('git_branch', gitRef, shieldState) ||
      await this.getScreenshotStatus_('git_commit_hash', gitRef, shieldState)
    );
  }

  /**
   * @param {string} gitRefColumnName
   * @param {string} gitRef
   * @param {?ShieldState=} shieldState
   * @return {!Promise<?DatastoreScreenshotStatus>}
   */
  async getScreenshotStatus_(gitRefColumnName, gitRef, shieldState = undefined) {
    if (shieldState === ShieldState.META_TERMINAL_STATE) {
      /** @type {!Array<?DatastoreScreenshotStatus>} */
      const allStatuses = await Promise.all([
        this.getScreenshotStatus_(gitRefColumnName, gitRef, ShieldState.ERROR),
        this.getScreenshotStatus_(gitRefColumnName, gitRef, ShieldState.PASSED),
        this.getScreenshotStatus_(gitRefColumnName, gitRef, ShieldState.FAILED),
      ]);

      // Sort statuses in descending order by event timestamp (newest to oldest).
      const sortedStatuses = allStatuses
        .filter((status) => Boolean(status))
        .sort((status1, status2) => new Date(status1.event_timestamp) - new Date(status2.event_timestamp))
        .reverse()
      ;

      return sortedStatuses[0] || this.getScreenshotStatus_(gitRefColumnName, gitRef);
    }

    const query = this.datastore_.createQuery(KIND);

    query.filter(gitRefColumnName, '=', gitRef);

    if (shieldState) {
      query.filter('state', '=', shieldState);
    }

    query
      .order('git_commit_timestamp', {descending: true})
      .order('event_timestamp', {descending: true})
    ;

    // runQuery returns an array: [resultArray, cursorInfoObject]
    const queryResult = await this.datastore_.runQuery(query);

    /** @type {!Array<!DatastoreScreenshotStatus>} */
    const statusArray = queryResult[0];

    /** @type {?DatastoreScreenshotStatus} */
    return statusArray[0];
  }

  /**
   * @param {!ShieldState} shieldState
   * @param {number} numScreenshotsTotal
   * @param {number} numScreenshotsFinished
   * @param {number} numDiffs
   * @param {string} targetUrl
   * @param {!mdc.proto.GitRevision} snapshotGitRev
   * @return {!Promise<void>}
   */
  async createScreenshotStatus({
    shieldState,
    numScreenshotsTotal,
    numScreenshotsFinished,
    numDiffs,
    targetUrl,
    snapshotGitRev,
  }) {
    if (!this.isAuthenticated_()) {
      return null;
    }

    const key = this.datastore_.key(KIND);

    // IMPORTANT: If you modify this data structure, you might also need to update test/screenshot/infra/index.yaml.
    const entity = {
      key,
      data: [
        {
          name: 'event_timestamp',
          value: new Date().toJSON(),
        },
        {
          name: 'git_commit_timestamp',
          value: snapshotGitRev.date,
        },
        {
          name: 'git_commit_hash',
          value: snapshotGitRev.commit,
        },
        {
          name: 'git_branch',
          value: snapshotGitRev.branch,
        },
        {
          name: 'num_diffs',
          value: numDiffs,
          excludeFromIndexes: true,
        },
        {
          name: 'num_screenshots_finished',
          value: numScreenshotsFinished,
          excludeFromIndexes: true,
        },
        {
          name: 'num_screenshots_total',
          value: numScreenshotsTotal,
          excludeFromIndexes: true,
        },
        {
          name: 'state',
          value: shieldState,
        },
        {
          name: 'target_url',
          value: targetUrl,
          excludeFromIndexes: true,
        },
        {
          name: 'pull_request_number',
          value: snapshotGitRev.pr_number || null,
          excludeFromIndexes: true,
        },
        {
          name: 'travis_build_id',
          value: process.env.TRAVIS_BUILD_ID || null,
          excludeFromIndexes: true,
        },
        {
          name: 'travis_build_number',
          value: process.env.TRAVIS_BUILD_NUMBER || null,
          excludeFromIndexes: true,
        },
        {
          name: 'travis_job_id',
          value: process.env.TRAVIS_JOB_ID || null,
          excludeFromIndexes: true,
        },
        {
          name: 'travis_job_number',
          value: process.env.TRAVIS_JOB_NUMBER || null,
          excludeFromIndexes: true,
        },
      ],
    };

    return await this.datastore_.save(entity);
  }

  /**
   * @return {boolean}
   * @private
   */
  isAuthenticated_() {
    // See:
    // - https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
    // - https://github.com/googleapis/google-auth-library-nodejs
    return Boolean(this.datastore_.auth.getApplicationDefault());
  }
}

module.exports = CloudDatastore;
