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
import {MDCTopAppBarFoundation} from '../../standard/foundation';
import {MDCShortTopAppBarFoundation} from '../foundation';

describe('MDCShortTopAppBarFoundation', () => {
  const setupTest = () => {
    const mockAdapter = createMockAdapter(MDCTopAppBarFoundation);
    mockAdapter.hasClass.withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)
        .and.returnValue(true);
    const foundation = new MDCShortTopAppBarFoundation(mockAdapter);
    return {foundation, mockAdapter};
  };

  it('short top app bar: scrollHandler calls #adapter.getViewportScrollY',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.handleTargetScroll();
       // called twice because its called once in the standard foundation
       expect(mockAdapter.getViewportScrollY).toHaveBeenCalledTimes(2);
     });

  it('short top app bar: scrollHandler does not call getViewportScrollY method ' +
         'if short collapsed class is on the component',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass
           .withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS)
           .and.returnValue(true);
       foundation.init();
       expect(mockAdapter.getViewportScrollY).not.toHaveBeenCalled();
     });

  it('short top app bar: #adapter.addClass called when page is scrolled from the top',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasClass
           .withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS)
           .and.returnValue(false);
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.init();
       foundation.handleTargetScroll();

       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
     });

  it('short top app bar: #adapter.removeClass called when page is scrolled to the top',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.hasClass
           .withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS)
           .and.returnValue(false);
       mockAdapter.getTotalActionItems.and.returnValue(0);
       foundation.init();

       // Apply the collapsed class
       mockAdapter.getViewportScrollY.and.returnValue(1);
       foundation.handleTargetScroll();

       // Test removing it
       mockAdapter.getViewportScrollY.and.returnValue(0);
       foundation.handleTargetScroll();

       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.SHORT_COLLAPSED_CLASS);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
     });

  it('short top app bar: #adapter.addClass is called if it has an action item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getTotalActionItems.and.returnValue(1);
       foundation.init();
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.SHORT_HAS_ACTION_ITEM_CLASS);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
     });

  it('short top app bar: #adapter.addClass is not called if it does not have an action item',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getTotalActionItems.and.returnValue(0);
       foundation.init();
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(
               MDCTopAppBarFoundation.cssClasses.SHORT_HAS_ACTION_ITEM_CLASS);
     });

  it('isCollapsed returns false initially if top-app-bar has not scrolled',
     () => {
       const {foundation} = setupTest();
       expect(foundation.isCollapsed).toBe(false);
     });

  it('isCollapsed returns true if top-app-bar is collapsed', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getViewportScrollY.and.returnValue(1);

    foundation.handleTargetScroll();
    expect(foundation.isCollapsed).toBe(true);
  });

  it('isCollapsed returns false when page is scrolled to the top', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getViewportScrollY.and.returnValue(0);
    foundation.init();
    mockAdapter.getViewportScrollY.and.returnValue(1);
    foundation.handleTargetScroll();
    mockAdapter.getViewportScrollY.and.returnValue(0);
    foundation.handleTargetScroll();
    expect(foundation.isCollapsed).toBe(false);
  });

  it('setAlwaysCollapsed(true) sets bar to be collapsed', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setAlwaysCollapsed(true);
    expect(foundation.isCollapsed).toBe(true);
  });

  it('setAlwaysCollapsed(true) will keep bar collapsed', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)
        .and.returnValue(false);
    mockAdapter.getViewportScrollY.and.returnValue(0);
    foundation.init();
    foundation.setAlwaysCollapsed(true);
    mockAdapter.getViewportScrollY.and.returnValue(1);
    foundation.handleTargetScroll();
    mockAdapter.getViewportScrollY.and.returnValue(0);
    foundation.handleTargetScroll();
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(
            MDCTopAppBarFoundation.cssClasses.SHORT_CLASS);
  });

  it('setAlwaysCollapsed(false) will keep bar collapsed when scrolled', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS)
        .and.returnValue(false);
    mockAdapter.getViewportScrollY.and.returnValue(0);
    foundation.init();
    foundation.setAlwaysCollapsed(true);
    mockAdapter.getViewportScrollY.and.returnValue(1);
    foundation.handleTargetScroll();
    expect(foundation.isCollapsed).toBe(true);
    foundation.setAlwaysCollapsed(false);
    expect(foundation.isCollapsed).toBe(true);
    foundation.handleTargetScroll();
    expect(foundation.isCollapsed).toBe(true);
  });

  it('setAlwaysCollapsed is called on init', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.getViewportScrollY).toHaveBeenCalledTimes(1);
  });

  it('getAlwaysCollapsed returns false by default', () => {
    const {foundation} = setupTest();
    expect(foundation.getAlwaysCollapsed()).toBe(false);
  });

  it('getAlwaysCollapsed matches value of setAlwaysCollapsed', () => {
    const {foundation} = setupTest();
    foundation.setAlwaysCollapsed(false);
    expect(foundation.getAlwaysCollapsed()).toBe(false);
    foundation.setAlwaysCollapsed(true);
    expect(foundation.getAlwaysCollapsed()).toBe(true);
  });
});
