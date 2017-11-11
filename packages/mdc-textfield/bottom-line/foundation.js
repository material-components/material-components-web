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

import MDCFoundation from '@material/base/foundation';
import MDCTextFieldBottomLineAdapter from './adapter';
import {cssClasses} from './constants';


/**
 * @extends {MDCFoundation<!MDCTextFieldBottomLineAdapter>}
 * @final
 */
class MDCTextFieldBottomLineFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCTextFieldBottomLineAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldBottomLineAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldBottomLineAdapter} */ ({
      addClassToBottomLine: () => {},
      removeClassFromBottomLine: () => {},
      setBottomLineAttr: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldBottomLineAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldBottomLineAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldBottomLineFoundation.defaultAdapter, adapter));
  }

  /**
   * Activates the bottom line
   */
  activate() {
    this.adapter_.addClassToBottomLine(cssClasses.BOTTOM_LINE_ACTIVE);
  }

  /**
   * Animates out from the user's click location.
   * @param {!Event} evt
   * @private
   */
  animate(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const evtCoords = {x: evt.clientX, y: evt.clientY};
    const normalizedX = evtCoords.x - targetClientRect.left;
    const attributeString =
      `transform-origin: ${normalizedX}px center`;

    this.adapter_.setBottomLineAttr('style', attributeString);
  }

  /**
   * Deactives the bottom line
   */
  deactivate() {
    this.adapter_.removeClassFromBottomLine(cssClasses.BOTTOM_LINE_ACTIVE);
  }
}

export default MDCTextFieldBottomLineFoundation;
