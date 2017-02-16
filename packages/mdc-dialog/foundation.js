/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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
    return {};
  }

	static get isOpen() {
		return this.isOpen_;
	}

	static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      hasNecessaryDom: () => /* boolean */ false,
      navigation: () => false,
      navigationAutoSave: () => false,
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
      registerNavigationAcceptHandler: () => {},
      deregisterNavigationAcceptHandler: () => {},
      registerNavigationCancelHandler: () => {},
      deregisterNavigationCancelHandler: () => {},
      registerConfirmationAcceptHandler: () => {},
      deregisterConfirmationAcceptHandler: () => {},
      registerConfirmationCancelHandler: () => {},
      deregisterConfirmationCancelHandler: () => {},
      acceptAction: () => {},

			setTranslateY: (/* value: number | null */) => {},
      updateCssVariable: (/* value: string */) => {},
      getFocusableElements: () => /* NodeList */ {},
      saveElementTabState: (/* el: Element */) => {},
      restoreElementTabState: (/* el: Element */) => {},
      makeElementUntabbable: (/* el: Element */) => {},
      isRtl: () => /* boolean */ false,
      isDialog: (/* el: Element */) => /* boolean */ false,

			hasNavigation: () => /* boolean */ false,
			hasAutosave: () => /* boolean */ false,
			willConfirmCancel: () => /* boolean */ false,
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));

    this.inert_ = false;
    this.isOpen_ = false;
    this.acceptHandler_ = () => { this.accept() };
    this.cancelHandler_ = () => { this.close() };
    this.confirmationHandler_ = () => { this.openConfirmation() };
    this.confirmationAcceptHandler_ = () => { this.confirmationAccept() };
    this.confirmationCancelHandler_ = () => { this.closeConfirmation() };
  }

  init() {
    const {ROOT, OPEN} = MDCDialogFoundation.cssClasses;

    this.adapter_.registerAcceptHandler(this.acceptHandler_);

    if (!this.adapter_.navigationAutoSave()) {
      this.adapter_.registerCancelHandler(this.cancelHandler_);
    }

    if (this.adapter_.navigation() && !this.adapter_.navigationAutoSave()) {
      this.adapter_.registerNavigationAcceptHandler(this.acceptHandler_);
      this.adapter_.registerNavigationCancelHandler(this.confirmationHandler_);
      this.adapter_.registerConfirmationAcceptHandler(this.confirmationAcceptHandler_);
      this.adapter_.registerConfirmationCancelHandler(this.confirmationCancelHandler_);
    }
  }

  destroy() {
    this.adapter_.deregisterAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterCancelHandler(this.cancelHandler_);
    this.adapter_.deregisterNavigationAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterNavigationCancelHandler(this.confirmationHandler_);
    this.adapter_.deregisterConfirmationAcceptHandler(this.confirmationAcceptHandler_);
    this.adapter_.deregisterConfirmationCancelHandler(this.confirmationCancelHandler_);
  }

  open() {
    this.adapter_.updateCssVariable('');
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.addClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.unlockTab_();
    this.isOpen_ = true;
  }

  close() {
    this.adapter_.updateCssVariable('');
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.removeClass(MDCDialogFoundation.cssClasses.ACTIVE);
		this.lockTab_();
    this.isOpen_ = false;
	}
 
  openConfirmation() {
    this.adapter_.addConfirmClass(MDCDialogFoundation.cssClasses.CONFIRMATION_ACTIVE);
  }

  closeConfirmation() {
    this.adapter_.removeConfirmClass(MDCDialogFoundation.cssClasses.CONFIRMATION_ACTIVE)
    this.adapter_.deregisterConfirmationAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterConfirmationCancelHandler(this.cancelHandler_);
  } 

  accept() {
    this.adapter_.acceptAction();
    this.close();
  }

  confirmationAccept() {
    this.close();
    this.closeConfirmation();
  }

  isOpen() {
    return this.isOpen_;
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
  
}
