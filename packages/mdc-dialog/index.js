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
import MDCDialogFoundation from './foundation';
import * as util from './util';

export {MDCDialogFoundation};

export class MDCDialog extends MDCComponent {
  static attachTo(root) {
    return new MDCDialog(root);
  }

  get open() {
    return this.foundation_.isOpen();
  }

  set open(value) {
    if (value) {
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  get acceptButton() {
    return this.root_.querySelector(MDCDialogFoundation.strings.ACCEPT_SELECTOR);
  }

  get cancelButton() {
    return this.root_.querySelector(MDCDialogFoundation.strings.CANCEL_SELECTOR);
  }

  get dialog() {
    return this.root_.querySelector(MDCDialogFoundation.strings.DIALOG_SURFACE_SELECTOR);
  }

  getDefaultFoundation() {
    const {FOCUSABLE_ELEMENTS, SCROLL_LOCK_TARGET} = MDCDialogFoundation.strings;

    return new MDCDialogFoundation({
      setBackgroundAriaHidden: (ariaHidden) =>
        document.querySelector(SCROLL_LOCK_TARGET).setAttribute('aria-hidden', ariaHidden),
      setDialogAriaHidden: (ariaHidden) => this.dialog.setAttribute('aria-hidden', ariaHidden),
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addScrollLockClass: () =>
        document.querySelector(SCROLL_LOCK_TARGET).classList.add(MDCDialogFoundation.cssClasses.SCROLL_LOCK),
      removeScrollLockClass: () =>
        document.querySelector(SCROLL_LOCK_TARGET).classList.remove(MDCDialogFoundation.cssClasses.SCROLL_LOCK),
      registerInteractionHandler: (evt, handler) =>
        this.root_.addEventListener(evt, handler, util.applyPassive()),
      deregisterInteractionHandler: (evt, handler) =>
        this.root_.removeEventListener(evt, handler, util.applyPassive()),
      registerDialogInteractionHandler: (evt, handler) =>
        this.dialog.addEventListener(evt, handler),
      deregisterDialogInteractionHandler: (evt, handler) =>
        this.dialog.removeEventListener(evt, handler),
      registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
      registerAcceptHandler: (handler) => this.acceptButton.addEventListener('click', handler),
      deregisterAcceptHandler: (handler) => this.acceptButton.removeEventListener('click', handler),
      registerCancelHandler: (handler) => this.cancelButton.addEventListener('click', handler),
      deregisterCancelHandler: (handler) => this.cancelButton.removeEventListener('click', handler),
      registerFocusTrappingHandler: (handler) => document.addEventListener('focus', handler, true),
      deregisterFocusTrappingHandler: (handler) => document.removeEventListener('focus', handler, true),
      numFocusableElements: () => this.dialog.querySelectorAll(FOCUSABLE_ELEMENTS).length,
      resetDialogFocus: () => this.dialog.querySelectorAll(FOCUSABLE_ELEMENTS)[0].focus(),
      setDefaultFocus: () => this.acceptButton.focus(),
      getFocusableElements: () => this.dialog.querySelectorAll(FOCUSABLE_ELEMENTS),
      saveElementTabState: (el) => util.saveElementTabState(el),
      restoreElementTabState: (el) => util.restoreElementTabState(el),
      makeElementUntabbable: (el) => el.setAttribute('tabindex', -1),
      setAttr: (elem, attr, val) => elem.setAttribute(attr, val),
      getFocusedElement: () => document.activeElement,
      setFocusedElement: (element) => element.focus(),
      acceptAction: () => true,
      cancelAction: () => false,
    });
  }
}
