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
import td from 'testdouble';
import bel from 'bel';
import {MDCList, MDCListFoundation} from '../../../packages/mdc-list/index';
import {cssClasses, strings} from '../../../packages/mdc-list/constants';

function getFixture() {
  return bel`
  <ul class="mdc-list" tabindex="-1">
    <li class="mdc-list-item" tabindex="0">
      <span class="mdc-list-item__text">Fruit</span>
      <button>one</button>
    </li>
    <li class="mdc-list-item">
      <span class="mdc-list-item__text">Potato</span>
      <a href="http://www.google.com">Link</a>
    </li>
    <li class="mdc-list-item">
      <span class="mdc-list-item__text">Pasta</span>
      <input type="checkbox"/>
    </li>
    <li class="mdc-list-item">
      <span class="mdc-list-item__text">Pizza</span>
      <input type="radio"/>
    </li>
   </ul>
  `;
}

function getFixtureWithDisabledItems() {
  return bel`
  <ul class="mdc-list" tabindex="-1">
    <li class="mdc-list-item" tabindex="0">
      <span class="mdc-list-item__text">Fruit</span>
      <button>one</button>
    </li>
    <li class="mdc-list-item mdc-list-item--disabled" aria-disabled="true">
      <span class="mdc-list-item__text">Potato</span>
      <a href="http://www.google.com">Link</a>
    </li>
    <li class="mdc-list-item mdc-list-item--disabled" aria-disabled="true">
      <span class="mdc-list-item__text">Pasta</span>
      <input type="checkbox"/>
    </li>
    <li class="mdc-list-item">
      <span class="mdc-list-item__text">Pizza</span>
      <input type="radio"/>
    </li>
   </ul>
  `;
}

function setupTest(root = getFixture()) {
  const MockFoundationCtor = td.constructor(MDCListFoundation);
  const mockFoundation = new MockFoundationCtor();
  const component = new MDCList(root, mockFoundation);
  return {root, component, mockFoundation};
}

suite('MDCList');

test('attachTo initializes and returns a MDCList instance', () => {
  assert.isTrue(MDCList.attachTo(getFixture()) instanceof MDCList);
});

test('component calls setVerticalOrientation on the foundation if aria-orientation is not set', () => {
  const {mockFoundation} = setupTest();
  td.verify(mockFoundation.setVerticalOrientation(true), {times: 1});
});

test('component calls setVerticalOrientation(false) on the foundation if aria-orientation=horizontal', () => {
  const root = getFixture();
  root.setAttribute('aria-orientation', 'horizontal');
  const {mockFoundation} = setupTest(root);
  td.verify(mockFoundation.setVerticalOrientation(false), {times: 1});
});

test('component calls setVerticalOrientation(true) on the foundation if aria-orientation=vertical', () => {
  const root = getFixture();
  root.setAttribute('aria-orientation', 'vertical');
  const {mockFoundation} = setupTest(root);
  td.verify(mockFoundation.setVerticalOrientation(true), {times: 1});
});

test('#initializeListType sets the selectedIndex if a list item has the --selected class', () => {
  const {root, component, mockFoundation} = setupTest();
  root.querySelector('.mdc-list-item').classList.add(MDCListFoundation.cssClasses.LIST_ITEM_SELECTED_CLASS);
  component.initializeListType();
  td.verify(mockFoundation.setSelectedIndex(0), {times: 1});
  td.verify(mockFoundation.setSingleSelection(true), {times: 1});
});

test('#initializeListType sets the selectedIndex if a list item has the --activated class', () => {
  const {root, component, mockFoundation} = setupTest();
  root.querySelector('.mdc-list-item').classList.add(MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS);
  component.initializeListType();
  td.verify(mockFoundation.setSelectedIndex(0), {times: 1});
  td.verify(mockFoundation.setSingleSelection(true), {times: 1});
});

test('#initializeListType calls the foundation if the --activated class is present', () => {
  const {root, component, mockFoundation} = setupTest();
  root.querySelector('.mdc-list-item').classList.add(MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS);
  component.initializeListType();
  td.verify(mockFoundation.setUseActivatedClass(true), {times: 1});
  td.verify(mockFoundation.setSingleSelection(true), {times: 1});
});

test('#initializeListType populates selectedIndex based on preselected checkbox items', () => {
  const {root, component, mockFoundation} = setupTest();
  const listElements = root.querySelectorAll(`.${cssClasses.LIST_ITEM_CLASS}`);
  [].map.call(listElements, (itemEl) => itemEl.setAttribute('role', 'checkbox'));

  listElements[2].setAttribute('aria-checked', 'true');
  component.initializeListType();
  td.verify(mockFoundation.setSelectedIndex([2]), {times: 1});
});

test('#initializeListType populates selectedIndex based on preselected radio item', () => {
  const {root, component, mockFoundation} = setupTest();
  const listElements = root.querySelectorAll(`.${cssClasses.LIST_ITEM_CLASS}`);
  listElements[3].setAttribute('role', 'radio');
  listElements[3].setAttribute('aria-checked', 'true');

  component.initializeListType();
  td.verify(mockFoundation.setSelectedIndex(3), {times: 1});
});

test('#initializeListType does not populate selectedIndex when no item is selected', () => {
  const {component, mockFoundation} = setupTest();
  component.initializeListType();
  td.verify(mockFoundation.setSelectedIndex(td.matchers.anything()), {times: 0});
});

test('#setEnabled calls foundation method setEnabled with given index and enabled state.', () => {
  const {component, mockFoundation} = setupTest();
  component.setEnabled(1, true);
  td.verify(mockFoundation.setEnabled(1, true), {times: 1});
});

test('adapter#getListItemCount returns correct number of list items', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const number = root.querySelectorAll('.mdc-list-item').length;
  assert.equal(number, component.getDefaultFoundation().adapter_.getListItemCount());
  document.body.removeChild(root);
});

test('adapter#getFocusedElementIndex returns the index of the currently selected element', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  root.querySelectorAll('.mdc-list-item')[0].focus();
  assert.equal(0, component.getDefaultFoundation().adapter_.getFocusedElementIndex());
  document.body.removeChild(root);
});

test('adapter#setAttributeForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.setAttributeForElementIndex(5, 'foo', 'bar');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('adapter#setAttributeForElementIndex sets the attribute for the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  component.getDefaultFoundation().adapter_.setAttributeForElementIndex(1, 'foo', 'bar');
  assert.equal('bar', selectedNode.getAttribute('foo'));
  document.body.removeChild(root);
});

test('adapter#addClassForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.addClassForElementIndex(5, 'foo');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('adapter#addClassForElementIndex adds the class to the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  component.getDefaultFoundation().adapter_.addClassForElementIndex(1, 'foo');
  assert.isTrue(selectedNode.classList.contains('foo'));
  document.body.removeChild(root);
});

test('adapter#removeClassForElementIndex does nothing if the element at index does not exist', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.removeClassForElementIndex(5, 'foo');
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('adapter#removeClassForElementIndex removes the class from the list element at index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const selectedNode = root.querySelectorAll('.mdc-list-item')[1];
  selectedNode.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassForElementIndex(1, 'foo');
  assert.isFalse(selectedNode.classList.contains('foo'));
  document.body.removeChild(root);
});

test('adapter#focusItemAtIndex does not throw an error if element at index is undefined/null', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const func = () => {
    component.getDefaultFoundation().adapter_.focusItemAtIndex(5);
  };
  assert.doesNotThrow(func);
  document.body.removeChild(root);
});

test('adapter#focusItemAtIndex focuses the list item at the index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const items = root.querySelectorAll('.mdc-list-item');
  items[0].focus();
  component.getDefaultFoundation().adapter_.focusItemAtIndex(1);
  assert.isTrue(document.activeElement === items[1]);
  document.body.removeChild(root);
});

test('adapter#setTabIndexForListItemChildren sets the child button/a elements of index', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const listItems = root.querySelectorAll('.mdc-list-item');

  component.getDefaultFoundation().adapter_.setTabIndexForListItemChildren(0, 0);
  component.getDefaultFoundation().adapter_.setTabIndexForListItemChildren(1, 0);

  assert.equal(1, listItems[0].querySelectorAll('[tabindex="0"]').length);
  assert.equal(1, listItems[1].querySelectorAll('[tabindex="0"]').length);

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
  component.vertical = false;
  td.verify(mockFoundation.setVerticalOrientation(false), {times: 1});
});

test('wrapFocus calls setWrapFocus on foundation', () => {
  const {component, mockFoundation} = setupTest();
  component.wrapFocus = true;
  td.verify(mockFoundation.setWrapFocus(true), {times: 1});
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

test('#selectedIndex getter proxies foundations getSelectedIndex method', () => {
  const {component, mockFoundation} = setupTest();

  td.when(mockFoundation.getSelectedIndex()).thenReturn(3);
  assert.equal(3, component.selectedIndex);
});

test('handleClick handler is added to root element', () => {
  const {root, mockFoundation} = setupTest();
  document.body.appendChild(root);
  const event = document.createEvent('Event');
  event.initEvent('click', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleClick(0, true), {times: 1});
  document.body.removeChild(root);
});

test('focusIn handler is added to root element', () => {
  const {root, mockFoundation} = setupTest();
  document.body.appendChild(root);
  const event = document.createEvent('Event');
  event.initEvent('focusin', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleFocusIn(event, 0), {times: 1});
  document.body.removeChild(root);
});

test('focusIn handler is removed from the root element on destroy', () => {
  const {root, component, mockFoundation} = setupTest();
  document.body.appendChild(root);
  component.destroy();
  const event = document.createEvent('Event');
  event.initEvent('focusin', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleFocusIn(event, 0), {times: 0});
  document.body.removeChild(root);
});

test('focusOut handler is added to root element', () => {
  const {root, mockFoundation} = setupTest();
  document.body.appendChild(root);
  const event = document.createEvent('Event');
  event.initEvent('focusout', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleFocusOut(event, 0), {times: 1});
  document.body.removeChild(root);
});

test('focusOut handler is removed from the root element on destroy', () => {
  const {root, component, mockFoundation} = setupTest();
  document.body.appendChild(root);
  component.destroy();
  const event = document.createEvent('Event');
  event.initEvent('focusout', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleFocusOut(event, 0), {times: 0});
  document.body.removeChild(root);
});

test('keydown handler is added to root element', () => {
  const {root, mockFoundation} = setupTest();
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleKeydown(event, true, 0), {times: 1});
});

test('keydown handler is triggered when a sub-element of a list is triggered', () => {
  const {root, mockFoundation} = setupTest();
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown', true, true);
  const button = root.querySelector('.mdc-list-item button');
  button.dispatchEvent(event);
  td.verify(mockFoundation.handleKeydown(event, false, 0), {times: 1});
});

test('keydown calls foundation.handleKeydown method with negative index when event triggered on list root ', () => {
  const {root, mockFoundation} = setupTest();
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown', true, true);
  root.dispatchEvent(event);
  td.verify(mockFoundation.handleKeydown(event, false, -1), {times: 1});
});

test('keydown handler is removed from the root element on destroy', () => {
  const {root, component, mockFoundation} = setupTest();
  component.destroy();
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown', true, true);
  const listElementItem = root.querySelector('.mdc-list-item');
  listElementItem.dispatchEvent(event);
  td.verify(mockFoundation.handleKeydown(event, true, 0), {times: 0});
});

test('#listElements should return all list items including disabled list items', () => {
  const {component} = setupTest(getFixtureWithDisabledItems());
  assert.equal(4, component.listElements.length);
});

test('adapter#hasRadioAtIndex return true or false based on presense of radio button on list item', () => {
  const {component} = setupTest();

  assert.isTrue(component.getDefaultFoundation().adapter_.hasRadioAtIndex(3));
  assert.isFalse(component.getDefaultFoundation().adapter_.hasRadioAtIndex(0));
});

test('adapter#hasCheckboxAtIndex return true or false based on presense of checkbox button on list item', () => {
  const {component} = setupTest();

  assert.isTrue(component.getDefaultFoundation().adapter_.hasCheckboxAtIndex(2));
  assert.isFalse(component.getDefaultFoundation().adapter_.hasCheckboxAtIndex(0));
});

test('adapter#isCheckboxCheckedAtIndex returns true or false based if checkbox is checked on a list item', () => {
  const {root, component} = setupTest();

  assert.isFalse(component.getDefaultFoundation().adapter_.isCheckboxCheckedAtIndex(2));
  document.body.appendChild(root);
  const checkbox = root.querySelector('input[type="checkbox"]');
  checkbox.checked = true;
  assert.isTrue(component.getDefaultFoundation().adapter_.isCheckboxCheckedAtIndex(2));
  document.body.removeChild(root);
});

test('adapter#setCheckedCheckboxOrRadioAtIndex toggles the checkbox on list item', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const checkbox = root.querySelector('input[type="checkbox"]');

  component.getDefaultFoundation().adapter_.setCheckedCheckboxOrRadioAtIndex(2, true);
  assert.isTrue(checkbox.checked);

  component.getDefaultFoundation().adapter_.setCheckedCheckboxOrRadioAtIndex(2, false);
  assert.isFalse(checkbox.checked);
  document.body.removeChild(root);
});

test('adapter#setCheckedCheckboxOrRadioAtIndex toggles the radio on list item', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const radio = root.querySelector('input[type="radio"]');

  component.getDefaultFoundation().adapter_.setCheckedCheckboxOrRadioAtIndex(3, true);
  assert.isTrue(radio.checked);

  component.getDefaultFoundation().adapter_.setCheckedCheckboxOrRadioAtIndex(3, false);
  assert.isFalse(radio.checked);
  document.body.removeChild(root);
});

test('adapter#notifyAction emits action event', () => {
  const {component} = setupTest();

  let detail = null;
  const handler = (evt) => detail = evt.detail;

  component.listen(strings.ACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyAction(3);
  component.unlisten(strings.ACTION_EVENT, handler);

  assert.deepEqual(detail, {index: 3});
});

test('adapter#isFocusInsideList returns true if focus is inside list root', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  assert.isFalse(component.getDefaultFoundation().adapter_.isFocusInsideList());
  root.querySelector('.mdc-list-item').focus();
  assert.isTrue(component.getDefaultFoundation().adapter_.isFocusInsideList());
  document.body.removeChild(root);
});

test('adapter#isRootFocused returns true if list root is on focus', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  assert.isFalse(component.getDefaultFoundation().adapter_.isRootFocused());
  root.focus();
  assert.isTrue(component.getDefaultFoundation().adapter_.isRootFocused());
  document.body.removeChild(root);
});
