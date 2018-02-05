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
import MDCChipAdapter from './adapter';
import {strings} from './constants';


/**
 * @extends {MDCFoundation<!MDCChipAdapter>}
 * @final
 */
class MDCChipFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCChipAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCChipAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCChipAdapter} */ ({
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      notifyInteraction: () => {},
    });
  }

  /**
   * @param {!MDCChipAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipFoundation.defaultAdapter, adapter));

    /** @private {function(!Event): undefined} */
    this.interactionHandler_ = (evt) => this.handleInteraction_(evt);
  }

  init() {
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.registerInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  destroy() {
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  /**
   * Handles an interaction event on the root element.
   * @param {!Event} evt
   */
  handleInteraction_(evt) {
    if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {
      this.adapter_.notifyInteraction();
    }
  }
}

export default MDCChipFoundation;
