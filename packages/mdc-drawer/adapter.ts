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
export interface MDCDrawerAdapter {
  /**
   * Adds a class to the root Element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root Element.
   */
  removeClass(className: string): void;

  /**
   * Returns true if the root Element contains the given class.
   */
  hasClass(className: string): boolean;

  /**
   * Returns true if the an element contains the given class.
   * @param element target element to verify class name
   * @param className class name
   */
  elementHasClass(element: Element, className: string): boolean;

  /**
   * Saves the focus of currently active element.
   */
  saveFocus(): void;

  /**
   * Restores focus to element previously saved with 'saveFocus'.
   */
  restoreFocus(): void;

  /**
   * Focuses the active / selected navigation item.
   */
  focusActiveNavigationItem(): void;

  /**
   * Emits a custom event "MDCDrawer:closed" denoting the drawer has closed.
   */
  notifyClose(): void;

  /**
   * Emits a custom event "MDCDrawer:opened" denoting the drawer has opened.
   */
  notifyOpen(): void;

  /**
   * Traps focus on root element and focuses the active navigation element.
   */
  trapFocus(): void;

  /**
   * Releases focus trap from root element which was set by `trapFocus`
   * and restores focus to where it was prior to calling `trapFocus`.
   */
  releaseFocus(): void;
}
