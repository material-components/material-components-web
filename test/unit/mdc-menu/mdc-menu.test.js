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
import domEvents from 'dom-events';

import {MDCMenu, MDCMenuFoundation} from '../../../packages/mdc-menu/index';
import {Corner} from '../../../packages/mdc-menu-surface/constants';
import {MDCListFoundation} from '../../../packages/mdc-list/index';
import {MDCMenuSurfaceFoundation} from '../../../packages/mdc-menu-surface/foundation';

function getFixture(open) {
  return bel`
    <div class="mdc-menu mdc-menu-surface ${open ? 'mdc-menu-surface--open' : ''}" tabindex="-1">
      <ul class="mdc-list" role="menu">
        <li tabIndex="-1" class="mdc-list-item" role="menuitem">Item</a>
        <li role="separator"></li>
        <li tabIndex="-1" class="mdc-list-item" role="menuitem">Another Item</a>
        <ul class="mdc-menu__selection-group mdc-list" role="menu">
          <li tabIndex="-1" class="mdc-list-item" role="menuitem">Item</a>
          <li tabIndex="-1" class="mdc-list-item mdc-menu-item--selected" role="menuitem">Another Item</a>
        </ul>
      </ul>
    </div>
  `;
}

class FakeList {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
    this.itemsContainer = td.func('.root_');
    this.wrapFocus = true;
    this.listElements = [].slice.call(root.querySelectorAll('.mdc-list-item'));
  }
}

class FakeMenuSurface {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
    this.open = false;
    this.listen = td.function();
    this.unlisten = td.function();
    this.setAnchorCorner = td.func('.setAnchorCorner');
    this.setAnchorMargin = td.func('.setAnchorMargin');
    this.quickOpen = false;
    this.setFixedPosition = td.func('.setFixedPosition');
    this.setAbsolutePosition = td.func('.setAbsolutePosition');
    this.hoistMenuToBody = td.func('.hoistMenuToBody');
    this.setIsHoisted = td.func('.setIsHoisted');
    this.anchorElement = null;
  }
}

function setupTestWithFakes(open = false) {
  const root = getFixture(open);

  const menuSurface = new FakeMenuSurface(root);
  menuSurface.open = open;

  const MockFoundationCtor = td.constructor(MDCListFoundation);
  const mockFoundation = new MockFoundationCtor();

  const list = new FakeList(root.querySelector('.mdc-list'));
  const component = new MDCMenu(root, mockFoundation, () => menuSurface, () => list);
  return {root, component, menuSurface, list, mockFoundation};
}

function setupTest(open = false) {
  const root = getFixture(open);

  const component = new MDCMenu(root);
  return {root, component};
}

suite('MDCMenu');

test('destroy causes the menu-surface and list to be destroyed', () => {
  const {component, list, menuSurface} = setupTestWithFakes();
  component.destroy();
  td.verify(list.destroy());
  td.verify(menuSurface.destroy());
  td.verify(menuSurface.unlisten(td.matchers.anything(), td.matchers.anything()));
});

test('destroy does not throw an error if the list is not instantiated', () => {
  const fixture = getFixture();
  const list = fixture.querySelector('.mdc-list');
  list.parentElement.removeChild(list);
  const component = new MDCMenu(fixture);

  assert.doesNotThrow(component.destroy.bind(component));
});

test('attachTo initializes and returns a MDCMenu instance', () => {
  assert.isTrue(MDCMenu.attachTo(getFixture()) instanceof MDCMenu);
});

test('initialize registers event listener for click', () => {
  const {mockFoundation, root} = setupTestWithFakes();
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.isA(Event)), {times: 1});
});

test('initialize registers event listener for keydown', () => {
  const {mockFoundation, root} = setupTestWithFakes();
  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.isA(Event)), {times: 1});
});

test('destroy deregisters event listener for click', () => {
  const {component, mockFoundation, root} = setupTestWithFakes();
  component.destroy();

  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 0});
});

test('destroy deregisters event listener for keydown', () => {
  const {component, mockFoundation, root} = setupTestWithFakes();
  component.destroy();

  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.anything()), {times: 0});
});

test('get/set open', () => {
  const {component, menuSurface} = setupTestWithFakes();

  assert.isFalse(component.open);

  component.open = true;
  assert.isTrue(menuSurface.open);

  component.open = false;
  assert.isFalse(menuSurface.open);
});

test('wrapFocus proxies to MDCList#wrapFocus property', () => {
  const {component, list} = setupTestWithFakes();

  assert.isTrue(component.wrapFocus);

  component.wrapFocus = false;
  assert.isFalse(list.wrapFocus);
});

test('setAnchorCorner proxies to the MDCMenuSurface#setAnchorCorner method', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.setAnchorCorner(Corner.TOP_START);
  td.verify(menuSurface.setAnchorCorner(Corner.TOP_START));
});

test('setAnchorMargin', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0});
  td.verify(menuSurface.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0}));
});

test('setQuickOpen', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.quickOpen = true;
  assert.isTrue(menuSurface.quickOpen);
});

test('items returns all menu items', () => {
  const {root, component, list} = setupTestWithFakes();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements = items;
  assert.deepEqual(component.items, items);
});

test('items returns nothing if list is not defined', () => {
  const {root, component, list} = setupTestWithFakes();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements = items;
  assert.deepEqual(component.items, items);
});

test('getOptionByIndex', () => {
  const {root, component, list} = setupTestWithFakes();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements = items;
  assert.deepEqual(component.getOptionByIndex(0), items[0]);
});

test('getOptionByIndex returns null if index is > list length', () => {
  const {root, component, list} = setupTestWithFakes();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements = items;
  assert.isNull(component.getOptionByIndex(items.length));
});

test('setFixedPosition', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.setFixedPosition(true);
  td.verify(menuSurface.setFixedPosition(true));

  component.setFixedPosition(false);
  td.verify(menuSurface.setFixedPosition(false));
});

test('hoistMenuToBody', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.hoistMenuToBody();
  td.verify(menuSurface.hoistMenuToBody());
});

test('setIsHoisted', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.setIsHoisted(true);
  td.verify(menuSurface.setIsHoisted(true));

  component.setIsHoisted(false);
  td.verify(menuSurface.setIsHoisted(false));
});

test('setAnchorElement', () => {
  const {component, menuSurface} = setupTestWithFakes();
  const button = document.createElement('button');
  component.setAnchorElement(button);
  assert.equal(menuSurface.anchorElement, button);
});

test('setAbsolutePosition', () => {
  const {component, menuSurface} = setupTestWithFakes();
  component.setAbsolutePosition(100, 120);
  td.verify(menuSurface.setAbsolutePosition(100, 120));
});

test('menu surface opened event causes first element to be focused', () => {
  const {root} = setupTest();
  document.body.appendChild(root);
  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
  root.dispatchEvent(event);

  assert.equal(document.activeElement, root.querySelector('.mdc-list-item'));
  document.body.removeChild(root);
});

test('menu surface opened event causes no element to be focused if the list is empty', () => {
  const {root} = setupTest();
  const lastActiveElement = document.activeElement;
  root.querySelector('.mdc-list').innerHTML = ''; // Quick clear of all list items
  const event = document.createEvent('Event');
  event.initEvent(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, false, true);
  document.body.appendChild(root);

  root.dispatchEvent(event);

  assert.equal(document.activeElement, lastActiveElement);
  document.body.removeChild(root);
});

test('open=true does not throw an error if there are no items in the list to focus', () => {
  const {component, root, list} = setupTestWithFakes();
  list.listElements = [];
  document.body.appendChild(root);
  root.querySelector('.mdc-list-item');
  assert.doesNotThrow(() => {
    component.open = true;
  });
  document.body.removeChild(root);
});

// Adapter method test

test('adapter#addClassToElementAtIndex adds a class to the element at the index provided', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  component.getDefaultFoundation().adapter_.addClassToElementAtIndex(0, 'foo');
  assert.isTrue(firstItem.classList.contains('foo'));
});

test('adapter#removeClassFromElementAtIndex adds a class to the element at the index provided', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  firstItem.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromElementAtIndex(0, 'foo');
  assert.isFalse(firstItem.classList.contains('foo'));
});

test('adapter#addAttributeToElementAtIndex adds a class to the element at the index provided', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  component.getDefaultFoundation().adapter_.addAttributeToElementAtIndex(0, 'foo', 'true');
  assert.isTrue(firstItem.getAttribute('foo') === 'true');
});

test('adapter#removeAttributeFromElementAtIndex adds a class to the element at the index provided', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  firstItem.setAttribute('foo', 'true');
  component.getDefaultFoundation().adapter_.removeAttributeFromElementAtIndex(0, 'foo');
  assert.isNull(firstItem.getAttribute('foo'));
});

test('adapter#elementContainsClass returns true if the class exists on the element', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  firstItem.classList.add('foo');
  const containsFoo = component.getDefaultFoundation().adapter_.elementContainsClass(firstItem, 'foo');
  assert.isTrue(containsFoo);
});

test('adapter#elementContainsClass returns false if the class does not exist on the element', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  const containsFoo = component.getDefaultFoundation().adapter_.elementContainsClass(firstItem, 'foo');
  assert.isFalse(containsFoo);
});

test('adapter#closeSurface proxies to menuSurface#open', () => {
  const {component, menuSurface} = setupTestWithFakes();
  menuSurface.open = true;
  component.getDefaultFoundation().adapter_.closeSurface();
  assert.isFalse(menuSurface.open);
});

test('adapter#getElementIndex returns the index value of an element in the list', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  const indexValue = component.getDefaultFoundation().adapter_.getElementIndex(firstItem);
  assert.equal(indexValue, 0);
});

test('adapter#getElementIndex returns -1 if the element does not exist in the list', () => {
  const {component} = setupTest();
  const firstItem = document.createElement('li');
  const indexValue = component.getDefaultFoundation().adapter_.getElementIndex(firstItem);
  assert.equal(indexValue, -1);
});

test('adapter#getParentElement returns the parent element of an element', () => {
  const {root, component} = setupTest();
  const firstItem = root.querySelector('.mdc-list-item');
  const parentElement = component.getDefaultFoundation().adapter_.getParentElement(firstItem);
  assert.equal(firstItem.parentElement, parentElement);
});

test('adapter#getSelectedElementIndex returns the index of the "selected" element in a group', () => {
  const {root, component} = setupTest();
  const selectionGroup = root.querySelector('.mdc-menu__selection-group');
  const index = component.getDefaultFoundation().adapter_.getSelectedElementIndex(selectionGroup);
  assert.equal(root.querySelector('.mdc-menu-item--selected'), component.items[index]);
});

test('adapter#getSelectedElementIndex returns -1 if the "selected" element is not in a group', () => {
  const {root, component} = setupTest();
  const selectionGroup = root.querySelector('.mdc-menu__selection-group');
  const element = root.querySelector('.mdc-menu-item--selected');
  element.classList.remove('mdc-menu-item--selected');
  const index = component.getDefaultFoundation().adapter_.getSelectedElementIndex(selectionGroup);
  assert.equal(index, -1);
});

test('adapter#notifySelected emits an event for a selected element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  root.addEventListener(MDCMenuFoundation.strings.SELECTED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifySelected(0);
  td.verify(handler(td.matchers.anything()));
});
