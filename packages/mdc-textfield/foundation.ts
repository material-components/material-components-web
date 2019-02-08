/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCFoundation} from '@material/base/foundation';
/* eslint-disable no-unused-vars */
import {MDCTextFieldHelperTextFoundation} from './helper-text/foundation';
import {MDCTextFieldCharacterCounterFoundation} from './character-counter/foundation';
import {MDCTextFieldIconFoundation} from './icon/foundation';
/* eslint-enable no-unused-vars */
import {MDCTextFieldAdapter, NativeInputType, FoundationMapType} from './adapter';
import {cssClasses, strings, numbers, VALIDATION_ATTR_WHITELIST, ALWAYS_FLOAT_TYPES} from './constants';

class MDCTextFieldFoundation extends MDCFoundation<MDCTextFieldAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  /** @return {boolean} */
  get shouldShake() {
    return !this.isValid() && !this.isFocused_ && !!this.getValue();
  }

  /**
   * @private
   */
  get shouldAlwaysFloat_(): boolean {
    const type = this.getNativeInput_().type;
    return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
  }

  /** @return {boolean} */
  get shouldFloat() {
    return this.shouldAlwaysFloat_ || this.isFocused_ || !!this.getValue() || this.isBadInput_();
  }

  /**
   * See {@link MDCTextFieldAdapter} for typing information on parameters and return
types.
   */
  static get defaultAdapter(): MDCTextFieldAdapter {
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => undefined,
      registerTextFieldInteractionHandler: () => undefined,
      deregisterTextFieldInteractionHandler: () => undefined,
      registerInputInteractionHandler: () => undefined,
      deregisterInputInteractionHandler: () => undefined,
      registerValidationAttributeChangeHandler: () => undefined,
      deregisterValidationAttributeChangeHandler: () => undefined,
      getNativeInput: () => undefined,
      isFocused: () => undefined,
      activateLineRipple: () => undefined,
      deactivateLineRipple: () => undefined,
      setLineRippleTransformOrigin: () => undefined,
      shakeLabel: () => undefined,
      floatLabel: () => undefined,
      hasLabel: () => undefined,
      getLabelWidth: () => undefined,
      hasOutline: () => undefined,
      notchOutline: () => undefined,
      closeOutline: () => undefined,
    };
  }

  /**
   * @param {!MDCTextFieldAdapter} adapter
   * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter, foundationMap = {})) {
    super(Object.assign(MDCTextFieldFoundation.defaultAdapter, adapter);

    /** @type {!MDCTextFieldHelperTextFoundation|undefined} */
    this.helperText_ = foundationMap.helperText;
    /** @type {!MDCTextFieldCharacterCounterFoundation|undefined} */
    this.characterCounter_ = foundationMap.characterCounter;
    /** @type {!MDCTextFieldIconFoundation|undefined} */
    this.leadingIcon_ = foundationMap.leadingIcon;
    /** @type {!MDCTextFieldIconFoundation|undefined} */
    this.trailingIcon_ = foundationMap.trailingIcon;

    private isFocused_: boolean;
    this.isFocused_ = false;
    private receivedUserInput_: boolean;
    this.receivedUserInput_ = false;
    private useCustomValidityChecking_: boolean;
    this.useCustomValidityChecking_ = false;
    private isValid_: boolean;
    this.isValid_ = true;

    private useNativeValidation_: boolean;
    this.useNativeValidation_ = true;

    private inputFocusHandler_: function(): undefined;
    this.inputFocusHandler_ = () => this.activateFocus();
    private inputBlurHandler_: function(): undefined;
    this.inputBlurHandler_ = () => this.deactivateFocus();
    private inputInputHandler_: function(): undefined;
    this.inputInputHandler_ = () => this.handleInput();
    private setPointerXOffset_: EventListener;
    this.setPointerXOffset_ = (evt) => this.setTransformOrigin(evt);
    private textFieldInteractionHandler_: EventListener;
    this.textFieldInteractionHandler_ = () => this.handleTextFieldInteraction();
    private validationAttributeChangeHandler_: function(!Array): undefined;
    this.validationAttributeChangeHandler_ = (attributesList) => this.handleValidationAttributeChange(attributesList);

    /** @private {!MutationObserver} */
    this.validationObserver_;
  }

  init() {
    if (this.adapter_.isFocused()) {
      this.inputFocusHandler_();
    } else if (this.adapter_.hasLabel() && this.shouldFloat) {
      this.notchOutline(true);
      this.adapter_.floatLabel(true);
    }

    this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.registerInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.registerTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler_);
    });
    this.validationObserver_ =
        this.adapter_.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler_);
    this.setCharacterCounter_(this.getValue().length);
  }

  destroy() {
    this.adapter_.deregisterInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.deregisterInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.deregisterInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler_);
    });
    this.adapter_.deregisterValidationAttributeChangeHandler(this.validationObserver_);
  }

  /**
   * Handles user interactions with the Text Field.
   */
  handleTextFieldInteraction() {
    if (this.adapter_.getNativeInput().disabled) {
      return;
    }
    this.receivedUserInput_ = true;
  }

  /**
   * Handles validation attribute changes
   */
  handleValidationAttributeChange(attributesList: Array<string>): void {
    attributesList.some((attributeName) => {
      if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
        this.styleValidity_(true);
        return true;
      }
    });

    if (attributesList.indexOf('maxlength') > -1) {
      this.setCharacterCounter_(this.getValue().length);
    }
  }

  /**
   * Opens/closes the notched outline.
   * @param {boolean} openNotch
   */
  notchOutline(openNotch) {
    if (!this.adapter_.hasOutline()) {
      return;
    }

    if (openNotch) {
      const isDense = this.adapter_.hasClass(cssClasses.DENSE);
      const labelScale = isDense ? numbers.DENSE_LABEL_SCALE : numbers.LABEL_SCALE;
      const labelWidth = this.adapter_.getLabelWidth() * labelScale;
      this.adapter_.notchOutline(labelWidth);
    } else {
      this.adapter_.closeOutline();
    }
  }

  /**
   * Activates the text field focus state.
   */
  activateFocus() {
    this.isFocused_ = true;
    this.styleFocused_(this.isFocused_);
    this.adapter_.activateLineRipple();
    if (this.adapter_.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter_.floatLabel(this.shouldFloat);
      this.adapter_.shakeLabel(this.shouldShake);
    }
    if (this.helperText_) {
      this.helperText_.showToScreenReader();
    }
  }

  /**
   * Sets the line ripple's transform origin, so that the line ripple activate
animation will animate out from the user's click location.
   */
  setTransformOrigin(evt: Event): void {
    let targetEvent;
    if (evt.touches) {
      targetEvent = evt.touches[0];
    } else {
      targetEvent = evt;
    }
    const targetClientRect = targetEvent.target.getBoundingClientRect();
    const normalizedX = targetEvent.clientX - targetClientRect.left;
    this.adapter_.setLineRippleTransformOrigin(normalizedX);
  }

  /**
   * Handles input change of text input and text area.
   */
  handleInput() {
    this.autoCompleteFocus();
    this.setCharacterCounter_(this.getValue().length);
  }

  /**
   * Activates the Text Field's focus state in cases when the input value
   * changes without user input (e.g. programatically).
   */
  autoCompleteFocus() {
    if (!this.receivedUserInput_) {
      this.activateFocus();
    }
  }

  /**
   * Deactivates the Text Field's focus state.
   */
  deactivateFocus() {
    this.isFocused_ = false;
    this.adapter_.deactivateLineRipple();
    const isValid = this.isValid();
    this.styleValidity_(isValid);
    this.styleFocused_(this.isFocused_);
    if (this.adapter_.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter_.floatLabel(this.shouldFloat);
      this.adapter_.shakeLabel(this.shouldShake);
    }
    if (!this.shouldFloat) {
      this.receivedUserInput_ = false;
    }
  }

  getValue(): string {
    return this.getNativeInput_().value;
  }

  /**
   * @param value The value to set on the input Element.
   */
  setValue(value: string): void {
    // Prevent Safari from moving the caret to the end of the input when the value has not changed.
    if (this.getValue() !== value) {
      this.getNativeInput_().value = value;
    }
    const isValid = this.isValid();
    this.styleValidity_(isValid);
    if (this.adapter_.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter_.floatLabel(this.shouldFloat);
      this.adapter_.shakeLabel(this.shouldShake);
    }
  }

  /**
   * Otherwise, returns the result of native validity checks.
   */
  isValid(): boolean {
    return this.useNativeValidation_
      ? this.isNativeInputValid_() : this.isValid_;
  }

  /**
   * @param isValid Sets the validity state of the Text Field.
   */
  setValid(isValid: boolean): void {
    this.isValid_ = isValid;
    this.styleValidity_(isValid);

    const shouldShake = !isValid && !this.isFocused_;
    if (this.adapter_.hasLabel()) {
      this.adapter_.shakeLabel(shouldShake);
    }
  }

  /**
   * Enables or disables the use of native validation. Use this for custom validation.
   * @param useNativeValidation Set this to false to ignore native input validation.
   */
  setUseNativeValidation(useNativeValidation: boolean): void {
    this.useNativeValidation_ = useNativeValidation;
  }

  isDisabled(): boolean {
    return this.getNativeInput_().disabled;
  }

  /**
   * @param disabled Sets the text-field disabled or enabled.
   */
  setDisabled(disabled: boolean): void {
    this.getNativeInput_().disabled = disabled;
    this.styleDisabled_(disabled);
  }

  /**
   * @param content Sets the content of the helper text.
   */
  setHelperTextContent(content: string): void {
    if (this.helperText_) {
      this.helperText_.setContent(content);
    }
  }

  /**
   * Sets character counter values that shows characters used and the total character limit.

@private
   */
  setCharacterCounter_(currentLength: number): void {
    if (!this.characterCounter_) return;

    const maxLength = this.getNativeInput_().maxLength;
    if (maxLength === -1) {
      throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
    }

    this.characterCounter_.setCounterValue(currentLength, maxLength);
  }

  /**
   * Sets the aria label of the leading icon.
   */
  setLeadingIconAriaLabel(label: string): void {
    if (this.leadingIcon_) {
      this.leadingIcon_.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   */
  setLeadingIconContent(content: string): void {
    if (this.leadingIcon_) {
      this.leadingIcon_.setContent(content);
    }
  }

  /**
   * Sets the aria label of the trailing icon.
   */
  setTrailingIconAriaLabel(label: string): void {
    if (this.trailingIcon_) {
      this.trailingIcon_.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the trailing icon.
   */
  setTrailingIconContent(content: string): void {
    if (this.trailingIcon_) {
      this.trailingIcon_.setContent(content);
    }
  }

  /**
   * user-supplied value.
@private
   */
  isBadInput_(): boolean {
    return this.getNativeInput_().validity.badInput;
  }

  /**
   * (ValidityState.valid).
   */
  isNativeInputValid_(): boolean {
    return this.getNativeInput_().validity.valid;
  }

  /**
   * Styles the component based on the validity state.

@private
   */
  styleValidity_(isValid: boolean): void {
    const {INVALID} = MDCTextFieldFoundation.cssClasses;
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    if (this.helperText_) {
      this.helperText_.setValidity(isValid);
    }
  }

  /**
   * Styles the component based on the focused state.

@private
   */
  styleFocused_(isFocused: boolean): void {
    const {FOCUSED} = MDCTextFieldFoundation.cssClasses;
    if (isFocused) {
      this.adapter_.addClass(FOCUSED);
    } else {
      this.adapter_.removeClass(FOCUSED);
    }
  }

  /**
   * Styles the component based on the disabled state.

@private
   */
  styleDisabled_(isDisabled: boolean): void {
    const {DISABLED, INVALID} = MDCTextFieldFoundation.cssClasses;
    if (isDisabled) {
      this.adapter_.addClass(DISABLED);
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.removeClass(DISABLED);
    }

    if (this.leadingIcon_) {
      this.leadingIcon_.setDisabled(isDisabled);
    }

    if (this.trailingIcon_) {
      this.trailingIcon_.setDisabled(isDisabled);
    }
  }

  /**
   * host environment, or a dummy if none exists.
@private
   */
  getNativeInput_(): Element|!NativeInputType {
    return this.adapter_.getNativeInput() ||
    {
      value: '',
      disabled: false,
      validity: {
        badInput: false,
        valid: true,
      },
    };
  }
}

export {MDCTextFieldFoundation as default, MDCTextFieldFoundation};
