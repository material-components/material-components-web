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
