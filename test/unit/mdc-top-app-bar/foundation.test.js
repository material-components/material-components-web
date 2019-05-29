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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {MDCTopAppBarBaseFoundation} from '../../../packages/mdc-top-app-bar/foundation';
import {cssClasses, numbers, strings} from '../../../packages/mdc-top-app-bar/constants';

suite('MDCTopAppBarBaseFoundation');

test('exports strings', () => {
  assert.isTrue('strings' in MDCTopAppBarBaseFoundation);
  assert.deepEqual(MDCTopAppBarBaseFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCTopAppBarBaseFoundation);
  assert.deepEqual(MDCTopAppBarBaseFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.isTrue('numbers' in MDCTopAppBarBaseFoundation);
  assert.deepEqual(MDCTopAppBarBaseFoundation.numbers, numbers);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTopAppBarBaseFoundation, [
    'hasClass', 'addClass', 'removeClass', 'setStyle', 'getTopAppBarHeight', 'notifyNavigationIconClicked',
    'getViewportScrollY', 'getTotalActionItems',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarBaseFoundation.defaultAdapter);

  const foundation = new MDCTopAppBarBaseFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('#handleNavigationClick emits a navigation event', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleNavigationClick();
  td.verify(mockAdapter.notifyNavigationIconClicked(), {times: 1});
});
