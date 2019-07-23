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

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCSelectAdapter {
  /**
   * Adds class to root element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root element.
   */
  removeClass(className: string): void;

  /**
   * Returns true if the root element contains the given class name.
   */
  hasClass(className: string): boolean;

  /**
   * Activates the bottom line, showing a focused state.
   */
  activateBottomLine(): void;

  /**
   * Deactivates the bottom line.
   */
  deactivateBottomLine(): void;

  /**
   * Sets the value of the select or text content of the selected-text element.
   */
  setValue(value: string): void;

  /**
   * Returns the value selected `option` on the `select` element and
   * the `data-value` of the selected list item on the enhanced select.
   */
  getValue(): string;

  /**
   * Floats label determined based off of the shouldFloat argument.
   */
  floatLabel(shouldFloat: boolean): void;

  /**
   * Returns width of label in pixels, if the label exists.
   */
  getLabelWidth(): number;

  /**
   * Returns true if outline element exists, false if it doesn't.
   */
  hasOutline(): boolean;

  /**
   * Switches the notched outline element to its "notched state". Only implement if outline element exists.
   */
  notchOutline(labelWidth: number): void;

  /**
   * Closes notch in outline element, if the outline exists.
   */
  closeOutline(): void;

  /**
   * Causes the menu element in the enhanced select to open.
   */
  openMenu(): void;

  /**
   * Causes the menu element in the enhanced select to close.
   */
  closeMenu(): void;

  /**
   * Returns true if the menu is currently opened in the enhanced select.
   */
  isMenuOpen(): boolean;

  /**
   * Selects the option or list item at the specified index.
   */
  setSelectedIndex(index: number): void;

  /**
   * Enables or disables the native or enhanced select.
   */
  setDisabled(isDisabled: boolean): void;

  /**
   * Sets the line ripple center to the provided normalizedX value.
   */
  setRippleCenter(normalizedX: number): void;

  /**
   * Emits the `MDCSelect:change` event when an element is selected.
   */
  notifyChange(value: string): void;

  /**
   * Returns whether the component is currently valid, using the
   * native select's `checkValidity` or equivalent logic for the enhanced select.
   */
  checkValidity(): boolean;

  /**
   * Adds/Removes the invalid class.
   */
  setValid(isValid: boolean): void;
}
