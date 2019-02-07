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

import MDCComponent from '@material/base/component';
import {SpecificEventListener} from '@material/base/index';
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';

import {strings} from './constants';
import {MDCChipFoundation} from './foundation';

const INTERACTION_EVENTS: Array<'click' | 'keydown'> = ['click', 'keydown'];

class MDCChip extends MDCComponent<MDCChipFoundation> implements RippleCapableSurface {

  /**
   * Returns whether the chip is selected.
   */
  get selected() {
    return this.foundation_.isSelected();
  }

  /**
   * Sets selected state on the chip.
   */
  set selected(selected: boolean) {
    this.foundation_.setSelected(selected);
  }

  /**
   * Returns whether a trailing icon click should trigger exit/removal of the chip.
   */
  get shouldRemoveOnTrailingIconClick() {
    return this.foundation_.getShouldRemoveOnTrailingIconClick();
  }

  /**
   * Sets whether a trailing icon click should trigger exit/removal of the chip.
   */
  set shouldRemoveOnTrailingIconClick(shouldRemove: boolean) {
    this.foundation_.setShouldRemoveOnTrailingIconClick(shouldRemove);
  }

  get ripple() {
    return this.ripple_;
  }

  static attachTo(root: Element) {
    return new MDCChip(root);
  }

  id: string | undefined;
  root_!: HTMLElement;
  private leadingIcon_!: HTMLElement | null;
  private trailingIcon_!: HTMLElement | null;
  private checkmark_!: HTMLElement | null;
  private ripple_!: MDCRipple;

  private handleInteraction_!: SpecificEventListener<'click'|'keydown'>;
  private handleTransitionEnd_!: SpecificEventListener<'transitionend'>;
  private handleTrailingIconInteraction_!: SpecificEventListener<'click'|'keydown'>;

  initialize(
    rippleFactory = (el: Element, foundation: MDCRippleFoundation) => new MDCRipple(el, foundation)) {
    this.id = this.root_.id;
    this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    this.trailingIcon_ = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);
    this.checkmark_ = this.root_.querySelector(strings.CHECKMARK_SELECTOR);

    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      computeBoundingRect: () => this.foundation_.getDimensions(),
    });
    this.ripple_ = rippleFactory(this.root_, new MDCRippleFoundation(adapter));
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = (evt: MouseEvent | KeyboardEvent) => this.foundation_.handleInteraction(evt);
    this.handleTransitionEnd_ = (evt: TransitionEvent) => this.foundation_.handleTransitionEnd(evt);
    this.handleTrailingIconInteraction_ = (evt: MouseEvent | KeyboardEvent) =>
      this.foundation_.handleTrailingIconInteraction(evt);

    INTERACTION_EVENTS.forEach((evtType) => {
      this.root_.addEventListener(evtType, this.handleInteraction_);
    });
    this.root_.addEventListener('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_!.addEventListener(evtType, this.handleTrailingIconInteraction_);
      });
    }
  }

  destroy() {
    this.ripple_.destroy();

    INTERACTION_EVENTS.forEach((evtType) => {
      this.root_.removeEventListener(evtType, this.handleInteraction_);
    });
    this.root_.removeEventListener('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_!.removeEventListener(evtType, this.handleTrailingIconInteraction_);
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
      eventTargetHasClass: (target, className) => {
        if (!target) return false;
        return (target as Element).classList.contains(className);
      },
      getCheckmarkBoundingClientRect: () => this.checkmark_ ? this.checkmark_.getBoundingClientRect() : null,
      getComputedStyleValue: (propertyName) => window.getComputedStyle(this.root_).getPropertyValue(propertyName),
      getRootBoundingClientRect: () => this.root_.getBoundingClientRect(),
      hasClass: (className) => this.root_.classList.contains(className),
      hasLeadingIcon: () => !!this.leadingIcon_,
      notifyInteraction: () => this.emit(
        strings.INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      notifyRemoval: () => this.emit(
        strings.REMOVAL_EVENT, {chipId: this.id, root: this.root_}, true /* shouldBubble */),
      notifySelection: (selected) => this.emit(
        strings.SELECTION_EVENT, {chipId: this.id, selected}, true /* shouldBubble */),
      notifyTrailingIconInteraction: () => this.emit(
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

export {MDCChip, MDCChipFoundation};
