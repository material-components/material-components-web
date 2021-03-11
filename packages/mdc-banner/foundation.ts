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

import {MDCFoundation} from '@material/base/foundation';

import {MDCBannerAdapter} from './adapter';
import {CloseReason, cssClasses, numbers} from './constants';

const {OPENING, OPEN, CLOSING} = cssClasses;

/**
 * Foundation class for banner. Responsibilities include opening and closing the
 * banner.
 */
export class MDCBannerFoundation extends MDCFoundation<MDCBannerAdapter> {
  static get defaultAdapter(): MDCBannerAdapter {
    return {
      addClass: () => undefined,
      getContentHeight: () => 0,
      notifyClosed: () => undefined,
      notifyClosing: () => undefined,
      notifyOpened: () => undefined,
      notifyOpening: () => undefined,
      releaseFocus: () => undefined,
      removeClass: () => undefined,
      setStyleProperty: () => undefined,
      trapFocus: () => undefined,
    };
  }

  private isOpened = false;
  // Request id for open animation, used to cancel the refresh callback
  // request on close() and destroy().
  private animationFrame = 0;
  // Timer id for close and open animation, used to cancel the timer on
  // close() and destroy().
  private animationTimer = 0;

  constructor(adapter?: Partial<MDCBannerAdapter>) {
    super({...MDCBannerFoundation.defaultAdapter, ...adapter});
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    clearTimeout(this.animationTimer);
    this.animationTimer = 0;
  }

  open() {
    this.isOpened = true;
    this.adapter.notifyOpening();
    this.adapter.removeClass(CLOSING);
    this.adapter.addClass(OPENING);

    const contentHeight = this.adapter.getContentHeight();
    this.animationFrame = requestAnimationFrame(() => {
      this.adapter.addClass(OPEN);
      this.adapter.setStyleProperty('height', `${contentHeight}px`);

      this.animationTimer = setTimeout(() => {
        this.handleAnimationTimerEnd();
        this.adapter.trapFocus();
        this.adapter.notifyOpened();
      }, numbers.BANNER_ANIMATION_OPEN_TIME_MS);
    });
  }

  /**
   * @param reason Why the banner was closed. Value will be passed to
   *     events.CLOSING and events.CLOSED via the `event.detail.reason`
   *     property. Standard values are CloseReason.PRIMARY and
   *     CloseReason.SECONDARY, but CloseReason.UNSPECIFIED is provided for
   *     custom handling of programmatic closing of the banner.
   */
  close(reason: CloseReason) {
    if (!this.isOpened) {
      // Avoid redundant close calls (and events), e.g. repeated interactions as
      // the banner is animating closed
      return;
    }

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;

    this.isOpened = false;
    this.adapter.notifyClosing(reason);
    this.adapter.addClass(CLOSING);
    this.adapter.setStyleProperty('height', '0');
    this.adapter.removeClass(OPEN);
    this.adapter.removeClass(OPENING);

    clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(() => {
      this.adapter.releaseFocus();
      this.handleAnimationTimerEnd();
      this.adapter.notifyClosed(reason);
    }, numbers.BANNER_ANIMATION_CLOSE_TIME_MS);
  }

  isOpen(): boolean {
    return this.isOpened;
  }

  handlePrimaryActionClick() {
    this.close(CloseReason.PRIMARY);
  }

  handleSecondaryActionClick() {
    this.close(CloseReason.SECONDARY);
  }

  layout() {
    const contentHeight = this.adapter.getContentHeight();
    this.adapter.setStyleProperty('height', `${contentHeight}px`);
  }

  private handleAnimationTimerEnd() {
    this.animationTimer = 0;
    this.adapter.removeClass(OPENING);
    this.adapter.removeClass(CLOSING);
  }
}
