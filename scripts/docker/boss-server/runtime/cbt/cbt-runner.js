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

class CbtRunner {
  constructor({pr, author, commit, host} = {}) {
    this.pr_ = pr;
    this.author_ = author;
    this.commit_ = commit;
    this.host_ = host;
  }

  run() {
    const globalConfig = {
      username,
      authkey,
      remoteHub,
      build: `[${this.commit_.substr(0, 7)}]`,
      name: `PR #${this.pr_} by ${this.author_}`,
    };
    const browsers = CbtBrowserConfig.allBrowsers(globalConfig);

    const cbtFlow = new CbtFlow({globalConfig, browsers});
    cbtFlow.on('cbt:session:started', (session) => {
      // TODO(acdvorak): TLS

      session.navigate(`http://${this.host_}/info/`);
      session.takeSnapshot();

      session.navigate(`http://${this.host_}/button.html`);

      session.waitFor('.mdc-button').toBeVisible();
      session.takeSnapshot();

      session.interact((command) => {
        command.mouseDown('.mdc-button');
        session.takeSnapshot();

        command.mouseMove('.mdc-button--raised');
        command.mouseUp();
        session.takeSnapshot();

        command.sendKeys('\t');
        session.wait(1000);
        command.sendKeys(command.ModifierKey.SHIFT, '\t', command.ModifierKey.SHIFT);
        session.wait(1000);
        command.sendKeys('\t');
        session.wait(1000);
        session.takeSnapshot();
      });

      // Because all driver actions are async, this function will always be called.
      // However, it will only be executed if all previous driver commands succeed.
      session.pass();
    });

    cbtFlow.start();
  }
}

module.exports = {CbtRunner};
