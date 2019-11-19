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
import {SpecificEventListener} from '@material/base/types';
import {MDCTextFieldAdapter} from './adapter';
import {MDCTextFieldCharacterCounterFoundation} from './character-counter/foundation';
import {ALWAYS_FLOAT_TYPES, cssClasses, numbers, strings, VALIDATION_ATTR_WHITELIST} from './constants';
import {MDCTextFieldHelperTextFoundation} from './helper-text/foundation';
import {MDCTextFieldIconFoundation} from './icon/foundation';
import {MDCTextFieldFoundationMap, MDCTextFieldNativeInputElement} from './types';

type PointerDownEventType = 'mousedown' | 'touchstart';
type InteractionEventType = 'click' | 'keydown';

const POINTERDOWN_EVENTS: PointerDownEventType[] = ['mousedown', 'touchstart'];
const INTERACTION_EVENTS: InteractionEventType[] = ['click', 'keydown'];

export class MDCTextFieldFoundation extends MDCFoundation<MDCTextFieldAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  private get shouldAlwaysFloat_(): boolean {
    const type = this.getNativeInput_().type;
    return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
  }

  get shouldFloat(): boolean {
    return this.shouldAlwaysFloat_ || this.isFocused_ || !!this.getValue() || this.isBadInput_();
  }

  get shouldShake(): boolean {
    return !this.isFocused_ && !this.isValid() && !!this.getValue();
  }

  /**
   * See {@link MDCTextFieldAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCTextFieldAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
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
  private readonly inputBlurHandler_: SpecificEventListener<'blur'>;
  private readonly inputInputHandler_: SpecificEventListener<'input'>;
  private readonly setPointerXOffset_: SpecificEventListener<PointerDownEventType>;
  private readonly textFieldInteractionHandler_: SpecificEventListener<InteractionEventType>;
  private readonly validationAttributeChangeHandler_: (attributesList: string[]) => void;
  private validationObserver_!: MutationObserver; // assigned in init()

  private readonly helperText_?: MDCTextFieldHelperTextFoundation;
  private readonly characterCounter_?: MDCTextFieldCharacterCounterFoundation;
  private readonly leadingIcon_?: MDCTextFieldIconFoundation;
  private readonly trailingIcon_?: MDCTextFieldIconFoundation;

  /**
   * @param adapter
   * @param foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter?: Partial<MDCTextFieldAdapter>, foundationMap: Partial<MDCTextFieldFoundationMap> = {}) {
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
    POINTERDOWN_EVENTS.forEach((evtType) => {
      this.adapter_.registerInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    INTERACTION_EVENTS.forEach((evtType) => {
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
    POINTERDOWN_EVENTS.forEach((evtType) => {
      this.adapter_.deregisterInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    INTERACTION_EVENTS.forEach((evtType) => {
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
  setTransformOrigin(evt: TouchEvent | MouseEvent): void {
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
    this.setCharacterCounter_(value.length);
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

    const shouldShake = !isValid && !this.isFocused_ && !!this.getValue();
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
    if (!this.characterCounter_) {
      return;
    }

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
    // The badInput property is not supported in IE 11 💩.
    return this.getNativeInput_().validity.badInput || false;
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
    const {ARIA_INVALID} = MDCTextFieldFoundation.strings;
    const nativeInput = this.getNativeInput_();
    if (isValid) {
      this.adapter_.removeClass(INVALID);
      nativeInput.removeAttribute(ARIA_INVALID);
    } else {
      this.adapter_.addClass(INVALID);
      nativeInput.setAttribute(ARIA_INVALID, "true");
    }
    if (this.helperText_) {
      this.helperText_.setValidity(isValid, this.isFocused_);
    }
  }

  /**
   * Styles the component based on the focused state.
   */
  private styleFocused_(isFocused: boolean): void {
    const {FOCUSED} = MDCTextFieldFoundation.cssClasses;
    const {ROLE} = MDCTextFieldFoundation.strings;
    if (isFocused) {
      this.adapter_.addClass(FOCUSED);
      // Remove the "alert" role from the Helper Text so it can be re-added
      // on blur, triggering ATs to announce the error message.
      if (this.helperText_) {
        this.helperText_.removeAttr(ROLE);
      }
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
   * @return The native text input element from the host environment, or an object with the same shape for unit tests.
   */
  private getNativeInput_(): MDCTextFieldNativeInputElement {
    // this.adapter_ may be undefined in foundation unit tests. This happens when testdouble is creating a mock object
    // and invokes the shouldShake/shouldFloat getters (which in turn call getValue(), which calls this method) before
    // init() has been called from the MDCTextField constructor. To work around that issue, we return a dummy object.
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
      removeAttribute: () => {},
      setAttribute: () => {},
    };
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTextFieldFoundation;
