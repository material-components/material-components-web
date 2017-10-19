/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

const {CbtBrowserConfig} = require('./cbt-browser-config');
const {CbtFlow} = require('./cbt-flow');

const remoteHub = process.env.CBT_REMOTE_HUB || 'http://hub.crossbrowsertesting.com:80/wd/hub';
const username = process.env.CBT_USERNAME;
const authkey = process.env.CBT_AUTHKEY;
const build = process.env.CBT_BUILD || '7521e673f5e9c4faed464407840d1938a1366b80';

const globalConfig = {
  username,
  authkey,
  remoteHub,
  build: `[commit: ${build}]`,
  name: 'Button demo page',
};
const browsers = CbtBrowserConfig.all(globalConfig);

const cbtFlow = new CbtFlow({globalConfig, browsers});
cbtFlow.on('cbt:session-started', (session) => {
  session.driver.get('https://material-components-web.appspot.com/button.html');

  session.waitFor('.mdc-button').toBeVisible();
  session.takeSnapshot();

  session.mouseDown('.mdc-button');
  session.takeSnapshot();

  session.mouseUp('.mdc-button');
  session.takeSnapshot();

  session.driver.quit();
  session.pass().then(function(result) {
    console.log(`${session.sessionId_} - set score to pass; result = `, result);
  });
});
cbtFlow.start();
