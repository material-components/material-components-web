/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {strings} from './constants';
import MDCTextFieldOutlineAdapter from './adapter';
import MDCTextFieldOutlineFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTextFieldOutlineFoundation>}
 * @final
 */
class MDCTextFieldOutline extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTextFieldOutline}
   */
  static attachTo(root) {
    return new MDCTextFieldOutline(root);
  }

  /**
   * @return {!MDCTextFieldOutlineFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCTextFieldOutlineFoundation}
   */
  getDefaultFoundation() {
    return new MDCTextFieldOutlineFoundation(/** @type {!MDCTextFieldOutlineAdapter} */ (Object.assign({
      getWidth: () => this.root_.offsetWidth,
      getHeight: () => this.root_.offsetHeight,
      setOutlinePathAttr: (value) => {
        const path = this.root_.querySelector(strings.PATH_SELECTOR);
        path.setAttribute('d', value);
      },
    })));
  }
}

export {MDCTextFieldOutline, MDCTextFieldOutlineFoundation};
