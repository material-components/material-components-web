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
import {MDCSupport} from '@material/base/support';

import MDCDialogFoundation from './foundation';
import * as util from './util';

export {MDCDialogFoundation};
export {util};

export class MDCDialog extends MDCComponent {
  constructor(...args) {
    super(...args);

    /**
     * @type {!MDCSupport}
     * @private
     */
    this.support_;

    /**
     * @type {!focusTrap}
     * @private
     */
    this.focusTrap_;

    /**
     * @type {!Array<!MDCRipple>}
     * @private
     */
    this.footerBtnRipples_;
  }

  static attachTo(root) {
    return new MDCDialog(root);
  }

  get open() {
    return this.foundation_.isOpen();
  }

  get dialogSurface_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.DIALOG_CONTAINER_SELECTOR);
  }

  initialize({
    supportFactory = () => new MDCSupport(),
    focusTrapFactory = undefined,
  } = {}) {
    this.support_ = supportFactory();
    this.focusTrap_ = util.createFocusTrapInstance(this.dialogSurface_, undefined, focusTrapFactory);
    this.footerBtnRipples_ = [];

    const footerBtns = this.root_.querySelectorAll('.mdc-dialog__button');
    for (let i = 0, footerBtn; footerBtn = footerBtns[i]; i++) {
      this.footerBtnRipples_.push(new MDCRipple(footerBtn));
    }
  }

  destroy() {
    this.footerBtnRipples_.forEach((ripple) => ripple.destroy());
    super.destroy();
  }

  show() {
    this.foundation_.open();

    // TODO(acdvorak): Refactor
    this.detectStackedButtons_();
    this.detectScrollableContent_();
  }

  /** @private */
  detectStackedButtons_() {
    /** @type {!Array<!HTMLElement>} */
    const buttonEls = [].slice.call(this.root_.querySelectorAll('.mdc-dialog__button'));
    const offsetTopSet = new Set();
    buttonEls.forEach((buttonEl) => offsetTopSet.add(buttonEl.offsetTop));

    const isStacked = offsetTopSet.size > 1;
    if (isStacked) {
      this.root_.classList.add('mdc-dialog--stacked');
    } else {
      this.root_.classList.remove('mdc-dialog--stacked');
    }
  }

  /**
   * @param {boolean=} bypassRAF
   * @private
   */
  detectScrollableContent_(bypassRAF = false) {
    if (this.support_.hasFlexItemMaxHeightBug && !bypassRAF) {
      // RAF causes a bit of jank, but it's necessary to force IE to render correctly.
      requestAnimationFrame(() => {
        this.fixContentOverflow_();
        this.detectScrollableContent_(true);
      });
      return;
    }

    const bodyEl = this.root_.querySelector('.mdc-dialog__content');
    if (bodyEl && bodyEl.scrollHeight > bodyEl.offsetHeight) {
      this.root_.classList.add('mdc-dialog--scrollable');
    } else {
      this.root_.classList.remove('mdc-dialog--scrollable');
    }
  }

  /** @private */
  fixContentOverflow_() {
    const bodyEl = this.root_.querySelector('.mdc-dialog__content');
    if (this.support_.hasFlexItemMaxHeightBug && bodyEl) {
      this.support_.fixFlexItemMaxHeightBug(bodyEl);
    }
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
      registerSurfaceInteractionHandler: (evt, handler) => this.dialogSurface_.addEventListener(evt, handler),
      deregisterSurfaceInteractionHandler: (evt, handler) => this.dialogSurface_.removeEventListener(evt, handler),
      registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
      notifyYes: () => this.emit(MDCDialogFoundation.strings.YES_EVENT),
      notifyNo: () => this.emit(MDCDialogFoundation.strings.NO_EVENT),
      notifyCancel: () => this.emit(MDCDialogFoundation.strings.CANCEL_EVENT),
      notifyOpening: () => this.emit(MDCDialogFoundation.strings.OPENING_EVENT),
      notifyOpened: () => this.emit(MDCDialogFoundation.strings.OPENED_EVENT),
      notifyClosing: () => this.emit(MDCDialogFoundation.strings.CLOSING_EVENT),
      notifyClosed: () => this.emit(MDCDialogFoundation.strings.CLOSED_EVENT),
      trapFocusOnSurface: () => this.focusTrap_.activate(),
      untrapFocusOnSurface: () => this.focusTrap_.deactivate(),
      isDialog: (el) => el === this.dialogSurface_,
    });
  }
}
