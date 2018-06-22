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
const MDC_CBT_USERNAME = process.env.MDC_CBT_USERNAME;
const MDC_CBT_AUTHKEY = process.env.MDC_CBT_AUTHKEY;

class CbtApi {
  constructor() {
    if (!MDC_CBT_USERNAME) {
      console.error(`
ERROR: Required environment variable 'MDC_CBT_USERNAME' is not set.

Please add the following to your ~/.bash_profile or ~/.bashrc file:

    export MDC_CBT_USERNAME='...'
    export MDC_CBT_AUTHKEY='...'

Credentials can be found on the CBT account page:
https://crossbrowsertesting.com/account
`);
      process.exit(ExitCode.MISSING_ENV_VAR);
    }

    if (!MDC_CBT_AUTHKEY) {
      console.error(`
ERROR: Required environment variable 'MDC_CBT_AUTHKEY' is not set.

Please add the following to your ~/.bash_profile or ~/.bashrc file:

    export MDC_CBT_USERNAME='...'
    export MDC_CBT_AUTHKEY='...'

Credentials can be found on the CBT Account page:
https://crossbrowsertesting.com/account
`);
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
        username: MDC_CBT_USERNAME,
        password: MDC_CBT_AUTHKEY,
      },
      body,
      json: true, // Automatically stringify the request body and parse the response body as JSON
    });
  }
}

module.exports = CbtApi;
