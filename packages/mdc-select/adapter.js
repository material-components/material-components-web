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
/* eslint-disable no-unused-vars */
import {MDCSelectIconFoundation} from './icon/index';
import {MDCSelectHelperTextFoundation} from './helper-text/index';
/* eslint-enable no-unused-vars */

/**
 * @typedef {{
 *   leadingIcon: (!MDCSelectIconFoundation|undefined),
 *   helperText: (!MDCSelectHelperTextFoundation|undefined),
 * }}
 */
let FoundationMapType;

/**
 * Adapter for MDC Select. Provides an interface for managing
 * - classes
 * - dom
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

class MDCSelectAdapter {
  /**
   * Adds class to root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns true if the root element contains the given class name.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Activates the bottom line, showing a focused state.
   */
  activateBottomLine() {}

  /**
   * Deactivates the bottom line.
   */
  deactivateBottomLine() {}

  /**
   * Sets the value of the select.
   * @param {string} value
   */
  setValue(value) {}

  /**
   * Returns the selected value of the select element.
   * @return {string}
   */
  getValue() {}

  /**
   * Floats label determined based off of the shouldFloat argument.
   * @param {boolean} shouldFloat
   */
  floatLabel(shouldFloat) {}

  /**
   * Returns width of label in pixels, if the label exists.
   * @return {number}
   */
  getLabelWidth() {}

  /**
   * Returns true if outline element exists, false if it doesn't.
   * @return {boolean}
   */
  hasOutline() {}

  /**
   * Only implement if outline element exists.
   * @param {number} labelWidth
   */
  notchOutline(labelWidth) {}

  /**
   * Closes notch in outline element, if the outline exists.
   */
  closeOutline() {}

  /**
   * Opens the menu.
   */
  openMenu() {}

  /**
   * Closes the menu.
   */
  closeMenu() {}

  /**
   * Returns true if the menu is currently open.
   * @return {boolean}
   */
  isMenuOpen() {}

  /**
   * Sets the selected index of the select to the index provided.
   * @param {number} index
   */
  setSelectedIndex(index) {}

  /**
   * Sets the select to disabled.
   * @param {boolean} isDisabled
   */
  setDisabled(isDisabled) {}

  /**
   * Sets the line ripple transform origin center.
   * @param {number} normalizedX
   */
  setRippleCenter(normalizedX) {}

  /**
   * Emits a change event when an element is selected.
   * @param {string} value
   */
  notifyChange(value) {}

  /**
   * Checks if the select is currently valid.
   * @return {boolean} isValid
   */
  checkValidity() {}

  /**
   * Adds/Removes the invalid class.
   * @param {boolean} isValid
   */
  setValid(isValid) {}
}

export {MDCSelectAdapter, FoundationMapType};
