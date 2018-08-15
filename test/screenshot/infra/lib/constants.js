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
   * Number of milliseconds a Selenium test should wait to receive commands before being considered "stalled".
   * @type {number}
   */
  SELENIUM_ZOMBIE_SESSION_DURATION_MS: 2 * 60 * 1000, // 2 minutes

  /**
   * Number of milliseconds to wait for Selenium tests to start before killing them when an error occurs.
   * @type {number}
   */
  SELENIUM_KILL_WAIT_MS: 30 * 1000, // 30 seconds

  ExitCode: {
    OK: 0,

    /** ctrl-c */
    SIGINT: 11,

    /** kill */
    SIGTERM: 12,

    UNKNOWN_ERROR: 13,
    UNCAUGHT_EXCEPTION: 14,
    UNHANDLED_PROMISE_REJECTION: 15,
    UNSUPPORTED_CLI_COMMAND: 16,
    MISSING_ENV_VAR: 17,
    HTTP_PORT_ALREADY_IN_USE: 18,
    CHANGES_FOUND: 19,
  },
};
