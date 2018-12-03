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

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const CaptureState = mdcProto.Screenshot.CaptureState;
const {ThrottleType, ShieldState} = require('../types/status-types');
const {STATUS_UPDATE_THROTTLE_INTERVAL_MS} = require('./constants');

const CliColor = require('./logger').colors;
const CloudDatastore = require('./cloud-datastore');
const GitHubApi = require('./github-api');
const getStackTrace = require('./stacktrace')('StatusNotifier');

class StatusNotifier {
  constructor() {
    /**
     * @type {!CloudDatastore}
     * @private
     */
    this.cloudDatastore_ = new CloudDatastore();

    /**
     * @type {!GitHubApi}
     * @private
     */
    this.gitHubApi_ = new GitHubApi();

    /**
     * @type {?mdc.proto.ReportData}
     * @private
     */
    this.reportData_ = null;

    this.initThrottle_();
  }

  /** @private */
  initThrottle_() {
    /** @type {!Array<!StatusNotification>} */
    const statusNotifications = [];

    /** @type {?StatusNotification} */
    let prevStatusNotification = null;

    let isTimerActive = false;

    /**
     * @param {!StatusNotification} statusNotification
     * @return {boolean}
     */
    const isError = (statusNotification) => {
      return (
        statusNotification.shieldState === ShieldState.ERROR
      );
    };

    /**
     * @param {!StatusNotification} statusNotification
     * @return {boolean}
     */
    const isTerminal = (statusNotification) => {
      return (
        statusNotification.shieldState === ShieldState.ERROR ||
        statusNotification.shieldState === ShieldState.PASSED ||
        statusNotification.shieldState === ShieldState.FAILED
      );
    };

    const maybeNotify = () => {
      const newestStatusNotification = statusNotifications[statusNotifications.length - 1];
      if (isTimerActive || !newestStatusNotification || newestStatusNotification === prevStatusNotification) {
        return;
      }

      prevStatusNotification = newestStatusNotification;
      isTimerActive = true;

      this.notifyUnthrottled_(newestStatusNotification);

      setTimeout(() => {
        isTimerActive = false;
        maybeNotify();
      }, STATUS_UPDATE_THROTTLE_INTERVAL_MS);
    };

    /**
     * @param {!StatusNotification} newStatusNotification
     * @private
     */
    this.notifyThrottled_ = (newStatusNotification) => {
      if (prevStatusNotification) {
        // Prevent out-of-order status updates, which can happen due to async execution.
        if (isError(prevStatusNotification)) {
          return;
        }
        if (isTerminal(prevStatusNotification) && !isTerminal(newStatusNotification)) {
          return;
        }
      }

      statusNotifications.push(newStatusNotification);
      maybeNotify();
    };
  }

  /**
   * @param {!mdc.proto.ReportData} reportData
   */
  initialize(reportData) {
    this.reportData_ = reportData;
  }

  starting() {
    this.notify_(ShieldState.STARTING, ThrottleType.UNTHROTTLED);
  }

  error() {
    this.notify_(ShieldState.ERROR, ThrottleType.UNTHROTTLED);
  }

  running() {
    this.notify_(ShieldState.RUNNING, ThrottleType.THROTTLED);
  }

  finished() {
    this.notify_(ShieldState.RUNNING, ThrottleType.UNTHROTTLED);
  }

  /**
   * @param {!ShieldState} shieldState
   * @param {!ThrottleType} throttleType
   */
  notify_(shieldState, throttleType) {
    const runnableScreenshots = this.reportData_.screenshots.runnable_screenshot_list;
    const targetUrl = this.reportData_.meta.report_html_file ? this.reportData_.meta.report_html_file.public_url : null;

    /**
     * @param {!mdc.proto.Screenshot} screenshot
     * @return {boolean}
     */
    const hasDiffs = (screenshot) => Boolean(screenshot.diff_image_result && screenshot.diff_image_result.has_changed);

    /**
     * @param {!mdc.proto.Screenshot} screenshot
     * @return {boolean}
     */
    const isFinished = (screenshot) => screenshot.capture_state === CaptureState.DIFFED;

    const numScreenshotsTotal = runnableScreenshots.length;
    const numScreenshotsFinished = runnableScreenshots.filter(isFinished).length;
    const numChanged = runnableScreenshots.filter(hasDiffs).length;
    const isTerminal = numScreenshotsFinished === numScreenshotsTotal;
    const isPassed = isTerminal && numChanged === 0;
    const isFailed = isTerminal && numChanged > 0;

    if (isPassed) {
      shieldState = ShieldState.PASSED;
    } else if (isFailed) {
      shieldState = ShieldState.FAILED;
    }

    /** @type {!StatusNotification} */
    const statusNotification = {
      shieldState,
      numScreenshotsTotal,
      numScreenshotsFinished,
      numChanged,
      targetUrl,
    };

    if (throttleType === ThrottleType.UNTHROTTLED) {
      this.notifyUnthrottled_(statusNotification);
    } else {
      this.notifyThrottled_(statusNotification);
    }
  }

  /**
   * @param {!StatusNotification} statusNotification
   * @private
   */
  notifyUnthrottled_(statusNotification) {
    const travisJobId = process.env.TRAVIS_JOB_ID;
    const travisJobUrl =
      travisJobId ? `https://travis-ci.com/material-components/material-components-web/jobs/${travisJobId}` : null;
    const githubRepoUrl = 'https://github.com/material-components/material-components-web';

    const shieldState = statusNotification.shieldState;
    const numTotal = statusNotification.numScreenshotsTotal;
    const numDone = statusNotification.numScreenshotsFinished;
    const numChanged = statusNotification.numChanged;
    const numPercent = numTotal > 0 ? (100 * numDone / numTotal) : 0;
    const targetUrl = statusNotification.targetUrl || travisJobUrl || githubRepoUrl;

    const strDone = numDone.toLocaleString();
    const strTotal = numTotal.toLocaleString();
    const strPercent = `${numPercent.toFixed(1)}%`;
    const strChanged = numChanged.toLocaleString();
    const changedPlural = numChanged === 1 ? '' : 's';

    this.postToDatastore_({shieldState, numTotal, numDone, numChanged, targetUrl});
    this.postToGitHub_({shieldState, strTotal, strDone, strChanged, changedPlural, strPercent, targetUrl});
  }

  /**
   * @param {!ShieldState} shieldState
   * @param {number} numTotal
   * @param {number} numDone
   * @param {number} numChanged
   * @param {string} targetUrl
   * @private
   */
  postToDatastore_({shieldState, numTotal, numDone, numChanged, targetUrl}) {
    this.cloudDatastore_.createScreenshotStatus({
      shieldState,
      numScreenshotsTotal: numTotal,
      numScreenshotsFinished: numDone,
      numDiffs: numChanged,
      numChanged,
      targetUrl,
      snapshotGitRev: this.reportData_.meta.snapshot_diff_base.git_revision,
    }).catch((reason) => {
      console.error(CliColor.red('ERROR:'), reason);
      console.error(getStackTrace('postToDatastore_'));
    });
  }

  /**
   * @param {!ShieldState} shieldState
   * @param {string} strTotal
   * @param {string} strDone
   * @param {string} strChanged
   * @param {string} changedPlural
   * @param {string} strPercent
   * @param {string} targetUrl
   * @private
   */
  postToGitHub_({shieldState, strTotal, strDone, strChanged, changedPlural, strPercent, targetUrl}) {
    let state = null;
    let description = null;

    if (shieldState === ShieldState.ERROR) {
      state = GitHubApi.PullRequestState.ERROR;
      description = 'Error running screenshot tests';
    } else if (shieldState === ShieldState.PASSED) {
      state = GitHubApi.PullRequestState.SUCCESS;
      description = `All ${strTotal} screenshots match PR's golden.json`;
    } else if (shieldState === ShieldState.FAILED) {
      state = GitHubApi.PullRequestState.FAILURE;
      description = `${strChanged} screenshot${changedPlural} differ from PR's golden.json`;
    } else {
      state = GitHubApi.PullRequestState.PENDING;
      description = `${strDone} of ${strTotal} (${strPercent}) - ${strChanged} diff${changedPlural}`;
    }

    this.gitHubApi_.setPullRequestStatus({state, description, targetUrl}).catch((reason) => {
      console.error(CliColor.red('ERROR:'), reason);
      console.error(getStackTrace('postToGitHub_'));
    });
  }
}

module.exports = StatusNotifier;
