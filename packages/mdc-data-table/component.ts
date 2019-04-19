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

import {MDCComponent} from '@material/base/component';
import {closest} from '@material/dom/ponyfill';
import {MDCCheckbox, MDCCheckboxFactory} from '@material/checkbox/component';
import {MDCDataTableAdapter} from './adapter';
import {MDCDataTableFoundation} from './foundation';
import {cssClasses, strings} from './constants';

interface RowCheckboxMap {
  [rowId: string]: MDCCheckbox;
}

export class MDCDataTable extends MDCComponent<MDCDataTableFoundation> {
  static attachTo(root: Element): MDCDataTable {
    return new MDCDataTable(root);
  }

  private rowCheckboxMap_!: RowCheckboxMap; // assigned in initialize()
  private headerRowCheckbox_!: MDCCheckbox; // assigned in initialize()

  initialize(checkboxFactory: MDCCheckboxFactory = (el: Element) => new MDCCheckbox(el)) {
    const headerRowCheckboxEl = this.root_.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR);

    if (headerRowCheckboxEl) {
      this.headerRowCheckbox_ = checkboxFactory(headerRowCheckboxEl);
      this.rowCheckboxMap_ = {};

      for (const [index, rowEl] of this.getRows().entries()) {
        let rowId = rowEl.getAttribute(strings.DATA_ROW_ID_ATTR);
        if (!rowId) {
          rowId = index.toString();
          rowEl.setAttribute(strings.DATA_ROW_ID_ATTR, rowId);
        }
        const checkbox = checkboxFactory(rowEl.querySelector(`.${cssClasses.ROW_CHECKBOX}`) as HTMLInputElement);
        this.rowCheckboxMap_[rowId] = checkbox;
      }
    }
  }

  initialSyncWithDOM() {
    this.root_.querySelector<HTMLElement>(`.${cssClasses.HEADER_ROW}`)
        .addEventListener('change', (event) => this.foundation_.handleHeaderRowCheckboxChange(event));
    this.root_.querySelector<HTMLElement>(`.${cssClasses.CONTENT}`)
        .addEventListener('change', (event) => this.foundation_.handleRowCheckboxChange(event));
    this.setHeaderRowCheckState_(this.getSelectedRowIds().length);
  }

  setHeaderRowCheckState_(selectedRowsCount: number) {
    this.headerRowCheckbox_.indeterminate = selectedRowsCount > 0 && selectedRowsCount < this.getRowIds().length;
    this.headerRowCheckbox_.checked = selectedRowsCount !== 0;
  }

  getRowCheckboxById(rowId: string): MDCCheckbox {
    return this.rowCheckboxMap_[rowId];
  }

  getRowAtId(rowId: string): HTMLElement {
    return this.root_.querySelector(`[${strings.DATA_ROW_ID_ATTR}="${rowId}]`) as HTMLElement;
  }

  getRowId(row: Element): string {
    const rowId = row.getAttribute(strings.DATA_ROW_ID_ATTR) as string;
    if (!rowId) {
      throw new Error('Expected table row to have unique id via data-row-id attribute.');
    }

    return rowId;
  }

  getRows(): HTMLElement[] {
    return [].slice.call(this.root_.querySelectorAll(`.${cssClasses.ROW}`));
  }

  getRowIds(): string[] {
    return this.getRows().map((rowEl: HTMLElement) => rowEl.getAttribute(strings.DATA_ROW_ID_ATTR) as string);
  }

  getSelectedRowIds(): Array<string|null> {
    const selectedRows = [].slice.call(this.root_.querySelectorAll(`.${cssClasses.ROW_SELECTED}`));
    return selectedRows.map((rowEl: HTMLElement) => rowEl.getAttribute(strings.DATA_ROW_ID_ATTR));
  }

  destroy() {
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCDataTableAdapter = {
      addClass: (className) => this.root_.classList.add(className),
      hasClass: (className) => this.root_.classList.contains(className),
      removeClass: (className) => this.root_.classList.remove(className),
      isHeaderRowCheckboxChecked: () => this.headerRowCheckbox_.checked,
      getRowsIds: () => this.getRowIds(),
      isRowCheckboxAtIdChecked: (rowId: string) => this.getRowCheckboxById(rowId).checked,
      setCheckboxCheckedAtRowId: (rowId: string, checked: boolean) => {
        this.getRowCheckboxById(rowId).checked = checked;
      },
      addClassAtRowId: (rowId: string, className: string) => this.getRowAtId(rowId).classList.add(className),
      removeClassAtRowId: (rowId: string, className: string) => this.getRowAtId(rowId).classList.remove(className),
      setAttributeAtRowId: (rowId: string, attr: string, value: string) => this.getRowAtId(rowId).setAttribute(attr, value),
    };
    return new MDCDataTableFoundation(adapter);
  }
}
