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

export enum Direction {
  RIGHT,
  LEFT,
}

export enum EventSource {
  PRIMARY,
  TRAILING,
  NONE,
}

export const strings = {
  ARIA_CHECKED: 'aria-checked',
  ARROW_DOWN_KEY: 'ArrowDown',
  ARROW_LEFT_KEY: 'ArrowLeft',
  ARROW_RIGHT_KEY: 'ArrowRight',
  ARROW_UP_KEY: 'ArrowUp',
  BACKSPACE_KEY: 'Backspace',
  CHECKMARK_SELECTOR: '.mdc-chip__checkmark',
  DELETE_KEY: 'Delete',
  END_KEY: 'End',
  ENTER_KEY: 'Enter',
  ENTRY_ANIMATION_NAME: 'mdc-chip-entry',
  HOME_KEY: 'Home',
  INTERACTION_EVENT: 'MDCChip:interaction',
  LEADING_ICON_SELECTOR: '.mdc-chip__icon--leading',
  NAVIGATION_EVENT: 'MDCChip:navigation',
  PRIMARY_ACTION_SELECTOR: '.mdc-chip__primary-action',
  REMOVAL_EVENT: 'MDCChip:removal',
  SELECTION_EVENT: 'MDCChip:selection',
  SPACEBAR_KEY: ' ',
  TAB_INDEX: 'tabindex',
  TRAILING_ACTION_SELECTOR: '.mdc-chip__trailing-action',
  TRAILING_ICON_INTERACTION_EVENT: 'MDCChip:trailingIconInteraction',
  TRAILING_ICON_SELECTOR: '.mdc-chip__icon--trailing',
};

export const cssClasses = {
  CHECKMARK: 'mdc-chip__checkmark',
  CHECKMARK_PATH: 'mdc-chip__checkmark-path',
  CHECKMARK_SVG: 'mdc-chip__checkmark-svg',
  CHIP_EXIT: 'mdc-chip--exit',
  DELETABLE: 'mdc-chip--deletable',
  HIDDEN_LEADING_ICON: 'mdc-chip__icon--leading-hidden',
  ICON: 'mdc-chip__icon',
  LEADING_ICON: 'mdc-chip__icon--leading',
  PRIMARY_ACTION: 'mdc-chip__primary-action',
  ROOT: 'mdc-chip',
  SELECTED: 'mdc-chip--selected',
  TEXT: 'mdc-chip__text',
  TRAILING_ACTION: 'mdc-chip__trailing-action',
  TRAILING_ICON: 'mdc-chip__icon--trailing',
};

export const navigationKeys = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this by hand
navigationKeys.add(strings.ARROW_LEFT_KEY);
navigationKeys.add(strings.ARROW_RIGHT_KEY);
navigationKeys.add(strings.ARROW_DOWN_KEY);
navigationKeys.add(strings.ARROW_UP_KEY);
navigationKeys.add(strings.END_KEY);
navigationKeys.add(strings.HOME_KEY);

export const jumpChipKeys = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this by hand
jumpChipKeys.add(strings.ARROW_UP_KEY);
jumpChipKeys.add(strings.ARROW_DOWN_KEY);
jumpChipKeys.add(strings.HOME_KEY);
jumpChipKeys.add(strings.END_KEY);
