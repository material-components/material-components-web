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

import {getCorrectPropertyName} from '../../../packages/mdc-animation';
import {verifyDefaultAdapter} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';

import {cssClasses} from '../../../packages/mdc-slider/constants';
import MDCSliderFoundation from '../../../packages/mdc-slider/foundation';

suite('MDCSliderFoundation');

const TRANSFORM_PROP = getCorrectPropertyName(window, 'transform');

test('exports cssClasses', () => {
  assert.property(MDCSliderFoundation, 'cssClasses');
});

test('exports strings', () => {
  assert.property(MDCSliderFoundation, 'strings');
});

test('exports numbers', () => {
  assert.property(MDCSliderFoundation, 'numbers');
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSliderFoundation, [
    'hasClass', 'addClass', 'removeClass', 'getAttribute', 'setAttribute', 'removeAttribute',
    'computeBoundingRect', 'getTabIndex', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerThumbContainerInteractionHandler', 'deregisterThumbContainerInteractionHandler',
    'registerBodyInteractionHandler', 'deregisterBodyInteractionHandler', 'registerResizeHandler',
    'deregisterResizeHandler', 'notifyInput', 'notifyChange', 'setThumbContainerStyleProperty',
    'setTrackStyleProperty', 'setMarkerValue', 'appendTrackMarkers', 'removeTrackMarkers',
    'setLastTrackMarkersStyleProperty', 'isRTL',
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

test('#constructor sets the default slider step to 0 (no step)', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getStep(), 0);
});

test('#constructor sets the default disabled state to enabled', () => {
  const {foundation} = setupTest();
  assert.isFalse(foundation.isDisabled());
});

test('#init registers all necessary event handlers for the component', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 0, left: 0});
  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('keydown', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('focus', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('blur', isA(Function)));
  td.verify(mockAdapter.registerThumbContainerInteractionHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.registerThumbContainerInteractionHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.registerThumbContainerInteractionHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.registerResizeHandler(isA(Function)));

  raf.restore();
});

test('#init checks if slider is discrete and if display track markers', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 100, left: 200});
  foundation.init();

  raf.flush();

  td.verify(mockAdapter.hasClass(cssClasses.IS_DISCRETE));
  td.verify(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER));

  raf.restore();
});

test('#init sets step to one if slider is discrete but step is zero', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 100, left: 200});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  foundation.init();

  raf.flush();

  assert.equal(foundation.getStep(), 1);

  raf.restore();
});

test('#init performs an initial layout of the component', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {anything} = td.matchers;

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 100, left: 200});
  foundation.init();

  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(anything(), anything()));
  td.verify(mockAdapter.setTrackStyleProperty(anything(), anything()));

  raf.restore();
});

test('#destroy deregisters all component event handlers registered during init()', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keydown', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('focus', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('blur', isA(Function)));
  td.verify(mockAdapter.deregisterThumbContainerInteractionHandler('mousedown', isA(Function)));
  td.verify(mockAdapter.deregisterThumbContainerInteractionHandler('pointerdown', isA(Function)));
  td.verify(mockAdapter.deregisterThumbContainerInteractionHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.deregisterResizeHandler(isA(Function)));
});

test('#setupTrackMarker appends correct number of markers to discrete slider with markers', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(true);
  foundation.init();
  raf.flush();

  const numMarkers = 10;
  foundation.setMax(100);
  foundation.setMin(0);
  foundation.setStep(10);
  foundation.setupTrackMarker();

  td.verify(mockAdapter.removeTrackMarkers());
  td.verify(mockAdapter.appendTrackMarkers(numMarkers));

  raf.restore();
});

test('#setupTrackMarker append one excessive marker if distance is indivisible to step', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(true);
  foundation.init();
  raf.flush();

  const numMarkers = 12;
  foundation.setMax(100);
  foundation.setMin(0);
  foundation.setStep(9);
  foundation.setupTrackMarker();

  td.verify(mockAdapter.removeTrackMarkers());
  td.verify(mockAdapter.appendTrackMarkers(numMarkers));

  raf.restore();
});

test('#setupTrackMarker does execute if it is continuous slider', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setMax(100);
  foundation.setMin(0);
  foundation.setStep(10);
  foundation.setupTrackMarker();

  td.verify(mockAdapter.removeTrackMarkers(), {times: 0});
  td.verify(mockAdapter.appendTrackMarkers(isA(Number)), {times: 0});

  raf.restore();
});

test('#setupTrackMarker does execute if discrete slider does not display markers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(false);
  foundation.init();
  raf.flush();

  foundation.setMax(100);
  foundation.setMin(0);
  foundation.setStep(10);
  foundation.setupTrackMarker();

  td.verify(mockAdapter.removeTrackMarkers(), {times: 0});
  td.verify(mockAdapter.appendTrackMarkers(isA(Number)), {times: 0});

  raf.restore();
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
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));

  foundation.layout();
  raf.flush();
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'));

  raf.restore();
});

test('#getValue/#setValue retrieves / sets the max value, respectively', () => {
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

test('#setValue does nothing if the value being set is the same as the current value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  td.verify(
    mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(50px) translateX(-50%)'),
    {times: 1});

  raf.restore();
});

test('#setValue quantizes the given value to the nearest step value when a step is set', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setStep(1);

  foundation.setValue(2.4);
  assert.equal(foundation.getValue(), 2);

  foundation.setValue(2.6);
  assert.equal(foundation.getValue(), 3);

  raf.restore();
});

test('#setValue does not quantize the given value if the value is set to the minimum value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setMin(5);
  foundation.setStep(10);
  foundation.setValue(5);

  assert.equal(foundation.getValue(), 5);

  raf.restore();
});

test('#setValue does not quantize the given value if the value is set to the maximum value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setMax(102);
  foundation.setStep(20);
  foundation.setValue(102);

  assert.equal(foundation.getValue(), 102);

  raf.restore();
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

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(75px) translateX(-50%)'));

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

  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.75)'));

  raf.restore();
});

test('#setValue respects the width of the slider when setting the thumb container transform', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 200});
  foundation.init();
  raf.flush();

  foundation.setValue(75);
  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(150px) translateX(-50%)'));

  raf.restore();
});

test('#setValue flips the slider thumb position across the X-axis when in an RTL context', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setValue(75);
  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(25px) translateX(-50%)'));

  raf.restore();
});

test('#setValue adds the mdc-slider--off class when set to the minimum value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 200});
  foundation.init();
  raf.flush();

  // Change the value so that setting the value back to zero won't be short-circuited
  foundation.setValue(10);
  raf.flush();

  foundation.setValue(0);
  raf.flush();

  // Called once on init(), once when the value is set
  td.verify(mockAdapter.addClass(cssClasses.OFF), {times: 2});

  raf.restore();
});

test('#setValue removes the mdc-slider--off class when not set to the minimum value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 200});
  foundation.init();
  raf.flush();

  // Change the value so that setting the value back to zero won't be short-circuited
  foundation.setValue(10);
  raf.flush();

  td.verify(mockAdapter.removeClass(cssClasses.OFF));

  raf.restore();
});

test('#setValue does not cause any events to be fired', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 0, left: 0});
  foundation.init();
  raf.flush();

  foundation.setValue(20);

  td.verify(mockAdapter.notifyInput(), {times: 0});
  td.verify(mockAdapter.notifyChange(), {times: 0});

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
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.5)'));

  foundation.setMax(50);
  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(100px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(1)'));

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

test('#setMax re-renders track markers if slider is discrete and displays markers', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {isA} = td.matchers;

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setMax(50);

  td.verify(mockAdapter.removeTrackMarkers());
  td.verify(mockAdapter.appendTrackMarkers(isA(Number)));

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
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.1)'));

  foundation.setMin(10);
  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(0px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0)'));

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

test('#setMin re-renders track markers if slider is discrete and displays markers', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {isA} = td.matchers;

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setMin(10);

  td.verify(mockAdapter.removeTrackMarkers());
  td.verify(mockAdapter.appendTrackMarkers(isA(Number)));

  raf.restore();
});

test('#getStep/#setStep retrieves / sets the step value, respectively', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  foundation.setStep(2);
  assert.equal(foundation.getStep(), 2);

  raf.restore();
});

test('#setStep allows floating-point values to be used as step values', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setStep(0.2);

  foundation.setValue(0.46);
  assert.equal(foundation.getValue(), 0.4);

  foundation.setValue(1.52);
  assert.equal(foundation.getValue(), 1.6);

  raf.restore();
});

test('#setStep throws if the step value given is less than 0', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  foundation.init();
  raf.flush();

  assert.throws(() => foundation.setStep(-1));

  raf.restore();
});

test('#setStep set discrete slider step to 1 if the provided step is invalid', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 0});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setStep(0.5);

  assert.equal(foundation.getStep(), 1);

  raf.restore();
});

test('#setStep updates the slider\'s UI when altering the step value', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(9.8);
  raf.flush();
  // Sanity check
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.098)'));

  foundation.setStep(1);
  raf.flush();

  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(10px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.1)'));

  raf.restore();
});

test('#setStep re-renders track markers if slider is discrete and displays markers', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const {isA} = td.matchers;

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.hasClass(cssClasses.IS_DISCRETE)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.HAS_TRACK_MARKER)).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setStep(10);

  td.verify(mockAdapter.removeTrackMarkers());
  td.verify(mockAdapter.appendTrackMarkers(isA(Number)));

  raf.restore();
});

test('#isDisabled/#setDisabled retrieves / sets the disabled state, respectively', () => {
  const {foundation} = setupTest();
  foundation.setDisabled(true);

  assert.isTrue(foundation.isDisabled());
});

test('#setDisabled adds the mdc-slider--disabled class when given true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);

  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled adds "aria-disabled=true" when given true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);

  td.verify(mockAdapter.setAttribute('aria-disabled', 'true'));
});

test('#setDisabled removes the tabindex attribute when given true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);

  td.verify(mockAdapter.removeAttribute('tabindex'));
});

test('#setDisabled removes the mdc-slider--disabled class when given false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);

  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#setDisabled removes the "aria-disabled" attribute when given false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);

  td.verify(mockAdapter.removeAttribute('aria-disabled'));
});

test('#setDisabled restores any previously set tabindices when given false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getTabIndex()).thenReturn(0);

  // Save the mock tab index set above
  foundation.setDisabled(true);

  foundation.setDisabled(false);

  td.verify(mockAdapter.setAttribute('tabindex', '0'));
});

test('#setDisabled does not touch the tabindex property if no previous tabindex saved when given false', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setDisabled(false);

  td.verify(mockAdapter.setAttribute('tabindex', td.matchers.anything()), {times: 0});
});
