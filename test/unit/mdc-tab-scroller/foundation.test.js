/**
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

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabScrollerFoundation from '../../../packages/mdc-tab-scroller/foundation';
import MDCTabScrollerRTLDefault from '../../../packages/mdc-tab-scroller/rtl-default-scroller';
import MDCTabScrollerRTLNegative from '../../../packages/mdc-tab-scroller/rtl-negative-scroller';
import MDCTabScrollerRTLReverse from '../../../packages/mdc-tab-scroller/rtl-reverse-scroller';

suite('MDCTabScrollerFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabScrollerFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabScrollerFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabScrollerFoundation, [
    'registerScrollAreaEventHandler', 'deregisterScrollAreaEventHandler',
    'addScrollAreaClass', 'removeScrollAreaClass',
    'setScrollContentStyleProperty', 'getScrollContentStyleValue',
    'setScrollAreaScrollLeft', 'getScrollAreaScrollLeft',
    'getScrollContentOffsetWidth', 'getScrollAreaOffsetWidth',
    'computeScrollAreaClientRect', 'computeScrollContentClientRect',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabScrollerFoundation);

test('#computeCurrentScrollPosition() returns scroll value when transform is none', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn('none');
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(0);
  assert.strictEqual(foundation.computeCurrentScrollPosition(), 0);
});

test('#computeCurrentScrollPosition() returns difference between scrollLeft and translateX', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn('matrix(1, 0, 0, 0, 101, 0)');
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(212);
  assert.strictEqual(foundation.computeCurrentScrollPosition(), 111);
});

test('#handleInteraction() does nothing if should not handle interaction', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler(
    td.matchers.isA(String), td.matchers.isA(Function)), {times: 0});
  td.verify(mockAdapter.removeScrollAreaClass(td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
});

function setupHandleInteractionTest({scrollLeft=0, translateX=99}={}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(scrollLeft);
  foundation.shouldHandleInteraction_ = true;
  foundation.isAnimating_ = true;
  return {foundation, mockAdapter};
}

test('#handleInteraction() deregisters the transitionend handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
});

test('#handleInteraction() deregisters the interaction handlers', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('wheel', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
});

test(`#handleInteraction() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.removeScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING), {times: 1});
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

test('#handleTransitionEnd() deregisters the transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the scroll handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('wheel', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the touchstart handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('touchstart', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the pointerdown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('pointerdown', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the mousedown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('mousedown', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the keydown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('keydown', td.matchers.isA(Function)));
});

test(`#handleTransitionEnd() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
});

function setupScrollToTest({rootWidth=300, contentWidth=1000, scrollLeft=0, translateX=0, isAnimating=false}={}) {
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
  const raf = createMockRaf();
  foundation.scrollTo(100);
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.addScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING), {times: 1});
});

test('#scrollTo() registers a transitionend handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.registerScrollAreaEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() deregisters the wheel handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('wheel', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() deregisters the touchstart handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() deregisters the pointerdown handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() deregisters the mousedown handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() deregisters the keydown handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() deregisters handlers before registering them', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const callQueue = [];
  td.when(mockAdapter.deregisterScrollAreaEventHandler(
    td.matchers.isA(String), td.matchers.isA(Function))).thenDo(() => callQueue.push('deregister'));
  td.when(mockAdapter.registerScrollAreaEventHandler(td.matchers.isA(String), td.matchers.isA(Function))).thenDo(() => {
    callQueue.push('register');
  });
  foundation.scrollTo(100);
  assert.isAbove(callQueue.indexOf('register'), callQueue.indexOf('deregister'));
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

test('#scrollTo() deregisters the transitionend handler if called during an animation', () => {
  const {foundation, mockAdapter} = setupScrollToTest({
    scrollLeft: 50,
    rootWidth: 100,
    contentWidth: 200,
    translateX: 19,
    isAnimating: true,
  });
  foundation.scrollTo(75);
  td.verify(mockAdapter.removeScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
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
    td.verify(mockAdapter.removeScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
  }
);

test('#scrollTo() unsets the transform property in a rAF', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const raf = createMockRaf();
  foundation.scrollTo(212);
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'none'), {times: 1});
});

function setupScrollToInteractionTest(...args) {
  const {foundation, mockAdapter} = setupScrollToTest(...args);
  const raf = createMockRaf();
  return {foundation, mockAdapter, raf};
}

test('#scrollTo() registers a scroll handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerScrollAreaEventHandler('wheel', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a touchstart handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerScrollAreaEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a pointerdown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerScrollAreaEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a mousedown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerScrollAreaEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a keydown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerScrollAreaEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
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

test('#incrementScroll() deregisters the transitionend handler if called during an animation', () => {
  const {foundation, mockAdapter} = setupScrollToTest({
    scrollLeft: 50,
    rootWidth: 100,
    contentWidth: 200,
    translateX: 19,
    isAnimating: true,
  });
  foundation.incrementScroll(5);
  td.verify(mockAdapter.removeScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
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
    td.verify(mockAdapter.removeScrollAreaClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
  }
);

test('#incrementScroll() registers interaction handlers in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.incrementScroll(20);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerScrollAreaEventHandler('wheel', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.registerScrollAreaEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.registerScrollAreaEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.registerScrollAreaEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
  td.verify(mockAdapter.registerScrollAreaEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
});

test('on transitionend after scrollTo call, deregister the transitionend handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const handlers = captureHandlers(mockAdapter, 'registerScrollAreaEventHandler');
  foundation.scrollTo(213);
  handlers.transitionend();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('transitionend', td.matchers.isA(Function)));
});

function setupInteractionDuringScrollTest({translateX=66.123}={}) {
  const {foundation, mockAdapter} = setupScrollToTest();
  const raf = createMockRaf();
  const handlers = captureHandlers(mockAdapter, 'registerScrollAreaEventHandler');
  td.when(mockAdapter.getScrollContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  return {foundation, mockAdapter, raf, handlers};
}

test('on interaction after scrollTo call, deregister the interaction handlers', () => {
  const {foundation, mockAdapter, raf, handlers} = setupInteractionDuringScrollTest();
  foundation.scrollTo(101);
  raf.flush();
  raf.flush();
  raf.restore();
  handlers.wheel();
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('wheel', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('pointerdown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterScrollAreaEventHandler('keydown', td.matchers.isA(Function)));
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
  foundation.scrollTo(-10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)));
});

test('#scrollTo() sets the transform style property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.scrollTo(-10);
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'translateX(690px)'), {times: 1});
});

test('#incrementScroll() sets the scrollLeft property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.incrementScroll(-10);
  td.verify(mockAdapter.setScrollAreaScrollLeft(td.matchers.isA(Number)));
});

test('#incrementScroll() sets the transform style property in RTL', () => {
  const {foundation, mockAdapter} = setupScrollToRTLTest();
  foundation.incrementScroll(10);
  td.verify(mockAdapter.setScrollContentStyleProperty('transform', 'translateX(10px)'), {times: 1});
});

test('#computeCurrentScrollPosition() returns a numeric scroll position in RTL', () => {
  const {foundation} = setupScrollToRTLTest();
  assert.typeOf(foundation.computeCurrentScrollPosition(), 'number');
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
