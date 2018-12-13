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

/*
 * CrossBrowserTesting.com
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
