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
      setBackgroundAriaHidden: (/* el: Element */) => {},
      setDialogAriaHidden: (/* el: Element */) => {},
      hasClass: (/* className: string */) => {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      addScrollLockClass: (/* className: string */) => {},
      removeScrollLockClass: (/* className: string */) => {},
      registerInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDialogInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterDialogInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDocumentKeydownHandler: (/* handler: EventListener */) => {},
      deregisterDocumentKeydownHandler: (/* handler: EventListener */) => {},
      registerAcceptHandler: (/* handler: EventListener */) => {},
      deregisterAcceptHandler: (/* handler: EventListener */) => {},
      registerCancelHandler: (/* handler: EventListener */) => {},
      deregisterCancelHandler: (/* handler: EventListener */) => {},
      registerFocusTrappingHandler: (/* handler: EventListener */) => {},
      deregisterFocusTrappingHandler: (/* handler: EventListener */) => {},
      getFocusableElements: (/* handler: EventListener */) => /* NodeList */ {},
      saveElementTabState: (/* el: Element */) => {},
      restoreElementTabState: (/* el: Element */) => {},
      makeElementUntabbable: (/* el: Element */) => {},
      setAttribute: (/* elem: Element, attr: String, val: Boolean */) => {},
      acceptAction: () => {/* accept function */},
      cancelAction: () => {/* cancel function */},
      getFocusedElement: () => {},
      setFocusedElement: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));

    this.lastFocusedElement_;
    this.inert_ = true;
    this.isOpen_ = false;
    this.componentClickHandler_ = () => this.cancel();
    this.dialogClickHandler_ = (evt) => evt.stopPropagation();
    this.acceptHandler_ = () => this.accept();
    this.cancelHandler_ = () => this.cancel();
    this.documentKeydownHandler_ = (evt) => {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        this.cancel();
      }
    };
  }

  init() {
    const {ACTIVE} = MDCDialogFoundation.cssClasses;

    if (this.adapter_.hasClass(ACTIVE)) {
      this.isOpen_ = true;
    } else {
      this.lockTab_();
      this.isOpen_ = false;
    }
  }

  destroy() {}

  getLastFocusTarget() {
    return this.lastFocusedElement_;
  }

  open() {
    this.lastFocusedElement_ = this.adapter_.getFocusedElement();
    this.unlockTab_();
    this.adapter_.registerAcceptHandler(this.acceptHandler_);
    this.adapter_.registerCancelHandler(this.cancelHandler_);
    this.adapter_.registerDialogInteractionHandler('click', this.dialogClickHandler_);
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.addClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.isOpen_ = true;
    this.adapter_.registerFocusTrappingHandler();
    this.disableScroll_();
    this.adapter_.setDialogAriaHidden(false);
    this.adapter_.setBackgroundAriaHidden(true);
  }

  close() {
    this.lockTab_();
    this.adapter_.deregisterAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterCancelHandler(this.cancelHandler_);
    this.adapter_.deregisterDialogInteractionHandler(this.dialogClickHandler_);
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.deregisterInteractionHandler(this.componentClickHandler_);
    this.adapter_.deregisterFocusTrappingHandler();
    this.adapter_.removeClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.isOpen_ = false;
    this.enableScroll_();
    this.adapter_.setDialogAriaHidden(true);
    this.adapter_.setBackgroundAriaHidden(false);
    this.adapter_.setFocusedElement(this.lastFocusedElement_);
  }

  setAttribute(elem, attr, val) {
    elem.setAttribute(attr, val);
  }

  accept() {
    this.adapter_.acceptAction();
    this.close();
  }

  cancel() {
    this.adapter_.cancelAction();
    this.close();
  }

  /**
   *  Render all children of the dialog inert when it's closed.
   */
  lockTab_() {
    if (this.inert_) {
      return;
    }

    const elements = this.adapter_.getFocusableElements();
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        this.adapter_.saveElementTabState(elements[i]);
        this.adapter_.makeElementUntabbable(elements[i]);
      }
    }

    this.inert_ = true;
  }

  /**
   *  Make all children of the drawer tabbable again when it's open.
   */
  unlockTab_() {
    if (!this.inert_) {
      return;
    }

    const elements = this.adapter_.getFocusableElements();
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        this.adapter_.restoreElementTabState(elements[i]);
      }
    }

    this.inert_ = false;
  }

  disableScroll_() {
    this.adapter_.addScrollLockClass();
  }

  enableScroll_() {
    this.adapter_.removeScrollLockClass();
  }

  isOpen() {
    return this.isOpen_;
  }
}
