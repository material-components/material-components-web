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

import {MDCFoundation} from '@material/base/foundation';
import {MDCSnackbarAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

const {OPENING, OPEN, CLOSING} = cssClasses;
const {REASON_ACTION, REASON_DISMISS} = strings;

export class MDCSnackbarFoundation extends MDCFoundation<MDCSnackbarAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter(): MDCSnackbarAdapter {
    return {
      addClass: () => undefined,
      announce: () => undefined,
      notifyClosed: () => undefined,
      notifyClosing: () => undefined,
      notifyOpened: () => undefined,
      notifyOpening: () => undefined,
      removeClass: () => undefined,
    };
  }

  private isOpen_ = false;
  private animationFrame_ = 0;
  private animationTimer_ = 0;
  private autoDismissTimer_ = 0;
  private autoDismissTimeoutMs_ = numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;
  private closeOnEscape_ = true;

  constructor(adapter?: Partial<MDCSnackbarAdapter>) {
    super({...MDCSnackbarFoundation.defaultAdapter, ...adapter});
  }

  destroy() {
    this.clearAutoDismissTimer_();
    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = 0;
    clearTimeout(this.animationTimer_);
    this.animationTimer_ = 0;
    this.adapter_.removeClass(OPENING);
    this.adapter_.removeClass(OPEN);
    this.adapter_.removeClass(CLOSING);
  }

  open() {
    this.clearAutoDismissTimer_();
    this.isOpen_ = true;
    this.adapter_.notifyOpening();
    this.adapter_.removeClass(CLOSING);
    this.adapter_.addClass(OPENING);
    this.adapter_.announce();

    // Wait a frame once display is no longer "none", to establish basis for animation
    this.runNextAnimationFrame_(() => {
      this.adapter_.addClass(OPEN);

      this.animationTimer_ = setTimeout(() => {
        const timeoutMs = this.getTimeoutMs();
        this.handleAnimationTimerEnd_();
        this.adapter_.notifyOpened();
        if (timeoutMs !== numbers.INDETERMINATE) {
          this.autoDismissTimer_ = setTimeout(() => {
            this.close(REASON_DISMISS);
          }, timeoutMs);
        }
              }, numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    });
  }

  /**
   * @param reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
   *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
   *     client-specific values may also be used if desired.
   */
  close(reason = '') {
    if (!this.isOpen_) {
      // Avoid redundant close calls (and events), e.g. repeated interactions as the snackbar is animating closed
      return;
    }

    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = 0;
    this.clearAutoDismissTimer_();

    this.isOpen_ = false;
    this.adapter_.notifyClosing(reason);
    this.adapter_.addClass(cssClasses.CLOSING);
    this.adapter_.removeClass(cssClasses.OPEN);
    this.adapter_.removeClass(cssClasses.OPENING);

    clearTimeout(this.animationTimer_);
    this.animationTimer_ = setTimeout(() => {
      this.handleAnimationTimerEnd_();
      this.adapter_.notifyClosed(reason);
    }, numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  }

  isOpen(): boolean {
    return this.isOpen_;
  }

  getTimeoutMs(): number {
    return this.autoDismissTimeoutMs_;
  }

  setTimeoutMs(timeoutMs: number) {
    // Use shorter variable names to make the code more readable
    const minValue = numbers.MIN_AUTO_DISMISS_TIMEOUT_MS;
    const maxValue = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS;
    const indeterminateValue = numbers.INDETERMINATE

    if (timeoutMs === numbers.INDETERMINATE || (timeoutMs <= maxValue && timeoutMs >= minValue)) {
      this.autoDismissTimeoutMs_ = timeoutMs;
    } else {
      throw new Error(`timeoutMs must be an integer in the range ${minValue}–${maxValue} (or ${indeterminateValue} to disable), but got '${timeoutMs}'`);
    }
  }

  getCloseOnEscape(): boolean {
    return this.closeOnEscape_;
  }

  setCloseOnEscape(closeOnEscape: boolean) {
    this.closeOnEscape_ = closeOnEscape;
  }

  handleKeyDown(evt: KeyboardEvent) {
    const isEscapeKey = evt.key === 'Escape' || evt.keyCode === 27;
    if (isEscapeKey && this.getCloseOnEscape()) {
      this.close(REASON_DISMISS);
    }
  }

  handleActionButtonClick(_evt: MouseEvent) {
    this.close(REASON_ACTION);
  }

  handleActionIconClick(_evt: MouseEvent) {
    this.close(REASON_DISMISS);
  }

  private clearAutoDismissTimer_() {
    clearTimeout(this.autoDismissTimer_);
    this.autoDismissTimer_ = 0;
  }

  private handleAnimationTimerEnd_() {
    this.animationTimer_ = 0;
    this.adapter_.removeClass(cssClasses.OPENING);
    this.adapter_.removeClass(cssClasses.CLOSING);
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
   */
  private runNextAnimationFrame_(callback: () => void) {
    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = requestAnimationFrame(() => {
      this.animationFrame_ = 0;
      clearTimeout(this.animationTimer_);
      this.animationTimer_ = setTimeout(callback, 0);
    });
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSnackbarFoundation;
