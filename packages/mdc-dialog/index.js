/**
 * @license
 * Copyright 2017 Google Inc.
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
import {MDCRipple} from '@material/ripple/index';
import {matches} from '@material/base/ponyfill';

import MDCDialogFoundation from './foundation';
import * as util from './util';

export {MDCDialogFoundation};
export {util};

const cssClasses = MDCDialogFoundation.cssClasses;
const strings = MDCDialogFoundation.strings;

export class MDCDialog extends MDCComponent {
  constructor(...args) {
    super(...args);

    /**
     * @type {!focusTrap}
     * @private
     */
    this.focusTrap_;

    /**
     * @type {!Array<!MDCRipple>}
     * @private
     */
    this.buttonRipples_;
  }

  static attachTo(root) {
    return new MDCDialog(root);
  }

  get open() {
    return this.foundation_.isOpen();
  }

  get container_() {
    return this.root_.querySelector(strings.CONTAINER_SELECTOR);
  }

  get surface_() {
    return this.root_.querySelector(strings.SURFACE_SELECTOR);
  }

  get content_() {
    return this.root_.querySelector(strings.CONTENT_SELECTOR);
  }

  get buttons_() {
    return [].slice.call(this.root_.getElementsByClassName(cssClasses.BUTTON));
  }

  initialize() {
    this.focusTrap_ = util.createFocusTrapInstance(this.container_);
    this.buttonRipples_ = [];

    const buttonEls = this.buttons_;
    for (let i = 0, buttonEl; buttonEl = buttonEls[i]; i++) {
      this.buttonRipples_.push(new MDCRipple(buttonEl));
    }
  }

  destroy() {
    this.buttonRipples_.forEach((ripple) => ripple.destroy());
    super.destroy();
  }

  show() {
    this.foundation_.open();
  }

  close() {
    this.foundation_.close();
  }

  getDefaultFoundation() {
    return new MDCDialogFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addBodyClass: (className) => document.body.classList.add(className),
      removeBodyClass: (className) => document.body.classList.remove(className),
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      eventTargetMatchesSelector: (target, selector) => matches(target, selector),
      registerInteractionHandler: (evt, handler) => this.root_.addEventListener(evt, handler),
      deregisterInteractionHandler: (evt, handler) => this.root_.removeEventListener(evt, handler),
      registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
      registerWindowResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterWindowResizeHandler: (handler) => window.removeEventListener('resize', handler),
      trapFocusOnSurface: () => this.focusTrap_.activate(),
      untrapFocusOnSurface: () => this.focusTrap_.deactivate(),
      fixOverflowIE: (callback) => util.fixOverflowIE(this.surface_, callback),
      isContentScrollable: () => util.isScrollable(this.content_),
      areButtonsStacked: () => util.areTopsAligned(this.buttons_),
      getAction: (element) => element.getAttribute(strings.ACTION_ATTRIBUTE),
      notifyOpening: () => this.emit(strings.OPENING_EVENT),
      notifyOpened: () => this.emit(strings.OPENED_EVENT),
      notifyClosing: (action = undefined) => this.emit(strings.CLOSING_EVENT, {action}),
      notifyClosed: (action = undefined) => this.emit(strings.CLOSED_EVENT, {action}),
    });
  }
}
