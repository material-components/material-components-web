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

import MDCSelectLabelAdapter from './adapter';
import MDCSelectLabelFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCSelectLabelFoundation>}
 * @final
 */
class MDCSelectLabel extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCSelectLabel}
   */
  static attachTo(root) {
    return new MDCSelectLabel(root);
  }

  /**
   * Styles the label to float or defloat as necessary.
   * @param {string} value The value of the input.
   */
  float(value) {
    this.foundation_.styleFloat(value);
  }

  /**
   * @return {!MDCSelectLabelFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectLabelFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
    });
  }
}

export {MDCSelectLabel, MDCSelectLabelFoundation};
