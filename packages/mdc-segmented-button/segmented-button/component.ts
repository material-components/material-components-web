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
import {MDCSegmentedButtonEvent, SegmentDetail} from '../types';

import {MDCSegmentedButtonAdapter} from './adapter';
import {events, selectors} from './constants';
import {MDCSegmentedButtonFoundation} from './foundation';

export class MDCSegmentedButton extends
    MDCComponent<MDCSegmentedButtonFoundation> {
  static override attachTo(root: Element): MDCSegmentedButton {
    return new MDCSegmentedButton(root);
  }

  get segments(): ReadonlyArray<MDCSegmentedButtonSegment> {
    return this.segmentsList.slice();
  }

  private segmentsList!: MDCSegmentedButtonSegment[];  // assigned in initialize
  private segmentFactory!:
      (el: Element) => MDCSegmentedButtonSegment;  // assigned in initialize
  private handleSelected!:
      CustomEventListener<MDCSegmentedButtonEvent>;  // assigned in
                                                     // initialSyncWithDOM

  override initialize(
      segmentFactory: MDCSegmentedButtonSegmentFactory = (el) =>
          new MDCSegmentedButtonSegment(el)) {
    this.segmentFactory = segmentFactory;
    this.segmentsList = this.instantiateSegments(this.segmentFactory);
  }

  /**
   * @param segmentFactory Factory to create new child segments
   * @return Returns list of child segments found in DOM
   */
  private instantiateSegments(segmentFactory: MDCSegmentedButtonSegmentFactory):
      MDCSegmentedButtonSegment[] {
    const segmentElements: Element[] =
        [].slice.call(this.root.querySelectorAll(selectors.SEGMENT));
    return segmentElements.map((el: Element) => segmentFactory(el));
  }

  override initialSyncWithDOM() {
    this.handleSelected = (event) => {
      this.foundation.handleSelected(event.detail);
    };
    this.listen(events.SELECTED, this.handleSelected);

    const isSingleSelect = this.foundation.isSingleSelect();
    for (let i = 0; i < this.segmentsList.length; i++) {
      const segment = this.segmentsList[i];
      segment.setIndex(i);
      segment.setIsSingleSelect(isSingleSelect);
    }

    const selectedSegments =
        this.segmentsList.filter((segment) => segment.isSelected());
    if (isSingleSelect && selectedSegments.length === 0 &&
        this.segmentsList.length > 0) {
      throw new Error(
          'No segment selected in singleSelect mdc-segmented-button');
    } else if (isSingleSelect && selectedSegments.length > 1) {
      throw new Error(
          'Multiple segments selected in singleSelect mdc-segmented-button');
    }
  }

  override destroy() {
    for (const segment of this.segmentsList) {
      segment.destroy();
    }

    this.unlisten(events.SELECTED, this.handleSelected);

    super.destroy();
  }

  override getDefaultFoundation(): MDCSegmentedButtonFoundation {
    const adapter: MDCSegmentedButtonAdapter = {
      hasClass: (className) => {
        return this.root.classList.contains(className);
      },
      getSegments: () => {
        return this.mappedSegments();
      },
      selectSegment: (indexOrSegmentId) => {
        const segmentDetail = this.mappedSegments().find(
            (detail) => detail.index === indexOrSegmentId ||
                detail.segmentId === indexOrSegmentId);
        if (segmentDetail) {
          this.segmentsList[segmentDetail.index].setSelected();
        }
      },
      unselectSegment: (indexOrSegmentId) => {
        const segmentDetail = this.mappedSegments().find(
            (detail) => detail.index === indexOrSegmentId ||
                detail.segmentId === indexOrSegmentId);
        if (segmentDetail) {
          this.segmentsList[segmentDetail.index].setUnselected();
        }
      },
      notifySelectedChange: (detail) => {
        this.emit<SegmentDetail>(
            events.CHANGE, detail, true /* shouldBubble */
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
  selectSegment(indexOrSegmentId: number|string) {
    this.foundation.selectSegment(indexOrSegmentId);
  }

  /**
   * Sets identified segment to be not selected
   *
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   */
  unselectSegment(indexOrSegmentId: number|string) {
    this.foundation.unselectSegment(indexOrSegmentId);
  }

  /**
   * @param indexOrSegmentId Number index or string segmentId that identifies
   * child segment
   * @return Returns true if identified child segment is currently selected,
   * otherwise returns false
   */
  isSegmentSelected(indexOrSegmentId: number|string): boolean {
    return this.foundation.isSegmentSelected(indexOrSegmentId);
  }

  /**
   * @return Returns child segments mapped to readonly SegmentDetail list
   */
  private mappedSegments(): readonly SegmentDetail[] {
    return this.segmentsList.map(
        (segment: MDCSegmentedButtonSegment, index: number) => {
          return {
            index,
            selected: segment.isSelected(),
            segmentId: segment.getSegmentId()
          };
        });
  }
}
