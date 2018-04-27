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
class MDCTabScrollerRTLDefault extends MDCTabScrollerRTL {
  /**
   * @return {number}
   */
  computeCurrentScrollPositionRTL() {
    const currentScrollLeft = this.adapter_.getScrollLeft();
    const {right} = this.calculateScrollEdges_();
    // Scroll values on most browsers are ints instead of floats so we round
    return Math.round(currentScrollLeft - right);
  }

  /**
   * @param {number} scrollX
   * @return {!MDCTabScrollerAnimation}
   */
  scrollToRTL(scrollX) {
    const edges = this.calculateScrollEdges_();
    const currentScrollLeft = this.adapter_.getScrollLeft();
    const clampedScrollLeft = this.clampScrollValue_(edges.right + scrollX);
    return /** @type {!MDCTabScrollerAnimation} */ ({
      scrollX: clampedScrollLeft,
      translateX: clampedScrollLeft - currentScrollLeft,
    });
  }

  /**
   * @param {number} scrollX
   * @return {!MDCTabScrollerAnimation}
   */
  incrementScrollRTL(scrollX) {
    const currentScrollLeft = this.adapter_.getScrollLeft();
    const clampedScrollLeft = this.clampScrollValue_(scrollX + currentScrollLeft);
    return /** @type {!MDCTabScrollerAnimation} */ ({
      scrollX: clampedScrollLeft,
      translateX: clampedScrollLeft - currentScrollLeft,
    });
  }

  /**
   * @return {!MDCTabScrollerEdges}
   * @private
   */
  calculateScrollEdges_() {
    const contentWidth = this.adapter_.getContentOffsetWidth();
    const rootWidth = this.adapter_.getOffsetWidth();
    // Scroll values on most browsers are ints instead of floats so we round
    return /** @type {!MDCTabScrollerEdges} */ ({
      left: 0,
      right: Math.round(contentWidth - rootWidth),
    });
  }

  /**
   * @param {number} scrollX
   * @return {number}
   * @private
   */
  clampScrollValue_(scrollX) {
    const edges = this.calculateScrollEdges_();
    return Math.min(Math.max(edges.left, scrollX), edges.right);
  }
}

export default MDCTabScrollerRTLDefault;
