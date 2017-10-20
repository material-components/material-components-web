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

const webdriver = require('selenium-webdriver');
const request = require('request');

class CbtSession {
  constructor({globalConfig, driver, sessionId} = {}) {
    this.globalConfig_ = globalConfig;
    this.driver_ = driver;
    this.sessionId_ = sessionId;
    this.hasQuit_ = false;
    this.catchErrors_();
  }

  get driver() {
    return this.driver_;
  }

  pass() {
    return this.setScore_('pass')
      .then(() => {
        this.log_('SUCCESSFULLY set score to "pass"');
      })
      .catch(() => {
        this.log_('FAILED to set score to "pass"');
      });
  }

  fail() {
    return this.setScore_('fail')
      .then((result) => {
        this.error_('SUCCESSFULLY set score to "fail"; setScore result = ', result);
      })
      .catch(() => {
        this.error_('FAILED to set score to "fail"; setScore result = ', result);
      });
  }

  quit() {
    // webdriver has built-in promise to use
    const deferred = webdriver.promise.defer();

    if (this.hasQuit_) {
      this.log_('Already quit driver; ignoring');
      deferred.fulfill();
      return deferred.promise;
    }

    this.log_('Quitting driver...');

    try {
      this.driver.quit();
      deferred.fulfill();
    } catch (e) {
      this.error_('Error: Unable to quit driver: ', e);
      deferred.rejected(e);
    }

    this.hasQuit_ = true;

    return deferred.promise;
  }

  takeSnapshot() {
    return this.rpc_({
      method: 'POST',
      uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_ + '/snapshots',
    });
  }

  waitFor(selector, timeoutInMs) {
    const by = webdriver.By.css(selector);
    const element = this.driver.findElement(by);
    timeoutInMs = timeoutInMs || 10000;

    return {
      toBePresent: () => {
        return this.driver.wait(webdriver.until.elementLocated(by), timeoutInMs);
      },
      toBeVisible: () => {
        return this.driver.wait(webdriver.until.elementIsVisible(element), timeoutInMs).then();
      },
    };
  }

  querySelector(selector) {
    return this.driver.findElement(webdriver.By.css(selector));
  }

  querySelectorAll(selector) {
    return this.driver.findElements(webdriver.By.css(selector));
  }

  mouseDown(elementOrSelector) {
    return this.performAction_('mouseDown', elementOrSelector);
  }

  mouseUp(elementOrSelector) {
    return this.performAction_('mouseUp', elementOrSelector);
  }

  click(elementOrSelector) {
    return this.performAction_('click', elementOrSelector);
  }

  performAction_(actionName, elementOrSelector) {
    const element = this.getElement_(elementOrSelector);
    const actions = this.driver.actions();
    return actions[actionName](element).perform();
  }

  getElement_(elementOrSelector) {
    return typeof elementOrSelector === 'string' ? this.querySelector(elementOrSelector) : elementOrSelector;
  }

  catchErrors_() {
    webdriver.promise.controlFlow().on('uncaughtException', (error) => this.handleWebDriverError_(error));
  }

  handleWebDriverError_(/* error */) {
    this.quit().then(() => this.fail());
  }

  setScore_(score) {
    return this.rpc_({
      method: 'PUT',
      uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_,
      body: {'action': 'set_score', 'score': score},
      json: true,
    });
  }

  rpc_(requestObject) {
    return this.driver.call(() => {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      request(
        requestObject,
        function(error, response, body) {
          if (error) {
            result.error = true;
            result.message = error;
          } else if (response.statusCode !== 200) {
            result.error = true;
            result.message = body;
          } else {
            result.error = false;
            result.message = 'success';
          }

          if (result.error) {
            deferred.rejected(result);
          } else {
            deferred.fulfill(result);
          }
        })
        .auth(this.globalConfig_.username, this.globalConfig_.authkey);

      return deferred.promise;
    });
  }

  log_(message, ...args) {
    console.log('');
    console.log(`>>> ${this.constructor.name}: ${this.sessionId_} - ${message}`, ...args);
    console.log('');
  }

  error_(message, ...args) {
    console.error('');
    console.error(`>>> ${this.constructor.name}: ${this.sessionId_} - ${message}`, ...args);
    console.error('');
  }
}

module.exports = {CbtSession};
