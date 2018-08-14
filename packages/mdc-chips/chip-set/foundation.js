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
import {MDCChipInteractionEventType, MDCChipRemovalEventType} from '../chip/foundation';
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
      removeChip: () => {},
      setSelected: () => {},
    });
  }

  /**
   * @param {!MDCChipSetAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipSetFoundation.defaultAdapter, adapter));

    /**
     * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
     * @private {!Array<string>}
     */
    this.selectedChipIds_ = [];
  }

  /**
   * Returns an array of the IDs of all selected chips.
   * @return {!Array<string>}
   */
  getSelectedChipIds() {
    return this.selectedChipIds_;
  }

  /**
   * Toggles selection of the chip with the given id.
   * @param {string} chipId
   */
  toggleSelect(chipId) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      this.deselect(chipId);
    } else {
      this.select(chipId);
    }
  }

  /**
   * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
   * @param {string} chipId
   */
  select(chipId) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      return;
    }

    if (this.adapter_.hasClass(cssClasses.CHOICE) && this.selectedChipIds_.length > 0) {
      this.adapter_.setSelected(this.selectedChipIds_[0], false);
      this.selectedChipIds_.length = 0;
    }
    this.adapter_.setSelected(chipId, true);
    this.selectedChipIds_.push(chipId);
  }

  /**
   * Deselects the chip with the given id.
   * @param {string} chipId
   */
  deselect(chipId) {
    const index = this.selectedChipIds_.indexOf(chipId);
    if (index >= 0) {
      this.selectedChipIds_.splice(index, 1);
      this.adapter_.setSelected(chipId, false);
    }
  }

  /**
   * Handles a chip interaction event
   * @param {!MDCChipInteractionEventType} evt
   */
  handleChipInteraction(evt) {
    const {chipId} = evt.detail;
    if (this.adapter_.hasClass(cssClasses.CHOICE) || this.adapter_.hasClass(cssClasses.FILTER)) {
      this.toggleSelect(chipId);
    }
  }

  /**
   * Handles the event when a chip is removed.
   * @param {!MDCChipRemovalEventType} evt
   */
  handleChipRemoval(evt) {
    const {chipId} = evt.detail;
    this.deselect(chipId);
    this.adapter_.removeChip(chipId);
  }
}

export default MDCChipSetFoundation;
