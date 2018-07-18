/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import td from 'testdouble';
import bel from 'bel';
import {MDCList, MDCListFoundation} from '../../../packages/mdc-list';
import domEvents from 'dom-events';

function getFixture() {
  return bel`
  <ul class="mdc-list">
    <li class="mdc-list-item" tabindex="0">
      Fruit
      <button>one</button>
    </li>
    <li class="mdc-list-item">
      Pasta
      <button>two</button>
    </li>
    <li class="mdc-list-item">
      Pizza
    </li>
   </ul>
  `;
}

function setupTest() {
  const root = getFixture();
  const MockFoundationCtor = td.constructor(MDCListFoundation);
  const mockFoundation = new MockFoundationCtor();
  const component = new MDCList(root, mockFoundation);
  return {root, component, mockFoundation};
}

suite('MDCList');

test('attachTo initializes and returns a MDCList instance', () => {
  assert.isTrue(MDCList.attachTo(getFixture()) instanceof MDCList);
});

test('#adapter.getListItemCount returns correct number of list items', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const number = root.querySelectorAll('.mdc-list-item').length;
  assert.equal(number, component.getDefaultFoundation().adapter_.getListItemCount());
  document.body.removeChild(root);
});

test('#adapter.getFocusedElementIndex returns the index of the currently selected element', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  root.querySelectorAll('.mdc-list-item')[0].focus();
  assert.equal(0, component.getDefaultFoundation().adapter_.getFocusedElementIndex());
  document.body.removeChild(root);
});

test('#adapter.getListItemIndex returns the index of the element specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  assert.equal(1, component.getDefaultFoundation().adapter_.getListItemIndex(selectedNode));
  document.body.removeChild(root);
});

test('#adapter.setAttributeForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.setAttributeForElementIndex(5, 'foo', 'bar');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('#adapter.setAttributeForElementIndex sets the attribute for the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  component.getDefaultFoundation().adapter_.setAttributeForElementIndex(1, 'foo', 'bar');
  assert.equal('bar', selectedNode.getAttribute('foo'));
  document.body.removeChild(root);
});

test('#adapter.removeAttributeForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.removeAttributeForElementIndex(5, 'foo');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('#adapter.removeAttributeForElementIndex sets the attribute for the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  component.getDefaultFoundation().adapter_.setAttributeForElementIndex(1, 'foo', 'bar');
  component.getDefaultFoundation().adapter_.removeAttributeForElementIndex(1, 'foo');
  assert.isFalse(selectedNode.hasAttribute('foo'));
  document.body.removeChild(root);
});

test('#adapter.addClassForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.addClassForElementIndex(5, 'foo');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('#adapter.addClassForElementIndex adds the class to the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  component.getDefaultFoundation().adapter_.addClassForElementIndex(1, 'foo');
  assert.isTrue(selectedNode.classList.contains('foo'));
  document.body.removeChild(root);
});

test('#adapter.removeClassForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.removeClassForElementIndex(5, 'foo');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('#adapter.removeClassForElementIndex removes the class from the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  selectedNode.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassForElementIndex(1, 'foo');
  assert.isFalse(selectedNode.classList.contains('foo'));
  document.body.removeChild(root);
});

test('#adapter.focusItemAtIndex does not throw an error if element at index is undefined/null', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.focusItemAtIndex(5);
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('#adapter.focusItemAtIndex focuses the list item at the index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const items = root.querySelectorAll('.mdc-list-item');
  items[0].focus();
  component.getDefaultFoundation().adapter_.focusItemAtIndex(1);
  assert.isTrue(document.activeElement === items[1]);
  document.body.removeChild(root);
});

test('adapter#isListItem returns true if the element is a list item', () => {
  const {root, component} = setupTest(true);
  const item1 = root.querySelectorAll('.mdc-list-item')[0];
  assert.isTrue(component.getDefaultFoundation().adapter_.isListItem(item1));
});

test('adapter#isListItem returns false if the element is a not a list item', () => {
  const {root, component} = setupTest(true);
  const item1 = root.querySelectorAll('.mdc-list-item button')[0];
  assert.isFalse(component.getDefaultFoundation().adapter_.isListItem(item1));
});

test('adapter#isElementFocusable returns true if the element is a focusable list item sub-element', () => {
  const {root, component} = setupTest(true);
  const item1 = root.querySelectorAll('.mdc-list-item button')[0];
  assert.isTrue(component.getDefaultFoundation().adapter_.isElementFocusable(item1));
});

test('adapter#isElementFocusable returns false if the element is not a focusable list item sub-element',
  () => {
    const {root, component} = setupTest(true);
    const item1 = root.querySelectorAll('.mdc-list-item')[2];
    assert.isFalse(component.getDefaultFoundation().adapter_.isElementFocusable(item1));
  });

test('adapter#isElementFocusable returns false if the element is null/undefined',
  () => {
    const {component} = setupTest(true);
    assert.isFalse(component.getDefaultFoundation().adapter_.isElementFocusable());
  });

test('#adapter.setTabIndexForListItemChildren sets the child button/a elements of index', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const listItemIndex = 1;
  const listItem = root.querySelectorAll('.mdc-list-item')[listItemIndex];
  component.getDefaultFoundation().adapter_.setTabIndexForListItemChildren(listItemIndex, 0);

  assert.equal(1, root.querySelectorAll('button[tabindex="0"]').length);
  assert.equal(listItem, root.querySelectorAll('button[tabindex="0"]')[0].parentElement);
  document.body.removeChild(root);
});

test('layout adds tabindex=-1 to all list items without a tabindex', () => {
  const {root} = setupTest();
  assert.equal(0, root.querySelectorAll('.mdc-list-item:not([tabindex])').length);
});

test('layout adds tabindex=-1 to all list item button/a elements', () => {
  const {root} = setupTest();
  assert.equal(0, root.querySelectorAll('button:not([tabindex])').length);
});

test('vertical calls setVerticalOrientation on foundation', () => {
  const {component, mockFoundation} = setupTest();
  component.vertical = true;
  td.verify(mockFoundation.setVerticalOrientation(true), {times: 1});
});

test('wrapFocus calls setWrapFocus on foundation', () => {
  const {component, mockFoundation} = setupTest();
  component.wrapFocus = true;
  td.verify(mockFoundation.setWrapFocus(true), {times: 1});
});

test('singleSelection true sets the selectedIndex if a list item has the --selected class', () => {
  const {root, component, mockFoundation} = setupTest();
  root.querySelector('.mdc-list-item').classList.add(MDCListFoundation.cssClasses.LIST_ITEM_SELECTED_CLASS);
  component.singleSelection = true;
  td.verify(mockFoundation.setSelectedIndex(0), {times: 1});
});

test('singleSelection true sets the click handler from the root element', () => {
  const {root, component, mockFoundation} = setupTest();
  component.singleSelection = true;
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 1});
});

test('singleSelection false removes the click handler from the root element', () => {
  const {root, component, mockFoundation} = setupTest();
  component.singleSelection = true;
  component.singleSelection = false;
  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleClick(td.matchers.anything()), {times: 0});
});

test('singleSelection calls foundation setSingleSelection with the provided value', () => {
  const {component, mockFoundation} = setupTest();
  component.singleSelection = true;
  td.verify(mockFoundation.setSingleSelection(true), {times: 1});
});

test('selectedIndex calls setSelectedIndex on foundation', () => {
  const {component, mockFoundation} = setupTest();
  component.selectedIndex = 1;
  td.verify(mockFoundation.setSelectedIndex(1), {times: 1});
});

test('keydown handler is added to root element', () => {
  const {root, mockFoundation} = setupTest();
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown', false, true);
  root.dispatchEvent(event);
  td.verify(mockFoundation.handleKeydown(event), {times: 1});
});

test('keydown handler is removed from the root element on destroy', () => {
  const {root, component, mockFoundation} = setupTest();
  component.destroy();
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown', false, true);
  root.dispatchEvent(event);
  td.verify(mockFoundation.handleKeydown(event), {times: 0});
});
