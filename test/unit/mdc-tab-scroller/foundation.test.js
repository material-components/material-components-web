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

suite('MDCTabScrollerFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabScrollerFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabScrollerFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabScrollerFoundation, [
    'registerEventHandler', 'deregisterEventHandler',
    'addClass', 'removeClass',
    'setContentStyleProperty', 'getContentStyleValue',
    'setScrollLeft', 'getScrollLeft',
    'getContentOffsetWidth', 'getOffsetWidth',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabScrollerFoundation);

test('#computeCurrentScrollPosition() returns scroll value when transform is none', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn('none');
  td.when(mockAdapter.getScrollLeft()).thenReturn(0);
  assert.strictEqual(foundation.computeCurrentScrollPosition(), 0);
});

test('#computeCurrentScrollPosition() returns difference between scrollLeft and translateX', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn('matrix(1, 0, 0, 0, 101, 0)');
  td.when(mockAdapter.getScrollLeft()).thenReturn(212);
  assert.strictEqual(foundation.computeCurrentScrollPosition(), 111);
});

test('#calculateSafeScrollValue_() returns 0 when given a negative value', () => {
  const {foundation} = setupTest();
  assert.strictEqual(foundation.calculateSafeScrollValue_(-1), 0);
});

test('#calculateSafeScrollValue_() returns the given value when less than max scroll value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentOffsetWidth()).thenReturn(1000);
  td.when(mockAdapter.getOffsetWidth()).thenReturn(100);
  assert.strictEqual(foundation.calculateSafeScrollValue_(101), 101);
});

test('#calculateSafeScrollValue_() returns the max scroll value when greater than max scroll value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentOffsetWidth()).thenReturn(1000);
  td.when(mockAdapter.getOffsetWidth()).thenReturn(100);
  assert.strictEqual(foundation.calculateSafeScrollValue_(901), 900);
});

test('#handleInteraction() does nothing if should not handle interaction', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler(td.matchers.isA(String), td.matchers.isA(Function)), {times: 0});
  td.verify(mockAdapter.removeClass(td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
});

function setupHandleInteractionTest({scrollLeft=0, translateX=99}={}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  td.when(mockAdapter.getScrollLeft()).thenReturn(scrollLeft);
  foundation.shouldHandleInteraction_ = true;
  foundation.isAnimating_ = true;
  return {foundation, mockAdapter};
}

test('#handleInteraction() deregisters the transitionend handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
});

test('#handleInteraction() deregisters the scroll handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler('scroll', td.matchers.isA(Function)), {times: 1});
});

test('#handleInteraction() deregisters the touchstart handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
});

test('#handleInteraction() deregisters the pointerdown handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
});

test('#handleInteraction() deregisters the mousedown handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
});

test('#handleInteraction() deregisters the keydown handler', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.deregisterEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
});

test(`#handleInteraction() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING), {times: 1});
});

test('#handleInteraction() sets the transform property to translateX(0px)', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest();
  foundation.handleInteraction();
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(0px)'), {times: 1});
});

test('#handleInteraction() sets scrollLeft to the difference between scrollLeft and translateX', () => {
  const {foundation, mockAdapter} = setupHandleInteractionTest({scrollLeft: 123, translateX: 101});
  foundation.handleInteraction();
  td.verify(mockAdapter.setScrollLeft(22), {times: 1});
});

test('#handleTransitionEnd() deregisters the transitionend handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the scroll handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('scroll', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the touchstart handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('touchstart', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the pointerdown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('pointerdown', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the mousedown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('mousedown', td.matchers.isA(Function)));
});

test('#handleTransitionEnd() deregisters the keydown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.deregisterEventHandler('keydown', td.matchers.isA(Function)));
});

test(`#handleTransitionEnd() removes the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
});

function setupScrollToTest({rootWidth=300, contentWidth=1000, scrollLeft=0, translateX=0, isAnimating=false}={}) {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getOffsetWidth()).thenReturn(rootWidth);
  td.when(mockAdapter.getContentOffsetWidth()).thenReturn(contentWidth);
  td.when(mockAdapter.getScrollLeft()).thenReturn(scrollLeft);
  foundation.isAnimating_ = isAnimating;
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  return {foundation, mockAdapter};
}

test('#scrollTo() exits early if difference between scrollX and scrollLeft is 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 66});
  foundation.scrollTo(66);
  td.verify(mockAdapter.setContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#scrollTo() scrolls to 0 if scrollX is less than 0', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 1});
  foundation.scrollTo(-999);
  td.verify(mockAdapter.setScrollLeft(0), {times: 1});
});

test('#scrollTo() scrolls to the max scrollable size if scrollX is greater than the max scrollable value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({rootWidth: 212, contentWidth: 1000});
  foundation.scrollTo(900);
  td.verify(mockAdapter.setScrollLeft(788), {times: 1});
});

test('#scrollTo() sets the content transform style property to the difference between scrollX and scrollLeft', () => {
  const {foundation, mockAdapter} = setupScrollToTest({rootWidth: 300, contentWidth: 1000, scrollLeft: 123});
  foundation.scrollTo(456);
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(333px)'), {times: 1});
});

test('#scrollTo() sets the scroll property to the computed scrollX', () => {
  const {foundation, mockAdapter} = setupScrollToTest({rootWidth: 300, contentWidth: 1000, scrollLeft: 5});
  foundation.scrollTo(111);
  td.verify(mockAdapter.setScrollLeft(111), {times: 1});
});

test(`#scrollTo() adds the ${MDCTabScrollerFoundation.cssClasses.ANIMATING} class in a rAF`, () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const raf = createMockRaf();
  foundation.scrollTo(100);
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING), {times: 1});
});

test('#scrollTo() registers a transitionend handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  foundation.scrollTo(100);
  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)), {times: 1});
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
  td.verify(mockAdapter.setScrollLeft(31), {times: 1});
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
  td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
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
  const raf = createMockRaf();
  foundation.scrollTo(212);
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.setContentStyleProperty('transform', 'none'), {times: 1});
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
  td.verify(mockAdapter.registerEventHandler('scroll', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a touchstart handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a pointerdown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a mousedown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
});

test('#scrollTo() registers a keydown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(313);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
});

test('#incrementScroll() exits early if increment puts the scrollLeft over the max value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 700});
  foundation.incrementScroll(10);
  td.verify(mockAdapter.setContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScroll() exits early if increment puts the scrollLeft below the min value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 0});
  foundation.incrementScroll(-10);
  td.verify(mockAdapter.setContentStyleProperty(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScroll() increases the scrollLeft value by the given value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
  foundation.incrementScroll(11);
  td.verify(mockAdapter.setScrollLeft(134), {times: 1});
});

test('#incrementScroll() increases the scrollLeft value by the given value up to the max scroll value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 99, rootWidth: 100, contentWidth: 200});
  foundation.incrementScroll(2);
  td.verify(mockAdapter.setScrollLeft(100), {times: 1});
});

test('#incrementScroll() decreases the scrollLeft value by the given value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 123});
  foundation.incrementScroll(-11);
  td.verify(mockAdapter.setScrollLeft(112), {times: 1});
});

test('#incrementScroll() decreases the scrollLeft value by the given value down to the min scroll value', () => {
  const {foundation, mockAdapter} = setupScrollToTest({scrollLeft: 1, rootWidth: 100, contentWidth: 200});
  foundation.incrementScroll(-2);
  td.verify(mockAdapter.setScrollLeft(0), {times: 1});
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
  td.verify(mockAdapter.setScrollLeft(28), {times: 1});
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
  td.verify(mockAdapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING));
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

test('#incrementScroll() registers a scroll handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.incrementScroll(20);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('scroll', td.matchers.isA(Function)), {times: 1});
});

test('#incrementScroll() registers a touchstart handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(20);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('touchstart', td.matchers.isA(Function)), {times: 1});
});

test('#incrementScroll() registers a pointerdown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.scrollTo(20);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('pointerdown', td.matchers.isA(Function)), {times: 1});
});

test('#incrementScroll() registers a mousedown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.incrementScroll(20);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('mousedown', td.matchers.isA(Function)), {times: 1});
});

test('#incrementScroll() registers a keydown handler in a double rAF', () => {
  const {foundation, mockAdapter, raf} = setupScrollToInteractionTest();
  foundation.incrementScroll(20);
  raf.flush();
  raf.flush();
  raf.restore();
  td.verify(mockAdapter.registerEventHandler('keydown', td.matchers.isA(Function)), {times: 1});
});

test('on transitionend after scrollTo call, deregister the transitionend handler', () => {
  const {foundation, mockAdapter} = setupScrollToTest();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  foundation.scrollTo(213);
  handlers.transitionend();
  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

function setupInteractionDuringScrollTest({translateX=66.123}={}) {
  const {foundation, mockAdapter} = setupScrollToTest();
  const raf = createMockRaf();
  const handlers = captureHandlers(mockAdapter, 'registerEventHandler');
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn(`matrix(1, 0, 0, 1, ${translateX}, 0)`);
  return {foundation, mockAdapter, raf, handlers};
}

test('on scroll after scrollTo call, deregister the scroll handler', () => {
  const {foundation, mockAdapter, raf, handlers} = setupInteractionDuringScrollTest();
  foundation.scrollTo(101);
  raf.flush();
  raf.flush();
  raf.restore();
  handlers.scroll();
  td.verify(mockAdapter.deregisterEventHandler('scroll', td.matchers.isA(Function)));
});

test('on touchstart after scrollTo call, deregister the touchstart handler', () => {
  const {foundation, mockAdapter, raf, handlers} = setupInteractionDuringScrollTest();
  foundation.scrollTo(101);
  raf.flush();
  raf.flush();
  raf.restore();
  handlers.touchstart();
  td.verify(mockAdapter.deregisterEventHandler('touchstart', td.matchers.isA(Function)));
});

test('on pointerdown after scrollTo call, deregister the pointerdown handler', () => {
  const {foundation, mockAdapter, raf, handlers} = setupInteractionDuringScrollTest();
  foundation.scrollTo(101);
  raf.flush();
  raf.flush();
  raf.restore();
  handlers.pointerdown();
  td.verify(mockAdapter.deregisterEventHandler('pointerdown', td.matchers.isA(Function)));
});

test('on mousedown after scrollTo call, deregister the mousedown handler', () => {
  const {foundation, mockAdapter, raf, handlers} = setupInteractionDuringScrollTest();
  foundation.scrollTo(101);
  raf.flush();
  raf.flush();
  raf.restore();
  handlers.mousedown();
  td.verify(mockAdapter.deregisterEventHandler('mousedown', td.matchers.isA(Function)));
});

test('on keydown after scrollTo call, deregister the keydown handler', () => {
  const {foundation, mockAdapter, raf, handlers} = setupInteractionDuringScrollTest();
  foundation.scrollTo(101);
  raf.flush();
  raf.flush();
  raf.restore();
  handlers.keydown();
  td.verify(mockAdapter.deregisterEventHandler('keydown', td.matchers.isA(Function)));
});
