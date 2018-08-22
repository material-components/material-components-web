/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
