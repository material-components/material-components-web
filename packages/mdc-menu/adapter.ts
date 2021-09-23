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

import {MDCMenuItemEventDetail} from './types';

/**
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCMenuAdapter {
  /**
   * Adds a class to the element at the index provided.
   */
  addClassToElementAtIndex(index: number, className: string): void;

  /**
   * Removes a class from the element at the index provided
   */
  removeClassFromElementAtIndex(index: number, className: string): void;

  /**
   * Adds an attribute, with value, to the element at the index provided.
   */
  addAttributeToElementAtIndex(index: number, attr: string, value: string): void;

  /**
   * Removes an attribute from an element at the index provided.
   */
  removeAttributeFromElementAtIndex(index: number, attr: string): void;

  /**
   * @return the attribute string if present on an element at the index
   * provided, null otherwise.
   */
  getAttributeFromElementAtIndex(index: number, attr: string): string|null;

  /**
   * @return true if the element contains the className.
   */
  elementContainsClass(element: Element, className: string): boolean;

  /**
   * Closes the menu-surface.
   * @param skipRestoreFocus Whether to skip restoring focus to the previously
   *    focused element after the surface has been closed.
   */
  closeSurface(skipRestoreFocus?: boolean): void;

  /**
   * @return Index of the element in the list or -1 if it is not in the list.
   */
  getElementIndex(element: Element): number;

  /**
   * Emit an event when a menu item is selected.
   */
  notifySelected(evtData: MDCMenuItemEventDetail): void;

  /** @return Returns the menu item count. */
  getMenuItemCount(): number;

  /**
   * Focuses the menu item at given index.
   * @param index Index of the menu item that will be focused every time the menu opens.
   */
  focusItemAtIndex(index: number): void;

  /** Focuses the list root element. */
  focusListRoot(): void;

  /**
   * @return Returns selected list item index within the same selection group which is
   * a sibling of item at given `index`.
   * @param index Index of the menu item with possible selected sibling.
   */
  getSelectedSiblingOfItemAtIndex(index: number): number;

  /**
   * @return Returns true if item at specified index is contained within an `.mdc-menu__selection-group` element.
   * @param index Index of the selectable menu item.
   */
  isSelectableItemAtIndex(index: number): boolean;
}
