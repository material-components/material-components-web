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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {install as installClock} from '../helpers/clock';
import {setupFoundationTest} from '../helpers/setup';
import {MDCTabScrollerFoundation} from '../../../packages/mdc-tab-scroller/foundation';
import {MDCTabScrollerRTLDefault} from '../../../packages/mdc-tab-scroller/rtl-default-scroller';
import {MDCTabScrollerRTLNegative} from '../../../packages/mdc-tab-scroller/rtl-negative-scroller';
import {MDCTabScrollerRTLReverse} from '../../../packages/mdc-tab-scroller/rtl-reverse-scroller';

suite('MDCTabScrollerFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabScrollerFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabScrollerFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabScrollerFoundation, [
    'eventTargetMatchesSelector',
    'addClass', 'removeClass', 'addScrollAreaClass',
    'setScrollAreaStyleProperty', 'setScrollContentStyleProperty', 'getScrollContentStyleValue',
    'setScrollAreaScrollLeft', 'getScrollAreaScrollLeft',
    'getScrollContentOffsetWidth', 'getScrollAreaOffsetWidth',
    'computeScrollAreaClientRect', 'computeScrollContentClientRect', 'computeHorizontalScrollbarHeight',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabScrollerFoundation);

test('#getScrollPosition() returns scroll value when transform is none', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn('none');
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(0);
  assert.strictEqual(foundation.getScrollPosition(), 0);
});

test('#getScrollPosition() returns difference between scrollLeft and translateX', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn('matrix(1, 0, 0, 0, 101, 0)');
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(212);
  assert.strictEqual(foundation.getScrollPosition(), 111);
});

test('#handleInteraction() does nothing if should not handle interaction', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.removeClass(td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
});

function setupHandleInteractionTest({scrollLeft=0, translateX=99}={}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(scrollLeft);
  foundation.isAnimating_ = true;
  return {foundation, mockAdapter};
}

test(`#handleInteraction() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING), {times: 1});
});

test('#handleInteraction() sets the transform property to translateX(0px)', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'translateX(0px)'), {times: 1});
});

test('#handleInteraction() sets scrollLeft to the difference between scrollLeft and translateX', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest({scrollLeft: 123, translateX: 101});
  foundation.handleInteraction();
  td.verify(mockAdapter.setScrollAreaScrollLeft(22), {times: 1});
});

test('#handleTransitionEnd() does nothing if should not handle transition', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd({
    target: {},
  });
  td.verify(mockAdapter.removeClass(td.matchers.isA(String)), {times: 0});
});

test(`#handleTransitionEnd() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest({scrollLeft: 123, translateX: 101});
  td.when(mockAdapter.eventTargetMatchesSelector(td.matchers.isA(Object), td.matchers.isA(String))).thenReturn(true);
  foundation.handleTransitionEnd({
    target: {},
  });
  td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
});

function setupScrollToTest({
  rootWidth=300,
  contentWidth=1000,
  scrollLeft=0,
  translateX=0,
  isAnimating=false}={}) {
  const opts = {
    rootWidth,
    contentWidth,
    scrollLeft,
    translateX,
    isAnimating,
  };
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollAreaOffsetWidth()).thenReturn(rootWidth);
  td.when(mockAdapter.getScrollContentOffsetWidth()).thenReturn(contentWidth);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(scrollLeft);
  foundation.isAnimating_ = isAnimating;
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  return {foundation, mockAdapter, opts};
}

test('#scrollTo() exits early if difference between scrollX and scrollLeft is 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 66});
  foundation.scrollTo(66);
  td.verify(mockAdapter.setScrollContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#scrollTo() scrolls to 0 if scrollX is less than 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 1});
  foundation.scrollTo(-999);
  td.verify(mockAdapter.setScrollAreaScrollLeft(0), {times: 1});
});

test('#scrollTo() scrolls to the max scrollable size if scrollX is greater than the max scrollable value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({rootWidth: 212, contentWidth: 1000});
  foundation.scrollTo(900);
  td.verify(mockAdapter.setScrollAreaScrollLeft(788), {times: 1});
});

test('#scrollTo() sets the content transform style property to the difference between scrollX and scrollLeft', () => {
  const {foundation, mockAdapter} = setupScrollToTest({rootWidth: 300, contentWidth: 1000, scrollLeft: 123});
  foundation.scrollTo(456);
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'translateX(333px)'), {times: 1});
});

test('#scrollTo() sets the scroll property to the computed scrollX', () => {
  const {foundation, mockAdapter} = setupScrollToTest({rootWidth: 300, contentWidth: 1000, scrollLeft: 5});
  foundation.scrollTo(111);
  td.verify(mockAdapter.setScrollAreaScrollLeft(111), {times: 1});
});

test(`#scrollTo() adds the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class in a rAF`, () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const clock = installClock();
  foundation.scrollTo(100);
  clock.runToFrame();
  td.verify(mockAdapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING), {times: 1});
});

test('#scrollTo() sets scrollLeft to the visual scroll position if called during an animation', () => {
  const {foundation, mockAdapter} = setupScrollToTest({
    scrollLeft: 50,
    rootWidth: 100,
    contentWidth: 200,
    translateX: 19,
    isAnimating: true,
  });
  foundation.scrollTo(33);
  td.verify(mockAdapter.setScrollAreaScrollLeft(31), {times: 1});
});

test(`#scrollTo() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} if called during an animation`,
  () => {
    const {foundation, mockAdapter} = setupScrollToTest({
      scrollLeft: 50,
      rootWidth: 100,
      contentWidth: 200,
      translateX: 19,
      isAnimating: true,
    });
    foundation.scrollTo(60);
    td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
  }
);

test('#scrollTo() unsets the transform property in a rAF', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const clock = installClock();
  foundation.scrollTo(212);
  clock.runToFrame();
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'none'), {times: 1});
});

test('#incrementScroll() exits early if increment is 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
  foundation.incrementScroll(0);
  td.verify(mockAdapter.setScrollContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScroll() exits early if increment puts the scrollLeft over the max value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
  foundation.incrementScroll(10);
  td.verify(mockAdapter.setScrollContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScroll() exits early if increment puts the scrollLeft below the min value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 0});
  foundation.incrementScroll(-10);
  td.verify(mockAdapter.setScrollContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScroll() increases the scrollLeft value by the given value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
  foundation.incrementScroll(11);
  td.verify(mockAdapter.setScrollAreaScrollLeft(134), {times: 1});
});

test('#incrementScroll() increases the scrollLeft value by the given value up to the max scroll value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 99, rootWidth: 100, contentWidth: 200});
  foundation.incrementScroll(2);
  td.verify(mockAdapter.setScrollAreaScrollLeft(100), {times: 1});
});

test('#incrementScroll() decreases the scrollLeft value by the given value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
  foundation.incrementScroll(-11);
  td.verify(mockAdapter.setScrollAreaScrollLeft(112), {times: 1});
});

test('#incrementScroll() decreases the scrollLeft value by the given value down to the min scroll value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 1, rootWidth: 100, contentWidth: 200});
  foundation.incrementScroll(-2);
  td.verify(mockAdapter.setScrollAreaScrollLeft(0), {times: 1});
});

test('#incrementScroll() sets scrollLeft to the visual scroll position if called during an animation', () => {
  const {foundation, mockAdapter} = setupScrollToTest({
    scrollLeft: 50,
    rootWidth: 100,
    contentWidth: 200,
    translateX: 22,
    isAnimating: true,
  });
  foundation.incrementScroll(10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(28), {times: 1});
});

test(`#incrementScroll() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} if called during an animation`,
  () => {
    const {foundation, mockAdapter} = setupScrollToTest({
      scrollLeft: 50,
      rootWidth: 100,
      contentWidth: 200,
      translateX: 19,
      isAnimating: true,
    });
    foundation.incrementScroll(5);
    td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
  }
);

test('#incrementScrollImmediate() exits early if increment is 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
  foundation.incrementScrollImmediate(0);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScrollImmediate() exits early if increment puts the scrollLeft over the max value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
  foundation.incrementScrollImmediate(10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScrollImmediate() exits early if increment puts the scrollLeft below the min value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 0});
  foundation.incrementScrollImmediate(-10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScrollImmediate() increases the scrollLeft value by the given value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
  foundation.incrementScrollImmediate(11);
  td.verify(mockAdapter.setScrollAreaScrollLeft(134), {times: 1});
});

test('#incrementScrollImmediate() increases the scrollLeft value by the given value up to the max scroll value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 99, rootWidth: 100, contentWidth: 200});
  foundation.incrementScrollImmediate(2);
  td.verify(mockAdapter.setScrollAreaScrollLeft(100), {times: 1});
});

test('#incrementScrollImmediate() decreases the scrollLeft value by the given value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
  foundation.incrementScrollImmediate(-11);
  td.verify(mockAdapter.setScrollAreaScrollLeft(112), {times: 1});
});

test('#incrementScrollImmediate() decreases the scrollLeft value by the given value down to the min scroll value',
  () => {
    const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 1, rootWidth: 100, contentWidth: 200});
    foundation.incrementScrollImmediate(-2);
    td.verify(mockAdapter.setScrollAreaScrollLeft(0), {times: 1});
  });

// RTL Mode

function setupScrollToRTLTest() {
  const {foundation, mockAdapter, opts} = setupScrollToTest();
  td.when(mockAdapter.getScrollContentStyleValue('direction')).thenReturn('rtl');
  td.when(mockAdapter.computeScrollAreaClientRect()).thenReturn({right: opts.rootWidth});
  td.when(mockAdapter.computeScrollContentClientRect()).thenReturn({right: opts.contentWidth});
  return {foundation, mockAdapter};
}

test('#scrollTo() sets the scrollLeft property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.scrollTo(10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)));
});

test('#scrollTo() sets the transform style property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.scrollTo(10);
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'translateX(690px)'), {times: 1});
});

test('#incrementScroll() sets the scrollLeft property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.incrementScroll(-10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)));
});

test('#incrementScroll() sets the transform style property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.incrementScroll(-10);
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'translateX(10px)'), {times: 1});
});

test('#getScrollPosition() returns a numeric scroll position in RTL', () => {
  const {foundation} = setupScrollToRTLTest();
  assert.typeOf(foundation.getScrollPosition(), 'number');
});

// RTLScroller

function setupNegativeScroller() {
  const {foundation, mockAdapter} = setupTest();
  const rootWidth = 200;
  const contentWidth = 1000;
  let scrollLeft = 0;
  td.when(mockAdapter.getScrollAreaOffsetWidth()).thenDo(() => rootWidth);
  td.when(mockAdapter.getScrollContentOffsetWidth()).thenDo(() => contentWidth);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenDo(() => scrollLeft);
  td.when(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number))).thenDo(
    (newScrollLeft) => scrollLeft = newScrollLeft);
  td.when(mockAdapter.computeScrollAreaClientRect()).thenDo(() => {
    return {right: rootWidth};
  });
  td.when(mockAdapter.computeScrollContentClientRect()).thenDo(() => {
    return {right: rootWidth - scrollLeft};
  });
  return {foundation, mockAdapter};
}

test('#getRTLScroller() returns an instance of MDCTabScrollerRTLNegative', () => {
  const {foundation} = setupNegativeScroller();
  assert.instanceOf(foundation.getRTLScroller(), MDCTabScrollerRTLNegative);
});

function setupReverseScroller() {
  const {foundation, mockAdapter} = setupTest();
  const rootWidth = 200;
  const contentWidth = 1000;
  let scrollLeft = 0;
  td.when(mockAdapter.getScrollAreaOffsetWidth()).thenDo(() => rootWidth);
  td.when(mockAdapter.getScrollContentOffsetWidth()).thenDo(() => contentWidth);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenDo(() => scrollLeft);
  td.when(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number))).thenDo((newScrollLeft) => {
    scrollLeft = Math.max(newScrollLeft, scrollLeft);
  });
  td.when(mockAdapter.computeScrollAreaClientRect()).thenDo(() => {
    return {right: rootWidth};
  });
  td.when(mockAdapter.computeScrollContentClientRect()).thenDo(() => {
    return {right: rootWidth - scrollLeft};
  });
  return {foundation, mockAdapter};
}

test('#getRTLScroller() returns an instance of MDCTabScrollerRTLReverse', () => {
  const {foundation} = setupReverseScroller();
  assert.instanceOf(foundation.getRTLScroller(), MDCTabScrollerRTLReverse);
});

function setupDefaultScroller() {
  const {foundation, mockAdapter} = setupTest();
  const rootWidth = 200;
  const contentWidth = 1000;
  let scrollLeft = 800;
  td.when(mockAdapter.getScrollAreaOffsetWidth()).thenDo(() => rootWidth);
  td.when(mockAdapter.getScrollContentOffsetWidth()).thenDo(() => contentWidth);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenDo(() => scrollLeft);
  td.when(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number))).thenDo((newScrollLeft) => {
    scrollLeft = newScrollLeft;
  });
  td.when(mockAdapter.computeScrollAreaClientRect()).thenDo(() => {
    return {right: rootWidth};
  });
  td.when(mockAdapter.computeScrollContentClientRect()).thenDo(() => {
    return {right: contentWidth - scrollLeft};
  });
  return {foundation, mockAdapter};
}

test('#getRTLScroller() returns an instance of MDCTabScrollerRTLDefault', () => {
  const {foundation} = setupDefaultScroller();
  assert.instanceOf(foundation.getRTLScroller(), MDCTabScrollerRTLDefault);
});
