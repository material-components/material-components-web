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

  it('top app bar scroll: throttledResizeHandler updates topAppBarHeight if the top app bar height changes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       expect((foundation as any).topAppBarHeight).toBe(64);
       mockAdapter.getTopAppBarHeight.and.returnValue(56);
       (foundation as any).throttledResizeHandler();
       expect((foundation as any).topAppBarHeight).toBe(56);
     });

  it('top app bar scroll: throttledResizeHandler does not update topAppBarHeight if height is the same',
     () => {
       const {foundation, mockAdapter} = setupTest();
       expect((foundation as any).topAppBarHeight).toBe(64);
       mockAdapter.getTopAppBarHeight.and.returnValue(64);
       (foundation as any).throttledResizeHandler();
       expect((foundation as any).topAppBarHeight).toBe(64);
     });

  it('top app bar : moveTopAppBar update required transition from fully shown to 1px scrolled',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).currentAppBarOffsetTop =
           -1;  // Indicates 1px scrolled up
       (foundation as any).checkForUpdate = () => true;
       (foundation as any).moveTopAppBar();
       expect(mockAdapter.setStyle).toHaveBeenCalledWith('top', '-1px');
     });

  it('top app bar : moveTopAppBar update required transition from 1px shown to fullyHidden ',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).currentAppBarOffsetTop =
           -64;  // Indicates 64px scrolled
       (foundation as any).checkForUpdate = () => true;
       (foundation as any).moveTopAppBar();
       expect(mockAdapter.setStyle)
           .toHaveBeenCalledWith(
               'top', '-' + numbers.MAX_TOP_APP_BAR_HEIGHT + 'px');
     });

  it('top app bar : moveTopAppBar update is not required results in no top app bar style change',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).currentAppBarOffsetTop = 0;
       (foundation as any).checkForUpdate = () => false;
       (foundation as any).moveTopAppBar();
       expect(mockAdapter.setStyle)
           .not.toHaveBeenCalledWith('top', jasmine.anything());
     });

  it('top app bar : checkForUpdate returns true if top app bar is not docked',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop = -1;
       (foundation as any).wasDocked = false;
       expect((foundation as any).checkForUpdate()).toBe(true);
     });

  it('top app bar : checkForUpdate updates wasDocked to true if top app bar becomes docked',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop = 0;
       (foundation as any).wasDocked = false;
       expect((foundation as any).checkForUpdate()).toBe(true);
       expect((foundation as any).wasDocked).toBe(true);
     });

  it('top app bar : checkForUpdate returns false if top app bar is docked and fullyShown',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop = 0;
       (foundation as any).wasDocked = true;
       expect((foundation as any).checkForUpdate()).toBe(false);
       expect((foundation as any).wasDocked).toBe(true);
     });

  it('top app bar : checkForUpdate returns false if top app bar is docked and fullyHidden',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop = -64;
       (foundation as any).wasDocked = true;
       (foundation as any).isDockedShowing = false;
       expect((foundation as any).checkForUpdate()).toBe(false);
       expect((foundation as any).wasDocked).toBe(true);
     });

  it('top app bar : checkForUpdate returns true if top app bar is docked but not fullyShown/fullyHidden',
     () => {
       const {foundation} = setupTest();
       (foundation as any).currentAppBarOffsetTop = -63;
       (foundation as any).wasDocked = true;
       expect((foundation as any).checkForUpdate()).toBe(true);
       expect((foundation as any).wasDocked).toBe(false);
     });

  it('top app bar : handleTargetScroll does not update currentAppBarOffsetTop if ' +
         'isCurrentlyBeingResized is true',
     () => {
       const {foundation} = setupTest();
       (foundation as any).isCurrentlyBeingResized = true;
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop).toBe(0);
     });

  it('top app bar : handleTargetScroll subtracts the currentAppBarOffsetTop amount scrolled',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop).toBe(-1);
     });

  it('top app bar : handleTargetScroll negative scroll results in currentAppBarOffsetTop being 0',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(-1);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop).toBe(0);
     });

  it('top app bar : handleTargetScroll scroll greater than top app bar height results in ' +
         'currentAppBarOffsetTop being negative topAppBarHeight',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(100);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop).toBe(-64);
     });

  it('top app bar : handleTargetScroll scrolling does not generate a ' +
         'positive currentAppBarOffsetTop',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(100);
       foundation.handleTargetScroll();
       mockAdapter.getViewportScrollY.and.returnValue(-100);
       foundation.handleTargetScroll();
       expect((foundation as any).currentAppBarOffsetTop).toBe(0);
     });

  it('top app bar : resize events should set isCurrentlyBeingResized to true',
     () => {
       const {foundation} = setupTest();

       foundation.handleWindowResize();

       expect((foundation as any).isCurrentlyBeingResized).toBe(true);
     });

  it('top app bar : resize events throttle multiple calls of throttledResizeHandler ',
     () => {
       const {foundation} = setupTest();

       foundation.handleWindowResize();
       expect(!(foundation as any).resizeThrottleId).toBe(false);
       foundation.handleWindowResize();
       jasmine.clock().tick(numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
       expect(!(foundation as any).resizeThrottleId).toBe(true);
     });

  it('top app bar : resize events debounce changing isCurrentlyBeingResized to false ',
     () => {
       const {foundation} = setupTest();

       foundation.handleWindowResize();
       const debounceId = (foundation as any).resizeDebounceId;
       jasmine.clock().tick(50);
       foundation.handleWindowResize();
       expect(debounceId === (foundation as any).resizeDebounceId).toBe(false);
       expect((foundation as any).isCurrentlyBeingResized).toBe(true);
       jasmine.clock().tick(150);
       expect((foundation as any).isCurrentlyBeingResized).toBe(false);
     });

  it('#destroy calls #adapter.setStyle(top, "")', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.destroy();
    expect(mockAdapter.setStyle).toHaveBeenCalledWith('top', '');
  });
});
