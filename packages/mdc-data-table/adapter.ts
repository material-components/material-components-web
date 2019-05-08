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

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */

import {MDCDataTableRowSelectionChangedEventDetail} from './types';

export interface MDCDataTableAdapter {
  /**
   * Adds a class name to row element at given row index excluding header row.
   *
   * @param rowIndex Index of row element excluding header row.
   * @param cssClasses CSS Class string to add.
   */
  addClassAtRowIndex(rowIndex: number, cssClasses: string): void;

  /**
   * Returns attribute value of row element at given row index excluding header row.
   *
   * @param rowIndex Index of row element excluding header row.
   * @param attr Attribute string of row element.
   */
  getAttributeAtRowIndex(rowIndex: number, attr: string): void;

  /**
   * Returns row count excluding header row.
   */
  getRowCount(): number;

  /**
   * Returns array of row elements excluding header row.
   */
  getRowElements(): HTMLElement[];

  /**
   * Returns row id of row element at given row index based on `data-row-id` attribute on row element `tr`
   *
   * @param rowIndex Index of row element.
   * @return Row id of row element, returns `null` in absence of `data-row-id` attribute on row element.
   */
  getRowIdAtIndex(rowIndex: number): string | null;

  /**
   * Returns index of row element that contains give child element.
   *
   * @param el Child element of row element.
   * @return Index of row element.
   */
  getRowIndexByChildElement(el: Element): number;

  /**
   * @return Selected row count.
   */
  getSelectedRowCount(): number;

  /**
   * @return True if header row checkbox is checked.
   */
  isHeaderRowCheckboxChecked(): boolean;

  /**
   * @return True if table rows are selectable.
   */
  isRowsSelectable(): boolean;

  /**
   * @param data Event detail data for row selection changed event.
   */
  notifyRowSelectionChanged(data: MDCDataTableRowSelectionChangedEventDetail): void;

  /**
   * Notifies when header row is checked.
   */
  notifySelectedAll(): void;

  /**
   * Notifies when header row is unchecked.
   */
  notifyUnselectedAll(): void;

  /**
   * Initializes header row checkbox. Destroys previous header row checkbox instance if any.
   */
  registerHeaderRowCheckbox(): void;

  /**
   * Initializes all row checkboxes. Destroys previous row checkbox instances if any. This is usually called when row
   * checkboxes are added or removed from table.
   */
  registerRowCheckboxes(): void;

  removeClassAtRowIndex(rowIndex: number, cssClasses: string): void;
  setAttributeAtRowIndex(rowIndex: number, attr: string, value: string): void;
  setHeaderRowCheckboxChecked(checked: boolean): void;
  setHeaderRowCheckboxIndeterminate(indeterminate: boolean): void;
  setRowCheckboxCheckedAtIndex(rowIndex: number, checked: boolean): void;
}
