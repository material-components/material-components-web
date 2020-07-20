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
import {strings} from './constants';

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

  private instantiateSegments(segmentFactory: MDCSegmentedButtonSegmentFactory): MDCSegmentedButtonSegment[] {
    const segmentElements: Element[] =
        [].slice.call(this.root.querySelectorAll(strings.SEGMENT_SELECTOR));
    return segmentElements.map((el: Element) => segmentFactory(el));
  }

  initialSyncWithDOM() {
    this.handleSelected = (event) =>
        this.foundation.handleSelected(event.detail);
    this.listen(strings.SELECTED_EVENT, this.handleSelected);

    // foundation is undefined in #instantiateSegments
    const isSingleSelect = this.foundation.isSingleSelect();
    this.segments_.forEach((segment, index: number) => {
      segment.setIndex(index);
      segment.setIsSingleSelect(isSingleSelect);
    });
  }

  destroy() {
    this.segments_.forEach((segment) => {
      segment.destroy();
    });

    this.unlisten(strings.SELECTED_EVENT, this.handleSelected);

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
          strings.CHANGE_EVENT,
          detail,
          true /* shouldBubble */
        );
      }
    };
    return new MDCSegmentedButtonFoundation(adapter);
  }

  getSelectedSegments(): readonly SegmentDetail[] {
    return this.foundation.getSelectedSegments();
  }

  selectSegment(indexOrSegmentId: number | string) {
    this.foundation.selectSegment(indexOrSegmentId);
  }

  unselectSegment(indexOrSegmentId: number | string) {
    this.foundation.unselectSegment(indexOrSegmentId);
  }

  isSegmentSelected(indexOrSegmentId: number | string): boolean {
    return this.foundation.isSegmentSelected(indexOrSegmentId);
  }

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
