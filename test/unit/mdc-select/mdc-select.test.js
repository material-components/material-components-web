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
import {strings} from '../../../packages/mdc-select/constants';

class FakeMenu {
  constructor() {
    this.items = [
      bel`<div id="item-1">Item 1</div>`,
      bel`<div id="item-2">Item 2</div>`,
      bel`<div id="item-3">Item 3</div>`,
      bel`<div>Item 4 no id</div>`,
    ];
    this.listen = td.func('menu.listen');
    this.unlisten = td.func('menu.unlisten');
    this.show = td.func('menu.show');
    this.hide = td.func('menu.hide');
    this.open = false;
  }
}

function getFixture() {
  return bel`
    <div class="mdc-select" role="listbox" tabindex="0">
      <span class="mdc-select__selected-text">Pick a food group</span>
      <div class="mdc-select__menu mdc-simple-menu">
        <ul class="mdc-simple-menu__items">
          <li class="mdc-list-item" role="option" tabindex="0">An option</li>
        </ul>
      </div>
    </div>
  `;
}

suite('MDCSelect');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCSelect.attachTo(getFixture()) instanceof MDCSelect);
});

function setupTest() {
  const menu = new FakeMenu();
  const fixture = getFixture();
  const menuEl = fixture.querySelector('.mdc-select__menu');
  const component = new MDCSelect(fixture, /* foundation */ undefined, () => menu);
  return {menu, menuEl, fixture, component};
}

test('options returns the menu items', () => {
  const {menu, component} = setupTest();
  assert.equal(component.options, menu.items);
});

test('selectOptions returns a NodeList containing the node with "aria-selected" as an attr', () => {
  const {component, fixture} = setupTest();
  const option = fixture.querySelector('[role="option"]');
  assert.equal(component.selectedOptions.length, 0, 'No selected options when none selected');
  option.setAttribute('aria-selected', 'true');
  assert.equal(component.selectedOptions.length, 1, 'One selected option when element has aria-selected');
  assert.equal(component.selectedOptions[0], option, 'Option within selected options is the selected option');
});

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
  assert.isOk(component.disabled);
});

test('#get value', () => {
  const {component} = setupTest();
  assert.equal(component.value, '');
  component.selectedIndex = 1;
  assert.equal(component.value, 'item-2');
  component.selectedIndex = 3;
  assert.equal(component.value, 'Item 4 no id');
});

test('#item returns the menu item at the specified index', () => {
  const {menu, component} = setupTest();
  assert.equal(component.item(1), menu.items[1]);
});

test('#item returns null if index out of bounds', () => {
  const {component} = setupTest();
  assert.equal(component.item(100), null);
});

test('#nameditem returns the item whose id matches the given key', () => {
  const {menu, component} = setupTest();
  assert.equal(component.nameditem('item-1'), menu.items[0]);
});

test('#nameditem returns the item whose "name" key matches the given key', () => {
  const {menu, component} = setupTest();
  const item = menu.items[0];
  const name = item.id;
  item.id = '';
  item.removeAttribute('id');
  item.setAttribute('name', name);
  assert.equal(component.nameditem(name), menu.items[0]);
});

test('#nameditem returns null when no id or name matches the given key', () => {
  const {component} = setupTest();
  assert.equal(component.nameditem('nonexistant'), null);
});

test('#initialSyncWithDOM sets the selected index if a menu item contains an aria-selected attribute', () => {
  const menu = new FakeMenu();
  const fixture = getFixture();
  // Insert menu item into fixture to pretend like the fake menu items are part of the component under test.
  menu.items[1].setAttribute('aria-selected', 'true');
  fixture.appendChild(menu.items[1]);

  const component = new MDCSelect(fixture, /* foundation */ undefined, () => menu);
  assert.equal(component.selectedIndex, 1);
});

test('#initialSyncWithDOM disables the menu if aria-disabled="true" is found on the element', () => {
  const fixture = getFixture();
  fixture.setAttribute('aria-disabled', 'true');
  const component = new MDCSelect(fixture);
  assert.isOk(component.disabled);
});

test('adapter#addClass adds a class to the root element', () => {
  const {component, fixture} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(fixture.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {component, fixture} = setupTest();
  fixture.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(fixture.classList.contains('foo'));
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
  assert.isNotOk(fixture.hasAttribute('aria-disabled'));
});

test('adapter#computeBoundingRect returns the result of getBoundingClientRect() on the root element', () => {
  const {component, fixture} = setupTest();
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.computeBoundingRect(),
    fixture.getBoundingClientRect()
  );
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {component, fixture} = setupTest();
  const listener = td.func('eventlistener');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', listener);
  domEvents.emit(fixture, 'click');
  td.verify(listener(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {component, fixture} = setupTest();
  const listener = td.func('eventlistener');
  fixture.addEventListener('click', listener);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', listener);
  domEvents.emit(fixture, 'click');
  td.verify(listener(td.matchers.anything()), {times: 0});
});

test('adapter#focus focuses on the root element', () => {
  const {component, fixture} = setupTest();
  const handler = td.func('fixture focus handler');
  fixture.addEventListener('focus', handler);
  document.body.appendChild(fixture);

  component.getDefaultFoundation().adapter_.focus();
  assert.equal(document.activeElement, fixture);

  document.body.removeChild(fixture);
});

test('adapter#makeTabbable sets the root element\'s tabindex to 0', () => {
  const {component, fixture} = setupTest();
  fixture.tabIndex = -1;
  component.getDefaultFoundation().adapter_.makeTabbable();
  assert.equal(fixture.tabIndex, 0);
});

test('adapter#makeUntabbable sets the root element\'s tabindex to -1', () => {
  const {component, fixture} = setupTest();
  fixture.tabIndex = 0;
  component.getDefaultFoundation().adapter_.makeUntabbable();
  assert.equal(fixture.tabIndex, -1);
});

test('adapter#getComputedStyleValue gets the computed style value of the prop from the root element', () => {
  const {component, fixture} = setupTest();
  document.body.appendChild(fixture);
  fixture.style.width = '500px';
  assert.equal(
    component.getDefaultFoundation().adapter_.getComputedStyleValue('width'),
    getComputedStyle(fixture).getPropertyValue('width')
  );
  document.body.removeChild(fixture);
});

test('adapter#setStyle sets the given style propertyName to the given value', () => {
  const {component, fixture} = setupTest();
  component.getDefaultFoundation().adapter_.setStyle('font-size', '13px');
  assert.equal(fixture.style.getPropertyValue('font-size'), '13px');
});

test('adapter#create2dRenderingContext returns a CanvasRenderingContext2d instance', () => {
  const {component} = setupTest();
  const fakeCtx = {};
  const fakeCanvas = {
    getContext: td.func('canvas.getContext'),
  };
  const origCreateElement = document.createElement;
  document.createElement = td.func('document.createElement');

  td.when(fakeCanvas.getContext('2d')).thenReturn(fakeCtx);
  td.when(document.createElement('canvas')).thenReturn(fakeCanvas);

  const ctx = component.getDefaultFoundation().adapter_.create2dRenderingContext();
  assert.equal(ctx, fakeCtx);

  document.createElement = origCreateElement;
});

test('adapter#setMenuElStyle sets a style property on the menu element', () => {
  const {component, menuEl} = setupTest();
  component.getDefaultFoundation().adapter_.setMenuElStyle('font-size', '10px');
  assert.equal(menuEl.style.fontSize, '10px');
});

test('adapter#setMenuElAttr sets an attribute on the menu element', () => {
  const {component, menuEl} = setupTest();
  component.getDefaultFoundation().adapter_.setMenuElAttr('aria-hidden', 'true');
  assert.equal(menuEl.getAttribute('aria-hidden'), 'true');
});

test('adapter#rmMenuElAttr removes an attribute from the menu element', () => {
  const {component, menuEl} = setupTest();
  menuEl.setAttribute('aria-hidden', 'true');
  component.getDefaultFoundation().adapter_.rmMenuElAttr('aria-hidden');
  assert.isNotOk(menuEl.hasAttribute('aria-hidden'));
});

test('adapter#getMenuElOffsetHeight returns the menu element\'s offsetHeight', () => {
  const {component, menuEl} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getMenuElOffsetHeight(), menuEl.offsetHeight);
});

test('adapter#openMenu shows the menu with the given focusIndex', () => {
  const {component, menu} = setupTest();
  component.getDefaultFoundation().adapter_.openMenu(1);
  td.verify(menu.show({focusIndex: 1}));
});

test('adapter#isMenuOpen returns whether or not the menu is open', () => {
  const {component, menu} = setupTest();
  const {adapter_: adapter} = component.getDefaultFoundation();
  menu.open = true;
  assert.isOk(adapter.isMenuOpen());
  menu.open = false;
  assert.isNotOk(adapter.isMenuOpen());
});

test('adapter#setSelectedTextContent sets the textContent of the selected text el', () => {
  const {component, fixture} = setupTest();
  component.getDefaultFoundation().adapter_.setSelectedTextContent('content');
  assert.equal(fixture.querySelector('.mdc-select__selected-text').textContent, 'content');
});

test('adapter#getNumberOfOptions returns the length of the component\'s options property', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getNumberOfOptions(), component.options.length);
});

test('adapter#getTextForOptionAtIndex gets the text content for the option at the given index', () => {
  const {component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getTextForOptionAtIndex(1),
    component.options[1].textContent
  );
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
  assert.isNotOk(component.options[1].hasAttribute('aria-disabled'));
});

test('adapter#getOffsetTopForOptionAtIndex returns the offsetTop for the option at the given index', () => {
  const {component, menu} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getOffsetTopForOptionAtIndex(1),
    menu.items[1].offsetTop
  );
});

test('adapter#registerMenuInteractionHandler listens for an interaction handler on the menu', () => {
  const {component, menu} = setupTest();
  const handler = () => {};
  component.getDefaultFoundation().adapter_.registerMenuInteractionHandler('evt', handler);
  td.verify(menu.listen('evt', handler));
});

test('adapter#deregisterMenuInteractionHandler unlistens for an interaction handler on the menu', () => {
  const {component, menu} = setupTest();
  const handler = () => {};
  component.getDefaultFoundation().adapter_.deregisterMenuInteractionHandler('evt', handler);
  td.verify(menu.unlisten('evt', handler));
});

test(`adapter#notifyChange emits an ${strings.CHANGE_EVENT} custom event from the root element`, () => {
  const {component, fixture} = setupTest();
  const handler = td.func('change handler');
  fixture.addEventListener(strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange();
  td.verify(handler(td.matchers.anything()));
});

test('adapter#getWindowInnerHeight returns window.innerHeight', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getWindowInnerHeight(), window.innerHeight);
});

test('adapter#getValueForOptionAtIndex returns the id of the option at the given index', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getValueForOptionAtIndex(1), 'item-2');
});

test('adapter#getValueForOptionAtIndex returns the textContent of the option at given index when ' +
     'no id value present', () => {
  const {component} = setupTest();
  assert.equal(component.getDefaultFoundation().adapter_.getValueForOptionAtIndex(3), 'Item 4 no id');
});
