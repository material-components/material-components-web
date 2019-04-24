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
import {cssClasses, events, strings} from './constants';
import {MDCDataTableRowSelectionChangedEventDetail} from './types';

export class MDCDataTable extends MDCComponent<MDCDataTableFoundation> {
  static attachTo(root: Element): MDCDataTable {
    return new MDCDataTable(root);
  }

  private rowCheckboxList_!: MDCCheckbox[];
  private headerRowCheckbox_!: MDCCheckbox; // assigned in initialize()
  private checkboxFactory_!: MDCCheckboxFactory;

  initialize(checkboxFactory: MDCCheckboxFactory = (el: Element) => new MDCCheckbox(el)) {
    this.checkboxFactory_ = checkboxFactory;
  }

  initialSyncWithDOM() {
    (this.root_.querySelector(`.${cssClasses.HEADER_ROW}`) as HTMLElement)
        .addEventListener('change', () => this.foundation_.handleHeaderRowCheckboxChange());
    (this.root_.querySelector(`.${cssClasses.CONTENT}`) as HTMLElement)
        .addEventListener('change', (event) => this.foundation_.handleRowCheckboxChange(event));

    this.foundation_.layout();
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
    return this.foundation_.getRows();
  }

  getRowCount(): number {
    return this.getRows().length;
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCDataTableAdapter = {
      isHeaderRowCheckboxChecked: () => this.headerRowCheckbox_.checked,
      addClassAtRowIndex: (rowIndex: number, className: string) => {
        return this.getRows()[rowIndex].classList.add(className);
      },
      removeClassAtRowIndex: (rowIndex: number, className: string) => {
        return this.getRows()[rowIndex].classList.remove(className);
      },
      getAttributeAtRowIndex: (index: number, attr: string) => this.getRows()[index].getAttribute(attr),
      setAttributeAtRowIndex: (rowIndex: number, attr: string, value: string) => {
        this.getRows()[rowIndex].setAttribute(attr, value);
      },
      registerRowCheckboxes: () => {
        if (this.rowCheckboxList_) {
          this.rowCheckboxList_.forEach((checkbox) => checkbox.destroy());
        }

        this.rowCheckboxList_ = [];
        this.getRows().forEach((rowEl) => {
          const checkbox = this.checkboxFactory_(rowEl.querySelector(strings.ROW_CHECKBOX_SELECTOR) as HTMLElement);
          this.rowCheckboxList_.push(checkbox);
        });
      },
      getRowElements: () => [].slice.call(this.root_.querySelectorAll(`.${cssClasses.ROW}`)),
      registerHeaderRowCheckbox: () => {
        if (this.headerRowCheckbox_) {
          this.headerRowCheckbox_.destroy();
        }

        this.headerRowCheckbox_ =
            this.checkboxFactory_(this.root_.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR) as HTMLElement);
      },
      selectAllRowCheckboxes: () => {
        this.rowCheckboxList_.forEach((checkbox) => {
          checkbox.checked = true;
        });
      },
      unselectAllRowCheckboxes: () => {
        this.rowCheckboxList_.forEach((checkbox) => {
          checkbox.checked = false;
        });
      },
      isRowsSelectable: () => !!this.root_.querySelector(strings.ROW_CHECKBOX_SELECTOR),
      getRowIndexByChildElement: (el: Element) => {
        return this.getRows().indexOf(closest(el, strings.ROW_SELECTOR) as HTMLElement);
      },
      getRowCount: () => this.getRows().length,
      getSelectedRowCount: () => this.root_.querySelectorAll(strings.ROW_SELECTED_SELECTOR).length,
      notifyRowSelectionChanged: (data: MDCDataTableRowSelectionChangedEventDetail) => {
        this.emit(events.ROW_SELECTION_CHANGED, {
          row: this.getRowByIndex_(data.rowIndex),
          rowId: this.getRowIdByIndex_(data.rowIndex),
          rowIndex: data.rowIndex,
          selected: data.selected,
        }, /** shouldBubble */ true);
      },
      setHeaderRowCheckboxIndeterminate: (indeterminate: boolean) => {
        this.headerRowCheckbox_.indeterminate = indeterminate;
      },
      setHeaderRowCheckboxChecked: (checked: boolean) => {
        this.headerRowCheckbox_.checked = checked;
      },
      getRowIdAtIndex: (rowIndex: number) => this.getRows()[rowIndex].getAttribute(strings.DATA_ROW_ID_ATTR),
    };
    return new MDCDataTableFoundation(adapter);
  }

  private getRowByIndex_(index: number): HTMLElement {
    return this.getRows()[index] as HTMLElement;
  }

  private getRowIdByIndex_(index: number): string | null {
    return this.getRowByIndex_(index).getAttribute(strings.DATA_ROW_ID_ATTR);
  }
}
