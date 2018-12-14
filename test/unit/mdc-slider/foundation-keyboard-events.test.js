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

import {TRANSFORM_PROP, setupEventTest as setupTest} from './helpers';

suite('MDCSliderFoundation - keyboard events');

function createFakeEvent(info = {}) {
  return Object.assign({
    preventDefault: td.func('evt.preventDefault'),
  }, info);
}

test('on arrow left keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowLeft'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on arrow left keydown decreases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowLeft'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});

test('on arrow left keydown decreases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setStep(10);
  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowLeft'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 40);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.4)'));
});

test('on arrow left increases the slider value when in an RTL context', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowLeft'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});

test('on arrow left keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 37}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});

test('on arrow left keydown works with non-standard IE key propery backed with proper keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'Left', keyCode: 37}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});


test('on arrow up keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowUp'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on arrow up keydown increases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowUp'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});

test('on arrow up keydown increases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setStep(10);
  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowUp'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 60);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(60px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.6)'));
});

test('on arrow up keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 38}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});

test('on arrow up keydown works with non-standard IE key propery backed with proper keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'Up', keyCode: 38}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});


test('on arrow right keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowRight'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on arrow right keydown increases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowRight'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});

test('on arrow right keydown increases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setStep(10);
  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowRight'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 60);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(60px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.6)'));
});

test('on arrow right decreases the slider value when in an RTL context', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  td.when(mockAdapter.isRTL()).thenReturn(true);
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowRight'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});

test('on arrow right keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 39}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});

test('on arrow right keydown works with non-standard IE key propery backed with proper keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'Right', keyCode: 39}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 51);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(51px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.51)'));
});


test('on arrow down keydown prevents the default behavior', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'ArrowDown'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on arrow down keydown decreases the slider value by 1 when no step given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowDown'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});

test('on arrow down keydown decreases the slider value by the step amount when a step value is given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setStep(10);
  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'ArrowDown'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 40);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(40px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.4)'));
});

test('on arrow down keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 40}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});

test('on arrow down keydown works with non-standard IE key propery backed with proper keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'Down', keyCode: 40}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 49);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(49px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.49)'));
});


test('on home keydown prevents default', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'Home'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on home keydown sets the slider to the minimum value', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'Home'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 0);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(0px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0)'));
});

test('on home keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 36}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 0);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(0px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0)'));
});

test('on end keydown prevents default', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'End'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on end keydown sets the slider to the maximum value', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'End'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 100);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(100px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(1)'));
});

test('on end keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 35}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 100);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(100px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(1)'));
});

test('on page up keydown prevents default', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'PageUp'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on page up keydown increases the slider by 4 when no step given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'PageUp'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 54);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(54px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.54)'));
});

test('on page up keydown increases the slider by 4 * the step value when a step is given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  foundation.setStep(5);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'PageUp'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 70);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(70px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.7)'));
});

test('on page up keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 33}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 54);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(54px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.54)'));
});

test('on page down keydown prevents default', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'PageDown'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  rootHandlers.keydown(evt);
  clock.runToFrame();

  td.verify(evt.preventDefault());
});

test('on page down keydown increases the slider by 4 when no step given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'PageDown'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 46);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(46px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.46)'));
});

test('on page down keydown increases the slider by 4 * the step value when a step is given', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  foundation.setStep(5);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({key: 'PageDown'}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 30);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(30px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.3)'));
});

test('on page down keydown works with keyCode', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(createFakeEvent({keyCode: 34}));
  clock.runToFrame();

  assert.equal(foundation.getValue(), 46);
  td.verify(mockAdapter.setThumbContainerStyleProperty(TRANSFORM_PROP, 'translateX(46px) translateX(-50%)'));
  td.verify(mockAdapter.setTrackStyleProperty(TRANSFORM_PROP, 'scaleX(0.46)'));
});

test('on any other keydown does nothing', () => {
  const {foundation, mockAdapter, clock, rootHandlers} = setupTest();
  const evt = createFakeEvent({key: 'Enter'});

  td.when(mockAdapter.computeBoundingRect()).thenReturn({left: 0, width: 100});
  foundation.init();
  clock.runToFrame();

  foundation.setValue(50);
  clock.runToFrame();

  rootHandlers.keydown(evt);

  td.verify(evt.preventDefault(), {times: 0});
  assert.equal(foundation.getValue(), 50);
});
