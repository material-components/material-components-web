/**
 * @license
 * Copyright 2020 Google Inc.
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

import {CloseReason} from './constants';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCBannerAdapter {
  /**
   * Adds the given class to the banner root element.
   */
  addClass(className: string): void;

  /**
   * @return Returns the height of the banner content element.
   */
  getContentHeight(): number;

  /**
   * Broadcasts an event denoting that the banner has finished closing.
   */
  notifyClosed(reason: CloseReason): void;

  /**
   * Broadcasts an event denoting that the banner has just started closing.
   */
  notifyClosing(reason: CloseReason): void;

  /**
   * Broadcasts an event denoting that the banner has finished opening.
   */
  notifyOpened(): void;

  /**
   * Broadcasts an event denoting that the banner has just started opening.
   */
  notifyOpening(): void;

  /**
   * Removes the given class from the banner root element.
   */
  removeClass(className: string): void;

  /**
   * Sets a style property of the banner root element to the passed value.
   */
  setStyleProperty(propertyName: string, value: string): void;
}
