/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {MDCComponent} from '@material/base/index';
import MDCDismissibleDrawerFoundation from './dismissible/foundation';
import {strings} from './constants';

/**
 * @extends {MDCComponent<!MDCDismissibleDrawerFoundation>}
 * @final
 */
export class MDCDrawer extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @private {?Function} */
    this.handleKeydown_;

    /** @private {?Function} */
    this.handleTransitionEnd_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCDrawer}
   */
  static attachTo(root) {
    return new MDCDrawer(root);
  }

  /**
   * Returns true if drawer is in the open position.
   * @return {boolean}
   */
  get open() {
    return this.foundation_.isOpen();
  }

  /**
   * Toggles the drawer open and closed.
   * @param {boolean} isOpen
   */
  set open(isOpen) {
    if (isOpen) {
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  initialSyncWithDOM() {
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleTransitionEnd_ = (evt) => this.foundation_.handleTransitionEnd(evt);

    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  getDefaultFoundation() {
    /** @type {!MDCDrawerAdapter} */
    const adapter = /** @type {!MDCDrawerAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      eventTargetHasClass: (targetElement, className) => targetElement.classList.contains(className),
      notifyClose: () => this.emit(strings.CLOSE_EVENT, null, true /* shouldBubble */),
      notifyOpen: () => this.emit(strings.OPEN_EVENT, null, true /* shouldBubble */),
    }));

    const {DISMISSIBLE} = MDCDismissibleDrawerFoundation.cssClasses;
    if (this.root_.classList.contains(DISMISSIBLE)) {
      return new MDCDismissibleDrawerFoundation(adapter);
    }
  }
}
