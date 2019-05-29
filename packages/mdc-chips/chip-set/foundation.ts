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
import {strings as chipStrings} from '../chip/constants';
import {HORIZONTAL_KEYS, VERTICAL_KEYS, END_KEYS} from '../chip/foundation';
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
      focusChipAtIndex: () => undefined,
      getChipClientRectByIndex: () => undefined,
      getChipListCount: () => -1,
      getIndexOfChipById: () => -1,
      hasClass: () => false,
      isRTL: () => false,
      removeChip: () => undefined,
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
    this.deselect_(chipId);
    this.adapter_.removeChip(chipId);
  }

  handleChipKeyboardNavigation(chipId: string, key: string) {
    const maxIndex = this.adapter_.getChipListCount() - 1;
    const index = this.adapter_.getIndexOfChipById(chipId);
    let idx = -1;
    if (HORIZONTAL_KEYS.has(key)) {
      idx = this.determineNextHorizontalChip_(chipId, key);
    } else if (VERTICAL_KEYS.has(key)) {
      idx = this.determineNextVerticalChip_(chipId, key);
    } else if (END_KEYS.has(key)) {
      idx = this.determineEndChip_(key, maxIndex);
    }

    // Early exit if the index is invalid or the source of the event
    if (idx < 0 || idx > maxIndex || idx === index) {
      return;
    }

    this.adapter_.focusChipAtIndex(idx);
  }

  private determineNextVerticalChip_(chipId: string, key: string): number {
    const isRTL = this.adapter_.isRTL();
    const maxIndex = this.adapter_.getChipListCount() - 1;
    const shouldGoUp = key === chipStrings.ARROW_UP_KEY;
    const shouldGoDown = key === chipStrings.ARROW_DOWN_KEY;
    const index = this.adapter_.getIndexOfChipById(chipId);

    if (shouldGoUp) {
      return this.determineAboveRowIndex_(index, isRTL);
    }

    if (shouldGoDown) {
      return this.determineBelowRowIndex_(index, maxIndex, isRTL);
    }

    return -1;
  }

  private determineAboveRowIndex_(index: number, isRTL: boolean): number {
    let aboveIndex = this.determineRowStartIndex_(index, isRTL) - 1;
    let smallestDistance = Number.MAX_VALUE;
    let closestIndex = -1;
    while (aboveIndex >= 0) {
      const nextDistance = this.chipHorizontalDistance_(index, aboveIndex);
      if (nextDistance < smallestDistance) {
        smallestDistance = nextDistance;
        closestIndex = aboveIndex;
        aboveIndex -= 1;
      } else {
        break;
      }
    }
    return closestIndex;
  }

  private determineBelowRowIndex_(index: number, maxIndex: number, isRTL: boolean): number {
    let belowIndex = this.determineRowEndIndex_(index, maxIndex, isRTL) + 1;
    let smallestDistance = Number.MAX_VALUE;
    let closestIndex = -1;
    while (belowIndex <= maxIndex) {
      const nextDistance = this.chipHorizontalDistance_(index, belowIndex);
      if (nextDistance < smallestDistance) {
        smallestDistance = nextDistance;
        closestIndex = belowIndex;
        belowIndex += 1;
      } else {
        break;
      }
    }
    return closestIndex;
  }

  private determineNextHorizontalChip_(chipId: string, key: string): number {
    const isRTL = this.adapter_.isRTL();
    const maxIndex = this.adapter_.getChipListCount() - 1;
    const shouldGoToEndOfRow = key === chipStrings.END_KEY;
    const shouldGoToStartOfRow = key === chipStrings.HOME_KEY;
    const shouldDecrement = key === chipStrings.ARROW_LEFT_KEY && !isRTL
        || key === chipStrings.ARROW_RIGHT_KEY && isRTL;
    const shouldIncrement = key === chipStrings.ARROW_RIGHT_KEY && !isRTL
        || key === chipStrings.ARROW_LEFT_KEY && isRTL;
    const index = this.adapter_.getIndexOfChipById(chipId);

    if (shouldGoToEndOfRow) {
      return this.determineRowEndIndex_(index, maxIndex, isRTL);
    }

    if (shouldGoToStartOfRow) {
      return this.determineRowStartIndex_(index, isRTL);
    }

    if (shouldDecrement) {
      return index - 1;
    }

    if (shouldIncrement) {
      return index + 1;
    }

    return -1;
  }

  private determineRowEndIndex_(index: number, maxIndex: number, isRTL: boolean): number {
    while (index <= maxIndex) {
      const nextIndex = index + 1;
      if (this.nextChipIsInNewRow_(index, nextIndex, isRTL)) {
        break;
      }
      index = nextIndex;
    }

    return index;
  }

  private determineRowStartIndex_(index: number, isRTL: boolean): number {
    while (index >= 0) {
      const nextIndex = index - 1;
      if (this.nextChipIsInNewRow_(index, nextIndex, isRTL)) {
        break;
      }
      index = nextIndex;
    }

    return index;
  }

  private nextChipIsInNewRow_(index: number, nextIndex: number, isRTL: boolean): boolean {
    // Proceed directly to the RTL implementation
    if (isRTL) {
      return this.nextChipIsInNewRowRTL_(index, nextIndex);
    }

    const chipClientRect = this.adapter_.getChipClientRectByIndex(index);
    const nextChipClientRect = this.adapter_.getChipClientRectByIndex(nextIndex);
    if (chipClientRect === undefined || nextChipClientRect === undefined) {
      return true;
    }

    if (index < nextIndex && chipClientRect.left > nextChipClientRect.left) {
      return true;
    }

    if (index > nextIndex && chipClientRect.left < nextChipClientRect.left) {
      return true;
    }

    return false;
  }

  private nextChipIsInNewRowRTL_(index: number, nextIndex: number): boolean {
    const chipClientRect = this.adapter_.getChipClientRectByIndex(index);
    const nextChipClientRect = this.adapter_.getChipClientRectByIndex(nextIndex);
    if (chipClientRect === undefined || nextChipClientRect === undefined) {
      return true;
    }

    if (index < nextIndex && chipClientRect.right < nextChipClientRect.right) {
      return true;
    }

    if (index > nextIndex && chipClientRect.right > nextChipClientRect.right) {
      return true;
    }

    return false;
  }

  private chipHorizontalDistance_(index: number, aboveIndex: number): number {
    const chipClientRect = this.adapter_.getChipClientRectByIndex(index);
    const aboveChipClientRect = this.adapter_.getChipClientRectByIndex(aboveIndex);
    if (chipClientRect === undefined || aboveChipClientRect === undefined) {
      return Number.MAX_VALUE;
    }

    const chipHorizontalCenter = chipClientRect.left + chipClientRect.width / 2;
    const aboveChipHorizontalCenter = aboveChipClientRect.left + aboveChipClientRect.width / 2;
    return Math.abs(chipHorizontalCenter - aboveChipHorizontalCenter);
  }

  private determineEndChip_(key: string, maxIndex: number): number {
    if (key === chipStrings.FIRST_KEY) {
      return 0;
    }

    if (key === chipStrings.LAST_KEY) {
      return maxIndex;
    }

    return -1;
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
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipSetFoundation;
