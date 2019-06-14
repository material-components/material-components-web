/**
 * @license
 * Copyright 2017 Google Inc.
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

import { MDCChipNavigationFocus } from "../chip/types";

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCChipSetAdapter {
  /**
   * @return true if the root element contains the given class name.
   */
  hasClass(className: string): boolean;

  /**
   * Removes the chip with the given id from the chip set.
   */
  removeChip(chipId: string): void;

  /**
   * Sets the selected state of the chip with the given id.
   */
  setSelected(chipId: string, selected: boolean): void;

  /**
   * @return the numerical index of the chip with the matching id or -1.
   */
  getIndexOfChipById(chipId: string): number;

  /**
   * Gives focus to the chip at the given index with the given key.
   */
  focusChipAtIndex(index: number, key: string, source: MDCChipNavigationFocus): void;

  /**
   * @return true if the text direction is RTL.
   */
  isRTL(): boolean;

  /**
   * @return the number of chips in the chip set.
   */
  getChipListCount(): number;
}
