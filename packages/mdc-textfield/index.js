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

import {MDCComponent} from '@material/base';
import {MDCRipple} from '@material/ripple';

import {cssClasses, strings} from './constants';
import MDCTextfieldFoundation from './foundation';

export {MDCTextfieldFoundation};

export class MDCTextfield extends MDCComponent {
  static attachTo(root) {
    return new MDCTextfield(root);
  }

  initialize(rippleFactory = (el) => new MDCRipple(el)) {
    this.input_ = this.root_.querySelector(strings.INPUT_SELECTOR);
    this.label_ = this.root_.querySelector(strings.LABEL_SELECTOR);
    this.leadingIconElement = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    this.trailingIconElement = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);
    this.helptextElement = null;
    this.ripple = null;
    if (this.input_.hasAttribute('aria-controls')) {
      this.helptextElement = document.getElementById(this.input_.getAttribute('aria-controls'));
    }
    if (this.root_.classList.contains(cssClasses.BOX)) {
      this.ripple = rippleFactory(this.root_);
    };
  }

  destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
    super.destroy();
  }

  initialSyncWithDom() {
    this.disabled = this.input_.disabled;
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  getDefaultFoundation() {
    return new MDCTextfieldFoundation(Object.assign({
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
      registerTextFieldInteractionHandler: (handler) => this.root_.addEventListener('click', handler),
      deregisterTextFieldInteractionHandler: (handler) => this.root_.addEventListener('click', handler),
      notifyLeadingIconAction: () => this.emit(MDCTextfieldFoundation.strings.LEADING_ICON_EVENT),
      notifyTrailingIconAction: () => this.emit(MDCTextfieldFoundation.strings.TRAILING_ICON_EVENT),
    }, this.getInputAdapterMethods_(), this.getHelptextAdapterMethods_()));
  }

  getInputAdapterMethods_() {
    return {
      registerInputFocusHandler: (handler) => this.input_.addEventListener('focus', handler),
      registerInputBlurHandler: (handler) => this.input_.addEventListener('blur', handler),
      registerInputInputHandler: (handler) => this.input_.addEventListener('input', handler),
      registerInputKeydownHandler: (handler) => this.input_.addEventListener('keydown', handler),
      deregisterInputFocusHandler: (handler) => this.input_.removeEventListener('focus', handler),
      deregisterInputBlurHandler: (handler) => this.input_.removeEventListener('blur', handler),
      deregisterInputInputHandler: (handler) => this.input_.removeEventListener('input', handler),
      deregisterInputKeydownHandler: (handler) => this.input_.removeEventListener('keydown', handler),
      getNativeInput: () => this.input_,
    };
  }

  getHelptextAdapterMethods_() {
    return {
      addClassToHelptext: (className) => {
        if (this.helptextElement) {
          this.helptextElement.classList.add(className);
        }
      },
      removeClassFromHelptext: (className) => {
        if (this.helptextElement) {
          this.helptextElement.classList.remove(className);
        }
      },
      helptextHasClass: (className) => {
        if (!this.helptextElement) {
          return false;
        }
        return this.helptextElement.classList.contains(className);
      },
      setHelptextAttr: (name, value) => {
        if (this.helptextElement) {
          this.helptextElement.setAttribute(name, value);
        }
      },
      removeHelptextAttr: (name) => {
        if (this.helptextElement) {
          this.helptextElement.removeAttribute(name);
        }
      },
    };
  }
}
