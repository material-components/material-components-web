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
import {cssClasses, strings, numbers} from './constants';
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
      announce: (/* message: string */) => {},
      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      containsNode: (/* target: !Element */) => /* boolean */ false,
      setAriaHidden: () => {},
      unsetAriaHidden: () => {},
      registerSurfaceHandler: (/* eventName: string, handler: !EventListener */) => {},
      deregisterSurfaceHandler: (/* eventName: string, handler: !EventListener */) => {},
      registerSurfaceClickHandler: (/* handler: !EventListener */) => {},
      deregisterSurfaceClickHandler: (/* handler: !EventListener */) => {},
      registerKeyDownHandler: (/* handler: !EventListener */) => {},
      deregisterKeyDownHandler: (/* handler: !EventListener */) => {},
      registerTransitionEndHandler: (/* handler: !EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: !EventListener */) => {},
      notifyOpening: () => {},
      notifyOpened: () => {},
      notifyClosing: (/* reason: string */) => {},
      notifyClosed: (/* reason: string */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCSnackbarFoundation.defaultAdapter, adapter));

    this.surfaceTouchStartHandler_ = () => {
      // If the user needs to copy the snackbar's label text (e.g., to file a bug report), they will click and drag
      // on the surface (or long-press on mobile).
      // When the user starts interacting with the surface, disable the automatic dismissal timeout to give the user
      // enough time to highlight and copy the desired text.
      // The user can close the snackbar by clicking anywhere on the surface.
      clearTimeout(this.autoDismissTimer_);
    };

    this.surfaceClickHandler_ = (evt) => {
      if (this.isActionButtonEl_(evt.target)) {
        this.close(strings.REASON_ACTION);
      } else {
        this.close(strings.REASON_SURFACE);
      }
    };

    this.keyDownHandler_ = (evt) => {
      if (evt.key === 'Escape' || evt.keyCode === 27) {
        this.close(strings.REASON_ESCAPE);
      }
    };

    this.transitionEndHandler_ = null;
  }

  init() {
    this.adapter_.registerKeyDownHandler(this.keyDownHandler_);
    this.adapter_.registerSurfaceClickHandler(this.surfaceClickHandler_);
    ['touchstart', 'pointerdown', 'mousedown'].forEach((eventName) => {
      this.adapter_.registerSurfaceHandler(eventName, this.surfaceTouchStartHandler_);
    });
    this.adapter_.setAriaHidden();
  }

  destroy() {
    this.adapter_.deregisterKeyDownHandler(this.keyDownHandler_);
    this.adapter_.deregisterSurfaceClickHandler(this.surfaceClickHandler_);
    ['touchstart', 'pointerdown', 'mousedown'].forEach((eventName) => {
      this.adapter_.deregisterSurfaceHandler(eventName, this.surfaceTouchStartHandler_);
    });
    this.clearTimers_();
  }

  // TODO(acdvorak): Multiple consecutive calls to `open()` cause visible flicker due to `aria-live` delay in util.js.
  open() {
    const {OPEN, CLOSING} = cssClasses;
    const {AUTO_DISMISS_TIMEOUT_MS} = numbers;

    this.clearTimers_();

    // TODO(acdvorak): Make timeout duration parameterizable?
    this.autoDismissTimer_ = setTimeout(() => this.close(strings.REASON_TIMEOUT), AUTO_DISMISS_TIMEOUT_MS);

    this.setTransitionEndHandler_(() => {
      this.adapter_.notifyOpened();
    });

    this.adapter_.unsetAriaHidden();
    this.adapter_.announce();
    this.adapter_.addClass(OPEN);
    this.adapter_.removeClass(CLOSING);
    this.adapter_.notifyOpening();
  }

  close(reason = strings.REASON_PROGRAMMATIC) {
    const {OPEN, CLOSING} = cssClasses;
    if (!this.adapter_.hasClass(OPEN)) {
      return;
    }

    this.clearTimers_();

    this.setTransitionEndHandler_(() => {
      this.adapter_.removeClass(CLOSING);
      this.adapter_.notifyClosed(reason);
    });

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
    if (this.transitionEndHandler_) {
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    }

    this.transitionEndHandler_ = (evt) => {
      // Ignore `transitionend` events that bubble up from the action button ripple.
      if (!this.isContainerEl_(evt.target)) {
        return;
      }
      handler();
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    };

    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
  }

  /** @private */
  clearTimers_() {
    clearTimeout(this.autoDismissTimer_);
    if (this.transitionEndHandler_) {
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    }
    this.transitionEndHandler_ = null;
  }

  /**
   * @param {!Element} target
   * @return {boolean}
   * @private
   */
  isContainerEl_(target) {
    const {CONTAINER_SELECTOR} = strings;
    return ponyfill.matches(target, CONTAINER_SELECTOR);
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
}
