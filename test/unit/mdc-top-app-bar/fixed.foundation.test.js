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

import td from 'testdouble';

import {MDCFixedTopAppBarFoundation} from '../../../packages/mdc-top-app-bar/fixed/foundation';
import {MDCTopAppBarFoundation} from '../../../packages/mdc-top-app-bar/standard/foundation';

suite('MDCFixedTopAppBarFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);

  const foundation = new MDCFixedTopAppBarFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('#handleTargetScroll calls #adapter.getViewportScrollY', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTargetScroll();
  // twice because it is called once in the standard foundation
  td.verify(mockAdapter.getViewportScrollY(), {times: 2});
});

test('#handleTargetScroll calls #adapter.addClass if adapter.getViewportScrollY > 0', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.handleTargetScroll();
  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS), {times: 1});
});

test('#handleTargetScroll calls #adapter.removeClass if ' +
'adapter.getViewportScrollY < 0 but had just scrolled down', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.handleTargetScroll();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(-1);
  foundation.handleTargetScroll();
  td.verify(mockAdapter.removeClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS), {times: 1});
});

test('#handleTargetScroll does not call #adapter.removeClass if was not scrolled yet', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(-1);
  foundation.handleTargetScroll();
  td.verify(mockAdapter.removeClass(td.matchers.isA(String)), {times: 0});
});

test('#handleTargetScroll calls #adapter.addClass only once if it already scrolled', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.handleTargetScroll();
  foundation.handleTargetScroll();
  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS), {times: 1});
});
