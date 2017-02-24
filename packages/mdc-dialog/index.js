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

  get dialog_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.DIALOG_SURFACE_SELECTOR);
  }

  get confirmationDialog_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.CONFIRMATION_DIALOG_SELECTOR);
  }

  get acceptButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.ACCEPT_SELECTOR);
  }

  get cancelButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.CANCEL_SELECTOR);
  }

  get navigationAcceptButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.NAV_ACCEPT_SELECTOR);
  }

  get navigationCancelButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.NAV_CANCEL_SELECTOR);
  }

  get confirmationAcceptButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.CONFIRMATION_ACCEPT_SELECTOR);
  }

  get confirmationCancelButton_() {
    return this.root_.querySelector(MDCDialogFoundation.strings.CONFIRMATION_CANCEL_SELECTOR);
  }

  getDefaultFoundation() {
    const {FOCUSABLE_ELEMENTS, OPACITY_VAR_NAME, SCROLL_LOCK_TARGET} = MDCDialogFoundation.strings;

    /**
     * All Dialog types share the same props except for auto save dialogs.
     * If it is auto save, we do not merge these adapter objects, otherwise
     * we supplement our adapter with the standard dialog properties.
     */
    const adapter = {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addConfirmClass: (classname) => this.confirmationDialog_.classList.add(classname),
      removeConfirmClass: (classname) => this.confirmationDialog_.classList.remove(classname),
      addScrollLockClass: (className) => document.querySelector(SCROLL_LOCK_TARGET).classList.add(MDCDialogFoundation.cssClasses.SCROLL_LOCK),
      removeScrollLockClass: (className) => document.querySelector(SCROLL_LOCK_TARGET).classList.remove(MDCDialogFoundation.cssClasses.SCROLL_LOCK),
      hasClass: (className) => this.root_.classList.contains(className),
      hasNavigation: () => Boolean(this.navigationAcceptButton_),
      hasNavigationAutoSave: () => (Boolean(this.navigationAcceptButton_) && !Boolean(this.navigationCancelButton_)),
      registerInteractionHandler: (evt, handler) =>
        this.root_.addEventListener(util.remapEvent(evt), handler, util.applyPassive()),
      deregisterInteractionHandler: (evt, handler) =>
        this.root_.removeEventListener(util.remapEvent(evt), handler, util.applyPassive()),
      registerDialogInteractionHandler: (evt, handler) =>
        this.dialog_.addEventListener(util.remapEvent(evt), handler),
      deregisterDialogInteractionHandler: (evt, handler) =>
        this.dialog_.removeEventListener(util.remapEvent(evt), handler),
      registerConfirmationInteractionHandler: (evt, handler) =>
        this.confirmationDialog_ ? this.confirmationDialog_.addEventListener(util.remapEvent(evt), handler) : null,
      deregisterConfirmationInteractionHandler: (evt, handler) =>
        this.confirmationDialog_ ? this.confirmationDialog_.removeEventListener(util.remapEvent(evt), handler) : null,
      registerAcceptHandler: (handler) => this.acceptButton_.addEventListener('click', handler),
      deregisterAcceptHandler: (handler) => this.acceptButton_.removeEventListener('click', handler),
      registerNavigationAcceptHandler: (handler) => 
        this.navigationAcceptButton_.addEventListener('click', handler),
      deregisterNavigationAcceptHandler: (handler) => 
        this.navigationAcceptButton_.removeEventListener('click', handler),
      acceptAction: (handler) => console.log('Accept'),
      registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
      getFocusableElements: () => this.dialog_.querySelectorAll(FOCUSABLE_ELEMENTS),
      saveElementTabState: (el) => util.saveElementTabState(el),
      restoreElementTabState: (el) => util.restoreElementTabState(el),
      makeElementUntabbable: (el) => el.setAttribute('tabindex', -1),
      acceptButton: () => this.acceptButton_,
      cancelButton: () => this.cancelButton_,
      navigationAcceptButton: () => this.navigationAcceptButton_,
      navigationCancelButton: () => this.navigationCancelButton_,
      confirmationCancelButton: () => this.confirmationCancelButton_,
      dialogEl: () => this.root_,
      confirmationDialogEl: () => this.confirmationDialog_,
			setBackgroundAriaAttribute: () => document.querySelector(SCROLL_LOCK_TARGET).setAttribute('aria-hidden', 'true'),
			registerFocusTrappingHandler: (handler) => document.addEventListener('focus', handler, true),
			deregisterFocusTrappingHandler: (handler) => document.addEventListener('focus', handler),
    }

    const stdDialogAdapterProps = {
      registerCancelHandler: (handler) => this.cancelButton_.addEventListener('click', handler), deregisterCancelHandler: (handler) => this.cancelButton_.removeEventListener('click', handler),
      registerConfirmationAcceptHandler: (handler) => 
        this.confirmationAcceptButton_.addEventListener('click', handler),
      deregisterConfirmationAcceptHandler: (handler) => 
        this.confirmationAcceptButton_.removeEventListener('click', handler),
      registerConfirmationCancelHandler: (handler) => 
        this.confirmationCancelButton_.addEventListener('click', handler),
      deregisterConfirmationCancelHandler: (handler) => 
        this.confirmationCancelButton_.removeEventListener('click', handler),
      registerNavigationCancelHandler: (handler) => 
        this.navigationCancelButton_.addEventListener('click', handler),
      deregisterNavigationCancelHandler: (handler) => 
        this.navigationCancelButton_.removeEventListener('click', handler),
      cancelAction: (handler) => console.log('Cancel'),
    }

    /**
     * Auto save is the only type of dialog that does not have a cancel button. 
     * Technically all it does is accept and close the dialog window.
     * The user is responsible for handling any auto save functionality that
     * happens within the context of the dialog
     */
    if (!adapter.hasNavigationAutoSave()) {
      Object.assign(adapter, stdDialogAdapterProps);
    }

    return new MDCDialogFoundation(adapter);
  }
}
