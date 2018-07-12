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

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDCMenuSurface. Provides an interface for managing
 * - classes
 * - dom
 * - focus
 * - position
 * - dimensions
 * - event handlers
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */
class MDCMenuSurfaceAdapter {
  /** @param {string} className */
  addClass(className) {}

  /** @param {string} className */
  removeClass(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasAnchor() {}

  /**
   * @param {string} type
   * @param {function(!Event)} handler
   */
  registerInteractionHandler(type, handler) {}

  /**
   * @param {string} type
   * @param {function(!Event)} handler
   */
  deregisterInteractionHandler(type, handler) {}

  /** @param {function(!Event)} handler */
  registerBodyClickHandler(handler) {}

  /** @param {function(!Event)} handler */
  deregisterBodyClickHandler(handler) {}

  /** Emits an event when the menu surface is closed. */
  notifyClose() {}

  /**
   * @return {boolean}
   * @param {EventTarget} el
   */
  isElementInContainer(el) {}

  /** @return {boolean} */
  isRtl() {}

  /** @param {string} origin */
  setTransformOrigin(origin) {}

  /** Focuses the menu surface. */
  focus() {}

  /** @return {boolean} */
  isFocused() {}

  /** Saves the element that was focused before the menu surface was opened. */
  saveFocus() {}

  /** Restores focus to the element that was focused before the menu surface was opened. */
  restoreFocus() {}

  /** @return {boolean} */
  isFirstElementFocused() {}

  /** @return {boolean} */
  isLastElementFocused() {}

  /** Focuses the first focusable element in the menu-surface. */
  focusFirstElement() {}

  /** Focuses the first focusable element in the menu-surface. */
  focusLastElement() {}

  /** @return {{width: number, height: number}} */
  getInnerDimensions() {}

  /** @return {{width: number, height: number, top: number, right: number, bottom: number, left: number}} */
  getAnchorDimensions() {}

  /** @return {{ width: number, height: number }} */
  getWindowDimensions() {}

  /** @return {{ width: number, height: number }} */
  getBodyDimensions() {}

  /** @return {{ width: number, height: number }} */
  getWindowScroll() {}

  /** @param {{
  *   top: (string|undefined),
  *   right: (string|undefined),
  *   bottom: (string|undefined),
  *   left: (string|undefined)
  * }} position */
  setPosition(position) {}

  /** @param {string} height */
  setMaxHeight(height) {}
}

export {MDCMenuSurfaceAdapter};
