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
import MDCChipSetAdapter from './adapter';
// eslint-disable-next-line no-unused-vars
import {MDCChip, MDCChipFoundation} from '../chip/index';
import {strings, cssClasses} from './constants';

/**
 * @extends {MDCFoundation<!MDCChipSetAdapter>}
 * @final
 */
class MDCChipSetFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCChipSetAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCChipSetAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCChipSetAdapter} */ ({
      hasClass: () => {},
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
    });
  }

  /**
   * @param {!MDCChipSetAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipSetFoundation.defaultAdapter, adapter));

    /**
     * The selected chips in the set. Only used for choice chip set or filter chip set.
     * @private {!Array<!MDCChip>}
     */
    this.selectedChips_ = [];

    /** @private {function(!Event): undefined} */
    this.chipInteractionHandler_ = (evt) => this.handleChipInteraction_(evt);
  }

  init() {
    this.adapter_.registerInteractionHandler(
      MDCChipFoundation.strings.INTERACTION_EVENT, this.chipInteractionHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler(
      MDCChipFoundation.strings.INTERACTION_EVENT, this.chipInteractionHandler_);
  }

  /**
   * Handles a chip interaction event
   * @param {!Object} evt
   * @private
   */
  handleChipInteraction_(evt) {
    const {chip} = evt.detail;
    if (this.adapter_.hasClass(cssClasses.CHOICE)) {
      if (this.selectedChips_.length === 0) {
        this.selectedChips_[0] = chip;
      } else if (this.selectedChips_[0] !== chip) {
        this.selectedChips_[0].toggleSelected();
        this.selectedChips_[0] = chip;
      } else {
        this.selectedChips_ = [];
      }
      chip.toggleSelected();
    } else if (this.adapter_.hasClass(cssClasses.FILTER)) {
      const index = this.selectedChips_.indexOf(chip);
      if (index >= 0) {
        this.selectedChips_.splice(index, 1);
      } else {
        this.selectedChips_.push(chip);
      }
      chip.toggleSelected();
    }
  }
}

export default MDCChipSetFoundation;
