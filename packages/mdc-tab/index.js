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

import MDCComponent from '@material/base/component';
import {MDCRipple, MDCRippleFoundation} from '@material/ripple/index';
import {MDCTabIndicator} from '@material/tab-indictor/index';

import {MDCTabAdapter, FoundationMapType} from './adapter';
import MDCTabFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTabFoundation>}
 * @final
 */
class MDCTab extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?MDCRipple} */
    this.ripple_;
    /** @private {?MDCTabIndicator} */
    this.tabIndicator_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTab}
   */
  static attachTo(root) {
    return new MDCTab(root);
  }

  /**
   * @param {(function(!Element): !MDCRipple)=} rippleFactory A function which creates a new MDCRipple.
   * @param {(function(!Element): !MDCTabIndicator)=} tabIndicatorFactory A function which creates
   * a new MDCTabIndicator.
   */
  initialize(
    rippleFactory = (el, foundation) => new MDCRipple(el, foundation),
    tabIndicatorFactory = (el) => new MDCTabIndicator(el)) {
    const rippleSurface = this.root_.querySelector(strings.RIPPLE_SELECTOR);
    const rippleAdapter = Object.assign(MDCRipple.createAdapter(/** @type {!RippleCapableSurface} */ (this)), {
      addClass: (className) => rippleSurface.classList.add(className),
      removeClass: (className) => rippleSurface.classList.remove(className),
      updateCssVariable: (varName, value) => rippleSurface.style.setProperty(varName, value),
    });
    const rippleFoundation = new MDCRippleFoundation(rippleAdapter);
    this.ripple_ = rippleFactory(this.root_, rippleFoundation);

    const tabIndicator = this.root_.querySelector(strings.TAB_INDICATOR_SELECTOR);
    if (tabIndicator) {
      this.tabIndicator_ = tabIndicatorFactory(tabIndicator);
    }
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  /**
   * @return {boolean}
   */
  get active() {
    return this.foundation_.isActive();
  }

  /**
   * @return {!MDCTabFoundation}
   */
  getDefaultFoundation() {
    return new MDCTabFoundation(/** @type {!MDCTabAdapter} */ (Object.assign({
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
    })));
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   * @return {!FoundationMapType}
   */
  getFoundationMap_() {
    return {
      tabIndicator: this.tabIndicator_ ? this.tabIndicator_.foundation : undefined,
    };
  }
}

export {MDCTab, MDCTabFoundation};
