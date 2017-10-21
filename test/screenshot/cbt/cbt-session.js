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

const request = require('request');
const webdriver = require('selenium-webdriver');
const {CbtLogger} = require('./cbt-logger');

const promiseFulfill = function(...args) {
  return webdriver.promise.Promise.resolve(...args);
};

const promiseReject = function(...args) {
  return webdriver.promise.Promise.reject(...args);
};

class CbtSession {
  constructor({globalConfig, driver, sessionId, browser} = {}) {
    this.logger_ = new CbtLogger(this);
    this.globalConfig_ = globalConfig;
    this.driver_ = driver;
    this.sessionId_ = sessionId;
    this.browser_ = browser;
    this.hasQuit_ = false;
    this.score_ = null;
    this.catchErrors_();
  }

  enqueue(callback) {
    if (this.hasQuit_) {
      this.info_('Unable to enqueue driver command: Driver has already quit (1)');
      return promiseReject('FROM enqueue(1)');
    }
    return this.driver_.call(() => {
      if (this.hasQuit_) {
        this.info_('Unable to execute driver command: Driver has already quit (2)');
        // TODO(acdvorak): Figure out why this triggers CbtFlow#handleWebDriverError_
        return promiseReject('FROM enqueue(2)');
      }
      return callback(this.driver_);
    });
  }

  navigate(uri) {
    return this.enqueue((driver) => driver.get(uri));
  }

  pass() {
    return this.setScore_('pass')
      .then((result) => {
        this.log_('SUCCESSFULLY set score to "pass"; setScore result = ', result);
      })
      .catch((result) => {
        this.error_('FAILED to set score to "pass"; setScore result = ', result);
      })
      .finally(() => this.quit());
  }

  fail() {
    return this.setScore_('fail')
      .then((result) => {
        this.error_('SUCCESSFULLY set score to "fail"; setScore result = ', result);
      })
      .catch((result) => {
        this.error_('FAILED to set score to "fail"; setScore result = ', result);
      })
      .finally(() => this.quit());
  }

  quit() {
    if (this.hasQuit_) {
      this.info_('Driver already quit; ignoring');
      return promiseFulfill('FROM quit(1)');
    }

    this.info_('Quitting driver...');
    this.hasQuit_ = true;

    try {
      this.driver_.quit();
      return promiseFulfill('FROM quit(2)');
    } catch (e) {
      this.error_('Error: Unable to quit driver: ', e);
      return promiseReject(e);
    }
  }

  takeSnapshot() {
    return this.rpc_({
      method: 'POST',
      uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_ + '/snapshots',
    });
  }

  waitFor(selector, timeoutInMs = 10000) {
    const by = webdriver.By.css(selector);

    const wait = {
      toBePresent: () => {
        if (this.hasQuit_) {
          this.info_('Unable to wait for element toBePresent(): Driver has already quit');
          return promiseReject('FROM waitFor(1)');
        }
        return this.driver_.wait(webdriver.until.elementLocated(by), timeoutInMs);
      },
      toBeVisible: () => {
        return wait.toBePresent().then(() => {
          if (this.hasQuit_) {
            this.info_('Unable to wait for element toBeVisible(): Driver has already quit');
            return promiseReject('FROM waitFor(2)');
          }
          return this.driver_.wait(webdriver.until.elementIsVisible(this.driver_.findElement(by)), timeoutInMs);
        });
      },
    };

    return wait;
  }

  querySelector(selector) {
    if (this.hasQuit_) {
      this.info_('Unable to execute querySelector(): Driver has already quit');
      return promiseReject('FROM querySelector()');
    }
    return this.driver_.findElement(webdriver.By.css(selector));
  }

  querySelectorAll(selector) {
    if (this.hasQuit_) {
      this.info_('Unable to execute querySelectorAll(): Driver has already quit');
      return promiseReject('FROM querySelectorAll()');
    }
    return this.driver_.findElements(webdriver.By.css(selector));
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
    if (this.hasQuit_) {
      this.info_(`Unable to execute performAction_(${actionName}, ${elementOrSelector}): Driver has already quit`);
      return promiseReject('FROM performAction_()');
    }
    const element = this.getElement_(elementOrSelector);
    const actions = this.driver_.actions();
    return actions[actionName](...args).perform().catch(() => this.quit());
  }

  getElement_(elementOrSelector) {
    return typeof elementOrSelector === 'string' ? this.querySelector(elementOrSelector) : elementOrSelector;
  }

  setScore_(score) {
    if (score === this.score_) {
      this.warn_(`Score was already set to '${this.score_}'; ignoring`);
      return promiseReject('FROM setScore_(1)');
    }

    if (this.score_ === 'fail') {
      this.warn_(`Unable to set score to '${score}': It was already set to '${this.score_}'`);
      return promiseReject('FROM setScore_(2)');
    }

    this.score_ = score;

    this.info_(`Enqueueing RPC to setScore('${score}')...`);

    return this.rpc_({
      method: 'PUT',
      uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + this.sessionId_,
      body: {'action': 'set_score', 'score': score},
      json: true,
    });
  }

  rpc_(requestObject) {
    const debugId = `rpc_(${requestObject.uri}, ${JSON.stringify(requestObject.body)})`;

    return this.enqueue(() => {
      if (this.hasQuit_) {
        this.info_(`Unable to execute ${debugId}: Driver has already quit`);
        return;
      }

      // webdriver has built-in promise to use
      const deferred = webdriver.promise.defer();
      const result = {error: false, message: null};

      request(
        requestObject,
        (error, response, body) => {
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
            this.info_(`About to call deferred.reject(${JSON.stringify(result)}) in ${debugId}`);
            deferred.reject(result);
          } else {
            this.info_(`About to call deferred.fulfill(${JSON.stringify(result)}) in ${debugId}`);
            deferred.fulfill(result);
          }
        })
        .auth(this.globalConfig_.username, this.globalConfig_.authkey);

      return deferred.promise;
    });
  }

  catchErrors_() {
    webdriver.promise.controlFlow().on('uncaughtException', (error) => this.handleWebDriverError_(error));
  }

  handleWebDriverError_(/* error */) {
    this.quit();
  }

  info_(message, ...args) {
    this.logger_.info(`[${this.sessionId_}] - ${message}`, ...args);
  }

  log_(message, ...args) {
    this.logger_.log(`[${this.sessionId_}] - ${message}`, ...args);
  }

  warn_(message, ...args) {
    this.logger_.warn(`[${this.sessionId_}] - ${message}`, ...args);
  }

  error_(message, ...args) {
    this.logger_.error(`[${this.sessionId_}] - ${message}`, ...args);
  }
}

module.exports = {CbtSession};
