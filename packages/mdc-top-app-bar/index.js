/**
 *  @license
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

import MDCTopAppBarAdapter from './adapter';
import MDCTopAppBarFoundation from './foundation';
import {MDCComponent} from '@material/base/index';
import {MDCRipple} from '@material/ripple/index';
import {strings} from './constants';

/**
 * @extends {MDCComponent<!MDCTopAppBarFoundation>}
 * @final
 */
class MDCTopAppBar extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.navIcon_;
    /** @type {?Array<MDCRipple>} */
    this.iconRipples_;
    /** @private {function(!Event)} */
    this.navIconClick_;
  }

  initialize() {
    this.navIcon_ = this.root_.querySelector(strings.MENU_ICON_SELECTOR);
    this.navIconClick_ = this.navigationEvent_.bind(this);

    if (this.navIcon_) {
      this.navIcon_.addEventListener('click', this.navIconClick_);
    }

    // Get all icons in the toolbar and instantiate the ripples
    const icons = [].slice.call(this.root_.querySelectorAll(strings.ACTION_ICON_SELECTOR));
    icons.push(this.navIcon_);

    this.iconRipples_ = icons.map(function(icon) {
      const ripple = MDCRipple.attachTo(icon);
      ripple.unbounded = true;
      return ripple;
    });
  }

  destroy() {
    if (this.navIcon_) {
      this.navIcon_.removeEventListener('click', this.navIconClick_);
    }

    this.iconRipples_.forEach(function(iconRipple) {
      iconRipple.destroy();
    });
  }

  /**
   * @param {!Event} event
   * @private
   */
  navigationEvent_(event) {
    this.emit(strings.NAVIGATION_EVENT, event);
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
      /** @type {!MDCTopAppBarAdapter} */ (Object.assign({
        hasClass: (className) => this.root_.classList.contains(className),
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
      })
      )
    );
  }
}

export {MDCTopAppBar, MDCTopAppBarFoundation};
