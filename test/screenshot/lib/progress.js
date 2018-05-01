/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

class Progress {
  constructor({
    total = 0,
    running = 0,
    successful = 0,
    failed = 0,
    cancelled = 0,
  } = {}) {
    this.total = total;
    this.running = running;
    this.successful = successful;
    this.failed = failed;
    this.cancelled = cancelled;
  }

  get finished() {
    return this.successful + this.failed + this.cancelled;
  }

  get percent() {
    return this.total > 0 ? (100 * this.finished / this.total) : 0;
  }

  plus(otherProgress) {
    return new Progress({
      total: this.total + otherProgress.total,
      running: this.running + otherProgress.running,
      successful: this.successful + otherProgress.successful,
      failed: this.failed + otherProgress.failed,
      cancelled: this.cancelled + otherProgress.cancelled,
    });
  }

  static none() {
    return new Progress();
  }

  static enqueued(total) {
    return new Progress({total});
  }
}

module.exports = Progress;
