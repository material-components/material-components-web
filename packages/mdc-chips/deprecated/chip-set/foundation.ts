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
import {MDCChipInteractionEventDetail, MDCChipNavigationEventDetail, MDCChipRemovalEventDetail, MDCChipSelectionEventDetail} from '../chip/types';

import {MDCChipSetAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCChipSetFoundation extends MDCFoundation<MDCChipSetAdapter> {
  static override get strings() {
    return strings;
  }

  static override get cssClasses() {
    return cssClasses;
  }

  static override get defaultAdapter(): MDCChipSetAdapter {
    return {
      announceMessage: () => undefined,
      focusChipPrimaryActionAtIndex: () => undefined,
      focusChipTrailingActionAtIndex: () => undefined,
      getChipListCount: () => -1,
      getIndexOfChipById: () => -1,
      hasClass: () => false,
      isRTL: () => false,
      removeChipAtIndex: () => undefined,
      removeFocusFromChipAtIndex: () => undefined,
      selectChipAtIndex: () => undefined,
    };
  }

  /**
   * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
   */
  private selectedChipIds: string[] = [];

  constructor(adapter?: Partial<MDCChipSetAdapter>) {
    super({...MDCChipSetFoundation.defaultAdapter, ...adapter});
  }

  /**
   * Returns an array of the IDs of all selected chips.
   */
  getSelectedChipIds(): ReadonlyArray<string> {
    return this.selectedChipIds.slice();
  }

  /**
   * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
   * Does not notify clients of the updated selection state.
   */
  select(chipId: string) {
    this.selectImpl(chipId, false);
  }

  /**
   * Handles a chip interaction event
   */
  handleChipInteraction({chipId}: MDCChipInteractionEventDetail) {
    const index = this.adapter.getIndexOfChipById(chipId);
    this.removeFocusFromChipsExcept(index);
    if (this.adapter.hasClass(cssClasses.CHOICE) ||
        this.adapter.hasClass(cssClasses.FILTER)) {
      this.toggleSelect(chipId);
    }
  }

  /**
   * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
   */
  handleChipSelection({chipId, selected, shouldIgnore}:
                          MDCChipSelectionEventDetail) {
    // Early exit if we should ignore the event
    if (shouldIgnore) {
      return;
    }

    const chipIsSelected = this.selectedChipIds.indexOf(chipId) >= 0;
    if (selected && !chipIsSelected) {
      this.select(chipId);
    } else if (!selected && chipIsSelected) {
      this.deselectImpl(chipId);
    }
  }

  /**
   * Handles the event when a chip is removed.
   */
  handleChipRemoval({chipId, removedAnnouncement}: MDCChipRemovalEventDetail) {
    if (removedAnnouncement) {
      this.adapter.announceMessage(removedAnnouncement);
    }

    const index = this.adapter.getIndexOfChipById(chipId);
    this.deselectAndNotifyClients(chipId);
    this.adapter.removeChipAtIndex(index);
    const maxIndex = this.adapter.getChipListCount() - 1;
    if (maxIndex < 0) {
      return;
    }
    const nextIndex = Math.min(index, maxIndex);
    this.removeFocusFromChipsExcept(nextIndex);
    // After removing a chip, we should focus the trailing action for the next chip.
    this.adapter.focusChipTrailingActionAtIndex(nextIndex);
  }

  /**
   * Handles a chip navigation event.
   */
  handleChipNavigation({chipId, key, source}: MDCChipNavigationEventDetail) {
    const maxIndex = this.adapter.getChipListCount() - 1;
    let index = this.adapter.getIndexOfChipById(chipId);
    // Early exit if the index is out of range or the key is unusable
    if (index === -1 || !navigationKeys.has(key)) {
      return;
    }

    const isRTL = this.adapter.isRTL();
    const isLeftKey = key === chipStrings.ARROW_LEFT_KEY ||
        key === chipStrings.IE_ARROW_LEFT_KEY;
    const isRightKey = key === chipStrings.ARROW_RIGHT_KEY ||
        key === chipStrings.IE_ARROW_RIGHT_KEY;
    const isDownKey = key === chipStrings.ARROW_DOWN_KEY ||
        key === chipStrings.IE_ARROW_DOWN_KEY;
    const shouldIncrement =
        !isRTL && isRightKey || isRTL && isLeftKey || isDownKey;
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

    this.removeFocusFromChipsExcept(index);
    this.focusChipAction(index, key, source);
  }

  private focusChipAction(index: number, key: string, source: EventSource) {
    const shouldJumpChips = jumpChipKeys.has(key);
    if (shouldJumpChips && source === EventSource.PRIMARY) {
      this.adapter.focusChipPrimaryActionAtIndex(index);
      return;
    }

    if (shouldJumpChips && source === EventSource.TRAILING) {
      this.adapter.focusChipTrailingActionAtIndex(index);
      return;
    }

    const dir = this.getDirection(key);
    if (dir === Direction.LEFT) {
      this.adapter.focusChipTrailingActionAtIndex(index);
      return;
    }

    if (dir === Direction.RIGHT) {
      this.adapter.focusChipPrimaryActionAtIndex(index);
      return;
    }
  }

  private getDirection(key: string): Direction {
    const isRTL = this.adapter.isRTL();
    const isLeftKey = key === chipStrings.ARROW_LEFT_KEY ||
        key === chipStrings.IE_ARROW_LEFT_KEY;
    const isRightKey = key === chipStrings.ARROW_RIGHT_KEY ||
        key === chipStrings.IE_ARROW_RIGHT_KEY;
    if (!isRTL && isLeftKey || isRTL && isRightKey) {
      return Direction.LEFT;
    }

    return Direction.RIGHT;
  }

  /**
   * Deselects the chip with the given id and optionally notifies clients.
   */
  private deselectImpl(chipId: string, shouldNotifyClients = false) {
    const index = this.selectedChipIds.indexOf(chipId);
    if (index >= 0) {
      this.selectedChipIds.splice(index, 1);
      const chipIndex = this.adapter.getIndexOfChipById(chipId);
      this.adapter.selectChipAtIndex(
          chipIndex, /** isSelected */ false, shouldNotifyClients);
    }
  }

  /**
   * Deselects the chip with the given id and notifies clients.
   */
  private deselectAndNotifyClients(chipId: string) {
    this.deselectImpl(chipId, true);
  }

  /**
   * Toggles selection of the chip with the given id.
   */
  private toggleSelect(chipId: string) {
    if (this.selectedChipIds.indexOf(chipId) >= 0) {
      this.deselectAndNotifyClients(chipId);
    } else {
      this.selectAndNotifyClients(chipId);
    }
  }

  private removeFocusFromChipsExcept(index: number) {
    const chipCount = this.adapter.getChipListCount();
    for (let i = 0; i < chipCount; i++) {
      if (i !== index) {
        this.adapter.removeFocusFromChipAtIndex(i);
      }
    }
  }

  private selectAndNotifyClients(chipId: string) {
    this.selectImpl(chipId, true);
  }

  private selectImpl(chipId: string, shouldNotifyClients: boolean) {
    if (this.selectedChipIds.indexOf(chipId) >= 0) {
      return;
    }

    if (this.adapter.hasClass(cssClasses.CHOICE) &&
        this.selectedChipIds.length > 0) {
      const previouslySelectedChip = this.selectedChipIds[0];
      const previouslySelectedIndex =
          this.adapter.getIndexOfChipById(previouslySelectedChip);
      this.selectedChipIds = [];
      this.adapter.selectChipAtIndex(
          previouslySelectedIndex, /** isSelected */ false,
          shouldNotifyClients);
    }
    this.selectedChipIds.push(chipId);
    const index = this.adapter.getIndexOfChipById(chipId);
    this.adapter.selectChipAtIndex(
        index, /** isSelected */ true, shouldNotifyClients);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCChipSetFoundation;
