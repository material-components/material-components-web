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

import {MDCMenuDimensions, MDCMenuDistance, MDCMenuPoint} from './types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCMenuSurfaceAdapter {
  /**
   * Adds a class to the root element.
   * @param className
   */
  addClass(className: string): void;
  /**
   * Removes a class from the root element.
   * @param className
   */
  removeClass(className: string): void;
  /**
   * Returns a boolean indicating whether the root element has a given class.
   * @param className
   */
  hasClass(className: string): boolean;
  /**
   * Returns whether the menu surface has an anchor for positioning.
   */
  hasAnchor(): boolean;

  /**
   * Returns true if the `el` Element is inside the `mdc-menu-surface` container.
   * @param el
   */
  isElementInContainer(el: Element): boolean;
  /**
   * Returns a boolean value indicating whether the root element of the menu surface is focused.
   */
  isFocused(): boolean;
  /**
   * Returns boolean indicating whether the current environment is RTL.
   */
  isRtl(): boolean;

  /**
   * Returns an object with the items container width and height.
   */
  getInnerDimensions(): MDCMenuDimensions;
  /**
   * Returns an object with the dimensions and position of the anchor.
   */
  getAnchorDimensions(): ClientRect | null;
  /**
   * Returns an object with width and height of the viewport, in pixels.
   */
  getWindowDimensions(): MDCMenuDimensions;
  /**
   * Returns an object with width and height of the body, in pixels.
   */
  getBodyDimensions(): MDCMenuDimensions;
  /**
   * Returns an object with the amount the body has been scrolled on the `x` and `y` axis.
   */
  getWindowScroll(): MDCMenuPoint;
  /**
   * Sets the position of the menu surface element.
   * @param position
   */
  setPosition(position: Partial<MDCMenuDistance>): void;
  /**
   * Sets `max-height` style for the menu surface element.
   * @param height
   */
  setMaxHeight(height: string): void;
  /**
   * Sets the transform origin for the menu surface element.
   */
  setTransformOrigin(origin: string): void;

  /** Stores the currently focused element on the document, for restoring with `restoreFocus`. */
  saveFocus(): void;

  /** Restores the previously saved focus state, by making the previously focused element the active focus again. */
  restoreFocus(): void;

  /** Dispatches an event notifying listeners that the menu surface has been closed. */
  notifyClose(): void;

  /** Dispatches an event notifying listeners that the menu surface has been opened. */
  notifyOpen(): void;
}
