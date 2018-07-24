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

import {MDCMenu} from '../../../packages/mdc-menu/index';
import {strings} from '../../../packages/mdc-menu/constants';
import {MenuSurfaceCorner} from '../../../packages/mdc-menu-surface/constants';

function getFixture(open) {
  return bel`
    <div class="mdc-menu-surface ${open ? 'mdc-menu-surface--open' : ''}" tabindex="-1">
      <ul class="mdc-list" role="menu">
        <li class="mdc-list-item" role="menuitem">Item</a>
        <li role="separator"></li>
        <li class="mdc-list-item" role="menuitem">Another Item</a>
      </nav>
    </div>
  `;
}

class FakeList {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
    this.itemsContainer = td.func('.root_');
    this.listElements_ = [];
  }
}

class FakeMenuSurface {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
    this.open = false;
    this.show = td.func('.show');
    this.hide = td.func('.hide');
    this.setAnchorCorner = td.func('.setAnchorCorner');
    this.setAnchorMargin = td.func('.setAnchorMargin');
    this.quickOpen = false;
    this.setFixedPosition = td.func('.setFixedPosition');
    this.hoistMenuToBody = td.func('.hoistMenuToBody');
    this.setIsHoisted = td.func('.setIsHoisted');
    this.anchorElement = null;
  }
}

function setupTest(open = false) {
  const root = getFixture(open);

  const menuSurface = new FakeMenuSurface(root);
  menuSurface.open = open;

  const list = new FakeList(root.querySelector('.mdc-list'));

  const component = new MDCMenu(root, undefined, () => menuSurface, () => list);
  return {root, component, menuSurface, list};
}

suite('MDCMenu');

test('constructor does not initialize list if not present', () => {
  const fixture = getFixture();
  const list = fixture.querySelector('.mdc-list');
  list.parentElement.removeChild(list);
  const component = new MDCMenu(fixture);

  // items will return undefined if the list is not instantiated
  assert.isUndefined(component.items);
});

test('destroy causes the menu-surface and list to be destroyed', () => {
  const {component, list, menuSurface} = setupTest();
  component.destroy();
  td.verify(list.destroy());
  td.verify(menuSurface.destroy());
});

test('destroy does throw an error if the list is not instantiated', () => {
  const fixture = getFixture();
  const list = fixture.querySelector('.mdc-list');
  list.parentElement.removeChild(list);
  const component = new MDCMenu(fixture);

  assert.doesNotThrow(component.destroy.bind(component));
});

test('attachTo initializes and returns a MDCMenu instance', () => {
  assert.isTrue(MDCMenu.attachTo(getFixture()) instanceof MDCMenu);
});

test('get/set open', () => {
  const {component, menuSurface} = setupTest();

  assert.isFalse(component.open);

  component.open = true;
  td.verify(menuSurface.show());

  component.open = false;
  td.verify(menuSurface.hide());
});

test('show opens the menu', () => {
  const {component, menuSurface} = setupTest();
  component.show();
  td.verify(menuSurface.show());
});

test('hide closes the menu', () => {
  const {component, menuSurface} = setupTest();
  component.open = true;
  component.hide();
  td.verify(menuSurface.hide());
});

test('setAnchorCorner proxies to the MDCMenuSurface#setAnchorCorner method', () => {
  const {component, menuSurface} = setupTest();
  component.setAnchorCorner(MenuSurfaceCorner.TOP_START);
  td.verify(menuSurface.setAnchorCorner(MenuSurfaceCorner.TOP_START));
});

test('setAnchorMargin', () => {
  const {component, menuSurface} = setupTest();
  component.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0});
  td.verify(menuSurface.setAnchorMargin({top: 0, right: 0, bottom: 0, left: 0}));
});

test('setQuickOpen', () => {
  const {component, menuSurface} = setupTest();
  component.quickOpen = true;
  assert.isTrue(menuSurface.quickOpen);
});

test('items returns all menu items', () => {
  const {root, component, list} = setupTest();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements_ = items;
  assert.deepEqual(component.items, items);
});

test('items returns nothing if list is not defined', () => {
  const {root, component, list} = setupTest();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements_ = items;
  assert.deepEqual(component.items, items);
});

test('getOptionByIndex', () => {
  const {root, component, list} = setupTest();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements_ = items;
  assert.deepEqual(component.getOptionByIndex(0), items[0]);
});

test('getOptionByIndex returns null if index is > list length', () => {
  const {root, component, list} = setupTest();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  list.listElements_ = items;
  assert.equal(component.getOptionByIndex(items.length), null);
});

test('fixed', () => {
  const {component, menuSurface} = setupTest();
  component.fixed = true;
  td.verify(menuSurface.setFixedPosition(true));

  component.fixed = false;
  td.verify(menuSurface.setFixedPosition(false));
});

test('hoistMenuToBody', () => {
  const {component, menuSurface} = setupTest();
  component.hoistMenuToBody();
  td.verify(menuSurface.hoistMenuToBody());
});

test('setIsHoisted', () => {
  const {component, menuSurface} = setupTest();
  component.setIsHoisted(true);
  td.verify(menuSurface.setIsHoisted(true));

  component.setIsHoisted(false);
  td.verify(menuSurface.setIsHoisted(false));
});

test('setAnchorElement', () => {
  const {component, menuSurface} = setupTest();
  const button = document.createElement('button');
  component.setAnchorElement(button);
  assert.equal(menuSurface.anchorElement, button);
});

// test('show registers event listeners', () => {
//   const {component} = setupTest();
//   component.show();
//
// });
