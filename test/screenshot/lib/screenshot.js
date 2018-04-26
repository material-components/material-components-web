/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const ParallelQueue = require('./parallel-queue');
const Progress = require('./progress');
const request = require('request-promise-native');

const API_BASE_URL = 'https://crossbrowsertesting.com/api/v3';
const API_USERNAME = process.env.CBT_USERNAME;
const API_AUTHKEY = process.env.CBT_AUTHKEY;

/** Maximum number of parallel screenshot requests allowed by our CBT plan. */
const API_PARALLEL_REQUEST_LIMIT = 5;

/** How long to wait between polling the API for status changes. */
const API_POLL_INTERVAL_MS = 1000 * 5;

/** How long to wait for a single URL to be captured in all browsers. */
const API_MAX_WAIT_MS = 1000 * 60 * 3;

/**
 * List of browsers to use.
 *
 * API documentation for the name format can be found at:
 * https://crossbrowsertesting.com/apidocs/v3/screenshots.html#!/default/post_screenshots
 *
 * TODO(acdvorak): Use CBT's API that returns the full list of browser names available:
 * https://crossbrowsertesting.com/apidocs/v3/screenshots.html#!/default/get_screenshots_browsers
 *
 * @type {!Array<string>}
 */
const BROWSERS = [
  'Chrome63x64',
  'Edge16',
];

/** Map of URLs to `Progress` objects. */
const progressMap = new Map();

/**
 * @type {!ParallelQueue<string>}
 */
const requestQueue = new ParallelQueue({maxParallels: API_PARALLEL_REQUEST_LIMIT});

module.exports = {
  captureOneUrl,
};

async function captureOneUrl(testPageUrl) {
  logTestCaseProgress(testPageUrl, Progress.enqueued(BROWSERS.length));

  return requestQueue.enqueue(testPageUrl)
    .then(
      () => sendCaptureRequest(testPageUrl)
    )
    .then(
      (captureResponseBody) => handleCaptureResponse(testPageUrl, captureResponseBody),
      (err) => rejectWithError('captureOneUrl', testPageUrl, err)
    )
    .then(
      (infoResponseBody) => {
        requestQueue.dequeue(testPageUrl);
        return Promise.resolve(infoResponseBody);
      },
      (err) => {
        requestQueue.dequeue(testPageUrl);
        return Promise.reject(err);
      }
    );
}

async function sendCaptureRequest(testPageUrl) {
  const options = {
    method: 'POST',
    uri: apiUrl('/screenshots/'),
    auth: {
      username: API_USERNAME,
      password: API_AUTHKEY,
    },
    body: {
      url: testPageUrl,
      browsers: BROWSERS.join(','),
    },
    json: true, // Automatically stringify the request body and parse the response body as JSON
  };

  console.log(`sendCaptureRequest("${testPageUrl}")...`);

  return request(options)
    .catch(async (err) => {
      if (reachedParallelExecutionLimit(err)) {
        console.warn(`Parallel execution limit reached - waiting for ${API_POLL_INTERVAL_MS} ms before retrying...`);
        // Wait a few seconds, then try again.
        await sleep(API_POLL_INTERVAL_MS);
        return sendCaptureRequest(testPageUrl);
      }

      return rejectWithError('sendCaptureRequest', testPageUrl, err);
    });
}

async function handleCaptureResponse(testPageUrl, captureResponseBody) {
  let infoResponseBody;
  let infoProgress = computeTestCaseProgress(testPageUrl, captureResponseBody);

  const startTime = Date.now();
  const isStillRunning = () => infoProgress.running > 0;
  const isTimedOut = () => (Date.now() - startTime) > API_MAX_WAIT_MS;

  while (isStillRunning() && !isTimedOut()) {
    // Wait a few seconds, then try again.
    await sleep(API_POLL_INTERVAL_MS);
    infoResponseBody = await fetchScreenshotInfo(captureResponseBody.screenshot_test_id);
    infoProgress = computeTestCaseProgress(testPageUrl, infoResponseBody);
    logTestCaseProgress(testPageUrl, infoProgress);
  }

  if (isStillRunning() && isTimedOut()) {
    const err = new Error([
      `Timed out after ${Date.now() - startTime} ms waiting for CBT`,
      `to finish capturing a screenshot of "${testPageUrl}".`,
    ].join('\n'));
    return rejectWithError('handleCaptureResponse', testPageUrl, err);
  }

  if (infoResponseBody.statusCode === 524) {
    const err = new Error([
      `Timed out after ${Date.now() - startTime} ms waiting for CBT`,
      `to finish capturing a screenshot of "${testPageUrl}".`,
      'See https://support.cloudflare.com/hc/en-us/articles/200171926-Error-524',
    ].join('\n'));
    return rejectWithError('handleCaptureResponse', testPageUrl, err);
  }

  logTestCaseProgress(testPageUrl, infoProgress);

  return Promise.resolve(infoResponseBody);
}

async function fetchScreenshotInfo(screenshotTestId) {
  return request({
    method: 'GET',
    uri: apiUrl(`/screenshots/${screenshotTestId}`),
    auth: {
      username: API_USERNAME,
      password: API_AUTHKEY,
    },
    json: true, // Automatically stringify the request body and parse the response body as JSON
  });
}

function computeTestCaseProgress(testPageUrl, screenshotInfoResponseBody) {
  const progress = Progress.none();
  return screenshotInfoResponseBody.versions
    .map((version) => new Progress(version.result_count)) // `result_count` has the same properties as `Progress`
    .reduce((total, current) => progress.plus(current));
}

function computeTestSuiteProgress() {
  return Array.from(progressMap.values()).reduce((total, current) => total.plus(current));
}

function reachedParallelExecutionLimit(requestError) {
  try {
    // The try/catch is necessary because some of these properties might not exist.
    return requestError.response.body.message.indexOf('maximum number of parallel');
  } catch (e) {
    return false;
  }
}

function rejectWithError(functionName, testPageUrl, err) {
  console.error(`ERROR in ${functionName}("${testPageUrl}"):`);
  console.error('');
  console.error(err);
  return Promise.reject(err);
}

function apiUrl(apiEndpointPath) {
  return `${API_BASE_URL}${apiEndpointPath}`;
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

function logTestCaseProgress(testPageUrl, testPageProgress) {
  progressMap.set(testPageUrl, testPageProgress);

  const aggregateProgress = computeTestSuiteProgress();
  const finished = aggregateProgress.finished;
  const running = aggregateProgress.running;
  const total = aggregateProgress.total;
  const pct = Math.floor(aggregateProgress.percent);

  console.log(`${finished} of ${total} screenshots finished, ${running} running (${pct}% complete)`);
}
