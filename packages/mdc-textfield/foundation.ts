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
import {EventType} from '@material/base/index';
import {MDCTextFieldAdapter} from './adapter';
import {MDCTextFieldCharacterCounterFoundation} from './character-counter';
import {ALWAYS_FLOAT_TYPES, cssClasses, numbers, strings, VALIDATION_ATTR_WHITELIST} from './constants';
import {MDCTextFieldHelperTextFoundation} from './helper-text';
import {MDCTextFieldIconFoundation} from './icon';
import {FoundationMapType, NativeInputType} from './types';

const MOUSEDOWN_TOUCHSTART_EVENTS: EventType[] = ['mousedown', 'touchstart'];
const CLICK_KEYDOWN_EVENTS: EventType[] = ['click', 'keydown'];

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

  get shouldShake(): boolean {
    return !this.isFocused_ && !this.isValid() && Boolean(this.getValue());
  }

  private get shouldAlwaysFloat_(): boolean {
    const type = this.getNativeInput_().type;
    return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
  }

  get shouldFloat(): boolean {
    // The trailing `|| false` is needed for unit tests to pass in IE 11.
    return this.shouldAlwaysFloat_ || this.isFocused_ || Boolean(this.getValue()) || this.isBadInput_() || false;
  }

  /**
   * See {@link MDCTextFieldAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCTextFieldAdapter {
    // tslint:disable:object-literal-sort-keys
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => true,
      registerTextFieldInteractionHandler: () => undefined,
      deregisterTextFieldInteractionHandler: () => undefined,
      registerInputInteractionHandler: () => undefined,
      deregisterInputInteractionHandler: () => undefined,
      registerValidationAttributeChangeHandler: () => new MutationObserver(() => undefined),
      deregisterValidationAttributeChangeHandler: () => undefined,
      getNativeInput: () => null,
      isFocused: () => false,
      activateLineRipple: () => undefined,
      deactivateLineRipple: () => undefined,
      setLineRippleTransformOrigin: () => undefined,
      shakeLabel: () => undefined,
      floatLabel: () => undefined,
      hasLabel: () => false,
      getLabelWidth: () => 0,
      hasOutline: () => false,
      notchOutline: () => undefined,
      closeOutline: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private isFocused_ = false;
  private receivedUserInput_ = false;
  private isValid_ = true;
  private useNativeValidation_ = true;

  private readonly inputFocusHandler_: () => void;
  private readonly inputBlurHandler_: EventListener;
  private readonly inputInputHandler_: EventListener;
  private readonly setPointerXOffset_: EventListener;
  private readonly textFieldInteractionHandler_: EventListener;
  private readonly validationAttributeChangeHandler_: (attributesList: string[]) => void;
  private validationObserver_!: MutationObserver; // assigned in init()

  private readonly helperText_: MDCTextFieldHelperTextFoundation | undefined;
  private readonly characterCounter_: MDCTextFieldCharacterCounterFoundation | undefined;
  private readonly leadingIcon_: MDCTextFieldIconFoundation | undefined;
  private readonly trailingIcon_: MDCTextFieldIconFoundation | undefined;

  /**
   * @param adapter
   * @param foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter?: Partial<MDCTextFieldAdapter>, foundationMap: Partial<FoundationMapType> = {}) {
    super({...MDCTextFieldFoundation.defaultAdapter, ...adapter});

    this.helperText_ = foundationMap.helperText;
    this.characterCounter_ = foundationMap.characterCounter;
    this.leadingIcon_ = foundationMap.leadingIcon;
    this.trailingIcon_ = foundationMap.trailingIcon;

    this.inputFocusHandler_ = () => this.activateFocus();
    this.inputBlurHandler_ = () => this.deactivateFocus();
    this.inputInputHandler_ = () => this.handleInput();
    this.setPointerXOffset_ = (evt) => this.setTransformOrigin(evt);
    this.textFieldInteractionHandler_ = () => this.handleTextFieldInteraction();
    this.validationAttributeChangeHandler_ = (attributesList) => this.handleValidationAttributeChange(attributesList);
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
    MOUSEDOWN_TOUCHSTART_EVENTS.forEach((evtType) => {
      this.adapter_.registerInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    CLICK_KEYDOWN_EVENTS.forEach((evtType) => {
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
    MOUSEDOWN_TOUCHSTART_EVENTS.forEach((evtType) => {
      this.adapter_.deregisterInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    CLICK_KEYDOWN_EVENTS.forEach((evtType) => {
      this.adapter_.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler_);
    });
    this.adapter_.deregisterValidationAttributeChangeHandler(this.validationObserver_);
  }

  /**
   * Handles user interactions with the Text Field.
   */
  handleTextFieldInteraction() {
    const nativeInput = this.adapter_.getNativeInput();
    if (nativeInput && nativeInput.disabled) {
      return;
    }
    this.receivedUserInput_ = true;
  }

  /**
   * Handles validation attribute changes
   */
  handleValidationAttributeChange(attributesList: string[]): void {
    attributesList.some((attributeName) => {
      if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
        this.styleValidity_(true);
        return true;
      }
      return false;
    });

    if (attributesList.indexOf('maxlength') > -1) {
      this.setCharacterCounter_(this.getValue().length);
    }
  }

  /**
   * Opens/closes the notched outline.
   */
  notchOutline(openNotch: boolean) {
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
   * animation will animate out from the user's click location.
   */
  setTransformOrigin(evt: Event): void {
    const touches = (evt as TouchEvent).touches;
    const targetEvent = touches ? touches[0] : evt;
    const targetClientRect = (targetEvent.target as Element).getBoundingClientRect();
    const normalizedX = (targetEvent as MouseEvent).clientX - targetClientRect.left;
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
   * changes without user input (e.g. programmatically).
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
   * @return The custom validity state, if set; otherwise, the result of a native validity check.
   */
  isValid(): boolean {
    return this.useNativeValidation_
      ? this.isNativeInputValid_() : this.isValid_;
  }

  /**
   * @param isValid Sets the custom validity state of the Text Field.
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
   * Sets character counter values that shows characters used and the total character limit.
   */
  private setCharacterCounter_(currentLength: number): void {
    if (!this.characterCounter_) return;

    const maxLength = this.getNativeInput_().maxLength;
    if (maxLength === -1) {
      throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
    }

    this.characterCounter_.setCounterValue(currentLength, maxLength);
  }

  /**
   * @return True if the Text Field input fails in converting the user-supplied value.
   */
  private isBadInput_(): boolean {
    return this.getNativeInput_().validity.badInput;
  }

  /**
   * @return The result of native validity checking (ValidityState.valid).
   */
  private isNativeInputValid_(): boolean {
    return this.getNativeInput_().validity.valid;
  }

  /**
   * Styles the component based on the validity state.
   */
  private styleValidity_(isValid: boolean): void {
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
   */
  private styleFocused_(isFocused: boolean): void {
    const {FOCUSED} = MDCTextFieldFoundation.cssClasses;
    if (isFocused) {
      this.adapter_.addClass(FOCUSED);
    } else {
      this.adapter_.removeClass(FOCUSED);
    }
  }

  /**
   * Styles the component based on the disabled state.
   */
  private styleDisabled_(isDisabled: boolean): void {
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
   * @return The native text input from the host environment, or a dummy if none exists.
   */
  private getNativeInput_(): HTMLInputElement | NativeInputType {
    // adapter_ can be undefined in foundation unit tests. This happens when testdouble is creating a mock object and
    // invokes the shouldShake/shouldFloat getters (which in turn call getValue(), which calls this method) before
    // init() has been called in the MDCTextField constructor.
    const nativeInput = this.adapter_ ? this.adapter_.getNativeInput() : null;
    return nativeInput || {
      disabled: false,
      maxLength: -1,
      type: 'input',
      validity: {
        badInput: false,
        valid: true,
      },
      value: '',
    };
  }
}

export {MDCTextFieldFoundation as default, MDCTextFieldFoundation};
