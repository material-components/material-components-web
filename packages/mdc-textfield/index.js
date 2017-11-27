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
import {MDCRipple} from '@material/ripple';

import {cssClasses, strings} from './constants';
import {MDCTextFieldAdapter} from './adapter';
import MDCTextFieldFoundation from './foundation';
import {MDCTextFieldBottomLine} from './bottom-line';
import {MDCTextFieldHelperText} from './helper-text';
import {MDCTextFieldInput} from './input';


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
    /** @private {?MDCTextFieldInput} */
    this.input_;
    /** @private {?Element} */
    this.label_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCTextFieldBottomLine} */
    this.bottomLine_;
    /** @private {?MDCTextFieldHelperText} */
    this.helperText_;
    /** @private {?Element} */
    this.icon_;
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
   * @param {(function(!Element): !MDCTextFieldBottomLine)=} bottomLineFactory A function which
   * creates a new MDCTextFieldBottomLine.
   * @param {(function(!Element): !MDCTextFieldInput)=} inputFactory A function which
   * creates a new MDCTextFieldInput.
   */
  initialize(
    rippleFactory = (el) => new MDCRipple(el),
    bottomLineFactory = (el) => new MDCTextFieldBottomLine(el),
    inputFactory = (el) => new MDCTextFieldInput(el)) {
    const inputElement = this.root_.querySelector(strings.INPUT_SELECTOR);
    if (inputElement) {
      this.input_ = inputFactory(inputElement);
    }
    this.label_ = this.root_.querySelector(strings.LABEL_SELECTOR);
    this.ripple = null;
    if (this.root_.classList.contains(cssClasses.BOX)) {
      this.ripple = rippleFactory(this.root_);
    };
    if (!this.root_.classList.contains(cssClasses.TEXTAREA)) {
      const bottomLineElement = this.root_.querySelector(strings.BOTTOM_LINE_SELECTOR);
      if (bottomLineElement) {
        this.bottomLine_ = bottomLineFactory(bottomLineElement);
      }
    };
    if (inputElement.hasAttribute(strings.ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(inputElement.getAttribute(strings.ARIA_CONTROLS));
      if (helperTextElement) {
        this.helperText_ = new MDCTextFieldHelperText(helperTextElement);
      }
    }
    if (!this.root_.classList.contains(cssClasses.TEXT_FIELD_ICON)) {
      this.icon_ = this.root_.querySelector(strings.ICON_SELECTOR);
    };
  }

  destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.bottomLine_) {
      this.bottomLine_.destroy();
    }
    if (this.helperText_) {
      this.helperText_.destroy();
    }
    if (this.input_) {
      this.input_.destroy();
    }
    super.destroy();
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
   * @param {boolean} valid Sets the Text Field valid or invalid.
   */
  set valid(valid) {
    this.foundation_.setValid(valid);
  }

  /**
   * Sets the helper text element content.
   * @param {string} content
   */
  set helperTextContent(content) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * @return {!MDCTextFieldFoundation}
   */
  getDefaultFoundation() {
    return new MDCTextFieldFoundation(/** @type {!MDCTextFieldAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addClassToLabel: (className) => {
        const label = this.label_;
        if (label) {
          label.classList.add(className);
        }
      },
      removeClassFromLabel: (className) => {
        const label = this.label_;
        if (label) {
          label.classList.remove(className);
        }
      },
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      registerTextFieldInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      notifyIconAction: () => this.emit(MDCTextFieldFoundation.strings.ICON_EVENT, {}),
      registerInputEventHandler: (evtType, handler) => {
        if (this.input_) {
          this.input_.listen(evtType, handler);
        }
      },
      deregisterInputEventHandler: (evtType, handler) => {
        if (this.input_) {
          this.input_.unlisten(evtType, handler);
        }
      },
      registerBottomLineEventHandler: (evtType, handler) => {
        if (this.bottomLine_) {
          this.bottomLine_.listen(evtType, handler);
        }
      },
      deregisterBottomLineEventHandler: (evtType, handler) => {
        if (this.bottomLine_) {
          this.bottomLine_.unlisten(evtType, handler);
        }
      },
      getBottomLineFoundation: () => {
        if (this.bottomLine_) {
          return this.bottomLine_.foundation;
        }
        return undefined;
      },
      getHelperTextFoundation: () => {
        if (this.helperText_) {
          return this.helperText_.foundation;
        }
        return undefined;
      },
      getInputFoundation: () => {
        if (this.input_) {
          return this.input_.foundation;
        }
        return undefined;
      },
    },
    this.getIconAdapterMethods_())));
  }

  /**
   * @return {!{
   *   setIconAttr: function(string, string): undefined,
   * }}
   */
  getIconAdapterMethods_() {
    return {
      setIconAttr: (name, value) => {
        if (this.icon_) {
          this.icon_.setAttribute(name, value);
        }
      },
    };
  }
}

export {MDCTextField, MDCTextFieldFoundation};
