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

// Sanity tests to ensure the following:
// - Default adapters contain functions
// - All expected adapter functions are accounted for
// - Invoking any of the default methods does not throw an error.
// Every foundation test suite include this verification.
export function verifyDefaultAdapter(FoundationClass, expectedMethods) {
  const {defaultAdapter} = FoundationClass;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  // Test for equality without requiring that the array be in a specific order
  assert.deepEqual(methods.slice().sort(), expectedMethods.slice().sort());
  // Test default methods
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
}

// Returns an object that intercepts calls to an adapter method used to register event handlers, and adds
// it to that object where the key is the event name and the value is the function being used. This is the
// preferred way of testing interaction handlers.
//
// ```javascript
// test('#init adds a click listener which adds a "foo" class', (t) => {
//   const {foundation, mockAdapter} = setupTest();
//   const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
//   foundation.init();
//   handlers.click(/* you can pass event info in here */ {type: 'click'});
//   t.doesNotThrow(() => td.verify(mockAdapter.addClass('foo')));
//   t.end();
// });
// ```
//
// Note that `handlerCaptureMethod` _must_ have a signature of `(string, EventListener) => any` in order to
// be effective.
export function captureHandlers(adapter, handlerCaptureMethod) {
  const {isA} = td.matchers;
  const handlers = {};
  td.when(adapter[handlerCaptureMethod](isA(String), isA(Function))).thenDo((type, handler) => {
    handlers[type] = (evtInfo = {}) => handler(Object.assign({type}, evtInfo));
  });
  return handlers;
}
