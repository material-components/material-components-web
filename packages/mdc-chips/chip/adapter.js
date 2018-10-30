/**
 * @license
 * Copyright 2017 Google Inc.
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
 * Adapter for MDC Chip.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Chip into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCChipAdapter {
  /**
   * Adds a class to the root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns true if the root element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Adds a class to the leading icon element.
   * @param {string} className
   */
  addClassToLeadingIcon(className) {}

  /**
   * Removes a class from the leading icon element.
   * @param {string} className
   */
  removeClassFromLeadingIcon(className) {}

  /**
   * Returns true if target has className, false otherwise.
   * @param {!EventTarget} target
   * @param {string} className
   * @return {boolean}
   */
  eventTargetHasClass(target, className) {}

  /**
   * Emits a custom "MDCChip:interaction" event denoting the chip has been
   * interacted with (typically on click or keydown).
   */
  notifyInteraction() {}

  /**
   * Emits a custom "MDCChip:selection" event denoting the chip has been selected or deselected.
   * @param {boolean} selected
   */
  notifySelection(selected) {}

  /**
   * Emits a custom "MDCChip:trailingIconInteraction" event denoting the trailing icon has been
   * interacted with (typically on click or keydown).
   */
  notifyTrailingIconInteraction() {}

  /**
   * Emits a custom event "MDCChip:removal" denoting the chip will be removed.
   */
  notifyRemoval() {}

  /**
   * Returns the computed property value of the given style property on the root element.
   * @param {string} propertyName
   * @return {string}
   */
  getComputedStyleValue(propertyName) {}

  /**
   * Sets the property value of the given style property on the root element.
   * @param {string} propertyName
   * @param {string} value
   */
  setStyleProperty(propertyName, value) {}
}

export default MDCChipAdapter;
