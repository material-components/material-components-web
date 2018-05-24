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
const ParallelQueue = require('./parallel-queue');
const Progress = require('./progress');
const CbtUserAgent = require('./cbt-user-agent');

/** Maximum number of parallel screenshot requests allowed by our CBT plan. */
const API_PARALLEL_REQUEST_LIMIT = 5;

/** How long to wait between polling the API for status changes. */
const API_POLL_INTERVAL_MS = 1000 * 5;

/** How long to wait for a single URL to be captured in all browsers. */
const API_MAX_WAIT_MS = 1000 * 60 * 5;

/** Maximum number of times to retry a failed HTTP request. */
const API_MAX_RETRIES = 5;

/** Map of URLs to `Progress` objects. */
const progressMap = new Map();

const cbtApi = new CbtApi();

/**
 * @type {!ParallelQueue<string>}
 */
const requestQueue = new ParallelQueue({maxParallels: API_PARALLEL_REQUEST_LIMIT});

module.exports = {
  captureOneUrl,
};

async function captureOneUrl(testPageUrl) {
  const userAgents = await CbtUserAgent.fetchBrowsersToRun();

  logTestCaseProgress(testPageUrl, Progress.enqueued(userAgents.length));

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
    throw new Error(`Capture request failed after ${retryCount} retry attempts - ${testPageUrl}`);
  }

  const userAgents = await CbtUserAgent.fetchBrowsersToRun();
  return cbtApi.sendCaptureRequest(testPageUrl, userAgents)
    .catch(async (err) => {
      const waitInSeconds = millisToSeconds(API_POLL_INTERVAL_MS);

      if (reachedParallelExecutionLimit(err)) {
        console.warn(`Parallel execution limit reached - waiting for ${waitInSeconds} seconds before retrying...`);
        await sleep(API_POLL_INTERVAL_MS);
        return sendCaptureRequest(testPageUrl, retryCount + 1);
      }

      // TODO(acdvorak): Abstract this logic into CbtApi for every HTTP request?
      if (isServerError(err)) {
        logServerError(err);
        await sleep(API_POLL_INTERVAL_MS);
        return sendCaptureRequest(testPageUrl, retryCount + 1);
      }

      return rejectWithError('sendCaptureRequest', testPageUrl, err);
    });
}

async function handleCaptureResponse(testPageUrl, captureResponseBody, retryCount = 0) {
  if (retryCount > API_MAX_RETRIES) {
    throw new Error(`Capture response failed after ${retryCount} retry attempts - ${testPageUrl}`);
  }

  let infoResponseBody;
  let infoProgress;

  const startTime = Date.now();
  const isStillRunning = () => !infoProgress || infoProgress.running > 0;
  const isTimedOut = () => (Date.now() - startTime) > API_MAX_WAIT_MS;

  while (isStillRunning() && !isTimedOut()) {
    await sleep(API_POLL_INTERVAL_MS);
    infoResponseBody = await fetchScreenshotInfo(captureResponseBody.screenshot_test_id);
    infoProgress = computeTestCaseProgress(testPageUrl, infoResponseBody);
    logTestCaseProgress(testPageUrl, infoProgress);
  }

  const elapsedTimeInMinutes = millisToMinutes(Date.now() - startTime);

  if (isStillRunning() && isTimedOut()) {
    const err = new Error([
      `Timed out waiting for CBT after ${elapsedTimeInMinutes} minutes`,
      `to finish capturing a screenshot of "${testPageUrl}".`,
    ].join('\n'));
    return rejectWithError('handleCaptureResponse', testPageUrl, err);
  }

  // We don't use CBT's screenshot versioning features, so there should only ever be one version.
  // Each "result" is an individual browser screenshot for a single URL.
  const allResults = infoResponseBody.versions[0].results;
  const resultsWithNoFullpageImage = allResults.filter((cbtResult) => !cbtResult.images.fullpage);
  const resultsWithNoChromelessImage = allResults.filter((cbtResult) => !cbtResult.images.chromeless);

  async function sleepAndLogError(nullPropertyName, resultsWithNullProperties) {
    const waitInSeconds = millisToSeconds(API_POLL_INTERVAL_MS);
    console.error(resultsWithNullProperties);
    console.error(`
ERROR: ${nullPropertyName} is null
Waiting for ${waitInSeconds} seconds before retrying...
`);
    return sleep(API_POLL_INTERVAL_MS);
  }

  // At least one browser failed to capture. Retry all browsers.
  if (resultsWithNoFullpageImage.length > 0) {
    await sleepAndLogError('cbtResult.images.fullpage', resultsWithNoFullpageImage);
    return sendCaptureRequest(testPageUrl, retryCount + 1);
  }

  // CBT generated a fullpage screenshot, but has not yet generated the chromeless version. Send a new info request.
  if (resultsWithNoChromelessImage.length > 0) {
    await sleepAndLogError('cbtResult.images.chromeless', resultsWithNoChromelessImage);
    return handleCaptureResponse(testPageUrl, infoResponseBody, retryCount + 1);
  }

  logTestCaseProgress(testPageUrl, infoProgress);

  return Promise.resolve(infoResponseBody);
}

async function fetchScreenshotInfo(screenshotTestId) {
  return cbtApi.fetchScreenshotInfo(screenshotTestId)
    .catch(async (err) => {
      // TODO(acdvorak): Abstract this logic into CbtApi for every HTTP request?
      if (isServerError(err)) {
        logServerError(err);
        await sleep(API_POLL_INTERVAL_MS);
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
    return requestError.response.body.message.indexOf('maximum number of parallel');
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

function millisToSeconds(millis) {
  return Math.floor(millis / 1000);
}

function millisToMinutes(millis) {
  return Math.floor(millis / 1000 / 60);
}

function logServerError(requestError) {
  const waitInSeconds = millisToSeconds(API_POLL_INTERVAL_MS);
  console.warn(requestError.options); // HTTP request params
  console.warn(requestError.error); // HTTP response body
  console.warn(`
CBT server error: HTTP ${requestError.statusCode}
Waiting for ${waitInSeconds} seconds before retrying...
`);
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
