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
import MDCChipFoundation from '../chip/foundation';
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
      appendChip: () => {},
      removeChip: () => {},
    });
  }

  /**
   * @param {!MDCChipSetAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipSetFoundation.defaultAdapter, adapter));

    /**
     * The selected chips in the set. Only used for choice chip set or filter chip set.
     * @private {!Array<!MDCChipFoundation>}
     */
    this.selectedChips_ = [];

    /** @private {function(!Event): undefined} */
    this.chipInteractionHandler_ = (evt) => this.handleChipInteraction_(evt);
    /** @private {function(!Event): undefined} */
    this.chipRemovalHandler_ = (evt) => this.handleChipRemoval_(evt);
  }

  init() {
    this.adapter_.registerInteractionHandler(
      MDCChipFoundation.strings.INTERACTION_EVENT, this.chipInteractionHandler_);
    this.adapter_.registerInteractionHandler(
      MDCChipFoundation.strings.REMOVAL_EVENT, this.chipRemovalHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler(
      MDCChipFoundation.strings.INTERACTION_EVENT, this.chipInteractionHandler_);
    this.adapter_.deregisterInteractionHandler(
      MDCChipFoundation.strings.REMOVAL_EVENT, this.chipRemovalHandler_);
  }

  /**
   * Returns a new chip element with the given text, leading icon, and trailing icon,
   * added to the root chip set element.
   * @param {string} text
   * @param {?Element} leadingIcon
   * @param {?Element} trailingIcon
   * @return {!Element}
   */
  addChip(text, leadingIcon, trailingIcon) {
    const chipEl = this.adapter_.appendChip(text, leadingIcon, trailingIcon);
    return chipEl;
  }

  /**
   * Selects the given chip. Deselects all other chips if the chip set is of the choice variant.
   * @param {!MDCChipFoundation} chipFoundation
   */
  select(chipFoundation) {
    if (this.adapter_.hasClass(cssClasses.CHOICE)) {
      this.deselectAll_();
    }
    chipFoundation.setSelected(true);
    this.selectedChips_.push(chipFoundation);
  }

  /**
   * Deselects the given chip.
   * @param {!MDCChipFoundation} chipFoundation
   */
  deselect(chipFoundation) {
    const index = this.selectedChips_.indexOf(chipFoundation);
    if (index >= 0) {
      this.selectedChips_.splice(index, 1);
    }
    chipFoundation.setSelected(false);
  }

  /** Deselects all selected chips. */
  deselectAll_() {
    this.selectedChips_.forEach((chipFoundation) => {
      chipFoundation.setSelected(false);
    });
    this.selectedChips_.length = 0;
  }

  /**
   * Handles a chip interaction event
   * @param {!Event} evt
   * @private
   */
  handleChipInteraction_(evt) {
    const chipFoundation = evt.detail.chip.foundation;
    if (this.adapter_.hasClass(cssClasses.CHOICE) || this.adapter_.hasClass(cssClasses.FILTER)) {
      if (chipFoundation.isSelected()) {
        this.deselect(chipFoundation);
      } else {
        this.select(chipFoundation);
      }
    }
  }

  /**
   * Handles the event when a chip is removed.
   * @param {!Event} evt
   * @private
   */
  handleChipRemoval_(evt) {
    const {chip} = evt.detail;
    this.deselect(chip.foundation);
    this.adapter_.removeChip(chip);
  }
}

export default MDCChipSetFoundation;
