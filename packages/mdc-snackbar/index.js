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
import {announce} from './util';
import {getCorrectEventName} from '@material/animation/index';

export {MDCSnackbarFoundation};

export class MDCSnackbar extends MDCComponent {
  static attachTo(root) {
    return new MDCSnackbar(root);
  }

  open() {
    this.foundation_.open();
  }

  close() {
    this.foundation_.close();
  }

  /**
   * @return {number}
   */
  get timeoutMs() {
    return this.foundation_.timeoutMs;
  }

  /**
   * @param {number} timeoutMs
   */
  set timeoutMs(timeoutMs) {
    this.foundation_.timeoutMs = timeoutMs;
  }

  getDefaultFoundation() {
    const {SURFACE_SELECTOR, LABEL_SELECTOR} = MDCSnackbarFoundation.strings;
    const transitionEndEventName = getCorrectEventName(window, 'transitionend');
    const getSurfaceEl = () => this.root_.querySelector(SURFACE_SELECTOR);

    /* eslint brace-style: "off" */
    return new MDCSnackbarFoundation({
      announce: () => announce(this.root_, this.root_.querySelector(LABEL_SELECTOR)),
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      containsNode: (target) => this.root_.contains(target),
      setAriaHidden: () => this.root_.setAttribute('aria-hidden', 'true'),
      unsetAriaHidden: () => this.root_.removeAttribute('aria-hidden'),
      registerSurfaceClickHandler: (handler) => getSurfaceEl().addEventListener('click', handler),
      deregisterSurfaceClickHandler: (handler) => getSurfaceEl().removeEventListener('click', handler),
      registerKeyDownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterKeyDownHandler: (handler) => document.removeEventListener('keydown', handler),
      registerTransitionEndHandler: (handler) => this.root_.addEventListener(transitionEndEventName, handler),
      deregisterTransitionEndHandler: (handler) => this.root_.removeEventListener(transitionEndEventName, handler),
      notifyOpening: () => this.emit(MDCSnackbarFoundation.strings.OPENING_EVENT),
      notifyOpened: () => this.emit(MDCSnackbarFoundation.strings.OPENED_EVENT),
      notifyClosing: (reason) => this.emit(MDCSnackbarFoundation.strings.CLOSING_EVENT, {reason}),
      notifyClosed: (reason) => this.emit(MDCSnackbarFoundation.strings.CLOSED_EVENT, {reason}),
    });
  }
}
