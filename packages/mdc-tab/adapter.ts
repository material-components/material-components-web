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
export interface MDCTabAdapter {
  /**
   * Adds the given className to the root element.
   * @param className The className to add
   */
  addClass(className: string): void;

  /**
   * Removes the given className from the root element.
   * @param className The className to remove
   */
  removeClass(className: string): void;

  /**
   * Returns whether the root element has the given className.
   * @param className The className to remove
   */
  hasClass(className: string): boolean;

  /**
   * Sets the given attrName of the root element to the given value.
   * @param attr The attribute name to set
   * @param value The value so give the attribute
   */
  setAttr(attr: string, value: string): void;

  /**
   * Activates the indicator element.
   * @param previousIndicatorClientRect The client rect of the previously
   *     activated indicator
   */
  activateIndicator(previousIndicatorClientRect?: DOMRect): void;

  /** Deactivates the indicator. */
  deactivateIndicator(): void;

  /**
   * Emits the MDCTab:interacted event for use by parent components
   */
  notifyInteracted(): void;

  /**
   * Returns the offsetLeft value of the root element.
   */
  getOffsetLeft(): number;

  /**
   * Returns the offsetWidth value of the root element.
   */
  getOffsetWidth(): number;

  /**
   * Returns the offsetLeft of the content element.
   */
  getContentOffsetLeft(): number;

  /**
   * Returns the offsetWidth of the content element.
   */
  getContentOffsetWidth(): number;

  /**
   * Applies focus to the root element
   */
  focus(): void;
}
