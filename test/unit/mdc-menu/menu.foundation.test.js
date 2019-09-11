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
import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {install as installClock} from '../helpers/clock';
import {MDCMenuFoundation} from '../../../packages/mdc-menu/foundation';
import {MDCListFoundation} from '../../../packages/mdc-list/foundation';
import {cssClasses, DefaultFocusState, strings} from '../../../packages/mdc-menu/constants';
import {cssClasses as listCssClasses} from '../../../packages/mdc-list/constants';
import {numbers as menuNumbers} from '../../../packages/mdc-menu/constants';
import {numbers} from '../../../packages/mdc-menu-surface/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCMenuFoundation);
  const clock = installClock();
  return {foundation, mockAdapter, clock};
}

const listClasses = MDCListFoundation.cssClasses;

suite('MDCMenuFoundation');

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCMenuFoundation, [
    'addClassToElementAtIndex', 'removeClassFromElementAtIndex', 'addAttributeToElementAtIndex',
    'removeAttributeFromElementAtIndex', 'elementContainsClass', 'closeSurface', 'getElementIndex',
    'getSelectedSiblingOfItemAtIndex', 'isSelectableItemAtIndex', 'notifySelected',
    'getMenuItemCount', 'focusItemAtIndex', 'focusListRoot',
  ]);
});

test('exports strings', () => {
  assert.deepEqual(MDCMenuFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCMenuFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCMenuFoundation.numbers, menuNumbers);
});

test('destroy does not throw error', () => {
  const {foundation} = setupTest();
  assert.doesNotThrow(() => foundation.destroy());
});

test('destroy does not throw error if destroyed immediately after keydown', () => {
  const {foundation, mockAdapter} = setupTest();
  const event = {key: 'Space', target: 'My Element', preventDefault: td.func('preventDefault')};
  td.when(mockAdapter.elementContainsClass(event.target, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(event.target)).thenReturn(0);
  foundation.handleKeydown(event);

  assert.doesNotThrow(() => foundation.destroy());
});

test('destroy closes surface', () => {
  const {foundation, mockAdapter} = setupTest();

  assert.doesNotThrow(() => foundation.destroy());
  td.verify(mockAdapter.closeSurface(), {times: 1});
});

test('handleKeydown does nothing if key is not space, enter, or tab', () => {
  const {foundation, mockAdapter} = setupTest();
  const event = {key: 'N'};

  foundation.handleKeydown(event);
  td.verify(mockAdapter.closeSurface(), {times: 0});
  td.verify(mockAdapter.elementContainsClass(td.matchers.anything()), {times: 0});
});

test('handleKeydown tab key causes the menu to close', () => {
  const {foundation, mockAdapter} = setupTest();
  const event = {key: 'Tab'};

  foundation.handleKeydown(event);
  td.verify(mockAdapter.closeSurface(/** skipRestoreFocus */ true), {times: 1});
  td.verify(mockAdapter.elementContainsClass(td.matchers.anything()), {times: 0});
});

test('handleItemAction item action closes the menu', () => {
  const {foundation, mockAdapter} = setupTest();
  const itemEl = document.createElement('li');

  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);

  foundation.handleItemAction(itemEl);
  td.verify(mockAdapter.closeSurface(), {times: 1});
});

test('handleItemAction item action emits selected event', () => {
  const {foundation, mockAdapter} = setupTest();
  const itemEl = document.createElement('li');

  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);

  foundation.handleItemAction(itemEl);
  td.verify(mockAdapter.notifySelected({index: 0}), {times: 1});
});

test('handleKeydown space/enter key inside an input does not prevent default on the event', () => {
  const {foundation, mockAdapter} = setupTest();
  const event = {key: 'Space', target: {tagName: 'input'}, preventDefault: td.func('preventDefault')};
  td.when(mockAdapter.elementContainsClass(event.target, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(event.target)).thenReturn(0);

  foundation.handleKeydown(event);
  event.key = 'Enter';
  foundation.handleKeydown(event);

  td.verify(event.preventDefault(), {times: 0});
});

test('handleItemAction item action event inside of a selection group ' +
  'with additional markup does not cause loop', () => {
  // This test will timeout of there is an endless loop in the selection group logic.
  const {foundation, mockAdapter, clock} = setupTest();
  const itemEl = document.createElement('li');
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.elementContainsClass(td.matchers.anything(), listClasses.ROOT)).thenReturn(false, true);
  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);
  td.when(mockAdapter.elementContainsClass(td.matchers.anything(), cssClasses.MENU_SELECTION_GROUP)).thenReturn(false);

  foundation.handleItemAction(itemEl);
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);

  td.verify(mockAdapter.closeSurface(), {times: 1});
});

test('handleItemAction item action event inside of a selection group with another element selected', () => {
  const {foundation, mockAdapter, clock} = setupTest();
  const itemEl = document.createElement('li');
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);
  td.when(mockAdapter.elementContainsClass(itemEl, cssClasses.MENU_SELECTION_GROUP)).thenReturn(true);
  td.when(mockAdapter.isSelectableItemAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.getSelectedSiblingOfItemAtIndex(0)).thenReturn(1);
  td.when(mockAdapter.getMenuItemCount()).thenReturn(5);

  foundation.handleItemAction(itemEl);
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);

  td.verify(mockAdapter.removeClassFromElementAtIndex(1, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
  td.verify(mockAdapter.addClassToElementAtIndex(0, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
});

test('handleItemAction item action event inside of a selection group with no element selected', () => {
  const {foundation, mockAdapter, clock} = setupTest();
  const itemEl = document.createElement('li');
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);
  td.when(mockAdapter.elementContainsClass(itemEl, cssClasses.MENU_SELECTION_GROUP)).thenReturn(true);
  td.when(mockAdapter.isSelectableItemAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.getSelectedSiblingOfItemAtIndex(0)).thenReturn(-1);
  td.when(mockAdapter.getMenuItemCount()).thenReturn(5);

  foundation.handleItemAction(itemEl);
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);

  td.verify(mockAdapter.removeClassFromElementAtIndex(td.matchers.isA(Number), cssClasses.MENU_SELECTED_LIST_ITEM),
    {times: 0});
  td.verify(mockAdapter.addClassToElementAtIndex(0, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
});

test('handleItemAction item action event inside of a child element of a list item in a selection group with no ' +
  'element selected', () => {
  const {foundation, mockAdapter, clock} = setupTest();
  const itemEl = document.createElement('li');
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);
  td.when(mockAdapter.elementContainsClass(itemEl, cssClasses.MENU_SELECTION_GROUP)).thenReturn(false, true);
  td.when(mockAdapter.isSelectableItemAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.getMenuItemCount()).thenReturn(5);

  foundation.handleItemAction(itemEl);
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);

  td.verify(mockAdapter.removeClassFromElementAtIndex(td.matchers.isA(Number), cssClasses.MENU_SELECTED_LIST_ITEM),
    {times: 0});
  td.verify(mockAdapter.addClassToElementAtIndex(0, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
});

test('handleItemAction item action event inside of a child element of a selection group (but not a list item) with ' +
  'no element selected', () => {
  const {foundation, mockAdapter, clock} = setupTest();
  const itemEl = document.createElement('li');
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);
  td.when(mockAdapter.elementContainsClass(itemEl, cssClasses.MENU_SELECTION_GROUP)).thenReturn(false);
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.ROOT)).thenReturn(false, true);
  td.when(mockAdapter.isSelectableItemAtIndex(0)).thenReturn(false);
  td.when(mockAdapter.getMenuItemCount()).thenReturn(5);

  foundation.handleItemAction(itemEl);
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);

  td.verify(mockAdapter.removeClassFromElementAtIndex(td.matchers.isA(Number), cssClasses.MENU_SELECTED_LIST_ITEM),
    {times: 0});
  td.verify(mockAdapter.addClassToElementAtIndex(td.matchers.isA(Number), cssClasses.MENU_SELECTED_LIST_ITEM),
    {times: 0});
});

test('handleMenuSurfaceOpened menu focuses the list root element by default on menu surface opened', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleMenuSurfaceOpened();
  td.verify(mockAdapter.focusListRoot(), {times: 1});
});

test('handleMenuSurfaceOpened menu focuses the first menu item when DefaultFocusState is set to FIRST_ITEM on menu ' +
    'surface opened', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setDefaultFocusState(DefaultFocusState.FIRST_ITEM);
  foundation.handleMenuSurfaceOpened();
  td.verify(mockAdapter.focusItemAtIndex(0), {times: 1});
});

test('handleMenuSurfaceOpened focuses the list root element when DefaultFocusState is set to LIST_ROOT', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setDefaultFocusState(DefaultFocusState.LIST_ROOT);
  foundation.handleMenuSurfaceOpened();
  td.verify(mockAdapter.focusListRoot(), {times: 1});
});

test('handleMenuSurfaceOpened focuses the last item when DefaultFocusState is set to LAST_ITEM', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getMenuItemCount()).thenReturn(5);
  foundation.setDefaultFocusState(DefaultFocusState.LAST_ITEM);
  foundation.handleMenuSurfaceOpened();
  td.verify(mockAdapter.focusItemAtIndex(4), {times: 1});
});

test('handleMenuSurfaceOpened does not focus anything when DefaultFocusState is set to NONE', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.setDefaultFocusState(DefaultFocusState.NONE);
  foundation.handleMenuSurfaceOpened();
  td.verify(mockAdapter.focusItemAtIndex(td.matchers.anything()), {times: 0});
  td.verify(mockAdapter.focusListRoot(), {times: 0});
});

test('setSelectedIndex calls addClass and addAttribute only', () => {
  const {foundation, mockAdapter} = setupTest();
  const listItemEl = document.createElement('div');
  td.when(mockAdapter.isSelectableItemAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.elementContainsClass(listItemEl, cssClasses.MENU_SELECTION_GROUP)).thenReturn(true);
  td.when(mockAdapter.getSelectedSiblingOfItemAtIndex(0)).thenReturn(-1);
  td.when(mockAdapter.getMenuItemCount()).thenReturn(2);

  foundation.setSelectedIndex(0);
  td.verify(mockAdapter.removeClassFromElementAtIndex(
    td.matchers.isA(Number), cssClasses.MENU_SELECTED_LIST_ITEM), {times: 0});
  td.verify(mockAdapter.removeAttributeFromElementAtIndex(td.matchers.isA(Number),
    strings.ARIA_CHECKED_ATTR), {times: 0});
  td.verify(mockAdapter.addClassToElementAtIndex(0, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
  td.verify(mockAdapter.addAttributeToElementAtIndex(0, strings.ARIA_CHECKED_ATTR, 'true'), {times: 1});
});

test('setSelectedIndex remove class and attribute, and adds class and attribute to newly selected item', () => {
  const {foundation, mockAdapter} = setupTest();
  const listItemEl = document.createElement('div');
  td.when(mockAdapter.isSelectableItemAtIndex(0)).thenReturn(true);
  td.when(mockAdapter.elementContainsClass(listItemEl, cssClasses.MENU_SELECTION_GROUP)).thenReturn(true);
  td.when(mockAdapter.getMenuItemCount()).thenReturn(2);
  td.when(mockAdapter.getSelectedSiblingOfItemAtIndex(0)).thenReturn(1);

  foundation.setSelectedIndex(0);
  td.verify(mockAdapter.removeClassFromElementAtIndex(1, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
  td.verify(
    mockAdapter.removeAttributeFromElementAtIndex(1, strings.ARIA_CHECKED_ATTR), {times: 1});
  td.verify(mockAdapter.addClassToElementAtIndex(0, cssClasses.MENU_SELECTED_LIST_ITEM), {times: 1});
  td.verify(mockAdapter.addAttributeToElementAtIndex(0, strings.ARIA_CHECKED_ATTR, 'true'), {times: 1});
});

test('setSelectedIndex throws error if index is not in range', () => {
  const {foundation} = setupTest();
  try {
    foundation.setSelectedIndex(5);
  } catch (e) {
    assert.equal(e.message, 'MDCMenuFoundation: No list item at specified index.');
  }
});

test('setEnabled calls addClass and addAttribute', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getMenuItemCount()).thenReturn(2);

  foundation.setEnabled(0, false);
  td.verify(mockAdapter.addClassToElementAtIndex(0, listCssClasses.LIST_ITEM_DISABLED_CLASS), {times: 1});
  td.verify(mockAdapter.addAttributeToElementAtIndex(0, strings.ARIA_DISABLED_ATTR, 'true'), {times: 1});
});

test('setEnabled calls removeClass and removeAttribute', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getMenuItemCount()).thenReturn(2);

  foundation.setEnabled(0, true);
  td.verify(mockAdapter.removeClassFromElementAtIndex(0, listCssClasses.LIST_ITEM_DISABLED_CLASS), {times: 1});
  td.verify(mockAdapter.addAttributeToElementAtIndex(0, strings.ARIA_DISABLED_ATTR, 'false'), {times: 1});
});

// Item Action

test('Item action event causes the menu to close', () => {
  const {foundation, mockAdapter} = setupTest();
  const itemEl = document.createElement('li');
  td.when(mockAdapter.elementContainsClass(itemEl, listClasses.LIST_ITEM_CLASS)).thenReturn(true);
  td.when(mockAdapter.getElementIndex(itemEl)).thenReturn(0);

  foundation.handleItemAction(itemEl);

  td.verify(mockAdapter.closeSurface(), {times: 1});
});
