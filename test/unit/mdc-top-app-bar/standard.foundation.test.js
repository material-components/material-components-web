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

import {MDCTopAppBarFoundation} from '../../../packages/mdc-top-app-bar/standard/foundation';
import {numbers} from '../../../packages/mdc-top-app-bar/constants';
import {install as installClock} from '../helpers/clock';

suite('MDCTopAppBarFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);
  td.when(mockAdapter.getTopAppBarHeight()).thenReturn(64);
  td.when(mockAdapter.getViewportScrollY()).thenReturn(0);

  const foundation = new MDCTopAppBarFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('top app bar scroll: throttledResizeHandler_ updates topAppBarHeight_ if the top app bar height changes', () => {
  const {foundation, mockAdapter} = setupTest();
  assert.isTrue(foundation.topAppBarHeight_ === 64);
  td.when(mockAdapter.getTopAppBarHeight()).thenReturn(56);
  foundation.throttledResizeHandler_();
  assert.isTrue(foundation.topAppBarHeight_ === 56);
});

test('top app bar scroll: throttledResizeHandler_ does not update topAppBarHeight_ if height is the same', () => {
  const {foundation, mockAdapter} = setupTest();
  assert.isTrue(foundation.topAppBarHeight_ === 64);
  td.when(mockAdapter.getTopAppBarHeight()).thenReturn(64);
  foundation.throttledResizeHandler_();
  assert.isTrue(foundation.topAppBarHeight_ === 64);
});

test('top app bar : moveTopAppBar_ update required transition from fully shown to 1px scrolled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.currentAppBarOffsetTop_ = -1; // Indicates 1px scrolled up
  foundation.checkForUpdate_ = () => true;
  foundation.moveTopAppBar_();
  td.verify(mockAdapter.setStyle('transform', `translateY(${foundation.currentAppBarOffsetTop_}px)`), {times: 1});
});

test('top app bar : moveTopAppBar_ update required transition from 1px shown to fullyHidden ', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.currentAppBarOffsetTop_ = -64; // Indicates 64px scrolled
  foundation.checkForUpdate_ = () => true;
  foundation.moveTopAppBar_();
  td.verify(mockAdapter.setStyle('transform', `translateY(-${numbers.MAX_TOP_APP_BAR_HEIGHT}px)`));
});

test('top app bar : moveTopAppBar_ update is not required results in no top app bar style change', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.currentAppBarOffsetTop_ = 0;
  foundation.checkForUpdate_ = () => false;
  foundation.moveTopAppBar_();
  td.verify(mockAdapter.setStyle('top', td.matchers.anything()), {times: 0});
});

test('top app bar : checkForUpdate_ returns true if top app bar is not docked', () => {
  const {foundation} = setupTest();
  foundation.currentAppBarOffsetTop_ = -1;
  foundation.wasDocked_ = false;
  assert.isTrue(foundation.checkForUpdate_());
});

test('top app bar : checkForUpdate_ updates wasDocked_ to true if top app bar becomes docked', () => {
  const {foundation} = setupTest();
  foundation.currentAppBarOffsetTop_ = 0;
  foundation.wasDocked_ = false;
  assert.isTrue(foundation.checkForUpdate_());
  assert.isTrue(foundation.wasDocked_);
});

test('top app bar : checkForUpdate_ returns false if top app bar is docked and fullyShown', () => {
  const {foundation} = setupTest();
  foundation.currentAppBarOffsetTop_ = 0;
  foundation.wasDocked_ = true;
  assert.isFalse(foundation.checkForUpdate_());
  assert.isTrue(foundation.wasDocked_);
});

test('top app bar : checkForUpdate_ returns false if top app bar is docked and fullyHidden', () => {
  const {foundation} = setupTest();
  foundation.currentAppBarOffsetTop_ = -64;
  foundation.wasDocked_ = true;
  foundation.isDockedShowing_ = false;
  assert.isFalse(foundation.checkForUpdate_());
  assert.isTrue(foundation.wasDocked_);
});

test('top app bar : checkForUpdate_ returns true if top app bar is docked but not fullyShown/fullyHidden', () => {
  const {foundation} = setupTest();
  foundation.currentAppBarOffsetTop_ = -63;
  foundation.wasDocked_ = true;
  assert.isTrue(foundation.checkForUpdate_());
  assert.isFalse(foundation.wasDocked_);
});

test('top app bar : handleTargetScroll does not update currentAppBarOffsetTop_ if ' +
  'isCurrentlyBeingResized_ is true', () => {
  const {foundation} = setupTest();
  foundation.isCurrentlyBeingResized_ = true;
  foundation.handleTargetScroll();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === 0);
});

test('top app bar : handleTargetScroll subtracts the currentAppBarOffsetTop_ amount scrolled', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(1);
  foundation.handleTargetScroll();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === -1);
});

test('top app bar : handleTargetScroll negative scroll results in currentAppBarOffsetTop_ being 0', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(-1);
  foundation.handleTargetScroll();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === 0);
});

test('top app bar : handleTargetScroll scroll greater than top app bar height results in ' +
  'currentAppBarOffsetTop_ being negative topAppBarHeight_', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(100);
  foundation.handleTargetScroll();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === -64);
});

test('top app bar : handleTargetScroll scrolling does not generate a ' +
  'positive currentAppBarOffsetTop_', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(100);
  foundation.handleTargetScroll();
  td.when(mockAdapter.getViewportScrollY()).thenReturn(-100);
  foundation.handleTargetScroll();
  assert.isTrue(foundation.currentAppBarOffsetTop_ === 0);
});

test('top app bar : resize events should set isCurrentlyBeingResized_ to true', () => {
  const {foundation} = setupTest();

  foundation.handleWindowResize();

  assert.isTrue(foundation.isCurrentlyBeingResized_);
});

test('top app bar : resize events throttle multiple calls of throttledResizeHandler_ ', () => {
  const clock = installClock();
  const {foundation} = setupTest();

  foundation.handleWindowResize();
  assert.isFalse(!foundation.resizeThrottleId_);
  foundation.handleWindowResize();
  clock.tick(numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
  assert.isTrue(!foundation.resizeThrottleId_);
});

test('top app bar : resize events debounce changing isCurrentlyBeingResized_ to false ', () => {
  const clock = installClock();
  const {foundation} = setupTest();

  foundation.handleWindowResize();
  const debounceId = foundation.resizeDebounceId_;
  clock.tick(50);
  foundation.handleWindowResize();
  assert.isFalse(debounceId === foundation.resizeDebounceId_);
  assert.isTrue(foundation.isCurrentlyBeingResized_);
  clock.tick(150);
  assert.isFalse(foundation.isCurrentlyBeingResized_);
});

test('#destroy calls #adapter.setStyle(top, "")', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.setStyle('transform', ''), {times: 1});
});
