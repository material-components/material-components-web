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

import {MDCFoundation} from '@material/base/index';
import MDCSnackbarAdapter from './adapter';
import {cssClasses, numbers, strings} from './constants';
import * as ponyfill from '@material/dom/ponyfill';

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
      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},

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

    /**
     * @type {number}
     * @private
     */
    this.timeoutMs_ = numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;

    /**
     * @type {boolean}
     * @private
     */
    this.closeOnEscape_ = true;

    /**
     * @type {?number}
     * @private
     */
    this.autoDismissTimer_ = null;

    /**
     * @type {?function(evt: !Event): undefined}
     * @private
     */
    this.transitionEndHandler_ = null;
  }

  destroy() {
    const {OPEN, CLOSING} = cssClasses;
    this.clearAutoDismissTimer_();
    this.adapter_.removeClass(OPEN);
    this.adapter_.removeClass(CLOSING);
  }

  open() {
    if (this.isOpen) {
      return;
    }

    const {OPEN, CLOSING} = cssClasses;

    this.clearAutoDismissTimer_();
    this.setTransitionEndHandler_(() => {
      this.adapter_.notifyOpened();
    });
    this.autoDismissTimer_ = setTimeout(() => this.close(strings.REASON_DISMISS), this.timeoutMs);

    this.adapter_.addClass(OPEN);
    this.adapter_.removeClass(CLOSING);
    this.adapter_.notifyOpening();
  }

  /**
   * @param {string=} reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
   *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
   *     client-specific values may also be used if desired.
   */
  close(reason = '') {
    if (!this.isOpen) {
      return;
    }

    const {OPEN, CLOSING} = cssClasses;

    this.clearAutoDismissTimer_();
    this.setTransitionEndHandler_(() => {
      this.adapter_.removeClass(CLOSING);
      this.adapter_.notifyClosed(reason);
    });

    this.adapter_.addClass(CLOSING);
    this.adapter_.removeClass(OPEN);
    this.adapter_.notifyClosing(reason);
  }

  /**
   * @return {number}
   */
  get timeoutMs() {
    return this.timeoutMs_;
  }

  /**
   * @param {number} timeoutMs
   */
  set timeoutMs(timeoutMs) {
    const {
      MIN_AUTO_DISMISS_TIMEOUT_MS: minValue,
      MAX_AUTO_DISMISS_TIMEOUT_MS: maxValue,
    } = numbers;

    if (timeoutMs <= maxValue && timeoutMs >= minValue) {
      this.timeoutMs_ = timeoutMs;
    } else {
      throw new Error(`timeoutMs must be an integer in the range ${minValue}–${maxValue}, but got '${timeoutMs}'`);
    }
  }

  /**
   * @return {boolean}
   */
  get closeOnEscape() {
    return this.closeOnEscape_;
  }

  /**
   * @param {boolean} closeOnEscape
   */
  set closeOnEscape(closeOnEscape) {
    this.closeOnEscape_ = closeOnEscape;
  }

  /**
   * @return {boolean}
   */
  get isOpen() {
    const {OPEN, CLOSING} = cssClasses;
    return this.adapter_.hasClass(OPEN) || this.adapter_.hasClass(CLOSING);
  }

  /**
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    if (this.transitionEndHandler_) {
      this.transitionEndHandler_(evt);
    }
  }

  /**
   * @param {!MouseEvent} evt
   * @private
   */
  handleInteraction(evt) {
    const target = /** @type {!Element} */ (evt.target);
    if (this.isActionButtonEl_(target)) {
      this.close(strings.REASON_ACTION);
    } else if (this.isActionIconEl_(target)) {
      this.close(strings.REASON_DISMISS);
    }
  }

  /**
   * @param {!KeyboardEvent} evt
   * @private
   */
  handleDocumentKeyDown(evt) {
    if (this.closeOnEscape && (evt.key === 'Escape' || evt.keyCode === 27)) {
      this.close(strings.REASON_DISMISS);
    }
  }

  /**
   * @param {function(): undefined} handler
   * @private
   */
  setTransitionEndHandler_(handler) {
    this.transitionEndHandler_ = (evt) => {
      const target = /** @type {!Element} */ (evt.target);
      // Ignore `transitionend` events that bubble up from action button/icon ripple states.
      if (!this.isSurfaceEl_(target)) {
        return;
      }
      handler();
      this.transitionEndHandler_ = null;
    };
  }

  /** @private */
  clearAutoDismissTimer_() {
    clearTimeout(this.autoDismissTimer_);
  }

  /**
   * @param {!Element} target
   * @return {boolean}
   * @private
   */
  isSurfaceEl_(target) {
    const {SURFACE_SELECTOR} = strings;
    return ponyfill.matches(target, SURFACE_SELECTOR);
  }

  /**
   * @param {!Element} target
   * @return {boolean}
   * @private
   */
  isActionButtonEl_(target) {
    const {ACTION_BUTTON_SELECTOR} = strings;
    return Boolean(ponyfill.closest(target, ACTION_BUTTON_SELECTOR));
  }

  /**
   * @param {!Element} target
   * @return {boolean}
   * @private
   */
  isActionIconEl_(target) {
    const {ACTION_ICON_SELECTOR} = strings;
    return Boolean(ponyfill.closest(target, ACTION_ICON_SELECTOR));
  }
}

export default MDCSnackbarFoundation;
