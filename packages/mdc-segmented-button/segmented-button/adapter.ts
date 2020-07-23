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

import {SegmentDetail} from '../types';

export interface MDCSegmentedButtonAdapter {
  /**
   * @param className Class of interest
   * @return Returns true if segmented button has css class, otherwise returns
   * false
   */
  hasClass(className: string): boolean;

  /**
   * @return Returns child segments represented as readonly list of
   * SegmentDetails
   */
  getSegments(): readonly SegmentDetail[];

  /**
   * Sets identified child segment to be selected
   * 
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  selectSegment(indexOrSegmentId: number | string): void;

  /**
   * Sets identified child segment to be not selected
   * 
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  unselectSegment(indexOrSegmentId: number | string): void;

  /**
   * Emits event about changed child segment to client
   * 
   * @param detail Changed child segment represented as a SegmentDetail
   */
  notifySelectedChange(detail: SegmentDetail): void;
}
