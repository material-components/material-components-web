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

import {MDCComponent} from '@material/base/component';
/* eslint-disable no-unused-vars */
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
/* eslint-enable no-unused-vars */
import {getMatchesProperty} from '@material/ripple/util';


import {cssClasses, strings} from './constants';
import {MDCTextFieldAdapter, FoundationMapType} from './adapter';
import {MDCTextFieldFoundation} from './foundation';
/* eslint-disable no-unused-vars */
import {MDCLineRipple, MDCLineRippleFoundation} from '@material/line-ripple/index';
import {MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation} from './helper-text/index';
import {MDCTextFieldCharacterCounter, MDCTextFieldCharacterCounterFoundation} from './character-counter/index';
import {MDCTextFieldIcon, MDCTextFieldIconFoundation} from './icon/index';
import {MDCFloatingLabel, MDCFloatingLabelFoundation} from '@material/floating-label/index';
import {MDCNotchedOutline, MDCNotchedOutlineFoundation} from '@material/notched-outline/index';
/* eslint-enable no-unused-vars */

class MDCTextField extends MDCComponent<MDCTextFieldFoundation> {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.input_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCLineRipple} */
    this.lineRipple_;
    /** @private {?MDCTextFieldHelperText} */
    this.helperText_;
    /** @private {?MDCTextFieldCharacterCounter} */
    this.characterCounter_;
    /** @private {?MDCTextFieldIcon} */
    this.leadingIcon_;
    /** @private {?MDCTextFieldIcon} */
    this.trailingIcon_;
    /** @private {?MDCFloatingLabel} */
    this.label_;
    /** @private {?MDCNotchedOutline} */
    this.outline_;
  }

  static attachTo(root: Element): MDCTextField {
    return new MDCTextField(root);
  }

  /**
   * @param {(function(!Element, MDCRippleFoundation): !MDCRipple)=} rippleFactory A function which
   * creates a new MDCRipple.
   * @param {(function(!Element): !MDCLineRipple)=} lineRippleFactory A function which
   * creates a new MDCLineRipple.
   * @param {(function(!Element): !MDCTextFieldHelperText)=} helperTextFactory A function which
   * creates a new MDCTextFieldHelperText.
   * @param {(function(!Element): !MDCTextFieldCharacterCounter)=} characterCounterFactory A function which
   * creates a new MDCTextFieldCharacterCounter.
   * @param {(function(!Element): !MDCTextFieldIcon)=} iconFactory A function which
   * creates a new MDCTextFieldIcon.
   * @param {(function(!Element): !MDCFloatingLabel)=} labelFactory A function which
   * creates a new MDCFloatingLabel.
   * @param {(function(!Element): !MDCNotchedOutline)=} outlineFactory A function which
   * creates a new MDCNotchedOutline.
   */
  initialize(
    rippleFactory = (el, foundation) => new MDCRipple(el, foundation),
    lineRippleFactory = (el) => new MDCLineRipple(el),
    helperTextFactory = (el) => new MDCTextFieldHelperText(el),
    characterCounterFactory = (el) => new MDCTextFieldCharacterCounter(el),
    iconFactory = (el) => new MDCTextFieldIcon(el),
    labelFactory = (el) => new MDCFloatingLabel(el),
    outlineFactory = (el) => new MDCNotchedOutline(el)) {
    this.input_ = this.root_.querySelector(strings.INPUT_SELECTOR);
    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    if (lineRippleElement) {
      this.lineRipple_ = lineRippleFactory(lineRippleElement);
    }
    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    if (outlineElement) {
      this.outline_ = outlineFactory(outlineElement);
    }

    // Helper text
    const helperTextStrings = MDCTextFieldHelperTextFoundation.strings;
    const nextElementSibling = this.root_.nextElementSibling;
    const hasHelperLine = (nextElementSibling && nextElementSibling.classList.contains(cssClasses.HELPER_LINE));
    const helperTextEl = hasHelperLine && nextElementSibling.querySelector(helperTextStrings.ROOT_SELECTOR);
    if (helperTextEl) {
      this.helperText_ = helperTextFactory(helperTextEl);
    }

    // Character counter
    const characterCounterStrings = MDCTextFieldCharacterCounterFoundation.strings;
    let characterCounterEl = this.root_.querySelector(characterCounterStrings.ROOT_SELECTOR);
    // If character counter is not found in root element search in sibling element.
    if (!characterCounterEl && hasHelperLine) {
      characterCounterEl = nextElementSibling.querySelector(characterCounterStrings.ROOT_SELECTOR);
    }

    if (characterCounterEl) {
      this.characterCounter_ = characterCounterFactory(characterCounterEl);
    }

    const iconElements = this.root_.querySelectorAll(strings.ICON_SELECTOR);
    if (iconElements.length > 0) {
      if (iconElements.length > 1) { // Has both icons.
        this.leadingIcon_ = iconFactory(iconElements[0]);
        this.trailingIcon_ = iconFactory(iconElements[1]);
      } else {
        if (this.root_.classList.contains(cssClasses.WITH_LEADING_ICON)) {
          this.leadingIcon_ = iconFactory(iconElements[0]);
        } else {
          this.trailingIcon_ = iconFactory(iconElements[0]);
        }
      }
    }

    this.ripple = null;
    if (!this.root_.classList.contains(cssClasses.TEXTAREA) && !this.root_.classList.contains(cssClasses.OUTLINED)) {
      const MATCHES = getMatchesProperty(HTMLElement.prototype);
      const adapter =
        Object.assign(MDCRipple.createAdapter(this)), {
          isSurfaceActive: () => this.input_[MATCHES](':active'),
          registerInteractionHandler: (type, handler) => this.input_.addEventListener(type, handler),
          deregisterInteractionHandler: (type, handler) => this.input_.removeEventListener(type, handler),
        };
      const foundation = new MDCRippleFoundation(adapter);
      this.ripple = rippleFactory(this.root_, foundation);
    }
  }

  destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.lineRipple_) {
      this.lineRipple_.destroy();
    }
    if (this.helperText_) {
      this.helperText_.destroy();
    }
    if (this.characterCounter_) {
      this.characterCounter_.destroy();
    }
    if (this.leadingIcon_) {
      this.leadingIcon_.destroy();
    }
    if (this.trailingIcon_) {
      this.trailingIcon_.destroy();
    }
    if (this.label_) {
      this.label_.destroy();
    }
    if (this.outline_) {
      this.outline_.destroy();
    }
    super.destroy();
  }

  /**
   * Initiliazes the Text Field's internal state based on the environment's
   * state.
   */
  initialSyncWithDom() {
    this.disabled = this.input_.disabled;
  }

  get value(): string {
    return this.foundation_.getValue();
  }

  /**
   * @param value The value to set on the input.
   */
  set value(value: string): void {
    this.foundation_.setValue(value);
  }

  get disabled(): boolean {
    return this.foundation_.isDisabled();
  }

  /**
   * @param disabled Sets the Text Field disabled or enabled.
   */
  set disabled(disabled: boolean): void {
    this.foundation_.setDisabled(disabled);
  }

  get valid(): boolean {
    return this.foundation_.isValid();
  }

  /**
   * @param valid Sets the Text Field valid or invalid.
   */
  set valid(valid: boolean): void {
    this.foundation_.setValid(valid);
  }

  get required(): boolean {
    return this.input_.required;
  }

  /**
   * @param required Sets the Text Field to required.
   */
  set required(required: boolean): void {
    this.input_.required = required;
  }

  get pattern(): string {
    return this.input_.pattern;
  }

  /**
   * @param pattern Sets the input element's validation pattern.
   */
  set pattern(pattern: string): void {
    this.input_.pattern = pattern;
  }

  get minLength(): number {
    return this.input_.minLength;
  }

  /**
   * @param minLength Sets the input element's minLength.
   */
  set minLength(minLength: number): void {
    this.input_.minLength = minLength;
  }

  get maxLength(): number {
    return this.input_.maxLength;
  }

  /**
   * @param maxLength Sets the input element's maxLength.
   */
  set maxLength(maxLength: number): void {
    // Chrome throws exception if maxLength is set < 0
    if (maxLength < 0) {
      this.input_.removeAttribute('maxLength');
    } else {
      this.input_.maxLength = maxLength;
    }
  }

  get min(): string {
    return this.input_.min;
  }

  /**
   * @param min Sets the input element's min.
   */
  set min(min: string): void {
    this.input_.min = min;
  }

  get max(): string {
    return this.input_.max;
  }

  /**
   * @param max Sets the input element's max.
   */
  set max(max: string): void {
    this.input_.max = max;
  }

  get step(): string {
    return this.input_.step;
  }

  /**
   * @param step Sets the input element's step.
   */
  set step(step: string): void {
    this.input_.step = step;
  }

  /**
   * Sets the helper text element content.
   */
  set helperTextContent(content: string): void {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * Sets the aria label of the leading icon.
   */
  set leadingIconAriaLabel(label: string): void {
    this.foundation_.setLeadingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the leading icon.
   */
  set leadingIconContent(content: string): void {
    this.foundation_.setLeadingIconContent(content);
  }

  /**
   * Sets the aria label of the trailing icon.
   */
  set trailingIconAriaLabel(label: string): void {
    this.foundation_.setTrailingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the trailing icon.
   */
  set trailingIconContent(content: string): void {
    this.foundation_.setTrailingIconContent(content);
  }

  /**
   * Enables or disables the use of native validation. Use this for custom validation.
   * @param useNativeValidation Set this to false to ignore native input validation.
   */
  set useNativeValidation(useNativeValidation: boolean): void {
    this.foundation_.setUseNativeValidation(useNativeValidation);
  }

  /**
   * Focuses the input element.
   */
  focus() {
    this.input_.focus();
  }

  /**
   * Recomputes the outline SVG path for the outline element.
   */
  layout() {
    const openNotch = this.foundation_.shouldFloat;
    this.foundation_.notchOutline(openNotch);
  }

  getDefaultFoundation(): MDCTextFieldFoundation {
    return new MDCTextFieldFoundation(
      Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        registerTextFieldInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
        deregisterTextFieldInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
        registerValidationAttributeChangeHandler: (handler) => {
          const getAttributesList = (mutationsList) => mutationsList.map((mutation) => mutation.attributeName;
          const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
          const targetNode = this.root_.querySelector(strings.INPUT_SELECTOR);
          const config = {attributes: true};
          observer.observe(targetNode, config);
          return observer;
        },
        deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect(),
        isFocused: () => {
          return document.activeElement === this.root_.querySelector(strings.INPUT_SELECTOR);
        },
      },
      this.getInputAdapterMethods_(),
      this.getLabelAdapterMethods_(),
      this.getLineRippleAdapterMethods_(),
      this.getOutlineAdapterMethods_())),
      this.getFoundationMap_());
  }

  /**
   * shakeLabel: function(boolean): undefined,
  floatLabel: function(boolean): undefined,
  hasLabel: function(): boolean,
  getLabelWidth: function(): number,
}}
   */
  getLabelAdapterMethods_(): {
   *   shakeLabel: function(boolean): undefined,
   *   floatLabel: function(boolean): undefined,
   *   hasLabel: function(): boolean,
   *   getLabelWidth: function(): number,
   *  {
    return {
      shakeLabel: (shouldShake) => this.label_.shake(shouldShake),
      floatLabel: (shouldFloat) => this.label_.float(shouldFloat),
      hasLabel: () => !!this.label_,
      getLabelWidth: () => this.label_ ? this.label_.getWidth() : 0,
    };
  }

  /**
   * activateLineRipple: function(): undefined,
  deactivateLineRipple: function(): undefined,
  setLineRippleTransformOrigin: function(number): undefined,
}}
   */
  getLineRippleAdapterMethods_(): {
   *   activateLineRipple: function(): undefined,
   *   deactivateLineRipple: function(): undefined,
   *   setLineRippleTransformOrigin: function(number): undefined,
   *  {
    return {
      activateLineRipple: () => {
        if (this.lineRipple_) {
          this.lineRipple_.activate();
        }
      },
      deactivateLineRipple: () => {
        if (this.lineRipple_) {
          this.lineRipple_.deactivate();
        }
      },
      setLineRippleTransformOrigin: (normalizedX) => {
        if (this.lineRipple_) {
          this.lineRipple_.setRippleCenter(normalizedX);
        }
      },
    };
  }

  /**
   * notchOutline: function(number, boolean): undefined,
  hasOutline: function(): boolean,
}}
   */
  getOutlineAdapterMethods_(): {
   *   notchOutline: function(number, boolean): undefined,
   *   hasOutline: function(): boolean,
   *  {
    return {
      notchOutline: (labelWidth) => this.outline_.notch(labelWidth),
      closeOutline: () => this.outline_.closeNotch(),
      hasOutline: () => !!this.outline_,
    };
  }

  /**
   * registerInputInteractionHandler: function(string, function()): undefined,
  deregisterInputInteractionHandler: function(string, function()): undefined,
  getNativeInput: function(): ?Element,
}}
   */
  getInputAdapterMethods_(): {
   *   registerInputInteractionHandler: function(string, function()): undefined,
   *   deregisterInputInteractionHandler: function(string, function()): undefined,
   *   getNativeInput: function(): ?Element,
   *  {
    return {
      registerInputInteractionHandler: (evtType, handler) => this.input_.addEventListener(evtType, handler),
      deregisterInputInteractionHandler: (evtType, handler) => this.input_.removeEventListener(evtType, handler),
      getNativeInput: () => this.input_,
    };
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   */
  getFoundationMap_(): FoundationMapType {
    return {
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
      characterCounter: this.characterCounter_ ? this.characterCounter_.foundation : undefined,
      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
      trailingIcon: this.trailingIcon_ ? this.trailingIcon_.foundation : undefined,
    };
  }
}

export {MDCTextField, MDCTextFieldFoundation,
  MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation,
  MDCTextFieldCharacterCounter, MDCTextFieldCharacterCounterFoundation,
  MDCTextFieldIcon, MDCTextFieldIconFoundation};
