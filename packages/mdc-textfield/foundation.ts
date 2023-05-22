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

type PointerDownEventType = 'mousedown'|'touchstart';
type InteractionEventType = 'click'|'keydown';

const POINTERDOWN_EVENTS: PointerDownEventType[] = ['mousedown', 'touchstart'];
const INTERACTION_EVENTS: InteractionEventType[] = ['click', 'keydown'];

/** MDC Text Field Foundation */
export class MDCTextFieldFoundation extends MDCFoundation<MDCTextFieldAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get numbers() {
    return numbers;
  }

  private get shouldAlwaysFloat(): boolean {
    const type = this.getNativeInput().type;
    return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
  }

  get shouldFloat(): boolean {
    return this.shouldAlwaysFloat || this.isFocused || !!this.getValue() ||
        this.isBadInput();
  }

  get shouldShake(): boolean {
    return !this.isFocused && !this.isValid() && !!this.getValue();
  }

  /**
   * See {@link MDCTextFieldAdapter} for typing information on parameters and
   * return types.
   */
  static override get defaultAdapter(): MDCTextFieldAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => true,
      setInputAttr: () => undefined,
      removeInputAttr: () => undefined,
      registerTextFieldInteractionHandler: () => undefined,
      deregisterTextFieldInteractionHandler: () => undefined,
      registerInputInteractionHandler: () => undefined,
      deregisterInputInteractionHandler: () => undefined,
      registerValidationAttributeChangeHandler: () =>
          new MutationObserver(() => undefined),
      deregisterValidationAttributeChangeHandler: () => undefined,
      getNativeInput: () => null,
      isFocused: () => false,
      activateLineRipple: () => undefined,
      deactivateLineRipple: () => undefined,
      setLineRippleTransformOrigin: () => undefined,
      shakeLabel: () => undefined,
      floatLabel: () => undefined,
      setLabelRequired: () => undefined,
      hasLabel: () => false,
      getLabelWidth: () => 0,
      hasOutline: () => false,
      notchOutline: () => undefined,
      closeOutline: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private isFocused = false;
  private receivedUserInput = false;
  private useNativeValidation = true;
  private validateOnValueChange = true;
  private valid: boolean;

  private readonly inputFocusHandler: () => void;
  private readonly inputBlurHandler: SpecificEventListener<'blur'>;
  private readonly inputInputHandler: SpecificEventListener<'input'>;
  private readonly setPointerXOffset:
      SpecificEventListener<PointerDownEventType>;
  private readonly textFieldInteractionHandler:
      SpecificEventListener<InteractionEventType>;
  private readonly validationAttributeChangeHandler:
      (attributesList: string[]) => void;
  private validationObserver!: MutationObserver;  // assigned in init()

  private readonly helperText?: MDCTextFieldHelperTextFoundation;
  private readonly characterCounter?: MDCTextFieldCharacterCounterFoundation;
  private readonly leadingIcon?: MDCTextFieldIconFoundation;
  private readonly trailingIcon?: MDCTextFieldIconFoundation;

  /**
   * @param adapter
   * @param foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(
      adapter?: Partial<MDCTextFieldAdapter>,
      foundationMap: Partial<MDCTextFieldFoundationMap> = {}) {
    super({...MDCTextFieldFoundation.defaultAdapter, ...adapter});

    this.helperText = foundationMap.helperText;
    this.characterCounter = foundationMap.characterCounter;
    this.leadingIcon = foundationMap.leadingIcon;
    this.trailingIcon = foundationMap.trailingIcon;
    this.valid =
        !this.adapter.hasClass(MDCTextFieldFoundation.cssClasses.INVALID);

    this.inputFocusHandler = () => {
      this.activateFocus();
    };
    this.inputBlurHandler = () => {
      this.deactivateFocus();
    };
    this.inputInputHandler = () => {
      this.handleInput();
    };
    this.setPointerXOffset = (evt) => {
      this.setTransformOrigin(evt);
    };
    this.textFieldInteractionHandler = () => {
      this.handleTextFieldInteraction();
    };
    this.validationAttributeChangeHandler = (attributesList) => {
      this.handleValidationAttributeChange(attributesList);
    };
  }

  override init() {
    if (this.adapter.hasLabel() && this.getNativeInput().required) {
      this.adapter.setLabelRequired(true);
    }

    if (this.adapter.isFocused()) {
      this.inputFocusHandler();
    } else if (this.adapter.hasLabel() && this.shouldFloat) {
      this.notchOutline(true);
      this.adapter.floatLabel(true);
      this.styleFloating(true);
    }

    this.adapter.registerInputInteractionHandler(
        'focus', this.inputFocusHandler);
    this.adapter.registerInputInteractionHandler('blur', this.inputBlurHandler);
    this.adapter.registerInputInteractionHandler(
        'input', this.inputInputHandler);
    for (const evtType of POINTERDOWN_EVENTS) {
      this.adapter.registerInputInteractionHandler(
          evtType, this.setPointerXOffset);
    }
    for (const evtType of INTERACTION_EVENTS) {
      this.adapter.registerTextFieldInteractionHandler(
          evtType, this.textFieldInteractionHandler);
    }
    this.validationObserver =
        this.adapter.registerValidationAttributeChangeHandler(
            this.validationAttributeChangeHandler);
    this.setcharacterCounter(this.getValue().length);
  }

  override destroy() {
    this.adapter.deregisterInputInteractionHandler(
        'focus', this.inputFocusHandler);
    this.adapter.deregisterInputInteractionHandler(
        'blur', this.inputBlurHandler);
    this.adapter.deregisterInputInteractionHandler(
        'input', this.inputInputHandler);
    for (const evtType of POINTERDOWN_EVENTS) {
      this.adapter.deregisterInputInteractionHandler(
          evtType, this.setPointerXOffset);
    }
    for (const evtType of INTERACTION_EVENTS) {
      this.adapter.deregisterTextFieldInteractionHandler(
          evtType, this.textFieldInteractionHandler);
    }
    this.adapter.deregisterValidationAttributeChangeHandler(
        this.validationObserver);
  }

  /**
   * Handles user interactions with the Text Field.
   */
  handleTextFieldInteraction() {
    const nativeInput = this.adapter.getNativeInput();
    if (nativeInput && nativeInput.disabled) {
      return;
    }
    this.receivedUserInput = true;
  }

  /**
   * Handles validation attribute changes
   */
  handleValidationAttributeChange(attributesList: string[]): void {
    attributesList.some((attributeName) => {
      if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
        this.styleValidity(true);
        this.adapter.setLabelRequired(this.getNativeInput().required);
        return true;
      }
      return false;
    });

    if (attributesList.indexOf('maxlength') > -1) {
      this.setcharacterCounter(this.getValue().length);
    }
  }

  /**
   * Opens/closes the notched outline.
   */
  notchOutline(openNotch: boolean) {
    if (!this.adapter.hasOutline() || !this.adapter.hasLabel()) {
      return;
    }

    if (openNotch) {
      const labelWidth = this.adapter.getLabelWidth() * numbers.LABEL_SCALE;
      this.adapter.notchOutline(labelWidth);
    } else {
      this.adapter.closeOutline();
    }
  }

  /**
   * Activates the text field focus state.
   */
  activateFocus() {
    this.isFocused = true;
    this.styleFocused(this.isFocused);
    this.styleValidity(this.valid);
    this.adapter.activateLineRipple();
    if (this.adapter.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter.floatLabel(this.shouldFloat);
      this.styleFloating(this.shouldFloat);
      this.adapter.shakeLabel(this.shouldShake);
    }
    if (this.helperText &&
        (this.helperText.isPersistent() || !this.helperText.isValidation() ||
         !this.valid)) {
      this.helperText.showToScreenReader();
    }
  }

  /**
   * Sets the line ripple's transform origin, so that the line ripple activate
   * animation will animate out from the user's click location.
   */
  setTransformOrigin(evt: TouchEvent|MouseEvent): void {
    if (this.isDisabled() || this.adapter.hasOutline()) {
      return;
    }

    const touches = (evt as TouchEvent).touches;
    const targetEvent = touches ? touches[0] : evt;
    const targetClientRect =
        (targetEvent.target as Element).getBoundingClientRect();
    const normalizedX =
        (targetEvent as MouseEvent).clientX - targetClientRect.left;
    this.adapter.setLineRippleTransformOrigin(normalizedX);
  }

  /**
   * Handles input change of text input and text area.
   */
  handleInput() {
    this.autoCompleteFocus();
    this.setcharacterCounter(this.getValue().length);
  }

  /**
   * Activates the Text Field's focus state in cases when the input value
   * changes without user input (e.g. programmatically).
   */
  autoCompleteFocus() {
    if (!this.receivedUserInput) {
      this.activateFocus();
    }
  }

  /**
   * Deactivates the Text Field's focus state.
   */
  deactivateFocus() {
    this.isFocused = false;
    this.adapter.deactivateLineRipple();
    const isValid = this.isValid();
    this.styleValidity(isValid);
    this.styleFocused(this.isFocused);
    if (this.adapter.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter.floatLabel(this.shouldFloat);
      this.styleFloating(this.shouldFloat);
      this.adapter.shakeLabel(this.shouldShake);
    }
    if (!this.shouldFloat) {
      this.receivedUserInput = false;
    }
  }

  getValue(): string {
    return this.getNativeInput().value;
  }

  /**
   * @param value The value to set on the input Element.
   */
  setValue(value: string): void {
    // Prevent Safari from moving the caret to the end of the input when the
    // value has not changed.
    if (this.getValue() !== value) {
      this.getNativeInput().value = value;
    }
    this.setcharacterCounter(value.length);
    if (this.validateOnValueChange) {
      const isValid = this.isValid();
      this.styleValidity(isValid);
    }
    if (this.adapter.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter.floatLabel(this.shouldFloat);
      this.styleFloating(this.shouldFloat);
      if (this.validateOnValueChange) {
        this.adapter.shakeLabel(this.shouldShake);
      }
    }
  }

  /**
   * @return The custom validity state, if set; otherwise, the result of a
   *     native validity check.
   */
  isValid(): boolean {
    return this.useNativeValidation ? this.isNativeInputValid() : this.valid;
  }

  /**
   * @param isValid Sets the custom validity state of the Text Field.
   */
  setValid(isValid: boolean): void {
    this.valid = isValid;
    this.styleValidity(isValid);

    const shouldShake = !isValid && !this.isFocused && !!this.getValue();
    if (this.adapter.hasLabel()) {
      this.adapter.shakeLabel(shouldShake);
    }
  }

  /**
   * @param shouldValidate Whether or not validity should be updated on
   *     value change.
   */
  setValidateOnValueChange(shouldValidate: boolean): void {
    this.validateOnValueChange = shouldValidate;
  }

  /**
   * @return Whether or not validity should be updated on value change. `true`
   *     by default.
   */
  getValidateOnValueChange(): boolean {
    return this.validateOnValueChange;
  }

  /**
   * Enables or disables the use of native validation. Use this for custom
   * validation.
   * @param useNativeValidation Set this to false to ignore native input
   *     validation.
   */
  setUseNativeValidation(useNativeValidation: boolean): void {
    this.useNativeValidation = useNativeValidation;
  }

  isDisabled(): boolean {
    return this.getNativeInput().disabled;
  }

  /**
   * @param disabled Sets the text-field disabled or enabled.
   */
  setDisabled(disabled: boolean): void {
    this.getNativeInput().disabled = disabled;
    this.styleDisabled(disabled);
  }

  /**
   * @param content Sets the content of the helper text.
   */
  setHelperTextContent(content: string): void {
    if (this.helperText) {
      this.helperText.setContent(content);
    }
  }

  /**
   * Sets the aria label of the leading icon.
   */
  setLeadingIconAriaLabel(label: string): void {
    if (this.leadingIcon) {
      this.leadingIcon.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   */
  setLeadingIconContent(content: string): void {
    if (this.leadingIcon) {
      this.leadingIcon.setContent(content);
    }
  }

  /**
   * Sets the aria label of the trailing icon.
   */
  setTrailingIconAriaLabel(label: string): void {
    if (this.trailingIcon) {
      this.trailingIcon.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the trailing icon.
   */
  setTrailingIconContent(content: string): void {
    if (this.trailingIcon) {
      this.trailingIcon.setContent(content);
    }
  }

  /**
   * Sets character counter values that shows characters used and the total
   * character limit.
   */
  private setcharacterCounter(currentLength: number): void {
    if (!this.characterCounter) {
      return;
    }

    const maxLength = this.getNativeInput().maxLength;
    if (maxLength === -1) {
      throw new Error(
          'MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
    }

    this.characterCounter.setCounterValue(currentLength, maxLength);
  }

  /**
   * @return True if the Text Field input fails in converting the user-supplied
   *     value.
   */
  private isBadInput(): boolean {
    // The badInput property is not supported in IE 11 💩.
    return this.getNativeInput().validity.badInput || false;
  }

  /**
   * @return The result of native validity checking (ValidityState.valid).
   */
  private isNativeInputValid(): boolean {
    return this.getNativeInput().validity.valid;
  }

  /**
   * Styles the component based on the validity state.
   */
  private styleValidity(isValid: boolean): void {
    const {INVALID} = MDCTextFieldFoundation.cssClasses;
    if (isValid) {
      this.adapter.removeClass(INVALID);
    } else {
      this.adapter.addClass(INVALID);
    }
    if (this.helperText) {
      this.helperText.setValidity(isValid);

      // We dynamically set or unset aria-describedby for validation helper text
      // only, based on whether the field is valid
      const helperTextValidation = this.helperText.isValidation();
      if (!helperTextValidation) {
        return;
      }

      const helperTextVisible = this.helperText.isVisible();
      const helperTextId = this.helperText.getId();

      if (helperTextVisible && helperTextId) {
        this.adapter.setInputAttr(strings.ARIA_DESCRIBEDBY, helperTextId);
      } else {
        this.adapter.removeInputAttr(strings.ARIA_DESCRIBEDBY);
      }
    }
  }

  /**
   * Styles the component based on the focused state.
   */
  private styleFocused(isFocused: boolean): void {
    const {FOCUSED} = MDCTextFieldFoundation.cssClasses;
    if (isFocused) {
      this.adapter.addClass(FOCUSED);
    } else {
      this.adapter.removeClass(FOCUSED);
    }
  }

  /**
   * Styles the component based on the disabled state.
   */
  private styleDisabled(isDisabled: boolean): void {
    const {DISABLED, INVALID} = MDCTextFieldFoundation.cssClasses;
    if (isDisabled) {
      this.adapter.addClass(DISABLED);
      this.adapter.removeClass(INVALID);
    } else {
      this.adapter.removeClass(DISABLED);
    }

    if (this.leadingIcon) {
      this.leadingIcon.setDisabled(isDisabled);
    }

    if (this.trailingIcon) {
      this.trailingIcon.setDisabled(isDisabled);
    }
  }

  /**
   * Styles the component based on the label floating state.
   */
  private styleFloating(isFloating: boolean): void {
    const {LABEL_FLOATING} = MDCTextFieldFoundation.cssClasses;
    if (isFloating) {
      this.adapter.addClass(LABEL_FLOATING);
    } else {
      this.adapter.removeClass(LABEL_FLOATING);
    }
  }

  /**
   * @return The native text input element from the host environment, or an
   *     object with the same shape for unit tests.
   */
  private getNativeInput(): MDCTextFieldNativeInputElement {
    // this.adapter may be undefined in foundation unit tests. This happens when
    // testdouble is creating a mock object and invokes the
    // shouldShake/shouldFloat getters (which in turn call getValue(), which
    // calls this method) before init() has been called from the MDCTextField
    // constructor. To work around that issue, we return a dummy object.
    const nativeInput = this.adapter ? this.adapter.getNativeInput() : null;
    return nativeInput || {
      disabled: false,
      maxLength: -1,
      required: false,
      type: 'input',
      validity: {
        badInput: false,
        valid: true,
      },
      value: '',
    };
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTextFieldFoundation;
