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

/* eslint-disable no-unused-vars */


/*
 * Report UI
 */


/**
 * @typedef {{
 *   checkedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   uncheckedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   unreviewedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   changelistDict: !ReportUiChangelistDict,
 *   reviewStatusCountDict: !ReportUiReviewStatusCountDict,
 * }} ReportUiState
 */

/**
 * @typedef {{
 *   changed: !ReportUiChangelistState,
 *   added: !ReportUiChangelistState,
 *   removed: !ReportUiChangelistState,
 * }} ReportUiChangelistDict
 */

/**
 * @typedef {{
 *   cbEl: !HTMLInputElement,
 *   countEl: !HTMLElement,
 *   reviewStatusEl: !HTMLElement,
 *   checkedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   uncheckedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   reviewStatusCountDict: !ReportUiReviewStatusCountDict,
 *   pageDict: !ReportUiPageDict,
 * }} ReportUiChangelistState
 */

/**
 * @typedef {!Object<string, !ReportUiPageState>} ReportUiPageDict
 */

/**
 * @typedef {{
 *   cbEl: !HTMLInputElement,
 *   countEl: !HTMLElement,
 *   reviewStatusEl: !HTMLElement,
 *   checkedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   uncheckedUserAgentCbEls: !Array<!HTMLInputElement>,
 *   reviewStatusCountDict: !ReportUiReviewStatusCountDict,
 * }} ReportUiPageState
 */

/**
 * @typedef {!Object<string, number>} ReportUiReviewStatusCountDict
 */


/*
 * CLI args
 */


/**
 * @typedef {{
 *   optionNames: !Array<string>,
 *   description: string,
 *   isRequired: ?boolean,
 *   type: ?string,
 *   defaultValue: ?*,
 *   exampleValue: ?string,
 * }} CliOptionConfig
 */


/*
 * CBT (CrossBrowserTesting.com)
 */


/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   desktop_width: number,
 *   desktop_height: number,
 *   name: number,
 *   requested_name: number,
 * }} CbtSeleniumResolution
 */

/**
 * @typedef {{
 *   name: string,
 *   type: string,
 *   version: string,
 *   api_name: string,
 *   device: string,
 *   device_type: ?string,
 *   icon_class: string,
 *   requested_api_name: string,
 * }} CbtSeleniumOs
 */

/**
 * @typedef {{
 *   name: string,
 *   type: string,
 *   version: string,
 *   api_name: string,
 *   icon_class: string,
 *   requested_api_name: string,
 * }} CbtSeleniumBrowser
 */

/**
 * @typedef {{
 *   hash: string,
 *   date_added: string,
 *   is_finished: boolean,
 *   description: ?string,
 *   tags: !Array<?>,
 *   show_result_web_url: ?string,
 *   show_result_public_url: ?string,
 *   video: ?string,
 *   image: ?string,
 *   thumbnail_image: ?string,
 * }} CbtSeleniumVideo
 */

/**
 * @typedef {{
 *   hash: string,
 *   date_added: string,
 *   is_finished: boolean,
 *   description: ?string,
 *   tags: !Array<?>,
 *   show_result_web_url: ?string,
 *   show_result_public_url: ?string,
 *   video: ?string,
 *   pcap: ?string,
 *   har: ?string,
 * }} CbtSeleniumNetwork
 */

/**
 * @typedef {{
 *   body: string,
 *   method: string,
 *   path: string,
 *   date_issued: string,
 *   hash: ?string,
 *   response_code: number,
 *   response_body: ?string,
 *   step_number: ?number,
 * }} CbtSeleniumCommand
 */

/**
 * @typedef {{
 *   selenium: !Array<!CbtSeleniumListItem>,
 * }} CbtSeleniumListResponse
 */

/**
 * @typedef {{
 *   selenium_test_id: string,
 *   selenium_session_id: string,
 *   start_date: string,
 *   finish_date: ?string,
 *   test_score: string,
 *   active: boolean,
 *   state: string,
 *   show_result_web_url: ?string,
 *   show_result_public_url: ?string,
 *   download_results_zip_url: ?string,
 *   download_results_zip_public_url: ?string,
 *   launch_live_test_url: ?string,
 *   resolution: !CbtSeleniumResolution,
 *   os: !CbtSeleniumOs,
 *   browser: !CbtSeleniumBrowser,
 * }} CbtSeleniumListItem
 */

/**
 * @typedef {{
 *   selenium_test_id: string,
 *   selenium_session_id: string,
 *   start_date: string,
 *   finish_date: ?string,
 *   test_score: string,
 *   active: boolean,
 *   state: string,
 *   startup_finish_date: string,
 *   url: string,
 *   client_platform: string,
 *   client_browser: string,
 *   use_copyrect: boolean,
 *   scale: string,
 *   is_packet_capturing: number,
 *   tunnel_id: number,
 *   archived: number,
 *   selenium_version: string,
 *   show_result_web_url: ?string,
 *   show_result_public_url: ?string,
 *   download_results_zip_url: ?string,
 *   download_results_zip_public_url: ?string,
 *   launch_live_test_url: ?string,
 *   resolution: !CbtSeleniumResolution,
 *   os: !CbtSeleniumOs,
 *   browser: !CbtSeleniumBrowser,
 *   requestMethod: string,
 *   api_version: string,
 *   description: ?string,
 *   tags: !Array<?>,
 *   videos: !Array<!CbtSeleniumVideo>,
 *   snapshots: !Array<?>,
 *   networks: !Array<!CbtSeleniumNetwork>,
 *   commands: !Array<!CbtSeleniumNetwork>,
 * }} CbtSeleniumInfoResponse
 */


/*
 * Resemble.js API externs
 */


/**
 * @typedef {{
 *   rawMisMatchPercentage: number,
 *   misMatchPercentage: string,
 *   diffBounds: !ResembleApiBoundingBox,
 *   analysisTime: number,
 *   getImageDataUrl: function(text: string): string,
 *   getBuffer: function(includeOriginal: boolean): !Buffer,
 * }} ResembleApiComparisonResult
 */

/**
 * @typedef {{
 *   top: number,
 *   left: number,
 *   bottom: number,
 *   right: number,
 * }} ResembleApiBoundingBox
 */


/*
 * ps-node API externs
 */


/**
 * @typedef {{
 *   pid: number,
 *   ppid: number,
 *   command: string,
 *   arguments: !Array<string>,
 * }} PsNodeProcess
 */


/*
 * Node.js API
 */


/**
 * @typedef {{
 *   cwd: ?string,
 *   env: ?Object,
 *   argv0: ?string,
 *   stdio: ?Array<string>,
 *   detached: ?boolean,
 *   uid: ?number,
 *   gid: ?number,
 *   shell: ?boolean,
 *   windowsVerbatimArguments: ?boolean,
 *   windowsHide: ?boolean,
 * }} ChildProcessSpawnOptions
 */

/**
 * @typedef {{
 *   status: number,
 *   signal: ?string,
 *   pid: number,
 * }} ChildProcessSpawnResult
 */


/*
 * Image cropping
 */


/**
 * @typedef {{r: number, g: number, b: number, a: number}} RGBA
 */
