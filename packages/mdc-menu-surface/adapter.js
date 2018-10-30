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

  /** Emits an event when the menu surface is closed. */
  notifyClose() {}

  /** Emits an event when the menu surface is opened. */
  notifyOpen() {}

  /**
   * @return {boolean}
   * @param {EventTarget} el
   */
  isElementInContainer(el) {}

  /** @return {boolean} */
  isRtl() {}

  /** @param {string} origin */
  setTransformOrigin(origin) {}

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

  /** @return {!{width: number, height: number}} */
  getInnerDimensions() {}

  /** @return {!{width: number, height: number, top: number, right: number, bottom: number, left: number}} */
  getAnchorDimensions() {}

  /** @return {!{ width: number, height: number }} */
  getWindowDimensions() {}

  /** @return {!{ width: number, height: number }} */
  getBodyDimensions() {}

  /** @return {!{ width: number, height: number }} */
  getWindowScroll() {}

  /** @param {!{
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
