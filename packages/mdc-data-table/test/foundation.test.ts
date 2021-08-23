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

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {attributes, cssClasses, SortValue, strings} from '../constants';
import {MDCDataTableFoundation} from '../foundation';

describe('MDCDataTableFoundation', () => {
  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCDataTableFoundation, [
      'addClass',
      'addClassAtRowIndex',
      'getAttributeByHeaderCellIndex',
      'getHeaderCellCount',
      'getHeaderCellElements',
      'getRowCount',
      'getRowElements',
      'getRowIdAtIndex',
      'getRowIndexByChildElement',
      'getSelectedRowCount',
      'getTableContainerHeight',
      'getTableHeaderHeight',
      'isCheckboxAtRowIndexChecked',
      'isHeaderRowCheckboxChecked',
      'isRowsSelectable',
      'notifyRowClick',
      'notifyRowSelectionChanged',
      'notifySelectedAll',
      'notifySortAction',
      'notifyUnselectedAll',
      'registerHeaderRowCheckbox',
      'registerRowCheckboxes',
      'removeClass',
      'removeClassAtRowIndex',
      'removeClassNameByHeaderCellIndex',
      'setAttributeAtRowIndex',
      'setAttributeByHeaderCellIndex',
      'setClassNameByHeaderCellIndex',
      'setHeaderRowCheckboxChecked',
      'setHeaderRowCheckboxIndeterminate',
      'setProgressIndicatorStyles',
      'setRowCheckboxCheckedAtIndex',
      'setSortStatusLabelByHeaderCellIndex',
    ]);
  });

  function setupTest() {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCDataTableFoundation);
    return {foundation, mockAdapter};
  }

  it('#layout should register header row checkbox only if table is selectable',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isRowsSelectable.and.returnValue(true);
       foundation.layout();
       expect(mockAdapter.registerHeaderRowCheckbox).toHaveBeenCalledTimes(1);
       expect(mockAdapter.registerRowCheckboxes).toHaveBeenCalledTimes(1);

       mockAdapter.registerHeaderRowCheckbox.calls.reset();
       mockAdapter.registerRowCheckboxes.calls.reset();

       mockAdapter.isRowsSelectable.and.returnValue(false);
       foundation.layout();
       expect(mockAdapter.registerHeaderRowCheckbox).not.toHaveBeenCalled();
       expect(mockAdapter.registerRowCheckboxes).not.toHaveBeenCalled();
     });

  it('#layout should set header row checkbox checked when all row checkboxes are checked',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isRowsSelectable.and.returnValue(true);
       mockAdapter.getSelectedRowCount.and.returnValue(5);
       mockAdapter.getRowCount.and.returnValue(5);

       foundation.layout();
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.setHeaderRowCheckboxChecked)
           .toHaveBeenCalledWith(true);
       expect(mockAdapter.setHeaderRowCheckboxChecked).toHaveBeenCalledTimes(1);
     });

  it('#layout should set header row checkbox unchecked when all row checkboxes are unchecked',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isRowsSelectable.and.returnValue(true);
       mockAdapter.getSelectedRowCount.and.returnValue(0);
       mockAdapter.getRowCount.and.returnValue(5);

       foundation.layout();
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.setHeaderRowCheckboxChecked)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxChecked).toHaveBeenCalledTimes(1);
     });

  it('#layout should set header row checkbox unchecked when there are no rows',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isRowsSelectable.and.returnValue(true);
       mockAdapter.getSelectedRowCount.and.returnValue(0);
       mockAdapter.getRowCount.and.returnValue(0);

       foundation.layout();
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.setHeaderRowCheckboxChecked)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxChecked).toHaveBeenCalledTimes(1);
     });

  it('#layout should set header row checkbox indeterminate when some of the checkboxes are checked',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isRowsSelectable.and.returnValue(true);
       mockAdapter.getSelectedRowCount.and.returnValue(2);
       mockAdapter.getRowCount.and.returnValue(5);

       foundation.layout();
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledWith(true);
       expect(mockAdapter.setHeaderRowCheckboxIndeterminate)
           .toHaveBeenCalledTimes(1);
       expect(mockAdapter.setHeaderRowCheckboxChecked)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxChecked).toHaveBeenCalledTimes(1);
     });

  it('#getHeaderCells should return array of header cell elements', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.getHeaderCells();
    expect(mockAdapter.getHeaderCellElements).toHaveBeenCalledTimes(1);
  });

  it('#getRows should return array of row elements', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.getRows();
    expect(mockAdapter.getRowElements).toHaveBeenCalledTimes(1);
  });

  it('#getRowIds should return array of row ids', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getRowCount.and.returnValue(5);
    foundation.getRowIds();
    expect(mockAdapter.getRowIdAtIndex).toHaveBeenCalledTimes(5);
  });

  it('#setSelectedRowIds Sets the row checkbox checked by id and sets selected class name to row',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getRowCount.and.returnValue(5);
       mockAdapter.getRowIdAtIndex.withArgs(0).and.returnValue('testId-0');
       mockAdapter.getRowIdAtIndex.withArgs(1).and.returnValue('testId-1');
       mockAdapter.getRowIdAtIndex.withArgs(2).and.returnValue(null);
       mockAdapter.getRowIdAtIndex.withArgs(3).and.returnValue('testId-3');
       mockAdapter.getRowIdAtIndex.withArgs(4).and.returnValue('testId-4');

       foundation.setSelectedRowIds(['testId-1', 'testId-3']);

       const anyIndexMatch = (indexList: number[]) => {
         return {
           asymmetricMatch: (compareTo: number) =>
               indexList.indexOf(compareTo) >= 0,
           jasmineToString: () =>
               '<anyIndexMatch: [' + indexList.toString() + ']>',
         };
       };
       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledWith(anyIndexMatch([1, 3]), true);

       expect(mockAdapter.addClassAtRowIndex)
           .toHaveBeenCalledWith(
               anyIndexMatch([1, 3]), cssClasses.ROW_SELECTED);

       expect(mockAdapter.setAttributeAtRowIndex)
           .toHaveBeenCalledWith(
               anyIndexMatch([1, 3]), attributes.ARIA_SELECTED, 'true');

       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledWith(anyIndexMatch([0, 2, 4]), false);

       expect(mockAdapter.removeClassAtRowIndex)
           .toHaveBeenCalledWith(
               anyIndexMatch([0, 2, 4]), cssClasses.ROW_SELECTED);

       expect(mockAdapter.setAttributeAtRowIndex)
           .toHaveBeenCalledWith(
               anyIndexMatch([0, 2, 4]), attributes.ARIA_SELECTED, 'false');
     });

  it('#setSelectedRowIds when empty unchecks all row checkboxes and unchecks header row checkbox',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getRowCount.and.returnValue(5);
       mockAdapter.getSelectedRowCount.and.returnValue(0);

       foundation.setSelectedRowIds([]);

       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledWith(jasmine.any(Number), false);
       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledTimes(5);
       expect(mockAdapter.setHeaderRowCheckboxChecked)
           .toHaveBeenCalledWith(false);
       expect(mockAdapter.setHeaderRowCheckboxChecked).toHaveBeenCalledTimes(1);
     });

  it('#getSelectedRowIds Returns selected row ids', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.getRowCount.and.returnValue(3);
    mockAdapter.isCheckboxAtRowIndexChecked.withArgs(jasmine.any(Number))
        .and.returnValue(true);
    mockAdapter.getRowIdAtIndex.withArgs(0).and.returnValue('testRowId0');
    mockAdapter.getRowIdAtIndex.withArgs(1).and.returnValue('testRowId1');
    mockAdapter.getRowIdAtIndex.withArgs(2).and.returnValue('testRowId2');

    expect(foundation.getSelectedRowIds()).toEqual([
      'testRowId0', 'testRowId1', 'testRowId2'
    ]);
  });

  it('#handleHeaderRowCheckboxChange checks all row checkboxes when it is checked and notifies',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isHeaderRowCheckboxChecked.and.returnValue(true);
       mockAdapter.getRowCount.and.returnValue(5);

       foundation.handleHeaderRowCheckboxChange();

       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledWith(jasmine.any(Number), true);
       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledTimes(5);
       expect(mockAdapter.notifySelectedAll).toHaveBeenCalledTimes(1);
     });

  it('#handleHeaderRowCheckboxChange unchecks all row checkboxes when it is unchecked and notifies',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.isHeaderRowCheckboxChecked.and.returnValue(false);
       mockAdapter.getRowCount.and.returnValue(5);

       foundation.handleHeaderRowCheckboxChange();

       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledWith(jasmine.any(Number), false);
       expect(mockAdapter.setRowCheckboxCheckedAtIndex)
           .toHaveBeenCalledTimes(5);
       expect(mockAdapter.notifyUnselectedAll).toHaveBeenCalledTimes(1);
     });

  it('Should trigger an event when clicked on data row', () => {
    const {foundation, mockAdapter} = setupTest();

    const mockDataRowEl = document.createElement('tr');
    foundation.handleRowClick({rowId: '1231', row: mockDataRowEl});
    expect(mockAdapter.notifyRowClick)
        .toHaveBeenCalledWith({rowId: '1231', row: mockDataRowEl});
  });

  it('#handleRowCheckboxChange does not do anything when target row is not found',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getRowIndexByChildElement.withArgs(jasmine.anything())
           .and.returnValue(-1);
       foundation.handleRowCheckboxChange({} as Event);

       expect(mockAdapter.notifyRowSelectionChanged).not.toHaveBeenCalledWith();
     });

  it('#handleRowCheckboxChange does not do anything when target element (native checkbox) is not found',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getRowIndexByChildElement
           .withArgs(jasmine.any(HTMLInputElement))
           .and.returnValue(2);

       foundation.handleRowCheckboxChange({} as Event);

       expect(mockAdapter.notifyRowSelectionChanged).not.toHaveBeenCalledWith();
     });

  it('#handleRowCheckboxChange selects row when row checkbox is checked and notifies',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getRowIndexByChildElement.withArgs(jasmine.anything())
           .and.returnValue(2);
       mockAdapter.isCheckboxAtRowIndexChecked.withArgs(2).and.returnValue(
           true);
       mockAdapter.getRowIdAtIndex.withArgs(2).and.returnValue('testRowId-u2');

       foundation.handleRowCheckboxChange(
           {target: {checked: true}} as unknown as Event);

       expect(mockAdapter.addClassAtRowIndex)
           .toHaveBeenCalledWith(2, cssClasses.ROW_SELECTED);
       expect(mockAdapter.setAttributeAtRowIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_SELECTED, 'true');

       expect(mockAdapter.notifyRowSelectionChanged).toHaveBeenCalledWith({
         rowId: 'testRowId-u2',
         rowIndex: 2,
         selected: true,
       });
     });

  it('#handleRowCheckboxChange unselects row when row checkbox is unchecked and notifies',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.getRowIndexByChildElement.withArgs(jasmine.anything())
           .and.returnValue(2);
       mockAdapter.isCheckboxAtRowIndexChecked.withArgs(2).and.returnValue(
           false);
       mockAdapter.getRowIdAtIndex.withArgs(2).and.returnValue('testRowId-u2');

       foundation.handleRowCheckboxChange(
           {target: {checked: false}} as unknown as Event);

       expect(mockAdapter.removeClassAtRowIndex)
           .toHaveBeenCalledWith(2, cssClasses.ROW_SELECTED);
       expect(mockAdapter.setAttributeAtRowIndex)
           .toHaveBeenCalledWith(2, strings.ARIA_SELECTED, 'false');

       expect(mockAdapter.notifyRowSelectionChanged).toHaveBeenCalledWith({
         rowId: 'testRowId-u2',
         rowIndex: 2,
         selected: false,
       });
     });

  describe('Column sorting', () => {
    it('#handleSortAction Sets header cell in ascending sorted state by default on sort action',
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttributeByHeaderCellIndex
             .withArgs(2, attributes.ARIA_SORT)
             .and.returnValue(null);
         mockAdapter.getHeaderCellCount.and.returnValue(5);

         const mockHeaderCell = document.createElement('div');
         foundation.handleSortAction({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
         });

         expect(mockAdapter.setClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(2, cssClasses.HEADER_CELL_SORTED);
         expect(mockAdapter.setAttributeByHeaderCellIndex)
             .toHaveBeenCalledWith(
                 2, attributes.ARIA_SORT, SortValue.ASCENDING);
         expect(mockAdapter.notifySortAction).toHaveBeenCalledWith({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
           sortValue: SortValue.ASCENDING,
         });
       });

    it('#handleSortAction Sets header cell in descending sorted state when currently sorted in ascending order on sort action',
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttributeByHeaderCellIndex
             .withArgs(2, attributes.ARIA_SORT)
             .and.returnValue(SortValue.ASCENDING);
         mockAdapter.getHeaderCellCount.and.returnValue(5);

         const mockHeaderCell = document.createElement('div');
         foundation.handleSortAction({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
         });

         expect(mockAdapter.setClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(2, cssClasses.HEADER_CELL_SORTED);
         expect(mockAdapter.setAttributeByHeaderCellIndex)
             .toHaveBeenCalledWith(
                 2, attributes.ARIA_SORT, SortValue.DESCENDING);
         expect(mockAdapter.setClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(2, cssClasses.HEADER_CELL_SORTED_DESCENDING);
         expect(mockAdapter.notifySortAction).toHaveBeenCalledWith({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
           sortValue: SortValue.DESCENDING,
         });
       });

    it('#handleSortAction Sets header cell in ascending sorted state when currently sorted in descending order on sort action',
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttributeByHeaderCellIndex
             .withArgs(2, attributes.ARIA_SORT)
             .and.returnValue(SortValue.DESCENDING);
         mockAdapter.getHeaderCellCount.and.returnValue(5);

         const mockHeaderCell = document.createElement('div');
         foundation.handleSortAction({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
         });

         expect(mockAdapter.setClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(2, cssClasses.HEADER_CELL_SORTED);
         expect(mockAdapter.setAttributeByHeaderCellIndex)
             .toHaveBeenCalledWith(
                 2, attributes.ARIA_SORT, SortValue.ASCENDING);
         expect(mockAdapter.removeClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(2, cssClasses.HEADER_CELL_SORTED_DESCENDING);
         expect(mockAdapter.notifySortAction).toHaveBeenCalledWith({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
           sortValue: SortValue.ASCENDING,
         });
       });

    it('#handleSortAction Resets sort states of other header cells when sorted on target header cell',
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttributeByHeaderCellIndex
             .withArgs(2, attributes.ARIA_SORT)
             .and.returnValue(null);
         mockAdapter.getHeaderCellCount.and.returnValue(5);

         const mockHeaderCell = document.createElement('div');
         foundation.handleSortAction({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
         });

         expect(mockAdapter.removeClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(
                 jasmine.any(Number), cssClasses.HEADER_CELL_SORTED);
         expect(mockAdapter.removeClassNameByHeaderCellIndex)
             .toHaveBeenCalledWith(
                 jasmine.any(Number), cssClasses.HEADER_CELL_SORTED_DESCENDING);
         expect(mockAdapter.setAttributeByHeaderCellIndex)
             .toHaveBeenCalledWith(
                 jasmine.any(Number), attributes.ARIA_SORT, SortValue.NONE);
       });

    it('#handleSortAction Activating sort sets appropriate sort status label that is visually hidden',
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttributeByHeaderCellIndex
             .withArgs(2, attributes.ARIA_SORT)
             .and.returnValue(null);
         mockAdapter.getHeaderCellCount.and.returnValue(5);

         const mockHeaderCell = document.createElement('div');
         foundation.handleSortAction({
           columnId: 'testColId-u2',
           columnIndex: 2,
           headerCell: mockHeaderCell,
         });

         expect(mockAdapter.setSortStatusLabelByHeaderCellIndex)
             .toHaveBeenCalledWith(2, SortValue.ASCENDING);

         // Should reset sort label on other columns.
         expect(mockAdapter.setSortStatusLabelByHeaderCellIndex)
             .toHaveBeenCalledWith(jasmine.any(Number), SortValue.NONE);
       });
  });

  it('#showProgress Adds class name that makes the progress indicator visibile',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getTableHeaderHeight.and.returnValue(20);
       mockAdapter.getTableContainerHeight.and.returnValue(100);

       foundation.showProgress();

       expect(mockAdapter.setProgressIndicatorStyles)
           .toHaveBeenCalledWith({height: '80px', top: '20px'});
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.IN_PROGRESS);
     });

  it('#hideProgress Removes class name that makes progress indicator hidden',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.hideProgress();

       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.IN_PROGRESS);
     });
});
