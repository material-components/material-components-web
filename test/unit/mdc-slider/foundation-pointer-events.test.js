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

import {getCorrectEventName} from '../../../packages/mdc-animation';

import {cssClasses} from '../../../packages/mdc-slider/constants';
import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - pointer events');

const TRANSITION_END_EVT = getCorrectEventName(window, 'transitionend');

createTestSuiteForPointerEvents('mousedown', 'mousemove', 'mouseup');
createTestSuiteForPointerEvents('pointerdown', 'pointermove', 'pointerup');
createTestSuiteForPointerEvents('touchstart', 'touchmove', 'touchend', (pageX) => ({targetTouches: [{pageX}]}));

function createTestSuiteForPointerEvents(downEvt, moveEvt, upEvt, pageXObj = (pageX) => ({pageX})) {
  test(`on ${downEvt} sets the value of the slider using the X coordinate of the event`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    assert.equal(foundation.getValue(), 50);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.5)'));

    raf.restore();
  });

  test(`on ${downEvt} offsets the value by the X position of the slider element`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 10, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    assert.equal(foundation.getValue(), 40);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.4)'));

    raf.restore();
  });

  test(`on ${downEvt} takes RTL into account when computing the slider\'s value using the X ` +
       'coordinate of the event', () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.isRTL()).thenReturn(true);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(25));
    raf.flush();

    assert.equal(foundation.getValue(), 75);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.75)'));

    raf.restore();
  });

  test(`on ${downEvt} adds the mdc-slider--active class to the root element`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    td.verify(mockAdapter.addClass(cssClasses.ACTIVE));

    raf.restore();
  });

  test(`on ${downEvt} adds mdc-slider--in-transit class to the root element if the thumb container ` +
       'isn\'t the target', () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    td.verify(mockAdapter.addClass(cssClasses.IN_TRANSIT));

    raf.restore();
  });

  test(`on ${downEvt} does not add mdc-slider--in-transit class to the root element if the thumb container ` +
       'is the target', () => {
    const {foundation, mockAdapter, raf, thumbContainerHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    thumbContainerHandlers[downEvt](pageXObj(2));
    raf.flush();

    td.verify(mockAdapter.addClass(cssClasses.IN_TRANSIT), {times: 0});

    raf.restore();
  });

  test(`on ${downEvt} removes the mdc-slider--in-transit class when the thumb container finishes transitioning`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, thumbContainerHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(2));
    raf.flush();

    // Sanity check
    td.verify(mockAdapter.addClass(cssClasses.IN_TRANSIT));

    thumbContainerHandlers[TRANSITION_END_EVT]();
    td.verify(mockAdapter.removeClass(cssClasses.IN_TRANSIT));

    raf.restore();
  });

  test(`on ${downEvt} notifies the client of an input event`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    td.verify(mockAdapter.notifyInput());

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider pin value marker to change value`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    td.verify(mockAdapter.setMarkerValue(isA(Number)));

    raf.restore();
  });

  test(`on ${downEvt} attaches event handlers for ${moveEvt} and all *up/end events to the document body`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    td.verify(mockAdapter.registerBodyInteractionHandler(moveEvt, isA(Function)));
    td.verify(mockAdapter.registerBodyInteractionHandler('mouseup', isA(Function)));
    td.verify(mockAdapter.registerBodyInteractionHandler('pointerup', isA(Function)));
    td.verify(mockAdapter.registerBodyInteractionHandler('touchend', isA(Function)));
    raf.restore();
  });

  test('on ${downEvt} does nothing if the component is disabled', () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {anything} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const valueBeforeEvent = foundation.getValue();
    foundation.setDisabled(true);

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();

    assert.equal(foundation.getValue(), valueBeforeEvent);
    td.verify(mockAdapter.addClass(cssClasses.ACTIVE), {times: 0});
    // These should only happen once during initialization
    td.verify(mockAdapter.setThumbContainerStyleProperty(anything(), anything()), {times: 1});
    td.verify(mockAdapter.setTrackStyleProperty(anything(), anything()), {times: 1});

    raf.restore();
  });

  test(`on body ${moveEvt} prevents default behavior`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();
    const preventDefault = td.func('evt.preventDefault');

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](
      Object.assign({preventDefault}, pageXObj(50))
    );
    raf.flush();

    td.verify(preventDefault());

    raf.restore();
  });

  test(`on body ${moveEvt} updates the slider\'s value based on the X coordinate of the event`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    raf.flush();

    assert.equal(foundation.getValue(), 50);
    td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.5)'));

    raf.restore();
  });

  test(`on body ${moveEvt} notifies the client of an input event`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    raf.flush();

    // Once on mousedown, once on mousemove
    td.verify(mockAdapter.notifyInput(), {times: 2});

    raf.restore();
  });

  test(`on body ${moveEvt} notifies discrete slider pin value marker to change value`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    raf.flush();

    // Once on mousedown, once on mousemove
    td.verify(mockAdapter.setMarkerValue(isA(Number)), {times: 2});

    raf.restore();
  });

  test(`on body ${upEvt} removes the mdc-slider--active class from the component`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();
    bodyHandlers[upEvt]();

    td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));

    raf.restore();
  });

  test(`on body ${upEvt} removes the ${moveEvt} and all *up/end event handlers from the document body`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();
    bodyHandlers[upEvt]();

    td.verify(mockAdapter.deregisterBodyInteractionHandler(moveEvt, isA(Function)));
    td.verify(mockAdapter.deregisterBodyInteractionHandler('mouseup', isA(Function)));
    td.verify(mockAdapter.deregisterBodyInteractionHandler('pointerup', isA(Function)));
    td.verify(mockAdapter.deregisterBodyInteractionHandler('touchend', isA(Function)));

    raf.restore();
  });

  test(`on body ${upEvt} notifies the client of a change event`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(50));
    raf.flush();
    bodyHandlers[upEvt]();

    td.verify(mockAdapter.notifyChange());

    raf.restore();
  });
}
