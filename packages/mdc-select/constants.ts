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

const cssClasses = {
  ACTIVATED: 'mdc-select--activated',
  DISABLED: 'mdc-select--disabled',
  DROPDOWN_ICON: 'mdc-select__dropdown-icon',
  FOCUSED: 'mdc-select--focused',
  ICON: 'mdc-select__icon',
  INVALID: 'mdc-select--invalid',
  MENU: 'mdc-select__menu',
  NATIVE_CONTROL: 'mdc-select__native-control',
  OUTLINED: 'mdc-select--outlined',
  REQUIRED: 'mdc-select--required',
  ROOT: 'mdc-select',
  SELECTED_ITEM_CLASS: 'mdc-list-item--selected',
  SELECTED_TEXT: 'mdc-select__selected-text',
  WITH_LEADING_ICON: 'mdc-select--with-leading-icon',
};

const strings = {
  ARIA_CONTROLS: 'aria-controls',
  ARIA_SELECTED_ATTR: 'aria-selected',
  CHANGE_EVENT: 'MDCSelect:change',
  ENHANCED_VALUE_ATTR: 'data-value',
  HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
  LABEL_SELECTOR: '.mdc-floating-label',
  LEADING_ICON_SELECTOR: '.mdc-select__icon',
  LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
  MENU_SELECTOR: '.mdc-select__menu',
  NATIVE_CONTROL_SELECTOR: '.mdc-select__native-control',
  OUTLINE_SELECTOR: '.mdc-notched-outline',
  SELECTED_ITEM_SELECTOR: `.${cssClasses.SELECTED_ITEM_CLASS}`,
  SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
};

const numbers = {
  LABEL_SCALE: 0.75,
};

export {cssClasses, strings, numbers};
