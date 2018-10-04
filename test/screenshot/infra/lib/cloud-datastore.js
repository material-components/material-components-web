// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const ShieldState = mdcProto.ShieldState;

const KIND = 'ScreenshotStatus';

/**
 * @typedef {{
 *   event_timestamp: string,
 *   git_branch: string,
 *   git_commit_hash: string,
 *   git_commit_timestamp: string,
 *   pull_request_number: ?number,
 *   num_diffs: number,
 *   num_screenshots_finished: number,
 *   num_screenshots_total: number,
 *   state: !mdc.proto.ShieldState,
 *   target_url: string,
 *   travis_build_id: ?string,
 *   travis_build_number: ?string,
 *   travis_job_id: ?string,
 *   travis_job_number: ?string,
 * }} CloudStatus
 */

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
   * @param {?mdc.proto.ShieldState=} shieldState
   * @return {!Promise<?CloudStatus>}
   */
  async getStatus(gitRef, shieldState = undefined) {
    if (!this.isAuthenticated_()) {
      return null;
    }
    return (
      await this.getStatus_('git_branch', gitRef, shieldState) ||
      await this.getStatus_('git_commit_hash', gitRef, shieldState)
    );
  }

  /**
   * @param {string} gitRefColumnName
   * @param {string} gitRef
   * @param {?mdc.proto.ShieldState=} shieldState
   * @return {!Promise<?CloudStatus>}
   */
  async getStatus_(gitRefColumnName, gitRef, shieldState = undefined) {
    const query = this.datastore_.createQuery(KIND);

    query.filter(gitRefColumnName, '=', gitRef);

    if (shieldState) {
      query.filter('state', '=', ShieldState[shieldState]);
    }

    query
      .order('git_commit_timestamp', {descending: true})
      .order('event_timestamp', {descending: true})
    ;

    // runQuery returns an array: [resultArray, cursorInfoObject]
    const queryResult = await this.datastore_.runQuery(query);

    /** @type {!Array<!CloudStatus>} */
    const statusArray = queryResult[0];

    /** @type {?CloudStatus} */
    const latestStatus = statusArray[0];
    if (latestStatus) {
      // Convert string name to enum value. E.g., "PASSED" -> 4.
      latestStatus.state = ShieldState[latestStatus.state];
    }
    return latestStatus;
  }

  /**
   * @param {!mdc.proto.ShieldState} state
   * @param {number} numScreenshotsTotal
   * @param {number} numScreenshotsFinished
   * @param {number} numDiffs
   * @param {string} targetUrl
   * @param {!mdc.proto.GitRevision} snapshotGitRev
   * @return {!Promise<void>}
   */
  async setStatus({
    state,
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
          value: snapshotGitRev.author.date,
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
          value: ShieldState[state],
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
    // By default, the client will authenticate using the service account file specified by the
    // GOOGLE_APPLICATION_CREDENTIALS environment variable.
    // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
    return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  }
}

module.exports = CloudDatastore;
