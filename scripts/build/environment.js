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

  /**
   * Returns the TCP port number to use when running a local development server.
   * @return {number}
   */
  getPort() {
    const argv = this.getCliArgs();
    return argv.env.mdc_port;
  }

  /**
   * Parses all command line arguments passed to the `webpack` binary and returns them as an object map.
   *
   * If an argument has a default value and is left unspecified on the command line, the default value will be returned.
   *
   * MDC-specific arguments may need to be preceded by one or more standalone `--` separator args, depending on the
   * calling depth.
   *
   * For example:
   *   - `webpack --watch --env.mdc_port=8091` (no `--` separator)
   *   - `npm run dev:next -- --env.mdc_port=8091` (one `--` separator)
   *
   * @return {!Object<string, *>}
   */
  getCliArgs() {
    // The first two argv slots contain the path to the `node` binary and the path to the main JS file, so we skip them.
    const parsedArgs = this.minimistLib_(process.argv.slice(2), {
      default: this.getDefaultCliArgs_(),
    });
    console.log('parsedArgs:', parsedArgs);
    return parsedArgs;
  }

  /**
   * @return {!Object<string, *>}
   * @private
   */
  getDefaultCliArgs_() {
    return {
      env: {
        mdc_port: 8090,
      },
    };
  }

  /**
   * @return {string}
   * @private
   */
  getNpmLifecycleEvent_() {
    return process.env.npm_lifecycle_event;
  }
}

module.exports = Environment;
