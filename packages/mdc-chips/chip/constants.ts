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

/**
 * CssClasses provides the named constants for class names.
 */
export enum CssClasses {
  SELECTING = 'mdc-evolution-chip--selecting',
  DESELECTING = 'mdc-evolution-chip--deselecting',
  SELECTING_WITH_PRIMARY_ICON =
      'mdc-evolution-chip--selecting-with-primary-icon',
  DESELECTING_WITH_PRIMARY_ICON =
      'mdc-evolution-chip--deselecting-with-primary-icon',
  DISABLED = 'mdc-evolution-chip--disabled',
  ENTER = 'mdc-evolution-chip--enter',
  EXIT = 'mdc-evolution-chip--exit',
  SELECTED = 'mdc-evolution-chip--selected',
  HIDDEN = 'mdc-evolution-chip--hidden',
  WITH_PRIMARY_ICON = 'mdc-evolution-chip--with-primary-icon',
}

/**
 * Events provides the named constants for emitted events.
 */
export enum Events {
  INTERACTION = 'MDCChip:interaction',
  NAVIGATION = 'MDCChip:navigation',
  ANIMATION = 'MDCChip:animation',
}

/**
 * Events provides the named constants for strings used by the foundation.
 */
export enum Attributes {
  DATA_REMOVED_ANNOUNCEMENT = 'data-mdc-removed-announcement',
  DATA_ADDED_ANNOUNCEMENT = 'data-mdc-added-announcement',
}

/**
 * Animation provides the names of runnable animations.
 */
export enum Animation {
  ENTER = 'mdc-evolution-chip-enter',
  EXIT = 'mdc-evolution-chip-exit',
}
