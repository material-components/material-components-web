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

export interface MDCSegmentedButtonSegmentAdapter {
  /**
   * @return Returns true if wrapping segmented button is single select
   */
  isSingleSelect(): boolean;

  /**
   * @param attrName Attribute of interest
   * @return Returns segment's attribute value if it is set, otherwise returns
   * null
   */
  getAttr(attrName: string): string|null;

  /**
   * Sets segment's attribute value to new value
   *
   * @param attrName Attribute of interest
   * @param value New value of attribute
   */
  setAttr(attrName: string, value: string): void;

  /**
   * Adds css class to segment
   *
   * @param className Class to add
   */
  addClass(className: string): void;

  /**
   * Removes css class from segment
   *
   * @param className Class to remove
   */
  removeClass(className: string): void;

  /**
   * @param className Class of interest
   * @return Returns true if segment has css class, otherwise returns false
   */
  hasClass(className: string): boolean;

  /**
   * Emits event about segment to wrapping segmented button
   *
   * @param selected Represents whether segment is currently selected
   * @event selected With detail - SegmentDetail
   */
  notifySelectedChange(selected: boolean): void;

  /**
   * @return Returns bounding rectangle for ripple effect
   */
  getRootBoundingClientRect(): ClientRect;
}
