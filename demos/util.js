/**
 * @license
 * Copyright 2017 Google Inc.
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
