/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import MDCDrawerAdapter from '../adapter';
import MDCFoundation from '@material/base/foundation';
import {cssClasses} from './constants';

/**
 * @extends {MDCFoundation<!MDCDrawerAdapter>}
 */
class MDCDismissibleDrawerFoundation extends MDCFoundation {

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter() {
    return /** @type {!MDCDrawerAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
    });
  }
  /**
   * @param {!MDCDrawerAdapter} adapter
   */
  constructor(adapter) {
    super(adapter);

    /**
     * isOpen_ is used to indicate if the drawer is open.
     * @private {boolean}
     */
    this.isOpen_ = false;
  }

  /**
   * Function to open the drawer from closed state.
   */
  open() {
    this.adapter_.addClass(cssClasses.OPEN);
    this.isOpen_ = true;
  }

  /**
   * Function to close the drawer from the open state.
   */
  close() {
    this.adapter_.removeClass(cssClasses.OPEN);
    this.isOpen_ = false;
  }

  /**
   * Returns true if drawer is in open state.
   * @return {boolean}
   */
  isOpen() {
    return this.isOpen_;
  }

  /**
   * Keydown handler to close drawer when key is escape.
   * @param evt
   */
  handleKeydown(evt) {
    
  }

}

export default MDCDismissibleDrawerFoundation;
