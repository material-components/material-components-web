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
  HEADER_CELL: 'mdc-data-table__header-cell',
  HEADER_CELL_LABEL: 'mdc-data-table__header-cell-label',
  HEADER_CELL_SORTED: 'mdc-data-table__header-cell--sorted',
  HEADER_CELL_SORTED_DESCENDING:
      'mdc-data-table__header-cell--sorted-descending',
  HEADER_CELL_WITH_SORT: 'mdc-data-table__header-cell--with-sort',
  HEADER_CELL_WRAPPER: 'mdc-data-table__header-cell-wrapper',
  HEADER_ROW: 'mdc-data-table__header-row',
  HEADER_ROW_CHECKBOX: 'mdc-data-table__header-row-checkbox',
  IN_PROGRESS: 'mdc-data-table--in-progress',
  PROGRESS_INDICATOR: 'mdc-data-table__progress-indicator',
  ROOT: 'mdc-data-table',
  ROW: 'mdc-data-table__row',
  ROW_CHECKBOX: 'mdc-data-table__row-checkbox',
  ROW_SELECTED: 'mdc-data-table__row--selected',
  SORT_ICON_BUTTON: 'mdc-data-table__sort-icon-button',
  PAGINATION_ROWS_PER_PAGE_SELECT:
      'mdc-data-table__pagination-rows-per-page-select',
  PAGINATION_ROWS_PER_PAGE_LABEL:
      'mdc-data-table__pagination-rows-per-page-label',
};

/**
 * DOM attributes used in component.
 */
export const attributes = {
  ARIA_SELECTED: 'aria-selected',
  ARIA_SORT: 'aria-sort',
};

/**
 * List of data attributes used in component.
 */
export const dataAttributes = {
  COLUMN_ID: 'data-column-id',
  ROW_ID: 'data-row-id',
};

/**
 * CSS selectors used in component.
 */
export const selectors = {
  CONTENT: `.${cssClasses.CONTENT}`,
  HEADER_CELL: `.${cssClasses.HEADER_CELL}`,
  HEADER_CELL_WITH_SORT: `.${cssClasses.HEADER_CELL_WITH_SORT}`,
  HEADER_ROW: `.${cssClasses.HEADER_ROW}`,
  HEADER_ROW_CHECKBOX: `.${cssClasses.HEADER_ROW_CHECKBOX}`,
  PROGRESS_INDICATOR: `.${cssClasses.PROGRESS_INDICATOR}`,
  ROW: `.${cssClasses.ROW}`,
  ROW_CHECKBOX: `.${cssClasses.ROW_CHECKBOX}`,
  ROW_SELECTED: `.${cssClasses.ROW_SELECTED}`,
  SORT_ICON_BUTTON: `.${cssClasses.SORT_ICON_BUTTON}`,
};

/**
 * Attributes and selectors used in component.
 * @deprecated Use `attributes`, `dataAttributes` and `selectors` instead.
 */
export const strings = {
  ARIA_SELECTED: attributes.ARIA_SELECTED,
  ARIA_SORT: attributes.ARIA_SORT,
  DATA_ROW_ID_ATTR: dataAttributes.ROW_ID,
  HEADER_ROW_CHECKBOX_SELECTOR: selectors.HEADER_ROW_CHECKBOX,
  ROW_CHECKBOX_SELECTOR: selectors.ROW_CHECKBOX,
  ROW_SELECTED_SELECTOR: selectors.ROW_SELECTED,
  ROW_SELECTOR: selectors.ROW,
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
