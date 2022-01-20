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

import {MDCSegmentedButtonSegmentAdapter} from './adapter';
import {attributes, booleans, cssClasses} from './constants';

const emptyClientRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
} as any;

export class MDCSegmentedButtonSegmentFoundation extends
    MDCFoundation<MDCSegmentedButtonSegmentAdapter> {
  static override get defaultAdapter(): MDCSegmentedButtonSegmentAdapter {
    return {
      isSingleSelect: () => false, getAttr: () => '', setAttr: () => undefined,
                      addClass: () => undefined, removeClass: () => undefined,
                      hasClass: () => false,
                      notifySelectedChange: () => undefined,
                      getRootBoundingClientRect: () => emptyClientRect,
    }
  }

  constructor(adapter?: Partial<MDCSegmentedButtonSegmentAdapter>) {
    super({...MDCSegmentedButtonSegmentFoundation.defaultAdapter, ...adapter});
  }

  /**
   * @return Returns true if segment is currently selected, otherwise returns
   * false
   */
  isSelected(): boolean {
    return this.adapter.hasClass(cssClasses.SELECTED);
  }

  /**
   * Sets segment to be selected
   */
  setSelected() {
    this.adapter.addClass(cssClasses.SELECTED);
    this.setAriaAttr(booleans.TRUE);
  }

  /**
   * Sets segment to be not selected
   */
  setUnselected() {
    this.adapter.removeClass(cssClasses.SELECTED);
    this.setAriaAttr(booleans.FALSE);
  }

  /**
   * @return Returns segment's segmentId if it was set by client
   */
  getSegmentId(): string|undefined {
    return this.adapter.getAttr(attributes.DATA_SEGMENT_ID) ?? undefined;
  }

  /**
   * Called when segment is clicked. If the wrapping segmented button is single
   * select, doesn't allow segment to be set to not selected. Otherwise, toggles
   * segment's selected status. Finally, emits event to wrapping segmented
   * button.
   *
   * @event selected With detail - SegmentDetail
   */
  handleClick(): void {
    if (this.adapter.isSingleSelect()) {
      this.setSelected();
    } else {
      this.toggleSelection();
    }
    this.adapter.notifySelectedChange(this.isSelected());
  }

  /**
   * @return Returns bounding rectangle for ripple effect
   */
  getDimensions(): DOMRect {
    return this.adapter.getRootBoundingClientRect();
  }

  /**
   * Sets segment from not selected to selected, or selected to not selected
   */
  private toggleSelection() {
    if (this.isSelected()) {
      this.setUnselected();
    } else {
      this.setSelected();
    }
  }

  /**
   * Sets appropriate aria attribute, based on wrapping segmented button's
   * single selected value, to new value
   *
   * @param value Value that represents selected status
   */
  private setAriaAttr(value: string) {
    if (this.adapter.isSingleSelect()) {
      this.adapter.setAttr(attributes.ARIA_CHECKED, value);
    } else {
      this.adapter.setAttr(attributes.ARIA_PRESSED, value);
    }
  }
}
