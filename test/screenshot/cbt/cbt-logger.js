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
}

module.exports = {CbtLogger, LOG_LEVELS};
