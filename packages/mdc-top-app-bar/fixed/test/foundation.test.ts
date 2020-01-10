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
import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {MDCTopAppBarFoundation} from '../../standard/foundation';
import {MDCFixedTopAppBarFoundation} from '../foundation';

describe('MDCFixedTopAppBarFoundation', () => {
  const setupTest = () => {
    const mockAdapter = createMockAdapter(MDCTopAppBarFoundation);
    const foundation = new MDCFixedTopAppBarFoundation(mockAdapter);
    return {foundation, mockAdapter};
  };

  it('#handleTargetScroll calls #adapter.getViewportScrollY', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleTargetScroll();
    // twice because it is called once in the standard foundation
    expect(mockAdapter.getViewportScrollY).toHaveBeenCalledTimes(2);
  });

  it('#handleTargetScroll calls #adapter.addClass if adapter.getViewportScrollY > 0',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.handleTargetScroll();
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
     });

  it('#handleTargetScroll calls #adapter.removeClass if ' +
         'adapter.getViewportScrollY < 0 but had just scrolled down',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.handleTargetScroll();
       mockAdapter.getViewportScrollY.and.returnValue(-1);
       foundation.handleTargetScroll();
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
     });

  it('#handleTargetScroll does not call #adapter.removeClass if was not scrolled yet',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(-1);
       foundation.handleTargetScroll();
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(jasmine.any(String));
     });

  it('#handleTargetScroll calls #adapter.addClass only once if it already scrolled',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.handleTargetScroll();
       foundation.handleTargetScroll();
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.FIXED_SCROLLED_CLASS);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
     });
});
