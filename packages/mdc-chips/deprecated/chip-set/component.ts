/**
 * @license
 * Copyright 2016 Google Inc.
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
import {announce} from '@material/dom/announce';

import {MDCChip, MDCChipFactory} from '../chip/component';
import {MDCChipFoundation} from '../chip/foundation';
import {MDCChipInteractionEvent, MDCChipNavigationEvent, MDCChipRemovalEvent, MDCChipSelectionEvent} from '../chip/types';

import {MDCChipSetAdapter} from './adapter';
import {MDCChipSetFoundation} from './foundation';

const {INTERACTION_EVENT, SELECTION_EVENT, REMOVAL_EVENT, NAVIGATION_EVENT} =
    MDCChipFoundation.strings;
const {CHIP_SELECTOR} = MDCChipSetFoundation.strings;

let idCounter = 0;

/** MDC Chip Set */
export class MDCChipSet extends MDCComponent<MDCChipSetFoundation> {
  static override attachTo(root: Element) {
    return new MDCChipSet(root);
  }

  get chips(): ReadonlyArray<MDCChip> {
    return this.chipsList.slice();
  }

  /**
   * @return An array of the IDs of all selected chips.
   */
  get selectedChipIds(): ReadonlyArray<string> {
    return this.foundation.getSelectedChipIds();
  }

  private chipsList!: MDCChip[];                   // assigned in initialize()
  private chipFactory!: (el: Element) => MDCChip;  // assigned in initialize()
  private handleChipInteraction!: (evt: MDCChipInteractionEvent) =>
      void;  // assigned in initialSyncWithDOM()
  private handleChipSelection!:
      (evt: MDCChipSelectionEvent) => void;  // assigned in initialSyncWithDOM()
  private handleChipRemoval!:
      (evt: MDCChipRemovalEvent) => void;  // assigned in initialSyncWithDOM()
  private handleChipNavigation!: (evt: MDCChipNavigationEvent) =>
      void;  // assigned in initialSyncWithDOM()

  /**
   * @param chipFactory A function which creates a new MDCChip.
   */
  override initialize(chipFactory: MDCChipFactory = (el) => new MDCChip(el)) {
    this.chipFactory = chipFactory;
    this.chipsList = this.instantiateChips(this.chipFactory);
  }

  override initialSyncWithDOM() {
    for (const chip of this.chipsList) {
      if (chip.id && chip.selected) {
        this.foundation.select(chip.id);
      }
    }

    this.handleChipInteraction = (evt) => {
      this.foundation.handleChipInteraction(evt.detail);
    };
    this.handleChipSelection = (evt) => {
      this.foundation.handleChipSelection(evt.detail);
    };
    this.handleChipRemoval = (evt) => {
      this.foundation.handleChipRemoval(evt.detail);
    };
    this.handleChipNavigation = (evt) => {
      this.foundation.handleChipNavigation(evt.detail);
    };
    this.listen(INTERACTION_EVENT, this.handleChipInteraction);
    this.listen(SELECTION_EVENT, this.handleChipSelection);
    this.listen(REMOVAL_EVENT, this.handleChipRemoval);
    this.listen(NAVIGATION_EVENT, this.handleChipNavigation);
  }

  override destroy() {
    for (const chip of this.chipsList) {
      chip.destroy();
    }

    this.unlisten(INTERACTION_EVENT, this.handleChipInteraction);
    this.unlisten(SELECTION_EVENT, this.handleChipSelection);
    this.unlisten(REMOVAL_EVENT, this.handleChipRemoval);
    this.unlisten(NAVIGATION_EVENT, this.handleChipNavigation);

    super.destroy();
  }

  /**
   * Adds a new chip object to the chip set from the given chip element.
   */
  addChip(chipEl: Element) {
    chipEl.id = chipEl.id || `mdc-chip-${++idCounter}`;
    this.chipsList.push(this.chipFactory(chipEl));
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCChipSetAdapter = {
      announceMessage: (message) => {
        announce(message);
      },
      focusChipPrimaryActionAtIndex: (index) => {
        this.chipsList[index].focusPrimaryAction();
      },
      focusChipTrailingActionAtIndex: (index) => {
        this.chipsList[index].focusTrailingAction();
      },
      getChipListCount: () => this.chips.length,
      getIndexOfChipById: (chipId) => {
        return this.findChipIndex(chipId);
      },
      hasClass: (className) => this.root.classList.contains(className),
      isRTL: () => window.getComputedStyle(this.root).getPropertyValue(
                       'direction') === 'rtl',
      removeChipAtIndex: (index) => {
        if (index >= 0 && index < this.chips.length) {
          this.chipsList[index].destroy();
          this.chipsList[index].remove();
          this.chipsList.splice(index, 1);
        }
      },
      removeFocusFromChipAtIndex: (index) => {
        this.chipsList[index].removeFocus();
      },
      selectChipAtIndex: (index, selected, shouldNotifyClients) => {
        if (index >= 0 && index < this.chips.length) {
          this.chipsList[index].setSelectedFromChipSet(
              selected, shouldNotifyClients);
        }
      },
    };
    return new MDCChipSetFoundation(adapter);
  }

  /**
   * Instantiates chip components on all of the chip set's child chip elements.
   */
  private instantiateChips(chipFactory: MDCChipFactory): MDCChip[] {
    const chipElements: Element[] =
        [].slice.call(this.root.querySelectorAll(CHIP_SELECTOR));
    return chipElements.map((el) => {
      el.id = el.id || `mdc-chip-${++idCounter}`;
      return chipFactory(el);
    });
  }

  /**
   * Returns the index of the chip with the given id, or -1 if the chip does not
   * exist.
   */
  private findChipIndex(chipId: string): number {
    for (let i = 0; i < this.chips.length; i++) {
      if (this.chipsList[i].id === chipId) {
        return i;
      }
    }
    return -1;
  }
}
