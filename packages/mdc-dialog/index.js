/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MDCComponent} from '@material/base';
import {MDCRipple} from '@material/ripple';

import MDCDialogFoundation from './foundation';
import * as util from './util';

export {MDCDialogFoundation};
export {util};

export class MDCDialog extends MDCComponent {
  static attachTo(root) {
    return new MDCDialog(root);
  }

  get open() {
    return this.foundation_.isOpen();
  }

  get acceptButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.ACCEPT_SELECTOR);
  }

  get dialogSurface_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.DIALOG_SURFACE_SELECTOR);
  }

  initialize() {
    this.lastFocusedTarget = null;
    this.footerBtnRipples_ = [];

    const footerBtns = this.root_.querySelectorAll('.mdc-dialog__footer__button');
    for (let i = 0, footerBtn; footerBtn = footerBtns[i]; i++) {
      this.footerBtnRipples_.push(new MDCRipple(footerBtn));
    }
  }

  destroy() {
    this.footerBtnRipples_.forEach((ripple) => ripple.destroy());
  }

  show() {
    this.foundation_.open();
  }

  close() {
    this.foundation_.close();
  }

  getDefaultFoundation() {
    const {FOCUSABLE_ELEMENTS} = MDCDialogFoundation.strings;

    return new MDCDialogFoundation({
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attr, val) => this.root_.setAttribute(attr, val),
      addBodyClass: (className) => document.body.classList.add(className),
      removeBodyClass: (className) => document.body.classList.remove(className),
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      registerInteractionHandler: (evt, handler) =>
        this.root_.addEventListener(evt, handler, util.applyPassive()),
      deregisterInteractionHandler: (evt, handler) =>
        this.root_.removeEventListener(evt, handler, util.applyPassive()),
      registerSurfaceInteractionHandler: (evt, handler) =>
        this.dialogSurface_.addEventListener(evt, handler),
      deregisterSurfaceInteractionHandler: (evt, handler) =>
        this.dialogSurface_.removeEventListener(evt, handler),
      registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
      registerFocusTrappingHandler: (handler) => document.addEventListener('focus', handler, true),
      deregisterFocusTrappingHandler: (handler) => document.removeEventListener('focus', handler, true),
      numFocusableTargets: () => this.dialogSurface_.querySelectorAll(FOCUSABLE_ELEMENTS).length,
      setDialogFocusFirstTarget: () => this.dialogSurface_.querySelectorAll(FOCUSABLE_ELEMENTS)[0].focus(),
      setInitialFocus: () => this.acceptButton_.focus(),
      getFocusableElements: () => this.dialogSurface_.querySelectorAll(FOCUSABLE_ELEMENTS),
      saveElementTabState: (el) => util.saveElementTabState(el),
      restoreElementTabState: (el) => util.restoreElementTabState(el),
      makeElementUntabbable: (el) => el.setAttribute('tabindex', -1),
      setBodyAttr: (attr, val) => document.body.setAttribute(attr, val),
      rmBodyAttr: (attr) => document.body.removeAttribute(attr),
      getFocusedTarget: () => document.activeElement,
      setFocusedTarget: (target) => target.focus(),
      notifyAccept: () => this.emit('MDCDialog:accept'),
      notifyCancel: () => this.emit('MDCDialog:cancel'),
    });
  }
}
