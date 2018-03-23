/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

import MDCTopAppBarAdapter from '../adapter';
import MDCTopAppBarBaseFoundation from '../foundation';
import {numbers} from '../constants';

/**
 * @extends {MDCTopAppBarBaseFoundation<!MDCTopAppBarFoundation>}
 * @final
 */
class MDCTopAppBarFoundation extends MDCTopAppBarBaseFoundation {
  /**
   * @param {!MDCTopAppBarAdapter} adapter
   */
  constructor(adapter) {
    super(adapter);
    // Used for diffs of current scroll position vs previous scroll position
    /** @private {number} */
    this.lastScrollPosition_ = this.adapter_.getViewportScrollY();
    // Used to verify when the top app bar is completely showing or completely hidden
    /** @private {number} */
    this.topAppBarHeight_ = this.adapter_.getTopAppBarHeight();
    // isDocked_ is used to indicate if the top app bar is 100% showing or hidden
    /** @private {boolean} */
    this.isDocked_ = true;
    // Variable for current scroll position of the top app bar
    /** @private {number} */
    this.currentAppBarScrollPosition_ = 0;
    // Used to prevent the top app bar from being scrolled out of view during resize events
    /** @private {boolean} */
    this.isCurrentlyBeingResized_ = false;
    // The timeout that's used to throttle the resize events
    /** @private {number} */
    this.resizeThrottleId_ = -1;
    // The timeout that's used to debounce toggling the isCurrentlyBeingResized_ variable after a resize
    /** @private {number} */
    this.resizeDebounceId_ = -1;

    this.scrollHandler_ = () => this.topAppBarScrollHandler_();
    this.resizeHandler_ = () => this.topAppBarResizeHandler_();
  }

  init() {
    super.init();
    this.adapter_.registerScrollHandler(this.scrollHandler_);
    this.adapter_.registerResizeHandler(this.resizeHandler_);
  }

  destroy() {
    super.destroy();
    this.adapter_.deregisterScrollHandler(this.scrollHandler_);
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    this.adapter_.setStyle('top', 'auto');
  }

  /**
   * Function to determine if the DOM needs to update.
   * @private
   * @returns {boolean}
   */
  isUpdateRequired_() {
    const partiallyShowing = this.currentAppBarScrollPosition_ < 0
      && this.currentAppBarScrollPosition_ > -this.topAppBarHeight_;
    let updateRequired = false;

    if (this.isDocked_) {
      // If it was previously already docked but now is partially showing, it's no longer docked.
      if (partiallyShowing) {
        this.isDocked_ = false;
        updateRequired = true;
      }
    } else {
      // If it's not previously docked and not partially showing, it just became docked.
      if (!partiallyShowing) {
        this.isDocked_ = true;
      }
      updateRequired = true;
    }
    return updateRequired;
  }

  /**
   * Function to move the top app bar if needed.
   * @private
   */
  moveTopAppBar_() {
    if (this.isUpdateRequired_()) {
      // Once the top app bar is fully hidden we use the max potential top app bar height as our offset
      // so the top app bar doesn't show if the window resizes and the new height > the old height.
      let offset = this.currentAppBarScrollPosition_;
      if (Math.abs(offset) >= this.topAppBarHeight_) {
        offset = -numbers.MAX_TOP_APP_BAR_HEIGHT;
      }

      this.adapter_.setStyle('top', offset + 'px');
    }
  }

  /**
   * Scroll handler for the default scroll behavior of the top app bar.
   * @private
   */
  topAppBarScrollHandler_() {
    const currentScrollPosition = Math.max(this.adapter_.getViewportScrollY(), 0);
    const diff = currentScrollPosition - this.lastScrollPosition_;
    this.lastScrollPosition_ = currentScrollPosition;

    // If the window is being resized the lastScrollPosition_ needs to be updated but the
    // current scroll of the top app bar should stay in the same position.
    if (!this.isCurrentlyBeingResized_) {
      this.currentAppBarScrollPosition_ -= diff;

      if (this.currentAppBarScrollPosition_ > 0) {
        this.currentAppBarScrollPosition_ = 0;
      } else if (Math.abs(this.currentAppBarScrollPosition_) > this.topAppBarHeight_) {
        this.currentAppBarScrollPosition_ = -this.topAppBarHeight_;
      }

      requestAnimationFrame(() => this.moveTopAppBar_());
    }
  }

  /**
   * Top app bar resize handler that throttle/debounce functions that execute updates.
   * @private
   */
  topAppBarResizeHandler_() {
    // Throttle resize events 10 p/s
    if (this.resizeThrottleId_ === -1) {
      this.resizeThrottleId_ = setTimeout(() => {
        this.resizeThrottleId_ = -1;
        this.throttledResizeHandler_();
      }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME);
    }

    this.isCurrentlyBeingResized_ = true;

    if (this.resizeDebounceId_ !== -1) {
      clearTimeout(this.resizeDebounceId_);
    }

    this.resizeDebounceId_ = setTimeout(() => {
      this.topAppBarScrollHandler_();
      this.isCurrentlyBeingResized_ = false;
    }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME);
  }

  /**
   * Throttled function that updates the top app bar scrolled values if the
   * top app bar height changes.
   * @private
   */
  throttledResizeHandler_() {
    const currentHeight = this.adapter_.getTopAppBarHeight();
    if (this.topAppBarHeight_ !== currentHeight) {
      this.isDocked_ = false;

      // Since the top app bar has a different height depending on the screen width, this
      // will ensure that the top app bar remains in the correct location if
      // completely hidden and a resize makes the top app bar a different height.
      this.currentAppBarScrollPosition_ -= this.topAppBarHeight_ - currentHeight;
      this.topAppBarHeight_ = currentHeight;
    }
    this.topAppBarScrollHandler_();
  }
}

export default MDCTopAppBarFoundation;
