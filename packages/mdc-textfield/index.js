/**
 * @license
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

import MDCComponent from '@material/base/component';
/* eslint-disable no-unused-vars */
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
/* eslint-enable no-unused-vars */
import {getMatchesProperty} from '@material/ripple/util';


import {cssClasses, strings} from './constants';
import {MDCTextFieldAdapter, FoundationMapType} from './adapter';
import MDCTextFieldFoundation from './foundation';
/* eslint-disable no-unused-vars */
import {MDCLineRipple, MDCLineRippleFoundation} from '@material/line-ripple/index';
import {MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation} from './helper-text/index';
import {MDCTextFieldIcon, MDCTextFieldIconFoundation} from './icon/index';
import {MDCFloatingLabel, MDCFloatingLabelFoundation} from '@material/floating-label/index';
import {MDCNotchedOutline, MDCNotchedOutlineFoundation} from '@material/notched-outline/index';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCComponent<!MDCTextFieldFoundation>}
 * @final
 */
class MDCTextField extends MDCComponent {
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
    /** @private {?MDCTextFieldIcon} */
    this.icon_;
    /** @private {?MDCFloatingLabel} */
    this.label_;
    /** @private {?MDCNotchedOutline} */
    this.outline_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTextField}
   */
  static attachTo(root) {
    return new MDCTextField(root);
  }

  /**
   * @param {(function(!Element): !MDCRipple)=} rippleFactory A function which
   * creates a new MDCRipple.
   * @param {(function(!Element): !MDCLineRipple)=} lineRippleFactory A function which
   * creates a new MDCLineRipple.
   * @param {(function(!Element): !MDCTextFieldHelperText)=} helperTextFactory A function which
   * creates a new MDCTextFieldHelperText.
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
    iconFactory = (el) => new MDCTextFieldIcon(el),
    labelFactory = (el) => new MDCFloatingLabel(el),
    outlineFactory = (el) => new MDCNotchedOutline(el)) {
    this.input_ = this.root_.querySelector(strings.INPUT_SELECTOR);
    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    const lineRippleElement = this.root_.querySelector(strings.BOTTOM_LINE_SELECTOR);
    if (lineRippleElement) {
      this.lineRipple_ = lineRippleFactory(lineRippleElement);
    }
    const outlineElement = this.root_.querySelector(strings.OUTLINE_SELECTOR);
    if (outlineElement) {
      this.outline_ = outlineFactory(outlineElement);
    }
    if (this.input_.hasAttribute(strings.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(this.input_.getAttribute(strings.ARIA_CONTROLS));
      if (helperTextElement) {
        this.helperText_ = helperTextFactory(helperTextElement);
      }
    }
    const iconElement = this.root_.querySelector(strings.ICON_SELECTOR);
    if (iconElement) {
      this.icon_ = iconFactory(iconElement);
    }

    this.ripple = null;
    if (this.root_.classList.contains(cssClasses.BOX) || this.root_.classList.contains(cssClasses.OUTLINED)) {
      // For outlined text fields, the ripple is instantiated on the outline element instead of the root element
      // to clip the ripple at the outline while still allowing the label to be visible beyond the outline.
      const rippleCapableSurface = outlineElement ? this.outline_ : this;
      const rippleRoot = outlineElement ? outlineElement : this.root_;
      const MATCHES = getMatchesProperty(HTMLElement.prototype);
      const adapter =
        Object.assign(MDCRipple.createAdapter(/** @type {!RippleCapableSurface} */ (rippleCapableSurface)), {
          isSurfaceActive: () => this.input_[MATCHES](':active'),
          registerInteractionHandler: (type, handler) => this.input_.addEventListener(type, handler),
          deregisterInteractionHandler: (type, handler) => this.input_.removeEventListener(type, handler),
        });
      const foundation = new MDCRippleFoundation(adapter);
      this.ripple = rippleFactory(rippleRoot, foundation);
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
    if (this.icon_) {
      this.icon_.destroy();
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

  /**
   * @return {string} The value of the input.
   */
  get value() {
    return this.foundation_.getValue();
  }

  /**
   * @param {string} value The value to set on the input.
   */
  set value(value) {
    this.foundation_.setValue(value);
  }

  /**
   * @return {boolean} True if the Text Field is disabled.
   */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /**
   * @param {boolean} disabled Sets the Text Field disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /**
   * @return {boolean} valid True if the Text Field is valid.
   */
  get valid() {
    return this.foundation_.isValid();
  }

  /**
   * @param {boolean} valid Sets the Text Field valid or invalid.
   */
  set valid(valid) {
    this.foundation_.setValid(valid);
  }

  /**
   * @return {boolean} True if the Text Field is required.
   */
  get required() {
    return this.input_.required;
  }

  /**
   * @param {boolean} required Sets the Text Field to required.
   */
  set required(required) {
    this.input_.required = required;
  }

  /**
   * @return {string} The input element's validation pattern.
   */
  get pattern() {
    return this.input_.pattern;
  }

  /**
   * @param {string} pattern Sets the input element's validation pattern.
   */
  set pattern(pattern) {
    this.input_.pattern = pattern;
  }

  /**
   * @return {number} The input element's minLength.
   */
  get minLength() {
    return this.input_.minLength;
  }

  /**
   * @param {number} minLength Sets the input element's minLength.
   */
  set minLength(minLength) {
    this.input_.minLength = minLength;
  }

  /**
   * @return {number} The input element's maxLength.
   */
  get maxLength() {
    return this.input_.maxLength;
  }

  /**
   * @param {number} maxLength Sets the input element's maxLength.
   */
  set maxLength(maxLength) {
    // Chrome throws exception if maxLength is set < 0
    if (maxLength < 0) {
      this.input_.removeAttribute('maxLength');
    } else {
      this.input_.maxLength = maxLength;
    }
  }

  /**
   * @return {string} The input element's min.
   */
  get min() {
    return this.input_.min;
  }

  /**
   * @param {string} min Sets the input element's min.
   */
  set min(min) {
    this.input_.min = min;
  }

  /**
   * @return {string} The input element's max.
   */
  get max() {
    return this.input_.max;
  }

  /**
   * @param {string} max Sets the input element's max.
   */
  set max(max) {
    this.input_.max = max;
  }

  /**
   * @return {string} The input element's step.
   */
  get step() {
    return this.input_.step;
  }

  /**
   * @param {string} step Sets the input element's step.
   */
  set step(step) {
    this.input_.step = step;
  }

  /**
   * Sets the helper text element content.
   * @param {string} content
   */
  set helperTextContent(content) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * Recomputes the outline SVG path for the outline element, and recomputes
   * all dimensions and positions for the ripple element.
   */
  layout() {
    this.foundation_.updateOutline();
    if (this.ripple) {
      this.ripple.layout();
    }
  }

  /**
   * @return {!MDCTextFieldFoundation}
   */
  getDefaultFoundation() {
    return new MDCTextFieldFoundation(
      /** @type {!MDCTextFieldAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        registerTextFieldInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
        deregisterTextFieldInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
        registerValidationAttributeChangeHandler: (handler) => {
          const observer = new MutationObserver(handler);
          const targetNode = this.root_.querySelector(strings.INPUT_SELECTOR);
          const config = {attributes: true};
          observer.observe(targetNode, config);
          return observer;
        },
        deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect(),
        isFocused: () => {
          return document.activeElement === this.root_.querySelector(strings.INPUT_SELECTOR);
        },
        isRtl: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      },
      this.getInputAdapterMethods_(),
      this.getLabelAdapterMethods_(),
      this.getLineRippleAdapterMethods_(),
      this.getOutlineAdapterMethods_())),
      this.getFoundationMap_());
  }

  /**
   * @return {!{
   *   shakeLabel: function(boolean): undefined,
   *   floatLabel: function(boolean): undefined,
   *   hasLabel: function(): boolean,
   *   getLabelWidth: function(): number,
   * }}
   */
  getLabelAdapterMethods_() {
    return {
      shakeLabel: (shouldShake) => this.label_.shake(shouldShake),
      floatLabel: (shouldFloat) => this.label_.float(shouldFloat),
      hasLabel: () => !!this.label_,
      getLabelWidth: () => this.label_.getWidth(),
    };
  }

  /**
   * @return {!{
   *   activateLineRipple: function(): undefined,
   *   deactivateLineRipple: function(): undefined,
   *   setLineRippleTransformOrigin: function(!number): undefined,
   * }}
   */
  getLineRippleAdapterMethods_() {
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
   * @return {!{
   *   hasOutline: function(): boolean,
   *   updateOutlinePath: function(number, boolean): undefined,
   * }}
   */
  getOutlineAdapterMethods_() {
    return {
      hasOutline: () => !!this.outline_,
      updateOutlinePath: (labelWidth, isRtl) => this.outline_.updateSvgPath(labelWidth, isRtl),
    };
  }

  /**
   * @return {!{
   *   registerInputInteractionHandler: function(string, function()): undefined,
   *   deregisterInputInteractionHandler: function(string, function()): undefined,
   *   getNativeInput: function(): ?Element,
   * }}
   */
  getInputAdapterMethods_() {
    return {
      registerInputInteractionHandler: (evtType, handler) => this.input_.addEventListener(evtType, handler),
      deregisterInputInteractionHandler: (evtType, handler) => this.input_.removeEventListener(evtType, handler),
      getNativeInput: () => this.input_,
    };
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   * @return {!FoundationMapType}
   */
  getFoundationMap_() {
    return {
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
      icon: this.icon_ ? this.icon_.foundation : undefined,
    };
  }
}

export {MDCTextField, MDCTextFieldFoundation,
  MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation,
  MDCTextFieldIcon, MDCTextFieldIconFoundation};
