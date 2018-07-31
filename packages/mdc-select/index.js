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

import {MDCComponent} from '@material/base/index';
import {MDCFloatingLabel} from '@material/floating-label/index';
import {MDCLineRipple} from '@material/line-ripple/index';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {MDCNotchedOutline} from '@material/notched-outline/index';

import MDCSelectFoundation from './foundation';
import MDCSelectAdapter from './adapter';
import {cssClasses, strings} from './constants';

/**
 * @extends MDCComponent<!MDCSelectFoundation>
 */
class MDCSelect extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.nativeControl_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCLineRipple} */
    this.lineRipple_;
    /** @private {?MDCFloatingLabel} */
    this.label_;
    /** @private {?MDCNotchedOutline} */
    this.outline_;
    /** @private {!Function} */
    this.handleChange_;
    /** @private {!Function} */
    this.handleFocus_;
    /** @private {!Function} */
    this.handleBlur_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCSelect}
   */
  static attachTo(root) {
    return new MDCSelect(root);
  }

  /**
   * @return {string} The value of the select.
   */
  get value() {
    return this.nativeControl_.value;
  }

  /**
   * @param {string} value The value to set on the select.
   */
  set value(value) {
    this.nativeControl_.value = value;
    this.foundation_.handleChange();
  }

  /**
   * @return {number} The selected index of the select.
   */
  get selectedIndex() {
    return this.nativeControl_.selectedIndex;
  }

  /**
   * @param {number} selectedIndex The index of the option to be set on the select.
   */
  set selectedIndex(selectedIndex) {
    this.nativeControl_.selectedIndex = selectedIndex;
    this.foundation_.handleChange();
  }

  /**
   * @return {boolean} True if the select is disabled.
   */
  get disabled() {
    return this.nativeControl_.disabled;
  }

  /**
   * @param {boolean} disabled Sets the select disabled or enabled.
   */
  set disabled(disabled) {
    this.nativeControl_.disabled = disabled;
    this.foundation_.updateDisabledStyle(disabled);
  }

  /**
   * Recomputes the outline SVG path for the outline element.
   */
  layout() {
    const openNotch = this.nativeControl_.value.length > 0;
    this.foundation_.notchOutline(openNotch);
  }


  /**
   * @param {(function(!Element): !MDCLineRipple)=} lineRippleFactory A function which creates a new MDCLineRipple.
   * @param {(function(!Element): !MDCFloatingLabel)=} labelFactory A function which creates a new MDCFloatingLabel.
   * @param {(function(!Element): !MDCNotchedOutline)=} outlineFactory A function which creates a new MDCNotchedOutline.
   */
  initialize(
    labelFactory = (el) => new MDCFloatingLabel(el),
    lineRippleFactory = (el) => new MDCLineRipple(el),
    outlineFactory = (el) => new MDCNotchedOutline(el)) {
    this.nativeControl_ = this.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR);
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

    if (this.root_.classList.contains(cssClasses.BOX)) {
      this.ripple = this.initRipple_();
    }
  }

  /**
   * @private
   * @return {!MDCRipple}
   */
  initRipple_() {
    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      registerInteractionHandler: (type, handler) => this.nativeControl_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.nativeControl_.removeEventListener(type, handler),
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(this.root_, foundation);
  }

  /**
   * Initializes the select's event listeners and internal state based
   * on the environment's state.
   */
  initialSyncWithDOM() {
    this.handleChange_ = () => this.foundation_.handleChange();
    this.handleFocus_ = () => this.foundation_.handleFocus();
    this.handleBlur_ = () => this.foundation_.handleBlur();

    this.nativeControl_.addEventListener('change', this.handleChange_);
    this.nativeControl_.addEventListener('focus', this.handleFocus_);
    this.nativeControl_.addEventListener('blur', this.handleBlur_);

    // Initially sync floating label
    this.foundation_.handleChange();

    if (this.nativeControl_.disabled) {
      this.disabled = true;
    }
  }

  destroy() {
    this.nativeControl_.removeEventListener('change', this.handleChange_);
    this.nativeControl_.removeEventListener('focus', this.handleFocus_);
    this.nativeControl_.removeEventListener('blur', this.handleBlur_);

    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.outline_) {
      this.outline_.destroy();
    }

    super.destroy();
  }

  /**
   * @return {!MDCSelectFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectFoundation(
      /** @type {!MDCSelectAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        getValue: () => this.nativeControl_.value,
        isRtl: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        activateBottomLine: () => {
          if (this.lineRipple_) {
            this.lineRipple_.activate();
          }
        },
        deactivateBottomLine: () => {
          if (this.lineRipple_) {
            this.lineRipple_.deactivate();
          }
        },
      },
      this.getOutlineAdapterMethods_(),
      this.getLabelAdapterMethods_())
      )
    );
  }

  /**
   * @return {!{
   *   hasOutline: function(): boolean,
   *   notchOutline: function(number, boolean): undefined,
   *   closeOutline: function(): undefined,
   * }}
   */
  getOutlineAdapterMethods_() {
    return {
      hasOutline: () => !!this.outline_,
      notchOutline: (labelWidth, isRtl) => {
        if (this.outline_) {
          this.outline_.notch(labelWidth, isRtl);
        }
      },
      closeOutline: () => {
        if (this.outline_) {
          this.outline_.closeNotch();
        }
      },
    };
  }

  /**
   * @return {!{
   *   hasLabel: function(): boolean,
   *   floatLabel: function(boolean): undefined,
   *   getLabelWidth: function(): number,
   * }}
   */
  getLabelAdapterMethods_() {
    return {
      hasLabel: () => !!this.label_,
      floatLabel: (shouldFloat) => {
        if (this.label_) {
          this.label_.float(shouldFloat);
        }
      },
      getLabelWidth: () => {
        if (this.label_) {
          return this.label_.getWidth();
        }
      },
    };
  }
}

export {MDCSelect, MDCSelectFoundation};
