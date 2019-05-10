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
  addClassAtRowIndex(rowIndex: number, cssClasses: string): void;
  getAttributeAtRowIndex(rowIndex: number, attr: string): void;
  getRowCount(): number;
  getRowElements(): HTMLElement[];
  getRowIdAtIndex(rowIndex: number): string | null;
  getRowIndexByChildElement(el: Element): number;
  getSelectedRowCount(): number;
  isHeaderRowCheckboxChecked(): boolean;
  isRowsSelectable(): boolean;
  notifyRowSelectionChanged(data: MDCDataTableRowSelectionChangedEventDetail): void;
  notifySelectedAll(): void;
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
