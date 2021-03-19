/**
 * @license
 * Copyright 2018 Google Inc.
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

import {MDCComponent} from '@material/base/component';
import {CustomEventListener} from '@material/base/types';

import {ActionType} from '../action/constants';
import {MDCChip, MDCChipFactory} from '../chip/component';
import {Events} from '../chip/constants';

import {MDCChipSetAdapter} from './adapter';
import {CssClasses} from './constants';
import {MDCChipSetFoundation} from './foundation';
import {ChipInteractionEvent, ChipNavigationEvent} from './types';

/**
 * MDCChip provides component encapsulation of the foundation implementation.
 */
export class MDCChipSet extends MDCComponent<MDCChipSetFoundation> {
  static attachTo(root: Element): MDCChipSet {
    return new MDCChipSet(root);
  }

  // Below properties are all assigned in #initialize()
  private handleChipInteraction!: CustomEventListener<ChipInteractionEvent>;
  private handleChipNavigation!: CustomEventListener<ChipNavigationEvent>;
  private chips!: MDCChip[];

  initialize(chipFactory: MDCChipFactory = (el: Element) => new MDCChip(el)) {
    this.chips = [];
    const chipEls = this.root.querySelectorAll(`.${CssClasses.CHIP}`);
    for (let i = 0; i < chipEls.length; i++) {
      const chip = chipFactory(chipEls[i]);
      this.chips.push(chip);
    }
  }

  initialSyncWithDOM() {
    this.handleChipInteraction = (event) => {
      this.foundation.handleChipInteraction(event);
    };

    this.handleChipNavigation = (event) => {
      this.foundation.handleChipNavigation(event);
    };

    this.listen(Events.INTERACTION, this.handleChipInteraction);
    this.listen(Events.NAVIGATION, this.handleChipNavigation);
  }

  destroy() {
    this.unlisten(Events.INTERACTION, this.handleChipInteraction);
    this.unlisten(Events.NAVIGATION, this.handleChipNavigation);
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCChipSetAdapter = {
      // TODO(b/169284745): Implement and test
      announceMessage: () => {},
      emitEvent: (eventName, eventDetail) => {
        this.emit(eventName, eventDetail, true /* shouldBubble */);
      },
      getAttribute: (attrName) => this.root.getAttribute(attrName),
      getChipActionsAtIndex: (index) => {
        if (!this.isIndexValid(index)) return [];
        return this.chips[index].getActions();
      },
      getChipCount: () => this.chips.length,
      getChipIdAtIndex: (index) => {
        if (!this.isIndexValid(index)) return '';
        return this.chips[index].getElementID();
      },
      getChipIndexById: (id) =>
          this.chips.findIndex((chip) => chip.getElementID() === id),
      isChipFocusableAtIndex: (index, action) => {
        if (!this.isIndexValid(index)) return false;
        return this.chips[index].isActionFocusable(action);
      },
      isChipSelectableAtIndex: (index, action) => {
        if (!this.isIndexValid(index)) return false;
        return this.chips[index].isActionSelectable(action);
      },
      isChipSelectedAtIndex: (index, action) => {
        if (!this.isIndexValid(index)) return false;
        return this.chips[index].isActionSelected(action);
      },
      // TODO(b/169284745): Implement and test
      removeChipAtIndex: () => {},
      setChipFocusAtIndex: (index, action, focus) => {
        if (!this.isIndexValid(index)) return;
        this.chips[index].setActionFocus(action, focus);
      },
      setChipSelectedAtIndex: (index, action, selected) => {
        if (!this.isIndexValid(index)) return;
        this.chips[index].setActionSelected(action, selected);
      },
      // TODO(b/169284745): Implement and test
      startChipAnimationAtIndex: () => {},
    };

    // Default to the primary foundation
    return new MDCChipSetFoundation(adapter);
  }

  /** Returns the index of the chip with the given ID or -1 if none exists. */
  getChipIndexByID(chipID: string): number {
    return this.chips.findIndex((chip) => chip.getElementID() === chipID);
  }

  /**
   * Returns the ID of the chip at the given index or an empty string if the
   * index is out of bounds.
   */
  getChipIdAtIndex(index: number): string {
    if (!this.isIndexValid(index)) return '';
    return this.chips[index].getElementID();
  }

  /** Returns the unique indexes of the selected chips. */
  getSelectedChipIndexes(): ReadonlySet<number> {
    return this.foundation.getSelectedChipIndexes();
  }

  /** Sets the selection state of the chip. */
  setChipSelected(index: number, action: ActionType, isSelected: boolean) {
    this.foundation.setChipSelected(index, action, isSelected);
  }

  /** Returns the selection state of the chip. */
  isChipSelected(index: number, action: ActionType) {
    return this.foundation.isChipSelected(index, action);
  }

  /** Removes the chip at the given index. */
  removeChip(index: number) {
    this.foundation.removeChip(index);
  }

  private isIndexValid(index: number): boolean {
    return index > -1 && index < this.chips.length;
  }
}
