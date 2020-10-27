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
import {SpecificEventListener} from '@material/base/types';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';

import {SegmentDetail} from '../types';

import {MDCSegmentedButtonSegmentAdapter} from './adapter';
import {events} from './constants';
import {MDCSegmentedButtonSegmentFoundation} from './foundation';

/**
 * MDCSegmentedButtonSegment factory type.
 */
export type MDCSegmentedButtonSegmentFactory =
    (el: Element, foundation?: MDCSegmentedButtonSegmentFoundation) =>
        MDCSegmentedButtonSegment;

/**
 * Implementation of MDCSegmentedButtonSegmentFoundation
 */
export class MDCSegmentedButtonSegment extends
    MDCComponent<MDCSegmentedButtonSegmentFoundation> implements
        MDCRippleCapableSurface {
  get ripple(): MDCRipple {
    return this.rippleComponent;
  }

  static attachTo(root: Element) {
    return new MDCSegmentedButtonSegment(root);
  }

  private index!: number;            // assigned in setIndex by parent
  private isSingleSelect!: boolean;  // assigned in setIsSingleSelect by parent
  private rippleComponent!: MDCRipple;  // assigned in initialize
  private handleClick!:
      SpecificEventListener<'click'>;  // assigned in initialSyncWithDOM

  initialize(
      rippleFactory: MDCRippleFactory = (el, foundation) =>
          new MDCRipple(el, foundation)) {
    const rippleAdapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      computeBoundingRect: () => this.foundation.getDimensions()
    };
    this.rippleComponent =
        rippleFactory(this.root, new MDCRippleFoundation(rippleAdapter));
  }

  initialSyncWithDOM() {
    this.handleClick = () => {
      this.foundation.handleClick();
    };

    this.listen(events.CLICK, this.handleClick);
  }

  destroy() {
    this.ripple.destroy();

    this.unlisten(events.CLICK, this.handleClick);

    super.destroy();
  }

  getDefaultFoundation(): MDCSegmentedButtonSegmentFoundation {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCSegmentedButtonSegmentAdapter = {
      isSingleSelect: () => {
        return this.isSingleSelect;
      },
      getAttr: (attrName) => {
        return this.root.getAttribute(attrName);
      },
      setAttr: (attrName, value) => {
        this.root.setAttribute(attrName, value);
      },
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      hasClass: (className) => {
        return this.root.classList.contains(className);
      },
      notifySelectedChange: (selected) => {
        this.emit<SegmentDetail>(
            events.SELECTED, {
              index: this.index,
              selected,
              segmentId: this.getSegmentId()
            },
            true /* shouldBubble */
        );
      },
      getRootBoundingClientRect: () => {
        return this.root.getBoundingClientRect();
      }
    };
    return new MDCSegmentedButtonSegmentFoundation(adapter);
  }

  /**
   * Sets segment's index value
   *
   * @param index Segment's index within wrapping segmented button
   */
  setIndex(index: number) {
    this.index = index;
  }

  /**
   * Sets segment's isSingleSelect value
   *
   * @param isSingleSelect True if wrapping segmented button is single select
   */
  setIsSingleSelect(isSingleSelect: boolean) {
    this.isSingleSelect = isSingleSelect;
  }

  /**
   * @return Returns true if segment is currently selected, otherwise returns
   * false
   */
  isSelected(): boolean {
    return this.foundation.isSelected();
  }

  /**
   * Sets segment to be selected
   */
  setSelected() {
    this.foundation.setSelected();
  }

  /**
   * Sets segment to be not selected
   */
  setUnselected() {
    this.foundation.setUnselected();
  }

  /**
   * @return Returns segment's segmentId if it was set by client
   */
  getSegmentId(): string|undefined {
    return this.foundation.getSegmentId();
  }
}
