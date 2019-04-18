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
        if (!rowEl.getAttribute('data-row-id')) {
          rowEl.setAttribute('data-row-id', index.toString());
        }
        const rowId = rowEl.getAttribute('data-row-id') || index.toString();
        const checkbox = checkboxFactory(rowEl.querySelector(`.${cssClasses.ROW_CHECKBOX}`) as HTMLInputElement);
        this.rowCheckboxMap_[rowId] = checkbox;
      }
    }
  }

  initialSyncWithDOM() {
    this.listen('change', (event) => this.handleRowCheckboxChange(event));
  }

  getRowCheckboxById(rowId: string): MDCCheckbox {
    return this.rowCheckboxMap_[rowId];
  }

  handleRowCheckboxChange(event: Event) {
    console.log('debug: ', event.target);
    const checkboxEl = event.target as HTMLInputElement;
    const row = closest(checkboxEl, `.${cssClasses.ROW}, .${cssClasses.HEADER_ROW}`) as HTMLElement;

    if (row.classList.contains(cssClasses.HEADER_ROW)) {
      const checked = this.headerRowCheckbox_.checked;
      for (const row of this.getRows()) {
        const rowId = row.getAttribute('data-row-id') as string;
        this.getRowCheckboxById(rowId).checked = checked;
        if (checked) {
          row.classList.add(cssClasses.ROW_SELECTED);
        } else {
          row.classList.remove(cssClasses.ROW_SELECTED);
        }
        row.setAttribute('aria-selected', checked.toString());
      }
    } else {
      const rowId = row.getAttribute('data-row-id') as string;
      const checked = checkboxEl.checked;

      if (checked) {
        row.classList.add(cssClasses.ROW_SELECTED);
        row.setAttribute('aria-selected', 'true');
      } else {
        row.classList.remove(cssClasses.ROW_SELECTED);
        row.setAttribute('aria-selected', 'false');
      }

      const selectedRowsCount = this.getSelectedRowIds().length;
      console.log('debug: ', selectedRowsCount, 'of', this.getRowIds().length);
      this.headerRowCheckbox_.indeterminate = selectedRowsCount > 0 && selectedRowsCount < this.getRowIds().length;
      this.headerRowCheckbox_.checked = selectedRowsCount !== 0;

      this.emit('MDCDataTable:changed', {row, rowId, checked}, /** shouldBubble */ true);
    }
  }

  getRows(): HTMLElement[] {
    return [].slice.call(this.root_.querySelectorAll(`.${cssClasses.ROW}`));
  }

  getRowIds(): string[] {
    return this.getRows().map((rowEl: HTMLElement) => rowEl.getAttribute('data-row-id') as string);
  }

  getSelectedRowIds(): Array<string|null> {
    const selectedRows = [].slice.call(this.root_.querySelectorAll(`.${cssClasses.ROW_SELECTED}`));
    return selectedRows.map((rowEl: HTMLElement) => rowEl.getAttribute('data-row-id'));
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
    };
    return new MDCDataTableFoundation(adapter);
  }
}
