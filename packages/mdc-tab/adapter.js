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
 * MDCTabDimensions provides details about the left and right edges of the Tab
 * root element and the Tab content element. These values are used to determine
 * the visual position of the Tab with respect it's parent container.
 * @typedef {{rootLeft: number, rootRight: number, contentLeft: number, contentRight: number}}
 */
let MDCTabDimensions;

/**
 * Adapter for MDC Tab.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Tab  into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTabAdapter {
  /**
   * Adds the given className to the root element.
   * @param {string} className The className to add
   */
  addClass(className) {}

  /**
   * Removes the given className from the root element.
   * @param {string} className The className to remove
   */
  removeClass(className) {}

  /**
   * Returns whether the root element has the given className.
   * @param {string} className The className to remove
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Sets the given attrName of the root element to the given value.
   * @param {string} attr The attribute name to set
   * @param {string} value The value so give the attribute
   */
  setAttr(attr, value) {}

  /**
   * Activates the indicator element.
   * @param {!ClientRect=} previousIndicatorClientRect The client rect of the previously activated indicator
   */
  activateIndicator(previousIndicatorClientRect) {}

  /** Deactivates the indicator. */
  deactivateIndicator() {}

  /**
   * Emits the MDCTab:interacted event for use by parent components
   */
  notifyInteracted() {}

  /**
   * Returns the offsetLeft value of the root element.
   * @return {number}
   */
  getOffsetLeft() {}

  /**
   * Returns the offsetWidth value of the root element.
   * @return {number}
   */
  getOffsetWidth() {}

  /**
   * Returns the offsetLeft of the content element.
   * @return {number}
   */
  getContentOffsetLeft() {}

  /**
   * Returns the offsetWidth of the content element.
   * @return {number}
   */
  getContentOffsetWidth() {}

  /**
   * Applies focus to the root element
   */
  focus() {}
}

export {MDCTabDimensions, MDCTabAdapter};
