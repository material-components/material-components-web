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

suite('MDCSliderFoundation - keyboard events');

function createFakeEvent(info = {}) {
  return Object.assign({
    preventDefault: td.func('evt.preventDefault'),
  }, info);
}

test('on arrow left keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowLeft'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on arrow left keydown decreases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowLeft'}));
  raf.flush();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));

  raf.restore();
});

test('on arrow left keydown decreases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setStep(10);
  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowLeft'}));
  raf.flush();

  assert.equal(foundation.getValue(), 40);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.4)'));

  raf.restore();
});

test('on arrow left increases the slider value when in an RTL context', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowLeft'}));
  raf.flush();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));

  raf.restore();
});

test('on arrow left keydown works with keyCode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 37}));
  raf.flush();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));

  raf.restore();
});

test('on arrow up keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowUp'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on arrow up keydown increases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowUp'}));
  raf.flush();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));

  raf.restore();
});

test('on arrow up keydown increases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setStep(10);
  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowUp'}));
  raf.flush();

  assert.equal(foundation.getValue(), 60);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(60px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.6)'));

  raf.restore();
});

test('on arrow up keydown works with keyCode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 38}));
  raf.flush();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));

  raf.restore();
});

test('on arrow right keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowRight'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on arrow right keydown increases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowRight'}));
  raf.flush();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));

  raf.restore();
});

test('on arrow right keydown increases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setStep(10);
  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowRight'}));
  raf.flush();

  assert.equal(foundation.getValue(), 60);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(60px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.6)'));

  raf.restore();
});

test('on arrow right decreases the slider value when in an RTL context', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowRight'}));
  raf.flush();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));

  raf.restore();
});

test('on arrow right keydown works with keyCode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 39}));
  raf.flush();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));

  raf.restore();
});

test('on arrow down keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowDown'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on arrow down keydown decreases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowDown'}));
  raf.flush();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));

  raf.restore();
});

test('on arrow down keydown decreases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setStep(10);
  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowDown'}));
  raf.flush();

  assert.equal(foundation.getValue(), 40);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.4)'));

  raf.restore();
});

test('on arrow down keydown works with keyCode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 37}));
  raf.flush();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));

  raf.restore();
});

test('on home keydown prevents default', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'Home'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on home keydown sets the slider to the minimum value', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'Home'}));
  raf.flush();

  assert.equal(foundation.getValue(), 0);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(0px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0)'));

  raf.restore();
});

test('on home keydown works with keyCode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 36}));
  raf.flush();

  assert.equal(foundation.getValue(), 0);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(0px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0)'));

  raf.restore();
});

test('on end keydown prevents default', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'End'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on end keydown sets the slider to the maximum value', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'End'}));
  raf.flush();

  assert.equal(foundation.getValue(), 100);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(100px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(1)'));

  raf.restore();
});

test('on end keydown works with keyCode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 35}));
  raf.flush();

  assert.equal(foundation.getValue(), 100);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(100px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(1)'));

  raf.restore();
});

test('on page up keydown prevents default', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'PageUp'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on page up keydown increases the slider by 4 when no step given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'PageUp'}));
  raf.flush();

  assert.equal(foundation.getValue(), 54);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(54px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.54)'));

  raf.restore();
});

test('on page up keydown increases the slider by 4 * the step value when a step is given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  foundation.setStep(5);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'PageUp'}));
  raf.flush();

  assert.equal(foundation.getValue(), 70);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(70px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.7)'));

  raf.restore();
});

test('on page up keydown works with keycode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 33}));
  raf.flush();

  assert.equal(foundation.getValue(), 54);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(54px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.54)'));

  raf.restore();
});

test('on page down keydown prevents default', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'PageDown'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  rootHandlers.keydown(evt);
  raf.flush();

  td.verify(evt.preventDefault());

  raf.restore();
});

test('on page down keydown increases the slider by 4 when no step given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'PageDown'}));
  raf.flush();

  assert.equal(foundation.getValue(), 46);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(46px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.46)'));

  raf.restore();
});

test('on page down keydown increases the slider by 4 * the step value when a step is given', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  foundation.setStep(5);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({key: 'PageDown'}));
  raf.flush();

  assert.equal(foundation.getValue(), 30);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(30px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.3)'));

  raf.restore();
});

test('on page down keydown works with keycode', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(createFakeEvent({keyCode: 34}));
  raf.flush();

  assert.equal(foundation.getValue(), 46);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(46px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.46)'));

  raf.restore();
});

test('on any other keydown does nothing', () => {
  const {foundation, mockAdapter, raf, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'Enter'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  raf.flush();

  foundation.setValue(50);
  raf.flush();

  rootHandlers.keydown(evt);

  td.verify(evt.preventDefault(), {times: 0});
  assert.equal(foundation.getValue(), 50);
});
