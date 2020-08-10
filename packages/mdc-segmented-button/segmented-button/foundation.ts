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

import {MDCFoundation} from '@material/base/foundation';
import {SegmentDetail} from '../types';
import {MDCSegmentedButtonAdapter} from './adapter';
import {cssClasses} from './constants';

export class MDCSegmentedButtonFoundation extends MDCFoundation<MDCSegmentedButtonAdapter> {

  /**
   * Sets identified child segment to be selected
   * 
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  selectSegment(indexOrSegmentId: number | string) {
    this.adapter.selectSegment(indexOrSegmentId);
  }

  /**
   * Sets identified child segment to be not selected
   * 
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  unselectSegment(indexOrSegmentId: number | string) {
    this.adapter.unselectSegment(indexOrSegmentId);
  }

  /**
   * @return Returns currently selected child segments as readonly list of
   * SegmentDetails
   */
  getSelectedSegments(): readonly SegmentDetail[] {
    return this.adapter.getSegments().filter(segmentDetail => segmentDetail.selected);
  }

  /**
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   * @return Returns true if identified child segment is currently selected,
   * otherwise returns false
   */
  isSegmentSelected(indexOrSegmentId: number | string): boolean {
    return this.adapter.getSegments().some(segmentDetail => (segmentDetail.index === indexOrSegmentId || segmentDetail.segmentId === indexOrSegmentId) && segmentDetail.selected);
  }

  /**
   * @return Returns true if segmented button is single select, otherwise
   * returns false
   */
  isSingleSelect(): boolean {
    return this.adapter.hasClass(cssClasses.SINGLE_SELECT);
  }

  /**
   * Called when child segment's selected status may have changed. If segmented
   * button is single select, unselects all child segments other than identified
   * child segment. Finally, emits event to client.
   * 
   * @param detail Child segment affected represented as SegmentDetail
   * @event change With detail - SegmentDetail
   */
  handleSelected(detail: SegmentDetail) {
    if (this.isSingleSelect()) {
      this.unselectPrevSelected(detail.index);
    }
    this.adapter.notifySelectedChange(detail);
  }

  /**
   * Sets all child segments to be not selected except for child segment
   * identified by index
   * 
   * @param index Index of child segment to not unselect
   */
  private unselectPrevSelected(index: number) {
    for (let selectedSegment of this.getSelectedSegments()) {
      if (selectedSegment.index !== index) {
        this.unselectSegment(selectedSegment.index);
      }
    }
  }
}
