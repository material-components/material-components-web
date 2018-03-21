/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

/**
 * @fileoverview Provides an API to read and write environment variables and npm lifecycle events.
 */

'use strict';

const minimist = require('minimist');

class Environment {
  constructor({minimistLib = minimist} = {}) {
    this.minimistLib_ = minimistLib;
  }

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
    return process.env.NODE_ENV === 'development';
  }

  isProd() {
    return process.env.NODE_ENV === 'production';
  }

  getPort() {
    const argv = this.getAllCliArgs();
    return argv['mdc-port'];
  }

  /**
   * Parses all command line arguments passed to the `webpack` binary, including those after any number of `--` params.
   * To pass MDC-specific CLI args, you'll need to precede them by one or more `--`, depending on the calling depth.
   * For example:
   *   - `webpack --watch -- --mdc-port=8091` (one `--` separator)
   *   - `npm run dev -- -- --mdc-port=8091` (two `--` separators)
   * @return {!Object<string, *>}
   */
  getAllCliArgs() {
    return this.minimistLib_(process.argv.slice(2).filter((arg) => arg !== '--'), {
      default: {
        // TODO(acdvorak): I don't like having a default value in two places (both here and in `StaticServer.start()`).
        // Defining it here would be useful if we had a `--help` option.
        // Defining it in StaticServer makes unit tests easier (does it tho?)
        'mdc-port': 8090,
      },
    });
  }

  getNpmLifecycleEvent_() {
    return process.env.npm_lifecycle_event;
  }
}

module.exports = Environment;
