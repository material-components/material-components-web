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
    });
  }

  /**
   * @param {!MDCTextFieldLabelAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldLabelAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldLabelFoundation.defaultAdapter, adapter));
  }

  /**
   * Styles the label to match the supplied optional params. If a
   * param is not supplied, the method makes no changes related to that param.
   * @param {string=} optValue
   * @param {boolean=} optIsValid
   * @param {boolean=} optIsBadInput
   * @param {boolean=} optIsFocused
   */
  style(optValue, optIsValid, optIsBadInput, optIsFocused) {
    const {LABEL_FLOAT_ABOVE, LABEL_SHAKE} = MDCTextFieldLabelFoundation.cssClasses;
    const isFocused = !!optIsFocused;

    if (optIsValid !== undefined || optIsFocused !== undefined) {
      if (!!optIsValid || isFocused) {
        this.adapter_.removeClass(LABEL_SHAKE);
      } else {
        this.adapter_.addClass(LABEL_SHAKE);
      }
    }

    if (optValue !== undefined || optIsFocused !== undefined) {
      if (!!optValue || isFocused) {
        this.adapter_.addClass(LABEL_FLOAT_ABOVE);
      } else if (!optIsBadInput) {
        this.adapter_.removeClass(LABEL_FLOAT_ABOVE);
        this.receivedUserInput_ = false;
      }
    }
  }
}

export default MDCTextFieldLabelFoundation;
