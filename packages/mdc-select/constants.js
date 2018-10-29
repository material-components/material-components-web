/**
 * @license
 * Copyright 2016 Google Inc.
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

/** @enum {string} */
const cssClasses = {
  DISABLED: 'mdc-select--disabled',
  ROOT: 'mdc-select',
  OUTLINED: 'mdc-select--outlined',
  FOCUSED: 'mdc-select--focused',
  SELECTED_ITEM_CLASS: 'mdc-list-item--selected',
  WITH_LEADING_ICON: 'mdc-select--with-leading-icon',
  INVALID: 'mdc-select--invalid',
  REQUIRED: 'mdc-select--required',
};

/** @enum {string} */
const strings = {
  ARIA_CONTROLS: 'aria-controls',
  CHANGE_EVENT: 'MDCSelect:change',
  SELECTED_ITEM_SELECTOR: `.${cssClasses.SELECTED_ITEM_CLASS}`,
  LEADING_ICON_SELECTOR: '.mdc-select__icon',
  SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
  HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
  MENU_SELECTOR: '.mdc-select__menu',
  LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
  LABEL_SELECTOR: '.mdc-floating-label',
  NATIVE_CONTROL_SELECTOR: '.mdc-select__native-control',
  OUTLINE_SELECTOR: '.mdc-notched-outline',
  ENHANCED_VALUE_ATTR: 'data-value',
  ARIA_SELECTED_ATTR: 'aria-selected',
};

/** @enum {number} */
const numbers = {
  LABEL_SCALE: 0.75,
};

export {cssClasses, strings, numbers};
