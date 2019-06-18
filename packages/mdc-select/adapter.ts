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
   * Adds class to select anchor element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the select anchor element.
   */
  removeClass(className: string): void;

  /**
   * Returns true if the select anchor element contains the given class name.
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
   * Returns the selected value of the select element.
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
   * Only implement if outline element exists.
   */
  notchOutline(labelWidth: number): void;

  /**
   * Closes notch in outline element, if the outline exists.
   */
  closeOutline(): void;

  /**
   * Sets the select to disabled.
   */
  setDisabled(isDisabled: boolean): void;

  /**
   * Sets the line ripple transform origin center.
   */
  setRippleCenter(normalizedX: number): void;

  /**
   * Emits a change event when an element is selected.
   */
  notifyChange(value: string): void;

  /**
   * Checks if the select is currently valid.
   */
  checkValidity(): boolean;

  /**
   * Adds/Removes the invalid class.
   */
  setValid(isValid: boolean): void;

  /**
   * Sets the text content of the selectedText element to the given string.
   */
  setSelectedText(text: string): void;

  // Menu-related methods ======================================================
  /**
   * Opens the menu.
   */
  openMenu(): void;

  /**
   * Closes the menu.
   */
  closeMenu(): void;

  /**
   * Returns true if the menu is currently open.
   */
  isMenuOpen(): boolean;

  /**
   * Sets the attribute on the menu item at the given index.
   */
  setAttributeAtIndex(index: number, attributeName: string, attributeValue: string): void;

  /**
   * Removes the attribute on the menu item at the given index.
   */
  removeAttributeAtIndex(index: number, attributeName: string): void;

  /**
   * Returns an array representing the VALUE_ATTR attributes of each menu item.
   */
  getMenuItemValues(): string[];

  /**
   * Gets the text content of the menu item element at the given index.
   */
  getMenuItemTextAtIndex(index: number): string;

  /**
   * Toggles the class name on the menu item at the given index.
   */
  toggleClassAtIndex(index: number, className: string, toggle: boolean): void;
}
