/**
 * @license
 * Copyright 2018 Google Inc.
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

/* eslint-disable no-unused-vars */
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
import {MDCTabIndicator, MDCTabIndicatorFoundation} from '@material/tab-indicator/index';
import {MDCTabAdapter, MDCTabDimensions, MDCTabInteractionEventType} from './adapter';
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

    /** @type {string} */
    this.id;
    /** @private {?MDCRipple} */
    this.ripple_;
    /** @private {?MDCTabIndicator} */
    this.tabIndicator_;
    /** @private {?Element} */
    this.content_;

    /** @private {?Function} */
    this.handleClick_;
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
    this.id = this.root_.id;
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

  initialSyncWithDOM() {
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_);
    this.listen('click', this.handleClick_);
  }

  destroy() {
    this.unlisten('click', /** @type {!Function} */ (this.handleClick_));
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
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        activateIndicator: (previousIndicatorClientRect) => this.tabIndicator_.activate(previousIndicatorClientRect),
        deactivateIndicator: () => this.tabIndicator_.deactivate(),
        notifyInteracted: () => this.emit(
          MDCTabFoundation.strings.INTERACTED_EVENT, {tabId: this.id}, true /* bubble */),
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

  set focusOnActivate(focusOnActivate) {
    this.foundation_.setFocusOnActivate(focusOnActivate);
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
    return this.tabIndicator_.computeContentClientRect();
  }

  /**
   * @return {!MDCTabDimensions}
   */
  computeDimensions() {
    return this.foundation_.computeDimensions();
  }

  /**
   * Focuses the tab
   */
  focus() {
    this.root_.focus();
  }
}

export {MDCTab, MDCTabFoundation};
