/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import MDCTopAppBarFoundation from '../../../packages/mdc-top-app-bar/standard/foundation';
import {numbers} from '../../../packages/mdc-top-app-bar/constants';
import {createMockRaf} from '../helpers/raf';
import lolex from 'lolex';

suite('MDCTopAppBarFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);
  td.when(mockAdapter.getTopAppBarHeight()).thenReturn(64);
  td.when(mockAdapter.getViewportScrollY()).thenReturn(0);

  const foundation = new MDCTopAppBarFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

const createMockHandlers = (foundation, mockAdapter, mockRaf) => {
  let scrollHandler;
  let resizeHandler;
  td.when(mockAdapter.registerScrollHandler(td.matchers.isA(Function))).thenDo((fn) => {
    scrollHandler = fn;
  });
  td.when(mockAdapter.registerResizeHandler(td.matchers.isA(Function))).thenDo((fn) => {
    resizeHandler = fn;
  });

  foundation.init();
  mockRaf.flush();
  td.reset();
  return {scrollHandler, resizeHandler};
};

test('top app bar: listeners is registered on init', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerScrollHandler(td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.registerResizeHandler(td.matchers.isA(Function)), {times: 1});
});

test('listeners removed on destroy', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)).thenReturn(true);
  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterScrollHandler(td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.deregisterResizeHandler(td.matchers.isA(Function)), {times: 1});
});

test('top app bar scroll: throttledResizeHandler_ updates topAppBarHeight_ if the top app bar height changes', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  assert.isTrue(foundation.topAppBarHeight_ === 64);
  td.when(mockAdapter.getTopAppBarHeight()).thenReturn(56);
  foundation.throttledResizeHandler_();
  assert.isTrue(foundation.topAppBarHeight_ === 56);
});

test('top app bar scroll: throttledResizeHandler_ does not update topAppBarHeight_ if height is the same', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  assert.isTrue(foundation.topAppBarHeight_ === 64);
  td.when(mockAdapter.getTopAppBarHeight()).thenReturn(64);
  foundation.throttledResizeHandler_();
  assert.isTrue(foundation.topAppBarHeight_ === 64);
});

test('top app bar : moveTopAppBar_ update required transition from fully shown to 1px scrolled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = -1; // Indicates 1px scrolled up
  foundation.checkForUpdate_ = () => true;
  foundation.moveTopAppBar_();
  td.verify(mockAdapter.setStyle('top', '-1px'), {times: 1});
});

test('top app bar : moveTopAppBar_ update required transition from 1px shown to fullyHidden ', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = -64; // Indicates 64px scrolled
  foundation.checkForUpdate_ = () => true;
  foundation.moveTopAppBar_();
  td.verify(mockAdapter.setStyle('top', '-' + numbers.MAX_TOP_APP_BAR_HEIGHT + 'px'));
});

test('top app bar : moveTopAppBar_ update is not required results in no top app bar style change', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = 0;
  foundation.checkForUpdate_ = () => false;
  foundation.moveTopAppBar_();
  td.verify(mockAdapter.setStyle('top', td.matchers.anything()), {times: 0});
});

test('top app bar : checkForUpdate_ returns true if top app bar is not docked', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = -1;
  foundation.wasDocked_ = false;
  assert.isTrue(foundation.checkForUpdate_());
});

test('top app bar : checkForUpdate_ updates wasDocked_ to true if top app bar becomes docked', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = 0;
  foundation.wasDocked_ = false;
  assert.isTrue(foundation.checkForUpdate_());
  assert.isTrue(foundation.wasDocked_);
});

test('top app bar : checkForUpdate_ returns false if top app bar is docked and fullyShown', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = 0;
  foundation.wasDocked_ = true;
  assert.isFalse(foundation.checkForUpdate_());
  assert.isTrue(foundation.wasDocked_);
});

test('top app bar : checkForUpdate_ returns false if top app bar is docked and fullyHidden', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = -64;
  foundation.wasDocked_ = true;
  foundation.isDockedShowing_ = false;
  assert.isFalse(foundation.checkForUpdate_());
  assert.isTrue(foundation.wasDocked_);
});

test('top app bar : checkForUpdate_ returns true if top app bar is docked but not fullyShown/fullyHidden', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.currentAppBarOffsetTop_ = -63;
  foundation.wasDocked_ = true;
  assert.isTrue(foundation.checkForUpdate_());
  assert.isFalse(foundation.wasDocked_);
});

test('top app bar : topAppBarScrollHandler_ does not update currentAppBarOffsetTop_ if ' +
  'isCurrentlyBeingResized_ is true', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.isCurrentlyBeingResized_ = true;
  foundation.topAppBarScrollHandler_();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === 0);
});

test('top app bar : topAppBarScrollHandler_ subtracts the currentAppBarOffsetTop_ amount scrolled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.topAppBarScrollHandler_();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === -1);
});

test('top app bar : topAppBarScrollHandler_ negative scroll results in currentAppBarOffsetTop_ being 0', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(-1);
  foundation.topAppBarScrollHandler_();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === 0);
});

test('top app bar : topAppBarScrollHandler_ scroll greater than top app bar height results in ' +
  'currentAppBarOffsetTop_ being negative topAppBarHeight_', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(100);
  foundation.topAppBarScrollHandler_();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === -64);
});

test('top app bar : topAppBarScrollHandler_ scrolling does not generate a ' +
  'positive currentAppBarOffsetTop_', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(100);
  foundation.topAppBarScrollHandler_();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(-100);
  foundation.topAppBarScrollHandler_();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === 0);
});

test('top app bar : resize events should set isCurrentlyBeingResized_ to true', () => {
  const mockRaf = createMockRaf();
  const {foundation, mockAdapter} = setupTest();
  const {resizeHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);

  foundation.init();
  resizeHandler();

  assert.isTrue(foundation.isCurrentlyBeingResized_);
});

test('top app bar : resize events throttle multiple calls of throttledResizeHandler_ ', () => {
  const clock = lolex.install();
  const mockRaf = createMockRaf();
  const {foundation, mockAdapter} = setupTest();
  const {resizeHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);

  foundation.init();
  resizeHandler();
  assert.isFalse(!foundation.resizeThrottleId_);
  resizeHandler();
  clock.tick(numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
  assert.isTrue(!foundation.resizeThrottleId_);
});

test('top app bar : resize events debounce changing isCurrentlyBeingResized_ to false ', () => {
  const clock = lolex.install();
  const mockRaf = createMockRaf();
  const {foundation, mockAdapter} = setupTest();
  const {resizeHandler} = createMockHandlers(foundation, mockAdapter, mockRaf);

  foundation.init();

  resizeHandler();
  const debounceId = foundation.resizeDebounceId_;
  clock.tick(50);
  resizeHandler();
  assert.isFalse(debounceId === foundation.resizeDebounceId_);
  assert.isTrue(foundation.isCurrentlyBeingResized_);
  clock.tick(150);
  assert.isFalse(foundation.isCurrentlyBeingResized_);
});
