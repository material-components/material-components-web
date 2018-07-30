/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import td from 'testdouble';

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MDCSwitchFoundation, MDCSwitch} from '../../../packages/mdc-switch';
import {MDCRipple} from '../../../packages/mdc-ripple';

const {NATIVE_CONTROL_SELECTOR, RIPPLE_SURFACE_SELECTOR} = MDCSwitchFoundation.strings;

function getFixture() {
  return bel`
    <div class="mdc-switch">
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb">
          <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch">
        </div>
      </div>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCSwitch(root);
  const rippleSurface = root.querySelector(RIPPLE_SURFACE_SELECTOR);
  return {root, component, rippleSurface};
}

suite('MDCSwitch');

test('attachTo initializes and returns a MDCSwitch instance', () => {
  assert.isOk(MDCSwitch.attachTo(getFixture()) instanceof MDCSwitch);
});

if (supportsCssVariables(window)) {
  test('#constructor initializes the root element with a ripple', () => {
    const raf = createMockRaf();
    const {rippleSurface} = setupTest();
    raf.flush();
    assert.isOk(rippleSurface.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy removes the ripple', () => {
    const raf = createMockRaf();
    const {component, rippleSurface} = setupTest();
    raf.flush();
    component.destroy();
    raf.flush();
    assert.isNotOk(rippleSurface.classList.contains('mdc-ripple-upgraded'));
  });
}

test('get/set checked updates the checked value of the native switch input element', () => {
  const {root, component} = setupTest();
  const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
  component.checked = true;
  assert.isOk(inputEl.checked);
  assert.equal(component.checked, inputEl.checked);
});

test('get/set checked updates the component styles', () => {
  const {root, component} = setupTest();
  component.checked = true;
  assert.isOk(root.classList.contains(MDCSwitchFoundation.cssClasses.CHECKED));
  component.checked = false;
  assert.isNotOk(root.classList.contains(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('get/set disabled updates the disabled value of the native switch input element', () => {
  const {root, component} = setupTest();
  const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
  component.disabled = true;
  assert.isOk(inputEl.disabled);
  assert.equal(component.disabled, inputEl.disabled);
  component.disabled = false;
  assert.isNotOk(inputEl.disabled);
  assert.equal(component.disabled, inputEl.disabled);
});

test('get/set disabled updates the component styles', () => {
  const {root, component} = setupTest();
  component.disabled = true;
  assert.isOk(root.classList.contains(MDCSwitchFoundation.cssClasses.DISABLED));
  component.disabled = false;
  assert.isNotOk(root.classList.contains(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isOk(component.ripple instanceof MDCRipple);
});

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationCtor = td.constructor(MDCSwitchFoundation);
  const mockFoundation = new MockFoundationCtor();
  const component = new MDCSwitch(root, mockFoundation);
  return {root, component, mockFoundation};
}

test('change handler is added to the native control element', () => {
  const {root, mockFoundation} = setupMockFoundationTest();

  const event = document.createEvent('Event');
  event.initEvent('change', true, false);

  const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
  inputEl.dispatchEvent(event);

  td.verify(mockFoundation.handleChange(event), {times: 1});
});

test('change handler is removed from the native control element on destroy', () => {
  const {root, component, mockFoundation} = setupMockFoundationTest();
  component.destroy();

  const event = document.createEvent('Event');
  event.initEvent('change', true, false);

  const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
  inputEl.dispatchEvent(event);

  td.verify(mockFoundation.handleChange(event), {times: 0});
});
