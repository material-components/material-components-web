/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
  ANCHOR: 'mdc-menu-surface--anchor',
  ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
  ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
  FIXED: 'mdc-menu-surface--fixed',
  OPEN: 'mdc-menu-surface--open',
  ROOT: 'mdc-menu-surface',
};

/** @enum {string} */
const strings = {
  ARIA_DISABLED_ATTR: 'aria-disabled',
  CLOSE_EVENT: 'MDCMenuSurface:close',
  FOCUSABLE_ELEMENTS: 'button:not(:disabled), [href]:not([aria-disabled="true"]), input:not(:disabled), ' +
  'select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
};

/** @enum {number} */
const numbers = {
  // Amount of time to wait before triggering a selected event on the menu-surface. Note that this time
  // will most likely be bumped up once interactive lists are supported to allow for the ripple to
  // animate before closing the menu-surface
  SELECTED_TRIGGER_DELAY: 50,
  // Total duration of menu-surface open animation.
  TRANSITION_OPEN_DURATION: 120,
  // Total duration of menu-surface close animation.
  TRANSITION_CLOSE_DURATION: 75,
  // Margin left to the edge of the viewport when menu-surface is at maximum possible height.
  MARGIN_TO_EDGE: 32,
  // Ratio of anchor width to menu-surface width for switching from corner positioning to center positioning.
  ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,
  // Ratio of vertical offset to menu-surface height for switching from corner to mid-way origin positioning.
  OFFSET_TO_MENU_SURFACE_HEIGHT_RATIO: 0.1,
};

/**
 * Enum for bits in the {@see Corner) bitmap.
 * @enum {number}
 */
const MenuSurfaceCornerBit = {
  BOTTOM: 1,
  CENTER: 2,
  RIGHT: 4,
  FLIP_RTL: 8,
};

/**
 * Enum for representing an element corner for positioning the menu-surface.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 *
 * @enum {number}
 */
const MenuSurfaceCorner = {
  TOP_LEFT: 0,
  TOP_RIGHT: MenuSurfaceCornerBit.RIGHT,
  BOTTOM_LEFT: MenuSurfaceCornerBit.BOTTOM,
  BOTTOM_RIGHT: MenuSurfaceCornerBit.BOTTOM | MenuSurfaceCornerBit.RIGHT,
  TOP_START: MenuSurfaceCornerBit.FLIP_RTL,
  TOP_END: MenuSurfaceCornerBit.FLIP_RTL | MenuSurfaceCornerBit.RIGHT,
  BOTTOM_START: MenuSurfaceCornerBit.BOTTOM | MenuSurfaceCornerBit.FLIP_RTL,
  BOTTOM_END: MenuSurfaceCornerBit.BOTTOM | MenuSurfaceCornerBit.RIGHT | MenuSurfaceCornerBit.FLIP_RTL,
};


export {cssClasses, strings, numbers, MenuSurfaceCornerBit, MenuSurfaceCorner};
