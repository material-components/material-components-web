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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCNotchedOutlineFoundation from '../../../packages/mdc-notched-outline/foundation';

const {cssClasses, numbers, strings} = MDCNotchedOutlineFoundation;

suite('MDCNotchedOutlineFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCNotchedOutlineFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCNotchedOutlineFoundation.numbers, numbers);
});

test('exports strings', () => {
  assert.deepEqual(MDCNotchedOutlineFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCNotchedOutlineFoundation, [
    'addClass', 'removeClass', 'setNotchWidthProperty',
  ]);
});

const setupTest = () => setupFoundationTest(MDCNotchedOutlineFoundation);

test('#notch adds the notched class and sets the width of the element', () => {
  const {foundation, mockAdapter} = setupTest();
  const notchWidth = 30;
  foundation.notch(notchWidth);
  td.verify(mockAdapter.setNotchWidthProperty(notchWidth + MDCNotchedOutlineFoundation.numbers.NOTCH_ELEMENT_PADDING));
  td.verify(mockAdapter.addClass(MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED));
});

test('#closeNotch removes the notch selector and resets the width to 0', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.closeNotch();
  td.verify(mockAdapter.removeClass(MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED));
  td.verify(mockAdapter.setNotchWidthProperty(0));
});
