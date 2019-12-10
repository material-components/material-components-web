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
import domEvents from 'dom-events';
import td from 'testdouble';

import {install as installClock} from '../helpers/clock';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {MDCCheckbox, MDCCheckboxFoundation} from '../../../packages/mdc-checkbox/index';
import {MDCRipple} from '../../../packages/mdc-ripple/index';
import {strings} from '../../../packages/mdc-checkbox/constants';

function getFixture() {
  return bel`
    <div class="mdc-checkbox">
      <input type="checkbox"
             class="mdc-checkbox__native-control"
             id="my-checkbox"
             aria-labelledby="my-checkbox-label"/>
      <div class="mdc-checkbox__frame"></div>
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark"
             viewBox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path"
                fill="none"
                d="M4.1,12.7 9,17.6 20.3,6.3"/>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const cb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  const component = new MDCCheckbox(root);
  return {root, cb, component};
}

function setupMockFoundationTest() {
  const root = getFixture();
  const cb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  const MockFoundationConstructor = td.constructor(MDCCheckboxFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCCheckbox(root, mockFoundation);
  return {root, cb, component, mockFoundation};
}

suite('MDCCheckbox');

if (supportsCssVariables(window)) {
  test('#constructor initializes the root element with a ripple', () => {
    const clock = installClock();
    const {root} = setupTest();
    clock.runToFrame();
    assert.isOk(root.classList.contains('mdc-ripple-upgraded'));
  });

  test('#destroy removes the ripple', () => {
    const clock = installClock();
    const {root, component} = setupTest();
    clock.runToFrame();
    component.destroy();
    clock.runToFrame();
    assert.isNotOk(root.classList.contains('mdc-ripple-upgraded'));
  });

  test('(regression) activates ripple on keydown when the input element surface is active', () => {
    const clock = installClock();
    const {root} = setupTest();
    const input = root.querySelector('input');
    clock.runToFrame();

    const fakeMatches = td.func('.matches');
    td.when(fakeMatches(':active')).thenReturn(true);
    input.matches = fakeMatches;

    assert.isTrue(root.classList.contains('mdc-ripple-upgraded'));
    domEvents.emit(input, 'keydown');
    clock.runToFrame();

    assert.isTrue(root.classList.contains('mdc-ripple-upgraded--foreground-activation'));
  });
}

test('attachTo initializes and returns a MDCCheckbox instance', () => {
  assert.isOk(MDCCheckbox.attachTo(getFixture()) instanceof MDCCheckbox);
});

test('get/set checked updates the checked property on the native checkbox element', () => {
  const {cb, component} = setupTest();
  component.checked = true;
  assert.isOk(cb.checked);
  assert.equal(component.checked, cb.checked);
});

test('get/set indeterminate updates the indeterminate property on the native checkbox element', () => {
  const {cb, component} = setupTest();
  component.indeterminate = true;
  assert.isOk(cb.indeterminate);
  assert.equal(component.indeterminate, cb.indeterminate);
});

test('get/set disabled updates the indeterminate property on the native checkbox element', () => {
  const {cb, component} = setupTest();
  component.disabled = true;
  assert.isOk(cb.disabled);
  assert.equal(component.disabled, cb.disabled);
});

test('get/set value updates the value of the native checkbox element', () => {
  const {cb, component} = setupTest();
  component.value = 'new value';
  assert.equal(cb.value, 'new value');
  assert.equal(component.value, cb.value);
});

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isOk(component.ripple instanceof MDCRipple);
});

test('checkbox change event calls #foundation.handleChange', () => {
  const {cb, component} = setupTest();
  component.foundation_.handleChange = td.func();
  domEvents.emit(cb, 'change');
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('root animationend event calls #foundation.handleAnimationEnd', () => {
  const {root, component} = setupTest();
  component.foundation_.handleAnimationEnd = td.func();
  domEvents.emit(root, 'animationend');
  td.verify(component.foundation_.handleAnimationEnd(), {times: 1});
});

test('"checked" property change hook calls foundation#handleChange', () => {
  const {cb, mockFoundation} = setupMockFoundationTest();
  cb.checked = true;
  td.verify(mockFoundation.handleChange(), {times: 1});
});

test('"indeterminate" property change hook calls foundation#handleChange', () => {
  const {cb, mockFoundation} = setupMockFoundationTest();
  cb.indeterminate = true;
  td.verify(mockFoundation.handleChange(), {times: 1});
});

test('checkbox change event handler is destroyed on #destroy', () => {
  const {cb, component} = setupTest();
  component.foundation_.handleChange = td.func();
  component.destroy();
  domEvents.emit(cb, 'change');
  td.verify(component.foundation_.handleChange(), {times: 0});
});

test('root animationend event handler is destroyed on #destroy', () => {
  const {root, component} = setupTest();
  component.foundation_.handleAnimationEnd = td.func();
  component.destroy();
  domEvents.emit(root, 'animationend');
  td.verify(component.foundation_.handleAnimationEnd(), {times: 0});
});

test('"checked" property change hook is removed on #destroy', () => {
  const {component, cb, mockFoundation} = setupMockFoundationTest();
  component.destroy();
  cb.checked = true;
  td.verify(mockFoundation.handleChange(), {times: 0});
});

test('"indeterminate" property change hook is removed on #destroy', () => {
  const {component, cb, mockFoundation} = setupMockFoundationTest();
  component.destroy();
  cb.indeterminate = true;
  td.verify(mockFoundation.handleChange(), {times: 0});
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('adapter#setNativeControlAttr sets an attribute on the input element', () => {
  const {cb, component} = setupTest();
  component.getDefaultFoundation().adapter_.setNativeControlAttr('aria-checked', 'mixed');
  assert.equal(cb.getAttribute('aria-checked'), 'mixed');
});

test('adapter#removeNativeControlAttr removes an attribute from the input element', () => {
  const {cb, component} = setupTest();
  cb.setAttribute('aria-checked', 'mixed');
  component.getDefaultFoundation().adapter_.removeNativeControlAttr('aria-checked');
  assert.isFalse(cb.hasAttribute('aria-checked'));
});

test('adapter#forceLayout touches "offsetWidth" on the root in order to force layout', () => {
  const {root, component} = setupTest();
  const mockGetter = td.func('.offsetWidth');
  Object.defineProperty(root, 'offsetWidth', {
    get: mockGetter,
    set() {},
    enumerable: false,
    configurable: true,
  });

  component.getDefaultFoundation().adapter_.forceLayout();
  td.verify(mockGetter());
});

test('adapter#isAttachedToDOM returns true when root is attached to DOM', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  assert.isOk(component.getDefaultFoundation().adapter_.isAttachedToDOM());
  document.body.removeChild(root);
});

test('adapter#isAttachedToDOM returns false when root is not attached to DOM', () => {
  const {component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.isAttachedToDOM());
});

test('#adapter.isIndeterminate returns true when checkbox is indeterminate', () => {
  const {cb, component} = setupTest();
  cb.indeterminate = true;
  assert.isTrue(component.getDefaultFoundation().adapter_.isIndeterminate());
});

test('#adapter.isIndeterminate returns false when checkbox is not indeterminate', () => {
  const {cb, component} = setupTest();
  cb.indeterminate = false;
  assert.isFalse(component.getDefaultFoundation().adapter_.isIndeterminate());
});

test('#adapter.isChecked returns true when checkbox is checked', () => {
  const {cb, component} = setupTest();
  cb.checked = true;
  assert.isTrue(component.getDefaultFoundation().adapter_.isChecked());
});

test('#adapter.isChecked returns false when checkbox is not checked', () => {
  const {cb, component} = setupTest();
  cb.checked = false;
  assert.isFalse(component.getDefaultFoundation().adapter_.isChecked());
});

test('#adapter.hasNativeControl returns true when checkbox exists', () => {
  const {component} = setupTest();
  assert.isTrue(component.getDefaultFoundation().adapter_.hasNativeControl());
});

test('#adapter.setChecked returns true when checkbox is set checked', () => {
  const {cb, component} = setupTest();
  component.getDefaultFoundation().adapter_.setChecked(true);
  assert.isTrue(cb.checked);
});

test('#adapter.setChecked returns false when checkbox is set not checked', () => {
  const {cb, component} = setupTest();
  component.getDefaultFoundation().adapter_.setChecked(false);
  assert.isFalse(cb.checked);
});

test('#adapter.setNativeControlDisabled returns true when checkbox is disabled', () => {
  const {cb, component} = setupTest();
  component.getDefaultFoundation().adapter_.setNativeControlDisabled(true);
  assert.isTrue(cb.disabled);
});

test('#adapter.setNativeControlDisabled returns false when checkbox is not disabled', () => {
  const {cb, component} = setupTest();
  component.getDefaultFoundation().adapter_.setNativeControlDisabled(false);
  assert.isFalse(cb.disabled);
});
