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
import {applyPassive} from '@material/dom/events';
import * as ponyfill from '@material/dom/ponyfill';
import {MDCFloatingLabel, MDCFloatingLabelFactory} from '@material/floating-label/component';
import {MDCLineRipple, MDCLineRippleFactory} from '@material/line-ripple/component';
import {MDCNotchedOutline, MDCNotchedOutlineFactory} from '@material/notched-outline/component';
import {MDCRippleAdapter} from '@material/ripple/adapter';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';
import {
  MDCTextFieldAdapter,
  MDCTextFieldInputAdapter,
  MDCTextFieldLabelAdapter,
  MDCTextFieldLineRippleAdapter,
  MDCTextFieldOutlineAdapter,
  MDCTextFieldRootAdapter,
} from './adapter';
import {
  MDCTextFieldCharacterCounter,
  MDCTextFieldCharacterCounterFactory,
} from './character-counter/component';
import {MDCTextFieldCharacterCounterFoundation} from './character-counter/foundation';
import {cssClasses, strings} from './constants';
import {MDCTextFieldFoundation} from './foundation';
import {
  MDCTextFieldHelperText,
  MDCTextFieldHelperTextFactory,
} from './helper-text/component';
import {MDCTextFieldHelperTextFoundation} from './helper-text/foundation';
import {MDCTextFieldIcon, MDCTextFieldIconFactory} from './icon/component';
import {MDCTextFieldFoundationMap} from './types';

export class MDCTextField extends MDCComponent<MDCTextFieldFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element): MDCTextField {
    return new MDCTextField(root);
  }

  // Public visibility for this property is required by MDCRippleCapableSurface.
  root_!: HTMLElement; // assigned in MDCComponent constructor

  ripple!: MDCRipple | null; // assigned in initialize()

  // The only required sub-element.
  private input_!: HTMLInputElement; // assigned in initialize()

  // Optional sub-elements.
  private characterCounter_!: MDCTextFieldCharacterCounter | null; // assigned in initialize()
  private helperText_!: MDCTextFieldHelperText | null; // assigned in initialize()
  private label_!: MDCFloatingLabel | null; // assigned in initialize()
  private leadingIcon_!: MDCTextFieldIcon | null; // assigned in initialize()
  private lineRipple_!: MDCLineRipple | null; // assigned in initialize()
  private outline_!: MDCNotchedOutline | null; // assigned in initialize()
  private trailingIcon_!: MDCTextFieldIcon | null; // assigned in initialize()

  initialize(
      rippleFactory: MDCRippleFactory = (el, foundation) => new MDCRipple(el, foundation),
      lineRippleFactory: MDCLineRippleFactory = (el) => new MDCLineRipple(el),
      helperTextFactory: MDCTextFieldHelperTextFactory = (el) => new MDCTextFieldHelperText(el),
      characterCounterFactory: MDCTextFieldCharacterCounterFactory = (el) => new MDCTextFieldCharacterCounter(el),
      iconFactory: MDCTextFieldIconFactory = (el) => new MDCTextFieldIcon(el),
      labelFactory: MDCFloatingLabelFactory = (el) => new MDCFloatingLabel(el),
      outlineFactory: MDCNotchedOutlineFactory = (el) => new MDCNotchedOutline(el),
  ) {
    this.input_ = this.root_.querySelector<HTMLInputElement>(strings.INPUT_SELECTOR)!;

    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    this.label_ = labelElement ? labelFactory(labelElement) : null;

    const lineRippleElement = this.root_.querySelector(strings.LINE_RIPPLE_SELECTOR);
    this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;

    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;

    // Helper text
    const helperTextStrings = MDCTextFieldHelperTextFoundation.strings;
    const nextElementSibling = this.root_.nextElementSibling;
    const hasHelperLine = (nextElementSibling && nextElementSibling.classList.contains(cssClasses.HELPER_LINE));
    const helperTextEl =
        hasHelperLine && nextElementSibling && nextElementSibling.querySelector(helperTextStrings.ROOT_SELECTOR);
    this.helperText_ = helperTextEl ? helperTextFactory(helperTextEl) : null;

    // Character counter
    const characterCounterStrings = MDCTextFieldCharacterCounterFoundation.strings;
    let characterCounterEl = this.root_.querySelector(characterCounterStrings.ROOT_SELECTOR);
    // If character counter is not found in root element search in sibling element.
    if (!characterCounterEl && hasHelperLine && nextElementSibling) {
      characterCounterEl = nextElementSibling.querySelector(characterCounterStrings.ROOT_SELECTOR);
    }
    this.characterCounter_ = characterCounterEl ? characterCounterFactory(characterCounterEl) : null;

    this.leadingIcon_ = null;
    this.trailingIcon_ = null;
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

    this.ripple = this.createRipple_(rippleFactory);
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
   * Initializes the Text Field's internal state based on the environment's
   * state.
   */
  initialSyncWithDOM() {
    this.disabled = this.input_.disabled;
  }

  get value(): string {
    return this.foundation_.getValue();
  }

  /**
   * @param value The value to set on the input.
   */
  set value(value: string) {
    this.foundation_.setValue(value);
  }

  get disabled(): boolean {
    return this.foundation_.isDisabled();
  }

  /**
   * @param disabled Sets the Text Field disabled or enabled.
   */
  set disabled(disabled: boolean) {
    this.foundation_.setDisabled(disabled);
  }

  get valid(): boolean {
    return this.foundation_.isValid();
  }

  /**
   * @param valid Sets the Text Field valid or invalid.
   */
  set valid(valid: boolean) {
    this.foundation_.setValid(valid);
  }

  get required(): boolean {
    return this.input_.required;
  }

  /**
   * @param required Sets the Text Field to required.
   */
  set required(required: boolean) {
    this.input_.required = required;
  }

  get pattern(): string {
    return this.input_.pattern;
  }

  /**
   * @param pattern Sets the input element's validation pattern.
   */
  set pattern(pattern: string) {
    this.input_.pattern = pattern;
  }

  get minLength(): number {
    return this.input_.minLength;
  }

  /**
   * @param minLength Sets the input element's minLength.
   */
  set minLength(minLength: number) {
    this.input_.minLength = minLength;
  }

  get maxLength(): number {
    return this.input_.maxLength;
  }

  /**
   * @param maxLength Sets the input element's maxLength.
   */
  set maxLength(maxLength: number) {
    // Chrome throws exception if maxLength is set to a value less than zero
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
  set min(min: string) {
    this.input_.min = min;
  }

  get max(): string {
    return this.input_.max;
  }

  /**
   * @param max Sets the input element's max.
   */
  set max(max: string) {
    this.input_.max = max;
  }

  get step(): string {
    return this.input_.step;
  }

  /**
   * @param step Sets the input element's step.
   */
  set step(step: string) {
    this.input_.step = step;
  }

  /**
   * Sets the helper text element content.
   */
  set helperTextContent(content: string) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * Sets the aria label of the leading icon.
   */
  set leadingIconAriaLabel(label: string) {
    this.foundation_.setLeadingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the leading icon.
   */
  set leadingIconContent(content: string) {
    this.foundation_.setLeadingIconContent(content);
  }

  /**
   * Sets the aria label of the trailing icon.
   */
  set trailingIconAriaLabel(label: string) {
    this.foundation_.setTrailingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the trailing icon.
   */
  set trailingIconContent(content: string) {
    this.foundation_.setTrailingIconContent(content);
  }

  /**
   * Enables or disables the use of native validation. Use this for custom validation.
   * @param useNativeValidation Set this to false to ignore native input validation.
   */
  set useNativeValidation(useNativeValidation: boolean) {
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

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTextFieldAdapter = {
      ...this.getRootAdapterMethods_(),
      ...this.getInputAdapterMethods_(),
      ...this.getLabelAdapterMethods_(),
      ...this.getLineRippleAdapterMethods_(),
      ...this.getOutlineAdapterMethods_(),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTextFieldFoundation(adapter, this.getFoundationMap_());
  }

  private getRootAdapterMethods_(): MDCTextFieldRootAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      registerTextFieldInteractionHandler: (evtType, handler) => this.listen(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) => this.unlisten(evtType, handler),
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList = (mutationsList: MutationRecord[]): string[] => {
          return mutationsList
              .map((mutation) => mutation.attributeName)
              .filter((attributeName) => attributeName) as string[];
        };
        const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
        const config = {attributes: true};
        observer.observe(this.input_, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect(),
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getInputAdapterMethods_(): MDCTextFieldInputAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getNativeInput: () => this.input_,
      isFocused: () => document.activeElement === this.input_,
      registerInputInteractionHandler: (evtType, handler) =>
        this.input_.addEventListener(evtType, handler, applyPassive()),
      deregisterInputInteractionHandler: (evtType, handler) =>
        this.input_.removeEventListener(evtType, handler, applyPassive()),
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getLabelAdapterMethods_(): MDCTextFieldLabelAdapter {
    return {
      floatLabel: (shouldFloat) => this.label_ && this.label_.float(shouldFloat),
      getLabelWidth: () => this.label_ ? this.label_.getWidth() : 0,
      hasLabel: () => Boolean(this.label_),
      shakeLabel: (shouldShake) => this.label_ && this.label_.shake(shouldShake),
    };
  }

  private getLineRippleAdapterMethods_(): MDCTextFieldLineRippleAdapter {
    return {
      activateLineRipple: () => {
        if (this.lineRipple_) this.lineRipple_.activate();
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

  private getOutlineAdapterMethods_(): MDCTextFieldOutlineAdapter {
    return {
      closeOutline: () => this.outline_ && this.outline_.closeNotch(),
      hasOutline: () => Boolean(this.outline_),
      notchOutline: (labelWidth) => this.outline_ && this.outline_.notch(labelWidth),
    };
  }

  /**
   * @return A map of all subcomponents to subfoundations.
   */
  private getFoundationMap_(): Partial<MDCTextFieldFoundationMap> {
    return {
      characterCounter: this.characterCounter_ ? this.characterCounter_.foundation : undefined,
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
      trailingIcon: this.trailingIcon_ ? this.trailingIcon_.foundation : undefined,
    };
  }

  private createRipple_(rippleFactory: MDCRippleFactory): MDCRipple | null {
    const isTextArea = this.root_.classList.contains(cssClasses.TEXTAREA);
    const isOutlined = this.root_.classList.contains(cssClasses.OUTLINED);

    if (isTextArea || isOutlined) {
      return null;
    }

    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      isSurfaceActive: () => ponyfill.matches(this.input_, ':active'),
      registerInteractionHandler: (evtType, handler) => this.input_.addEventListener(evtType, handler, applyPassive()),
      deregisterInteractionHandler: (evtType, handler) =>
        this.input_.removeEventListener(evtType, handler, applyPassive()),
    };
    // tslint:enable:object-literal-sort-keys
    return rippleFactory(this.root_, new MDCRippleFoundation(adapter));
  }
}
