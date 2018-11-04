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
import {cssClasses, strings} from './constants';

export default class MDCSnackbarFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      announce: (/* message: string */) => {},
      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      isActionButton: (/* evt: !Event */) => /* boolean */ false,
      setAriaHidden: () => {},
      unsetAriaHidden: () => {},
      registerSurfaceClickHandler: (/* handler: EventListener */) => {},
      deregisterSurfaceClickHandler: (/* handler: EventListener */) => {},
      registerKeyDownHandler: (/* handler: EventListener */) => {},
      deregisterKeyDownHandler: (/* handler: EventListener */) => {},
      registerTransitionEndHandler: (/* handler: EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: EventListener */) => {},
      notifyAction: () => {},
      notifyOpening: () => {},
      notifyOpened: () => {},
      notifyClosing: (/* reason: string */) => {},
      notifyClosed: (/* reason: string */) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCSnackbarFoundation.defaultAdapter, adapter));

    this.surfaceClickHandler_ = (evt) => {
      if (this.adapter_.isActionButton(evt)) {
        this.adapter_.notifyAction();
        this.close(strings.REASON_ACTION_CLICK);
      } else {
        this.close(strings.REASON_SURFACE_CLICK);
      }
    };

    this.keyDownHandler_ = (evt) => {
      if (evt.key === 'Escape' || evt.keyCode === 27) {
        this.close(strings.REASON_ESCAPE_KEY);
      }
    };
  }

  init() {
    this.adapter_.registerKeyDownHandler(this.keyDownHandler_);
    this.adapter_.registerSurfaceClickHandler(this.surfaceClickHandler_);
    this.adapter_.setAriaHidden();
  }

  destroy() {
    this.adapter_.deregisterKeyDownHandler(this.keyDownHandler_);
    this.adapter_.deregisterSurfaceClickHandler(this.surfaceClickHandler_);
    this.clearTimers_();
  }

  /** @private */
  clearTimers_() {
    clearTimeout(this.timer_);
    if (this.transitionEndHandler_) {
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    }
  }

  open() {
    const {OPEN, CLOSING} = MDCSnackbarFoundation.cssClasses;

    this.clearTimers_();

    // TODO(acdvorak): Make timeout duration a constant and/or parameterizable.
    // TODO(acdvorak): Set timeout dynamically depending on # of characters?
    this.timer_ = setTimeout(() => this.close(strings.REASON_TIMEOUT), 4000);

    this.transitionEndHandler_ = () => {
      this.adapter_.notifyOpened();
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    };
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);

    this.adapter_.unsetAriaHidden();
    this.adapter_.announce();
    this.adapter_.addClass(OPEN);
    this.adapter_.removeClass(CLOSING);
    this.adapter_.notifyOpening();
  }

  close(reason = strings.REASON_PROGRAMMATIC) {
    const {OPEN, CLOSING} = MDCSnackbarFoundation.cssClasses;
    if (!this.adapter_.hasClass(OPEN)) {
      return;
    }

    this.clearTimers_();

    this.transitionEndHandler_ = () => {
      this.adapter_.removeClass(CLOSING);
      this.adapter_.notifyClosed(reason);
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    };
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);

    this.adapter_.addClass(CLOSING);
    this.adapter_.removeClass(OPEN);
    this.adapter_.notifyClosing(reason);
  }
}
