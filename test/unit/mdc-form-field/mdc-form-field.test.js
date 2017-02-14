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

import test from 'tape';
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

test('attachTo initializes and returns an MDCFormField instance', (t) => {
  t.true(MDCFormField.attachTo(getFixture()) instanceof MDCFormField);
  t.end();
});

test('get/set input', (t) => {
  const {component} = setupTest();
  const input = {};

  component.input = input;

  t.true(component.input == input);
  t.end();
});

test('adapter#registerInteractionHandler adds an event listener to the label element', (t) => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  const label = root.querySelector('label');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(label, 'click');

  t.doesNotThrow(() => td.verify(handler(td.matchers.anything())));
  t.end();
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', (t) => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  const label = root.querySelector('label');
  label.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(label, 'click');

  t.doesNotThrow(() => td.verify(handler(td.matchers.anything()), {times: 0}));
  t.end();
});

test('adapter#activateInputRipple calls activate on the input ripple', (t) => {
  const {component} = setupTest();
  const ripple = td.object();
  const input = {ripple: ripple};

  component.input = input;
  component.getDefaultFoundation().adapter_.activateInputRipple();

  t.doesNotThrow(() => td.verify(ripple.activate()));
  t.end();
});

test('adapter#activateInputRipple does not throw if there is no input', (t) => {
  const {component} = setupTest();

  t.doesNotThrow(() => component.getDefaultFoundation().adapter_.activateInputRipple());
  t.end();
});

test('adapter#activateInputRipple does not throw if the input has no ripple getter', (t) => {
  const {component} = setupTest();
  const input = {};

  component.input = input;

  t.doesNotThrow(() => component.getDefaultFoundation().adapter_.activateInputRipple());
  t.end();
});

test('adapter#deactivateInputRipple calls deactivate on the input ripple', (t) => {
  const {component} = setupTest();
  const ripple = td.object();
  const input = {ripple: ripple};

  component.input = input;
  component.getDefaultFoundation().adapter_.deactivateInputRipple();

  t.doesNotThrow(() => td.verify(ripple.deactivate()));
  t.end();
});

test('adapter#deactivateInputRipple does not throw if there is no input', (t) => {
  const {component} = setupTest();

  t.doesNotThrow(() => component.getDefaultFoundation().adapter_.deactivateInputRipple());
  t.end();
});

test('adapter#deactivateInputRipple does not throw if the input has no ripple getter', (t) => {
  const {component} = setupTest();
  const input = {};

  component.input = input;

  t.doesNotThrow(() => component.getDefaultFoundation().adapter_.deactivateInputRipple());
  t.end();
});
