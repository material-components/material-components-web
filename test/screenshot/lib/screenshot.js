/*
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

const CbtApi = require('./cbt-api');
const CbtUserAgent = require('./cbt-user-agent');
const Duration = require('./duration');
const ParallelQueue = require('./parallel-queue');
const Progress = require('./progress');

/*
 * Configurable
 */

/**
 * Maximum number of parallel screenshot requests allowed by our CBT plan.
 * @type {number}
 */
const API_PARALLEL_REQUEST_LIMIT = 5;

/**
 * Maximum number of times to retry a failed HTTP request.
 * @type {number}
 */
const API_MAX_RETRIES = 5;

/**
 * How long to wait for a single URL to be captured in all browsers.
 * @type {!Duration}
 */
const API_MAX_WAIT = Duration.minutes(10);

/**
 * How long to wait between polling the API for status changes.
 * @type {!Duration}
 */
const API_POLL_INTERVAL = Duration.seconds(5);

/**
 * How long to wait between retrying failed requests.
 * @type {!Duration}
 */
const API_RETRY_WAIT = Duration.seconds(10);

/*
 * Non-configurable
 */

/** @type {number} */ const API_MAX_WAIT_MS = API_MAX_WAIT.toMillis();
/** @type {number} */ const API_POLL_INTERVAL_MS = API_POLL_INTERVAL.toMillis();
/** @type {string} */ const API_POLL_INTERVAL_HUMAN = API_POLL_INTERVAL.toHuman();
/** @type {number} */ const API_RETRY_WAIT_MS = API_RETRY_WAIT.toMillis();
/** @type {string} */ const API_RETRY_WAIT_HUMAN = API_RETRY_WAIT.toHuman();

/** @type {!CbtApi} */
const cbtApi = new CbtApi();

/** @type {!ParallelQueue<string>} */
const requestQueue = new ParallelQueue({maxParallels: API_PARALLEL_REQUEST_LIMIT});

/**
 * Map of URLs to `Progress` objects.
 * @type {!Map<string, !Progress>}
 */
const progressMap = new Map();

module.exports = {
  captureOneUrl,
};

async function captureOneUrl(testPageUrl) {
  /** @type {!Array<!CbtUserAgent>} */
  const {runnableUserAgents} = await CbtUserAgent.fetchUserAgents();

  logTestCaseProgress(testPageUrl, Progress.enqueued(runnableUserAgents.length));

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

async function sendCaptureRequest(testPageUrl, retryCount = 0) {
  if (retryCount > API_MAX_RETRIES) {
    throw new Error(`Capture request failed after ${API_MAX_RETRIES} retry attempts - ${testPageUrl}`);
  }

  /** @type {!Array<!CbtUserAgent>} */
  const {runnableUserAgents} = await CbtUserAgent.fetchUserAgents();

  return cbtApi.sendCaptureRequest(testPageUrl, runnableUserAgents)
    .catch(async (err) => {
      if (reachedParallelExecutionLimit(err)) {
        await logParallelExecutionAndSleep();
        return sendCaptureRequest(testPageUrl, retryCount); // don't increment the retry count for parallel execution
      }

      if (isBadUrl(err)) {
        return rejectWithError('sendCaptureRequest', testPageUrl, new Error(err.response.body.message));
      }

      // TODO(acdvorak): Abstract this logic into CbtApi for every HTTP request?
      if (isServerError(err)) {
        await logServerErrorAndSleep(err);
        return sendCaptureRequest(testPageUrl, retryCount + 1);
      }

      return rejectWithError('sendCaptureRequest', testPageUrl, err);
    });
}

async function handleCaptureResponse(testPageUrl, captureResponseBody, retryCount = 0) {
  if (retryCount > API_MAX_RETRIES) {
    throw new Error(`Capture response failed after ${API_MAX_RETRIES} retry attempts - ${testPageUrl}`);
  }

  let infoResponseBody;
  let infoProgress;

  const startTimeMs = Date.now();
  const isStillRunning = () => !infoProgress || infoProgress.running > 0;
  const isTimedOut = () => Duration.hasElapsed(API_MAX_WAIT_MS, startTimeMs);

  while (isStillRunning() && !isTimedOut()) {
    await sleep(API_POLL_INTERVAL_MS);
    infoResponseBody = await fetchScreenshotInfo(captureResponseBody.screenshot_test_id);
    infoProgress = computeTestCaseProgress(testPageUrl, infoResponseBody);
    logTestCaseProgress(testPageUrl, infoProgress);
  }

  const elapsedTimeHuman = Duration.getElapsed(startTimeMs).toHuman();

  if (isStillRunning() && isTimedOut()) {
    const err = new Error([
      `Timed out waiting for CBT after ${elapsedTimeHuman}`,
      `to finish capturing a screenshot of "${testPageUrl}".`,
    ].join('\n'));
    return rejectWithError('handleCaptureResponse', testPageUrl, err);
  }

  // We don't use CBT's screenshot versioning features, so there should only ever be one version.
  // Each "result" is an individual browser screenshot for a single URL.
  const allResults = infoResponseBody.versions[0].results;
  const resultsWithNoFullpageImage = allResults.filter((cbtResult) => !cbtResult.images.fullpage);
  const resultsWithNoChromelessImage = allResults.filter((cbtResult) => !cbtResult.images.chromeless);

  // At least one browser failed to capture. Retry all browsers.
  if (resultsWithNoFullpageImage.length > 0) {
    // TODO(acdvorak): Use CBT "retry" API instead of rerunning in all browsers?
    await logNullResponseErrorAndSleep('cbtResult.images.fullpage', resultsWithNoFullpageImage);
    return sendCaptureRequest(testPageUrl, retryCount + 1);
  }

  if (resultsWithNoChromelessImage.length > 0) {
    // TODO(acdvorak): Use CBT "retry" API instead of rerunning in all browsers?
    await logNullResponseErrorAndSleep('cbtResult.images.chromeless', resultsWithNoChromelessImage);
    return sendCaptureRequest(testPageUrl, retryCount + 1);
  }

  logTestCaseProgress(testPageUrl, infoProgress);

  return Promise.resolve(infoResponseBody);
}

async function fetchScreenshotInfo(screenshotTestId) {
  return cbtApi.fetchScreenshotInfo(screenshotTestId)
    .catch(async (err) => {
      // TODO(acdvorak): Abstract this logic into CbtApi for every HTTP request?
      if (isServerError(err)) {
        await logServerErrorAndSleep(err);
        return fetchScreenshotInfo(screenshotTestId);
      }
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
    return requestError.response.body.message.includes('maximum number of parallel');
  } catch (e) {
    return false;
  }
}

function isBadUrl(requestError) {
  try {
    // The try/catch is necessary because some of these properties might not exist.
    return requestError.response.body.message.includes('URL check failed');
  } catch (e) {
    return false;
  }
}

function isServerError(requestError) {
  return requestError.statusCode >= 500 && requestError.statusCode < 600;
}

function rejectWithError(functionName, testPageUrl, err) {
  console.error(`ERROR in ${functionName}("${testPageUrl}"):`);
  console.error('');
  console.error(err);
  return Promise.reject(err);
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function logParallelExecutionAndSleep() {
  console.warn(`Parallel execution limit reached - waiting for ${API_POLL_INTERVAL_HUMAN} before retrying...`);
  return sleep(API_POLL_INTERVAL_MS);
}

async function logServerErrorAndSleep(requestError) {
  console.warn('requestError.options:', requestError.options); // HTTP request params
  console.warn('requestError.error:', requestError.error); // HTTP response body
  console.warn(`
CBT server error: HTTP ${requestError.statusCode}
Waiting for ${API_RETRY_WAIT_HUMAN} before retrying...
`);
  return sleep(API_RETRY_WAIT_MS);
}

async function logNullResponseErrorAndSleep(nullPropertyName, resultsWithNullProperties) {
  console.error(resultsWithNullProperties);
  console.error(`
ERROR: ${nullPropertyName} is null
Waiting for ${API_RETRY_WAIT_HUMAN} before retrying...
`);
  return sleep(API_RETRY_WAIT_MS);
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
