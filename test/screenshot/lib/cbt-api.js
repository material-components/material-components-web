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

const request = require('request-promise-native');

const API_BASE_URL = 'https://crossbrowsertesting.com/api/v3';
const API_USERNAME = process.env.CBT_USERNAME;
const API_AUTHKEY = process.env.CBT_AUTHKEY;

class CbtApi {
  async fetchAvailableDevices() {
    console.log('Fetching available devices...');
    return request({
      method: 'GET',
      uri: CbtApi.getFullUrl_('/screenshots/browsers'),
      auth: {
        username: API_USERNAME,
        password: API_AUTHKEY,
      },
      json: true, // Automatically stringify the request body and parse the response body as JSON
    });
  }

  async fetchScreenshotInfo(cbtScreenshotId) {
    return request({
      method: 'GET',
      uri: CbtApi.getFullUrl_(`/screenshots/${cbtScreenshotId}`),
      auth: {
        username: API_USERNAME,
        password: API_AUTHKEY,
      },
      json: true, // Automatically stringify the request body and parse the response body as JSON
    });
  }

  async sendCaptureRequest(url, userAgents) {
    console.log(`Sending screenshot capture request for "${url}"...`);
    const browsers = userAgents.map((config) => config.fullCbtApiName).join(',');
    return request({
      method: 'POST',
      uri: CbtApi.getFullUrl_('/screenshots/'),
      auth: {
        username: API_USERNAME,
        password: API_AUTHKEY,
      },
      body: {
        url,
        browsers,
        delay: 2, // in seconds. helps reduce flakes due to missing icon fonts
      },
      json: true, // Automatically stringify the request body and parse the response body as JSON
    });
  }

  /**
   * @param {string} apiEndpointPath
   * @return {string}
   * @private
   */
  static getFullUrl_(apiEndpointPath) {
    return `${API_BASE_URL}${apiEndpointPath}`;
  }
}

module.exports = CbtApi;
