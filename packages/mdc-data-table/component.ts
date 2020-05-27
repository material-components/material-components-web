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
import {SpecificEventListener} from '@material/base/types';
import {MDCCheckbox, MDCCheckboxFactory} from '@material/checkbox/component';
import {closest} from '@material/dom/ponyfill';
import {MDCDataTableAdapter} from './adapter';
import {cssClasses, events, strings} from './constants';
import {MDCDataTableFoundation} from './foundation';
import {MDCDataTableRowSelectionChangedEventDetail} from './types';

/**
 * Implementation of `MDCDataTableFoundation`
 */
export class MDCDataTable extends MDCComponent<MDCDataTableFoundation> {
  static attachTo(root: Element): MDCDataTable {
    return new MDCDataTable(root);
  }

  private headerRowCheckbox!: MDCCheckbox;
  private rowCheckboxList!: MDCCheckbox[];
  private checkboxFactory!: MDCCheckboxFactory;
  private headerRow!: HTMLElement;
  private content!: HTMLElement;
  private handleHeaderRowCheckboxChange!: SpecificEventListener<'change'>;
  private handleRowCheckboxChange!: SpecificEventListener<'change'>;

  initialize(checkboxFactory: MDCCheckboxFactory = (el: Element) => new MDCCheckbox(el)) {
    this.checkboxFactory = checkboxFactory;
  }

  initialSyncWithDOM() {
    this.headerRow =
        this.root.querySelector(`.${cssClasses.HEADER_ROW}`) as HTMLElement;
    this.handleHeaderRowCheckboxChange = () =>
        this.foundation.handleHeaderRowCheckboxChange();
    this.headerRow.addEventListener(
        'change', this.handleHeaderRowCheckboxChange);

    this.content =
        this.root.querySelector(`.${cssClasses.CONTENT}`) as HTMLElement;
    this.handleRowCheckboxChange = (event) =>
        this.foundation.handleRowCheckboxChange(event);
    this.content.addEventListener('change', this.handleRowCheckboxChange);

    this.layout();
  }

  /**
   * Re-initializes header row checkbox and row checkboxes when selectable rows are added or removed from table.
   */
  layout() {
    this.foundation.layout();
  }

  /**
   * @return Returns array of row elements.
   */
  getRows(): Element[] {
    return this.foundation.getRows();
  }

  /**
   * @return Returns array of selected row ids.
   */
  getSelectedRowIds(): Array<string|null> {
    return this.foundation.getSelectedRowIds();
  }

  /**
   * Sets selected row ids. Overwrites previously selected rows.
   * @param rowIds Array of row ids that needs to be selected.
   */
  setSelectedRowIds(rowIds: string[]) {
    this.foundation.setSelectedRowIds(rowIds);
  }

  destroy() {
    this.headerRow.removeEventListener(
        'change', this.handleHeaderRowCheckboxChange);
    this.content.removeEventListener('change', this.handleRowCheckboxChange);

    this.headerRowCheckbox.destroy();
    this.rowCheckboxList.forEach((checkbox) => {
      checkbox.destroy();
    });
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: Partial<MDCDataTableAdapter> = {
      addClassAtRowIndex: (rowIndex: number, className: string) => {
        this.getRows()[rowIndex].classList.add(className);
      },
      getRowCount: () => this.getRows().length,
      getRowElements:
          () => [].slice.call(this.root.querySelectorAll(strings.ROW_SELECTOR)),
      getRowIdAtIndex: (rowIndex: number) =>
          this.getRows()[rowIndex].getAttribute(strings.DATA_ROW_ID_ATTR),
      getRowIndexByChildElement: (el: Element) => {
        return this.getRows().indexOf((closest(el, strings.ROW_SELECTOR) as HTMLElement));
      },
      getSelectedRowCount: () =>
          this.root.querySelectorAll(strings.ROW_SELECTED_SELECTOR).length,
      isCheckboxAtRowIndexChecked: (rowIndex: number) =>
          this.rowCheckboxList[rowIndex].checked,
      isHeaderRowCheckboxChecked: () => this.headerRowCheckbox.checked,
      isRowsSelectable: () =>
          !!this.root.querySelector(strings.ROW_CHECKBOX_SELECTOR),
      notifyRowSelectionChanged:
          (data: MDCDataTableRowSelectionChangedEventDetail) => {
            this.emit(
                events.ROW_SELECTION_CHANGED, {
                  row: this.getRowByIndex(data.rowIndex),
                  rowId: this.getRowIdByIndex(data.rowIndex),
                  rowIndex: data.rowIndex,
                  selected: data.selected,
                },
                /** shouldBubble */ true);
          },
      notifySelectedAll: () => {
        this.emit(events.SELECTED_ALL, {}, /** shouldBubble */ true);
      },
      notifyUnselectedAll: () => {
        this.emit(events.UNSELECTED_ALL, {}, /** shouldBubble */ true);
      },
      registerHeaderRowCheckbox: () => {
        if (this.headerRowCheckbox) {
          this.headerRowCheckbox.destroy();
        }

        const checkboxEl =
            (this.root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR) as
             HTMLElement);
        this.headerRowCheckbox = this.checkboxFactory(checkboxEl);
      },
      registerRowCheckboxes: () => {
        if (this.rowCheckboxList) {
          this.rowCheckboxList.forEach((checkbox) => {
            checkbox.destroy();
          });
        }

        this.rowCheckboxList = [];
        this.getRows().forEach((rowEl) => {
          const checkbox = this.checkboxFactory(
              (rowEl.querySelector(strings.ROW_CHECKBOX_SELECTOR) as
               HTMLElement));
          this.rowCheckboxList.push(checkbox);
        });
      },
      removeClassAtRowIndex: (rowIndex: number, className: string) => {
        this.getRows()[rowIndex].classList.remove(className);
      },
      setAttributeAtRowIndex:
          (rowIndex: number, attr: string, value: string) => {
            this.getRows()[rowIndex].setAttribute(attr, value);
          },
      setHeaderRowCheckboxChecked: (checked: boolean) => {
        this.headerRowCheckbox.checked = checked;
      },
      setHeaderRowCheckboxIndeterminate: (indeterminate: boolean) => {
        this.headerRowCheckbox.indeterminate = indeterminate;
      },
      setRowCheckboxCheckedAtIndex: (rowIndex: number, checked: boolean) => {
        this.rowCheckboxList[rowIndex].checked = checked;
      },
    };
    return new MDCDataTableFoundation(adapter);
  }

  private getRowByIndex(index: number): Element {
    return this.getRows()[index];
  }

  private getRowIdByIndex(index: number): string|null {
    return this.getRowByIndex(index).getAttribute(strings.DATA_ROW_ID_ATTR);
  }
}
