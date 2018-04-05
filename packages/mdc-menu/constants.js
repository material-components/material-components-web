/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-menu',
  OPEN: 'mdc-menu--open',
  ANIMATING_OPEN: 'mdc-menu--animating-open',
  ANIMATING_CLOSED: 'mdc-menu--animating-closed',
  SELECTED_LIST_ITEM: 'mdc-list-item--selected',
};

/** @enum {string} */
const strings = {
  ITEMS_SELECTOR: '.mdc-menu__items',
  SELECTED_EVENT: 'MDCMenu:selected',
  CANCEL_EVENT: 'MDCMenu:cancel',
  ARIA_DISABLED_ATTR: 'aria-disabled',
};

/** @enum {number} */
const numbers = {
  // Amount of time to wait before triggering a selected event on the menu. Note that this time
  // will most likely be bumped up once interactive lists are supported to allow for the ripple to
  // animate before closing the menu
  SELECTED_TRIGGER_DELAY: 50,
  // Total duration of menu open animation.
  TRANSITION_OPEN_DURATION: 120,
  // Total duration of menu close animation.
  TRANSITION_CLOSE_DURATION: 75,
  // Margin left to the edge of the viewport when menu is at maximum possible height.
  MARGIN_TO_EDGE: 32,
  // Ratio of anchor width to menu width for switching from corner positioning to center positioning.
  ANCHOR_TO_MENU_WIDTH_RATIO: 0.67,
  // Ratio of vertical offset to menu height for switching from corner to mid-way origin positioning.
  OFFSET_TO_MENU_HEIGHT_RATIO: 0.1,
};

/**
 * Enum for bits in the {@see Corner) bitmap.
 * @enum {number}
 */
const CornerBit = {
  BOTTOM: 1,
  CENTER: 2,
  RIGHT: 4,
  FLIP_RTL: 8,
};

/**
 * Enum for representing an element corner for positioning the menu.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 *
 * @enum {number}
 */
const Corner = {
  TOP_LEFT: 0,
  TOP_RIGHT: CornerBit.RIGHT,
  BOTTOM_LEFT: CornerBit.BOTTOM,
  BOTTOM_RIGHT: CornerBit.BOTTOM | CornerBit.RIGHT,
  TOP_START: CornerBit.FLIP_RTL,
  TOP_END: CornerBit.FLIP_RTL | CornerBit.RIGHT,
  BOTTOM_START: CornerBit.BOTTOM | CornerBit.FLIP_RTL,
  BOTTOM_END: CornerBit.BOTTOM | CornerBit.RIGHT | CornerBit.FLIP_RTL,
};


export {cssClasses, strings, numbers, CornerBit, Corner};
