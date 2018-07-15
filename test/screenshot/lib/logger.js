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
const path = require('path');

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
    const colorMessage = colors.yellow(shortMessage);
    if (this.isTravisJob_()) {
      // See https://github.com/travis-ci/docs-travis-ci-com/issues/949#issuecomment-276755003
      console.log(`travis_fold:start:${foldId}\n${colorMessage}`);
    } else {
      console.log(colorMessage);
    }
  }

  /**
   * @param {string} foldId
   */
  foldEnd(foldId) {
    if (!this.isTravisJob_()) {
      return;
    }

    // See https://github.com/travis-ci/docs-travis-ci-com/issues/949#issuecomment-276755003
    console.log(`travis_fold:end:${foldId}`);
  }

  log(...args) {
    console.log(args);
  }

  info() {}
  warn() {}
  error() {}

  /**
   * @return {boolean}
   * @private
   */
  isTravisJob_() {
    return process.env.TRAVIS === 'true';
  }
}

module.exports = Logger;
