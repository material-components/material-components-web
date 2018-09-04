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
 * Adapter for MDC Top App Bar
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Top App Bar into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTopAppBarAdapter {
  /**
   * Adds a class to the root Element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root Element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns true if the root Element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Sets the specified inline style property on the root Element to the given value.
   * @param {string} property
   * @param {string} value
   */
  setStyle(property, value) {}

  /**
   * Gets the height of the top app bar.
   * @return {number}
   */
  getTopAppBarHeight() {}

  /**
   * Registers an event handler on the navigation icon element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerNavigationIconInteractionHandler(type, handler) {}

  /**
   * Deregisters an event handler on the navigation icon element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterNavigationIconInteractionHandler(type, handler) {}

  /**
   * Emits an event when the navigation icon is clicked.
   */
  notifyNavigationIconClicked() {}

  /** @param {function(!Event)} handler */
  registerScrollHandler(handler) {}

  /** @param {function(!Event)} handler */
  deregisterScrollHandler(handler) {}

  /** @param {function(!Event)} handler */
  registerResizeHandler(handler) {}

  /** @param {function(!Event)} handler */
  deregisterResizeHandler(handler) {}

  /** @return {number} */
  getViewportScrollY() {}

  /** @return {number} */
  getTotalActionItems() {}
}

export default MDCTopAppBarAdapter;
