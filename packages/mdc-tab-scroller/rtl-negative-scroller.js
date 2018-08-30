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

import MDCTabScrollerRTL from './rtl-scroller';

/* eslint-disable no-unused-vars */
import {MDCTabScrollerAnimation, MDCTabScrollerHorizontalEdges} from './adapter';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCTabScrollerRTL}
 * @final
 */
class MDCTabScrollerRTLNegative extends MDCTabScrollerRTL {
  /**
   * @param {number} translateX The current translateX position
   * @return {number}
   */
  getScrollPositionRTL(translateX) {
    const currentScrollLeft = this.adapter_.getScrollAreaScrollLeft();
    return Math.round(translateX - currentScrollLeft);
  }

  /**
   * @param {number} scrollX
   * @return {!MDCTabScrollerAnimation}
   */
  scrollToRTL(scrollX) {
    const currentScrollLeft = this.adapter_.getScrollAreaScrollLeft();
    const clampedScrollLeft = this.clampScrollValue_(-scrollX);
    return /** @type {!MDCTabScrollerAnimation} */ ({
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft,
    });
  }

  /**
   * @param {number} scrollX
   * @return {!MDCTabScrollerAnimation}
   */
  incrementScrollRTL(scrollX) {
    const currentScrollLeft = this.adapter_.getScrollAreaScrollLeft();
    const clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
    return /** @type {!MDCTabScrollerAnimation} */ ({
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft,
    });
  }

  /**
   * @param {number} scrollX
   * @param {number} translateX
   * @return {number}
   */
  getAnimatingScrollPosition(scrollX, translateX) {
    return scrollX - translateX;
  }

  /**
   * @return {!MDCTabScrollerHorizontalEdges}
   * @private
   */
  calculateScrollEdges_() {
    const contentWidth = this.adapter_.getScrollContentOffsetWidth();
    const rootWidth = this.adapter_.getScrollAreaOffsetWidth();
    return /** @type {!MDCTabScrollerHorizontalEdges} */ ({
      left: rootWidth - contentWidth,
      right: 0,
    });
  }

  /**
   * @param {number} scrollX
   * @return {number}
   * @private
   */
  clampScrollValue_(scrollX) {
    const edges = this.calculateScrollEdges_();
    return Math.max(Math.min(edges.right, scrollX), edges.left);
  }
}

export default MDCTabScrollerRTLNegative;
