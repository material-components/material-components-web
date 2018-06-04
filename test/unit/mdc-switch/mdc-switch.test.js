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

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MdcSwitch, MDCSwitchFoundation, MDCSwitch} from '../../../packages/mdc-switch';
import {MDCRipple} from '../../../packages/mdc-ripple';

const {NATIVE_CONTROL_SELECTOR, RIPLE_SURFACE_SELECTOR} = MDCSwitchFoundation.strings;

function getFixture() {
    return bel`
    <div class="mdc-switch">
      <div class="mdc-switch__background">
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
  const rippleSurface = root.querySelector(RIPLE_SURFACE_SELECTOR);
  return {root, component, rippleSurface};
}

suite('MDCSwitch');

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

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isOk(component.ripple instanceof MDCRipple);
});