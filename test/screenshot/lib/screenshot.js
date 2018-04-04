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

const fs = require('fs');
const request = require('request-promise-native');
const Progress = require('./progress');

const API_BASE_URL = 'https://crossbrowsertesting.com/api/v3/';
const API_USERNAME = process.env.CBT_USERNAME;
const API_AUTHKEY = process.env.CBT_AUTHKEY;
const API_POLL_INTERVAL_MS = 1000 * 5; // how long to wait between polling the API for status changes
const API_MAX_WAIT_MS = 1000 * 60; // how long to wait for all browsers to finish taking a single screenshot

// Format: "[OS api_name]|[Browser api_name]|[OS resolution]".
// [Browser api_name] is required, but the [OS ...] properties are optional.
// See https://crossbrowsertesting.com/apidocs/v3/screenshots.html#!/default/post_screenshots
const BROWSERS = [
  'Chrome63x64',
  'Edge16',
];

// Map of URLs to `Progress` objects.
const progressMap = new Map();

module.exports = {
  captureAll,
};

async function captureAll(testPageUrls) {
  return Promise.all(testPageUrls.map(captureOne));
}

async function captureOne(testPageUrl) {
  logScreenshotProgress(testPageUrl, Progress.enqueued(BROWSERS.length));

  return sendCaptureRequest(testPageUrl)
    .then(async (captureResponseBody) => {
      return handleCaptureResponse(testPageUrl, captureResponseBody);
    });
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

  return request(options)
    .then(
      (captureResponseBody) => {
        logScreenshotInfoResponse(captureResponseBody, '/tmp/cbt-capture-response.json');
        return captureResponseBody;
      },
      async (err) => {
        if (reachedParallelExecutionLimit(err.response.body)) {
          // Wait a few seconds, then try again.
          await sleep(API_POLL_INTERVAL_MS);
          return sendCaptureRequest(testPageUrl);
        }

        // Unknown error.
        return Promise.reject(err);
      });
}

async function fetchScreenshotInfo(screenshotTestId) {
  const options = {
    method: 'GET',
    uri: apiUrl(`/screenshots/${screenshotTestId}`),
    auth: {
      username: API_USERNAME,
      password: API_AUTHKEY,
    },
    json: true, // Automatically stringify the request body and parse the response body as JSON
  };

  return request(options)
    .then((infoResponseBody) => {
      logScreenshotInfoResponse(infoResponseBody, '/tmp/cbt-status-response.json');
      return infoResponseBody;
    });
}

async function handleCaptureResponse(testPageUrl, captureResponseBody) {
  let infoResponseBody;
  let infoProgress = computeIndividualProgress(testPageUrl, captureResponseBody);

  const startTime = Date.now();
  const isStillRunning = () => infoProgress.running > 0;
  const isTimedOut = () => (Date.now() - startTime) > API_MAX_WAIT_MS;

  while (isStillRunning() && !isTimedOut()) {
    await sleep(API_POLL_INTERVAL_MS);

    infoResponseBody = await fetchScreenshotInfo(captureResponseBody.screenshot_test_id);
    infoProgress = computeIndividualProgress(testPageUrl, infoResponseBody);
  }

  if (isStillRunning() && isTimedOut()) {
    console.error(`ERROR: Timed out after ${API_MAX_WAIT_MS} ms while waiting for ${testPageUrl} to complete.`);
    return;
  }

  // TODO(acdvorak): Figure out if there will ever be multiple versions.
  // TODO(acdvorak): Figure out how (and if) to version our screenshot images.
  infoResponseBody.versions[0].results.forEach((result) => {
    logScreenshotInfoResult(testPageUrl, result);
  });
}

function computeIndividualProgress(testPageUrl, screenshotInfoResponseBody) {
  let progress = Progress.none();

  // TODO(acdvorak): Expose this (and any other interesting) information to the user somehow.
  // Console output or a dynamic status page?
  const details = {
    url: screenshotInfoResponseBody.url,
    screenshot_test_id: screenshotInfoResponseBody.screenshot_test_id,

    versions: screenshotInfoResponseBody.versions.map((version) => {
      // `result_count` has the same properties as `Progress`.
      progress = progress.plus(version.result_count);

      return {
        version_id: version.version_id,

        show_results_web_url: version.show_results_web_url,
        show_results_public_url: version.show_results_public_url,
        show_comparisons_web_url: version.show_comparisons_web_url,
        show_comparisons_public_url: version.show_comparisons_public_url,
        download_results_zip_url: version.download_results_zip_url,
        download_results_zip_public_url: version.download_results_zip_public_url,

        active: version.active,
        result_count: version.result_count,
        results: version.results.map((result) => {
          return {
            result_id: result.result_id,
            state: result.state,
            successful: result.successful,
            os_name: result.os.name,
            browser_name: result.browser.name,
            images: result.images,
            thumbs: result.thumbs,
            resolution: result.resolution,
            initialized_date: result.initialized_date,
            start_date: result.start_date,
            finish_date: result.finish_date,
            description: result.description,
            tags: result.tags,
          };
        }),
      };
    }),
  };

  logScreenshotProgress(testPageUrl, progress);

  return progress;
}

function computeAggregateProgress() {
  return Array.from(progressMap.values()).reduce((total, current) => total.plus(current));
}

function reachedParallelExecutionLimit(responseBody) {
  return responseBody.message.indexOf('maximum number of parallel');
}

function logScreenshotProgress(testPageUrl, testPageProgress) {
  progressMap.set(testPageUrl, testPageProgress);

  const aggregateProgress = computeAggregateProgress();
  const finished = aggregateProgress.finished;
  const total = aggregateProgress.total;
  const pct = Math.floor(aggregateProgress.percent);

  process.stdout.write(`\rProgress: ${finished} of ${total} captures finished (${pct}% complete)`);
}

function logScreenshotInfoResponse(responseBody, logFilePath) {
  const responseBodyJson = JSON.stringify(responseBody, null, 2);
  fs.writeFileSync(logFilePath, responseBodyJson, {encoding: 'utf8'});
}

function logScreenshotInfoResult(testPageUrl, result) {
  // console.log('');
  // console.log(testPageUrl);
  // console.log('');
  // console.log(`  ${result.os.device} > ${result.os.name} > ${result.browser.name}:`);
  // console.log(`    - thumb (chromeless): ${result.thumbs.chromeless}`);
  // console.log(`    - image (chromeless): ${result.images.chromeless}`);
}

function apiUrl(apiEndpointPath) {
  const apiEndpointPathWithoutLeadingSlash = apiEndpointPath.replace(new RegExp('^/+'), '');
  return `${API_BASE_URL}${apiEndpointPathWithoutLeadingSlash}`;
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
