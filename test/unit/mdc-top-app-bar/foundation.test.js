/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';
import {captureHandlers} from '../helpers/foundation';

import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCTopAppBarFoundation from '../../../packages/mdc-top-app-bar/foundation';
import {strings, cssClasses} from '../../../packages/mdc-top-app-bar/constants';
import {createMockRaf} from '../helpers/raf';

suite('MDCTopAppBarFoundation');

test('exports strings', () => {
  assert.isTrue('strings' in MDCTopAppBarFoundation);
  assert.deepEqual(MDCTopAppBarFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCTopAppBarFoundation);
  assert.deepEqual(MDCTopAppBarFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTopAppBarFoundation, [
    'hasClass', 'addClass', 'removeClass', 'registerNavigationIconInteractionHandler',
    'deregisterNavigationIconInteractionHandler', 'notifyNavigationIconClicked', 'registerScrollHandler',
    'deregisterScrollHandler', 'getViewportScrollY', 'getTotalActionItems',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);

  const foundation = new MDCTopAppBarFoundation(mockAdapter);

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

test('click on navigation icon emits a navigation event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerNavigationIconInteractionHandler');
  foundation.init();
  handlers.click();
  td.verify(mockAdapter.notifyNavigationIconClicked(), {times: 1});
});

test('click handler removed from navigation icon during destroy', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterNavigationIconInteractionHandler('click', td.matchers.isA(Function)));
});

test('short top app bar: scroll listener is registered on init', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);
  foundation.init();
  td.verify(mockAdapter.registerScrollHandler(td.matchers.isA(Function)), {times: 1});
});

test('short top app bar: scroll listener is removed on destroy', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);
  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterScrollHandler(td.matchers.isA(Function)), {times: 1});
});

test('short top app bar: class is added once when page is scrolled from the top', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);

  const {scrollHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);

  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  scrollHandler();
  scrollHandler();

  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS), {times: 1});
});

test('short top app bar: class is removed once when page is scrolled to the top', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();

  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);

  const {scrollHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);
  // Apply the closed class
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  scrollHandler();

  // Test removing it
  td.when(mockAdapter.getViewportScrollY()).thenReturn(0);
  scrollHandler();
  scrollHandler();

  td.verify(mockAdapter.removeClass(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS), {times: 1});
});

test('short top app bar: class is added if it has an action item', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);
  td.when(mockAdapter.getTotalActionItems()).thenReturn(1);
  foundation.init();
  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.SHORT_HAS_ACTION_ITEM_CLASS), {times: 1});
});

test('short top app bar: class is not added if it does not have an action item', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);
  td.when(mockAdapter.getTotalActionItems()).thenReturn(0);
  foundation.init();
  td.verify(mockAdapter.addClass(MDCTopAppBarFoundation.cssClasses.SHORT_HAS_ACTION_ITEM_CLASS), {times: 0});
});
