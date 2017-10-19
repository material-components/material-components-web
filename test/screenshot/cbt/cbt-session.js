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
    this.catchErrors_();
  }

  get driver() {
    return this.driver_;
  }

  pass() {
    return this.setScore_('pass');
  }

  fail() {
    return this.setScore_('fail');
  }

  takeSnapshot() {
    return this.driver.call(() => {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      request.post(
        'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_ + '/snapshots',
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
          deferred.fulfill(result);
        })
        .auth(this.globalConfig_.username, this.globalConfig_.authkey);

      return deferred.promise;
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

  mouseDown(selector) {
    return this.driver.actions().mouseDown(this.querySelector(selector)).perform();
  }

  mouseUp(selector) {
    return this.driver.actions().mouseUp(this.querySelector(selector)).perform();
  }

  catchErrors_() {
    webdriver.promise.controlFlow().on('uncaughtException', (error) => this.handleWebDriverError_(error));
  }

  handleWebDriverError_(/* error */) {
    this.driver.quit();
    this.fail().then((result) => {
      console.error(`${this.sessionId_} - set score to fail; result = `, result);
    });
  }

  setScore_(score) {
    return this.driver.call(() => {
      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      request(
        {
          method: 'PUT',
          uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_,
          body: {'action': 'set_score', 'score': score},
          json: true,
        },
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

          deferred.fulfill(result);
        })
        .auth(this.globalConfig_.username, this.globalConfig_.authkey);

      return deferred.promise;
    });
  }
}

module.exports = {CbtSession};
