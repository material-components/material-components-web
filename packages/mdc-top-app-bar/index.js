/**
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

import MDCTopAppBarFoundation from './foundation';
import {MDCComponent} from '@material/base/index';
import {strings} from './constants';


/**
 * @extends {MDCComponent<!MDCTopAppBar>}
 * @final
 */
export class MDCTopAppBar extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.navIcon_;
  }

  initialize() {
    this.navIcon_ = this.root_.querySelector(strings.MENU_ICON_SELECTOR);
    this.navIconClick_ = this.navigationEvent_.bind(this);

    if (this.navIcon_) {
      this.navIcon_.addEventListener('click', this.navIconClick_);
    }
  }

  destroy() {
    if (this.navIcon_) {
      this.navIcon_.removeEventListener('click', this.navIconClick_);
    }
  }

  navigationEvent_() {
    this.emit(strings.NAVIGATION_EVENT);
  }

  /**
   * @param {!Element} root
   * @return {!MDCTopAppBar}
   */
  static attachTo(root) {
    return new MDCTopAppBar(root);
  }

  /**
   * @return {!MDCTopAppBarFoundation}
   */
  getDefaultFoundation() {
    return new MDCTopAppBarFoundation(
      /** @type {!MDCTopAppBar} */ {
        hasClass: (className) => this.root_.classList.contains(className),
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
      });
  }
}

export {MDCTopAppBarFoundation};
