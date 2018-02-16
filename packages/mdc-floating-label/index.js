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

import MDCFloatingLabelAdapter from './adapter';
import MDCFloatingLabelFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCFloatingLabelFoundation>}
 * @final
 */
class MDCFloatingLabel extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCFloatingLabel}
   */
  static attachTo(root) {
    return new MDCFloatingLabel(root);
  }

  /**
   * Styles the label to produce the label shake for errors.
   * @param {boolean} isValid Whether the input's value is valid (passes all
   *     validity checks).
   * @param {boolean} isFocused Whether the input is focused.
   */
  shake(isValid, isFocused) {
    this.foundation_.styleShake(isValid, isFocused);
  }

  /**
   * Styles label to float if isFocused, or if value is present.
   * Otherwise it will style to defloat unless isBadInput is true.
   * @param {string} value The value of the input.
   * @param {boolean} isFocused Whether the input is focused.
   * @param {boolean} isBadInput The input's `validity.badInput` value.
   */
  float(value, isFocused, isBadInput) {
    this.foundation_.styleFloat(value, isFocused, isBadInput);
  }

  /**
   * @return {number}
   */
  getWidth() {
    return this.foundation_.getWidth();
  }

  /**
   * @return {!MDCFloatingLabelFoundation}
   */
  getDefaultFoundation() {
    return new MDCFloatingLabelFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      getWidth: () => this.root_.offsetWidth,
    });
  }
}

export {MDCFloatingLabel, MDCFloatingLabelFoundation};
