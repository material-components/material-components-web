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
import MDCLineRippleFoundation from '../../../packages/mdc-line-ripple/foundation';

const {cssClasses} = MDCLineRippleFoundation;

suite('MDCLineRippleFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCLineRippleFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCLineRippleFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCLineRippleFoundation, [
    'addClass', 'removeClass', 'hasClass', 'setStyle',
    'registerEventHandler', 'deregisterEventHandler',
  ]);
});

const setupTest = () => setupFoundationTest(MDCLineRippleFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`activate adds ${cssClasses.LINE_RIPPLE_ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.activate();
  td.verify(mockAdapter.addClass(cssClasses.LINE_RIPPLE_ACTIVE));
});

test(`deactivate adds ${cssClasses.LINE_RIPPLE_DEACTIVATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.deactivate();
  td.verify(mockAdapter.addClass(cssClasses.LINE_RIPPLE_DEACTIVATING));
});

test('opacity event after adding deactivating class triggers triggers removal of activation classes', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING)).thenReturn(true);
  const event = {
    propertyName: 'opacity',
  };

  foundation.init();
  foundation.handleTransitionEnd(event);
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING));
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE));
});

test(`non opacity transition event doesn't remove ${cssClasses.LINE_RIPPLE_DEACTIVATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING)).thenReturn(true);
  const event = {
    propertyName: 'not-opacity',
  };
  foundation.init();

  foundation.handleTransitionEnd(event);
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE), {times: 0});
});

test(`opacity transition event doesn't remove ${cssClasses.LINE_RIPPLE_DEACTIVATING} class if not deactivating`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.LINE_RIPPLE_DEACTIVATING)).thenReturn(false);
  const event = {
    propertyName: 'opacity',
  };
  foundation.init();
  foundation.handleTransitionEnd(event);
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_DEACTIVATING), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.LINE_RIPPLE_ACTIVE), {times: 0});
});

test('setRippleCenter sets style attribute', () => {
  const {foundation, mockAdapter} = setupTest();
  const transformOriginValue = 100;

  foundation.init();
  foundation.setRippleCenter(transformOriginValue);

  td.verify(mockAdapter.setStyle('transform-origin', td.matchers.isA(String)));
});
