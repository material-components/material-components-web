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

import {MDCFoundation} from '@material/base';
import {cssClasses, strings} from './constants';

export default class MDCDialogFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      hasClass: (/* className: string */) => {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      addScrollLockClass: (/* className: string */) => {},
      removeScrollLockClass: (/* className: string */) => {},
      eventTargetHasClass: (/* target: EventTarget, className: string */) => /* boolean */ false,
      registerInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDialogSurfaceInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterDialogSurfaceInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDocumentKeydownHandler: (/* handler: EventListener */) => {},
      deregisterDocumentKeydownHandler: (/* handler: EventListener */) => {},
      registerFocusTrappingHandler: (/* handler: EventListener */) => {},
      deregisterFocusTrappingHandler: (/* handler: EventListener */) => {},
      numFocusableTargets: () => {/* number of focusable elements */},
      setDialogFocusFirstTarget: () => {/* sets focus on first element in dialog */},
      setInitialFocus: () => /* sets focus on the accept button when dialog opens */ {},
      getFocusableElements: (/* handler: EventListener */) => /* NodeList */ {},
      saveElementTabState: (/* el: Element */) => {},
      restoreElementTabState: (/* el: Element */) => {},
      makeElementUntabbable: (/* el: Element */) => {},
      setBackgroundAttr: (/* attr: String, val: Boolean */) => {},
      setDialogAttr: (/* attr: String, val: Boolean */) => {},
      getFocusedTarget: () => /* gets the element used to open the dialog */ {},
      setFocusedTarget: (/* target: Element */) => {},
      notifyAccept: () => {/* accept function */},
      notifyCancel: () => {/* cancel function */},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));

    this.lastFocusedTarget_ = null;
    this.currentFocusedElIndex_ = -1;
    this.isOpen_ = false;
    this.isResettingToFirstFocusTarget_ = false;
    this.componentClickHandler_ = () => this.cancel(true);
    this.dialogClickHandler_ = (evt) => this.handleDialogClick_(evt);
    this.focusHandler_ = (evt) => this.setFocus_(evt);
    this.documentKeydownHandler_ = (evt) => {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        this.cancel(true);
      }
    };
  }

  destroy() {
    // Ensure that dialog is cleaned up when destroyed
    this.close();
  }

  open() {
    this.lastFocusedTarget_ = this.adapter_.getFocusedTarget();
    this.makeTabbable_();
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.registerDialogSurfaceInteractionHandler('click', this.dialogClickHandler_);
    this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.setInitialFocus();
    this.adapter_.registerFocusTrappingHandler(this.focusHandler_);
    this.disableScroll_();
    this.adapter_.setBackgroundAttr('aria-hidden', true);
    this.adapter_.setDialogAttr('aria-hidden', false);
    this.adapter_.addClass(MDCDialogFoundation.cssClasses.OPEN);
    this.isOpen_ = true;
    this.currentFocusedElIndex_ = this.adapter_.numFocusableTargets() - 1;
  }

  close() {
    this.makeUntabbable_();
    this.adapter_.deregisterDialogSurfaceInteractionHandler('click', this.dialogClickHandler_);
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.deregisterInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.deregisterFocusTrappingHandler(this.focusHandler_);
    this.adapter_.removeClass(MDCDialogFoundation.cssClasses.OPEN);
    this.enableScroll_();
    this.adapter_.setBackgroundAttr('aria-hidden', false);
    this.adapter_.setDialogAttr('aria-hidden', true);
    this.isOpen_ = false;

    if (this.lastFocusedTarget_) {
      this.adapter_.setFocusedTarget(this.lastFocusedTarget_);
    }
    this.lastFocusedTarget_ = null;
  }

  isOpen() {
    return this.isOpen_;
  }

  accept(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyAccept();
    }

    this.close();
  }

  cancel(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyCancel();
    }

    this.close();
  }

  handleDialogClick_(evt) {
    evt.stopPropagation();
    const {target} = evt;
    if (this.adapter_.eventTargetHasClass(target, cssClasses.ACCEPT_BTN)) {
      this.accept(true);
    } else if (this.adapter_.eventTargetHasClass(target, cssClasses.CANCEL_BTN)) {
      this.cancel(true);
    }
  }

  makeUntabbable_() {
    const elements = this.adapter_.getFocusableElements();
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        this.adapter_.saveElementTabState(elements[i]);
        this.adapter_.makeElementUntabbable(elements[i]);
      }
    }
  }

  makeTabbable_() {
    const elements = this.adapter_.getFocusableElements();
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        this.adapter_.restoreElementTabState(elements[i]);
      }
    }
  }

  setFocus_(evt) {
    if (!evt.relatedTarget) {
      // Do not increment the focused el index when re-focusing on same element, e.g. switching windows
      return;
    }

    if (this.isResettingToFirstFocusTarget_) {
      return;
    }

    this.currentFocusedElIndex_ = (this.currentFocusedElIndex_ + 1) % this.adapter_.numFocusableTargets();

    if (this.currentFocusedElIndex_ === 0) {
      this.isResettingToFirstFocusTarget_ = true;
      this.adapter_.setDialogFocusFirstTarget();
      this.isResettingToFirstFocusTarget_ = false;
    }
  }

  disableScroll_() {
    this.adapter_.addScrollLockClass();
  }

  enableScroll_() {
    this.adapter_.removeScrollLockClass();
  }
}
