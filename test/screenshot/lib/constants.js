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

  ExitCode: {
    UNKNOWN_ERROR: 1,
    SIGINT: 2, // ctrl-c
    SIGTERM: 3, // kill
    UNSUPPORTED_CLI_COMMAND: 4,
    HTTP_PORT_ALREADY_IN_USE: 5,
    MISSING_ENV_VAR: 6,
  },
};
