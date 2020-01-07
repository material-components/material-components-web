/**
 * @license
 * Copyright 2018 Google Inc.
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
import td from 'testdouble';

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {install as installClock} from '../helpers/clock';
import {MDCSwitchFoundation, MDCSwitch} from '../../../packages/mdc-switch/index';
import {MDCRipple} from '../../../packages/mdc-ripple/index';

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
    const clock = installClock();
    const {rippleSurface} = setupTest();
    clock.runToFrame();
    assert.isOk(rippleSurface.classList.contains('mdc-ripple-upgraded'));
  });

  test('#destroy removes the ripple', () => {
    const clock = installClock();
    const {component, rippleSurface} = setupTest();
    clock.runToFrame();
    component.destroy();
    clock.runToFrame();
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

test('get/set checked updates the aria-checked of the native switch input element', () => {
  const {root, component} = setupTest();
  const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
  component.checked = true;
  assert.equal(
    inputEl.getAttribute(MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR),
    'true');
  component.checked = false;
  assert.equal(
    inputEl.getAttribute(MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR),
    'false');
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

test('#initialSyncWithDOM calls foundation.setChecked', () => {
  const root = getFixture();
  const inputEl = root.querySelector(NATIVE_CONTROL_SELECTOR);
  inputEl.checked = true;
  const {mockFoundation} = setupMockFoundationTest(root);
  td.verify(mockFoundation.setChecked(true), {times: 1});
});

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
