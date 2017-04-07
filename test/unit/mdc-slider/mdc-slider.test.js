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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCSlider} from '../../../packages/mdc-slider';

function getFixture() {
  return bel`
  <div class="mdc-slider">
    <input type="range" class="mdc-slider__input">
    <div class="mdc-slider__background">
      <div class="mdc-slider__background-lower"></div>
      <div class="mdc-slider__background-upper"></div>
    </div>
  </div>
  `;
}

suite('MDCSlider');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCSlider.attachTo(getFixture()) instanceof MDCSlider);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCSlider(root);
  return {root, component};
}

test('get/set disabled updates the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-slider__input');
  component.disabled = true;
  assert.isOk(input.disabled);
  component.disabled = false;
  assert.isNotOk(input.disabled);
});

test('get disabled gets state', () => {
  const {component} = setupTest();
  component.disabled = true;
  assert.isOk(component.disabled);
  component.disabled = false;
  assert.isNotOk(component.disabled);
});

test('#adapter.addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('#adapter.removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('#adapter.addInputClass adds a class to the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-slider__input');
  component.getDefaultFoundation().adapter_.addInputClass('foo');
  assert.isOk(input.classList.contains('foo'));
});

test('#adapter.removeInputClass removes a class from the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-slider__input');
  input.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeInputClass('foo');
  assert.isNotOk(input.classList.contains('foo'));
});

test('#adapter.registerHandler adds an event handler on the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('fooHandler');
  component.getDefaultFoundation().adapter_.registerHandler('foo', handler);
  domEvents.emit(root.querySelector('.mdc-slider__input'), 'foo');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterHandler removes an event handler from the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-slider__input');
  const handler = td.func('fooHandler');
  input.addEventListener('foo', handler);
  component.getDefaultFoundation().adapter_.deregisterHandler('foo', handler);
  domEvents.emit(input, 'foo');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.registerRootHandler adds an event handler on the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('fooHandler');
  component.getDefaultFoundation().adapter_.registerRootHandler('foo', handler);
  domEvents.emit(root, 'foo');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterRootHandler removes an event handler from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('fooHandler');
  root.addEventListener('foo', handler);
  component.getDefaultFoundation().adapter_.deregisterRootHandler('foo', handler);
  domEvents.emit(root, 'foo');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.getNativeInput returns the component input element', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getNativeInput(),
    root.querySelector('.mdc-slider__input')
  );
});

test('#adapter.setAttr sets an attribute to a certain value on the input element', () => {
  const {root, component} = setupTest();
  const input = root.querySelector('.mdc-slider__input');
  component.getDefaultFoundation().adapter_.setAttr('aria-valuenow', 'foo');
  assert.equal(input.getAttribute('aria-valuenow'), 'foo');
});

test('adapter#setLowerStyle sets the given style propertyName to the given value', () => {
  const {component, root} = setupTest();
  const lower = root.querySelector('.mdc-slider__background-lower');
  component.getDefaultFoundation().adapter_.setLowerStyle('flex', '0.5 1 0%');
  assert.equal(lower.style.getPropertyValue('flex'), '0.5 1 0%');
});

test('adapter#setUpperStyle sets the given style propertyName to the given value', () => {
  const {component, root} = setupTest();
  const upper = root.querySelector('.mdc-slider__background-upper');
  component.getDefaultFoundation().adapter_.setUpperStyle('flex', '0.5 1 0%');
  assert.equal(upper.style.getPropertyValue('flex'), '0.5 1 0%');
});

test('#adapter.notifyChange broadcasts a "MDCSlider:change" custom event', () => {
  const {root, component} = setupTest();
  const handler = td.func('custom event handler');
  root.addEventListener('MDCSlider:change', handler);
  component.getDefaultFoundation().adapter_.notifyChange({});
  td.verify(handler(td.matchers.anything()));
});
