/*
 * Copyright 2018 Google Inc. All Rights Reserved.
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

'use strict';

/** @enum {string} */
const State = {
  /** Not yet started. */
  QUEUED: 'QUEUED',

  /** Currently in progress. */
  RUNNING: 'RUNNING',

  /** Finished (either successfully or with errors). */
  DONE: 'DONE',
};

/**
 * @typedef {{
 *   state: !State,
 *   run: function()
 * }}
 */
// eslint-disable-next-line no-unused-vars
let Entry;

/**
 * Native Promise-based parallel execution queue that allows up to `N` async functions to run "concurrently".
 * Once the concurrency limit is reached, functions are enqueued and run in FIFO order as space becomes available in the
 * "running" queue.
 *
 * @template Key
 */
class ParallelQueue {
  /**
   * @param {number} maxParallels
   */
  constructor({maxParallels}) {
    if (maxParallels <= 0) {
      throw new Error(`'maxParallels' must be greater than zero, but got '${maxParallels}'`);
    }

    if (maxParallels !== Math.floor(maxParallels)) {
      throw new Error(`'maxParallels' must be an integer, but got '${maxParallels}'`);
    }

    /**
     * @type {number}
     * @private
     */
    this.maxParallels_ = maxParallels;

    /**
     * @type {!Map<!Key, !Entry>}
     * @private
     */
    this.allEntries_ = new Map();
  }

  /**
   * Returns a native Promise that resolves when the given `uniqueId` gets placed into the "running" queue.
   * @param {!Key} uniqueId
   * @return {!Promise<!Key>}
   */
  async enqueue(uniqueId) {
    return new Promise((resolve) => {
      if (this.allEntries_.has(uniqueId)) {
        throw new Error(`Key '${uniqueId}' already exists in the queue`);
      }
      const entry = {
        state: State.QUEUED,
        run: () => {
          entry.state = State.RUNNING;
          resolve(uniqueId);
        },
      };
      this.allEntries_.set(uniqueId, entry);
      this.requeue_();
    });
  }

  /**
   * Removes the given `uniqueId` from the "running" queue and executes the next queued function.
   * @param {!Key} uniqueId
   */
  dequeue(uniqueId) {
    this.allEntries_.get(uniqueId).state = State.DONE;
    this.requeue_();
  }

  /**
   * Runs the next queued function IFF it's below the parallel execution limit. Otherwise, does nothing.
   * @private
   */
  requeue_() {
    const allEntries = Array.from(this.allEntries_.values());
    const queuedEntries = allEntries.filter((entry) => entry.state === State.QUEUED);
    const runningEntries = allEntries.filter((entry) => entry.state === State.RUNNING);

    console.log('ParallelQueue entries:', this.allEntries_);

    // No functions left to run.
    if (queuedEntries.length === 0) {
      return;
    }

    // We haven't hit the parallel execution limit yet, so run the first queued function.
    if (runningEntries.length < this.maxParallels_) {
      queuedEntries[0].run();
    }
  }
}

module.exports = ParallelQueue;
