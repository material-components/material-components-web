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

/**
 * @typedef {{
 *   shieldState: !ShieldState,
 *   numScreenshotsTotal: number,
 *   numScreenshotsFinished: number,
 *   numChanged: number,
 *   targetUrl: ?string,
 * }} StatusNotification
 */

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
 *   state: !ShieldState,
 *   target_url: string,
 *   travis_build_id: ?string,
 *   travis_build_number: ?string,
 *   travis_job_id: ?string,
 *   travis_job_number: ?string,
 * }} DatastoreScreenshotStatus
 */

/**
 * @enum {string}
 */
module.exports.ThrottleType = {
  THROTTLED: 1,
  UNTHROTTLED: 2,
};

/**
 * @enum {string}
 */
module.exports.ShieldState = {
  UNKNOWN: 'UNKNOWN',
  STARTING: 'STARTING',
  RUNNING: 'RUNNING',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
};
