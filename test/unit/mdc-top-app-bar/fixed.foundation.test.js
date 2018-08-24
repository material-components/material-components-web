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

import MDCFixedTopAppBarFoundation from '../../../packages/mdc-top-app-bar/fixed/foundation';
import MDCTopAppBarFoundation from '../../../packages/mdc-top-app-bar/foundation';
import {createMockRaf} from '../helpers/raf';

suite('MDCFixedTopAppBarFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);

  const foundation = new MDCFixedTopAppBarFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

const createMockHandlers = (foundation, mockAdapter, mockRaf) => {
  let scrollHandler;
  td.when(mockAdapter.registerScrollHandler(td.matchers.isA(Function))).thenDo((fn) => {
    scrollHandler = fn;
  });

  foundation.init();
  mockRaf.flush();
  td.reset();
  return {scrollHandler};
};

test('fixed top app bar: scroll listener is registered on init', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.FIXED_CLASS)).thenReturn(true);
  foundation.init();
  td.verify(mockAdapter.registerScrollHandler(td.matchers.isA(Function)), {times: 1});
});

test('fixed top app bar: scroll listener is removed on destroy', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.FIXED_CLASS)).thenReturn(true);
  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterScrollHandler(td.matchers.isA(Function)), {times: 1});
});

test('fixed top app bar: class is added once when page is scrolled from the top', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.FIXED_CLASS)).thenReturn(true);
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS)).thenReturn(false);
  td.when(mockAdapter.getTotalActionItems()).thenReturn(0);
  td.when(mockAdapter.getViewportScrollY()).thenReturn(0);

  const {scrollHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);

  scrollHandler();
  scrollHandler();

  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS), {times: 1});
});

test('fixed top app bar: class is removed once when page is scrolled to the top', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.FIXED_CLASS)).thenReturn(true);
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS)).thenReturn(false);
  td.when(mockAdapter.getTotalActionItems()).thenReturn(0);

  const {scrollHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);
  // Apply the scrolled class
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  scrollHandler();

  // Test removing it
  td.when(mockAdapter.getViewportScrollY()).thenReturn(0);
  scrollHandler();
  scrollHandler();

  td.verify(mockAdapter.removeClass(MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS), {times: 1});
});
