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

const LOG_LEVELS = {
  info: 1,
  log: 2,
  warn: 3,
  error: 4,
};

const ENV_LOG_LEVEL_KEY = process.env.CBT_LOG_LEVEL;
const DEFAULT_LOG_LEVEL = ENV_LOG_LEVEL_KEY ? LOG_LEVELS[ENV_LOG_LEVEL_KEY] : LOG_LEVELS.log;

// TODO(acdvorak): Switch to NLog's Appender/Logger paradigm
class CbtLogger {
  constructor(caller, level = DEFAULT_LOG_LEVEL) {
    this.name_ = typeof caller === 'string' ? caller : caller.constructor.name;
    this.level_ = level;
  }

  info(message, ...args) {
    if (this.level_ > LOG_LEVELS.info) {
      return;
    }
    console.info(`>>> INFO(${this.name_}) - ${message}`, ...args);
  }

  log(message, ...args) {
    if (this.level_ > LOG_LEVELS.log) {
      return;
    }
    console.log(`>>> LOG(${this.name_}) - ${message}`, ...args);
  }

  warn(message, ...args) {
    if (this.level_ > LOG_LEVELS.warn) {
      return;
    }
    console.warn(`>>> WARN(${this.name_}) - ${message}`, ...args);
  }

  error(message, ...args) {
    if (this.level_ > LOG_LEVELS.error) {
      return;
    }
    console.error(`>>> ERROR(${this.name_}) - ${message}`, ...args);
  }

  static prettifyArgs(...args) {
    let prevWasUndefined = true;

    const prettyArgs = args
      .reverse()
      .filter((value) => {
        if (prevWasUndefined && typeof value === 'undefined') {
          prevWasUndefined = true;
          return false;
        }
        return true;
      })
      .reverse()
      .map((value) => {
        if (value instanceof webdriver.WebElement ||
            value instanceof webdriver.WebElementPromise ||
            value instanceof webdriver.promise.Promise ||
            value instanceof webdriver.promise.Thenable ||
            value instanceof webdriver.ThenableWebDriver) {
          return value.constructor.name;
        }
        if (value.browserName) {
          const browser = {};
          [
            'platform',
            'platformName',
            'platformVersion',
            'browserName',
            'version',
            'deviceName',
            'deviceOrientation',
          ].forEach((key) => {
            if (value[key]) {
              browser[key] = value[key];
            }
          });
          return browser;
        }
        return value;
      });

    // "[1,2,3]" -> "1,2,3"
    return JSON.stringify(prettyArgs).replace(/^\[|]$/g, '');
  }
}

module.exports = {CbtLogger, LOG_LEVELS};
