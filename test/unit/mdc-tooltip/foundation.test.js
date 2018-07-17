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

import MDCTooltipFoundation from '../../../packages/mdc-tooltip/foundation';
import cssClasses from '../../../packages/mdc-tooltip/constants';

const controllerPos = {width: 200, height: 100, top: 50, left: 130};
const tooltipPos = {width: 100, height: 25};

function setupTest() {
  const mockAdapter = td.object(MDCTooltipFoundation.defaultAdapter);
  td.when(mockAdapter.getClassList()).thenReturn([]);
  td.when(mockAdapter.getRootWidth()).thenReturn(tooltipPos.width);
  td.when(mockAdapter.getRootHeight()).thenReturn(tooltipPos.height);
  td.when(mockAdapter.getControllerHeight()).thenReturn(controllerPos.height);
  td.when(mockAdapter.getControllerWidth()).thenReturn(controllerPos.width);
  td.when(mockAdapter.getControllerBoundingRect()).thenReturn(controllerPos);

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
    'addClass', 'removeClass', 'getClassList', 'getRootWidth', 'getRootHeight', 'getControllerWidth',
    'getControllerHeight', 'getControllerBoundingRect', 'setStyle',
  ]);
  // Test default methods
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

test('#hide sets display flag to false', () => {
  const {foundation} = setupTest();
  foundation.hide();
  assert.isOk(foundation.displayed_ === false);
});

test('after a certain timeout show_() should be called', () => {
  const {foundation} = setupTest();
  // reducing delay to make sure the show_() branch is called
  foundation.showDelay = 2;
  foundation.showDelayed();
  setTimeout(() => {
    assert.isOk(foundation.displayed_);
  }, foundation.showDelay + 5);
});

test('in case the hide flag is true the show delay is canceled', () => {
  const {foundation} = setupTest();
  // reducing delay to make sure the show_() branch is called
  foundation.showDelay = 2;
  foundation.showDelayed();
  foundation.checkHideFlag_ = true;
  setTimeout(() => {
    assert.isOk(!foundation.displayed_);
  }, foundation.showDelay + 5);
});

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
  foundation.show();
  const expect = 150 + foundation.gap;
  td.verify(mockAdapter.setStyle('top', expect.toString() + 'px'));
});

test('#show_ correct position on direction = top', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_TOP]);
  foundation.show();
  const expect = 25 - foundation.gap;
  td.verify(mockAdapter.setStyle('top', expect.toString() + 'px'));
});

test('#show_ correct position on direction = right', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_RIGHT]);
  foundation.show();
  const expect = 330 + foundation.gap;
  td.verify(mockAdapter.setStyle('left', expect.toString() + 'px'));
});

test('#show_ correct position on direction = left', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_LEFT]);
  foundation.show();
  const expect = 30 - foundation.gap;
  td.verify(mockAdapter.setStyle('left', expect.toString() + 'px'));
});

test('#show_ correct position on direction = undefined', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getClassList()).thenReturn([cssClasses.DIRECTION_LEFT]);
  foundation.show();
  const expect = 30 - foundation.gap;
  td.verify(mockAdapter.setStyle('left', expect.toString() + 'px'));
});

test('#handleTouchStart shows tooltip delayed', () => {
  const {foundation} = setupTest();
  foundation.handleTouchStart();
  // reducing delay to make sure the show_() branch is called
  foundation.showDelay = 0;
  foundation.showDelayed();
  setTimeout(() => {
    assert.isOk(foundation.displayed_);
  }, foundation.showDelay + 2);
});

test('#handleFocus shows tooltip delayed', () => {
  const {foundation} = setupTest();
  foundation.handleFocus();
  // reducing delay to make sure the show_() branch is called
  foundation.showDelay = 0;
  foundation.showDelayed();
  setTimeout(() => {
    assert.isOk(foundation.displayed_);
  }, foundation.showDelay + 2);
});

test('#handleMouseEnter shows tooltip delayed', () => {
  const {foundation} = setupTest();
  foundation.handleMouseEnter();
  // reducing delay to make sure the show_() branch is called
  foundation.showDelay = 0;
  foundation.showDelayed();
  setTimeout(() => {
    assert.isOk(foundation.displayed_);
  }, foundation.showDelay + 2);
});

test('#handleTouchEnd hides tooltip', () => {
  const {foundation} = setupTest();
  foundation.handleTouchEnd();
  assert.isOk(!foundation.displayed_);
});

test('#handleBlur hides tooltip', () => {
  const {foundation} = setupTest();
  foundation.handleBlur();
  assert.isOk(!foundation.displayed_);
});

test('#handleMouseLeave hides tooltip', () => {
  const {foundation} = setupTest();
  foundation.handleMouseLeave();
  assert.isOk(!foundation.displayed_);
});

test('#handleClick hides tooltip', () => {
  const {foundation} = setupTest();
  foundation.handleClick();
  assert.isOk(!foundation.displayed_);
});

test('#destroy clears timeout', () => {
  const {foundation} = setupTest();
  foundation.showDelay = 1000;
  foundation.showDelayed();
  foundation.destroy();
  assert.isOk(foundation.showTimeout_ === null);
});