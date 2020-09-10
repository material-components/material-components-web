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

import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCTabScrollerFoundation} from '../foundation';
import {MDCTabScrollerRTLDefault} from '../rtl-default-scroller';
import {MDCTabScrollerRTLNegative} from '../rtl-negative-scroller';
import {MDCTabScrollerRTLReverse} from '../rtl-reverse-scroller';

function setupTest() {
  const {foundation, mockAdapter} =
      setUpFoundationTest(MDCTabScrollerFoundation);
  return {foundation, mockAdapter};
}

function setupScrollToTest({
  rootWidth = 300,
  contentWidth = 1000,
  scrollLeft = 0,
  translateX = 0,
  isAnimating = false
} = {}) {
  const opts = {
    rootWidth,
    contentWidth,
    scrollLeft,
    translateX,
    isAnimating,
  };
  const {foundation, mockAdapter} = setupTest();
  mockAdapter.getScrollAreaOffsetWidth.and.returnValue(rootWidth);
  mockAdapter.getScrollContentOffsetWidth.and.returnValue(contentWidth);
  mockAdapter.getScrollAreaScrollLeft.and.returnValue(scrollLeft);
  foundation.isAnimating_ = isAnimating;
  mockAdapter.getScrollContentStyleValue.withArgs('transform')
      .and.returnValue(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  return {foundation, mockAdapter, opts};
}

describe('MDCTabScrollerFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCTabScrollerFoundation).toBeTruthy();
  });

  it('exports strings', () => {
    expect('strings' in MDCTabScrollerFoundation).toBeTruthy();
  });

  it('#getScrollPosition() returns scroll value when transform is none', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getScrollContentStyleValue.withArgs('transform')
        .and.returnValue('none');
    mockAdapter.getScrollAreaScrollLeft.and.returnValue(0);
    expect(foundation.getScrollPosition() === 0).toBe(true);
  });

  it('#getScrollPosition() returns difference between scrollLeft and translateX',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getScrollContentStyleValue.withArgs('transform')
           .and.returnValue('matrix(1, 0, 0, 0, 101, 0)');
       mockAdapter.getScrollAreaScrollLeft.and.returnValue(212);
       expect(foundation.getScrollPosition() === 111).toBe(true);
     });

  it('#handleInteraction() does nothing if should not handle interaction',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleInteraction();
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(jasmine.any(String));
       expect(mockAdapter.setScrollContentStyleProperty)
           .not.toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
     });

  function setupHandleInteractionTest({scrollLeft = 0, translateX = 99} = {}) {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getScrollContentStyleValue.withArgs('transform')
        .and.returnValue(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
    mockAdapter.getScrollAreaScrollLeft.and.returnValue(scrollLeft);
    foundation.isAnimating_ = true;
    return {foundation, mockAdapter};
  }

  it(`#handleInteraction() removes the ${
         MDCTabScrollerFoundation.cssClasses.ANIMATING} class`,
     () => {
       const {foundation, mockAdapter} = setupHandleInteractionTest();
       foundation.handleInteraction();
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCTabScrollerFoundation.cssClasses.ANIMATING);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
     });

  it('#handleInteraction() sets the transform property to translateX(0px)',
     () => {
       const {foundation, mockAdapter} = setupHandleInteractionTest();
       foundation.handleInteraction();
       expect(mockAdapter.setScrollContentStyleProperty)
           .toHaveBeenCalledWith('transform', 'translateX(0px)');
     });

  it('#handleInteraction() sets scrollLeft to the difference between scrollLeft and translateX',
     () => {
       const {foundation, mockAdapter} =
           setupHandleInteractionTest({scrollLeft: 123, translateX: 101});
       foundation.handleInteraction();
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(22);
     });

  it('#handleTransitionEnd() does nothing if should not handle transition',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleTransitionEnd({
         target: {},
       });
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(jasmine.any(String));
     });

  it(`#handleTransitionEnd() removes the ${
         MDCTabScrollerFoundation.cssClasses.ANIMATING} class`,
     () => {
       const {foundation, mockAdapter} =
           setupHandleInteractionTest({scrollLeft: 123, translateX: 101});
       mockAdapter.eventTargetMatchesSelector
           .withArgs(jasmine.any(Object), jasmine.any(String))
           .and.returnValue(true);
       foundation.handleTransitionEnd({
         target: {},
       });
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCTabScrollerFoundation.cssClasses.ANIMATING);
     });

  it('#scrollTo() exits early if difference between scrollX and scrollLeft is 0',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 66});
       foundation.scrollTo(66);
       expect(mockAdapter.setScrollContentStyleProperty)
           .not.toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
       expect(mockAdapter.setScrollAreaScrollLeft)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#scrollTo() scrolls to 0 if scrollX is less than 0', () => {
    const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 1});
    foundation.scrollTo(-999);
    expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(0);
  });

  it('#scrollTo() scrolls to the max scrollable size if scrollX is greater than the max scrollable value',
     () => {
       const {foundation, mockAdapter} =
           setupScrollToTest({rootWidth: 212, contentWidth: 1000});
       foundation.scrollTo(900);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(788);
     });

  it('#scrollTo() sets the content transform style property to the difference between scrollX and scrollLeft',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest(
           {rootWidth: 300, contentWidth: 1000, scrollLeft: 123});
       foundation.scrollTo(456);
       expect(mockAdapter.setScrollContentStyleProperty)
           .toHaveBeenCalledWith('transform', 'translateX(333px)');
     });

  it('#scrollTo() sets the scroll property to the computed scrollX', () => {
    const {foundation, mockAdapter} =
        setupScrollToTest({rootWidth: 300, contentWidth: 1000, scrollLeft: 5});
    foundation.scrollTo(111);
    expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(111);
  });

  it(`#scrollTo() adds the ${
         MDCTabScrollerFoundation.cssClasses.ANIMATING} class in a rAF`,
     () => {
       const {foundation, mockAdapter} = setupScrollToTest();
       foundation.scrollTo(100);
       jasmine.clock().tick(1);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCTabScrollerFoundation.cssClasses.ANIMATING);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
     });

  it('#scrollTo() sets scrollLeft to the visual scroll position if called during an animation',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({
         scrollLeft: 50,
         rootWidth: 100,
         contentWidth: 200,
         translateX: 19,
         isAnimating: true,
       });
       foundation.scrollTo(33);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(31);
     });

  it(`#scrollTo() removes the ${
         MDCTabScrollerFoundation.cssClasses
             .ANIMATING} if called during an animation`,
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({
         scrollLeft: 50,
         rootWidth: 100,
         contentWidth: 200,
         translateX: 19,
         isAnimating: true,
       });
       foundation.scrollTo(60);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCTabScrollerFoundation.cssClasses.ANIMATING);
     });

  it('#scrollTo() unsets the transform property in a rAF', () => {
    const {foundation, mockAdapter} = setupScrollToTest();
    foundation.scrollTo(212);
    jasmine.clock().tick(1);
    expect(mockAdapter.setScrollContentStyleProperty)
        .toHaveBeenCalledWith('transform', 'none');
  });

  it('#incrementScroll() exits early if increment is 0', () => {
    const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
    foundation.incrementScroll(0);
    expect(mockAdapter.setScrollContentStyleProperty)
        .not.toHaveBeenCalledWith(jasmine.any(String));
    expect(mockAdapter.setScrollAreaScrollLeft)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('#incrementScroll() exits early if increment puts the scrollLeft over the max value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
       foundation.incrementScroll(10);
       expect(mockAdapter.setScrollContentStyleProperty)
           .not.toHaveBeenCalledWith(jasmine.any(String));
       expect(mockAdapter.setScrollAreaScrollLeft)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#incrementScroll() exits early if increment puts the scrollLeft below the min value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 0});
       foundation.incrementScroll(-10);
       expect(mockAdapter.setScrollContentStyleProperty)
           .not.toHaveBeenCalledWith(jasmine.any(String));
       expect(mockAdapter.setScrollAreaScrollLeft)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#incrementScroll() increases the scrollLeft value by the given value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
       foundation.incrementScroll(11);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(134);
     });

  it('#incrementScroll() increases the scrollLeft value by the given value up to the max scroll value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest(
           {scrollLeft: 99, rootWidth: 100, contentWidth: 200});
       foundation.incrementScroll(2);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(100);
     });

  it('#incrementScroll() decreases the scrollLeft value by the given value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
       foundation.incrementScroll(-11);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(112);
     });

  it('#incrementScroll() decreases the scrollLeft value by the given value down to the min scroll value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest(
           {scrollLeft: 1, rootWidth: 100, contentWidth: 200});
       foundation.incrementScroll(-2);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(0);
     });

  it('#incrementScroll() sets scrollLeft to the visual scroll position if called during an animation',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({
         scrollLeft: 50,
         rootWidth: 100,
         contentWidth: 200,
         translateX: 22,
         isAnimating: true,
       });
       foundation.incrementScroll(10);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(28);
     });

  it(`#incrementScroll() removes the ${
         MDCTabScrollerFoundation.cssClasses
             .ANIMATING} if called during an animation`,
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({
         scrollLeft: 50,
         rootWidth: 100,
         contentWidth: 200,
         translateX: 19,
         isAnimating: true,
       });
       foundation.incrementScroll(5);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCTabScrollerFoundation.cssClasses.ANIMATING);
     });

  it('#incrementScrollImmediate() exits early if increment is 0', () => {
    const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
    foundation.incrementScrollImmediate(0);
    expect(mockAdapter.setScrollAreaScrollLeft)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('#incrementScrollImmediate() exits early if increment puts the scrollLeft over the max value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
       foundation.incrementScrollImmediate(10);
       expect(mockAdapter.setScrollAreaScrollLeft)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#incrementScrollImmediate() exits early if increment puts the scrollLeft below the min value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 0});
       foundation.incrementScrollImmediate(-10);
       expect(mockAdapter.setScrollAreaScrollLeft)
           .not.toHaveBeenCalledWith(jasmine.any(Number));
     });

  it('#incrementScrollImmediate() increases the scrollLeft value by the given value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
       foundation.incrementScrollImmediate(11);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(134);
     });

  it('#incrementScrollImmediate() increases the scrollLeft value by the given value up to the max scroll value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest(
           {scrollLeft: 99, rootWidth: 100, contentWidth: 200});
       foundation.incrementScrollImmediate(2);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(100);
     });

  it('#incrementScrollImmediate() decreases the scrollLeft value by the given value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
       foundation.incrementScrollImmediate(-11);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(112);
     });

  it('#incrementScrollImmediate() decreases the scrollLeft value by the given value down to the min scroll value',
     () => {
       const {foundation, mockAdapter} = setupScrollToTest(
           {scrollLeft: 1, rootWidth: 100, contentWidth: 200});
       foundation.incrementScrollImmediate(-2);
       expect(mockAdapter.setScrollAreaScrollLeft).toHaveBeenCalledWith(0);
     });

  // RTL Mode
  function setupScrollToRTLTest() {
    const {foundation, mockAdapter, opts} = setupScrollToTest();
    mockAdapter.getScrollContentStyleValue.withArgs('direction')
        .and.returnValue('rtl');
    mockAdapter.computeScrollAreaClientRect.and.returnValue(
        {right: opts.rootWidth});
    mockAdapter.computeScrollContentClientRect.and.returnValue(
        {right: opts.contentWidth});
    return {foundation, mockAdapter};
  }

  it('#scrollTo() sets the scrollLeft property in RTL', () => {
    const {foundation, mockAdapter} = setupScrollToRTLTest();
    foundation.scrollTo(10);
    expect(mockAdapter.setScrollAreaScrollLeft)
        .toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('#scrollTo() sets the transform style property in RTL', () => {
    const {foundation, mockAdapter} = setupScrollToRTLTest();
    foundation.scrollTo(10);
    expect(mockAdapter.setScrollContentStyleProperty)
        .toHaveBeenCalledWith('transform', 'translateX(690px)');
  });

  it('#incrementScroll() sets the scrollLeft property in RTL', () => {
    const {foundation, mockAdapter} = setupScrollToRTLTest();
    foundation.incrementScroll(-10);
    expect(mockAdapter.setScrollAreaScrollLeft)
        .toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('#incrementScroll() sets the transform style property in RTL', () => {
    const {foundation, mockAdapter} = setupScrollToRTLTest();
    foundation.incrementScroll(-10);
    expect(mockAdapter.setScrollContentStyleProperty)
        .toHaveBeenCalledWith('transform', 'translateX(10px)');
  });

  it('#getScrollPosition() returns a numeric scroll position in RTL', () => {
    const {foundation} = setupScrollToRTLTest();
    expect(foundation.getScrollPosition()).toEqual(jasmine.any(Number));
  });

  // RTLScroller
  function setupNegativeScroller() {
    const {foundation, mockAdapter} = setupTest();
    const rootWidth = 200;
    const contentWidth = 1000;
    let scrollLeft = 0;
    mockAdapter.getScrollAreaOffsetWidth.and.callFake(() => rootWidth);
    mockAdapter.getScrollContentOffsetWidth.and.callFake(() => contentWidth);
    mockAdapter.getScrollAreaScrollLeft.and.callFake(() => scrollLeft);
    mockAdapter.setScrollAreaScrollLeft.withArgs(jasmine.any(Number))
        .and.callFake((newScrollLeft: number) => {
          scrollLeft = newScrollLeft;
        });
    mockAdapter.computeScrollAreaClientRect.and.callFake(() => {
      return {right: rootWidth};
    });
    mockAdapter.computeScrollContentClientRect.and.callFake(() => {
      return {right: rootWidth - scrollLeft};
    });
    return {foundation, mockAdapter};
  }

  it('#getRTLScroller() returns an instance of MDCTabScrollerRTLNegative',
     () => {
       const {foundation} = setupNegativeScroller();
       expect(foundation.getRTLScroller())
           .toEqual(jasmine.any(MDCTabScrollerRTLNegative));
     });

  function setupReverseScroller() {
    const {foundation, mockAdapter} = setupTest();
    const rootWidth = 200;
    const contentWidth = 1000;
    let scrollLeft = 0;
    mockAdapter.getScrollAreaOffsetWidth.and.callFake(() => rootWidth);
    mockAdapter.getScrollContentOffsetWidth.and.callFake(() => contentWidth);
    mockAdapter.getScrollAreaScrollLeft.and.callFake(() => scrollLeft);
    mockAdapter.setScrollAreaScrollLeft.withArgs(jasmine.any(Number))
        .and.callFake((newScrollLeft: number) => {
          scrollLeft = Math.max(newScrollLeft, scrollLeft);
        });
    mockAdapter.computeScrollAreaClientRect.and.callFake(() => {
      return {right: rootWidth};
    });
    mockAdapter.computeScrollContentClientRect.and.callFake(() => {
      return {right: rootWidth - scrollLeft};
    });
    return {foundation, mockAdapter};
  }

  it('#getRTLScroller() returns an instance of MDCTabScrollerRTLReverse',
     () => {
       const {foundation} = setupReverseScroller();
       expect(foundation.getRTLScroller())
           .toEqual(jasmine.any(MDCTabScrollerRTLReverse));
     });

  function setupDefaultScroller() {
    const {foundation, mockAdapter} = setupTest();
    const rootWidth = 200;
    const contentWidth = 1000;
    let scrollLeft = 800;
    mockAdapter.getScrollAreaOffsetWidth.and.callFake(() => rootWidth);
    mockAdapter.getScrollContentOffsetWidth.and.callFake(() => contentWidth);
    mockAdapter.getScrollAreaScrollLeft.and.callFake(() => scrollLeft);
    mockAdapter.setScrollAreaScrollLeft.withArgs(jasmine.any(Number))
        .and.callFake((newScrollLeft: number) => {
          scrollLeft = newScrollLeft;
        });
    mockAdapter.computeScrollAreaClientRect.and.callFake(() => {
      return {right: rootWidth};
    });
    mockAdapter.computeScrollContentClientRect.and.callFake(() => {
      return {right: contentWidth - scrollLeft};
    });
    return {foundation, mockAdapter};
  }

  it('#getRTLScroller() returns an instance of MDCTabScrollerRTLDefault',
     () => {
       const {foundation} = setupDefaultScroller();
       expect(foundation.getRTLScroller())
           .toEqual(jasmine.any(MDCTabScrollerRTLDefault));
     });
});
