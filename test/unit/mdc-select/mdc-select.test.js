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
import {getMatchesProperty} from '../../../packages/mdc-ripple/util';

import {MDCSelect} from '../../../packages/mdc-select';
import {cssClasses} from '../../../packages/mdc-select/constants';

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
      <select class="mdc-select__native-control">
        <option value="" disabled selected></option>
        <option value="orange">
          Orange
        </option>
        <option value="apple">
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
  const nativeControl = fixture.querySelector('.mdc-select__native-control');
  const labelEl = fixture.querySelector('.mdc-select__label');
  const bottomLineEl = fixture.querySelector('.mdc-select__bottom-line');
  const component = new MDCSelect(fixture, /* foundation */ undefined, () => label, () => bottomLine);

  return {fixture, nativeControl, label, labelEl, bottomLine, bottomLineEl, component};
}

test('#get/setSelectedIndex', () => {
  const {component} = setupTest();
  assert.equal(component.selectedIndex, 0);
  component.selectedIndex = 1;
  assert.equal(component.selectedIndex, 1);
});

test('#get/setDisabled', () => {
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

test('#initialSyncWithDOM sets the selected index if an option has the selected attr', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__label">Pick a Food Group</div>
      <div class="mdc-select__bottom-line"></div>
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
    </div>
  `;
  const component = new MDCSelect(fixture, /* foundation */ undefined);
  assert.equal(component.selectedIndex, 1);
});

test('#initialSyncWithDOM disables the select if the disabled attr is found on the <select>', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__bottom-line"></div>
      <select class="mdc-select__native-control" disabled>
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
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

test('adapter_.floatLabel does not throw error if label does not exist', () => {
  const fixture = bel`
    <div class="mdc-select">
      <div class="mdc-select__bottom-line"></div>
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
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
      <div class="mdc-select__label"></div>
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
    </div>
  `;
  const component = new MDCSelect(fixture);
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.activateBottomLine());
  assert.doesNotThrow(
    () => component.getDefaultFoundation().adapter_.deactivateBottomLine());
});

// WIP(mattgoo)
test.skip(`activates ripple on focus and ${cssClasses.BOX} ` +
  'class is present', () => {
  const fixture = bel`
    <div class="mdc-select mdc-select--box">
      <div class="mdc-select__label"></div>
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
    </div>
  `;
  const raf = createMockRaf();

  new MDCSelect(fixture);

  const nativeControl = fixture.querySelector('.mdc-select__native-control');
  raf.flush();

  const fakeMatches = td.func('.matches');
  td.when(fakeMatches(':active')).thenReturn(true);
  nativeControl[getMatchesProperty(HTMLElement.prototype)] = fakeMatches;

  assert.isTrue(fixture.classList.contains('mdc-ripple-upgraded'));
  domEvents.emit(nativeControl, 'focus');
  raf.flush();

  assert.isTrue(fixture.classList.contains('mdc-ripple-upgraded--background-focused'));
  raf.restore();
});

test.skip('#destroy removes the ripple', () => {
  const fixture = bel`
    <div class="mdc-select mdc-select--box">
      <div class="mdc-select__label"></div>
      <select class="mdc-select__native-control">
        <option value="orange">
          Orange
        </option>
        <option value="apple" selected>
          Apple
        </option>
      </select>
    </div>
  `;
  const raf = createMockRaf();

  const component = new MDCSelect(fixture);
  const nativeControl = fixture.querySelector('.mdc-select__native-control');
  raf.flush();

  const fakeMatches = td.func('.matches');
  td.when(fakeMatches(':active')).thenReturn(true);
  nativeControl[getMatchesProperty(HTMLElement.prototype)] = fakeMatches;

  assert.isTrue(fixture.classList.contains('mdc-ripple-upgraded'));
  raf.flush();

  component.destroy();
  raf.flush();

  assert.isFalse(fixture.classList.contains('mdc-ripple-upgraded'));
  raf.restore();
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

test('adapter#registerInteractionHandler adds an event listener to the nativeControl element', () => {
  const {component, nativeControl} = setupTest();
  const listener = td.func('eventlistener');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', listener);
  domEvents.emit(nativeControl, 'click');
  td.verify(listener(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the nativeControl element', () => {
  const {component, nativeControl} = setupTest();
  const listener = td.func('eventlistener');
  nativeControl.addEventListener('click', listener);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', listener);
  domEvents.emit(nativeControl, 'click');
  td.verify(listener(td.matchers.anything()), {times: 0});
});

test('adapter#setValue sets the value of the select to the correct option', () => {
  const {nativeControl, component} = setupTest();
  component.getDefaultFoundation().adapter_.setValue('orange');
  assert.equal(nativeControl.value, 'orange');
});

test('adapter#getValue returns the nativeControl value', () => {
  const {nativeControl, component} = setupTest();
  nativeControl.value = 'orange';
  assert.equal(component.getDefaultFoundation().adapter_.getValue(), 'orange');
});

test('adapter#getSelectedIndex returns selected index', () => {
  const {component} = setupTest();
  component.selectedIndex = 1;
  assert.equal(component.getDefaultFoundation().adapter_.getSelectedIndex(), 1);
});
