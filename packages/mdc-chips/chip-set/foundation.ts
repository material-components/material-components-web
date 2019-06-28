/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCFoundation} from '@material/base/foundation';
import {Direction, EventSource, jumpChipKeys, navigationKeys, strings as chipStrings} from '../chip/constants';
import {MDCChipSetAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCChipSetFoundation extends MDCFoundation<MDCChipSetAdapter> {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter(): MDCChipSetAdapter {
    return {
      focusChipPrimaryActionAtIndex: () => undefined,
      focusChipTrailingActionAtIndex: () => undefined,
      getChipListCount: () => -1,
      getIndexOfChipById: () => -1,
      hasClass: () => false,
      isRTL: () => false,
      removeChip: () => undefined,
      removeFocusFromChipAtIndex: () => undefined,
      setSelected: () => undefined,
    };
  }

  /**
   * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
   */
  private selectedChipIds_: string[] = [];

  constructor(adapter?: Partial<MDCChipSetAdapter>) {
    super({...MDCChipSetFoundation.defaultAdapter, ...adapter});
  }

  /**
   * Returns an array of the IDs of all selected chips.
   */
  getSelectedChipIds(): ReadonlyArray<string> {
    return this.selectedChipIds_.slice();
  }

  /**
   * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
   */
  select(chipId: string) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      return;
    }

    if (this.adapter_.hasClass(cssClasses.CHOICE) && this.selectedChipIds_.length > 0) {
      const previouslySelectedChip = this.selectedChipIds_[0];
      this.selectedChipIds_.length = 0;
      this.adapter_.setSelected(previouslySelectedChip, false);
    }
    this.selectedChipIds_.push(chipId);
    this.adapter_.setSelected(chipId, true);
  }

  /**
   * Handles a chip interaction event
   */
  handleChipInteraction(chipId: string) {
    const index = this.adapter_.getIndexOfChipById(chipId);
    this.removeFocusFromChipsExcept_(index);
    if (this.adapter_.hasClass(cssClasses.CHOICE) || this.adapter_.hasClass(cssClasses.FILTER)) {
      this.toggleSelect_(chipId);
    }
  }

  /**
   * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
   */
  handleChipSelection(chipId: string, selected: boolean) {
    const chipIsSelected = this.selectedChipIds_.indexOf(chipId) >= 0;
    if (selected && !chipIsSelected) {
      this.select(chipId);
    } else if (!selected && chipIsSelected) {
      this.deselect_(chipId);
    }
  }

  /**
   * Handles the event when a chip is removed.
   */
  handleChipRemoval(chipId: string) {
    const index = this.adapter_.getIndexOfChipById(chipId);
    this.deselect_(chipId);
    this.adapter_.removeChip(chipId);
    const maxIndex = this.adapter_.getChipListCount() - 1;
    const nextIndex = Math.min(index, maxIndex);
    this.removeFocusFromChipsExcept_(nextIndex);
    // After removing a chip, we should focus the trailing action for the next chip.
    this.adapter_.focusChipTrailingActionAtIndex(nextIndex);
  }

  /**
   * Handles a chip navigation event.
   */
  handleChipNavigation(chipId: string, key: string, source: EventSource) {
    const maxIndex = this.adapter_.getChipListCount() - 1;
    let index = this.adapter_.getIndexOfChipById(chipId);
    // Early exit if the index is out of range or the key is unusable
    if (index === -1 || !navigationKeys.has(key)) {
      return;
    }

    const isRTL = this.adapter_.isRTL();
    const shouldIncrement = key === chipStrings.ARROW_RIGHT_KEY && !isRTL
        || key === chipStrings.ARROW_LEFT_KEY && isRTL
        || key === chipStrings.ARROW_DOWN_KEY;
    const isHome = key === chipStrings.HOME_KEY;
    const isEnd = key === chipStrings.END_KEY;
    if (shouldIncrement) {
      index++;
    } else if (isHome) {
      index = 0;
    } else if (isEnd) {
      index = maxIndex;
    } else {
      index--;
    }

    // Early exit if the index is out of bounds
    if (index < 0 || index > maxIndex) {
      return;
    }

    this.removeFocusFromChipsExcept_(index);
    this.focusChipAction_(index, key, source);
  }

  private focusChipAction_(index: number, key: string, source: EventSource) {
    const shouldJumpChips = jumpChipKeys.has(key);
    if (shouldJumpChips && source === EventSource.PRIMARY) {
      return this.adapter_.focusChipPrimaryActionAtIndex(index);
    }

    if (shouldJumpChips && source === EventSource.TRAILING) {
      return this.adapter_.focusChipTrailingActionAtIndex(index);
    }

    const dir = this.getDirection_(key);
    if (dir === Direction.LEFT) {
      return this.adapter_.focusChipTrailingActionAtIndex(index);
    }

    if (dir === Direction.RIGHT) {
      return this.adapter_.focusChipPrimaryActionAtIndex(index);
    }
  }

  private getDirection_(key: string): Direction {
    const isRTL = this.adapter_.isRTL();
    if (key === chipStrings.ARROW_LEFT_KEY && !isRTL || key === chipStrings.ARROW_RIGHT_KEY && isRTL) {
      return Direction.LEFT;
    }

    return Direction.RIGHT;
  }

  /**
   * Deselects the chip with the given id.
   */
  private deselect_(chipId: string) {
    const index = this.selectedChipIds_.indexOf(chipId);
    if (index >= 0) {
      this.selectedChipIds_.splice(index, 1);
      this.adapter_.setSelected(chipId, false);
    }
  }

  /**
   * Toggles selection of the chip with the given id.
   */
  private toggleSelect_(chipId: string) {
    if (this.selectedChipIds_.indexOf(chipId) >= 0) {
      this.deselect_(chipId);
    } else {
      this.select(chipId);
    }
  }

  private removeFocusFromChipsExcept_(index: number) {
    const chipCount = this.adapter_.getChipListCount();
    for (let i = 0; i < chipCount; i++) {
      if (i !== index) {
        this.adapter_.removeFocusFromChipAtIndex(i);
      }
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipSetFoundation;
