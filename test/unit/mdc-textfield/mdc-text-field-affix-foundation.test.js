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
import {MDCTextFieldAffixFoundation} from '../../../packages/mdc-textfield/affix';
import {cssClasses, strings} from '../../../packages/mdc-textfield/affix/constants';

suite('MDCTextFieldAffixFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCTextFieldAffixFoundation.cssClasses, cssClasses);
});

test('exports strings', () => {
  assert.deepEqual(MDCTextFieldAffixFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldAffixFoundation, [
    'getWidth', 'addClass', 'removeClass', 'hasClass', 'isRtl',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldAffixFoundation);

test('istanbul code coverage', () => {
  assert.doesNotThrow(() => new MDCTextFieldAffixFoundation());
});

test('#setVisible toggles the visible class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setVisible(true);
  td.verify(mockAdapter.addClass(cssClasses.AFFIX_VISIBLE));
  foundation.setVisible(false);
  td.verify(mockAdapter.removeClass(cssClasses.AFFIX_VISIBLE));
});

function setupMocks(mockAdapter, prefix, isRtl) {
  td.when(mockAdapter.getWidth()).thenReturn(0);
  td.when(mockAdapter.hasClass(cssClasses.PREFIX)).thenReturn(prefix);
  td.when(mockAdapter.hasClass(cssClasses.SUFFIX)).thenReturn(!prefix);
  td.when(mockAdapter.isRtl()).thenReturn(isRtl);
}

test('#getInputPadding returns left padding for prefix, not rtl', () => {
  const {foundation, mockAdapter} = setupTest();
  setupMocks(mockAdapter, true, false);
  const {property} = foundation.getInputPadding();
  assert.equal(property, 'padding-left');
});

test('#getInputPadding returns right padding for prefix, rtl', () => {
  const {foundation, mockAdapter} = setupTest();
  setupMocks(mockAdapter, true, true);
  const {property} = foundation.getInputPadding();
  assert.equal(property, 'padding-right');
});

test('#getInputPadding returns right padding for suffix, not rtl', () => {
  const {foundation, mockAdapter} = setupTest();
  setupMocks(mockAdapter, false, false);
  const {property} = foundation.getInputPadding();
  assert.equal(property, 'padding-right');
});

test('#getInputPadding returns left padding for suffix, rtl', () => {
  const {foundation, mockAdapter} = setupTest();
  setupMocks(mockAdapter, false, true);
  const {property} = foundation.getInputPadding();
  assert.equal(property, 'padding-left');
});

test('#getInputPadding returns a value of width + px', () => {
  const {foundation, mockAdapter} = setupTest();
  setupMocks(mockAdapter, true, true);
  const {value} = foundation.getInputPadding();
  assert.equal(value, '0px');
});
