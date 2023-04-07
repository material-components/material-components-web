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
  LEFT = 'left',
  RIGHT = 'right',
}

export enum EventSource {
  PRIMARY = 'primary',
  TRAILING = 'trailing',
  NONE = 'none',
}

export const strings = {
  ADDED_ANNOUNCEMENT_ATTRIBUTE: 'data-mdc-chip-added-announcement',
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
  IE_ARROW_DOWN_KEY: 'Down',
  IE_ARROW_LEFT_KEY: 'Left',
  IE_ARROW_RIGHT_KEY: 'Right',
  IE_ARROW_UP_KEY: 'Up',
  IE_DELETE_KEY: 'Del',
  INTERACTION_EVENT: 'MDCChip:interaction',
  LEADING_ICON_SELECTOR: '.mdc-chip__icon--leading',
  NAVIGATION_EVENT: 'MDCChip:navigation',
  PRIMARY_ACTION_SELECTOR: '.mdc-chip__primary-action',
  REMOVED_ANNOUNCEMENT_ATTRIBUTE: 'data-mdc-chip-removed-announcement',
  REMOVAL_EVENT: 'MDCChip:removal',
  SELECTION_EVENT: 'MDCChip:selection',
  SPACEBAR_KEY: ' ',
  TAB_INDEX: 'tabindex',
  TRAILING_ACTION_SELECTOR: '.mdc-chip-trailing-action',
  TRAILING_ICON_INTERACTION_EVENT: 'MDCChip:trailingIconInteraction',
  TRAILING_ICON_SELECTOR: '.mdc-chip__icon--trailing',
};

export const cssClasses = {
  CHECKMARK: 'mdc-chip__checkmark',
  CHIP_EXIT: 'mdc-chip--exit',
  DELETABLE: 'mdc-chip--deletable',
  EDITABLE: 'mdc-chip--editable',
  EDITING: 'mdc-chip--editing',
  HIDDEN_LEADING_ICON: 'mdc-chip__icon--leading-hidden',
  LEADING_ICON: 'mdc-chip__icon--leading',
  PRIMARY_ACTION: 'mdc-chip__primary-action',
  PRIMARY_ACTION_FOCUSED: 'mdc-chip--primary-action-focused',
  SELECTED: 'mdc-chip--selected',
  TEXT: 'mdc-chip__text',
  TRAILING_ACTION: 'mdc-chip__trailing-action',
  TRAILING_ICON: 'mdc-chip__icon--trailing',
};

export const navigationKeys = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this
// by hand
navigationKeys.add(strings.ARROW_LEFT_KEY);
navigationKeys.add(strings.ARROW_RIGHT_KEY);
navigationKeys.add(strings.ARROW_DOWN_KEY);
navigationKeys.add(strings.ARROW_UP_KEY);
navigationKeys.add(strings.END_KEY);
navigationKeys.add(strings.HOME_KEY);
navigationKeys.add(strings.IE_ARROW_LEFT_KEY);
navigationKeys.add(strings.IE_ARROW_RIGHT_KEY);
navigationKeys.add(strings.IE_ARROW_DOWN_KEY);
navigationKeys.add(strings.IE_ARROW_UP_KEY);

export const jumpChipKeys = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this
// by hand
jumpChipKeys.add(strings.ARROW_UP_KEY);
jumpChipKeys.add(strings.ARROW_DOWN_KEY);
jumpChipKeys.add(strings.HOME_KEY);
jumpChipKeys.add(strings.END_KEY);
jumpChipKeys.add(strings.IE_ARROW_UP_KEY);
jumpChipKeys.add(strings.IE_ARROW_DOWN_KEY);
