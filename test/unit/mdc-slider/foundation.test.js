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

import {getCorrectPropertyName} from '../../../packages/mdc-animation';
import {verifyDefaultAdapter} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';

import MDCSliderFoundation from '../../../packages/mdc-slider/foundation';

suite('MDCSliderFoundation');

const TRANSFORM_PROP = getCorrectPropertyName(window, 'transform');

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSliderFoundation, [
    'hasClass', 'addClass', 'removeClass', 'getAttribute', 'setAttribute', 'removeAttribute',
    'computeBoundingRect', 'registerEventHandler', 'deregisterEventHandler',
    'registerThumbEventHandler', 'deregisterThumbEventHandler',
    'registerBodyEventHandler', 'deregisterBodyEventHandler', 'registerWindowResizeHandler',
    'deregisterWindowResizeHandler', 'notifyInput', 'notifyChange', 'setThumbStyleProperty',
    'setTrackFillStyleProperty',
  ]);
});

const setupTest = () => setupFoundationTest(MDCSliderFoundation);

test('#constructor sets the default slider value to 0', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getValue(), 0);
});

test('#constructor sets the default slider max to 100', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getMax(), 100);
});

test('#constructor sets the default slider min to 0', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getMin(), 0);
});

test('#init registers all necessary event handlers for the component', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 0, left: 0});
  foundation.init();

  td.verify(mockAdapter.registerEventHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.registerEventHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.registerEventHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.registerThumbEventHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.registerThumbEventHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.registerThumbEventHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.registerWindowResizeHandler(isA(Function)));

  raf.restore();
});

test('#init performs an initial layout of the component', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {anything} = td.matchers;

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 100, left: 200});
  foundation.init();

  raf.flush();

  td.verify(mockAdapter.setThumbStyleProperty(anything(), anything()));
  td.verify(mockAdapter.setTrackFillStyleProperty(anything(), anything()));

  raf.restore();
});

test('#destroy deregisters all component event handlers registered during init()', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();

  td.verify(mockAdapter.deregisterEventHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.deregisterEventHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.deregisterThumbEventHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.deregisterThumbEventHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.deregisterThumbEventHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.deregisterWindowResizeHandler(isA(Function)));
});

test('#layout re-computes the bounding rect for the component on each call', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  let numComputations = 0;

  // NOTE: Using a counter for numComputations here since we do indeed need to stub
  // getComputedBoundingRect(), but verifying a stub gives a warning from testdouble
  // (rightfully so).
  td.when(mockAdapter.computeBoundingRect()).thenDo(() => {
    numComputations++;
    return /* dummy value */ {};
  });

  foundation.layout();
  foundation.layout();

  assert.equal(numComputations, 2);

  raf.restore();
});

test('#layout re-updates the UI for the current value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn(
    {left: 0, width: 50}, {left: 0, width: 100});

  foundation.init();
  raf.flush();

  const halfMaxValue = 50;
  foundation.setValue(halfMaxValue);
  raf.flush();
  // Sanity check
  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));

  foundation.layout();
  raf.flush();
  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));

  raf.restore();
});

test('#getValue/#setValue retrieves / sets the value, respectively', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setValue(10);
  assert.equal(foundation.getValue(), 10);

  raf.restore();
});

test('#getValue returns the current value of the slider (0 by default)', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getValue(), 0);
});

test('#setValue clamps the value to the minimum value if given value is less than the minimum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(foundation.getMin() - 1);

  assert.equal(foundation.getValue(), foundation.getMin());

  raf.restore();
});

test('#setValue clamps the value to the maximum value if given value is less than the maximum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(foundation.getMax() + 1);

  assert.equal(foundation.getValue(), foundation.getMax());

  raf.restore();
});

test('#setValue updates "aria-valuenow" with the current value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(10);

  td.verify(mockAdapter.setAttribute('aria-valuenow', '10'));

  raf.restore();
});

test('#setValue updates the slider thumb to represent the current value of the slider', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(75);
  raf.flush();

  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(75px) translateX(-50%)'));

  raf.restore();
});

test('#setValue updates the slider track to represent the current value of the slider', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(75);
  raf.flush();

  td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(75)'));

  raf.restore();
});

test('#setValue respects the width of the slider when setting the thumb transform', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 200});
  foundation.init();
  raf.flush();

  foundation.setValue(75);
  raf.flush();

  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(150px) translateX(-50%)'));

  raf.restore();
});

test('#getMax/#setMax retrieves / sets the maximum value, respectively', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setMax(50);
  assert.equal(foundation.getMax(), 50);

  raf.restore();
});

test('#setMax throws if the maximum value given is less than the minimum value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setMin(50);
  assert.throws(() => foundation.setMax(49));

  raf.restore();
});

test('#setMax clamps the value to the new maximum if above the new maximum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setValue(100);
  foundation.setMax(50);

  assert.equal(foundation.getValue(), 50);
  td.verify(mockAdapter.setAttribute('aria-valuenow', '50'));

  raf.restore();
});

test('#setMax updates the slider\'s UI when clamping the value to a new maximum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();
  // Sanity check
  td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(50)'));

  foundation.setMax(50);
  raf.flush();

  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(100px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(100)'));

  raf.restore();
});

test('#setMax updates "aria-valuemax" to the new maximum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setMax(50);

  td.verify(mockAdapter.setAttribute('aria-valuemax', '50'));

  raf.restore();
});

test('#getMin/#setMin retrieves / sets the minimum value, respectively', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setMin(10);
  assert.equal(foundation.getMin(), 10);

  raf.restore();
});

test('#setMin throws if the minimum value given is greater than the maximum value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setMax(10);
  assert.throws(() => foundation.setMin(11));

  raf.restore();
});

test('#setMin clamps the value to the new minimum if above the new minimum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setValue(5);
  foundation.setMin(10);

  assert.equal(foundation.getValue(), 10);
  td.verify(mockAdapter.setAttribute('aria-valuenow', '10'));

  raf.restore();
});

test('#setMin updates the slider\'s UI when clamping the value to a new minimum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(10);
  raf.flush();
  // Sanity check
  td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(10)'));

  foundation.setMin(10);
  raf.flush();

  td.verify(mockAdapter.setThumbStyleProperty(TRANSFORM_PROP, 'translateX(0px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackFillStyleProperty(TRANSFORM_PROP, 'scaleX(0)'));

  raf.restore();
});

test('#setMin updates "aria-valuemin" to the new minimum', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setMin(10);

  td.verify(mockAdapter.setAttribute('aria-valuemin', '10'));

  raf.restore();
});
