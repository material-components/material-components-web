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

/** MDC Snackbar Foundation */
export class MDCSnackbarFoundation extends MDCFoundation<MDCSnackbarAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get numbers() {
    return numbers;
  }

  static override get defaultAdapter(): MDCSnackbarAdapter {
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

  private opened = false;
  private animationFrame = 0;
  private animationTimer = 0;
  private autoDismissTimer = 0;
  private autoDismissTimeoutMs = numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;
  private closeOnEscape = true;

  constructor(adapter?: Partial<MDCSnackbarAdapter>) {
    super({...MDCSnackbarFoundation.defaultAdapter, ...adapter});
  }

  override destroy() {
    this.clearAutoDismissTimer();
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    clearTimeout(this.animationTimer);
    this.animationTimer = 0;
    this.adapter.removeClass(OPENING);
    this.adapter.removeClass(OPEN);
    this.adapter.removeClass(CLOSING);
  }

  open() {
    this.clearAutoDismissTimer();
    this.opened = true;
    this.adapter.notifyOpening();
    this.adapter.removeClass(CLOSING);
    this.adapter.addClass(OPENING);
    this.adapter.announce();

    // Wait a frame once display is no longer "none", to establish basis for
    // animation
    this.runNextAnimationFrame(() => {
      this.adapter.addClass(OPEN);

      this.animationTimer = setTimeout(() => {
        const timeoutMs = this.getTimeoutMs();
        this.handleAnimationTimerEnd();
        this.adapter.notifyOpened();
        if (timeoutMs !== numbers.INDETERMINATE) {
          this.autoDismissTimer = setTimeout(() => {
            this.close(REASON_DISMISS);
          }, timeoutMs);
        }
      }, numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    });
  }

  /**
   * @param reason Why the snackbar was closed. Value will be passed to
   *     CLOSING_EVENT and CLOSED_EVENT via the `event.detail.reason` property.
   *     Standard values are REASON_ACTION and REASON_DISMISS, but custom
   *     client-specific values may also be used if desired.
   */
  close(reason = '') {
    if (!this.opened) {
      // Avoid redundant close calls (and events), e.g. repeated interactions as
      // the snackbar is animating closed
      return;
    }

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.clearAutoDismissTimer();

    this.opened = false;
    this.adapter.notifyClosing(reason);
    this.adapter.addClass(cssClasses.CLOSING);
    this.adapter.removeClass(cssClasses.OPEN);
    this.adapter.removeClass(cssClasses.OPENING);

    clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(() => {
      this.handleAnimationTimerEnd();
      this.adapter.notifyClosed(reason);
    }, numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  }

  isOpen(): boolean {
    return this.opened;
  }

  getTimeoutMs(): number {
    return this.autoDismissTimeoutMs;
  }

  setTimeoutMs(timeoutMs: number) {
    // Use shorter variable names to make the code more readable
    const minValue = numbers.MIN_AUTO_DISMISS_TIMEOUT_MS;
    const maxValue = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS;
    const indeterminateValue = numbers.INDETERMINATE;

    if (timeoutMs === numbers.INDETERMINATE ||
        (timeoutMs <= maxValue && timeoutMs >= minValue)) {
      this.autoDismissTimeoutMs = timeoutMs;
    } else {
      throw new Error(`
        timeoutMs must be an integer in the range ${minValue}–${maxValue}
        (or ${indeterminateValue} to disable), but got '${timeoutMs}'`);
    }
  }

  getCloseOnEscape(): boolean {
    return this.closeOnEscape;
  }

  setCloseOnEscape(closeOnEscape: boolean) {
    this.closeOnEscape = closeOnEscape;
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

  private clearAutoDismissTimer() {
    clearTimeout(this.autoDismissTimer);
    this.autoDismissTimer = 0;
  }

  private handleAnimationTimerEnd() {
    this.animationTimer = 0;
    this.adapter.removeClass(cssClasses.OPENING);
    this.adapter.removeClass(cssClasses.CLOSING);
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to
   * factor in Firefox reflow behavior.
   */
  private runNextAnimationFrame(callback: () => void) {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = 0;
      clearTimeout(this.animationTimer);
      this.animationTimer = setTimeout(callback, 0);
    });
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSnackbarFoundation;
