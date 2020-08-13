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

import {MDCComponent} from '@material/base/component';
import {CustomEventListener} from '@material/base/types';
import {MDCSegmentedButtonSegment, MDCSegmentedButtonSegmentFactory} from '../segment/component';
import {SegmentDetail, MDCSegmentedButtonEvent} from '../types';
import {MDCSegmentedButtonAdapter} from './adapter';
import {MDCSegmentedButtonFoundation} from './foundation';
import {selectors, events} from './constants';

export class MDCSegmentedButton extends MDCComponent<MDCSegmentedButtonFoundation> {
  static attachTo(root: Element): MDCSegmentedButton {
    return new MDCSegmentedButton(root);
  }

  get segments(): ReadonlyArray<MDCSegmentedButtonSegment> {
    return this.segments_.slice();
  }

  private segments_!: MDCSegmentedButtonSegment[]; // assigned in initialize
  private segmentFactory!:
      (el: Element) => MDCSegmentedButtonSegment; // assigned in initialize
  private handleSelected!:
      CustomEventListener<MDCSegmentedButtonEvent>; // assigned in initialSyncWithDOM

  initialize(segmentFactory: MDCSegmentedButtonSegmentFactory = (el) => new MDCSegmentedButtonSegment(el)) {
    this.segmentFactory = segmentFactory;
    this.segments_ = this.instantiateSegments(this.segmentFactory);
  }

  /**
   * @param segmentFactory Factory to create new child segments
   * @return Returns list of child segments found in DOM
   */
  private instantiateSegments(segmentFactory: MDCSegmentedButtonSegmentFactory): MDCSegmentedButtonSegment[] {
    const segmentElements: Element[] =
        [].slice.call(this.root.querySelectorAll(selectors.SEGMENT));
    return segmentElements.map((el: Element) => segmentFactory(el));
  }

  initialSyncWithDOM() {
    this.handleSelected = (event) =>
        this.foundation.handleSelected(event.detail);
    this.listen(events.SELECTED, this.handleSelected);

    const isSingleSelect = this.foundation.isSingleSelect();
    this.segments_.forEach((segment, index: number) => {
      segment.setIndex(index);
      segment.setIsSingleSelect(isSingleSelect);
    });

    const selectedSegments = this.segments_.filter((segment) => segment.isSelected());
    for (let i = 1; i < selectedSegments.length; i++) {
      selectedSegments[i].setUnselected();
    }
    if (isSingleSelect && selectedSegments.length == 0 && this.segments_.length > 0) {
      this.segments_[0].setSelected();
    }
  }

  destroy() {
    this.segments_.forEach((segment) => {
      segment.destroy();
    });

    this.unlisten(events.SELECTED, this.handleSelected);

    super.destroy();
  }

  getDefaultFoundation(): MDCSegmentedButtonFoundation {
    const adapter: MDCSegmentedButtonAdapter = {
      hasClass: (className) => {
        return this.root.classList.contains(className);
      },
      getSegments: () => {
        return this.mappedSegments();
      },
      selectSegment: (indexOrSegmentId) => {
        const segmentDetail = this.mappedSegments().find((_segmentDetail) =>
          _segmentDetail.index === indexOrSegmentId
          || _segmentDetail.segmentId === indexOrSegmentId
        );
        if (segmentDetail) {
          this.segments_[segmentDetail.index].setSelected();
        }
      },
      unselectSegment: (indexOrSegmentId) => {
        const segmentDetail = this.mappedSegments().find((_segmentDetail) =>
          _segmentDetail.index === indexOrSegmentId
          || _segmentDetail.segmentId === indexOrSegmentId
        );
        if (segmentDetail) {
          this.segments_[segmentDetail.index].setUnselected();
        }
      },
      notifySelectedChange: (detail) => {
        this.emit<SegmentDetail>(
          events.CHANGE,
          detail,
          true /* shouldBubble */
        );
      }
    };
    return new MDCSegmentedButtonFoundation(adapter);
  }

  /**
   * @return Returns readonly list of selected child segments as SegmentDetails
   */
  getSelectedSegments(): readonly SegmentDetail[] {
    return this.foundation.getSelectedSegments();
  }

  /**
   * Sets identified segment to be selected
   * 
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  selectSegment(indexOrSegmentId: number | string) {
    this.foundation.selectSegment(indexOrSegmentId);
  }

  /**
   * Sets identified segment to be not selected
   * 
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  unselectSegment(indexOrSegmentId: number | string) {
    this.foundation.unselectSegment(indexOrSegmentId);
  }

  /**
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   * @return Returns true if identified child segment is currently selected,
   * otherwise returns false
   */
  isSegmentSelected(indexOrSegmentId: number | string): boolean {
    return this.foundation.isSegmentSelected(indexOrSegmentId);
  }

  /**
   * @return Returns child segments mapped to readonly SegmentDetail list
   */
  private mappedSegments(): readonly SegmentDetail[] {
    return this.segments_.map((segment: MDCSegmentedButtonSegment, index: number) => {
      return {
        index,
        selected: segment.isSelected(),
        segmentId: segment.getSegmentId()
      };
    });
  }
}
