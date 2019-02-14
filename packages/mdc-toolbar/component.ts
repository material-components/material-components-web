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

import {MDCComponent} from '@material/base/component';
import {MDCRipple} from '@material/ripple/index';
import {MDCToolbarFoundation} from './foundation';
import {ToolbarEventDetail} from './types';

const {strings} = MDCToolbarFoundation;

export class MDCToolbar extends MDCComponent<MDCToolbarFoundation> {
  static attachTo(root: Element) {
    return new MDCToolbar(root);
  }

  protected root_!: HTMLElement; // assigned in MDCComponent constructor

  private ripples_!: MDCRipple[]; // assigned in initialize()
  private fixedAdjustElement_!: HTMLElement | null; // assigned in initialize()

  initialize() {
    this.ripples_ = [];
    this.fixedAdjustElement_ = null;

    [].forEach.call(this.root_.querySelectorAll(strings.ICON_SELECTOR), (icon: HTMLElement) => {
      const ripple = MDCRipple.attachTo(icon);
      ripple.unbounded = true;
      this.ripples_.push(ripple);
    });
  }

  destroy() {
    this.ripples_.forEach((ripple) => {
      ripple.destroy();
    });
    super.destroy();
  }

  set fixedAdjustElement(element: HTMLElement | null) {
    this.fixedAdjustElement_ = element;
    this.foundation_.updateAdjustElementStyles();
  }

  get fixedAdjustElement(): HTMLElement | null {
    return this.fixedAdjustElement_;
  }

  private get firstRowElement_(): HTMLElement {
    return this.root_.querySelector<HTMLElement>(strings.FIRST_ROW_SELECTOR)!;
  }

  private get titleElement_(): HTMLElement | null {
    return this.root_.querySelector<HTMLElement>(strings.TITLE_SELECTOR)!;
  }

  getDefaultFoundation() {
    // tslint:disable:object-literal-sort-keys
    return new MDCToolbarFoundation({
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      registerScrollHandler: (handler) => window.addEventListener('scroll', handler),
      deregisterScrollHandler: (handler) => window.removeEventListener('scroll', handler),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getViewportWidth: () => window.innerWidth,
      getViewportScrollY: () => window.pageYOffset,
      getOffsetHeight: () => this.root_.offsetHeight,
      getFirstRowElementOffsetHeight: () => this.firstRowElement_.offsetHeight,
      notifyChange: (evtData) => this.emit<ToolbarEventDetail>(strings.CHANGE_EVENT, evtData),
      setStyle: (property, value) => this.root_.style.setProperty(property, value),
      setStyleForTitleElement: (property, value) => {
        if (this.titleElement_) {
          this.titleElement_.style.setProperty(property, value);
        }
      },
      setStyleForFlexibleRowElement: (property, value) => this.firstRowElement_.style.setProperty(property, value),
      setStyleForFixedAdjustElement: (property, value) => {
        if (this.fixedAdjustElement) {
          this.fixedAdjustElement.style.setProperty(property, value);
        }
      },
    });
    // tslint:enable:object-literal-sort-keys
  }
}

export default MDCToolbar;
