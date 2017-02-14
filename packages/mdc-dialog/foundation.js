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

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));

    this.inert_ = false;
    this.dialog_ = adapter.dialog;
    this.navigation_ = adapter.navigation;
    this.navigationAutoSave_ = adapter.navigationAutoSave;
    this.activationButton_ = adapter.activationButton;
    this.acceptButton_ = adapter.acceptButton;
    this.cancelButton_ = adapter.cancelButton;
    this.navigationCancelButton_ = adapter.navigationCancelButton;
    this.navigationAcceptButton_ = adapter.navigationAcceptButton;
    this.confirmationDialog_ = adapter.confirmationDialog,
    this.confirmationAcceptButton_ = adapter.confirmationAcceptButton,
    this.confirmationCancelButton_ = adapter.confirmationCancelButton,
    
		this.activationHandler_ = () => this.showDialog_();
    this.acceptHandler_ = () => this.accept_();
    this.cancelHandler_ = () => this.cancel_();
    
		this.acceptEventHandler_ = adapter.registerAcceptHandler;
    this.cancelEventHandler_ = adapter.registerCancelHandler;
  }

  init() {
    const {ROOT, OPEN} = MDCDialogFoundation.cssClasses;

		this.activationButton_.addEventListener('click', this.activationHandler_);
    this.acceptButton_.addEventListener('click', this.acceptHandler_);

    if (!this.navigationAutoSave_) {
      this.cancelButton_.addEventListener('click', this.cancelHandler_);
    }
    
    if (this.navigation_ && !this.navigationAutoSave_) {
      this.navigationAcceptButton_.addEventListener('click', this.acceptHandler_);
      this.navigationCancelButton_.addEventListener('click', this.showConfirmation_.bind(this));
      this.confirmationAcceptButton_.addEventListener('click', this.acceptHandler_);
      this.confirmationCancelButton_.addEventListener('click', this.cancelHandler_);
    }
  }

  destroy() {}

  open() {}

  close() {}
  
  isOpen() {
    return this.isOpen_;
  }

  /**
   *  Render all children of the drawer inert when it's closed.
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
