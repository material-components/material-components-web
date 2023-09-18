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

import {MDCTextFieldAdapter, MDCTextFieldInputAdapter, MDCTextFieldLabelAdapter, MDCTextFieldLineRippleAdapter, MDCTextFieldOutlineAdapter, MDCTextFieldRootAdapter} from './adapter';
import {MDCTextFieldCharacterCounter, MDCTextFieldCharacterCounterFactory} from './character-counter/component';
import {MDCTextFieldCharacterCounterFoundation} from './character-counter/foundation';
import {cssClasses, strings} from './constants';
import {MDCTextFieldFoundation} from './foundation';
import {MDCTextFieldHelperText, MDCTextFieldHelperTextFactory} from './helper-text/component';
import {MDCTextFieldHelperTextFoundation} from './helper-text/foundation';
import {MDCTextFieldIcon, MDCTextFieldIconFactory} from './icon/component';
import {MDCTextFieldFoundationMap} from './types';

/** MDC Text Field */
export class MDCTextField extends
    MDCComponent<MDCTextFieldFoundation> implements MDCRippleCapableSurface {
  static override attachTo(root: HTMLElement): MDCTextField {
    return new MDCTextField(root);
  }

  ripple!: MDCRipple|null;  // assigned in initialize()

  // The only required sub-element.
  private input!: HTMLInputElement;  // assigned in initialize()

  // Optional sub-elements.
  private characterCounter!: MDCTextFieldCharacterCounter|
      null;                                          // assigned in initialize()
  private helperText!: MDCTextFieldHelperText|null;  // assigned in initialize()
  private label!: MDCFloatingLabel|null;             // assigned in initialize()
  private leadingIcon!: MDCTextFieldIcon|null;       // assigned in initialize()
  private lineRipple!: MDCLineRipple|null;           // assigned in initialize()
  private outline!: MDCNotchedOutline|null;          // assigned in initialize()
  private trailingIcon!: MDCTextFieldIcon|null;      // assigned in initialize()
  private prefix!: Element|null;                     // assigned in initialize()
  private suffix!: Element|null;                     // assigned in initialize()

  override initialize(
      rippleFactory:
          MDCRippleFactory = (el, foundation) => new MDCRipple(el, foundation),
      lineRippleFactory: MDCLineRippleFactory = (el) => new MDCLineRipple(el),
      helperTextFactory: MDCTextFieldHelperTextFactory = (el) =>
          new MDCTextFieldHelperText(el),
      characterCounterFactory: MDCTextFieldCharacterCounterFactory = (el) =>
          new MDCTextFieldCharacterCounter(el),
      iconFactory: MDCTextFieldIconFactory = (el) => new MDCTextFieldIcon(el),
      labelFactory: MDCFloatingLabelFactory = (el) => new MDCFloatingLabel(el),
      outlineFactory:
          MDCNotchedOutlineFactory = (el) => new MDCNotchedOutline(el),
  ) {
    this.input =
        this.root.querySelector<HTMLInputElement>(strings.INPUT_SELECTOR)!;

    const labelElement =
        this.root.querySelector<HTMLElement>(strings.LABEL_SELECTOR);
    this.label = labelElement ? labelFactory(labelElement) : null;

    const lineRippleElement =
        this.root.querySelector<HTMLElement>(strings.LINE_RIPPLE_SELECTOR);
    this.lineRipple =
        lineRippleElement ? lineRippleFactory(lineRippleElement) : null;

    const outlineElement =
        this.root.querySelector<HTMLElement>(strings.OUTLINE_SELECTOR);
    this.outline = outlineElement ? outlineFactory(outlineElement) : null;

    // Helper text
    const helperTextStrings = MDCTextFieldHelperTextFoundation.strings;
    const nextElementSibling = this.root.nextElementSibling;
    const hasHelperLine =
        (nextElementSibling &&
         nextElementSibling.classList.contains(cssClasses.HELPER_LINE));
    const helperTextEl = hasHelperLine && nextElementSibling &&
        nextElementSibling.querySelector<HTMLElement>(
            helperTextStrings.ROOT_SELECTOR);
    this.helperText = helperTextEl ? helperTextFactory(helperTextEl) : null;

    // Character counter
    const characterCounterStrings =
        MDCTextFieldCharacterCounterFoundation.strings;
    let characterCounterEl = this.root.querySelector<HTMLElement>(
        characterCounterStrings.ROOT_SELECTOR);
    // If character counter is not found in root element search in sibling
    // element.
    if (!characterCounterEl && hasHelperLine && nextElementSibling) {
      characterCounterEl = nextElementSibling.querySelector<HTMLElement>(
          characterCounterStrings.ROOT_SELECTOR);
    }
    this.characterCounter =
        characterCounterEl ? characterCounterFactory(characterCounterEl) : null;

    // Leading icon
    const leadingIconEl =
        this.root.querySelector<HTMLElement>(strings.LEADING_ICON_SELECTOR);
    this.leadingIcon = leadingIconEl ? iconFactory(leadingIconEl) : null;

    // Trailing icon
    const trailingIconEl =
        this.root.querySelector<HTMLElement>(strings.TRAILING_ICON_SELECTOR);
    this.trailingIcon = trailingIconEl ? iconFactory(trailingIconEl) : null;

    // Prefix and Suffix
    this.prefix = this.root.querySelector<HTMLElement>(strings.PREFIX_SELECTOR);
    this.suffix = this.root.querySelector<HTMLElement>(strings.SUFFIX_SELECTOR);

    this.ripple = this.createRipple(rippleFactory);
  }

  override destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.lineRipple) {
      this.lineRipple.destroy();
    }
    if (this.helperText) {
      this.helperText.destroy();
    }
    if (this.characterCounter) {
      this.characterCounter.destroy();
    }
    if (this.leadingIcon) {
      this.leadingIcon.destroy();
    }
    if (this.trailingIcon) {
      this.trailingIcon.destroy();
    }
    if (this.label) {
      this.label.destroy();
    }
    if (this.outline) {
      this.outline.destroy();
    }
    super.destroy();
  }

  /**
   * Initializes the Text Field's internal state based on the environment's
   * state.
   */
  override initialSyncWithDOM() {
    this.disabled = this.input.disabled;
  }

  get value(): string {
    return this.foundation.getValue();
  }

  /**
   * @param value The value to set on the input.
   */
  set value(value: string) {
    this.foundation.setValue(value);
  }

  get disabled(): boolean {
    return this.foundation.isDisabled();
  }

  /**
   * @param disabled Sets the Text Field disabled or enabled.
   */
  set disabled(disabled: boolean) {
    this.foundation.setDisabled(disabled);
  }

  get valid(): boolean {
    return this.foundation.isValid();
  }

  /**
   * @param valid Sets the Text Field valid or invalid.
   */
  set valid(valid: boolean) {
    this.foundation.setValid(valid);
  }

  get required(): boolean {
    return this.input.required;
  }

  /**
   * @param required Sets the Text Field to required.
   */
  set required(required: boolean) {
    this.input.required = required;
  }

  get pattern(): string {
    return this.input.pattern;
  }

  /**
   * @param pattern Sets the input element's validation pattern.
   */
  set pattern(pattern: string) {
    this.input.pattern = pattern;
  }

  get minLength(): number {
    return this.input.minLength;
  }

  /**
   * @param minLength Sets the input element's minLength.
   */
  set minLength(minLength: number) {
    this.input.minLength = minLength;
  }

  get maxLength(): number {
    return this.input.maxLength;
  }

  /**
   * @param maxLength Sets the input element's maxLength.
   */
  set maxLength(maxLength: number) {
    // Chrome throws exception if maxLength is set to a value less than zero
    if (maxLength < 0) {
      this.input.removeAttribute('maxLength');
    } else {
      this.input.maxLength = maxLength;
    }
  }

  get min(): string {
    return this.input.min;
  }

  /**
   * @param min Sets the input element's min.
   */
  set min(min: string) {
    this.input.min = min;
  }

  get max(): string {
    return this.input.max;
  }

  /**
   * @param max Sets the input element's max.
   */
  set max(max: string) {
    this.input.max = max;
  }

  get step(): string {
    return this.input.step;
  }

  /**
   * @param step Sets the input element's step.
   */
  set step(step: string) {
    this.input.step = step;
  }

  /**
   * Sets the helper text element content.
   */
  set helperTextContent(content: string) {
    this.foundation.setHelperTextContent(content);
  }

  /**
   * Sets the aria label of the leading icon.
   */
  set leadingIconAriaLabel(label: string) {
    this.foundation.setLeadingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the leading icon.
   */
  set leadingIconContent(content: string) {
    this.foundation.setLeadingIconContent(content);
  }

  /**
   * Sets the aria label of the trailing icon.
   */
  set trailingIconAriaLabel(label: string) {
    this.foundation.setTrailingIconAriaLabel(label);
  }

  /**
   * Sets the text content of the trailing icon.
   */
  set trailingIconContent(content: string) {
    this.foundation.setTrailingIconContent(content);
  }

  /**
   * Enables or disables the use of native validation. Use this for custom
   * validation.
   * @param useNativeValidation Set this to false to ignore native input
   *     validation.
   */
  set useNativeValidation(useNativeValidation: boolean) {
    this.foundation.setUseNativeValidation(useNativeValidation);
  }

  /**
   * Gets the text content of the prefix, or null if it does not exist.
   */
  get prefixText(): string|null {
    return this.prefix ? this.prefix.textContent : null;
  }

  /**
   * Sets the text content of the prefix, if it exists.
   */
  set prefixText(prefixText: string|null) {
    if (this.prefix) {
      this.prefix.textContent = prefixText;
    }
  }

  /**
   * Gets the text content of the suffix, or null if it does not exist.
   */
  get suffixText(): string|null {
    return this.suffix ? this.suffix.textContent : null;
  }

  /**
   * Sets the text content of the suffix, if it exists.
   */
  set suffixText(suffixText: string|null) {
    if (this.suffix) {
      this.suffix.textContent = suffixText;
    }
  }

  /**
   * Focuses the input element.
   */
  focus() {
    this.input.focus();
  }

  /**
   * Recomputes the outline SVG path for the outline element.
   */
  layout() {
    const openNotch = this.foundation.shouldFloat;
    this.foundation.notchOutline(openNotch);
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTextFieldAdapter = {
      ...this.getRootAdapterMethods(),
      ...this.getInputAdapterMethods(),
      ...this.getLabelAdapterMethods(),
      ...this.getLineRippleAdapterMethods(),
      ...this.getOutlineAdapterMethods(),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTextFieldFoundation(adapter, this.getFoundationMap());
  }

  private getRootAdapterMethods(): MDCTextFieldRootAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      registerTextFieldInteractionHandler: (eventType, handler) => {
        this.listen(eventType, handler);
      },
      deregisterTextFieldInteractionHandler: (eventType, handler) => {
        this.unlisten(eventType, handler);
      },
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList =
            (mutationsList: MutationRecord[]): string[] => {
              return mutationsList.map((mutation) => mutation.attributeName)
                         .filter((attributeName) => attributeName) as string[];
            };
        const observer = new MutationObserver((mutationsList) => {
          handler(getAttributesList(mutationsList));
        });
        const config = {attributes: true};
        observer.observe(this.input, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler: (observer) => {
        observer.disconnect();
      },
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getInputAdapterMethods(): MDCTextFieldInputAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      getNativeInput: () => this.input,
      setInputAttr: (attr, value) => {
        this.safeSetAttribute(this.input, attr, value);
      },
      removeInputAttr: (attr) => {
        this.input.removeAttribute(attr);
      },
      isFocused: () => document.activeElement === this.input,
      registerInputInteractionHandler: (eventType, handler) => {
        this.input.addEventListener(eventType, handler, applyPassive());
      },
      deregisterInputInteractionHandler: (eventType, handler) => {
        this.input.removeEventListener(eventType, handler, applyPassive());
      },
    };
    // tslint:enable:object-literal-sort-keys
  }

  private getLabelAdapterMethods(): MDCTextFieldLabelAdapter {
    return {
      floatLabel: (shouldFloat) => {
        this.label && this.label.float(shouldFloat);
      },
      getLabelWidth: () => this.label ? this.label.getWidth() : 0,
      hasLabel: () => Boolean(this.label),
      shakeLabel: (shouldShake) => {
        this.label && this.label.shake(shouldShake);
      },
      setLabelRequired: (isRequired) => {
        this.label && this.label.setRequired(isRequired);
      },
    };
  }

  private getLineRippleAdapterMethods(): MDCTextFieldLineRippleAdapter {
    return {
      activateLineRipple: () => {
        if (this.lineRipple) {
          this.lineRipple.activate();
        }
      },
      deactivateLineRipple: () => {
        if (this.lineRipple) {
          this.lineRipple.deactivate();
        }
      },
      setLineRippleTransformOrigin: (normalizedX) => {
        if (this.lineRipple) {
          this.lineRipple.setRippleCenter(normalizedX);
        }
      },
    };
  }

  private getOutlineAdapterMethods(): MDCTextFieldOutlineAdapter {
    return {
      closeOutline: () => {
        this.outline && this.outline.closeNotch();
      },
      hasOutline: () => Boolean(this.outline),
      notchOutline: (labelWidth) => {
        this.outline && this.outline.notch(labelWidth);
      },
    };
  }

  /**
   * @return A map of all subcomponents to subfoundations.
   */
  private getFoundationMap(): Partial<MDCTextFieldFoundationMap> {
    return {
      characterCounter: this.characterCounter ?
          this.characterCounter.foundationForTextField :
          undefined,
      helperText: this.helperText ? this.helperText.foundationForTextField :
                                    undefined,
      leadingIcon: this.leadingIcon ? this.leadingIcon.foundationForTextField :
                                      undefined,
      trailingIcon: this.trailingIcon ?
          this.trailingIcon.foundationForTextField :
          undefined,
    };
  }

  private createRipple(rippleFactory: MDCRippleFactory): MDCRipple|null {
    const isTextArea = this.root.classList.contains(cssClasses.TEXTAREA);
    const isOutlined = this.root.classList.contains(cssClasses.OUTLINED);

    if (isTextArea || isOutlined) {
      return null;
    }

    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCRippleAdapter = {
      ...MDCRipple.createAdapter(this),
      isSurfaceActive: () => ponyfill.matches(this.input, ':active'),
      registerInteractionHandler: (eventType, handler) => {
        this.input.addEventListener(eventType, handler, applyPassive());
      },
      deregisterInteractionHandler: (eventType, handler) => {
        this.input.removeEventListener(eventType, handler, applyPassive());
      },
    };
    // tslint:enable:object-literal-sort-keys
    return rippleFactory(this.root, new MDCRippleFoundation(adapter));
  }
}
