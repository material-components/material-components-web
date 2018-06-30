/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import * as pony from './ponyfill.js';

/**
 * Simplifies iterating over an object's own enumerable, non-prototype properties.
 * @param {!Object} obj
 * @param {function(value:*, key:*, i:number, pair:!Array<*>)} func
 */
export function objectForEach(obj, func) {
  pony.objectEntries(obj).forEach(([key, value], i, pair) => func(value, key, i, pair));
}

/**
 * Returns a function that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for `waitInMs` milliseconds.
 * If `runImmediately` is `true`, the function will be triggered on the leading edge, instead of the trailing.
 *
 * From https://davidwalsh.name/javascript-debounce-function (MIT license).
 *
 * @param {function(...args)} func
 * @param {number=} waitInMs
 * @param {boolean=} runImmediately
 * @return {function(...args)}
 */
export function debounce(func, waitInMs = 300, runImmediately = false) {
  let timeout;

  return function(...args) {
    const callNow = runImmediately && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!runImmediately) {
        func(...args);
      }
    }, waitInMs);

    if (callNow) {
      func(...args);
    }
  };
}
