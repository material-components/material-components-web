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
import {cssClasses, numbers, strings} from './constants';
import * as ponyfill from '@material/dom/ponyfill';

export default class MDCSnackbarFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter() {
    return {
      announce: () => {},

      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},

      setAriaHidden: () => {},
      unsetAriaHidden: () => {},

      registerKeyDownHandler: (/* handler: !EventListener */) => {},
      deregisterKeyDownHandler: (/* handler: !EventListener */) => {},
      registerSurfaceClickHandler: (/* handler: !EventListener */) => {},
      deregisterSurfaceClickHandler: (/* handler: !EventListener */) => {},
      registerTransitionEndHandler: (/* handler: !EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: !EventListener */) => {},

      notifyOpening: () => {},
      notifyOpened: () => {},
      notifyClosing: (/* reason: string */) => {},
      notifyClosed: (/* reason: string */) => {},
    };
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
      throw new Error(`timeoutMs must be an integer in the range ${minValue}–${maxValue}`);
    }
  }

  constructor(adapter) {
    super(Object.assign(MDCSnackbarFoundation.defaultAdapter, adapter));

    /**
     * @type {boolean}
     */
    this.closeOnEscape = true;

    /**
     * @type {number}
     * @private
     */
    this.timeoutMs_ = numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;

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

    /**
     * @param {!MouseEvent} evt
     * @private
     */
    this.surfaceClickHandler_ = (evt) => {
      const target = /** @type {!Element} */ (evt.target);
      if (this.isActionButtonEl_(target)) {
        this.close(strings.REASON_ACTION);
      } else if (this.isActionIconEl_(target)) {
        this.close(strings.REASON_DISMISS);
      }
    };

    /**
     * @param {!KeyboardEvent} evt
     * @private
     */
    this.keyDownHandler_ = (evt) => {
      if (this.closeOnEscape && (evt.key === 'Escape' || evt.keyCode === 27)) {
        this.close(strings.REASON_DISMISS);
      }
    };
  }

  init() {
    this.adapter_.setAriaHidden();
    this.adapter_.registerSurfaceClickHandler(this.surfaceClickHandler_);
  }

  destroy() {
    const {OPEN, CLOSING} = cssClasses;
    this.clearAutoDismissTimer_();
    this.adapter_.deregisterKeyDownHandler(this.keyDownHandler_);
    this.adapter_.deregisterSurfaceClickHandler(this.surfaceClickHandler_);
    this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    this.adapter_.removeClass(OPEN);
    this.adapter_.removeClass(CLOSING);
  }

  open() {
    const {OPEN, CLOSING} = cssClasses;
    if (this.adapter_.hasClass(OPEN)) {
      return;
    }

    this.clearAutoDismissTimer_();
    this.setTransitionEndHandler_(() => {
      this.adapter_.notifyOpened();
    });
    this.autoDismissTimer_ = setTimeout(() => this.close(strings.REASON_DISMISS), this.timeoutMs);

    this.adapter_.registerKeyDownHandler(this.keyDownHandler_);
    this.adapter_.unsetAriaHidden();
    this.adapter_.announce();
    this.adapter_.addClass(OPEN);
    this.adapter_.removeClass(CLOSING);
    this.adapter_.notifyOpening();
  }

  /**
   * @param {string=} reason
   */
  close(reason = '') {
    const {OPEN, CLOSING} = cssClasses;
    if (!this.adapter_.hasClass(OPEN)) {
      return;
    }

    this.clearAutoDismissTimer_();
    this.setTransitionEndHandler_(() => {
      this.adapter_.removeClass(CLOSING);
      this.adapter_.notifyClosed(reason);
    });

    this.adapter_.deregisterKeyDownHandler(this.keyDownHandler_);
    this.adapter_.setAriaHidden();
    this.adapter_.addClass(CLOSING);
    this.adapter_.removeClass(OPEN);
    this.adapter_.notifyClosing(reason);
  }

  /**
   * @param {function(): undefined} handler
   * @private
   */
  setTransitionEndHandler_(handler) {
    this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);

    this.transitionEndHandler_ = (evt) => {
      const target = /** @type {!Element} */ (evt.target);
      // Ignore `transitionend` events that bubble up from action button/icon ripple states.
      if (!this.isSurfaceEl_(target)) {
        return;
      }
      handler();
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    };

    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
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
