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

import {MDCIconButtonToggleEventDetail} from './types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCIconButtonToggleAdapter {
  /**
   * Adds a class to the root element.
   * @param className class name to add to the root element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root element.
   * @param className class name to remove from the root element.
   */
  removeClass(className: string): void;

  /**
   * Determines whether the root element has the given CSS class name.
   * @param className
   */
  hasClass(className: string): boolean;

  /**
   * Sets the attribute `name` to `value` on the root element.
   * @param attrName DOM node attribute to set value.
   * @param attrValue value of the attribute to be set.
   */
  setAttr(attrName: string, attrValue: string): void;

  /**
   * Broadcasts a change notification, passing along the `evtData` to
   * the environment's event handling system. In our vanilla
   * implementation, Custom Events are used for this.
   * @param evtData {isOn: boolean}
   */
  notifyChange(evtData: MDCIconButtonToggleEventDetail): void;
}
