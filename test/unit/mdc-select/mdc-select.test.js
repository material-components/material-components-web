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

import {MDCSelect} from '../../../packages/mdc-select';

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

function getFixture() {
  return bel`
    <div class="mdc-select">
      <select class="mdc-select__surface">
        <option class="mdc-list-item" value="" aria-disabled="true" disabled selected>
          Pick a food group
        </option>
        <option class="mdc-list-item" value="orange">
          Orange
        </option>
        <option class="mdc-list-item" value="apple">
          Apple
        </option>
      </select>
      <div class="mdc-select__label">Pick a Food Group</div>
      <div class="mdc-select__bottom-line"></div>
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
  const surface = fixture.querySelector('.mdc-select__surface');
  const labelEl = fixture.querySelector('.mdc-select__label');
  const bottomLineEl = fixture.querySelector('.mdc-select__bottom-line');
  const component = new MDCSelect(fixture, /* foundation */ undefined, () => label, () => bottomLine);

  return {fixture, surface, label, labelEl, bottomLine, bottomLineEl, component};
}

test('#get/setSelectedIndex', () => {
  const {component} = setupTest();
  assert.equal(component.selectedIndex, -1);
  component.selectedIndex = 1;
  assert.equal(component.selectedIndex, 1);
});

test('#get/setDisabled', () => {
  const {component} = setupTest();
  assert.equal(component.disabled, false);
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

test('#item returns null if index out of bounds', () => {
  const {component} = setupTest();
  assert.equal(component.item(100), null);
});

test('#initialSyncWithDOM sets the selected index if an option has the selected attr', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__label">Pick a Food Group</div>
      <div class="mdc-select__bottom-line"></div>
      <select class="mdc-select__surface">
        <option class="mdc-list-item" value="orange">
          Orange
        </option>
        <option class="mdc-list-item" value="apple" selected>
          Apple
        </option>
      </select>
    </div>
  `;
  const component = new MDCSelect(fixture, /* foundation */ undefined);
  assert.equal(component.selectedIndex, 1);
});

test('#initialSyncWithDOM disables the select if aria-disabled="true" is found on the element', () => {
  const fixture = getFixture();
  fixture.setAttribute('aria-disabled', 'true');
  const component = new MDCSelect(fixture);
  assert.isOk(component.disabled);
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

test('adapter#setAttr sets an attribute with a given value on the root element', () => {
  const {component, fixture} = setupTest();
  component.getDefaultFoundation().adapter_.setAttr('aria-disabled', 'true');
  assert.equal(fixture.getAttribute('aria-disabled'), 'true');
});

test('adapter#rmAttr removes an attribute from the root element', () => {
  const {component, fixture} = setupTest();
  fixture.setAttribute('aria-disabled', 'true');
  component.getDefaultFoundation().adapter_.rmAttr('aria-disabled');
  assert.isFalse(fixture.hasAttribute('aria-disabled'));
});

test('adapter#registerInteractionHandler adds an event listener to the surface element', () => {
  const {component, surface} = setupTest();
  const listener = td.func('eventlistener');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', listener);
  domEvents.emit(surface, 'click');
  td.verify(listener(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the surface element', () => {
  const {component, surface} = setupTest();
  const listener = td.func('eventlistener');
  surface.addEventListener('click', listener);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', listener);
  domEvents.emit(surface, 'click');
  td.verify(listener(td.matchers.anything()), {times: 0});
});

test('adapter#getNumberOfOptions returns the length of the component\'s options property', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getNumberOfOptions(), component.options.length);
});

test('adapter#setAttrForOptionAtIndex sets an attribute to the given value for the option at the ' +
     'given index', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.setAttrForOptionAtIndex(1, 'aria-disabled', 'true');
  assert.equal(component.options[1].getAttribute('aria-disabled'), 'true');
});

test('adapter#rmAttrForOptionAtIndex removes the given attribute for the option at the given index', () => {
  const {component} = setupTest();
  component.options[1].setAttribute('aria-disabled', 'true');
  component.getDefaultFoundation().adapter_.rmAttrForOptionAtIndex(1, 'aria-disabled');
  assert.isFalse(component.options[1].hasAttribute('aria-disabled'));
});

test('adapter#getValueForOptionAtIndex returns the id of the option at the given index', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getValueForOptionAtIndex(1), 'orange');
});

test('adapter#getIndexForOptionValue returns the index of the option with a value', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getIndexForOptionValue('apple'), 2);
});

test('adapter#getIndexForOptionValue returns null if there is no option with the specific value', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getIndexForOptionValue('grape'), null);
});

test('adapter#getValue returns the value of the select element', () => {
  const {surface, component} = setupTest();
  surface.selectedIndex = 1;
  assert.equal(component.getDefaultFoundation().adapter_.getValue(), 'orange');
});

test('adapter#getValue returns empty string if there is no selected value', () => {
  const {surface, component} = setupTest();
  surface.selectedIndex = -1;
  assert.equal(component.getDefaultFoundation().adapter_.getValue(), '');
});

test('adapter#setValue sets the value of the select to the correct option', () => {
  const {surface, component} = setupTest();
  component.getDefaultFoundation().adapter_.setValue('orange');
  assert.equal(surface.selectedIndex, 1);
});

test('adapter#setValue sets the selectedIndex of the select to -1 if there is ' +
  'no option with the specified value', () => {
  const {surface, component} = setupTest();
  component.getDefaultFoundation().adapter_.setValue('grape');
  assert.equal(surface.selectedIndex, -1);
});
