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
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';

import MDCChipAdapter from './adapter';
import {MDCChipFoundation} from './foundation';
import {strings} from './constants';

const INTERACTION_EVENTS = ['click', 'keydown'];

/**
 * @extends {MDCComponent<!MDCChipFoundation>}
 * @final
 */
class MDCChip extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @type {string} */
    this.id;
    /** @private {?Element} */
    this.leadingIcon_;
    /** @private {?Element} */
    this.trailingIcon_;
    /** @private {!MDCRipple} */
    this.ripple_;

    /** @private {?function(?Event): undefined} */
    this.handleInteraction_;
    /** @private {?function(!Event): undefined} */
    this.handleTransitionEnd_;
    /** @private {function(!Event): undefined} */
    this.handleTrailingIconInteraction_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCChip}
   */
  static attachTo(root) {
    return new MDCChip(root);
  }

  initialize(
    rippleFactory = (el, foundation) => new MDCRipple(el, foundation)) {
    this.id = this.root_.id;
    this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    this.trailingIcon_ = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);

    // Adjust ripple size for chips with animated growing width. This applies when filter chips without
    // a leading icon are selected, and a leading checkmark will cause the chip width to expand.
    const checkmarkEl = this.root_.querySelector(strings.CHECKMARK_SELECTOR);
    if (checkmarkEl && !this.leadingIcon_) {
      const adapter = Object.assign(MDCRipple.createAdapter(this), {
        computeBoundingRect: () => {
          const height = this.root_.getBoundingClientRect().height;
          // The checkmark's width is initially set to 0, so use the checkmark's height as a proxy since the
          // checkmark should always be square.
          const width = this.root_.getBoundingClientRect().width + checkmarkEl.getBoundingClientRect().height;
          return {height, width};
        },
      });
      this.ripple_ = rippleFactory(this.root_, new MDCRippleFoundation(adapter));
    } else {
      this.ripple_ = rippleFactory(this.root_);
    }
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = (evt) => this.foundation_.handleInteraction(evt);
    this.handleTransitionEnd_ = (evt) => this.foundation_.handleTransitionEnd(evt);
    this.handleTrailingIconInteraction_ = (evt) => this.foundation_.handleTrailingIconInteraction(evt);

    INTERACTION_EVENTS.forEach((evtType) => {
      this.root_.addEventListener(evtType, this.handleInteraction_);
    });
    this.root_.addEventListener('transitionend', this.handleTransitionEnd_);

    if (this.trailingIcon_) {
      INTERACTION_EVENTS.forEach((evtType) => {
        this.trailingIcon_.addEventListener(evtType, this.handleTrailingIconInteraction_);
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
        this.trailingIcon_.removeEventListener(evtType, this.handleTrailingIconInteraction_);
      });
    }

    super.destroy();
  }

  /**
   * Returns whether the chip is selected.
   * @return {boolean}
   */
  get selected() {
    return this.foundation_.isSelected();
  }

  /**
   * Sets selected state on the chip.
   * @param {boolean} selected
   */
  set selected(selected) {
    this.foundation_.setSelected(selected);
  }

  /**
   * Returns whether a trailing icon click should trigger exit/removal of the chip.
   * @return {boolean}
   */
  get shouldRemoveOnTrailingIconClick() {
    return this.foundation_.getShouldRemoveOnTrailingIconClick();
  }

  /**
   * Sets whether a trailing icon click should trigger exit/removal of the chip.
   * @param {boolean} shouldRemove
   */
  set shouldRemoveOnTrailingIconClick(shouldRemove) {
    this.foundation_.setShouldRemoveOnTrailingIconClick(shouldRemove);
  }

  /**
   * Begins the exit animation which leads to removal of the chip.
   */
  beginExit() {
    this.foundation_.beginExit();
  }

  /**
   * @return {!MDCChipFoundation}
   */
  getDefaultFoundation() {
    return new MDCChipFoundation(/** @type {!MDCChipAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      addClassToLeadingIcon: (className) => {
        if (this.leadingIcon_) {
          this.leadingIcon_.classList.add(className);
        }
      },
      removeClassFromLeadingIcon: (className) => {
        if (this.leadingIcon_) {
          this.leadingIcon_.classList.remove(className);
        }
      },
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      notifyInteraction: () => this.emit(strings.INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      notifySelection: (selected) => this.emit(
        strings.SELECTION_EVENT, {chipId: this.id, selected: selected}, true /* shouldBubble */),
      notifyTrailingIconInteraction: () => this.emit(
        strings.TRAILING_ICON_INTERACTION_EVENT, {chipId: this.id}, true /* shouldBubble */),
      notifyRemoval: () =>
        this.emit(strings.REMOVAL_EVENT, {chipId: this.id, root: this.root_}, true /* shouldBubble */),
      getComputedStyleValue: (propertyName) => window.getComputedStyle(this.root_).getPropertyValue(propertyName),
      setStyleProperty: (propertyName, value) => this.root_.style.setProperty(propertyName, value),
    })));
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }
}

export {MDCChip, MDCChipFoundation};
