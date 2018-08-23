/**
 * @license
 * Copyright 2018 Google Inc.
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
import MDCListItemFoundation from '../../../packages/mdc-list/list-item/foundation';
import {strings, cssClasses} from '../../../packages/mdc-list/list-item/constants';

suite('MDCListItemFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCListItemFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCListItemFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCListItemFoundation, [
    'setTabIndexForChildren', 'hasClass',
  ]);
});

const setupTest = () => setupFoundationTest(MDCListItemFoundation);

test('#handleFocusIn switches list item button/a elements to tabindex=0', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LIST_ITEM_DISABLED_CLASS)).thenReturn(false);

  foundation.handleFocusIn();
  td.verify(mockAdapter.setTabIndexForChildren(0));
});

test('#handleFocusIn does not switch list item button/a elements to tabindex=0 if item is disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LIST_ITEM_DISABLED_CLASS)).thenReturn(true);

  foundation.handleFocusIn();
  td.verify(mockAdapter.setTabIndexForChildren(0), {times: 0});
});

test('#handleFocusOut switches list item button/a elements to tabindex=-1', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleFocusOut();
  td.verify(mockAdapter.setTabIndexForChildren(-1));
});
