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
  private wasDocked = true;

  /**
   * Indicates if the top app bar is docked in the fully shown position.
   */
  private isDockedShowing = true;

  /**
   * Variable for current scroll position of the top app bar
   */
  private currentAppBarOffsetTop = 0;

  /**
   * Used to prevent the top app bar from being scrolled out of view during resize events
   */
  private isCurrentlyBeingResized = false;

  /**
   * The timeout that's used to throttle the resize events
   */
  private resizeThrottleId = INITIAL_VALUE;

  /**
   * Used for diffs of current scroll position vs previous scroll position
   */
  private lastScrollPosition: number;

  /**
   * Used to verify when the top app bar is completely showing or completely hidden
   */
  private topAppBarHeight: number;

  /**
   * The timeout that's used to debounce toggling the isCurrentlyBeingResized
   * variable after a resize
   */
  private resizeDebounceId = INITIAL_VALUE;

  /* istanbul ignore next: optional argument is not a branch statement */
  constructor(adapter?: Partial<MDCTopAppBarAdapter>) {
    super(adapter);

    this.lastScrollPosition = this.adapter.getViewportScrollY();
    this.topAppBarHeight = this.adapter.getTopAppBarHeight();
  }

  destroy() {
    super.destroy();
    this.adapter.setStyle('top', '');
  }

  /**
   * Scroll handler for the default scroll behavior of the top app bar.
   * @override
   */
  handleTargetScroll() {
    const currentScrollPosition = Math.max(this.adapter.getViewportScrollY(), 0);
    const diff = currentScrollPosition - this.lastScrollPosition;
    this.lastScrollPosition = currentScrollPosition;

    // If the window is being resized the lastScrollPosition needs to be updated
    // but the current scroll of the top app bar should stay in the same
    // position.
    if (!this.isCurrentlyBeingResized) {
      this.currentAppBarOffsetTop -= diff;

      if (this.currentAppBarOffsetTop > 0) {
        this.currentAppBarOffsetTop = 0;
      } else if (Math.abs(this.currentAppBarOffsetTop) > this.topAppBarHeight) {
        this.currentAppBarOffsetTop = -this.topAppBarHeight;
      }

      this.moveTopAppBar();
    }
  }

  /**
   * Top app bar resize handler that throttle/debounce functions that execute updates.
   * @override
   */
  handleWindowResize() {
    // Throttle resize events 10 p/s
    if (!this.resizeThrottleId) {
      this.resizeThrottleId = setTimeout(() => {
        this.resizeThrottleId = INITIAL_VALUE;
        this.throttledResizeHandler();
      }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
    }

    this.isCurrentlyBeingResized = true;

    if (this.resizeDebounceId) {
      clearTimeout(this.resizeDebounceId);
    }

    this.resizeDebounceId = setTimeout(() => {
      this.handleTargetScroll();
      this.isCurrentlyBeingResized = false;
      this.resizeDebounceId = INITIAL_VALUE;
    }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
  }

  /**
   * Function to determine if the DOM needs to update.
   */
  private checkForUpdate(): boolean {
    const offscreenBoundaryTop = -this.topAppBarHeight;
    const hasAnyPixelsOffscreen = this.currentAppBarOffsetTop < 0;
    const hasAnyPixelsOnscreen =
        this.currentAppBarOffsetTop > offscreenBoundaryTop;
    const partiallyShowing = hasAnyPixelsOffscreen && hasAnyPixelsOnscreen;

    // If it's partially showing, it can't be docked.
    if (partiallyShowing) {
      this.wasDocked = false;
    } else {
      // Not previously docked and not partially showing, it's now docked.
      if (!this.wasDocked) {
        this.wasDocked = true;
        return true;
      } else if (this.isDockedShowing !== hasAnyPixelsOnscreen) {
        this.isDockedShowing = hasAnyPixelsOnscreen;
        return true;
      }
    }

    return partiallyShowing;
  }

  /**
   * Function to move the top app bar if needed.
   */
  private moveTopAppBar() {
    if (this.checkForUpdate()) {
      // Once the top app bar is fully hidden we use the max potential top app bar height as our offset
      // so the top app bar doesn't show if the window resizes and the new height > the old height.
      let offset = this.currentAppBarOffsetTop;
      if (Math.abs(offset) >= this.topAppBarHeight) {
        offset = -numbers.MAX_TOP_APP_BAR_HEIGHT;
      }

      this.adapter.setStyle('top', offset + 'px');
    }
  }

  /**
   * Throttled function that updates the top app bar scrolled values if the
   * top app bar height changes.
   */
  private throttledResizeHandler() {
    const currentHeight = this.adapter.getTopAppBarHeight();
    if (this.topAppBarHeight !== currentHeight) {
      this.wasDocked = false;

      // Since the top app bar has a different height depending on the screen width, this
      // will ensure that the top app bar remains in the correct location if
      // completely hidden and a resize makes the top app bar a different height.
      this.currentAppBarOffsetTop -= this.topAppBarHeight - currentHeight;
      this.topAppBarHeight = currentHeight;
    }
    this.handleTargetScroll();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTopAppBarFoundation;
