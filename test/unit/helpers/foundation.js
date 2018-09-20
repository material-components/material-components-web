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

import {assert} from 'chai';
import td from 'testdouble';

/**
 * Sanity tests to ensure the following:
 * - Default adapters contain functions
 * - All expected adapter functions are accounted for
 * - Invoking any of the default methods does not throw an error.
 * Every foundation test suite include this verification.
 * @param {!F.} FoundationClass
 * @param {!Array<string>} expectedMethodNames
 * @template F
 */
export function verifyDefaultAdapter(FoundationClass, expectedMethodNames) {
  const {defaultAdapter} = FoundationClass;
  const adapterKeys = Object.keys(defaultAdapter);
  const actualMethodNames = adapterKeys.filter((key) => typeof defaultAdapter[key] === 'function');

  assert.equal(actualMethodNames.length, adapterKeys.length, 'Every adapter key must be a function');

  // Test for equality without requiring that the array be in a specific order
  const actualArray = actualMethodNames.slice().sort();
  const expectedArray = expectedMethodNames.slice().sort();
  assert.deepEqual(actualArray, expectedArray, getUnequalArrayMessage(actualArray, expectedArray));

  // Test default methods
  actualMethodNames.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
}

/**
 * Returns an object that intercepts calls to an adapter method used to register event handlers, and adds
 * it to that object where the key is the event name and the value is the function being used. This is the
 * preferred way of testing interaction handlers.
 *
 * ```javascript
 * test('#init adds a click listener which adds a "foo" class', (t) => {
 *   const {foundation, mockAdapter} = setupTest();
 *   const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
 *   foundation.init();
 *   handlers.click(/* you can pass event info in here *\/ {type: 'click'});
 *   t.doesNotThrow(() => td.verify(mockAdapter.addClass('foo')));
 *   t.end();
 * });
 * ```
 *
 * Note that `handlerCaptureMethodName` _must_ have a signature of `(string, EventListener) => any` in order to
 * be effective.
 *
 * @param {!A} adapter
 * @param {string} handlerCaptureMethodName
 * @template A
 */
export function captureHandlers(adapter, handlerCaptureMethodName) {
  const {isA} = td.matchers;
  const handlers = {};
  td.when(adapter[handlerCaptureMethodName](isA(String), isA(Function))).thenDo((type, handler) => {
    handlers[type] = (evtInfo = {}) => handler(Object.assign({type}, evtInfo));
  });
  return handlers;
}

/**
 * @param {!Array<string>} actualArray
 * @param {!Array<string>} expectedArray
 * @return {string}
 */
function getUnequalArrayMessage(actualArray, expectedArray) {
  /**
   * @param {!Array<string>} values
   * @param {string} singularName
   * @return {string}
   */
  const format = (values, singularName) => {
    const count = values.length;
    if (count === 0) {
      return '';
    }
    const plural = count === 1 ? '' : 's';
    const str = values.join(', ');
    return `${count} ${singularName}${plural}: ${str}`;
  };

  /**
   * @param {!Set<string>} actualSet
   * @param {!Set<string>} expectedSet
   * @return {string}
   */
  const getAddedStr = (actualSet, expectedSet) => {
    const addedArray = [];
    actualSet.forEach((val) => {
      if (!expectedSet.has(val)) {
        addedArray.push(val);
      }
    });
    return format(addedArray, 'unexpected method');
  };

  /**
   * @param {!Set<string>} actualSet
   * @param {!Set<string>} expectedSet
   * @return {string}
   */
  const getRemovedStr = (actualSet, expectedSet) => {
    const removedArray = [];
    expectedSet.forEach((val) => {
      if (!actualSet.has(val)) {
        removedArray.push(val);
      }
    });
    return format(removedArray, 'missing method');
  };

  /**
   * @param {!Array<string>} array
   * @return {!Set<string>}
   */
  const toSet = (array) => {
    const set = new Set();
    array.forEach((value) => set.add(value));
    return set;
  };

  const actualSet = toSet(actualArray);
  const expectedSet = toSet(expectedArray);
  const addedStr = getAddedStr(actualSet, expectedSet);
  const removedStr = getRemovedStr(actualSet, expectedSet);
  const messages = [addedStr, removedStr].filter((val) => val.length > 0);

  if (messages.length === 0) {
    return '';
  }

  return `Found ${messages.join('; ')}`;
}
