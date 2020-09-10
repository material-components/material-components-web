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

import {MDCFoundation} from '@material/base/foundation';

import {MDCDataTableAdapter} from './adapter';
import {cssClasses, SortValue, strings} from './constants';
import {SortActionEventData} from './types';

/**
 * The Foundation of data table component containing pure business logic, any
 * logic requiring DOM manipulation are delegated to adapter methods.
 */
export class MDCDataTableFoundation extends MDCFoundation<MDCDataTableAdapter> {

  static get defaultAdapter(): MDCDataTableAdapter {
    return {
      addClass: () => undefined,
      addClassAtRowIndex: () => undefined,
      getAttributeByHeaderCellIndex: () => '',
      getHeaderCellCount: () => 0,
      getHeaderCellElements: () => [],
      getRowCount: () => 0,
      getRowElements: () => [],
      getRowIdAtIndex: () => '',
      getRowIndexByChildElement: () => 0,
      getSelectedRowCount: () => 0,
      getTableContainerHeight: () => 0,
      getTableHeaderHeight: () => 0,
      isCheckboxAtRowIndexChecked: () => false,
      isHeaderRowCheckboxChecked: () => false,
      isRowsSelectable: () => false,
      notifyRowSelectionChanged: () => undefined,
      notifySelectedAll: () => undefined,
      notifySortAction: () => undefined,
      notifyUnselectedAll: () => undefined,
      registerHeaderRowCheckbox: () => undefined,
      registerRowCheckboxes: () => undefined,
      removeClass: () => undefined,
      removeClassAtRowIndex: () => undefined,
      removeClassNameByHeaderCellIndex: () => undefined,
      setAttributeAtRowIndex: () => undefined,
      setAttributeByHeaderCellIndex: () => undefined,
      setClassNameByHeaderCellIndex: () => undefined,
      setHeaderRowCheckboxChecked: () => undefined,
      setHeaderRowCheckboxIndeterminate: () => undefined,
      setProgressIndicatorStyles: () => undefined,
      setRowCheckboxCheckedAtIndex: () => undefined,
      setSortStatusLabelByHeaderCellIndex: () => undefined,
    };
  }

  /**
   * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
   * Use this if registering checkbox is synchronous.
   */
  layout() {
    if (this.adapter.isRowsSelectable()) {
      this.adapter.registerHeaderRowCheckbox();
      this.adapter.registerRowCheckboxes();

      this.setHeaderRowCheckboxState();
    }
  }

  /**
   * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
   * Use this if registering checkbox is asynchronous.
   */
  async layoutAsync(): Promise<void> {
    if (this.adapter.isRowsSelectable()) {
      await this.adapter.registerHeaderRowCheckbox();
      await this.adapter.registerRowCheckboxes();

      this.setHeaderRowCheckboxState();
    }
  }

  /**
   * @return Returns array of row elements.
   */
  getRows(): Element[] {
    return this.adapter.getRowElements();
  }

  /**
   * @return Array of header cell elements.
   */
  getHeaderCells(): Element[] {
    return this.adapter.getHeaderCellElements();
  }

  /**
   * Sets selected row ids. Overwrites previously selected rows.
   * @param rowIds Array of row ids that needs to be selected.
   */
  setSelectedRowIds(rowIds: string[]) {
    for (let rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
      const rowId = this.adapter.getRowIdAtIndex(rowIndex);

      let isSelected = false;
      if (rowId && rowIds.indexOf(rowId) >= 0) {
        isSelected = true;
      }

      this.adapter.setRowCheckboxCheckedAtIndex(rowIndex, isSelected);
      this.selectRowAtIndex(rowIndex, isSelected);
    }

    this.setHeaderRowCheckboxState();
  }

  /**
   * @return Returns array of all row ids.
   */
  getRowIds(): Array<string|null> {
    const rowIds = [];
    for (let rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
      rowIds.push(this.adapter.getRowIdAtIndex(rowIndex));
    }

    return rowIds;
  }

  /**
   * @return Returns array of selected row ids.
   */
  getSelectedRowIds(): Array<string|null> {
    const selectedRowIds: Array<string|null> = [];
    for (let rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
      if (this.adapter.isCheckboxAtRowIndexChecked(rowIndex)) {
        selectedRowIds.push(this.adapter.getRowIdAtIndex(rowIndex));
      }
    }

    return selectedRowIds;
  }

  /**
   * Handles header row checkbox change event.
   */
  handleHeaderRowCheckboxChange() {
    const isHeaderChecked = this.adapter.isHeaderRowCheckboxChecked();

    for (let rowIndex = 0; rowIndex < this.adapter.getRowCount(); rowIndex++) {
      this.adapter.setRowCheckboxCheckedAtIndex(rowIndex, isHeaderChecked);
      this.selectRowAtIndex(rowIndex, isHeaderChecked);
    }

    if (isHeaderChecked) {
      this.adapter.notifySelectedAll();
    } else {
      this.adapter.notifyUnselectedAll();
    }
  }

  /**
   * Handles change event originated from row checkboxes.
   */
  handleRowCheckboxChange(event: Event) {
    const rowIndex = this.adapter.getRowIndexByChildElement(
        event.target as HTMLInputElement);

    if (rowIndex === -1) {
      return;
    }

    const selected = this.adapter.isCheckboxAtRowIndexChecked(rowIndex);

    this.selectRowAtIndex(rowIndex, selected);
    this.setHeaderRowCheckboxState();

    const rowId = this.adapter.getRowIdAtIndex(rowIndex);
    this.adapter.notifyRowSelectionChanged({rowId, rowIndex, selected});
  }

  /**
   * Handles sort action on sortable header cell.
   */
  handleSortAction(eventData: SortActionEventData) {
    const {columnId, columnIndex, headerCell} = eventData;

    // Reset sort attributes / classes on other header cells.
    for (let index = 0; index < this.adapter.getHeaderCellCount(); index++) {
      if (index === columnIndex) {
        continue;
      }

      this.adapter.removeClassNameByHeaderCellIndex(
          index, cssClasses.HEADER_CELL_SORTED);
      this.adapter.removeClassNameByHeaderCellIndex(
          index, cssClasses.HEADER_CELL_SORTED_DESCENDING);
      this.adapter.setAttributeByHeaderCellIndex(
          index, strings.ARIA_SORT, SortValue.NONE);
      this.adapter.setSortStatusLabelByHeaderCellIndex(index, SortValue.NONE);
    }

    // Set appropriate sort attributes / classes on target header cell.
    this.adapter.setClassNameByHeaderCellIndex(
        columnIndex, cssClasses.HEADER_CELL_SORTED);

    const currentSortValue = this.adapter.getAttributeByHeaderCellIndex(
        columnIndex, strings.ARIA_SORT);
    let sortValue = SortValue.NONE;

    // Set to descending if sorted on ascending order.
    if (currentSortValue === SortValue.ASCENDING) {
      this.adapter.setClassNameByHeaderCellIndex(
          columnIndex, cssClasses.HEADER_CELL_SORTED_DESCENDING);
      this.adapter.setAttributeByHeaderCellIndex(
          columnIndex, strings.ARIA_SORT, SortValue.DESCENDING);
      sortValue = SortValue.DESCENDING;
      // Set to ascending if sorted on descending order.
    } else if (currentSortValue === SortValue.DESCENDING) {
      this.adapter.removeClassNameByHeaderCellIndex(
          columnIndex, cssClasses.HEADER_CELL_SORTED_DESCENDING);
      this.adapter.setAttributeByHeaderCellIndex(
          columnIndex, strings.ARIA_SORT, SortValue.ASCENDING);
      sortValue = SortValue.ASCENDING;
    } else {
      // Set to ascending by default when not sorted.
      this.adapter.setAttributeByHeaderCellIndex(
          columnIndex, strings.ARIA_SORT, SortValue.ASCENDING);
      sortValue = SortValue.ASCENDING;
    }

    this.adapter.setSortStatusLabelByHeaderCellIndex(columnIndex, sortValue);

    this.adapter.notifySortAction({
      columnId,
      columnIndex,
      headerCell,
      sortValue,
    });
  }

  /**
   * Shows progress indicator blocking only the table body content when in
   * loading state.
   */
  showProgress() {
    const tableHeaderHeight = this.adapter.getTableHeaderHeight();
    // Calculate the height of table content (Not scroll content) excluding
    // header row height.
    const height = this.adapter.getTableContainerHeight() - tableHeaderHeight;
    const top = tableHeaderHeight;

    this.adapter.setProgressIndicatorStyles({
      height: `${height}px`,
      top: `${top}px`,
    });
    this.adapter.addClass(cssClasses.IN_PROGRESS);
  }

  /**
   * Hides progress indicator when data table is finished loading.
   */
  hideProgress() {
    this.adapter.removeClass(cssClasses.IN_PROGRESS);
  }

  /**
   * Updates header row checkbox state based on number of rows selected.
   */
  private setHeaderRowCheckboxState() {
    if (this.adapter.getSelectedRowCount() === 0) {
      this.adapter.setHeaderRowCheckboxChecked(false);
      this.adapter.setHeaderRowCheckboxIndeterminate(false);
    } else if (
        this.adapter.getSelectedRowCount() === this.adapter.getRowCount()) {
      this.adapter.setHeaderRowCheckboxChecked(true);
      this.adapter.setHeaderRowCheckboxIndeterminate(false);
    } else {
      this.adapter.setHeaderRowCheckboxIndeterminate(true);
      this.adapter.setHeaderRowCheckboxChecked(false);
    }
  }

  /**
   * Sets the attributes of row element based on selection state.
   */
  private selectRowAtIndex(rowIndex: number, selected: boolean) {
    if (selected) {
      this.adapter.addClassAtRowIndex(rowIndex, cssClasses.ROW_SELECTED);
      this.adapter.setAttributeAtRowIndex(
          rowIndex, strings.ARIA_SELECTED, 'true');
    } else {
      this.adapter.removeClassAtRowIndex(rowIndex, cssClasses.ROW_SELECTED);
      this.adapter.setAttributeAtRowIndex(
          rowIndex, strings.ARIA_SELECTED, 'false');
    }
  }
}
