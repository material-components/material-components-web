/**
 * @license
 * Copyright 2018 Google Inc.
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
  AVATAR_LIST: 'mdc-list--avatar-list',
  DENSE: 'mdc-list--dense',
  DIVIDER: 'mdc-list-divider',
  DIVIDER_PADDED: 'mdc-list-divider--padded',
  GROUP: 'mdc-list-group',
  GROUP_SUBHEADER: 'mdc-list-group__subheader',
  ITEM: 'mdc-list-item',
  ITEM_ACTIVATED: 'mdc-list-item--activated',
  ITEM_DISABLED: 'mdc-list-item--disabled',
  ITEM_GRAPHIC: 'mdc-list-item__graphic',
  ITEM_META: 'mdc-list-item__meta',
  ITEM_PRIMARY_TEXT: 'mdc-list-item__primary-text',
  ITEM_SECONDARY_TEXT: 'mdc-list-item__secondary-text',
  ITEM_SELECTED: 'mdc-list-item--selected',
  ITEM_TEXT: 'mdc-list-item__text',
  NON_INTERACTIVE: 'mdc-list--non-interactive',
  ROOT: 'mdc-list',
  TWO_LINE: 'mdc-list--two-line',
};

const strings = {
  ACTION_EVENT: 'MDCList:action',
  ARIA_CHECKED: 'aria-checked',
  ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
  ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
  ARIA_CURRENT: 'aria-current',
  ARIA_ORIENTATION: 'aria-orientation',
  ARIA_ORIENTATION_HORIZONTAL: 'horizontal',
  ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
  ARIA_SELECTED: 'aria-selected',
  CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"]:not(:disabled), input[type="radio"]:not(:disabled)',
  CHECKBOX_SELECTOR: 'input[type="checkbox"]:not(:disabled)',
  CHILD_ELEMENTS_TO_TOGGLE_TABINDEX: `
    .${cssClasses.ITEM} button:not(:disabled),
    .${cssClasses.ITEM} a
  `,
  FOCUSABLE_CHILD_ELEMENTS: `
    .${cssClasses.ITEM} button:not(:disabled),
    .${cssClasses.ITEM} a,
    .${cssClasses.ITEM} input[type="radio"]:not(:disabled),
    .${cssClasses.ITEM} input[type="checkbox"]:not(:disabled)
  `,
  RADIO_SELECTOR: 'input[type="radio"]:not(:disabled)',
};

const numbers = {
  UNSET_INDEX: -1,
};

export {strings, cssClasses, numbers};
