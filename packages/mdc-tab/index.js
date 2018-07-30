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
import {MDCTabIndicator, MDCTabIndicatorFoundation} from '@material/tab-indicator/index';
import {MDCTabAdapter, MDCTabDimensions} from './adapter';
/* eslint-enable no-unused-vars */

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
    /** @private {?Element} */
    this.content_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTab}
   */
  static attachTo(root) {
    return new MDCTab(root);
  }

  initialize(
    rippleFactory = (el, foundation) => new MDCRipple(el, foundation),
    tabIndicatorFactory = (el) => new MDCTabIndicator(el)) {
    const rippleSurface = this.root_.querySelector(MDCTabFoundation.strings.RIPPLE_SELECTOR);
    const rippleAdapter = Object.assign(MDCRipple.createAdapter(/** @type {!RippleCapableSurface} */ (this)), {
      addClass: (className) => rippleSurface.classList.add(className),
      removeClass: (className) => rippleSurface.classList.remove(className),
      updateCssVariable: (varName, value) => rippleSurface.style.setProperty(varName, value),
    });
    const rippleFoundation = new MDCRippleFoundation(rippleAdapter);
    this.ripple_ = rippleFactory(this.root_, rippleFoundation);

    const tabIndicatorElement = this.root_.querySelector(MDCTabFoundation.strings.TAB_INDICATOR_SELECTOR);
    this.tabIndicator_ = tabIndicatorFactory(tabIndicatorElement);

    this.content_ = this.root_.querySelector(MDCTabFoundation.strings.CONTENT_SELECTOR);
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  /**
   * @return {!MDCTabFoundation}
   */
  getDefaultFoundation() {
    return new MDCTabFoundation(
      /** @type {!MDCTabAdapter} */ ({
        setAttr: (attr, value) => this.root_.setAttribute(attr, value),
        registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
        deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        activateIndicator: (previousIndicatorClientRect) => this.tabIndicator_.activate(previousIndicatorClientRect),
        deactivateIndicator: () => this.tabIndicator_.deactivate(),
        computeIndicatorClientRect: () => this.tabIndicator_.computeContentClientRect(),
        notifyInteracted: () => this.emit(MDCTabFoundation.strings.INTERACTED_EVENT, {tab: this}, true /* bubble */),
        getOffsetLeft: () => this.root_.offsetLeft,
        getOffsetWidth: () => this.root_.offsetWidth,
        getContentOffsetLeft: () => this.content_.offsetLeft,
        getContentOffsetWidth: () => this.content_.offsetWidth,
        focus: () => this.root_.focus(),
      }));
  }

  /**
   * Getter for the active state of the tab
   * @return {boolean}
   */
  get active() {
    return this.foundation_.isActive();
  }

  /**
   * Activates the tab
   * @param {!ClientRect=} computeIndicatorClientRect
   */
  activate(computeIndicatorClientRect) {
    this.foundation_.activate(computeIndicatorClientRect);
  }

  /**
   * Deactivates the tab
   */
  deactivate() {
    this.foundation_.deactivate();
  }

  /**
   * Returns the indicator's client rect
   * @return {!ClientRect}
   */
  computeIndicatorClientRect() {
    return this.foundation_.computeIndicatorClientRect();
  }

  /**
   * @return {!MDCTabDimensions}
   */
  computeDimensions() {
    return this.foundation_.computeDimensions();
  }
}

export {MDCTab, MDCTabFoundation};
