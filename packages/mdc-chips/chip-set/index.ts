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
import {MDCChip, MDCChipFoundation} from '../chip/index';
import {MDCChipInteractionEvent, MDCChipRemovalEvent, MDCChipSelectionEvent} from '../chip/types';
import {MDCChipSetFoundation} from './foundation';

let idCounter = 0;
type ChipFactory = (el: Element) => MDCChip;

class MDCChipSet extends MDCComponent<MDCChipSetFoundation> {

  /**
   * Returns an array of the IDs of all selected chips.
   */
  get selectedChipIds() {
    return this.foundation_.getSelectedChipIds();
  }

  static attachTo(root: Element) {
    return new MDCChipSet(root);
  }

  chips!: MDCChip[];

  private chipFactory_!: (el: Element) => MDCChip;
  private handleChipInteraction_!: (evt: MDCChipInteractionEvent) => void;
  private handleChipSelection_!: (evt: MDCChipSelectionEvent) => void;
  private handleChipRemoval_!: (evt: MDCChipRemovalEvent) => void;

  /**
   * @param chipFactory A function which creates a new MDCChip.
   */
  initialize(chipFactory = (el: Element) => new MDCChip(el)) {
    this.chipFactory_ = chipFactory;
    this.chips = this.instantiateChips_(this.chipFactory_);
  }

  initialSyncWithDOM() {
    this.chips.forEach((chip) => {
      if (chip.id && chip.selected) {
        this.foundation_.select(chip.id);
      }
    });

    this.handleChipInteraction_ = (evt) => this.foundation_.handleChipInteraction(evt.detail.chipId);
    this.handleChipSelection_ = (evt) => this.foundation_.handleChipSelection(evt.detail.chipId, evt.detail.selected);
    this.handleChipRemoval_ = (evt) => this.foundation_.handleChipRemoval(evt.detail.chipId);
    this.root_.addEventListener(
        MDCChipFoundation.strings.INTERACTION_EVENT, this.handleChipInteraction_ as EventListener);
    this.root_.addEventListener(
        MDCChipFoundation.strings.SELECTION_EVENT, this.handleChipSelection_ as EventListener);
    this.root_.addEventListener(
        MDCChipFoundation.strings.REMOVAL_EVENT, this.handleChipRemoval_ as EventListener);
  }

  destroy() {
    this.chips.forEach((chip) => {
      chip.destroy();
    });

    this.root_.removeEventListener(
        MDCChipFoundation.strings.INTERACTION_EVENT, this.handleChipInteraction_ as EventListener);
    this.root_.removeEventListener(
        MDCChipFoundation.strings.SELECTION_EVENT, this.handleChipSelection_ as EventListener);
    this.root_.removeEventListener(
        MDCChipFoundation.strings.REMOVAL_EVENT, this.handleChipRemoval_ as EventListener);

    super.destroy();
  }

  /**
   * Adds a new chip object to the chip set from the given chip element.
   */
  addChip(chipEl: Element) {
    chipEl.id = chipEl.id || `mdc-chip-${++idCounter}`;
    this.chips.push(this.chipFactory_(chipEl));
  }

  getDefaultFoundation() {
    return new MDCChipSetFoundation({
      hasClass: (className) => this.root_.classList.contains(className),
      removeChip: (chipId) => {
        const index = this.findChipIndex_(chipId);
        if (index >= 0) {
          this.chips[index].destroy();
          this.chips.splice(index, 1);
        }
      },
      setSelected: (chipId, selected) => {
        const index = this.findChipIndex_(chipId);
        if (index >= 0) {
          this.chips[index].selected = selected;
        }
      },
    });
  }

  /**
   * Instantiates chip components on all of the chip set's child chip elements.
   */
  instantiateChips_(chipFactory: ChipFactory): MDCChip[] {
    const chipElements: Element[] =
        [].slice.call(this.root_.querySelectorAll(MDCChipSetFoundation.strings.CHIP_SELECTOR));
    return chipElements.map((el) => {
      el.id = el.id || `mdc-chip-${++idCounter}`;
      return chipFactory(el);
    });
  }

  /**
   * Returns the index of the chip with the given id, or -1 if the chip does not exist.
   */
  findChipIndex_(chipId: string): number {
    for (let i = 0; i < this.chips.length; i++) {
      if (this.chips[i].id === chipId) {
        return i;
      }
    }
    return -1;
  }
}

export {MDCChipSet, MDCChipSetFoundation};
