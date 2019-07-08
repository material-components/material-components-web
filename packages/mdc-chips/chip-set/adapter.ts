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
   * Removes the chip with the given index from the chip set.
   * Make sure to remove it from the chip list, too.
   */
  removeChipAtIndex(index: number): void;

  /**
   * Sets the selected state of the chip at the given index.
   */
  selectChipAtIndex(index: number, selected: boolean, shouldNotify: boolean): void;

  /**
   * Returns the index of the chip at the given ID.
   * @param chipId the unique ID of the chip
   * @return the numerical index of the chip with the matching id or -1.
   */
  getIndexOfChipById(chipId: string): number;

  /**
   * Calls Chip#focusPrimaryAction() on the chip at the given index.
   * @param index the index of the chip
   */
  focusChipPrimaryActionAtIndex(index: number): void;

  /**
   * Calls Chip#focusTrailingAction() on the chip at the given index.
   * @param index the index of the chip
   */
  focusChipTrailingActionAtIndex(index: number): void;

  /**
   * Removes focus from the chip at the given index.
   * @param index the index of the chip
   */
  removeFocusFromChipAtIndex(index: number): void;

  /**
   * @return true if the text direction is RTL.
   */
  isRTL(): boolean;

  /**
   * @return the number of chips in the chip set.
   */
  getChipListCount(): number;
}
