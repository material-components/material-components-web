/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - pointer events');

createTestSuiteForPointerEvents('mousedown', 'mousemove', 'mouseup');
createTestSuiteForPointerEvents('pointerdown', 'pointermove', 'pointerup');
createTestSuiteForPointerEvents('touchstart', 'touchmove', 'touchend', (pageX) => ({targetTouches: [{pageX}]}));

function createTestSuiteForPointerEvents(downEvt, moveEvt, upEvt, pageXObj = (pageX) => ({pageX})) {
  test(`on ${downEvt} sets the value of the slider using the X coordinate of the event`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 50,
    };
    foundation.handleInteractionStart(mockEvent);
    raf.flush();

    assert.equal(foundation.getValue(), 50);
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(50)'));

    raf.restore();
  });

  test(`on ${downEvt} offsets the value by the X position of the slider element`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 10, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 50,
    };
    foundation.handleInteractionStart(mockEvent);
    raf.flush();

    assert.equal(foundation.getValue(), 40);
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(40)'));

    raf.restore();
  });

  test(`on ${downEvt} notifies the client of an input event`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 50,
    };
    foundation.handleInteractionStart(mockEvent);
    raf.flush();

    td.verify(mockAdapter.notifyInput());

    raf.restore();
  });

  test(`on ${downEvt} assigns ${moveEvt} and ${upEvt} as acceptable variables`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 50,
    };
    foundation.handleInteractionStart(mockEvent);
    raf.flush();

    assert.equal(foundation.acceptableMoveEvent_, moveEvt);
    assert.equal(foundation.acceptableEndEvent_, upEvt);
    raf.restore();
  });

  test(`on body ${moveEvt} prevents default behavior`, () => {
    const {foundation, mockAdapter, raf} = setupTest();
    const preventDefault = td.func('evt.preventDefault');

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 49,

    };
    foundation.handleInteractionStart(mockEvent);
    let mockMoveEvent = {
      type: moveEvt,
      pageX: 50,
    };

    mockMoveEvent = Object.assign({preventDefault}, mockMoveEvent, pageXObj(50));
    foundation.handleInteractionMove(mockMoveEvent);
    raf.flush();

    td.verify(preventDefault());

    raf.restore();
  });

  test(`on body ${moveEvt} updates the slider\'s value based on the X coordinate of the event`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 49,
    };
    foundation.handleInteractionStart(mockEvent);
    let mockMoveEvent = {
      type: moveEvt,
      pageX: 50,
    };

    mockMoveEvent = Object.assign({
      preventDefault: () => {},
    }, mockMoveEvent);
    foundation.handleInteractionMove(mockMoveEvent);
    raf.flush();

    assert.equal(foundation.getValue(), 50);
    td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));
    td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(50)'));

    raf.restore();
  });

  test(`on body ${moveEvt} notifies the client of an input event`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 49,
    };
    foundation.handleInteractionStart(mockEvent);
    let mockMoveEvent = {
      type: moveEvt,
      pageX: 50,
    };

    mockMoveEvent = Object.assign({
      preventDefault: () => {},
    }, mockMoveEvent);
    foundation.handleInteractionMove(mockMoveEvent);
    raf.flush();

    // Once on mousedown, once on mousemove
    td.verify(mockAdapter.notifyInput(), {times: 2});

    raf.restore();
  });

  test(`on body ${upEvt} removes the ${moveEvt} and the ${upEvt} as acceptable events`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 50,
    };
    foundation.handleInteractionStart(mockEvent);
    raf.flush();

    assert.equal(foundation.acceptableMoveEvent_, moveEvt);
    assert.equal(foundation.acceptableEndEvent_, upEvt);

    const mockUpEvent = {
      type: upEvt,
    };
    foundation.handleInteractionEnd(mockUpEvent);

    assert.equal(foundation.acceptableMoveEvent_, '');
    assert.equal(foundation.acceptableEndEvent_, '');

    raf.restore();
  });

  test(`on body ${upEvt} notifies the client of a change event`, () => {
    const {foundation, mockAdapter, raf} = setupTest();

    td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
    foundation.init();
    raf.flush();

    const mockEvent = {
      type: downEvt,
      pageX: 50,
    };
    foundation.handleInteractionStart(mockEvent);
    raf.flush();

    const mockUpEvent = {
      type: upEvt,
    };
    foundation.handleInteractionEnd(mockUpEvent);

    td.verify(mockAdapter.notifyChange());

    raf.restore();
  });
}

test('on any other events assignMoveEndEvents does nothing', () => {
  const {foundation, mockAdapter, raf} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  const mockEvent = {
    type: 'foo',
    pageX: 50,
  };
  foundation.handleInteractionStart(mockEvent);
  raf.flush();

  assert.equal(foundation.acceptableMoveEvent_, '');
  assert.equal(foundation.acceptableEndEvent_, '');

  raf.restore();
});
