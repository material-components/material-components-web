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

    /** @private {?Element} */
    this.appContent_;
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

  initialize() {
    const appContent = this.root_.parentElement.querySelector(
      MDCDismissibleDrawerFoundation.strings.APP_CONTENT_SELECTOR);
    if (appContent) {
      this.appContent_= appContent;
    }
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
    document.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  initialSyncWithDOM() {
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_);
    this.handleTransitionEnd_ = this.foundation_.handleTransitionEnd.bind(this.foundation_);
    document.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  getDefaultFoundation() {
    /** @type {!MDCDrawerAdapter} */
    const adapter = /** @type {!MDCDrawerAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setStyleAppContent: (propertyName, value) => {
        if (this.appContent_) {
          return this.appContent_.style.setProperty(propertyName, value);
        }
      },
      computeBoundingRect: () => this.root_.getBoundingClientRect(),
      addClassAppContent: (className) => {
        if (this.appContent_) {
          this.appContent_.classList.add(className);
        }
      },
      removeClassAppContent: (className) => {
        if (this.appContent_) {
          this.appContent_.classList.remove(className);
        }
      },
      isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
    }));

    if (this.root_.classList.contains(MDCDismissibleDrawerFoundation.cssClasses.DISMISSIBLE)) {
      return new MDCDismissibleDrawerFoundation(adapter);
    }
  }
}
