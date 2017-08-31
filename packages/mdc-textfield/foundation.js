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

export default class MDCTextfieldFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      addClassToLabel: (/* className: string */) => {},
      removeClassFromLabel: (/* className: string */) => {},
      eventTargetHasClass: (/* target: HTMLElement, className: string */) => {},
      registerTextFieldClickHandler: () => {},
      deregisterTextFieldClickHandler: () => {},
      notifyLeadingIconAction: () => {},
      notifyTrailingIconAction: () => {},
      addClassToBottomLine: (/* className: string */) => {},
      removeClassFromBottomLine: (/* className: string */) => {},
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
      registerInputPointerDownHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterInputPointerDownHandler: (/* evtType: string, handler: EventListener */) => {},
      registerTransitionEndHandler: (/* handler: EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: EventListener */) => {},
      setBottomLineAttr: (/* attr: string, value: string */) => {},
      setHelptextAttr: (/* name: string, value: string */) => {},
      removeHelptextAttr: (/* name: string */) => {},
      getNativeInput: () => /* HTMLInputElement */ ({}),
    };
  }

  constructor(adapter = {}) {
    super(Object.assign(MDCTextfieldFoundation.defaultAdapter, adapter));

    this.receivedUserInput_ = false;
    this.isFocused_ = false;
    this.inputFocusHandler_ = () => this.activateFocus_();
    this.inputBlurHandler_ = () => this.deactivateFocus_();
    this.inputInputHandler_ = () => this.autoCompleteFocus_();
    this.inputKeydownHandler_ = () => this.receivedUserInput_ = true;
    this.textFieldClickHandler_ = (evt) => this.handleTextFieldClick_(evt);
    this.useCustomValidityChecking_ = false;
    this.transitionEndHandler_ = (evt) => this.transitionEnd_(evt);
    this.setPointerXOffset_ = (evt) => this.setBottomLineTransformOrigin_(evt);
  }

  init() {
    this.adapter_.addClass(MDCTextfieldFoundation.cssClasses.UPGRADED);
    this.adapter_.registerInputFocusHandler(this.inputFocusHandler_);
    this.adapter_.registerInputBlurHandler(this.inputBlurHandler_);
    this.adapter_.registerInputInputHandler(this.inputInputHandler_);
    this.adapter_.registerInputKeydownHandler(this.inputKeydownHandler_);
    this.adapter_.registerTextFieldClickHandler(this.textFieldClickHandler_);
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.registerInputPointerDownHandler(evtType, this.setPointerXOffset_);
    });

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
    this.adapter_.deregisterTextFieldClickHandler(this.textFieldClickHandler_);
  }

  handleTextFieldClick_(evt) {
    const {target} = evt;
    const {LEADING_ICON, TRAILING_ICON} = MDCTextfieldFoundation.cssClasses;

    if (this.adapter_.eventTargetHasClass(target, LEADING_ICON)) {
      this.adapter_.notifyLeadingIconAction();
    } else if (this.adapter_.eventTargetHasClass(target, TRAILING_ICON)) {
      this.adapter_.notifyTrailingIconAction();
    }
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.deregisterInputPointerDownHandler(evtType, this.setPointerXOffset_, {passive: true});
    });
  }

  activateFocus_() {
    const {BOTTOM_LINE_ACTIVE, FOCUSED, LABEL_FLOAT_ABOVE} = MDCTextfieldFoundation.cssClasses;
    this.adapter_.addClass(FOCUSED);
    this.adapter_.addClassToBottomLine(BOTTOM_LINE_ACTIVE);
    this.adapter_.addClassToLabel(LABEL_FLOAT_ABOVE);
    this.showHelptext_();
    this.isFocused_ = true;
  }

  setBottomLineTransformOrigin_(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const evtCoords = {x: evt.clientX, y: evt.clientY};
    const normalizedX = evtCoords.x - targetClientRect.left;
    const attributeString =
      `transform-origin: ${normalizedX}px center`;

    this.adapter_.setBottomLineAttr('style', attributeString);
  }

  autoCompleteFocus_() {
    if (!this.receivedUserInput_) {
      this.activateFocus_();
    }
  }

  showHelptext_() {
    const {ARIA_HIDDEN} = MDCTextfieldFoundation.strings;
    this.adapter_.removeHelptextAttr(ARIA_HIDDEN);
  }

  transitionEnd_(evt) {
    const {BOTTOM_LINE_ACTIVE} = MDCTextfieldFoundation.cssClasses;

    // We need to wait for the bottom line to entirely transparent
    // before removing the class. If we do not, we see the line start to
    // scale down before disappearing
    if (evt.propertyName === 'opacity' && !this.isFocused_) {
      this.adapter_.removeClassFromBottomLine(BOTTOM_LINE_ACTIVE);
    }
  }

  deactivateFocus_() {
    const {FOCUSED, LABEL_FLOAT_ABOVE} = MDCTextfieldFoundation.cssClasses;
    const input = this.getNativeInput_();

    this.adapter_.removeClass(FOCUSED);

    if (!input.value && !this.isBadInput_()) {
      this.adapter_.removeClassFromLabel(LABEL_FLOAT_ABOVE);
      this.receivedUserInput_ = false;
    }
    if (!this.useCustomValidityChecking_) {
      this.changeValidity_(input.checkValidity());
    }
  }

  changeValidity_(isValid) {
    const {INVALID} = MDCTextfieldFoundation.cssClasses;
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    this.updateHelptext_(isValid);
    this.isFocused_ = false;
  }

  updateHelptext_(isValid) {
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

  hideHelptext_() {
    const {ARIA_HIDDEN} = MDCTextfieldFoundation.strings;
    this.adapter_.setHelptextAttr(ARIA_HIDDEN, 'true');
  }

  isBadInput_() {
    const input = this.getNativeInput_();
    return input.validity ? input.validity.badInput : input.badInput;
  }

  isDisabled() {
    return this.getNativeInput_().disabled;
  }

  setDisabled(disabled) {
    const {DISABLED} = MDCTextfieldFoundation.cssClasses;
    this.getNativeInput_().disabled = disabled;
    if (disabled) {
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.removeClass(DISABLED);
    }
  }

  getNativeInput_() {
    return this.adapter_.getNativeInput() || {
      checkValidity: () => true,
      value: '',
      disabled: false,
      badInput: false,
    };
  }

  setValid(isValid) {
    this.useCustomValidityChecking_ = true;
    this.changeValidity_(isValid);
  }
}
