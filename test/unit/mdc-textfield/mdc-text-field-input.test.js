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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCTextFieldInput, MDCTextFieldInputFoundation} from '../../../packages/mdc-textfield/input';

const getFixture = () => bel`
  <div class="mdc-textfield__input"></div>
`;

suite('MDCTextFieldInput');

test('attachTo returns an MDCTextFieldInput instance', () => {
  assert.isOk(MDCTextFieldInput.attachTo(getFixture()) instanceof MDCTextFieldInput);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTextFieldInput(root);
  return {root, component};
}

test('#adapter.getNativeInput returns the component input element', () => {
  const {root, component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getNativeInput(), root);
});

test('#adapter.registerEventHandler adds event listener for a given event to the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('handler');
  component.getDefaultFoundation().adapter_.registerEventHandler('focus', handler);
  domEvents.emit(root, 'focus');

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterEventHandler removes event listener for a given event from the input element', () => {
  const {root, component} = setupTest();
  const handler = td.func('handler');
  root.addEventListener('focus', handler);
  component.getDefaultFoundation().adapter_.deregisterEventHandler('focus', handler);
  domEvents.emit(root, 'focus');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.notifyFocusAction emits ' +
  `${MDCTextFieldInputFoundation.strings.FOCUS_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('handler');
  component.listen(
    MDCTextFieldInputFoundation.strings.FOCUS_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyFocusAction();

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.notifyBlurAction emits ' +
  `${MDCTextFieldInputFoundation.strings.BLUR_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('handler');
  component.listen(
    MDCTextFieldInputFoundation.strings.BLUR_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyBlurAction();

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.notifyPressedAction emits ' +
  `${MDCTextFieldInputFoundation.strings.PRESSED_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('handler');
  component.listen(
    MDCTextFieldInputFoundation.strings.PRESSED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyPressedAction();

  td.verify(handler(td.matchers.anything()));
});
