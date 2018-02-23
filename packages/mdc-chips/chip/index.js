/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import MDCComponent from '@material/base/component';
import {MDCRipple} from '@material/ripple/index';

import MDCChipAdapter from './adapter';
import MDCChipFoundation from './foundation';
import {strings} from './constants';

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

    /** @private {?Element} */
    this.leadingIcon_;
    /** @private {?Element} */
    this.filterIcon_;
    /** @private {!MDCRipple} */
    this.ripple_ = new MDCRipple(this.root_);
  }

  /**
   * @param {!Element} root
   * @return {!MDCChip}
   */
  static attachTo(root) {
    return new MDCChip(root);
  }

  initialize() {
    this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
    this.filterIcon_ = this.root_.querySelector(strings.FILTER_ICON_SELECTOR);
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  replaceLeadingIconWithFilterIcon() {
    this.foundation_.replaceLeadingIconWithFilterIcon();
    this.ripple_.layout();
  }

  replaceFilterIconWithLeadingIcon() {
    this.foundation_.replaceFilterIconWithLeadingIcon();
    this.ripple_.layout();
  }

  /**
   * Toggles active state of the chip.
   */
  toggleActive() {
    this.foundation_.toggleActive();
  }

  /**
   * @return {!MDCChipFoundation}
   */
  getDefaultFoundation() {
    return new MDCChipFoundation(/** @type {!MDCChipAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      registerInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      registerLeadingIconInteractionHandler: (evtType, handler) => this.leadingIcon_ ? this.leadingIcon_.addEventListener(evtType, handler) : null,
      deregisterLeadingIconInteractionHandler: (evtType, handler) => this.leadingIcon_ ? this.leadingIcon_.removeEventListener(evtType, handler) : null,
      registerFilterIconInteractionHandler: (evtType, handler) => this.filterIcon_ ? this.filterIcon_.addEventListener(evtType, handler) : null,
      deregisterFilterIconInteractionHandler: (evtType, handler) => this.filterIcon_ ? this.filterIcon_.removeEventListener(evtType, handler) : null,
      notifyInteraction: () => this.emit(strings.INTERACTION_EVENT, {chip: this}, true /* shouldBubble */),
      hasLeadingIcon: () => this.leadingIcon_,
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
      hasFilterIcon: () => this.filterIcon_,
      addClassToFilterIcon: (className) => {
        if (this.filterIcon_) {
          this.filterIcon_.classList.add(className);
        }
      },
      removeClassFromFilterIcon: (className) => {
        if (this.filterIcon_) {
          this.filterIcon_.classList.remove(className);
        }
      },
    })));
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }
}

export {MDCChip, MDCChipFoundation};
