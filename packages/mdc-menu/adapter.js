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
 * Adapter for MDC Menu. Provides an interface for managing
 * - selected element classes
 * - get focused elements
 * - toggling a checkbox inside a list item
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
class MDCMenuAdapter {
  /**
   * Adds a class to the element at the index provided.
   * @param {number} index
   * @param {string} className
   */
  addClassToElementAtIndex(index, className) {}

  /**
   * Removes a class from the element at the index provided
   * @param {number} index
   * @param {string} className
   */
  removeClassFromElementAtIndex(index, className) {}

  /**
   * Adds an attribute, with value, to the element at the index provided.
   * @param {number} index
   * @param {string} attr
   * @param {string} value
   */
  addAttributeToElementAtIndex(index, attr, value) {}

  /**
   * Removes an attribute from an element at the index provided.
   * @param {number} index
   * @param {string} attr
   */
  removeAttributeFromElementAtIndex(index, attr) {}

  /**
   * Returns true if the element contains the className.
   * @param {?HTMLElement} element
   * @param {string} className
   * @return {boolean} true if the element contains the className
   */
  elementContainsClass(element, className) {}

  /**
   * Closes the menu-surface.
   */
  closeSurface() {}

  /**
   * Returns the index for the element provided.
   * @param {?HTMLElement} element
   * @return {number} index of the element in the list or -1 if it is not in the list.
   */
  getElementIndex(element) {}

  /**
   * Returns the parentElement of the provided element.
   * @param {?HTMLElement} element
   * @return {?HTMLElement} parentElement of the element provided.
   */
  getParentElement(element) {}

  /**
   * Returns the element within the selectionGroup containing the selected element class.
   * @param {!HTMLElement} selectionGroup
   * @return {number} element within the selectionGroup that contains the selected element class.
   */
  getSelectedElementIndex(selectionGroup) {}

  /**
   * Emits an event using the evtData.
   * @param {{
 *    index: number
 *   }} evtData
   */
  notifySelected(evtData) {}
}

export {MDCMenuAdapter};
