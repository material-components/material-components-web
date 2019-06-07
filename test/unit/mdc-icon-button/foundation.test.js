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

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import {MDCIconButtonToggleFoundation} from '../../../packages/mdc-icon-button/foundation';

const {strings, cssClasses} = MDCIconButtonToggleFoundation;

suite('MDCIconButtonToggleFoundation');

test('exports strings', () => {
  assert.isTrue('strings' in MDCIconButtonToggleFoundation);
});

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCIconButtonToggleFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCIconButtonToggleFoundation, [
    'addClass', 'removeClass', 'hasClass', 'setAttr', 'notifyChange',
  ]);
});

const setupTest = () => setupFoundationTest(MDCIconButtonToggleFoundation);

test(`isOn is false if hasClass(${cssClasses.ICON_ON}) returns false`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ICON_ON)).thenReturn(false);
  assert.isFalse(foundation.isOn());
});

test(`isOn is true if hasClass(${cssClasses.ICON_ON}) returns true`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ICON_ON)).thenReturn(true);
  assert.isTrue(foundation.isOn());
});

test('#handleClick calls #toggle', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.toggle = td.func();
  foundation.handleClick();
  td.verify(foundation.toggle(), {times: 1});
});

test('#handleClick calls notifyChange', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ICON_ON)).thenReturn(true);
  foundation.init();
  foundation.handleClick();
  td.verify(mockAdapter.notifyChange({isOn: true}), {times: 1});
});

test('#toggle flips on', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.hasClass(cssClasses.ICON_ON)).thenReturn(true, false);

  foundation.toggle();
  td.verify(mockAdapter.removeClass(cssClasses.ICON_ON), {times: 1});
  foundation.toggle();
  td.verify(mockAdapter.addClass(cssClasses.ICON_ON), {times: 1});
});

test('#toggle accepts boolean argument denoting toggle state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.removeClass(cssClasses.ICON_ON), {times: 1});
  foundation.toggle(true);
  td.verify(mockAdapter.addClass(cssClasses.ICON_ON), {times: 1});
});

test('#toggle sets "aria-pressed" to true when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.toggle(true);
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'true'));
});

test('#toggle sets "aria-pressed" to false when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.toggle(false);
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'false'), {times: 1});
});
