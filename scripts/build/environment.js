/**
 * @license
 * Copyright 2016 Google Inc.
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

/**
 * @fileoverview Provides an API to read and write environment variables and npm lifecycle events.
 */

'use strict';

// TODO: remove this class. this is only used for webpack.
// We should just use the built in Webpack production/development arguments.
class Environment {
  setBabelEnv() {
    const event = this.getNpmLifecycleEvent_();
    // TODO: Figure out if this `if` check should include all `test:*` targets.
    // See discussion on https://github.com/material-components/material-components-web/pull/2192#discussion_r166330231
    // for context.
    if (event === 'test' || event === 'test:watch') {
      process.env.BABEL_ENV = 'test';
    }
  }

  isDev() {
    return process.env.MDC_ENV === 'development';
  }

  isProd() {
    return process.env.MDC_ENV === 'production';
  }

  getNpmLifecycleEvent_() {
    return process.env.npm_lifecycle_event;
  }
}

module.exports = Environment;
