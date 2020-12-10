/**
 * @license
 * Copyright 2019 Google Inc.
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

export interface MDCLinearProgressAdapter {
  addClass(className: string): void;
  /**
   * If available, creates a `ResizeObserver` object, invokes the `#observe`
   * method on the root element. This is used for an optional performance gains
   * for the indeterminate animation on modern browsers.
   *
   * @param callback The callback to apply to the constructor of the
   *    `ResizeObserver`
   * @return Returns a `ResizeObserver` that has had `observe` called on the
   *    root element with the given callback. `null` if `ResizeObserver` is not
   *    implemented or polyfilled.
   */
  attachResizeObserver(callback: ResizeObserverCallback): ResizeObserver|null;
  forceLayout(): void;
  setBufferBarStyle(styleProperty: string, value: string): void;
  setPrimaryBarStyle(styleProperty: string, value: string): void;
  /**
   * Sets the inline style on the root element.
   * @param styleProperty The style property to set.
   * @param value The value the style property should be set to.
   */
  setStyle(styleProperty: string, value: string): void;
  /**
   * @return The width of the root element.
   */
  getWidth(): number;
  hasClass(className: string): boolean;
  removeClass(className: string): void;
  removeAttribute(name: string): void;
  setAttribute(name: string, value: string): void;
}
