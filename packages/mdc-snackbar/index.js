/**
 * @license
 * Copyright 2016 Google Inc.
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

import {MDCComponent} from '@material/base/index';
import MDCSnackbarFoundation from './foundation';
import {MDCAnnouncer} from '@material/a11y';
import {getCorrectEventName} from '@material/animation/index';

export {MDCSnackbarFoundation};

export class MDCSnackbar extends MDCComponent {
  static attachTo(root) {
    return new MDCSnackbar(root);
  }

  /**
   * @param {!MDCAnnouncer} announcer
   */
  initialize(announcer = new MDCAnnouncer()) {
    /**
     * @type {!MDCAnnouncer}
     * @private
     */
    this.announcer_ = announcer;
  }

  destroy() {
    super.destroy();

    if (this.announcer_) {
      this.announcer_.destroy();
    }
  }

  show() {
    this.foundation_.show();
  }

  hide() {
    this.foundation_.hide();
  }

  getDefaultFoundation() {
    const {LABEL_SELECTOR, ACTION_BUTTON_SELECTOR} = MDCSnackbarFoundation.strings;
    const transitionEndEventName = getCorrectEventName(window, 'transitionend');

    const getLabel = () => this.root_.querySelector(LABEL_SELECTOR);
    const getActionButton = () => this.root_.querySelector(ACTION_BUTTON_SELECTOR);

    const withActionBtn = (callback) => {
      const actionButtonEl = getActionButton();
      if (actionButtonEl) {
        callback(actionButtonEl);
      }
    };

    const announce = () => {
      const labelEl = getLabel();
      const labelText = labelEl.textContent;

      // Clear `textContent` to force a DOM mutation that will be detected by screen readers.
      // `aria-live` elements are only announced when the element's `textContent` *changes*,
      // so snackbars sent to the browser in the initial HTML response won't be read unless we
      // clear the element's `textContent` first.
      // Similarly, displaying the same message twice in a row doesn't trigger a DOM mutation event,
      // so screen readers won't announce the second message unless we clear `textContent`.
      // TODO(acdvorak): Can we just append a dummy HTML element like `<div>.</div>` and then immediately remove it?
      labelEl.textContent = '';
      setTimeout(() => labelEl.textContent = labelText, 1); // Uses non-zero timer to make VoiceOver and NVDA work

      this.announcer_.say(getLabel().textContent);
    };

    /* eslint brace-style: "off" */
    return new MDCSnackbarFoundation({
      announce: () => announce(), // this.announcer_.say(getLabel().textContent)
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAriaHidden: () => this.root_.setAttribute('aria-hidden', 'true'),
      unsetAriaHidden: () => this.root_.removeAttribute('aria-hidden'),
      visibilityIsHidden: () => document.hidden,
      registerSurfaceClickHandler: (handler) => this.root_.addEventListener('click', handler),
      deregisterSurfaceClickHandler: (handler) => this.root_.removeEventListener('click', handler),
      registerCapturedBlurHandler: (handler) => withActionBtn((el) => el.addEventListener('blur', handler, true)),
      deregisterCapturedBlurHandler: (handler) => withActionBtn((el) => el.removeEventListener('blur', handler, true)),
      registerVisibilityChangeHandler: (handler) => document.addEventListener('visibilitychange', handler),
      deregisterVisibilityChangeHandler: (handler) => document.removeEventListener('visibilitychange', handler),
      registerCapturedInteractionHandler: (evt, handler) => document.body.addEventListener(evt, handler, true),
      deregisterCapturedInteractionHandler: (evt, handler) => document.body.removeEventListener(evt, handler, true),
      registerActionClickHandler: (handler) => withActionBtn((el) => el.addEventListener('click', handler)),
      deregisterActionClickHandler: (handler) => withActionBtn((el) => el.removeEventListener('click', handler)),
      registerTransitionEndHandler: (handler) => this.root_.addEventListener(transitionEndEventName, handler),
      deregisterTransitionEndHandler: (handler) => this.root_.removeEventListener(transitionEndEventName, handler),
      notifyShow: () => this.emit(MDCSnackbarFoundation.strings.SHOW_EVENT),
      notifyHide: () => this.emit(MDCSnackbarFoundation.strings.HIDE_EVENT),
    });
  }
}
