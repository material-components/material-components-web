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

const EventEmitter = require('events');
const webdriver = require('selenium-webdriver');
const {Duration} = require('./duration');
const {CbtLogger} = require('./cbt-logger');
const {CbtSession} = require('./cbt-session');

const TIMEOUT = Duration.minutes(1);
const TIMEOUT_MS = TIMEOUT.totalMilliseconds();
const TIMEOUT_STR = TIMEOUT.toString();

class CbtFlow extends EventEmitter {
  constructor({globalConfig, browsers} = {}) {
    super();
    this.logger_ = CbtLogger.newBuilder().name(this).build();
    this.globalConfig_ = globalConfig;
    this.browsers_ = browsers;
  }

  start() {
    // eslint-disable-next-line no-unused-vars
    const flows = this.browsers_.map((browser) => {
      return webdriver.promise.createFlow((flow) => {
        this.catchErrors_(flow);

        const browserDescription = CbtLogger.browserDescription(browser);
        this.log_(`Connecting to the CrossBrowserTesting remote server; requesting browser [${browserDescription}]...`);
        this.emit('cbt:session:starting');

        const driver = new webdriver.Builder()
          .usingServer(this.globalConfig_.remoteHub)
          .withCapabilities(browser)
          .build();

        // All driver calls are automatically queued by flow control.
        // Async functions outside of driver can use call() function.
        this.log_('Waiting on the browser to be launched and the session to start...');

        let session;
        let timer;
        let timedOut = false;

        const stopTimeout = () => {
          clearTimeout(timer);
          if (timedOut) {
            this.error_(`Session timed out due to inactivity after ${TIMEOUT_STR}`);
          }
        };

        const resetTimeout = () => {
          stopTimeout();
          timer = setTimeout(() => {
            timedOut = true;
            session.quit();
          }, TIMEOUT_MS);
        };

        driver.getSession()
          .then((sessionData) => {
            const sessionId = sessionData.id_;
            session = new CbtSession({
              globalConfig: this.globalConfig_,
              driver,
              sessionId,
              browser,
            });

            this.log_(`Session started! https://app.crossbrowsertesting.com/selenium/${sessionId}`);
            this.emit('cbt:session:started', session);

            resetTimeout();
            session.on('cbt:rpc:enqueue', resetTimeout);
            session.on('cbt:rpc:dequeue', resetTimeout);
            session.on('cbt:rpc:response', resetTimeout);
            session.on('cbt:session:quit', stopTimeout);
          })
          .catch((error) => {
            stopTimeout();
            this.handleWebDriverError_(error, session);
          });
      });
    });
  }

  catchErrors_(flow) {
    flow.on('uncaughtException', (error) => this.handleWebDriverError_(error));
  }

  handleWebDriverError_(error, session) {
    this.error_('WebDriver error:', error);

    if (session) {
      session.quit();
    }

    this.emit('cbt:error', error);
  }

  info_(message, ...args) {
    this.logger_.info(message, ...args);
  }

  log_(message, ...args) {
    this.logger_.log(message, ...args);
  }

  warn_(message, ...args) {
    this.logger_.warn(message, ...args);
  }

  error_(message, ...args) {
    this.logger_.error(message, ...args);
  }
}

module.exports = {CbtFlow};
