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
import MDCTextFieldLabelAdapter from './adapter';
import {cssClasses} from './constants';


/**
 * @extends {MDCFoundation<!MDCTextFieldLabelAdapter>}
 * @final
 */
class MDCTextFieldLabelFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCTextFieldLabelAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldLabelAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldLabelAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      getWidth: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldLabelAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldLabelAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldLabelFoundation.defaultAdapter, adapter));
  }

  /**
   * Returns the width of the label element.
   * @return {number}
   */
  getWidth() {
    return this.adapter_.getWidth();
  }

  /**
   * Styles the label to produce the label shake for errors.
   * @param {boolean} isValid Whether the input's value is valid (passes all
   *     validity checks).
   * @param {boolean} isFocused Whether the input is focused.
   */
  styleShake(isValid, isFocused) {
    const {LABEL_SHAKE} = MDCTextFieldLabelFoundation.cssClasses;
    if (isValid || isFocused) {
      this.adapter_.removeClass(LABEL_SHAKE);
    } else {
      this.adapter_.addClass(LABEL_SHAKE);
    }
  }

  /**
   * Styles the label to float or defloat as necessary.
   * @param {string} value The value of the input.
   * @param {boolean} isFocused Whether the input is focused.
   * @param {boolean} isBadInput The input's `validity.badInput` value.
   */
  styleFloat(value, isFocused, isBadInput) {
    const {LABEL_FLOAT_ABOVE} = MDCTextFieldLabelFoundation.cssClasses;
    if (!!value || isFocused) {
      this.adapter_.addClass(LABEL_FLOAT_ABOVE);
    } else if (!isBadInput) {
      this.adapter_.removeClass(LABEL_FLOAT_ABOVE);
    }
  }
}

export default MDCTextFieldLabelFoundation;
