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

import MDCFoundation from '@material/base/foundation';
/* eslint-disable no-unused-vars */
import {MDCTextfieldAdapter, TextfieldElementState} from './adapter';
/* eslint-enable no-unused-vars */
import {cssClasses, strings} from './constants';

/**
 * @extends {MDCFoundation<!MDCTextfieldAdapter>}
 */
export default class MDCTextfieldFoundation extends MDCFoundation {

  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{strings} */
  static get strings() {
    return strings;
  }

  /** @return {!MDCTextfieldAdapter} */
  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      addClassToLabel: (/* className: string */) => {},
      removeClassFromLabel: (/* className: string */) => {},
      addClassToHelptext: (/* className: string */) => {},
      removeClassFromHelptext: (/* className: string */) => {},
      helptextHasClass: (/* className: string */) => /* boolean */ false,
      registerInputFocusHandler: (/* handler: EventListener */) => {},
      deregisterInputFocusHandler: (/* handler: EventListener */) => {},
      registerInputBlurHandler: (/* handler: EventListener */) => {},
      deregisterInputBlurHandler: (/* handler: EventListener */) => {},
      registerInputInputHandler: (/* handler: EventListener */) => {},
      deregisterInputInputHandler: (/* handler: EventListener */) => {},
      registerInputKeydownHandler: (/* handler: EventListener */) => {},
      deregisterInputKeydownHandler: (/* handler: EventListener */) => {},
      setHelptextAttr: (/* name: string, value: string */) => {},
      removeHelptextAttr: (/* name: string */) => {},
      getNativeInput: () => /* TextfieldElementState */ ({}),
    };
  }

  constructor(adapter = {}) {
    super(Object.assign(MDCTextfieldFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.receivedUserInput_ = false;

    this.inputFocusHandler_ = /** @private {!EventListener} */ (
      () => this.activateFocus_());

    this.inputBlurHandler_ = /** @private {!EventListener} */ (
      () => this.deactivateFocus_());

    this.inputInputHandler_ = /** @private {!EventListener} */ (
      () => this.autoCompleteFocus_());

    this.inputKeydownHandler_ = /** @private {!EventListener} */ (
      () => this.receivedUserInput_ = true);
  }

  init() {
    this.adapter_.addClass(MDCTextfieldFoundation.cssClasses.UPGRADED);
    this.adapter_.registerInputFocusHandler(this.inputFocusHandler_);
    this.adapter_.registerInputBlurHandler(this.inputBlurHandler_);
    this.adapter_.registerInputInputHandler(this.inputInputHandler_);
    this.adapter_.registerInputKeydownHandler(this.inputKeydownHandler_);

    // Ensure label does not collide with any pre-filled value.
    if (this.getNativeInput_().value) {
      this.adapter_.addClassToLabel(MDCTextfieldFoundation.cssClasses.LABEL_FLOAT_ABOVE);
    }
  }

  destroy() {
    this.adapter_.removeClass(MDCTextfieldFoundation.cssClasses.UPGRADED);
    this.adapter_.deregisterInputFocusHandler(this.inputFocusHandler_);
    this.adapter_.deregisterInputBlurHandler(this.inputBlurHandler_);
    this.adapter_.deregisterInputInputHandler(this.inputInputHandler_);
    this.adapter_.deregisterInputKeydownHandler(this.inputKeydownHandler_);
  }

  /** @private */
  activateFocus_() {
    const {FOCUSED, LABEL_FLOAT_ABOVE} = MDCTextfieldFoundation.cssClasses;
    this.adapter_.addClass(FOCUSED);
    this.adapter_.addClassToLabel(LABEL_FLOAT_ABOVE);
    this.showHelptext_();
  }

  /** @private */
  autoCompleteFocus_() {
    if (!this.receivedUserInput_) {
      this.activateFocus_();
    }
  }

  /** @private */
  showHelptext_() {
    const {ARIA_HIDDEN} = MDCTextfieldFoundation.strings;
    this.adapter_.removeHelptextAttr(ARIA_HIDDEN);
  }

  /** @private */
  deactivateFocus_() {
    const {FOCUSED, INVALID, LABEL_FLOAT_ABOVE} = MDCTextfieldFoundation.cssClasses;
    const input = this.getNativeInput_();
    const isValid = input.checkValidity();

    this.adapter_.removeClass(FOCUSED);
    if (!input.value && !this.isBadInput_()) {
      this.adapter_.removeClassFromLabel(LABEL_FLOAT_ABOVE);
      this.receivedUserInput_ = false;
    }
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    this.updateHelptextOnDeactivation_(isValid);
  }

  /**
   * @param {boolean} isValid
   * @private
   */
  updateHelptextOnDeactivation_(isValid) {
    const {HELPTEXT_PERSISTENT, HELPTEXT_VALIDATION_MSG} = MDCTextfieldFoundation.cssClasses;
    const {ROLE} = MDCTextfieldFoundation.strings;
    const helptextIsPersistent = this.adapter_.helptextHasClass(HELPTEXT_PERSISTENT);
    const helptextIsValidationMsg = this.adapter_.helptextHasClass(HELPTEXT_VALIDATION_MSG);
    const validationMsgNeedsDisplay = helptextIsValidationMsg && !isValid;

    if (validationMsgNeedsDisplay) {
      this.adapter_.setHelptextAttr(ROLE, 'alert');
    } else {
      this.adapter_.removeHelptextAttr(ROLE);
    }

    if (helptextIsPersistent || validationMsgNeedsDisplay) {
      return;
    }
    this.hideHelptext_();
  }

  /** @private */
  hideHelptext_() {
    const {ARIA_HIDDEN} = MDCTextfieldFoundation.strings;
    this.adapter_.setHelptextAttr(ARIA_HIDDEN, 'true');
  }

  /**
   * @return {boolean}
   * @private
   */
  isBadInput_() {
    const input = this.getNativeInput_();
    return input.validity ? input.validity.badInput : input.badInput;
  }

  /**
   * @return {boolean}
   * @private
   */
  isDisabled() {
    return this.getNativeInput_().disabled;
  }

  /** @param {boolean} disabled */
  setDisabled(disabled) {
    const {DISABLED} = MDCTextfieldFoundation.cssClasses;
    this.getNativeInput_().disabled = disabled;
    if (disabled) {
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.removeClass(DISABLED);
    }
  }

  /**
   * @return {!TextfieldElementState}
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() || {
      checkValidity: () => true,
      value: '',
      disabled: false,
      badInput: false,
    };
  }
}
