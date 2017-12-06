/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {assert, expect} from 'chai';
import td from 'testdouble';
import {captureHandlers} from '../helpers/foundation';
import MDCTooltipFoundation from '../../../packages/mdc-tooltip/foundation';
import cssClasses from '../../../packages/mdc-tooltip/constants';

const tooltipShowEvents = ['focus', 'mouseenter', 'touchstart'];
const tooltipHideEvents = ['blur', 'mouseleave', 'touchend'];
const controllerListenerTypes = tooltipShowEvents.concat(tooltipHideEvents);

const controllerPos = {width: 200, height: 100, offsetTop: 50, offsetLeft: 130};
const tooltipPos = {width: 100, height: 25};

function setupTest() {
  const mockAdapter = td.object(MDCTooltipFoundation.defaultAdapter);
  td.when(mockAdapter.getClassList()).thenReturn([]);
  td.when(mockAdapter.computeBoundingRect()).thenReturn(tooltipPos);
  td.when(mockAdapter.computeControllerBoundingRect()).thenReturn(controllerPos);

  const foundation = new MDCTooltipFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

suite('MDCTooltipFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCTooltipFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  const {defaultAdapter} = MDCTooltipFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  assert.deepEqual(methods, [
    'addClass', 'removeClass', 'getClassList', 'computeBoundingRect', 'computeControllerBoundingRect',
    'setStyle', 'registerListener', 'deregisterListener', 'registerTransitionEndHandler',
    'deregisterTransitionEndHandler', 'registerWindowListener', 'deregisterWindowListener',
  ]);
  // Test default methods
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

test('#init registers all event listeners', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  for (let i = 0; i < controllerListenerTypes.length; i++) {
    td.verify(mockAdapter.registerListener(controllerListenerTypes[i], td.matchers.isA(Function)));
  }
  td.verify(mockAdapter.registerWindowListener('load', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerWindowListener('resize', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTransitionEndHandler(td.matchers.isA(Function)));
});

test('#destroy calls adapter.deregisterListener() with an event type and function 6 times', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterListener(isA(String), isA(Function)), {times: 6});
});

test('#destroy calls adapter.deregisterWindowListener() with an event type and function 2 times', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterWindowListener(isA(String), isA(Function)), {times: 2});
});

test('#destroy calls adapter.deregisterTransitionEndHandler() with an event type and function 2 times', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterTransitionEndHandler(isA(Function)), {times: 1});
});

test('#hide sets display flag to false and remove OPEN class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.hide_();
  assert.isOk(foundation.displayed_ === false);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

for (let i=0; i < tooltipShowEvents.length; i++) {
  test('Event ' + tooltipShowEvents[i] +'should show tooltip', () => {
    const {foundation, mockAdapter} = setupTest();
    const handlers = captureHandlers(mockAdapter, 'registerListener');
    foundation.init();
    handlers[tooltipShowEvents[i]]();
    td.verify(foundation.show_());
  });
}

for (let i=0; i < tooltipHideEvents.length; i++) {
  test('Event ' + tooltipHideEvents[i] +'should show tooltip', () => {
    const {foundation, mockAdapter} = setupTest();
    const handlers = captureHandlers(mockAdapter, 'registerListener');
    foundation.init();
    handlers[tooltipHideEvents[i]]();
    td.verify(foundation.hide_());
  });
}

test('#setDirection_ correct direction for bottom (default)', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([]);
  foundation.setDirection_();
  assert.isOk(foundation.direction_ === 'bottom');
});

test('#setDirection_ correct direction for bottom (class)', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_BOTTOM]);
  foundation.setDirection_();
  assert.isOk(foundation.direction_ === 'bottom');
});

test('#setDirection_ correct direction for top (class)', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_TOP]);
  foundation.setDirection_();
  assert.isOk(foundation.direction_ === 'top');
});

test('#setDirection_ correct direction for left (class)', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_LEFT]);
  foundation.setDirection_();
  assert.isOk(foundation.direction_ === 'left');
});

test('#setDirection_ correct direction for right (class)', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_RIGHT]);
  foundation.setDirection_();
  assert.isOk(foundation.direction_ === 'right');
});

test('#show_ correct position on direction = bottom', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.show_();
  const expect = 150 + foundation.gap;
  td.verify(mockAdapter.setStyle('top', expect.toString() + 'px'));
});

test('#show_ correct position on direction = top', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_TOP]);
  foundation.show_();
  const expect = 25 - foundation.gap;
  td.verify(mockAdapter.setStyle('top', expect.toString() + 'px'));
});

test('#show_ correct position on direction = right', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_RIGHT]);
  foundation.show_();
  const expect = 330 + foundation.gap;
  td.verify(mockAdapter.setStyle('left', expect.toString() + 'px'));
});

test('#show_ correct position on direction = left', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_LEFT]);
  foundation.show_();
  const expect = 30 - foundation.gap;
  td.verify(mockAdapter.setStyle('left', expect.toString() + 'px'));
});

test('#show_ if direction is unkown', () => {
  const {foundation} = setupTest();
  // Make setDirection_ function to do nothing
  foundation.setDirection_ = function() {};
  foundation.direction_ = 'foo';
  expect(function() {
    foundation.show_();
  }).to.throw(RangeError);
});

test('#resetTooltip_ should not do anything if tooltip is displayed', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.displayed_ = true;
  foundation.resetTooltip_();
  td.verify(mockAdapter.setStyle(td.matchers.anything()), {times: 0});
});

test('#resetTooltip_ should recenter the tooltip when tooltip is hidden', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.resetTooltip_();

  td.verify(mockAdapter.setStyle('top', '87.5px'));
  td.verify(mockAdapter.setStyle('left', '180px'));
});
