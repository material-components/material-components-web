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
      hasNavigation: () => false,
      hasNavigationAutoSave: () => false,
			registerInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDialogInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterDialogInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerConfirmationInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterConfirmationInteractionHandler: (/* evt: string, handler: EventListener */) => {},
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
      cancelAction: () => {},
      updateCssVariable: (/* value: string */) => {},
      getFocusableElements: () => /* NodeList */ {},
      saveElementTabState: (/* el: Element */) => {},
      restoreElementTabState: (/* el: Element */) => {},
      makeElementUntabbable: (/* el: Element */) => {},
      acceptButton: () => {},
      cancelButton: () => {},
      navigationAcceptButton: () => {},
      navigationCancelButton: () => {},
      confirmationCancelButton: () => {},
      dialogEl: () => {},
      confirmationDialogEl: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));
    
    this.lastFocusEl_;
		this.activeDialog_;
    this.defaultFocusElement_;
    this.inert_ = false;
    this.isOpen_ = false;
    this.componentClickHandler_ = () => this.cancel();
    this.dialogClickHandler_ = (evt) => evt.stopPropagation();
		this.dialogFocusHandler_ = (evt) => {return this.passFocus(evt);}
		this.confirmationClickHandler_ = (evt) => evt.stopPropagation();
    this.acceptHandler_ = () => this.accept();
    this.cancelHandler_ = () => this.cancel();
    this.confirmationHandler_ = () => this.openConfirmation();
    this.confirmationAcceptHandler_ = () => this.confirmationAccept();
    this.confirmationCancelHandler_ = () => this.closeConfirmation();
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
    this.defaultFocusElement_ = this.adapter_.cancelButton();

    if (!this.adapter_.hasNavigationAutoSave()) {
      this.adapter_.registerCancelHandler(this.cancelHandler_);
    } 
 
    if (this.adapter_.hasNavigation()) {
      this.adapter_.registerNavigationAcceptHandler(this.acceptHandler_);
    	this.defaultFocusElement_ = this.adapter_.navigationCancelButton();
    }

		if (this.adapter_.hasNavigationAutoSave() && !window.matchMedia("(min-width: 640px)").matches) {
    	this.defaultFocusElement_ = this.adapter_.navigationAcceptButton();
		} else if (this.adapter_.hasNavigationAutoSave() && window.matchMedia("(min-width: 640px)").matches) {
    	this.defaultFocusElement_ = this.adapter_.acceptButton();
		}

    if (this.adapter_.hasNavigation() && !this.adapter_.hasNavigationAutoSave()) {
      this.adapter_.registerNavigationCancelHandler(this.confirmationHandler_);
      this.adapter_.registerConfirmationAcceptHandler(this.confirmationAcceptHandler_);
      this.adapter_.registerConfirmationCancelHandler(this.confirmationCancelHandler_);
      this.adapter_.registerConfirmationInteractionHandler('click', this.confirmationClickHandler_);
    }

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
    this.adapter_.deregisterConfirmationInteractionHandler(this.confirmationClickHandler_);
    this.adapter_.deregisterAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterCancelHandler(this.cancelHandler_);
    this.adapter_.deregisterNavigationAcceptHandler(this.acceptHandler_);
    this.adapter_.deregisterNavigationCancelHandler(this.confirmationHandler_);
    this.adapter_.deregisterConfirmationAcceptHandler(this.confirmationAcceptHandler_);
    this.adapter_.deregisterConfirmationCancelHandler(this.confirmationCancelHandler_);
  }

  open() {
    this.lastFocusEl_ = document.activeElement;
		this.activeDialog_ = this.adapter_.dialogEl();
    this.adapter_.updateCssVariable('');
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.addClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.unlockTab_();
		this.disableScroll_();
    this.isOpen_ = true;
		this.adapter_.setBackgroundAriaAttribute();
		this.defaultFocusElement_.focus();
    this.adapter_.registerFocusTrappingHandler(this.dialogFocusHandler_);
	}

  close() {
    this.adapter_.deregisterFocusTrappingHandler(this.dialogFocusHandler_);
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.updateCssVariable('');
    this.adapter_.removeClass(MDCDialogFoundation.cssClasses.ACTIVE);
    this.lockTab_();
    this.enableScroll_();
    this.isOpen_ = false;
    this.lastFocusEl_.focus();
    this.resetDefaultFocus();
  }
 
  openConfirmation() {
		this.activeDialog_ = this.adapter_.confirmationDialogEl();
    this.defaultFocusElement_ = this.adapter_.confirmationCancelButton();
    this.adapter_.addConfirmClass(MDCDialogFoundation.cssClasses.CONFIRMATION_ACTIVE);
    this.adapter_.registerFocusTrappingHandler(this.dialogFocusHandler_);
 		this.defaultFocusElement_.focus();
 }

  closeConfirmation() {
    this.adapter_.removeConfirmClass(MDCDialogFoundation.cssClasses.CONFIRMATION_ACTIVE)
    this.adapter_.deregisterFocusTrappingHandler(this.dialogFocusHandler_);
		//this.resetDefaultFocus();
  }

	passFocus(evt) {
		if (!this.activeDialog_.contains(evt.target)) {
      evt.stopPropagation();
    	this.defaultFocusElement_.focus();
    }
	}

  /**
   * When a dialog closes, we must reset the default focus element since it is
   * a different element depending on the type of dialog (confirmation/standard)
   */
	resetDefaultFocus() {
    this.defaultFocusElement_ = this.adapter_.cancelButton();
    
    if (this.adapter_.hasNavigation()) {
    	this.defaultFocusElement_ = this.adapter_.navigationCancelButton();
    }

		if (this.adapter_.hasNavigationAutoSave() && !window.matchMedia("(min-width: 640px)").matches) {
    	this.defaultFocusElement_ = this.adapter_.navigationAcceptButton();
		} else if (this.adapter_.hasNavigationAutoSave() && window.matchMedia("(min-width: 640px)").matches) {
    	this.defaultFocusElement_ = this.adapter_.acceptButton();
		}

    //this.activeDialog_ = this.adapter_.dialogEl();
    //this.defaultFocusElement_.focus();
    //this.adapter_.registerFocusTrappingHandler(this.dialogFocusHandler_);
	}

  accept() {
    this.adapter_.acceptAction();
    this.close();
  }

  cancel() {
    this.adapter_.cancelAction();
    this.close();
  }

  confirmationAccept() {
    this.cancel();
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
