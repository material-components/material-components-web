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
import * as ponyfill from '@material/dom/ponyfill';

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
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setAriaHidden: () => {},
      unsetAriaHidden: () => {},
      visibilityIsHidden: () => /* boolean */ false,
      registerSurfaceClickHandler: (/* handler: EventListener */) => {},
      deregisterSurfaceClickHandler: (/* handler: EventListener */) => {},
      registerCapturedBlurHandler: (/* handler: EventListener */) => {},
      deregisterCapturedBlurHandler: (/* handler: EventListener */) => {},
      registerVisibilityChangeHandler: (/* handler: EventListener */) => {},
      deregisterVisibilityChangeHandler: (/* handler: EventListener */) => {},
      registerKeyDownHandler: (/* handler: EventListener */) => {},
      deregisterKeyDownHandler: (/* handler: EventListener */) => {},
      registerCapturedInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterCapturedInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      registerActionClickHandler: (/* handler: EventListener */) => {},
      deregisterActionClickHandler: (/* handler: EventListener */) => {},
      registerTransitionEndHandler: (/* handler: EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: EventListener */) => {},
      notifyShow: () => {},
      notifyHide: () => {},
    };
  }

  get active() {
    return this.active_;
  }

  constructor(adapter) {
    super(Object.assign(MDCSnackbarFoundation.defaultAdapter, adapter));

    this.visibilitychangeHandler_ = () => {
      // clearTimeout(this.timeoutId_);

      if (!this.adapter_.visibilityIsHidden()) {
        // setTimeout(this.cleanup_.bind(this), this.snackbarData_.timeout || numbers.MESSAGE_TIMEOUT);
      }
    };

    this.actionClickHandler_ = (evt) => {
      if (ponyfill.closest(evt.target, '.mdc-snackbar__action-button')) {
        this.hide();
      }
    };

    this.surfaceClickHandler_ = () => {
      this.hide();
    };

    this.keyDownHandler_ = (evt) => {
      if (evt.key === 'Escape' || evt.keyCode === 27) {
        this.hide();
      }
    };
  }

  init() {
    this.adapter_.registerKeyDownHandler(this.keyDownHandler_);
    this.adapter_.registerSurfaceClickHandler(this.surfaceClickHandler_);
    this.adapter_.registerActionClickHandler(this.actionClickHandler_);
    this.adapter_.setAriaHidden();
  }

  destroy() {
    this.adapter_.deregisterKeyDownHandler(this.keyDownHandler_);
    this.adapter_.deregisterSurfaceClickHandler(this.surfaceClickHandler_);
    this.adapter_.deregisterActionClickHandler(this.actionClickHandler_);
  }

  show() {
    const {OPEN} = MDCSnackbarFoundation.cssClasses;

    this.adapter_.unsetAriaHidden();
    this.adapter_.announce();
    this.adapter_.addClass(OPEN);
  }

  hide() {
    const {OPEN, CLOSING} = MDCSnackbarFoundation.cssClasses;

    const transitionEndHandler = () => {
      this.adapter_.removeClass(CLOSING);
      this.adapter_.deregisterTransitionEndHandler(transitionEndHandler);
    };
    this.adapter_.registerTransitionEndHandler(transitionEndHandler);

    this.adapter_.addClass(CLOSING);
    this.adapter_.removeClass(OPEN);
  }
}
