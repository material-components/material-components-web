/**
 * @license
 * Copyright 2017 Google Inc.
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

import {getCorrectEventName} from '../../../packages/mdc-animation/index.ts';

import {cssClasses} from '../../../packages/mdc-slider/constants';
import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - pointer events');

const TRANSITION_END_EVT = getCorrectEventName(window, 'transitionend');

createTestSuiteForPointerEvents('mousedown', 'mousemove', 'mouseup');
createTestSuiteForPointerEvents('pointerdown', 'pointermove', 'pointerup');
createTestSuiteForPointerEvents('touchstart', 'touchmove', 'touchend', (pageX) => ({targetTouches: [{pageX}]}));

function createTestSuiteForPointerEvents(downEvt, moveEvt, upEvt, pageXObj = (pageX) => ({pageX})) {
  test(`on ${downEvt} sets the value of the slider using the X coordinate of the event`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    assert.equal(foundation.getValue(), 50);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.5)'));
  });

  test(`on ${downEvt} sets the value of the slider using the X coordinate of the event and horizontal scroll`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 30, width: 100});
    window.pageXOffset = 25;
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(100));
    clock.runToFrame();

    assert.equal(foundation.getValue(), 45);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(45px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.45)'));
    window.pageXOffset = 0;
  });

  test(`on ${downEvt} offsets the value by the X position of the slider element`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 10, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    assert.equal(foundation.getValue(), 40);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.4)'));
  });

  test(`on ${downEvt} takes RTL into account when computing the slider\'s value using the X ` +
       'coordinate of the event', () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.isRTL()).thenReturn(true);
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(25));
    clock.runToFrame();

    assert.equal(foundation.getValue(), 75);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.75)'));
  });

  test(`on ${downEvt} adds the mdc-slider--active class to the root element`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    td.verify(mockAdapter.addClass(cssClasses.ACTIVE));
  });

  test(`on ${downEvt} adds mdc-slider--in-transit class to the root element if the thumb container ` +
       'isn\'t the target', () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    td.verify(mockAdapter.addClass(cssClasses.IN_TRANSIT));
  });

  test(`on ${downEvt} does not add mdc-slider--in-transit class to the root element if the thumb container ` +
       'is the target', () => {
    const {foundation, mockAdapter, clock, thumbContainerHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    thumbContainerHandlers[downEvt](pageXObj(2));
    clock.runToFrame();

    td.verify(mockAdapter.addClass(cssClasses.IN_TRANSIT), {times: 0});
  });

  test(`on ${downEvt} removes the mdc-slider--in-transit class when the thumb container finishes transitioning`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, thumbContainerHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(2));
    clock.runToFrame();

    // Sanity check
    td.verify(mockAdapter.addClass(cssClasses.IN_TRANSIT));

    thumbContainerHandlers[TRANSITION_END_EVT]();
    td.verify(mockAdapter.removeClass(cssClasses.IN_TRANSIT));
  });

  test(`on ${downEvt} notifies the client of an input event`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    td.verify(mockAdapter.notifyInput());
  });

  test(`on ${downEvt} notifies discrete slider pin value marker to change value`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    td.verify(mockAdapter.setMarkerValue(isA(Number)));
  });

  test(`on ${downEvt} attaches event handlers for ${moveEvt} and all *up/end events to the document body`, () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    td.verify(mockAdapter.registerBodyInteractionHandler(moveEvt, isA(Function)));
    td.verify(mockAdapter.registerBodyInteractionHandler('mouseup', isA(Function)));
    td.verify(mockAdapter.registerBodyInteractionHandler('pointerup', isA(Function)));
    td.verify(mockAdapter.registerBodyInteractionHandler('touchend', isA(Function)));
  });

  test('on ${downEvt} does nothing if the component is disabled', () => {
    const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
    const {anything} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    const valueBeforeEvent = foundation.getValue();
    foundation.setDisabled(true);

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();

    assert.equal(foundation.getValue(), valueBeforeEvent);
    td.verify(mockAdapter.addClass(cssClasses.ACTIVE), {times: 0});
    // These should only happen once during initialization
    td.verify(mockAdapter.setThumbContainerStyleProperty(anything(), anything()), {times: 1});
    td.verify(mockAdapter.setTrackStyleProperty(anything(), anything()), {times: 1});
  });

  test(`on body ${moveEvt} prevents default behavior`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();
    const preventDefault = td.func('evt.preventDefault');

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](
      Object.assign({preventDefault}, pageXObj(50))
    );
    clock.runToFrame();

    td.verify(preventDefault());
  });

  test(`on body ${moveEvt} updates the slider\'s value based on the X coordinate of the event`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    clock.runToFrame();

    assert.equal(foundation.getValue(), 50);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.5)'));
  });

  test(`on body ${moveEvt} notifies the client of an input event`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    clock.runToFrame();

    // Once on mousedown, once on mousemove
    td.verify(mockAdapter.notifyInput(), {times: 2});
  });

  test(`on body ${moveEvt} notifies discrete slider pin value marker to change value`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    clock.runToFrame();

    // Once on mousedown, once on mousemove
    td.verify(mockAdapter.setMarkerValue(isA(Number)), {times: 2});
  });

  test(`on body ${upEvt} removes the mdc-slider--active class from the component`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();
    bodyHandlers[upEvt]();

    td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));
  });

  test(`on body ${upEvt} removes the ${moveEvt} and all *up/end event handlers from the document body`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();
    bodyHandlers[upEvt]();

    td.verify(mockAdapter.deregisterBodyInteractionHandler(moveEvt, isA(Function)));
    td.verify(mockAdapter.deregisterBodyInteractionHandler('mouseup', isA(Function)));
    td.verify(mockAdapter.deregisterBodyInteractionHandler('pointerup', isA(Function)));
    td.verify(mockAdapter.deregisterBodyInteractionHandler('touchend', isA(Function)));
  });

  test(`on body ${upEvt} notifies the client of a change event`, () => {
    const {foundation, mockAdapter, clock, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    clock.runToFrame();

    rootHandlers[downEvt](pageXObj(50));
    clock.runToFrame();
    bodyHandlers[upEvt]();

    td.verify(mockAdapter.notifyChange());
  });
}
