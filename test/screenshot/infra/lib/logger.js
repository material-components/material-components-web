/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const colors = require('colors/safe');
const crypto = require('crypto');

const Duration = require('./duration');

/** @type {?Date} */
let lastDebugDate;

class Logger {
  constructor() {
    /**
     * @type {!Map<string, number>} Map of fold names to start times (number of milliseconds since the UNIX epoch).
     * @private
     */
    this.foldStartTimeMap_ = new Map();

    /**
     * @type {boolean}
     * @private
     */
    this.isTravis_ = process.env.TRAVIS === 'true';
  }

  /**
   * @return {!AnsiColor}
   */
  static get colors() {
    return colors;
  }

  /**
   * @param {string} foldId
   * @param {string} shortMessage
   */
  foldStart(foldId, shortMessage) {
    if (this.isTravis_) {
      const timerId = this.getFoldTimerId_(foldId);
      this.foldStartTimeMap_.set(foldId, Date.now());

      // Undocumented Travis CI job logging feature. See:
      // https://github.com/travis-ci/docs-travis-ci-com/issues/949#issuecomment-276755003
      // https://github.com/rspec/rspec-support/blob/5a1c6756a9d8322fc18639b982e00196f452974d/script/travis_functions.sh
      console.log(`travis_fold:start:${foldId}`);
      console.log(`travis_time:start:${timerId}`);
    }

    console.log(colors.bold.yellow(shortMessage));
    console.log(colors.reset(''));
  }

  /**
   * @param {string} foldId
   */
  foldEnd(foldId) {
    if (!this.isTravis_) {
      return;
    }

    // Undocumented Travis CI job logging feature. See:
    // https://github.com/travis-ci/docs-travis-ci-com/issues/949#issuecomment-276755003
    console.log(`travis_fold:end:${foldId}`);

    const startMs = this.foldStartTimeMap_.get(foldId);
    if (!startMs) {
      return;
    }

    const timerId = this.getFoldTimerId_(foldId);
    const startNanos = Duration.millis(startMs).toNanos();
    const finishNanos = Duration.millis(Date.now()).toNanos();
    const durationNanos = finishNanos - startNanos;

    // Undocumented Travis CI job logging feature. See:
    // https://github.com/rspec/rspec-support/blob/5a1c6756a9d8322fc18639b982e00196f452974d/script/travis_functions.sh
    console.log(`travis_time:end:${timerId}:start=${startNanos},finish=${finishNanos},duration=${durationNanos}`);
  }

  /**
   * @param {*} args
   */
  debug(...args) {
    const nowDate = new Date();
    if (!lastDebugDate) {
      lastDebugDate = nowDate;
    }

    const deltaMsFormatted = (nowDate - lastDebugDate).toLocaleString().padStart(7, ' ');
    lastDebugDate = nowDate;

    const deltaHumanPlain = `${deltaMsFormatted}ms`;
    const [, spaces, text] = /^(\s*)(\S+)$/.exec(deltaHumanPlain);
    const deltaHumanColor = spaces + colors.cyan(text);

    console.log(`[+${deltaHumanColor}]`, ...args);
  }

  /**
   * @param {*} args
   */
  log(...args) {
    console.log(...args);
  }

  /**
   * @param {*} args
   */
  info(...args) {
    console.info(...args);
  }

  /**
   * @param {*} args
   */
  warn(...args) {
    console.warn(...args);
  }

  /**
   * @param {*} args
   */
  error(...args) {
    console.error(...args);
  }

  /**
   * @param {string} foldId
   * @return {string}
   * @private
   */
  getFoldTimerId_(foldId) {
    const sha1Sum = crypto.createHash('sha1');
    sha1Sum.update(foldId);
    return sha1Sum.digest('hex').substr(0, 8);
  }
}

module.exports = Logger;
