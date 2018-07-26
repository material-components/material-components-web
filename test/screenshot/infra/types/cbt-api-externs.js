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
