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
import MDCSelectBottomLineAdapter from './adapter';
import {cssClasses} from './constants';

/**
 * @extends {MDCFoundation<!MDCSelectBottomLineAdapter>}
 * @final
 */
class MDCSelectBottomLineFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCSelectBottomLineAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCSelectBottomLineAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSelectBottomLineAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
    });
  }

  /**
   * Adds the active class to bottom line
   */
  activate() {
    this.adapter_.addClass(cssClasses.BOTTOM_LINE_ACTIVE);
  }

  /**
   * Removes the active class from the bottom line
   */
  deactivate() {
    this.adapter_.removeClass(cssClasses.BOTTOM_LINE_ACTIVE);
  }

  /**
   * @param {!MDCSelectBottomLineAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSelectBottomLineFoundation.defaultAdapter, adapter));
  }
}

export default MDCSelectBottomLineFoundation;
