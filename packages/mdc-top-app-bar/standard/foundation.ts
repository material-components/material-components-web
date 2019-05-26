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

import {MDCTopAppBarAdapter} from '../adapter';
import {numbers} from '../constants';
import {MDCTopAppBarBaseFoundation} from '../foundation';

const INITIAL_VALUE = 0;

export class MDCTopAppBarFoundation extends MDCTopAppBarBaseFoundation {
  /**
   * Indicates if the top app bar was docked in the previous scroll handler iteration.
   */
  private wasDocked_ = true;

  /**
   * Indicates if the top app bar is docked in the fully shown position.
   */
  private isDockedShowing_ = true;

  /**
   * Variable for current scroll position of the top app bar
   */
  private currentAppBarOffsetTop_ = 0;

  /**
   * Used to prevent the top app bar from being scrolled out of view during resize events
   */
  private isCurrentlyBeingResized_ = false;

  /**
   * The timeout that's used to throttle the resize events
   */
  private resizeThrottleId_ = INITIAL_VALUE;

  /**
   * Used for diffs of current scroll position vs previous scroll position
   */
  private lastScrollPosition_: number;

  /**
   * Used to verify when the top app bar is completely showing or completely hidden
   */
  private topAppBarHeight_: number;

  /**
   * The timeout that's used to debounce toggling the isCurrentlyBeingResized_ variable after a resize
   */
  private resizeDebounceId_ = INITIAL_VALUE;

  /* istanbul ignore next: optional argument is not a branch statement */
  constructor(adapter?: Partial<MDCTopAppBarAdapter>) {
    super(adapter);

    this.lastScrollPosition_ = this.adapter_.getViewportScrollY();
    this.topAppBarHeight_ = this.adapter_.getTopAppBarHeight();
  }

  destroy() {
    super.destroy();
    this.adapter_.setStyle('top', '');
  }

  /**
   * Scroll handler for the default scroll behavior of the top app bar.
   * @override
   */
  handleTargetScroll() {
    const currentScrollPosition = Math.max(this.adapter_.getViewportScrollY(), 0);
    const diff = currentScrollPosition - this.lastScrollPosition_;
    this.lastScrollPosition_ = currentScrollPosition;

    // If the window is being resized the lastScrollPosition_ needs to be updated but the
    // current scroll of the top app bar should stay in the same position.
    if (!this.isCurrentlyBeingResized_) {
      this.currentAppBarOffsetTop_ -= diff;

      if (this.currentAppBarOffsetTop_ > 0) {
        this.currentAppBarOffsetTop_ = 0;
      } else if (Math.abs(this.currentAppBarOffsetTop_) > this.topAppBarHeight_) {
        this.currentAppBarOffsetTop_ = -this.topAppBarHeight_;
      }

      this.moveTopAppBar_();
    }
  }

  /**
   * Top app bar resize handler that throttle/debounce functions that execute updates.
   * @override
   */
  handleWindowResize() {
    // Throttle resize events 10 p/s
    if (!this.resizeThrottleId_) {
      this.resizeThrottleId_ = setTimeout(() => {
        this.resizeThrottleId_ = INITIAL_VALUE;
        this.throttledResizeHandler_();
      }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
    }

    this.isCurrentlyBeingResized_ = true;

    if (this.resizeDebounceId_) {
      clearTimeout(this.resizeDebounceId_);
    }

    this.resizeDebounceId_ = setTimeout(() => {
      this.handleTargetScroll();
      this.isCurrentlyBeingResized_ = false;
      this.resizeDebounceId_ = INITIAL_VALUE;
    }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
  }

  /**
   * Function to determine if the DOM needs to update.
   */
  private checkForUpdate_(): boolean {
    const offscreenBoundaryTop = -this.topAppBarHeight_;
    const hasAnyPixelsOffscreen = this.currentAppBarOffsetTop_ < 0;
    const hasAnyPixelsOnscreen = this.currentAppBarOffsetTop_ > offscreenBoundaryTop;
    const partiallyShowing = hasAnyPixelsOffscreen && hasAnyPixelsOnscreen;

    // If it's partially showing, it can't be docked.
    if (partiallyShowing) {
      this.wasDocked_ = false;
    } else {
      // Not previously docked and not partially showing, it's now docked.
      if (!this.wasDocked_) {
        this.wasDocked_ = true;
        return true;
      } else if (this.isDockedShowing_ !== hasAnyPixelsOnscreen) {
        this.isDockedShowing_ = hasAnyPixelsOnscreen;
        return true;
      }
    }

    return partiallyShowing;
  }

  /**
   * Function to move the top app bar if needed.
   */
  private moveTopAppBar_() {
    if (this.checkForUpdate_()) {
      // Once the top app bar is fully hidden we use the max potential top app bar height as our offset
      // so the top app bar doesn't show if the window resizes and the new height > the old height.
      let offset = this.currentAppBarOffsetTop_;
      if (Math.abs(offset) >= this.topAppBarHeight_) {
        offset = -numbers.MAX_TOP_APP_BAR_HEIGHT;
      }

      this.adapter_.setStyle('top', offset + 'px');
    }
  }

  /**
   * Throttled function that updates the top app bar scrolled values if the
   * top app bar height changes.
   */
  private throttledResizeHandler_() {
    const currentHeight = this.adapter_.getTopAppBarHeight();
    if (this.topAppBarHeight_ !== currentHeight) {
      this.wasDocked_ = false;

      // Since the top app bar has a different height depending on the screen width, this
      // will ensure that the top app bar remains in the correct location if
      // completely hidden and a resize makes the top app bar a different height.
      this.currentAppBarOffsetTop_ -= this.topAppBarHeight_ - currentHeight;
      this.topAppBarHeight_ = currentHeight;
    }
    this.handleTargetScroll();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTopAppBarFoundation;
