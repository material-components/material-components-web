/**
 * @license
 * Copyright 2020 Google Inc.
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
 * MDCChipActionCssClasses provides the classes to be queried and manipulated on
 * the root.
 */
export enum MDCChipActionCssClasses {
  PRIMARY_ACTION = 'mdc-evolution-chip__action--primary',
  TRAILING_ACTION = 'mdc-evolution-chip__action--trailing',
  CHIP_ROOT = 'mdc-evolution-chip',
}

/**
 * MDCChipActionInteractionTrigger provides detail of the different triggers for
 * action interactions.
 */
export enum MDCChipActionInteractionTrigger {
  UNSPECIFIED,  // Default type
  CLICK,
  BACKSPACE_KEY,
  DELETE_KEY,
  SPACEBAR_KEY,
  ENTER_KEY,
}

/**
 * MDCChipActionType provides the different types of available actions.
 */
export enum MDCChipActionType {
  UNSPECIFIED,  // Default type
  PRIMARY,
  TRAILING,
}

/**
 * MDCChipActionEvents provides the different events emitted by the action.
 */
export enum MDCChipActionEvents {
  INTERACTION = 'MDCChipAction:interaction',
  NAVIGATION = 'MDCChipAction:navigation',
}

/**
 * MDCChipActionFocusBehavior provides configurations for focusing or unfocusing
 * an action.
 */
export enum MDCChipActionFocusBehavior {
  FOCUSABLE,
  FOCUSABLE_AND_FOCUSED,
  NOT_FOCUSABLE,
}

/**
 * MDCChipActionAttributes provides the HTML attributes used by the foundation.
 */
export enum MDCChipActionAttributes {
  ARIA_DISABLED = 'aria-disabled',
  ARIA_HIDDEN = 'aria-hidden',
  ARIA_SELECTED = 'aria-selected',
  DATA_DELETABLE = 'data-mdc-deletable',
  DISABLED = 'disabled',
  ROLE = 'role',
  TAB_INDEX = 'tabindex',
}
