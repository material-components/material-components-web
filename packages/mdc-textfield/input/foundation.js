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

import MDCFoundation from '@material/base/foundation';
import {MDCTextFieldInputAdapter, NativeInputType} from './adapter';
import {strings} from './constants';


/**
 * @extends {MDCFoundation<!MDCTextFieldInputAdapter>}
 * @final
 */
class MDCTextFieldInputFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCTextFieldInputAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldInputAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldInputAdapter} */ ({
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      getNativeInput: () => {},
      notifyFocusAction: () => {},
      notifyBlurAction: () => {},
      notifyPressedAction: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldInputAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldInputAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldInputFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.receivedUserInput_ = false;
    /** @private {function(): undefined} */
    this.inputFocusHandler_ = () => this.activateFocus_();
    /** @private {function(): undefined} */
    this.inputBlurHandler_ = () => this.deactivateFocus_();
    /** @private {function(): undefined} */
    this.inputInputHandler_ = () => this.autoCompleteFocus_();
    /** @private {function(): undefined} */
    this.inputPressedHandler_ = () => this.notifyPressedAction_();
  }

  init() {
    this.adapter_.registerEventHandler('focus', this.inputFocusHandler_);
    this.adapter_.registerEventHandler('blur', this.inputBlurHandler_);
    this.adapter_.registerEventHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.registerEventHandler(evtType, this.inputPressedHandler_);
    });
  }

  destroy() {
    this.adapter_.deregisterEventHandler('focus', this.inputFocusHandler_);
    this.adapter_.deregisterEventHandler('blur', this.inputBlurHandler_);
    this.adapter_.deregisterEventHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.deregisterEventHandler(evtType, this.inputPressedHandler_);
    });
  }

  /**
   * Activates the input's focus state.
   * @private
   */
  activateFocus_() {
    this.adapter_.notifyFocusAction();
  }

  /**
   * Activates the input's focus state in cases when the input value
   * changes without user input (e.g. programatically).
   * @private
   */
  autoCompleteFocus_() {
    if (!this.receivedUserInput_) {
      this.activateFocus_();
    }
  }

  /**
   * Deactives the input's focus state.
   * @private
   */
  deactivateFocus_() {
    const input = this.getNativeInput_();

    if (!input.value && !this.isBadInput()) {
      this.receivedUserInput_ = false;
    }

    this.adapter_.notifyBlurAction();
  }

  notifyPressedAction_() {
    this.adapter_.notifyPressedAction();
  }

  /**
   * @return {boolean} True if the input fails validity checks.
   */
  isBadInput() {
    const input = this.getNativeInput_();
    return input.validity ? input.validity.badInput : input.badInput;
  }

  /**
   * @return {string} Returns the value in the input.
   */
  getValue() {
    return this.getNativeInput_().value;
  }

  /**
   * @return {boolean} Returns the result of the checkValidity() call in the native input.
   */
  checkValidity() {
    return this.getNativeInput_().checkValidity();
  }

  /**
   * @return {boolean} True if the input is disabled.
   */
  isDisabled() {
    return this.getNativeInput_().disabled;
  }

  /**
   * @param {boolean} disabled Sets the input disabled or enabled.
   */
  setDisabled(disabled) {
    this.getNativeInput_().disabled = disabled;
  }

  /**
   * @param {boolean} receivedUserInput Sets whether user input was received.
   */
  setReceivedUserInput(receivedUserInput) {
    this.receivedUserInput_ = receivedUserInput;
  }

  /**
   * @return {!Element|!NativeInputType} The native text input from the
   * host environment, or a dummy if none exists.
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() ||
    /** @type {!NativeInputType} */ ({
      checkValidity: () => true,
      value: '',
      disabled: false,
      badInput: false,
    });
  }
}

export default MDCTextFieldInputFoundation;
