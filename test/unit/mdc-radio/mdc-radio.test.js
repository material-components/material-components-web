/**
 * @license
 * Copyright 2016 Google Inc.
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

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MDCRadio, MDCRadioFoundation} from '../../../packages/mdc-radio/index';
import {MDCRipple} from '../../../packages/mdc-ripple/index';

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

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('#adapter.setNativeControlDisabled sets the native control element\'s disabled property to true', () => {
  const {root, component} = setupTest();
  const radio = root.querySelector(NATIVE_CONTROL_SELECTOR);

  component.getDefaultFoundation().adapter_.setNativeControlDisabled(true);
  assert.isTrue(radio.disabled);
});

test('#adapter.setNativeControlDisabled sets the native control element\'s disabled property to false', () => {
  const {root, component} = setupTest();
  const radio = root.querySelector(NATIVE_CONTROL_SELECTOR);
  radio.disabled = true;

  component.getDefaultFoundation().adapter_.setNativeControlDisabled(false);
  assert.isFalse(radio.disabled);
});
