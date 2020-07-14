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

import {MDCComponent} from '../../mdc-base/component';
import {SpecificEventListener} from '../../mdc-base/types';
// TODO: use this to allow ripple usage
// import {MDCRippleAdapter} from '../../mdc-ripple/adapter';
// import {MDCRipple, MDCRippleFactory} from '../../mdc-ripple/component';
// import {MDCRippleFoundation} from '../../mdc-ripple/foundation';
import {MDCRippleCapableSurface} from '../../mdc-ripple/types';
import {MDCSegmentedButtonSegmentAdapter} from './adapter';
import {MDCSegmentedButtonSegmentFoundation} from './foundation';
import {SegmentDetail} from '../types';
import {strings} from './constants';

export type MDCSegmentedButtonSegmentFactory =
    (el: Element, foundation?: MDCSegmentedButtonSegmentFoundation) =>
    MDCSegmentedButtonSegment;

export class MDCSegmentedButtonSegment extends MDCComponent<MDCSegmentedButtonSegmentFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element) {
    return new MDCSegmentedButtonSegment(root);
  }

  private index!: number; // assigned in setIndex by parent
  private isSingleSelect!: boolean; // assigned in setIsSingleSelect by parent
  private handleClick!:
      SpecificEventListener<'click'>; // assigned in initialSyncWithDOM

  initialSyncWithDOM() {
    this.handleClick = this.foundation.handleClick;

    this.listen(strings.CLICK_EVENT, this.handleClick);
  }

  destroy() {
    this.unlisten(strings.CLICK_EVENT, this.handleClick);

    super.destroy();
  }

  getDefaultFoundation(): MDCSegmentedButtonSegmentFoundation {
    const adapter: MDCSegmentedButtonSegmentAdapter = {
      isSingleSelect: () => {
        return this.isSingleSelect;
      },
      getAttr: (attrName: string) => {
        return this.root.getAttribute(attrName);
      },
      setAttr: (attrName: string, value: string) => {
        this.root.setAttribute(attrName, value);
      },
      addClass: (className: string) => {
        this.root.classList.add(className);
      },
      removeClass: (className: string) => {
        this.root.classList.remove(className);
      },
      hasClass: (className: string) => {
        return this.root.classList.contains(className);
      },
      notifySelectedChange: (selected: boolean) => {
        this.emit<SegmentDetail>(
          strings.SELECTED_EVENT,
          {index: this.index, selected: selected, segmentId: this.getSegmentId()},
          true /* shouldBubble */
        );
      }
    };
    return new MDCSegmentedButtonSegmentFoundation(adapter);
  }

  setIndex(index: number) {
    this.index = index;
  }

  setIsSingleSelect(isSingleSelect: boolean) {
    this.isSingleSelect = isSingleSelect;
  }

  isSelected(): boolean {
    return this.foundation.isSelected();
  }

  setSelected() {
    return this.foundation.setSelected();
  }

  setUnselected() {
    return this.foundation.setUnselected();
  }

  getSegmentId(): string {
    return this.getSegmentId();
  }
}
