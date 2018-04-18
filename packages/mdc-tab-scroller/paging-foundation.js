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

import MDCTabScrollerFoundation from './foundation';

/**
 * @extends {MDCTabScrollerFoundation}
 * @final
 */
class MDCTabPagingFoundation extends MDCTabScrollerFoundation {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @private {function(?Event=)} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
  }

  handleTransitionEnd() {
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
  }

  /**
   * Scroll to the given position
   * @param {number} scrollX The position to scroll to
   */
  scrollTo(scrollX) {
    const currentScrollX = this.computeCurrentScrollPosition();
    // Negate the scrollX value so translation happens in the same direction
    // as normal browser scrolling (to the left).
    const newScrollX = -this.calculateSafeScrollValue(scrollX);
    this.scrollTo_(newScrollX, currentScrollX);
  }

  /**
   * Increment the scroll value by the given amount
   * @param {number} scrollXIncrement The value by which to increment the scroll position
   */
  incrementScroll(scrollXIncrement) {
    const currentScrollX = this.computeCurrentScrollPosition();
    // Negate the scrollX value so translation happens in the same direction
    // as normal browser scrolling (to the left).
    const newScrollX = -this.calculateSafeScrollValue(currentScrollX + scrollXIncrement);
    this.scrollTo_(newScrollX, currentScrollX);
  }

  /**
   * Internal scroll method
   * @param {number} newScrollX The new scroll position
   * @param {number} currentScrollX The current scroll position
   * @private
   */
  scrollTo_(newScrollX, currentScrollX) {
    const scrollXDelta = currentScrollX + newScrollX;
    // Early exit if the scroll values are the same
    if (scrollXDelta === 0) {
      return;
    }

    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
    this.adapter_.setContentStyleProperty('transform', `translateX(${newScrollX}px)`);
  }
};

export default MDCTabPagingFoundation;
