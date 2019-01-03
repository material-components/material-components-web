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

/* eslint no-unused-vars: ["error", {"argsIgnorePattern": "evt", "varsIgnorePattern": "Adapter$"}] */

import MDCFoundation from '@material/base/foundation';
import MDCSnackbarAdapter from './adapter';
import {cssClasses, numbers, strings} from './constants';

const {OPENING, OPEN, CLOSING} = cssClasses;
const {REASON_ACTION, REASON_DISMISS} = strings;

class MDCSnackbarFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  /**
   * @return {!MDCSnackbarAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSnackbarAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      announce: () => {},
      notifyOpening: () => {},
      notifyOpened: () => {},
      notifyClosing: (/* reason: string */) => {},
      notifyClosed: (/* reason: string */) => {},
    });
  }

  /**
   * @param {!MDCSnackbarAdapter=} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSnackbarFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.isOpen_ = false;

    /** @private {number} */
    this.animationFrame_ = 0;

    /** @private {number} */
    this.animationTimer_ = 0;

    /** @private {number} */
    this.autoDismissTimer_ = 0;

    /** @private {number} */
    this.autoDismissTimeoutMs_ = numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;

    /** @private {boolean} */
    this.closeOnEscape_ = true;
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
        this.handleAnimationTimerEnd_();
        this.adapter_.notifyOpened();
        this.autoDismissTimer_ = setTimeout(() => {
          this.close(REASON_DISMISS);
        }, this.getTimeoutMs());
      }, numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    });
  }

  /**
   * @param {string=} reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
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

  /**
   * @return {boolean}
   */
  isOpen() {
    return this.isOpen_;
  }

  /**
   * @return {number}
   */
  getTimeoutMs() {
    return this.autoDismissTimeoutMs_;
  }

  /**
   * @param {number} timeoutMs
   */
  setTimeoutMs(timeoutMs) {
    // Use shorter variable names to make the code more readable
    const minValue = numbers.MIN_AUTO_DISMISS_TIMEOUT_MS;
    const maxValue = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS;

    if (timeoutMs <= maxValue && timeoutMs >= minValue) {
      this.autoDismissTimeoutMs_ = timeoutMs;
    } else {
      throw new Error(`timeoutMs must be an integer in the range ${minValue}–${maxValue}, but got '${timeoutMs}'`);
    }
  }

  /**
   * @return {boolean}
   */
  getCloseOnEscape() {
    return this.closeOnEscape_;
  }

  /**
   * @param {boolean} closeOnEscape
   */
  setCloseOnEscape(closeOnEscape) {
    this.closeOnEscape_ = closeOnEscape;
  }

  /**
   * @param {!KeyboardEvent} evt
   */
  handleKeyDown(evt) {
    if (this.getCloseOnEscape() && (evt.key === 'Escape' || evt.keyCode === 27)) {
      this.close(REASON_DISMISS);
    }
  }

  /**
   * @param {!MouseEvent} evt
   */
  handleActionButtonClick(evt) {
    this.close(REASON_ACTION);
  }

  /**
   * @param {!MouseEvent} evt
   */
  handleActionIconClick(evt) {
    this.close(REASON_DISMISS);
  }

  /** @private */
  clearAutoDismissTimer_() {
    clearTimeout(this.autoDismissTimer_);
    this.autoDismissTimer_ = 0;
  }

  /** @private */
  handleAnimationTimerEnd_() {
    this.animationTimer_ = 0;
    this.adapter_.removeClass(cssClasses.OPENING);
    this.adapter_.removeClass(cssClasses.CLOSING);
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
   * @param {Function} callback
   * @private
   */
  runNextAnimationFrame_(callback) {
    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = requestAnimationFrame(() => {
      this.animationFrame_ = 0;
      clearTimeout(this.animationTimer_);
      this.animationTimer_ = setTimeout(callback, 0);
    });
  }
}

export default MDCSnackbarFoundation;
