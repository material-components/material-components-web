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

import {MDCSimpleMenu} from '../../../packages/mdc-menu/simple';
import {strings} from '../../../packages/mdc-menu/simple/constants';
import {getTransformPropertyName} from '../../../packages/mdc-menu/util';

function getFixture(open) {
  return bel`
    <div class="mdc-simple-menu ${open ? 'mdc-simple-menu--open' : ''}" tabindex="-1">
      <ul class="mdc-simple-menu__items mdc-list" role="menu">
        <li class="mdc-list-item" role="menuitem" tabindex="0">Item</a>
        <li role="separator"></li>
        <li class="mdc-list-item" role="menuitem" tabindex="0">Another Item</a>
      </nav>
    </div>
  `;
}

function setupTest(open = false) {
  const root = getFixture(open);
  const component = new MDCSimpleMenu(root);
  return {root, component};
}

suite('MDCSimpleMenu');

test('attachTo initializes and returns a MDCSimpleMenu instance', () => {
  assert.isOk(MDCSimpleMenu.attachTo(getFixture()) instanceof MDCSimpleMenu);
});

test('get/set open', () => {
  const {component} = setupTest();
  component.open = true;
  assert.isOk(component.open);

  component.open = false;
  assert.isNotOk(component.open);
});

test('show opens the menu', () => {
  const {component} = setupTest();
  component.show();
  assert.isOk(component.open);
});

test('show with a focus index opens the menu', () => {
  const {component} = setupTest();
  component.show({focusIndex: 1});
  assert.isOk(component.open);
});

test('hide closes the menu', () => {
  const {component} = setupTest();
  component.open = true;
  component.hide();
  assert.isNotOk(component.open);
});

test('items returns all menu items', () => {
  const {root, component} = setupTest();
  const items = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
  assert.deepEqual(component.items, items);
});

test('foundationAdapter#addClass adds a class to the root element', () => {
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

test('adapter#hasClass returns true if the root element has specified class', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#hasClass returns false if the root element does not have specified class', () => {
  const {component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#hasNecessaryDom returns true if the DOM includes a drawer', () => {
  const {component} = setupTest();
  assert.isOk(component.getDefaultFoundation().adapter_.hasNecessaryDom());
});

test('adapter#getAttributeForEventTarget returns the value of an attribute for a given event target', () => {
  const {root, component} = setupTest();
  const attrName = 'aria-disabled';
  const attrVal = 'true';
  const target = root.querySelectorAll('[role="menuitem"]')[1];

  target.setAttribute(attrName, attrVal);

  assert.equal(component.getDefaultFoundation().adapter_.getAttributeForEventTarget(target, attrName), attrVal);
});

test('adapter#hasNecessaryDom returns false if the DOM does not include the items container', () => {
  const {root, component} = setupTest();
  const items = root.querySelector(strings.ITEMS_SELECTOR);
  root.removeChild(items);
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasNecessaryDom());
});

test('adapter#getInnerDimensions returns the dimensions of the items container', () => {
  const {root, component} = setupTest();
  const items = root.querySelector(strings.ITEMS_SELECTOR);
  assert.equal(component.getDefaultFoundation().adapter_.getInnerDimensions().width, items.offsetWidth);
  assert.equal(component.getDefaultFoundation().adapter_.getInnerDimensions().height, items.offsetHeight);
});

test('adapter#setScale sets the correct transform on the menu element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setScale(0.42, 0.84);
  assert.equal(root.style.getPropertyValue(getTransformPropertyName(window)), 'scale(0.42, 0.84)');
});

test('adapter#setInnerScale sets the correct transform on the items container', () => {
  const {root, component} = setupTest();
  const items = root.querySelector(strings.ITEMS_SELECTOR);
  component.getDefaultFoundation().adapter_.setInnerScale(0.42, 0.84);
  assert.equal(items.style.getPropertyValue(getTransformPropertyName(window)), 'scale(0.42, 0.84)');
});

test('adapter#getNumberOfItems returns the number of item elements within the items container', () => {
  const {root, component} = setupTest();
  const numberOfItems = root.querySelectorAll('[role="menuitem"]').length;
  assert.equal(component.getDefaultFoundation().adapter_.getNumberOfItems(), numberOfItems);
});

test('adapter#registerInteractionHandler proxies to addEventListener', () => {
  const {root, component} = setupTest();
  const handler = td.func('interactionHandler');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('foo', handler);
  domEvents.emit(root, 'foo');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler proxies to removeEventListener', () => {
  const {root, component} = setupTest();
  const handler = td.func('interactionHandler');
  root.addEventListener('foo', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('foo', handler);
  domEvents.emit(root, 'foo');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerBodyClickHandler proxies to addEventListener', () => {
  const {component} = setupTest();
  const handler = td.func('interactionHandler');

  component.getDefaultFoundation().adapter_.registerBodyClickHandler(handler);
  domEvents.emit(document.body, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterBodyClickHandler proxies to removeEventListener', () => {
  const {component} = setupTest();
  const handler = td.func('interactionHandler');

  document.body.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterBodyClickHandler(handler);
  domEvents.emit(document.body, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#getYParamsForItemAtIndex returns the height and top of the item at the provided index', () => {
  const {root, component} = setupTest();
  const items = root.querySelector(strings.ITEMS_SELECTOR);
  Object.assign(items.children[0].style, {
    position: 'absolute',
    top: '50px',
    height: '100px',
  });
  document.body.appendChild(root);
  assert.deepEqual(
    component.getDefaultFoundation().adapter_.getYParamsForItemAtIndex(0),
    {top: 50, height: 100}
  );
  document.body.removeChild(root);
});

test('adapter#setTransitionDelayForItemAtIndex sets the correct transition-delay for the element ' +
     'at the provided index', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setTransitionDelayForItemAtIndex(0, '0.42s');
  assert.equal(root.querySelector(strings.ITEMS_SELECTOR).children[0].style.transitionDelay, '0.42s');
});

test('adapter#getIndexForEventTarget returns the item index of the event target', () => {
  const {root, component} = setupTest();
  const target = root.querySelectorAll('[role="menuitem"]')[1];
  assert.equal(component.getDefaultFoundation().adapter_.getIndexForEventTarget(target), 1);
  assert.equal(component.getDefaultFoundation().adapter_.getIndexForEventTarget({}), -1, 'missing index = -1');
});

test(`adapter#notifySelected fires an ${strings.SELECTED_EVENT} custom event with the item and index`, () => {
  const {root, component} = setupTest();
  const item = root.querySelectorAll('[role="menuitem"]')[0];
  const handler = td.func('notifySelected handler');
  let evtData = null;
  td.when(handler(td.matchers.isA(Object))).thenDo((evt) => {
    evtData = evt.detail;
  });
  root.addEventListener(strings.SELECTED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifySelected({index: 0});
  assert.isOk(evtData !== null);
  assert.deepEqual(evtData, {
    item,
    index: 0,
  });
});

test(`adapter#notifyCancel fires an ${strings.CANCEL_EVENT} custom event`, () => {
  const {root, component} = setupTest();
  const handler = td.func('notifyCancel handler');
  root.addEventListener(strings.CANCEL_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyCancel();
  td.verify(handler(td.matchers.anything()));
});

test('adapter#restoreFocus restores the focus saved by adapter#saveFocus', () => {
  const {root, component} = setupTest(true);
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();
  component.getDefaultFoundation().adapter_.saveFocus();
  root.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();
  assert.equal(document.activeElement, button);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#restoreFocus does not restores the focus if never called adapter#saveFocus', () => {
  const {root, component} = setupTest(true);
  const button = bel`<button>Foo</button>`;
  document.body.appendChild(button);
  document.body.appendChild(root);
  button.focus();
  root.focus();
  component.getDefaultFoundation().adapter_.restoreFocus();
  assert.equal(document.activeElement, root);
  document.body.removeChild(button);
  document.body.removeChild(root);
});

test('adapter#isFocused returns whether the menu is focused', () => {
  const {root, component} = setupTest(true);
  document.body.appendChild(root);
  root.focus();
  assert.isOk(component.getDefaultFoundation().adapter_.isFocused());
  document.body.removeChild(root);
});

test('adapter#focus focuses the menu', () => {
  const {root, component} = setupTest(true);
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.focus();
  assert.equal(document.activeElement, root);
  document.body.removeChild(root);
});

test('adapter#getFocusedItemIndex returns the item index of the focused menu element', () => {
  const {root, component} = setupTest(true);
  const item = root.querySelectorAll('[role="menuitem"]')[1];
  document.body.appendChild(root);
  item.focus();
  assert.equal(component.getDefaultFoundation().adapter_.getFocusedItemIndex(), 1);
  root.focus();
  assert.equal(component.getDefaultFoundation().adapter_.getFocusedItemIndex(), -1, 'missing index = -1');
  document.body.removeChild(root);
});

test('adapter#focusItemAtIndex focuses the right menu element', () => {
  const {root, component} = setupTest(true);
  const item1 = root.querySelectorAll('[role="menuitem"]')[1];
  const item2 = root.querySelectorAll('[role="menuitem"]')[0];
  document.body.appendChild(root);
  component.getDefaultFoundation().adapter_.focusItemAtIndex(1);
  assert.equal(document.activeElement, item1);
  component.getDefaultFoundation().adapter_.focusItemAtIndex(0);
  assert.equal(document.activeElement, item2);
  document.body.removeChild(root);
});

test('adapter#hasAnchor returns true if it has an anchor', () => {
  const anchor = bel`<div class="mdc-menu-anchor"></div>`;
  const {root, component} = setupTest(true);
  anchor.appendChild(root);
  assert.isOk(component.getDefaultFoundation().adapter_.hasAnchor());
});

test('adapter#hasAnchor returns false if it does not have an anchor', () => {
  const notAnAnchor = bel`<div></div>`;
  const {root, component} = setupTest(true);
  notAnAnchor.appendChild(root);
  assert.isNotOk(component.getDefaultFoundation().adapter_.hasAnchor());
});

test('adapter#getAnchorDimensions returns the dimensions of the anchor container', () => {
  const anchor = bel`<div class="mdc-menu-anchor" style="height: 21px; width: 42px;"></div>`;
  const {root, component} = setupTest(true);
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.equal(component.getDefaultFoundation().adapter_.getAnchorDimensions().height, 21);
  assert.equal(component.getDefaultFoundation().adapter_.getAnchorDimensions().width, 42);
  document.body.removeChild(anchor);
});

test('adapter#getWindowDimensions returns the dimensions of the window', () => {
  const {root, component} = setupTest(true);
  document.body.appendChild(root);
  assert.equal(component.getDefaultFoundation().adapter_.getWindowDimensions().height, window.innerHeight);
  assert.equal(component.getDefaultFoundation().adapter_.getWindowDimensions().width, window.innerWidth);
  document.body.removeChild(root);
});

test('adapter#isRtl returns true for RTL documents', () => {
  const anchor = bel`<div dir="rtl" class="mdc-menu-anchor"></div>`;
  const {root, component} = setupTest(true);
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.isOk(component.getDefaultFoundation().adapter_.isRtl());
  document.body.removeChild(anchor);
});

test('adapter#isRtl returns false for explicit LTR documents', () => {
  const anchor = bel`<div dir="ltr" class="mdc-menu-anchor"></div>`;
  const {root, component} = setupTest(true);
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.isNotOk(component.getDefaultFoundation().adapter_.isRtl());
  document.body.removeChild(anchor);
});

test('adapter#isRtl returns false for implicit LTR documents', () => {
  const anchor = bel`<div class="mdc-menu-anchor"></div>`;
  const {root, component} = setupTest(true);
  anchor.appendChild(root);
  document.body.appendChild(anchor);
  assert.isNotOk(component.getDefaultFoundation().adapter_.isRtl());
  document.body.removeChild(anchor);
});

test('adapter#setTransformOrigin sets the correct transform origin on the menu element', () => {
  const {root, component} = setupTest();
  // Write expected value and read canonical value from browser.
  root.style.webkitTransformOrigin = root.style.transformOrigin = 'left top 10px';
  const expected = root.style.getPropertyValue(`${getTransformPropertyName(window)}-origin`);
  // Reset value.
  root.style.webkitTransformOrigin = root.style.transformOrigin = '';

  component.getDefaultFoundation().adapter_.setTransformOrigin('left top 10px');
  assert.equal(root.style.getPropertyValue(`${getTransformPropertyName(window)}-origin`), expected);
});

test('adapter#setPosition sets the correct position on the menu element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.setPosition({top: '10px', left: '11px'});
  assert.equal(root.style.top, '10px');
  assert.equal(root.style.left, '11px');
  component.getDefaultFoundation().adapter_.setPosition({bottom: '10px', right: '11px'});
  assert.equal(root.style.bottom, '10px');
  assert.equal(root.style.right, '11px');
});
