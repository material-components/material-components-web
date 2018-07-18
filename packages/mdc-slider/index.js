/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCComponent from '@material/base/component';

import {MDCRipple} from '@material/ripple/index';
import {strings} from './constants';
import MDCSliderAdapter from './adapter';
import MDCSliderFoundation from './foundation';

/**
 * @extends MDCComponent<!MDCSliderFoundation>
 */
class MDCSlider extends MDCComponent {
  static attachTo(root) {
    return new MDCSlider(root);
  }

  constructor(...args) {
    super(...args);
    /** @type {?Element} */
    this.thumb_;
    /** @type {?Element} */
    this.trackFill_;
    /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();
  }

  /** @return {number} */
  get value() {
    return this.foundation_.getValue();
  }

  /** @param {number} value */
  set value(value) {
    this.foundation_.setValue(value);
  }

  /** @return {number} */
  get min() {
    return this.foundation_.getMin();
  }

  /** @param {number} min */
  set min(min) {
    this.foundation_.setMin(min);
  }

  /** @return {number} */
  get max() {
    return this.foundation_.getMax();
  }

  /** @param {number} max */
  set max(max) {
    this.foundation_.setMax(max);
  }

  /** @return {number} */
  get step() {
    return this.foundation_.getStep();
  }

  /** @param {number} step */
  set step(step) {
    this.foundation_.setStep(step);
  }

  /**
   * @return {!MDCRipple}
   * @private
   */
  initRipple_() {
    const ripple = new MDCRipple(this.root_.querySelector(strings.THUMB_SELECTOR));
    ripple.unbounded = true;
    return ripple;
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  initialize() {
    this.thumb_ = this.root_.querySelector(strings.THUMB_SELECTOR);
    this.trackFill_ = this.root_.querySelector(strings.TRACK_FILL_SELECTOR);
  }

  /**
   * @return {!MDCSliderFoundation}
   */
  getDefaultFoundation() {
    return new MDCSliderFoundation(
      /** @type {!MDCSliderAdapter} */ ({
        hasClass: (className) => this.root_.classList.contains(className),
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        setThumbAttribute: (name, value) => this.thumb_.setAttribute(name, value),
        computeBoundingRect: () => this.root_.getBoundingClientRect(),
        eventTargetHasClass: (target, className) => target.classList.contains(className),
        registerEventHandler: (type, handler) => {
          this.root_.addEventListener(type, handler);
        },
        deregisterEventHandler: (type, handler) => {
          this.root_.removeEventListener(type, handler);
        },
        registerThumbEventHandler: (type, handler) => {
          this.thumb_.addEventListener(type, handler);
        },
        deregisterThumbEventHandler: (type, handler) => {
          this.thumb_.removeEventListener(type, handler);
        },
        registerBodyEventHandler: (type, handler) => {
          document.body.addEventListener(type, handler);
        },
        deregisterBodyEventHandler: (type, handler) => {
          document.body.removeEventListener(type, handler);
        },
        registerWindowResizeHandler: (handler) => {
          window.addEventListener('resize', handler);
        },
        deregisterWindowResizeHandler: (handler) => {
          window.removeEventListener('resize', handler);
        },
        notifyInput: () => {
          this.emit(strings.INPUT_EVENT, this);
        },
        notifyChange: () => {
          this.emit(strings.CHANGE_EVENT, this);
        },
        setThumbStyleProperty: (propertyName, value) => {
          this.thumb_.style.setProperty(propertyName, value);
        },
        setTrackFillStyleProperty: (propertyName, value) => {
          this.trackFill_.style.setProperty(propertyName, value);
        },
        focusThumb: () => {
          this.thumb_.focus();
        },
        activateRipple: () => {
          this.ripple_.activate();
        },
        deactivateRipple: () => {
          this.ripple_.deactivate();
        },
      })
    );
  }

  initialSyncWithDOM() {
    const origValueNow = parseFloat(this.thumb_.getAttribute(strings.ARIA_VALUENOW));
    this.min = parseFloat(this.thumb_.getAttribute(strings.ARIA_VALUEMIN)) || this.min;
    this.max = parseFloat(this.thumb_.getAttribute(strings.ARIA_VALUEMAX)) || this.max;
    this.step = parseFloat(this.thumb_.getAttribute(strings.DATA_STEP)) || this.step;
    this.value = origValueNow || this.value;
  }

  layout() {
    this.foundation_.layout();
  }
}

export {MDCSliderFoundation, MDCSlider};
