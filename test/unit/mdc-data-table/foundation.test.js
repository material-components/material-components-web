/**
 * @license
 * Copyright 2019 Google Inc.
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

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import {cssClasses, strings} from '../../../packages/mdc-data-table/constants';
import {MDCDataTableFoundation} from '../../../packages/mdc-data-table/foundation';

suite('MDCDataTableFoundation');

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDataTableFoundation, [
    'isRowsSelectable',
    'registerHeaderRowCheckbox',
    'registerRowCheckboxes',
    'getRowElements',
    'isCheckboxAtRowIndexChecked',
    'isHeaderRowCheckboxChecked',
    'getRowCount',
    'getSelectedRowCount',
    'addClassAtRowIndex',
    'removeClassAtRowIndex',
    'setAttributeAtRowIndex',
    'getRowIndexByChildElement',
    'setHeaderRowCheckboxIndeterminate',
    'setHeaderRowCheckboxChecked',
    'getRowIdAtIndex',
    'setRowCheckboxCheckedAtIndex',
    'notifyRowSelectionChanged',
    'notifySelectedAll',
    'notifyUnselectedAll',
  ]);
});

/**
 * @return {{mockAdapter: !MDCDataTableAdapter, foundation: !MDCDataTableFoundation}}
 */
function setupTest() {
  const adapterFoundationPair = /** @type {{mockAdapter: !MDCDataTableAdapter, foundation: !MDCDataTableFoundation}} */
    (setupFoundationTest(MDCDataTableFoundation));
  adapterFoundationPair.foundation.init();
  return adapterFoundationPair;
}

test('#layout should register header row checkbox only if table is selectable', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.isRowsSelectable()).thenReturn(true);
  foundation.layout();
  td.verify(mockAdapter.registerHeaderRowCheckbox(), {times: 1});
  td.verify(mockAdapter.registerRowCheckboxes(), {times: 1});

  td.reset();

  td.when(mockAdapter.isRowsSelectable()).thenReturn(false);
  foundation.layout();
  td.verify(mockAdapter.registerHeaderRowCheckbox(), {times: 0});
  td.verify(mockAdapter.registerRowCheckboxes(), {times: 0});
});

test('#layout should set header row checkbox checked when all row checkboxes are checked', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.isRowsSelectable()).thenReturn(true);
  td.when(mockAdapter.getSelectedRowCount()).thenReturn(5);
  td.when(mockAdapter.getRowCount()).thenReturn(5);

  foundation.layout();
  td.verify(mockAdapter.setHeaderRowCheckboxIndeterminate(false), {times: 1});
  td.verify(mockAdapter.setHeaderRowCheckboxChecked(true), {times: 1});
});

test('#layout should set header row checkbox unchecked when all row checkboxes are unchecked', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.isRowsSelectable()).thenReturn(true);
  td.when(mockAdapter.getSelectedRowCount()).thenReturn(0);
  td.when(mockAdapter.getRowCount()).thenReturn(5);

  foundation.layout();
  td.verify(mockAdapter.setHeaderRowCheckboxIndeterminate(false), {times: 1});
  td.verify(mockAdapter.setHeaderRowCheckboxChecked(false), {times: 1});
});

test('#layout should set header row checkbox indeterminate when some of the checkboxes are checked', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.isRowsSelectable()).thenReturn(true);
  td.when(mockAdapter.getSelectedRowCount()).thenReturn(2);
  td.when(mockAdapter.getRowCount()).thenReturn(5);

  foundation.layout();
  td.verify(mockAdapter.setHeaderRowCheckboxIndeterminate(true), {times: 1});
  td.verify(mockAdapter.setHeaderRowCheckboxChecked(false), {times: 1});
});

test('#getRows should return array of row elements', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.getRows();
  td.verify(mockAdapter.getRowElements(), {times: 1});
});

test('#setSelectedRowIds Sets the row checkbox checked by id and sets selected class name to row', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowCount()).thenReturn(5);
  td.when(mockAdapter.getRowIdAtIndex(0)).thenReturn('testId-0');
  td.when(mockAdapter.getRowIdAtIndex(1)).thenReturn('testId-1');
  td.when(mockAdapter.getRowIdAtIndex(2)).thenReturn(null);
  td.when(mockAdapter.getRowIdAtIndex(3)).thenReturn('testId-3');
  td.when(mockAdapter.getRowIdAtIndex(4)).thenReturn('testId-4');

  foundation.setSelectedRowIds(['testId-1', 'testId-3']);

  const selectedIndexes = td.matchers.argThat((i) => [1, 3].indexOf(i) >= 0);
  td.verify(mockAdapter.setRowCheckboxCheckedAtIndex(selectedIndexes, true), {times: 2});
  td.verify(mockAdapter.addClassAtRowIndex(selectedIndexes, cssClasses.ROW_SELECTED), {times: 2});
  td.verify(mockAdapter.setAttributeAtRowIndex(selectedIndexes, strings.ARIA_SELECTED, 'true'), {times: 2});

  // Unselects remaining rows including row without row Id (at row index: 2).
  const unselectedIndexes = td.matchers.argThat((i) => [0, 2, 4].indexOf(i) >= 0);
  td.verify(mockAdapter.setRowCheckboxCheckedAtIndex(unselectedIndexes, false), {times: 3});
  td.verify(mockAdapter.removeClassAtRowIndex(unselectedIndexes, cssClasses.ROW_SELECTED), {times: 3});
  td.verify(mockAdapter.setAttributeAtRowIndex(unselectedIndexes, strings.ARIA_SELECTED, 'false'), {times: 3});
});

test('#setSelectedRowIds when empty unchecks all row checkboxes and unchecks header row checkbox', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowCount()).thenReturn(5);
  td.when(mockAdapter.getSelectedRowCount()).thenReturn(0);

  foundation.setSelectedRowIds([]);

  td.verify(mockAdapter.setRowCheckboxCheckedAtIndex(td.matchers.isA(Number), false), {times: 5});
  td.verify(mockAdapter.setHeaderRowCheckboxChecked(false), {times: 1});
});

test('#getSelectedRowIds Returns selected row ids', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowCount()).thenReturn(3);
  td.when(mockAdapter.isCheckboxAtRowIndexChecked(td.matchers.isA(Number))).thenReturn(true);
  td.when(mockAdapter.getRowIdAtIndex(0)).thenReturn('testRowId0');
  td.when(mockAdapter.getRowIdAtIndex(1)).thenReturn('testRowId1');
  td.when(mockAdapter.getRowIdAtIndex(2)).thenReturn('testRowId2');

  assert.deepEqual(foundation.getSelectedRowIds(), ['testRowId0', 'testRowId1', 'testRowId2']);
});

test('#handleHeaderRowCheckboxChange checks all row checkboxes when it is checked and notifies', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.isHeaderRowCheckboxChecked()).thenReturn(true);
  td.when(mockAdapter.getRowCount()).thenReturn(5);

  foundation.handleHeaderRowCheckboxChange();

  td.verify(mockAdapter.setRowCheckboxCheckedAtIndex(td.matchers.isA(Number), true), {times: 5});
  td.verify(mockAdapter.notifySelectedAll(), {times: 1});
});

test('#handleHeaderRowCheckboxChange unchecks all row checkboxes when it is unchecked and notifies', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.isHeaderRowCheckboxChecked()).thenReturn(false);
  td.when(mockAdapter.getRowCount()).thenReturn(5);

  foundation.handleHeaderRowCheckboxChange();

  td.verify(mockAdapter.setRowCheckboxCheckedAtIndex(td.matchers.isA(Number), false), {times: 5});
  td.verify(mockAdapter.notifyUnselectedAll(), {times: 1});
});

test('#handleRowCheckboxChange does not do anything when target row is not found', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowIndexByChildElement(td.matchers.anything())).thenReturn(-1);

  foundation.handleRowCheckboxChange({});

  td.verify(mockAdapter.notifyRowSelectionChanged(), {times: 0});
});

test('#handleRowCheckboxChange does not do anything when target element (native checkbox) is not found', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowIndexByChildElement(td.matchers.isA(HTMLInputElement))).thenReturn(2);

  foundation.handleRowCheckboxChange({});

  td.verify(mockAdapter.notifyRowSelectionChanged(), {times: 0});
});

test('#handleRowCheckboxChange selects row when row checkbox is checked and notifies', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowIndexByChildElement(td.matchers.anything())).thenReturn(2);
  td.when(mockAdapter.isCheckboxAtRowIndexChecked(2)).thenReturn(true);
  td.when(mockAdapter.getRowIdAtIndex(2)).thenReturn('testRowId-u2');

  foundation.handleRowCheckboxChange({target: {checked: true}});

  td.verify(mockAdapter.notifyRowSelectionChanged(), {times: 0});
  td.verify(mockAdapter.addClassAtRowIndex(2, cssClasses.ROW_SELECTED), {times: 1});
  td.verify(mockAdapter.setAttributeAtRowIndex(2, strings.ARIA_SELECTED, 'true'), {times: 1});

  td.verify(mockAdapter.notifyRowSelectionChanged({
    rowId: 'testRowId-u2',
    rowIndex: 2,
    selected: true,
  }), {times: 1});
});

test('#handleRowCheckboxChange unselects row when row checkbox is unchecked and notifies', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.getRowIndexByChildElement(td.matchers.anything())).thenReturn(2);
  td.when(mockAdapter.isCheckboxAtRowIndexChecked(2)).thenReturn(false);
  td.when(mockAdapter.getRowIdAtIndex(2)).thenReturn('testRowId-u2');

  foundation.handleRowCheckboxChange({target: {checked: false}});

  td.verify(mockAdapter.notifyRowSelectionChanged(), {times: 0});
  td.verify(mockAdapter.removeClassAtRowIndex(2, cssClasses.ROW_SELECTED), {times: 1});
  td.verify(mockAdapter.setAttributeAtRowIndex(2, strings.ARIA_SELECTED, 'false'), {times: 1});

  td.verify(mockAdapter.notifyRowSelectionChanged({
    rowId: 'testRowId-u2',
    rowIndex: 2,
    selected: false,
  }), {times: 1});
});
