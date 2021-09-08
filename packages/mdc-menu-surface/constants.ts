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
  ANCHOR: 'mdc-menu-surface--anchor',
  ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
  ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
  FIXED: 'mdc-menu-surface--fixed',
  IS_OPEN_BELOW: 'mdc-menu-surface--is-open-below',
  OPEN: 'mdc-menu-surface--open',
  ROOT: 'mdc-menu-surface',
};

// tslint:disable:object-literal-sort-keys
const strings = {
  CLOSED_EVENT: 'MDCMenuSurface:closed',
  CLOSING_EVENT: 'MDCMenuSurface:closing',
  OPENED_EVENT: 'MDCMenuSurface:opened',
  FOCUSABLE_ELEMENTS: [
    'button:not(:disabled)',
    '[href]:not([aria-disabled="true"])',
    'input:not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
  ].join(', '),
};
// tslint:enable:object-literal-sort-keys

const numbers = {
  /** Total duration of menu-surface open animation. */
  TRANSITION_OPEN_DURATION: 120,

  /** Total duration of menu-surface close animation. */
  TRANSITION_CLOSE_DURATION: 75,

  /**
   * Margin left to the edge of the viewport when menu-surface is at maximum
   * possible height. Also used as a viewport margin.
   */
  MARGIN_TO_EDGE: 32,

  /**
   * Ratio of anchor width to menu-surface width for switching from corner
   * positioning to center positioning.
   */
  ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,

  /**
   * Amount of time to wait before restoring focus when closing the menu
   * surface. This is important because if a touch event triggered the menu
   * close, and the subsequent mouse event occurs after focus is restored, then
   * the restored focus would be lost.
   */
  TOUCH_EVENT_WAIT_MS: 30,
};

/**
 * Enum for bits in the {@see Corner) bitmap.
 */
enum CornerBit {
  BOTTOM = 1,
  CENTER = 2,
  RIGHT = 4,
  FLIP_RTL = 8,
}

/**
 * Enum for representing an element corner for positioning the menu-surface.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 */
enum Corner {
  TOP_LEFT = 0,
  TOP_RIGHT = CornerBit.RIGHT,
  BOTTOM_LEFT = CornerBit.BOTTOM,
  BOTTOM_RIGHT = CornerBit.BOTTOM | CornerBit.RIGHT, // tslint:disable-line:no-bitwise
  TOP_START = CornerBit.FLIP_RTL,
  TOP_END = CornerBit.FLIP_RTL | CornerBit.RIGHT, // tslint:disable-line:no-bitwise
  BOTTOM_START = CornerBit.BOTTOM | CornerBit.FLIP_RTL, // tslint:disable-line:no-bitwise
  BOTTOM_END = CornerBit.BOTTOM | CornerBit.RIGHT | CornerBit.FLIP_RTL, // tslint:disable-line:no-bitwise
}

export {cssClasses, strings, numbers, CornerBit, Corner};
