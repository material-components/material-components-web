/**
 * @license
 * Copyright 2016 Google Inc.
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
export interface MDCCheckboxAdapter {
  /**
   * Adds a class to the root element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root element.
   */
  forceLayout(): void;

  /**
   * Force-trigger a layout on the root element. This is needed to
   * restart animations correctly. If you find that you do not need to do this, you can
   * simply make it a no-op.
   */
  hasNativeControl(): boolean;

  /**
   * Returns true if the component is currently attached to the DOM, false otherwise.
   */
  isAttachedToDOM(): boolean;

  /**
   * Returns true if the component is in the indeterminate state.
   */
  isChecked(): boolean;

  /**
   * Returns true if the component is checked.
   */
  isIndeterminate(): boolean;

  /**
   * Returns true if the input is present in the component.
   */
  removeClass(className: string): void;

  /**
   * Sets the input to disabled.
   */
  removeNativeControlAttr(attr: string): void;

  /**
   * Sets an HTML attribute to the given value on the native input element.
   */
  setNativeControlAttr(attr: string, value: string): void;

  /**
   * Removes an attribute from the native input element.
   */
  setNativeControlDisabled(disabled: boolean): void;
}
