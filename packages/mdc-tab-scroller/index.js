/**
 * @license
 * Copyright 2018 Google Inc.
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

import MDCComponent from '@material/base/component';

import {MDCTabScrollerAdapter} from './adapter';
import MDCTabScrollerFoundation from './foundation';
import * as util from './util';

/**
 * @extends {MDCComponent<!MDCTabScrollerFoundation>}
 * @final
 */
class MDCTabScroller extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTabScroller}
   */
  static attachTo(root) {
    return new MDCTabScroller(root);
  }

  constructor(...args) {
    super(...args);

    /** @private {?Element} */
    this.content_;

    /** @private {?Element} */
    this.area_;

    /** @private {?function(?Event): undefined} */
    this.handleInteraction_;

    /** @private {?function(!Event): undefined} */
    this.handleTransitionEnd_;
  }

  initialize() {
    this.area_ = this.root_.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR);
    this.content_ = this.root_.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = () => this.foundation_.handleInteraction();
    this.handleTransitionEnd_ = (evt) => this.foundation_.handleTransitionEnd(evt);

    this.area_.addEventListener('wheel', this.handleInteraction_);
    this.area_.addEventListener('touchstart', this.handleInteraction_);
    this.area_.addEventListener('pointerdown', this.handleInteraction_);
    this.area_.addEventListener('mousedown', this.handleInteraction_);
    this.area_.addEventListener('keydown', this.handleInteraction_);
    this.content_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  destroy() {
    super.destroy();

    this.area_.removeEventListener('wheel', this.handleInteraction_);
    this.area_.removeEventListener('touchstart', this.handleInteraction_);
    this.area_.removeEventListener('pointerdown', this.handleInteraction_);
    this.area_.removeEventListener('mousedown', this.handleInteraction_);
    this.area_.removeEventListener('keydown', this.handleInteraction_);
    this.content_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  /**
   * @return {!MDCTabScrollerFoundation}
   */
  getDefaultFoundation() {
    const adapter = /** @type {!MDCTabScrollerAdapter} */ ({
      eventTargetMatchesSelector: (evtTarget, selector) => {
        const MATCHES = util.getMatchesProperty(HTMLElement.prototype);
        return evtTarget[MATCHES](selector);
      },
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addScrollAreaClass: (className) => this.area_.classList.add(className),
      setScrollAreaStyleProperty: (prop, value) => this.area_.style.setProperty(prop, value),
      setScrollContentStyleProperty: (prop, value) => this.content_.style.setProperty(prop, value),
      getScrollContentStyleValue: (propName) => window.getComputedStyle(this.content_).getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX) => this.area_.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.area_.scrollLeft,
      getScrollContentOffsetWidth: () => this.content_.offsetWidth,
      getScrollAreaOffsetWidth: () => this.area_.offsetWidth,
      computeScrollAreaClientRect: () => this.area_.getBoundingClientRect(),
      computeScrollContentClientRect: () => this.content_.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () => util.computeHorizontalScrollbarHeight(document),
    });

    return new MDCTabScrollerFoundation(adapter);
  }

  /**
   * Returns the current visual scroll position
   * @return {number}
   */
  getScrollPosition() {
    return this.foundation_.getScrollPosition();
  }

  /**
   * Returns the width of the scroll content
   * @return {number}
   */
  getScrollContentWidth() {
    return this.content_.offsetWidth;
  }

  /**
   * Increments the scroll value by the given amount
   * @param {number} scrollXIncrement The pixel value by which to increment the scroll value
   */
  incrementScroll(scrollXIncrement) {
    this.foundation_.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param {number} scrollX The pixel value to scroll to
   */
  scrollTo(scrollX) {
    this.foundation_.scrollTo(scrollX);
  }
}

export {MDCTabScroller, MDCTabScrollerFoundation, util};
