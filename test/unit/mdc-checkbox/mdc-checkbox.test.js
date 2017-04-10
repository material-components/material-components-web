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
import domEvents from 'dom-events';
import td from 'testdouble';

import {supportsCssVariables} from '../../../packages/mdc-ripple/util';
import {createMockRaf} from '../helpers/raf';
import {MDCCheckbox} from '../../../packages/mdc-checkbox';
import {MDCRipple} from '../../../packages/mdc-ripple';
import {strings} from '../../../packages/mdc-checkbox/constants';
import {getCorrectEventName} from '../../../packages/mdc-animation';
import {getMatchesProperty} from '../../../packages/mdc-ripple/util';

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
          <path class="mdc-checkbox__checkmark__path"
                fill="none"
                stroke="white"
                d="M4.1,12.7 9,17.6 20.3,6.3"/>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>
  `;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCCheckbox(root);
  return {root, component};
}

suite('MDCCheckbox');

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
    raf.restore();
  });

  test('(regression) activates ripple on keydown when the input element surface is active', () => {
    const raf = createMockRaf();
    const {root} = setupTest();
    const input = root.querySelector('input');
    raf.flush();

    const fakeMatches = td.func('.matches');
    td.when(fakeMatches(':active')).thenReturn(true);
    input[getMatchesProperty(HTMLElement.prototype)] = fakeMatches;

    assert.isTrue(root.classList.contains('mdc-ripple-upgraded'));
    domEvents.emit(input, 'keydown');
    raf.flush();

    assert.isTrue(root.classList.contains('mdc-ripple-upgraded--foreground-activation'));
    raf.restore();
  });
}

test('attachTo initializes and returns a MDCCheckbox instance', () => {
  assert.isOk(MDCCheckbox.attachTo(getFixture()) instanceof MDCCheckbox);
});

test('get/set checked updates the checked property on the native checkbox element', () => {
  const {root, component} = setupTest();
  const cb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  component.checked = true;
  assert.isOk(cb.checked);
  assert.equal(component.checked, cb.checked);
});

test('get/set indeterminate updates the indeterminate property on the native checkbox element', () => {
  const {root, component} = setupTest();
  const cb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  component.indeterminate = true;
  assert.isOk(cb.indeterminate);
  assert.equal(component.indeterminate, cb.indeterminate);
});

test('get/set disabled updates the indeterminate property on the native checkbox element', () => {
  const {root, component} = setupTest();
  const cb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  component.disabled = true;
  assert.isOk(cb.disabled);
  assert.equal(component.disabled, cb.disabled);
});

test('get/set value updates the value of the native checkbox element', () => {
  const {root, component} = setupTest();
  const cb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  component.value = 'new value';
  assert.equal(cb.value, 'new value');
  assert.equal(component.value, cb.value);
});

test('get ripple returns a MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isOk(component.ripple instanceof MDCRipple);
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

test('adapter#registerAnimationEndHandler adds an animation end event listener on the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('animationEndHandler');
  component.getDefaultFoundation().adapter_.registerAnimationEndHandler(handler);
  domEvents.emit(root, getCorrectEventName(window, 'animationend'));

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterAnimationEndHandler removes an animation end event listener on the root el', () => {
  const {root, component} = setupTest();
  const handler = td.func('animationEndHandler');
  const animEndEvtName = getCorrectEventName(window, 'animationend');
  root.addEventListener(animEndEvtName, handler);

  component.getDefaultFoundation().adapter_.deregisterAnimationEndHandler(handler);
  domEvents.emit(root, animEndEvtName);

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerChangeHandler adds a change event listener to the native checkbox element', () => {
  const {root, component} = setupTest();
  const nativeCb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  const handler = td.func('changeHandler');

  component.getDefaultFoundation().adapter_.registerChangeHandler(handler);
  domEvents.emit(nativeCb, 'change');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterChangeHandler adds a change event listener to the native checkbox element', () => {
  const {root, component} = setupTest();
  const nativeCb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  const handler = td.func('changeHandler');
  nativeCb.addEventListener('change', handler);

  component.getDefaultFoundation().adapter_.deregisterChangeHandler(handler);
  domEvents.emit(nativeCb, 'change');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getNativeControl returns the native checkbox element', () => {
  const {root, component} = setupTest();
  const nativeCb = root.querySelector(strings.NATIVE_CONTROL_SELECTOR);
  assert.equal(component.getDefaultFoundation().adapter_.getNativeControl(), nativeCb);
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
