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

  static get isOpen() {
    return this.isOpen_;
  }

  static get lastFocusedTarget() {
    return this.lastFocusedElement_;
  }

	static get defaultAdapter() {
    return {
      dialogEl: () => {},
      hasClass: (/* className: string */) => {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDialogInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterDialogInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDocumentKeydownHandler: (/* handler: EventListener */) => {},
      deregisterDocumentKeydownHandler: (/* handler: EventListener */) => {},
      registerAcceptHandler: () => {},
      deregisterAcceptHandler: () => {},
      registerCancelHandler: () => {},
      deregisterCancelHandler: () => {},
      getFocusableElements: () => /* NodeList */ {},
      saveElementTabState: (/* el: Element */) => {},
      restoreElementTabState: (/* el: Element */) => {},
      makeElementUntabbable: (/* el: Element */) => {},
      acceptButton: () => {},
      cancelButton: () => {},
      acceptAction: () => {},
      cancelAction: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));
    
    this.lastFocusedElement_ = null;
    this.inert_ = false;
    this.isOpen_ = false;
    this.componentClickHandler_ = () => this.cancel();
    this.dialogClickHandler_ = (evt) => evt.stopPropagation();
		this.dialogFocusHandler_ = (evt) => this.passFocus(evt);
    this.acceptHandler_ = () => this.accept();
    this.cancelHandler_ = () => this.cancel();
    this.documentKeydownHandler_ = (evt) => {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        this.cancel();
      }
    }
  }

  /**
   * The default button to focus on for a dialog changes based on 
   * type of dialog and width of window in some cases
   */
  init() {
    const {ROOT, ACTIVE, OPEN} = MDCDialogFoundation.cssClasses;

    this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.registerDialogInteractionHandler('click', this.dialogClickHandler_);
    this.adapter_.registerAcceptHandler(this.acceptHandler_);
    this.adapter_.registerCancelHandler(this.cancelHandler_);
    
    if (this.adapter_.hasClass(ACTIVE)) {
      this.isOpen_ = true;
    } else {
      this.lockTab_();
      this.isOpen_ = false;
    }
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler(this.componentClickHandler_);
    this.adapter_.deregisterDialogInteractionHandler(this.dialogClickHandler_);
    this.adapter_.deregisterAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterCancelHandler(this.cancelHandler_);
    this.adapter_.deregisterFocusTrappingHandler(this.dialogFocusHandler_);
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
  }

  setLastFocusTarget(element) {
    this.lastFocusedElement_ = element;
  }

  open() {
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.addClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.unlockTab_();
    this.disableScroll_();
    this.isOpen_ = true;
    this.adapter_.setBackgroundAriaAttribute();
    this.lastFocusedElement_ = 
    this.adapter_.acceptButton().focus();
    this.adapter_.registerFocusTrappingHandler(this.dialogFocusHandler_);
  }

  close() {
    this.lastFocusedElement_.focus();
    this.adapter_.removeClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.lockTab_();
    this.enableScroll_();
    this.isOpen_ = false;
  }

  passFocus(evt) {
    if (!this.adapter_.dialogEl().contains(evt.target)) {
      evt.stopPropagation();
      this.adapter_.cancelButton().focus();
    }
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
      for (let i = 0; i < elements.length; i++) { this.adapter_.saveElementTabState(elements[i]);
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
}
