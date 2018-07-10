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

import MDCComponent from '@material/base/component';
import MDCTooltipFoundation from './foundation';

/**
 * @extends MDCComponent<!MDCTooltipFoundation>
 */
class MDCTooltip extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** {Element} */
    this.controller_;

    /** @private {!Function} */
    this.handleTouchEnd_;
    /** @private {!Function} */
    this.handleBlur_;
    /** @private {!Function} */
    this.handleMouseLeave_;
    /** @private {!Function} */
    this.handleTouchStart_;
    /** @private {!Function} */
    this.handleFocus_;
    /** @private {!Function} */
    this.handleMouseEnter_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTooltip}
   */
  static attachTo(root) {
    return new MDCTooltip(root);
  }

  destroy() {
    this.controller_.removeEventListener('touchend', this.handleTouchEnd_);
    this.controller_.removeEventListener('blur', this.handleBlur_);
    this.controller_.removeEventListener('mouseleave', this.handleMouseLeave_);
    this.controller_.removeEventListener('touchstart', this.handleTouchStart_);
    this.controller_.removeEventListener('focus', this.handleFocus_);
    this.controller_.removeEventListener('mouseenter', this.handleMouseEnter_);
  }

  initialSyncWithDOM() {
    this.handleTouchEnd_ = this.foundation_.handleTouchEnd.bind(this.foundation_);
    this.handleBlur_ = this.foundation_.handleBlur.bind(this.foundation_);
    this.handleMouseLeave_ = this.foundation_.handleMouseLeave.bind(this.foundation_);
    this.handleTouchStart_ = this.foundation_.handleTouchStart.bind(this.foundation_);
    this.handleFocus_ = this.foundation_.handleFocus.bind(this.foundation_);
    this.handleMouseEnter_ = this.foundation_.handleMouseEnter.bind(this.foundation_);

    this.controller_.addEventListener('touchend', this.handleTouchEnd_);
    this.controller_.addEventListener('blur', this.handleBlur_);
    this.controller_.addEventListener('mouseleave', this.handleMouseLeave_);
    this.controller_.addEventListener('touchstart', this.handleTouchStart_);
    this.controller_.addEventListener('focus', this.handleFocus_);
    this.controller_.addEventListener('mouseenter', this.handleMouseEnter_);
  }

  /** @type {boolean} */
  get visible() {
    return this.foundation_.displayed_;
  }

  /** @type {number} */
  get hideDelay() {
    return this.foundation_.hideDelay;
  }

  /** @param {number} delay */
  set hideDelay(delay) {
    this.foundation_.hideDelay = delay;
  }

  /** @type {number} */
  get showDelay() {
    return this.foundation_.showDelay;
  }

  /** @param {number} delay */
  set showDelay(delay) {
    this.foundation_.showDelay = delay;
  }

  /** @type {number} */
  get gap() {
    return this.foundation_.gap;
  }

  /** @param {number} gap */
  set gap(gap) {
    this.foundation_.gap = gap;
  }

  show() {
    this.foundation_.show_();
  }

  hide() {
    this.foundation_.hide_();
  }

  initialize() {
    if (!this.root_.classList.contains('mdc-tooltip')) {
      this.root_ = this.root_.querySelector('.mdc-tooltip');
    }

    const controllerID = this.root_.getAttribute('for');
    if (controllerID === null) {
      this.controller_ = this.root_.parentElement;
    } else {
      this.controller_ = document.getElementById(controllerID);
      if (this.controller_ === null) {
        throw new ReferenceError('MDCTooltip: Control Element not found. Make sure "for" points to a valid ID');
      }
    }

    document.body.appendChild(this.root_)
  }

  /**
   * @param {!MDCTooltip} instance
   * @return {!MDCTooltipAdapter}
   */
  static createAdapter(instance) {
    return {
      addClass: (className) => instance.root_.classList.add(className),
      removeClass: (className) => instance.root_.classList.remove(className),
      getClassList: () => instance.root_.classList,
      getRootWidth: () => instance.root_.offsetWidth,
      getRootHeight: () => instance.root_.offsetHeight,
      getControllerWidth: () => instance.controller_.offsetWidth,
      getControllerHeight: () => instance.controller_.offsetHeight,
      getControllerBoundingRect: () => instance.controller_.getBoundingClientRect(),
      getWindowWidth: () => window.innerWidth,
      getWindowHeight: () => window.innerHeight,
      setStyle: (propertyName, value) => instance.root_.style.setProperty(propertyName, value),
    };
  }

  /** @return {!MDCTooltipFoundation} */
  getDefaultFoundation() {
    return new MDCTooltipFoundation(MDCTooltip.createAdapter(this));
  }
}

export {MDCTooltip, MDCTooltipFoundation};
