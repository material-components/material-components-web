/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {MDCFormField} from '../../../packages/mdc-form-field';

function getFixture() {
  return bel`
    <div class="mdc-form-field">
      <input type="radio" id="radio" checked name="radio">
      <label for="radio">Foo</label>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCFormField(root);
  return {root, component};
}

test('attachTo initializes and returns an MDCFormField instance', () => {
  assert.isOk(MDCFormField.attachTo(getFixture()) instanceof MDCFormField);
});

test('get/set input', () => {
  const {component} = setupTest();
  const input = {};

  component.input = input;

  assert.isOk(component.input == input);
});

test('adapter#registerInteractionHandler adds an event listener to the label element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  const label = root.querySelector('label');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(label, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  const label = root.querySelector('label');
  label.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(label, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#activateInputRipple calls activate on the input ripple', () => {
  const {component} = setupTest();
  const ripple = {activate: td.func('activate')};
  const input = {ripple: ripple};

  component.input = input;
  component.getDefaultFoundation().adapter_.activateInputRipple();

  td.verify(ripple.activate());
});

test('adapter#activateInputRipple does not throw if there is no input', () => {
  const {component} = setupTest();

  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.activateInputRipple());
});

test('adapter#activateInputRipple does not throw if the input has no ripple getter', () => {
  const {component} = setupTest();
  const input = {};

  component.input = input;

  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.activateInputRipple());
});

test('adapter#deactivateInputRipple calls deactivate on the input ripple', () => {
  const {component} = setupTest();
  const ripple = {deactivate: td.func('deactivate')};
  const input = {ripple: ripple};

  component.input = input;
  component.getDefaultFoundation().adapter_.deactivateInputRipple();

  assert.doesNotThrow(() => td.verify(ripple.deactivate()));
});

test('adapter#deactivateInputRipple does not throw if there is no input', () => {
  const {component} = setupTest();

  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.deactivateInputRipple());
});

test('adapter#deactivateInputRipple does not throw if the input has no ripple getter', () => {
  const {component} = setupTest();
  const input = {};

  component.input = input;

  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.deactivateInputRipple());
});
