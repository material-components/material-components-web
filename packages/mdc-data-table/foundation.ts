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
import {cssClasses, strings} from './constants';

export class MDCDataTableFoundation extends MDCFoundation<MDCDataTableAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter(): MDCDataTableAdapter {
    return {} as MDCDataTableAdapter;
  }

  constructor(adapter?: Partial<MDCDataTableAdapter>) {
    super({...MDCDataTableFoundation.defaultAdapter, ...adapter});
  }

  layout() {
    if (this.adapter_.isRowsSelectable()) {
      this.adapter_.registerHeaderRowCheckbox();
      this.adapter_.registerRowCheckboxes();
    }

    this.setHeaderRowCheckboxState_();
  }

  getRows(): HTMLElement[] {
    return this.adapter_.getRowElements();
  }

  setSelectedRowIds(rowIds: string[]) {
    for (let rowIndex = 0; rowIndex < this.adapter_.getRowCount(); rowIndex++) {
      const rowId = this.adapter_.getRowIdAtIndex(rowIndex);

      if (!rowId) {
        continue;
      }

      const isSelected = rowIds.indexOf(rowId) >= 0;
      this.adapter_.setRowCheckboxCheckedAtIndex(rowIndex, isSelected);
      this.selectRowAtIndex_(rowIndex, isSelected);
    }

    this.setHeaderRowCheckboxState_();
  }

  handleHeaderRowCheckboxChange() {
    const isHeaderChecked = this.adapter_.isHeaderRowCheckboxChecked();

    if (isHeaderChecked) {
      this.adapter_.selectAllRowCheckboxes();
    } else {
      this.adapter_.unselectAllRowCheckboxes();
    }

    for (let rowIndex = 0; rowIndex < this.adapter_.getRowCount(); rowIndex++) {
      if (isHeaderChecked) {
        this.adapter_.addClassAtRowIndex(rowIndex, cssClasses.ROW_SELECTED);
        this.adapter_.setAttributeAtRowIndex(rowIndex, strings.ARIA_SELECTED, 'true');
      } else {
        this.adapter_.removeClassAtRowIndex(rowIndex, cssClasses.ROW_SELECTED);
        this.adapter_.setAttributeAtRowIndex(rowIndex, strings.ARIA_SELECTED, 'false');
      }
    }
  }

  handleRowCheckboxChange(event: Event) {
    const rowIndex = this.adapter_.getRowIndexByChildElement(event.target as HTMLInputElement);

    if (rowIndex === -1) {
      return;
    }

    const checkboxNativeEl = event.target as HTMLInputElement;
    if (!checkboxNativeEl) {
      return;
    }

    const selected = checkboxNativeEl.checked;

    this.selectRowAtIndex_(rowIndex, selected);

    this.setHeaderRowCheckboxState_();
    const rowId = this.adapter_.getRowIdAtIndex(rowIndex);
    this.adapter_.notifyRowSelectionChanged({rowId, rowIndex, selected});
  }

  private setHeaderRowCheckboxState_() {
    if (this.adapter_.getSelectedRowCount() === this.adapter_.getRowCount()) {
      this.adapter_.setHeaderRowCheckboxIndeterminate(false);
      this.adapter_.setHeaderRowCheckboxChecked(true);
    } else if (this.adapter_.getSelectedRowCount() === 0) {
      this.adapter_.setHeaderRowCheckboxIndeterminate(false);
      this.adapter_.setHeaderRowCheckboxChecked(false);
    } else {
      this.adapter_.setHeaderRowCheckboxIndeterminate(true);
    }
  }

  private selectRowAtIndex_(rowIndex: number, selected: boolean) {
    if (selected) {
      this.adapter_.addClassAtRowIndex(rowIndex, cssClasses.ROW_SELECTED);
      this.adapter_.setAttributeAtRowIndex(rowIndex, strings.ARIA_SELECTED, 'true');
    } else {
      this.adapter_.removeClassAtRowIndex(rowIndex, cssClasses.ROW_SELECTED);
      this.adapter_.setAttributeAtRowIndex(rowIndex, strings.ARIA_SELECTED, 'false');
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCDataTableFoundation;
