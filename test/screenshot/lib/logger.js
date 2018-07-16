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
const path = require('path');

/**
 * @typedef {(function(string):string|{
 *   enable: !CliColor,
 *   disable: !CliColor,
 *   strip: !CliColor,
 *   strip: !CliColor,
 *   black: !CliColor,
 *   red: !CliColor,
 *   green: !CliColor,
 *   yellow: !CliColor,
 *   blue: !CliColor,
 *   magenta: !CliColor,
 *   cyan: !CliColor,
 *   white: !CliColor,
 *   gray: !CliColor,
 *   grey: !CliColor,
 *   bgBlack: !CliColor,
 *   bgRed: !CliColor,
 *   bgGreen: !CliColor,
 *   bgYellow: !CliColor,
 *   bgBlue: !CliColor,
 *   bgMagenta: !CliColor,
 *   bgCyan: !CliColor,
 *   bgWhite: !CliColor,
 *   reset: !CliColor,
 *   bold: !CliColor,
 *   dim: !CliColor,
 *   italic: !CliColor,
 *   underline: !CliColor,
 *   inverse: !CliColor,
 *   hidden: !CliColor,
 *   strikethrough: !CliColor,
 *   rainbow: !CliColor,
 *   zebra: !CliColor,
 *   america: !CliColor,
 *   random: !CliColor,
 * })} CliColor
 */

class Logger {
  /**
   * @param {string} callerFilePath
   */
  constructor(callerFilePath) {
    /**
     * @type {string}
     * @private
     */
    this.id_ = path.basename(callerFilePath);

    /**
     * @type {?Logger}
     * @private
     */
    this.parent_ = null;

    /**
     * @type {!Array<!Logger>}
     * @private
     */
    this.children_ = [];

    /**
     * @type {!Map<string, number>}
     * @private
     */
    this.foldStartTimes_ = new Map();
  }

  /**
   * @return {!CliColor}
   */
  static get colors() {
    return colors;
  }

  /**
   * @param {string} id
   * @return {!Logger}
   */
  createChild(id) {
    const child = new Logger(id);
    this.addChild(child);
    return child;
  }

  /**
   * @param {!Logger} child
   */
  addChild(child) {
    child.parent_ = this;
    if (!this.children_.includes(child)) {
      this.children_.push(child);
    }
  }

  /**
   * @param {string} foldId
   * @param {string} shortMessage
   */
  foldStart(foldId, shortMessage) {
    const hash = this.getFoldHash_(foldId);
    const colorMessage = colors.bold.yellow(shortMessage);

    this.foldStartTimes_.set(foldId, Date.now());

    console.log('');
    if (this.isTravisJob_()) {
      // See https://github.com/travis-ci/docs-travis-ci-com/issues/949#issuecomment-276755003
      console.log(`travis_fold:start:${foldId}\n${colorMessage}`);
      console.log(`travis_time:start:${hash}`);
    } else {
      console.log(colorMessage);
    }
    console.log('');
  }

  /**
   * @param {string} foldId
   */
  foldEnd(foldId) {
    if (!this.isTravisJob_()) {
      return;
    }

    const hash = this.getFoldHash_(foldId);
    const startNanos = this.foldStartTimes_.get(foldId) * 1000;
    const finishNanos = Date.now() * 1000;
    const durationNanos = finishNanos - startNanos;

    // See https://github.com/travis-ci/docs-travis-ci-com/issues/949#issuecomment-276755003
    console.log(`travis_fold:end:${foldId}`);
    console.log(`travis_time:end:${hash}:start=${startNanos},finish=${finishNanos},duration=${durationNanos}`);
  }

  getFoldHash_(foldId) {
    const sha1Sum = crypto.createHash('sha1');
    sha1Sum.update(foldId);
    return sha1Sum.digest('hex').substr(0, 8);
  }

  /**
   * @param {!Array<*>} args
   */
  log(...args) {
    console.log(`[log][${this.id_}]`, ...args);
  }

  /**
   * @param {!Array<*>} args
   */
  info(...args) {
    console.info(`[${colors.blue('info')}][${this.id_}]`, ...args);
  }

  /**
   * @param {!Array<*>} args
   */
  warn(...args) {
    console.warn(`[${colors.yellow('warn')}][${this.id_}]`, ...args);
  }

  /**
   * @param {!Array<*>} args
   */
  error(...args) {
    console.error(`[${colors.bold.red('error')}][${this.id_}]`, ...args);
  }

  /**
   * @return {boolean}
   * @private
   */
  isTravisJob_() {
    return process.env.TRAVIS === 'true';
  }
}

module.exports = Logger;
