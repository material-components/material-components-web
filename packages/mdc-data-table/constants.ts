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
 * CSS class names used in component.
 */
export const cssClasses = {
  CELL: 'mdc-data-table__cell',
  CELL_NUMERIC: 'mdc-data-table__cell--numeric',
  CONTENT: 'mdc-data-table__content',
  HEADER_CELL_SORTED: 'mdc-data-table__header-cell--sorted',
  HEADER_CELL_SORTED_DESCENDING:
      'mdc-data-table__header-cell--sorted-descending',
  HEADER_CELL_WITH_SORT: 'mdc-data-table__header-cell--with-sort',
  HEADER_ROW: 'mdc-data-table__header-row',
  HEADER_ROW_CHECKBOX: 'mdc-data-table__header-row-checkbox',
  ROOT: 'mdc-data-table',
  ROW: 'mdc-data-table__row',
  ROW_CHECKBOX: 'mdc-data-table__row-checkbox',
  ROW_SELECTED: 'mdc-data-table__row--selected',
  SORT_ICON_BUTTON: 'mdc-data-table__sort-icon-button',
};

/**
 * List of data attributes used in component.
 */
export const dataAttributes = {
  ROW_ID: 'data-row-id',
  COLUMND_ID: 'data-columnd-id',
};

/**
 * Attributes and selectors used in component.
 */
export const strings = {
  ARIA_SELECTED: 'aria-selected',
  ARIA_SORT: 'aria-sort',
  DATA_ROW_ID_ATTR:
      dataAttributes.ROW_ID,  // deprecated. Moved to `dataAttributes`.
  HEADER_ROW_CHECKBOX_SELECTOR: `.${cssClasses.HEADER_ROW_CHECKBOX}`,
  ROW_CHECKBOX_SELECTOR: `.${cssClasses.ROW_CHECKBOX}`,
  ROW_SELECTED_SELECTOR: `.${cssClasses.ROW_SELECTED}`,
  ROW_SELECTOR: `.${cssClasses.ROW}`,
};

/**
 * Sort values defined by ARIA.
 * See https://www.w3.org/WAI/PF/aria/states_and_properties#aria-sort
 */
export enum SortValue {
  // Items are sorted in ascending order by this column.
  ASCENDING = 'ascending',

  // Items are sorted in descending order by this column.
  DESCENDING = 'descending',

  // There is no defined sort applied to the column.
  NONE = 'none',

  // A sort algorithm other than ascending or descending has been applied.
  OTHER = 'other',
}

/**
 * Event names used in component.
 */
export const events = {
  ROW_SELECTION_CHANGED: 'MDCDataTable:rowSelectionChanged',
  SELECTED_ALL: 'MDCDataTable:selectedAll',
  UNSELECTED_ALL: 'MDCDataTable:unselectedAll',
  SORTED: 'MDCDataTable:sorted',
};
