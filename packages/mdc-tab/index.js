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
/* eslint-disable no-unused-vars */
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
/* eslint-enable no-unused-vars */

import MDCTabAdapter from './adapter';
import MDCTabFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTabFoundation>}
 * @final
 */
class MDCTab extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTab}
   */
  static attachTo(root) {
    return new MDCTab(root);
  }

  initialize() {
    /** @private {?Element} */
    this.indicator_ = this.root_.querySelector(MDCTabFoundation.strings.INDICATOR_SELECTOR);

    /** @private {?Element} */
    this.rippleSurface_ = this.root_.querySelector(MDCTabFoundation.strings.RIPPLE_SELECTOR);

    const rippleAdapter = Object.assign(MDCRipple.createAdapter(/** @type {!RippleCapableSurface} */ (this)), {
      addClass: (className) => this.rippleSurface_.classList.add(className),
      removeClass: (className) => this.rippleSurface_.classList.remove(className),
      updateCssVariable: (varName, value) => this.rippleSurface_.style.setProperty(varName, value),
    });

    const foundation = new MDCRippleFoundation(rippleAdapter);
    this.ripple_ = new MDCRipple(this.root_, foundation);
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
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
      registerIndicatorEventHandler: (evtType, handler) => this.indicator_.addEventListener(evtType, handler),
      deregisterIndicatorEventHandler: (evtType, handler) => this.indicator_.removeEventListener(evtType, handler),
      getIndicatorClientRect: () => this.indicator_.getBoundingClientRect(),
      setIndicatorStyleProperty: (prop, value) => this.indicator_.style.setProperty(prop, value),
      indicatorHasClass: (className) => this.indicator_.classList.contains(className),
    })));
  }

  /**
   * @return {boolean}
   */
  get active() {
    return this.foundation_.isActive();
  }

  /**
   * @param {boolean} isActive
   */
  set active(isActive) {
    if (isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  /**
   * @return {!ClientRect}
   */
  get indicatorClientRect() {
    return this.foundation_.getIndicatorClientRect();
  }

  /**
   * @param {ClientRect=} previousTabClientRect
   */
  activate(previousTabClientRect) {
    this.foundation_.activate(previousTabClientRect);
  }

  deactivate() {
    this.foundation_.deactivate();
  }
}

export {MDCTab, MDCTabFoundation, MDCTabRipple};
