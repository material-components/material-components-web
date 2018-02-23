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

import MDCSelectBottomLineAdapter from './adapter';
import MDCSelectBottomLineFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCSelectBottomLineFoundation>}
 * @final
 */
class MDCSelectBottomLine extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCSelectBottomLine}
   */
  static attachTo(root) {
    return new MDCSelectBottomLine(root);
  }

  /**
   * Activates the bottom line active class
   */
  activate() {
    this.foundation_.activate();
  }

  /**
   * Deactivates the bottom line active class
   */
  deactivate() {
    this.foundation_.deactivate();
  }

  /**
   * @return {!MDCSelectBottomLineFoundation}
   */
  getDefaultFoundation() {
    return new MDCSelectBottomLineFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
    });
  }
}

export {MDCSelectBottomLine, MDCSelectBottomLineFoundation};
