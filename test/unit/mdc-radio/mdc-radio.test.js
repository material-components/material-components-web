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

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MDCRadio, MDCRadioFoundation} from '../../../packages/mdc-radio';
import {MDCRipple} from '../../../packages/mdc-ripple';

const {NATIVE_CONTROL_SELECTOR} = MDCRadioFoundation.strings;

function getFixture() {
  return bel`
    <div class="mdc-radio">
      <input type="radio" id="my-radio" name="my-radio-group"
             class="mdc-radio__native-control" aria-labelledby="my-radio-label">
      <div class="mdc-radio__background">
        <div class="mdc-radio__outer-circle"></div>
        <div class="mdc-radio__inner-circle"></div>
      </div>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCRadio(root);
  return {root, component};
}

suite('MDCRadio');

test('attachTo initializes and returns a MDCRadio instance', () => {
  assert.isOk(MDCRadio.attachTo(getFixture()) instanceof MDCRadio);
});

if (supportsCssVariables(window)) {
  test('#constructor initializes the root element with a ripple', () => {
    const raf = createMockRaf();
    const {root} = setupTest();
    raf.flush();
    assert.isOk(root.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy removes the ripple', () => {
    const raf = createMockRaf();
    const {root, component} = setupTest();
    raf.flush();
    component.destroy();
    raf.flush();
    assert.isNotOk(root.classList.contains('mdc-ripple-upgraded'));
  });
}

test('get/set checked updates the checked value of the native radio element', () => {
  const {root, component} = setupTest();
  const radio = root.querySelector(NATIVE_CONTROL_SELECTOR);
  component.checked = true;
  assert.isOk(radio.checked);
  assert.equal(component.checked, radio.checked);
});

test('get/set disabled updates the disabled value of the native radio element', () => {
  const {root, component} = setupTest();
  const radio = root.querySelector(NATIVE_CONTROL_SELECTOR);
  component.disabled = true;
  assert.isOk(radio.disabled);
  assert.equal(component.disabled, radio.disabled);
  component.disabled = false;
  assert.isNotOk(radio.disabled);
  assert.equal(component.disabled, radio.disabled);
});

test('get/set value updates the value of the native radio element', () => {
  const {root, component} = setupTest();
  const radio = root.querySelector(NATIVE_CONTROL_SELECTOR);
  component.value = 'new value';
  assert.equal(radio.value, 'new value');
  assert.equal(component.value, radio.value);
});

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isOk(component.ripple instanceof MDCRipple);
});

test('#adapter.getNativeControl() returns the native radio element', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getNativeControl(), root.querySelector(NATIVE_CONTROL_SELECTOR)
  );
});
