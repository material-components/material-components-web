/**
 * @license
 * Copyright 2021 Google Inc.
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

import {CssClasses} from './constants';

/**
 * The state of the switch.
 */
export interface MDCSwitchState {
  /**
   * Indicates whether or not the switch is disabled.
   */
  disabled: boolean;
  /**
   * Indicates whether or not the switch is processing and showing a loading
   * indicator. A disabled switch cannot be processing.
   */
  processing: boolean;
  /**
   * If true, the switch is on. If false, the switch is off.
   */
  selected: boolean;
}

/**
 * Defines the shape of the adapter expected by the foundation.
 *
 * This adapter is used to delegate state-only updates from the foundation
 * to the component. It does not delegate DOM or rendering logic, such as adding
 * or removing classes.
 */
export interface MDCSwitchAdapter {
  /**
   * The state of the component.
   */
  state: MDCSwitchState;
}

/**
 * Defines the shape of the adapter expected by the rendering foundation.
 *
 * This adapter is used to delegate state and rendering logic updates from the
 * rendering foundation to the component.
 */
export interface MDCSwitchRenderAdapter extends MDCSwitchAdapter {
  /**
   * Adds a class to the root element.
   * @param className The class to add.
   */
  addClass(className: CssClasses): void;
  /**
   * Retrieves the `aria-checked` attribute of the root element.
   * @return the `aria-checked` value.
   */
  getAriaChecked(): string|null;
  /**
   * Returns whether or not the root element has a class.
   * @param className The class to check.
   * @return true if the root element has the class, or false if not.
   */
  hasClass(className: CssClasses): boolean;
  /**
   * Checks if the root element is disabled.
   * @return true if the root element is disabled, or false if not.
   */
  isDisabled(): boolean;
  /**
   * Removes a class from the root element.
   * @param className The class to remove.
   */
  removeClass(className: CssClasses): void;
  /**
   * Sets the `aria-checked` attribute of the root element.
   * @param ariaChecked The value of the attribute to set.
   */
  setAriaChecked(ariaChecked: string): void;
  /**
   * Disables or enables the root element.
   * @param disabled True to disable the root element, or false to enable.
   */
  setDisabled(disabled: boolean): void;
}
