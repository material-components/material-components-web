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
import {assert} from 'chai';

import {MDCShortTopAppBarFoundation} from '../../../packages/mdc-top-app-bar/short/foundation';
import {MDCTopAppBarFoundation} from '../../../packages/mdc-top-app-bar/standard/foundation';

suite('MDCShortTopAppBarFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);

  const foundation = new MDCShortTopAppBarFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('short top app bar: scrollHandler calls #adapter.getViewportScrollY', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.handleScroll();
  // called twice because its called once in the standard foundation
  td.verify(mockAdapter.getViewportScrollY(), {times: 2});
});

test('short top app bar: scrollHandler does not exist if collapsed class exists before init', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS)).thenReturn(true);
  foundation.init();
  assert.equal(foundation.handleScroll, undefined);
});

test('short top app bar: #adapter.addClass called when page is scrolled from the top', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS)).thenReturn(false);
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.init();
  foundation.handleScroll();

  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS), {times: 1});
});

test('short top app bar: #adapter.removeClass called when page is scrolled to the top', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS)).thenReturn(false);
  td.when(mockAdapter.getTotalActionItems()).thenReturn(0);
  foundation.init();

  // Apply the collapsed class
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.handleScroll();

  // Test removing it
  td.when(mockAdapter.getViewportScrollY()).thenReturn(0);
  foundation.handleScroll();

  td.verify(mockAdapter.removeClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS), {times: 1});
});

test('short top app bar: #adapter.addClass is called if it has an action item', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getTotalActionItems()).thenReturn(1);
  foundation.init();
  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.SHORT_HAS_ACTION_ITEM_CLASS), {times: 1});
});

test('short top app bar: #adapter.addClass is not called if it does not have an action item', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getTotalActionItems()).thenReturn(0);
  foundation.init();
  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.SHORT_HAS_ACTION_ITEM_CLASS), {times: 0});
});
