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

module.exports = {
  /**
   * Path to the screenshot test directory in the git repo, relative to $PWD (the project root).
   * MUST end with a trailing slash.
   * @type {string}
   */
  TEST_DIR_RELATIVE_PATH: 'test/screenshot/',

  /**
   * Path to the JSON file that stores the URLs of approved ("golden") screenshot images.
   * Assumed to be relative to $PWD (the root directory of the git repo).
   * @type {string}
   */
  GOLDEN_JSON_RELATIVE_PATH: 'test/screenshot/golden.json',

  /**
   * Name of the Google Cloud Storage bucket to use for public file uploads.
   * @type {string}
   */
  GCS_BUCKET: 'mdc-web-screenshot-tests',

  /**
   * Number of milliseconds to wait before retrying a concurrent CBT Selenium request.
   * @type {number}
   */
  CBT_CONCURRENCY_POLL_INTERVAL_MS: 30 * 1000, // 30 seconds

  /**
   * Maximum number of milliseconds to wait before aborting a concurrent CBT Selenium request.
   * @type {number}
   */
  CBT_CONCURRENCY_MAX_WAIT_MS: 10 * 60 * 1000, // 10 minutes

  /**
   * Number of milliseconds to wait for fonts to load on a test page in Selenium before giving up.
   * @type {number}
   */
  SELENIUM_FONT_LOAD_WAIT_MS: 3000,

  ExitCode: {
    OK: 0,
    UNKNOWN_ERROR: 11,
    SIGINT: 12, // ctrl-c
    SIGTERM: 13, // kill
    UNSUPPORTED_CLI_COMMAND: 14,
    HTTP_PORT_ALREADY_IN_USE: 15,
    MISSING_ENV_VAR: 16,
    UNHANDLED_PROMISE_REJECTION: 17,
    CHANGES_FOUND: 18,
  },
};
