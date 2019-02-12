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
import {SpecificEventListener} from '@material/base/types';
import {MDCRipple, MDCRippleFactory, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
import {strings} from './constants';
import {MDCChipFoundation} from './foundation';

type InteractionType = 'click' | 'keydown';

const INTERACTION_EVENTS: InteractionType[] = ['click', 'keydown'];

export interface MDCChipInteractionEventDetail {
  chipId: string;
}

export interface MDCChipSelectionEventDetail extends MDCChipInteractionEventDetail {
  selected: boolean;
}

export interface MDCChipRemovalEventDetail extends MDCChipInteractionEventDetail {
  root: Element;
}

export interface MDCChipInteractionEvent extends CustomEvent<MDCChipInteractionEventDetail> {}
export interface MDCChipSelectionEvent extends CustomEvent<MDCChipSelectionEventDetail> {}
export interface MDCChipRemovalEvent extends CustomEvent<MDCChipRemovalEventDetail> {}

export type MDCChipFactory = (root: Element, foundation?: MDCChipFoundation) => MDCChip;

export class MDCChip extends MDCComponent<MDCChipFoundation> implements RippleCapableSurface {
  /**
   * @return Whether the chip is selected.
   */
  get selected(): boolean {
    return this.foundation_.isSelected();
  }

  /**
   * Sets selected state on the chip.
   */
  set selected(selected: boolean) {
    this.foundation_.setSelected(selected);
  }

  /**
   * @return Whether a trailing icon click should trigger exit/removal of the chip.
   */
  get shouldRemoveOnTrailingIconClick(): boolean {
    return this.foundation_.getShouldRemoveOnTrailingIconClick();
  }

  /**
   * Sets whether a trailing icon click should trigger exit/removal of the chip.
   */
  set shouldRemoveOnTrailingIconClick(shouldRemove: boolean) {
    this.foundation_.setShouldRemoveOnTrailingIconClick(shouldRemove);
  }

  get ripple(): MDCRipple {
    return this.ripple_;
  }

  get id(): string {
    return this.root_.id;
  }

  static attachTo(root: Element) {
    return new MDCChip(root);
  }

  // Public visibility for this property is required by RippleCapableSurface.
  root_!: HTMLElement; // assigned in MDCComponent constructor

  private leadingIcon_!: Element | null; // assigned in initialize()
  private trailingIcon_!: Element | null; // assigned in initialize()
  private checkmark_!: Element | null; // assigned in initialize()
  private ripple_!: MDCRipple; // assigned in initialize()

  private handleInteraction_!: SpecificEventListener<InteractionType>; // assigned in initialSyncWithDOM()
  private handleTransitionEnd_!: SpecificEventListener<'transitionend'>; // assigned in initialSyncWithDOM()
  private handleTrailingIconInteraction_!: SpecificEventListener<InteractionType>; // assigned in initialSyncWithDOM()

  initialize(rippleFactory: MDCRippleFactory = (root, foundation) => new MDCRipple(el, foundation)) {
    this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    this.trailingIcon_ = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);
    this.checkmark_ = this.root_.querySelector(strings.CHECKMARK_SELECTOR);

    this.ripple_ = rippleFactory(this.root_, new MDCRippleFoundation({
      ...MDCRipple.createAdapter(this),
      computeBoundingRect: () => this.foundation_.getDimensions(),
    }));
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = (evt: MouseEvent | KeyboardEvent) => this.foundation_.handleInteraction(evt);
    this.handleTransitionEnd_ = (evt: TransitionEvent) => this.foundation_.handleTransitionEnd(evt);
    this.handleTrailingIconInteraction_ = (evt: MouseEvent | KeyboardEvent) =>
        this.foundation_.handleTrailingIconInteraction(evt);

    INTERACTION_EVENTS.forEach((evtType) => {
      this.listen(evtType, this.handleInteraction_);
    });
    this.listen('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_!.addEventListener(evtType, this.handleTrailingIconInteraction_ as EventListener);
      });
    }
  }

  destroy() {
    this.ripple_.destroy();

    INTERACTION_EVENTS.forEach((evtType) => {
      this.unlisten(evtType, this.handleInteraction_);
    });
    this.unlisten('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_!.removeEventListener(evtType, this.handleTrailingIconInteraction_ as EventListener);
      });
    }

    super.destroy();
  }

  /**
   * Begins the exit animation which leads to removal of the chip.
   */
  beginExit() {
    this.foundation_.beginExit();
  }

  getDefaultFoundation() {
    return new MDCChipFoundation({
      addClass: (className) => this.root_.classList.add(className),
      addClassToLeadingIcon: (className) => {
        if (this.leadingIcon_) {
          this.leadingIcon_.classList.add(className);
        }
      },
      eventTargetHasClass: (target, className) => target ? (target as Element).classList.contains(className) : false,
      getCheckmarkBoundingClientRect: () => this.checkmark_ ? this.checkmark_.getBoundingClientRect() : null,
      getComputedStyleValue: (propertyName) => window.getComputedStyle(this.root_).getPropertyValue(propertyName),
      getRootBoundingClientRect: () => this.root_.getBoundingClientRect(),
      hasClass: (className) => this.root_.classList.contains(className),
      hasLeadingIcon: () => !!this.leadingIcon_,
      notifyInteraction: () => this.emit<MDCChipInteractionEventDetail>(
          strings.INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      notifyRemoval: () => this.emit<MDCChipRemovalEventDetail>(
          strings.REMOVAL_EVENT, {chipId: this.id, root: this.root_}, true /* shouldBubble */),
      notifySelection: (selected) => this.emit<MDCChipSelectionEventDetail>(
          strings.SELECTION_EVENT, {chipId: this.id, selected}, true /* shouldBubble */),
      notifyTrailingIconInteraction: () => this.emit<MDCChipInteractionEventDetail>(
          strings.TRAILING_ICON_INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      removeClass: (className) => this.root_.classList.remove(className),
      removeClassFromLeadingIcon: (className) => {
        if (this.leadingIcon_) {
          this.leadingIcon_.classList.remove(className);
        }
      },
      setStyleProperty: (propertyName, value) => this.root_.style.setProperty(propertyName, value),
    });
  }
}

export default MDCChip;
