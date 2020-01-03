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

import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {MDCTabScrollerFoundation} from '../foundation';
import {MDCTabScrollerRTLDefault} from '../rtl-default-scroller';

const setupTest =
    ({rootWidth, contentWidth, scrollLeft}:
         {rootWidth: number, contentWidth: number, scrollLeft: number}) => {
      const {mockAdapter} = setUpFoundationTest(MDCTabScrollerFoundation);
      const scroller = new MDCTabScrollerRTLDefault(mockAdapter);
      mockAdapter.getScrollAreaOffsetWidth.and.returnValue(rootWidth);
      mockAdapter.getScrollContentOffsetWidth.and.returnValue(contentWidth);
      mockAdapter.getScrollAreaScrollLeft.and.returnValue(scrollLeft);
      return {scroller, mockAdapter};
    };

describe('MDCTabScrollerRTLDefault', () => {
  it('#getScrollPositionRTL() returns the distance from the right edge', () => {
    const {scroller} =
        setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    expect(scroller.getScrollPositionRTL() === 123).toBe(true);
  });

  it('#scrollToRTL() returns a normalized scrollX property', () => {
    const {scroller} =
        setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    expect(scroller.scrollToRTL(111).finalScrollPosition === 689).toBe(true);
  });

  it('#scrollToRTL() returns a normalized translateX property', () => {
    const {scroller} =
        setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    expect(scroller.scrollToRTL(111).scrollDelta === 12).toBe(true);
  });

  it('#scrollToRTL() returns 0 for scrollX property when scrollLeft would be too far left',
     () => {
       const {scroller} =
           setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
       expect(scroller.scrollToRTL(801).finalScrollPosition === 0).toBe(true);
     });

  it('#scrollToRTL() returns 0 for translateX property when scrollLeft would be the same',
     () => {
       const {scroller} =
           setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
       expect(scroller.scrollToRTL(123).scrollDelta === 0).toBe(true);
     });

  it('#scrollToRTL() returns max scroll value for scrollX property when scrollLeft would be too far right',
     () => {
       const {scroller} =
           setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
       expect(scroller.scrollToRTL(-10).finalScrollPosition === 800).toBe(true);
     });

  it('#incrementScrollRTL() returns a normalized scrollX property', () => {
    const {scroller} =
        setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    expect(scroller.incrementScrollRTL(50).finalScrollPosition === 627)
        .toBe(true);
  });

  it('#incrementScrollRTL() returns a normalized translateX property', () => {
    const {scroller} =
        setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    expect(scroller.incrementScrollRTL(50).scrollDelta === -50).toBe(true);
  });

  it('#incrementScrollRTL() returns 0 for scrollX property when scrollLeft would be too far left',
     () => {
       const {scroller} =
           setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
       expect(scroller.incrementScrollRTL(678).finalScrollPosition === 0)
           .toBe(true);
     });

  it('#incrementScrollRTL() returns 0 for translateX property when scrollLeft would be the same',
     () => {
       const {scroller} =
           setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
       expect(scroller.incrementScrollRTL(0).scrollDelta === 0).toBe(true);
     });

  it('#incrementScrollRTL() returns max scroll value for scrollX property when scrollLeft would be too far right',
     () => {
       const {scroller} =
           setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
       expect(scroller.incrementScrollRTL(-124).finalScrollPosition === 800)
           .toBe(true);
     });

  it('#getAnimatingScrollPosition() returns just the scrollX value', () => {
    const {scroller} =
        setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    expect(scroller.getAnimatingScrollPosition(123) === 123).toBe(true);
  });
});
