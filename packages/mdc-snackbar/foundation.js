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

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setAriaHidden: () => {},
      unsetAriaHidden: () => {},
      setActionAriaHidden: () => {},
      unsetActionAriaHidden: () => {},
      setActionText: (/* actionText: string */) => {},
      getLabelText: () => {},
      setLabelText: (/* message: string */) => {},
      setFocus: () => {},
      isFocused: () => /* boolean */ false,
      visibilityIsHidden: () => /* boolean */ false,
      registerCapturedBlurHandler: (/* handler: EventListener */) => {},
      deregisterCapturedBlurHandler: (/* handler: EventListener */) => {},
      registerVisibilityChangeHandler: (/* handler: EventListener */) => {},
      deregisterVisibilityChangeHandler: (/* handler: EventListener */) => {},
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
  }

  init() {
    this.adapter_.registerActionClickHandler(this.actionClickHandler_);
    this.adapter_.setAriaHidden();
    this.adapter_.setActionAriaHidden();
  }

  destroy() {
    this.adapter_.deregisterActionClickHandler(this.actionClickHandler_);
  }

  show(data) {
    this.adapter_.unsetAriaHidden();
    this.adapter_.unsetActionAriaHidden();
    this.adapter_.addClass('mdc-snackbar--open');

    const labelText = this.adapter_.getLabelText();

    // Clear `textContent` to force a DOM mutation that will be detected by screen readers.
    // `aria-live` elements are only announced when the element's `textContent` *changes*,
    // so snackbars sent to the browser in the initial HTML response won't be read unless we
    // clear the element's `textContent` first.
    // Similarly, displaying the same message twice in a row doesn't trigger a DOM mutation event,
    // so screen readers won't announce the second message unless we clear `textContent`.
    // TODO(acdvorak): Can we just append a dummy HTML element like `<div>.</div>` and then immediately remove it?
    this.adapter_.setLabelText('');

    setTimeout(() => {
      this.adapter_.setLabelText(labelText);
    }, 1); // non-zero timer to make VoiceOver and NVDA work
  }

  hide() {
    this.adapter_.addClass('mdc-snackbar--closing');
    this.adapter_.removeClass('mdc-snackbar--open');

    setTimeout(() => this.adapter_.removeClass('mdc-snackbar--closing'), numbers.ANIMATION_EXIT_TIME_MS);
  }
}
