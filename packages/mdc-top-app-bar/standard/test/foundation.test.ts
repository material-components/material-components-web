/**
 * @license
 * Copyright 2020 Google Inc.
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

import {createMockAdapter} from '../../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {numbers} from '../../constants';
import {MDCTopAppBarFoundation} from '../foundation';

describe('MDCTopAppBarFoundation', () => {
  setUpMdcTestEnvironment();

  const setupTest = () => {
    const mockAdapter = createMockAdapter(MDCTopAppBarFoundation);
    mockAdapter.getTopAppBarHeight.and.returnValue(64);
    mockAdapter.getViewportScrollY.and.returnValue(0);
    const foundation = new MDCTopAppBarFoundation(mockAdapter);
    return {foundation, mockAdapter};
  };

  it('top app bar scroll: throttledResizeHandler_ updates topAppBarHeight_ if the top app bar height changes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       expect((foundation as any).topAppBarHeight_).toBe(64);
       mockAdapter.getTopAppBarHeight.and.returnValue(56);
       (foundation as any).throttledResizeHandler_();
       expect((foundation as any).topAppBarHeight_).toBe(56);
     });

  it('top app bar scroll: throttledResizeHandler_ does not update topAppBarHeight_ if height is the same',
     () => {
       const {foundation, mockAdapter} = setupTest();
       expect((foundation as any).topAppBarHeight_).toBe(64);
       mockAdapter.getTopAppBarHeight.and.returnValue(64);
       (foundation as any).throttledResizeHandler_();
       expect((foundation as any).topAppBarHeight_).toBe(64);
     });

  it('top app bar : moveTopAppBar_ update required transition from fully shown to 1px scrolled',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ =
           -1;  // Indicates 1px scrolled up
       (foundation as any).checkForUpdate_ = () => true;
       (foundation as any).moveTopAppBar_();
       expect(mockAdapter.setStyle).toHaveBeenCalledWith('top', '-1px');
     });

  it('top app bar : moveTopAppBar_ update required transition from 1px shown to fullyHidden ',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ =
           -64;  // Indicates 64px scrolled
       (foundation as any).checkForUpdate_ = () => true;
       (foundation as any).moveTopAppBar_();
       expect(mockAdapter.setStyle)
           .toHaveBeenCalledWith(
               'top', '-' + numbers.MAX_TOP_APP_BAR_HEIGHT + 'px');
     });

  it('top app bar : moveTopAppBar_ update is not required results in no top app bar style change',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ = 0;
       (foundation as any).checkForUpdate_ = () => false;
       (foundation as any).moveTopAppBar_();
       expect(mockAdapter.setStyle)
           .not.toHaveBeenCalledWith('top', jasmine.anything());
     });

  it('top app bar : checkForUpdate_ returns true if top app bar is not docked',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ = -1;
       (foundation as any).wasDocked_ = false;
       expect((foundation as any).checkForUpdate_()).toBe(true);
     });

  it('top app bar : checkForUpdate_ updates wasDocked_ to true if top app bar becomes docked',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ = 0;
       (foundation as any).wasDocked_ = false;
       expect((foundation as any).checkForUpdate_()).toBe(true);
       expect((foundation as any).wasDocked_).toBe(true);
     });

  it('top app bar : checkForUpdate_ returns false if top app bar is docked and fullyShown',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ = 0;
       (foundation as any).wasDocked_ = true;
       expect((foundation as any).checkForUpdate_()).toBe(false);
       expect((foundation as any).wasDocked_).toBe(true);
     });

  it('top app bar : checkForUpdate_ returns false if top app bar is docked and fullyHidden',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ = -64;
       (foundation as any).wasDocked_ = true;
       (foundation as any).isDockedShowing_ = false;
       expect((foundation as any).checkForUpdate_()).toBe(false);
       expect((foundation as any).wasDocked_).toBe(true);
     });

  it('top app bar : checkForUpdate_ returns true if top app bar is docked but not fullyShown/fullyHidden',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop_ = -63;
       (foundation as any).wasDocked_ = true;
       expect((foundation as any).checkForUpdate_()).toBe(true);
       expect((foundation as any).wasDocked_).toBe(false);
     });

  it('top app bar : handleTargetScroll does not update currentAppBarOffsetTop_ if ' +
         'isCurrentlyBeingResized_ is true',
     () => {
       const {foundation} = setupTest();
       (foundation as any).isCurrentlyBeingResized_ = true;
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop_).toBe(0);
     });

  it('top app bar : handleTargetScroll subtracts the currentAppBarOffsetTop_ amount scrolled',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop_).toBe(-1);
     });

  it('top app bar : handleTargetScroll negative scroll results in currentAppBarOffsetTop_ being 0',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(-1);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop_).toBe(0);
     });

  it('top app bar : handleTargetScroll scroll greater than top app bar height results in ' +
         'currentAppBarOffsetTop_ being negative topAppBarHeight_',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(100);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop_).toBe(-64);
     });

  it('top app bar : handleTargetScroll scrolling does not generate a ' +
         'positive currentAppBarOffsetTop_',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(100);
       foundation.handleTargetScroll();
       mockAdapter.getViewportScrollY.and.returnValue(-100);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop_).toBe(0);
     });

  it('top app bar : resize events should set isCurrentlyBeingResized_ to true',
     () => {
       const {foundation} = setupTest();

       foundation.handleWindowResize();

       expect((foundation as any).isCurrentlyBeingResized_).toBe(true);
     });

  it('top app bar : resize events throttle multiple calls of throttledResizeHandler_ ',
     () => {
       const {foundation} = setupTest();

       foundation.handleWindowResize();
       expect(!(foundation as any).resizeThrottleId_).toBe(false);
       foundation.handleWindowResize();
       jasmine.clock().tick(numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
       expect(!(foundation as any).resizeThrottleId_).toBe(true);
     });

  it('top app bar : resize events debounce changing isCurrentlyBeingResized_ to false ',
     () => {
       const {foundation} = setupTest();

       foundation.handleWindowResize();
       const debounceId = (foundation as any).resizeDebounceId_;
       jasmine.clock().tick(50);
       foundation.handleWindowResize();
       expect(debounceId === (foundation as any).resizeDebounceId_).toBe(false);
       expect((foundation as any).isCurrentlyBeingResized_).toBe(true);
       jasmine.clock().tick(150);
       expect((foundation as any).isCurrentlyBeingResized_).toBe(false);
     });

  it('#destroy calls #adapter.setStyle(top, "")', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.destroy();
    expect(mockAdapter.setStyle).toHaveBeenCalledWith('top', '');
  });
});
