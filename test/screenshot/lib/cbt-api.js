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
const {ExitCode} = require('../lib/constants');

const API_BASE_URL = 'https://crossbrowsertesting.com/api/v3';
const API_USERNAME = process.env.CBT_USERNAME;
const API_AUTHKEY = process.env.CBT_AUTHKEY;

class CbtApi {
  constructor() {
    if (!API_USERNAME) {
      console.error('Error: CBT_USERNAME environment variable is not set');
      process.exit(ExitCode.MISSING_ENV_VAR);
    }
    if (!API_AUTHKEY) {
      console.error('Error: CBT_AUTHKEY environment variable is not set');
      process.exit(ExitCode.MISSING_ENV_VAR);
    }
  }

  async fetchAvailableDevices() {
    console.log('Fetching available devices...');
    return this.sendRequest_('GET', '/screenshots/browsers');
  }

  async fetchScreenshotInfo(cbtScreenshotId) {
    return this.sendRequest_('GET', `/screenshots/${cbtScreenshotId}`);
  }

  async sendCaptureRequest(url, userAgents) {
    console.log(`Sending screenshot capture request for "${url}"...`);
    const browsers = userAgents.map((config) => config.fullCbtApiName).join(',');
    return this.sendRequest_('POST', '/screenshots/', {
      url,
      browsers,
      delay: 2, // in seconds. helps reduce flakes due to missing icon fonts
    });
  }

  async sendRequest_(method, endpoint, body = undefined) {
    return request({
      method,
      uri: `${API_BASE_URL}${endpoint}`,
      auth: {
        username: API_USERNAME,
        password: API_AUTHKEY,
      },
      body,
      json: true, // Automatically stringify the request body and parse the response body as JSON
    });
  }
}

module.exports = CbtApi;
