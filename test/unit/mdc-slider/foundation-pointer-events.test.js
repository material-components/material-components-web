/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {cssClasses} from '../../../packages/mdc-slider/constants';

import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - pointer events');

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
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(50)'));

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
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(40)'));

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
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(-75px) translateX(50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(75)'));

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

  test(`on ${downEvt} notifies discrete slider value label to change value`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(100));
    raf.flush();

    td.verify(mockAdapter.setValueLabelText(isA(String), isA(String)));

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider value label to change value when RTL`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    td.when(mockAdapter.isRTL()).thenReturn(true);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(100));
    raf.flush();

    td.verify(mockAdapter.setValueLabelText(isA(String), isA(String)));

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider value label to change path`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    td.when(mockAdapter.getCommaWidth()).thenReturn(3);
    td.when(mockAdapter.getDigitWidth()).thenReturn(9);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(100));
    raf.flush();

    td.verify(mockAdapter.setValueLabelPath(isA(String)));

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider value label to change path for big numbers on the right`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    td.when(mockAdapter.getCommaWidth()).thenReturn(3);
    td.when(mockAdapter.getDigitWidth()).thenReturn(9);
    foundation.init();
    raf.flush();

    foundation.setMax(100000);
    raf.flush();

    rootHandlers[downEvt](pageXObj(100));
    raf.flush();

    td.verify(mockAdapter.setValueLabelPath(isA(String)));

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider value label to change path for big numbers` +
       'on the right with RTL', () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    td.when(mockAdapter.isRTL()).thenReturn(true);
    td.when(mockAdapter.getCommaWidth()).thenReturn(3);
    td.when(mockAdapter.getDigitWidth()).thenReturn(9);
    foundation.init();
    raf.flush();

    foundation.setMax(100000);
    raf.flush();

    rootHandlers[downEvt](pageXObj(100));
    raf.flush();

    td.verify(mockAdapter.setValueLabelPath(isA(String)));

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider value label to change path for big numbers on the left`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    td.when(mockAdapter.getCommaWidth()).thenReturn(3);
    td.when(mockAdapter.getDigitWidth()).thenReturn(9);
    foundation.init();
    raf.flush();

    foundation.setMax(10000000);
    foundation.setMin(1000000);
    raf.flush();

    rootHandlers[downEvt](pageXObj(0));
    raf.flush();

    td.verify(mockAdapter.setValueLabelPath(isA(String)));

    raf.restore();
  });

  test(`on ${downEvt} notifies discrete slider value label to change path for big numbers on the left with RTL`, () => {
    const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    td.when(mockAdapter.getCommaWidth()).thenReturn(3);
    td.when(mockAdapter.getDigitWidth()).thenReturn(9);
    foundation.init();
    raf.flush();

    foundation.setMax(10000000);
    foundation.setMin(1000000);
    raf.flush();

    rootHandlers[downEvt](pageXObj(0));
    raf.flush();

    td.verify(mockAdapter.setValueLabelPath(isA(String)));

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

    td.verify(mockAdapter.registerBodyEventHandler(moveEvt, isA(Function)));
    td.verify(mockAdapter.registerBodyEventHandler('mouseup', isA(Function)));
    td.verify(mockAdapter.registerBodyEventHandler('pointerup', isA(Function)));
    td.verify(mockAdapter.registerBodyEventHandler('touchend', isA(Function)));
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
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(50)'));

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

  test(`on body ${moveEvt} notifies discrete slider value label to change value`, () => {
    const {foundation, mockAdapter, raf, rootHandlers, bodyHandlers} = setupTest();
    const {isA} = td.matchers;

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    td.when(mockAdapter.hasClass(cssClasses.DISCRETE)).thenReturn(true);
    foundation.init();
    raf.flush();

    rootHandlers[downEvt](pageXObj(49));
    bodyHandlers[moveEvt](Object.assign({
      preventDefault: () => {},
    }, pageXObj(50)));
    raf.flush();

    // Once on mousedown, once on mousemove
    td.verify(mockAdapter.setValueLabelText(isA(String), isA(String)), {times: 2});

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

    td.verify(mockAdapter.deregisterBodyEventHandler(moveEvt, isA(Function)));
    td.verify(mockAdapter.deregisterBodyEventHandler('mouseup', isA(Function)));
    td.verify(mockAdapter.deregisterBodyEventHandler('pointerup', isA(Function)));
    td.verify(mockAdapter.deregisterBodyEventHandler('touchend', isA(Function)));

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
