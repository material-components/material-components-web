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
import {createMockRaf} from '../helpers/raf';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

import {MDCRipple, MDCRippleFoundation} from '../../../packages/mdc-ripple';
import {MDCSelect} from '../../../packages/mdc-select';
import {cssClasses} from '../../../packages/mdc-select/constants';
import {MDCNotchedOutline} from '../../../packages/mdc-notched-outline';

class FakeLabel {
  constructor() {
    this.float = td.func('label.float');
  }
}

class FakeBottomLine {
  constructor() {
    this.activate = td.func('bottomLine.activate');
    this.deactivate = td.func('bottomLine.deactivate');
  }
}

class FakeOutline {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

function getFixture() {
  return bel`
    <div class="mdc-select">
      <select class="mdc-select__native-control">
        <option value="" disabled selected></option>
        <option value="orange">
          Orange
        </option>
        <option value="apple">
          Apple
        </option>
      </select>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
}

function getBoxFixture() {
  return bel`
    <div class="mdc-select mdc-select--box">
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple">
          Apple
        </option>
      </select>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
}

suite('MDCSelect');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCSelect.attachTo(getFixture()) instanceof MDCSelect);
});

function setupTest() {
  const bottomLine = new FakeBottomLine();
  const label = new FakeLabel();
  const fixture = getFixture();
  const nativeControl = fixture.querySelector('.mdc-select__native-control');
  const labelEl = fixture.querySelector('.mdc-floating-label');
  const bottomLineEl = fixture.querySelector('.mdc-line-ripple');
  const outline = new FakeOutline();
  const component = new MDCSelect(fixture, /* foundation */ undefined, () => label, () => bottomLine, () => outline);

  return {fixture, nativeControl, label, labelEl, bottomLine, bottomLineEl, component, outline};
}

test('#get/setSelectedIndex', () => {
  const {component} = setupTest();
  assert.equal(component.selectedIndex, 0);
  component.selectedIndex = 1;
  assert.equal(component.selectedIndex, 1);
});

test('#get/set disabled', () => {
  const {component} = setupTest();
  assert.isFalse(component.disabled);
  component.disabled = true;
  assert.isTrue(component.disabled);
});

test('#get value', () => {
  const {component} = setupTest();
  assert.equal(component.value, '');
  component.selectedIndex = 2;
  assert.equal(component.value, 'apple');
  component.selectedIndex = 1;
  assert.equal(component.value, 'orange');
});

test('#set value sets the value on the <select>', () => {
  const {component, nativeControl} = setupTest();
  component.value = 'orange';
  assert.equal(nativeControl.value, 'orange');
});

test('#set value calls foundation.handleChange', () => {
  const {component} = setupTest();
  component.foundation_.handleChange = td.func();
  component.value = 'orange';
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('#set selectedIndex calls foundation.handleChange', () => {
  const {component} = setupTest();
  component.foundation_.handleChange = td.func();
  component.selectedIndex = 1;
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('#set disabled calls foundation.updateDisabledStyle', () => {
  const {component} = setupTest();
  component.foundation_.updateDisabledStyle = td.func();
  component.disabled = true;
  td.verify(component.foundation_.updateDisabledStyle(true), {times: 1});
});

test('#initialSyncWithDOM sets the selected index if an option has the selected attr', () => {
  const fixture = bel`
    <div class="mdc-select">
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
      <label class="mdc-floating-label">Pick a Food Group</label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
  const component = new MDCSelect(fixture, /* foundation */ undefined);
  assert.equal(component.selectedIndex, 1);
});

test('#initialSyncWithDOM disables the select if the disabled attr is found on the <select>', () => {
  const fixture = bel`
    <div class="mdc-select">
      <select class="mdc-select__native-control" disabled>
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
      <label class="mdc-floating-label"></label>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.isTrue(component.disabled);
});

test('adapter#addClass adds a class to the root element', () => {
  const {component, fixture} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(fixture.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {component, fixture} = setupTest();
  fixture.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(fixture.classList.contains('foo'));
});

test('adapter#hasClass returns true if a class exists on the root element', () => {
  const {component, fixture} = setupTest();
  fixture.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter_.floatLabel does not throw error if label does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
      <div class="mdc-line-ripple"></div>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.floatLabel('foo'));
});

test('adapter.activateBottomLine and adapter.deactivateBottomLine ' +
  'does not throw error if bottomLine does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
      <label class="mdc-floating-label"></label>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.activateBottomLine());
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.deactivateBottomLine());
});


test('#adapter.isRtl returns true when the root element is in an RTL context' +
  'and false otherwise', () => {
  const wrapper = bel`<div dir="rtl"></div>`;
  const {fixture, component} = setupTest();
  assert.isFalse(component.getDefaultFoundation().adapter_.isRtl());

  wrapper.appendChild(fixture);
  document.body.appendChild(wrapper);
  assert.isTrue(component.getDefaultFoundation().adapter_.isRtl());

  document.body.removeChild(wrapper);
});

test(`instantiates ripple when ${cssClasses.BOX} class is present`, function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getBoxFixture();
  const raf = createMockRaf();

  const component = MDCSelect.attachTo(fixture);
  raf.flush();

  assert.instanceOf(component.ripple, MDCRipple);
  assert.isTrue(fixture.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  raf.restore();
});

test(`#constructor instantiates an outline on the ${cssClasses.OUTLINE_SELECTOR} element if present`, () => {
  const root = getFixture();
  root.appendChild(bel`<div class="mdc-notched-outline"></div>`);
  const component = new MDCSelect(root);
  assert.instanceOf(component.outline_, MDCNotchedOutline);
});

test(`handles ripple focus properly when ${cssClasses.BOX} class is present`, function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getBoxFixture();
  const raf = createMockRaf();

  MDCSelect.attachTo(fixture);
  raf.flush();

  const nativeControl = fixture.querySelector('.mdc-select__native-control');

  domEvents.emit(nativeControl, 'focus');
  raf.flush();

  assert.isTrue(fixture.classList.contains(MDCRippleFoundation.cssClasses.BG_FOCUSED));
  raf.restore();
});

test('#destroy removes the ripple', function() {
  if (!supportsCssVariables(window, true)) {
    this.skip(); // eslint-disable-line no-invalid-this
    return;
  }

  const fixture = getBoxFixture();
  const raf = createMockRaf();

  const component = new MDCSelect(fixture);
  raf.flush();

  assert.isTrue(fixture.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  component.destroy();
  raf.flush();

  assert.isFalse(fixture.classList.contains(MDCRippleFoundation.cssClasses.ROOT));
  raf.restore();
});

test('#destroy cleans up the outline if present', () => {
  const {component, outline} = setupTest();
  component.outline_ = outline;
  component.destroy();
  td.verify(outline.destroy());
});

test(`does not instantiate ripple when ${cssClasses.BOX} class is not present`, () => {
  const {component} = setupTest();
  assert.isUndefined(component.ripple);
});

test('adapter#floatLabel adds a class to the label', () => {
  const {component, label} = setupTest();

  component.getDefaultFoundation().adapter_.floatLabel('foo');
  td.verify(label.float('foo'));
});

test('adapter#activateBottomLine adds active class to the bottom line', () => {
  const {component, bottomLine} = setupTest();

  component.getDefaultFoundation().adapter_.activateBottomLine();
  td.verify(bottomLine.activate());
});

test('adapter#deactivateBottomLine removes active class from the bottom line', () => {
  const {component, bottomLine} = setupTest();

  component.getDefaultFoundation().adapter_.deactivateBottomLine();
  td.verify(bottomLine.deactivate());
});

test('change event triggers foundation.handleChange()', () => {
  const {component, nativeControl} = setupTest();
  component.foundation_.handleChange = td.func();
  domEvents.emit(nativeControl, 'change');
  td.verify(component.foundation_.handleChange(), {times: 1});
});

test('focus event triggers foundation.handleFocus()', () => {
  const {component, nativeControl} = setupTest();
  component.foundation_.handleFocus = td.func();
  domEvents.emit(nativeControl, 'focus');
  td.verify(component.foundation_.handleFocus(), {times: 1});
});

test('blur event triggers foundation.handleBlur()', () => {
  const {component, nativeControl} = setupTest();
  component.foundation_.handleBlur = td.func();
  domEvents.emit(nativeControl, 'blur');
  td.verify(component.foundation_.handleBlur(), {times: 1});
});

test('#destroy removes the change handler', () => {
  const {component, nativeControl} = setupTest();
  component.foundation_.handleChange = td.func();
  component.destroy();
  domEvents.emit(nativeControl, 'change');
  td.verify(component.foundation_.handleChange(), {times: 0});
});

test('#destroy removes the focus handler', () => {
  const {component, nativeControl} = setupTest();
  component.foundation_.handleFocus = td.func();
  component.destroy();
  domEvents.emit(nativeControl, 'focus');
  td.verify(component.foundation_.handleFocus(), {times: 0});
});

test('#destroy removes the blur handler', () => {
  const {component, nativeControl} = setupTest();
  component.foundation_.handleBlur = td.func();
  component.destroy();
  domEvents.emit(nativeControl, 'blur');
  td.verify(component.foundation_.handleBlur(), {times: 0});
});
