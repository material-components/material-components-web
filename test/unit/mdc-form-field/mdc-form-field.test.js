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

suite('MDCFormField');

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
