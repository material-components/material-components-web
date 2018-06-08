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
import {MDCList} from '../../../packages/mdc-list';
import {MDCListFoundation} from '../../../packages/mdc-list/foundation';

function getFixture() {
  return bel`
  <ul class="mdc-list">
    <li class="mdc-list-item" tabindex="0">Fruit
    <button>one</button></li>
    <li class="mdc-list-item">Pasta
    <button>two</button></li>
    <li class="mdc-list-item">Pizza</li>
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

test('#adapter.focusItemAtIndex focuses the list item at the index specified', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const items = root.querySelectorAll('.mdc-list-item');
  items[0].focus();
  component.getDefaultFoundation().adapter_.focusItemAtIndex(1);
  assert.isTrue(document.activeElement === items[1]);
  document.body.removeChild(root);
});

test('#adapter.setTabIndexForListItemChildren sets the child button/a elements of index', () => {
  const {root, component} = setupTest();
  document.body.appendChild(root);
  const listItemIndex = 1;
  const listItem = root.querySelectorAll('.mdclist-item')[listItemIndex];
  component.getDefaultFoundation().adapter_.setTabIndexForListItemChildren(listItemIndex, 0);
  assert.equal(1, root.querySelectorAll('button[tabIndex="0"]').length);
  assert.equal(listItem, root.querySelectorAll('button[tabIndex="0"]').parentElement);
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
