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
    this.leadingIcon_ = this.root_.querySelector(strings.LEADING_ICON_SELECTOR);
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

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  /**
   * Toggles selected state of the chip.
   */
  toggleSelected() {
    this.foundation_.toggleSelected();
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
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      registerTrailingIconInteractionHandler: (evtType, handler) => {
        const trailingIconEl = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);
        if (trailingIconEl) {
          trailingIconEl.addEventListener(evtType, handler);
        }
      },
      deregisterTrailingIconInteractionHandler: (evtType, handler) => {
        const trailingIconEl = this.root_.querySelector(strings.TRAILING_ICON_SELECTOR);
        if (trailingIconEl) {
          trailingIconEl.removeEventListener(evtType, handler);
        }
      },
      notifyInteraction: () => this.emit(strings.INTERACTION_EVENT, {chip: this}, true /* shouldBubble */),
      notifyTrailingIconInteraction: () => this.emit(
        strings.TRAILING_ICON_INTERACTION_EVENT, {chip: this}, true /* shouldBubble */),
    })));
  }

  /** @return {!MDCRipple} */
  get ripple() {
    return this.ripple_;
  }
}

export {MDCChip, MDCChipFoundation};
