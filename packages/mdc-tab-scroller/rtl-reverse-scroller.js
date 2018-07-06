/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *      http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import MDCTabScrollerRTL from './rtl-scroller';

/* eslint-disable no-unused-vars */
import {MDCTabScrollerAnimation, MDCTabScrollerEdges} from './adapter';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCTabScrollerRTL}
 * @final
 */
class MDCTabScrollerRTLReverse extends MDCTabScrollerRTL {
  /**
   * @param {number} translateX
   * @return {number}
   */
  computeCurrentScrollPositionRTL(translateX) {
    const currentScrollLeft = this.adapter_.getScrollAreaScrollLeft();
    // Scroll values on most browsers are ints instead of floats so we round
    return Math.round(-currentScrollLeft + translateX);
  }

  /**
   * @param {number} scrollX
   * @return {!MDCTabScrollerAnimation}
   */
  scrollToRTL(scrollX) {
    const currentScrollLeft = this.adapter_.getScrollAreaScrollLeft();
    const clampedScrollLeft = this.clampScrollValue_(-scrollX);
    return /** @type {!MDCTabScrollerAnimation} */ ({
      scrollX: clampedScrollLeft,
      translateX: currentScrollLeft - clampedScrollLeft,
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
      scrollX: clampedScrollLeft,
      translateX: currentScrollLeft - clampedScrollLeft,
    });
  }

  /**
   * @return {!MDCTabScrollerEdges}
   * @private
   */
  calculateScrollEdges_() {
    const contentWidth = this.adapter_.getScrollContentOffsetWidth();
    const rootWidth = this.adapter_.getScrollAreaOffsetWidth();
    return /** @type {!MDCTabScrollerEdges} */ ({
      left: contentWidth - rootWidth,
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
    return Math.min(Math.max(edges.right, scrollX), edges.left);
  }
}

export default MDCTabScrollerRTLReverse;
