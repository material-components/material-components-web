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

import {MDCComponent} from '@material/base';
import MDCDialogFoundation from './foundation';
import * as util from 'util';

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

  get dialog() {
    return this.root_.querySelector(MDCDialogFoundation.strings.DIALOG_SELECTOR);
  }

	get acceptButton() {
		return this.root_.querySelector(MDCDialogFoundation.strings.ACCEPT_SELECTOR);
	}
	
	get cancelButton() {
		return this.root_.querySelector(MDCDialogFoundation.strings.CANCEL_SELECTOR);
	}
	
	get navigationAcceptButton() {
		return this.root_.querySelector(MDCDialogFoundation.strings.NAV_ACCEPT_SELECTOR);
	}
	
	get navigationCancelButton() {
		return this.root_.querySelector(MDCDialogFoundation.strings.NAV_CANCEL_SELECTOR);
	}

	get confirmationAcceptButton() {
		return this.root_.querySelector(MDCDialogFoundation.strings.CONFIRMATION_ACCEPT_SELECTOR);
	}
	
	get confirmationCancelButton() {
		return this.root_.querySelector(MDCDialogFoundation.strings.CONFIRMATION_CANCEL_SELECTOR);
	}


  getDefaultFoundation() {
		const {FOCUSABLE_ELEMENTS, OPACITY_VAR_NAME} = MDCDialogFoundation.strings;

		return new MDCDialogFoundation({
			addClass: (className) => this.root_.classList.add(className),
			removeClass: (className) => this.root_.classList.remove(className),
			hasClass: (className) => this.root_.classList.contains(className),
			hasNecessaryDom: () => Boolean(this.dialog),
			registerInteractionHandler: (evt, handler) =>
			  this.root_.addEventListener(util.remapEvent(evt), handler, util.applyPassive()),
			deregisterInteractionHandler: (evt, handler) =>
			 this.root_.removeEventListener(util.remapEvent(evt), handler, util.applyPassive()),
			registerDialogInteractionHandler: (evt, handler) =>
			  this.dialog.addEventListener(util.remapEvent(evt), handler),
			deregisterDialogInteractionHandler: (evt, handler) =>
			this.dialog.removeEventListener(util.remapEvent(evt), handler),
			registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
			deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
			setTranslateY: (value) => this.dialog.style.setProperty(
			util.getTransformPropertyName(), value === null ? null : `translateY(${value}px)`),
			getFocusableElements: () => this.dialog.querySelectorAll(FOCUSABLE_ELEMENTS),
			saveElementTabState: (el) => util.saveElementTabState(el),
			restoreElementTabState: (el) => util.restoreElementTabState(el),
			makeElementUntabbable: (el) => el.setAttribute('tabindex', -1),
			isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
			isDialog: (el) => el === this.dialog,
		})
  }
}
