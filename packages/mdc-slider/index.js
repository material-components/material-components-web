/**
 * @license
 * Copyright 2017 Google Inc.
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
    this.thumbContainer_;
    /** @type {?Element} */
    this.track_;
    /** @type {?Element} */
    this.pinValueMarker_;
    /** @type {?Element} */
    this.trackMarkerContainer_;
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

  /** @return {boolean} */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /** @param {boolean} disabled */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  initialize() {
    this.thumbContainer_ = this.root_.querySelector(strings.THUMB_CONTAINER_SELECTOR);
    this.track_ = this.root_.querySelector(strings.TRACK_SELECTOR);
    this.pinValueMarker_ = this.root_.querySelector(strings.PIN_VALUE_MARKER_SELECTOR);
    this.trackMarkerContainer_ = this.root_.querySelector(strings.TRACK_MARKER_CONTAINER_SELECTOR);
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
        getAttribute: (name) => this.root_.getAttribute(name),
        setAttribute: (name, value) => this.root_.setAttribute(name, value),
        removeAttribute: (name) => this.root_.removeAttribute(name),
        computeBoundingRect: () => this.root_.getBoundingClientRect(),
        getTabIndex: () => this.root_.tabIndex,
        registerInteractionHandler: (type, handler) => {
          this.root_.addEventListener(type, handler);
        },
        deregisterInteractionHandler: (type, handler) => {
          this.root_.removeEventListener(type, handler);
        },
        registerThumbContainerInteractionHandler: (type, handler) => {
          this.thumbContainer_.addEventListener(type, handler);
        },
        deregisterThumbContainerInteractionHandler: (type, handler) => {
          this.thumbContainer_.removeEventListener(type, handler);
        },
        registerBodyInteractionHandler: (type, handler) => {
          document.body.addEventListener(type, handler);
        },
        deregisterBodyInteractionHandler: (type, handler) => {
          document.body.removeEventListener(type, handler);
        },
        registerResizeHandler: (handler) => {
          window.addEventListener('resize', handler);
        },
        deregisterResizeHandler: (handler) => {
          window.removeEventListener('resize', handler);
        },
        notifyInput: () => {
          this.emit(strings.INPUT_EVENT, this);
        },
        notifyChange: () => {
          this.emit(strings.CHANGE_EVENT, this);
        },
        setThumbContainerStyleProperty: (propertyName, value) => {
          this.thumbContainer_.style.setProperty(propertyName, value);
        },
        setTrackStyleProperty: (propertyName, value) => {
          this.track_.style.setProperty(propertyName, value);
        },
        setMarkerValue: (value) => {
          this.pinValueMarker_.innerText = value;
        },
        appendTrackMarkers: (numMarkers) => {
          const frag = document.createDocumentFragment();
          for (let i = 0; i < numMarkers; i++) {
            const marker = document.createElement('div');
            marker.classList.add('mdc-slider__track-marker');
            frag.appendChild(marker);
          }
          this.trackMarkerContainer_.appendChild(frag);
        },
        removeTrackMarkers: () => {
          while (this.trackMarkerContainer_.firstChild) {
            this.trackMarkerContainer_.removeChild(this.trackMarkerContainer_.firstChild);
          }
        },
        setLastTrackMarkersStyleProperty: (propertyName, value) => {
          // We remove and append new nodes, thus, the last track marker must be dynamically found.
          const lastTrackMarker = this.root_.querySelector(strings.LAST_TRACK_MARKER_SELECTOR);
          lastTrackMarker.style.setProperty(propertyName, value);
        },
        isRTL: () => getComputedStyle(this.root_).direction === 'rtl',
      })
    );
  }

  initialSyncWithDOM() {
    const origValueNow = parseFloat(this.root_.getAttribute(strings.ARIA_VALUENOW));
    const min = parseFloat(this.root_.getAttribute(strings.ARIA_VALUEMIN)) || this.min;
    const max = parseFloat(this.root_.getAttribute(strings.ARIA_VALUEMAX)) || this.max;

    // min and max need to be set in the right order to avoid throwing an error
    // when the new min is greater than the default max.
    if (min >= this.max) {
      this.max = max;
      this.min = min;
    } else {
      this.min = min;
      this.max = max;
    }

    this.step = parseFloat(this.root_.getAttribute(strings.STEP_DATA_ATTR)) || this.step;
    this.value = origValueNow || this.value;
    this.disabled = (
      this.root_.hasAttribute(strings.ARIA_DISABLED) &&
      this.root_.getAttribute(strings.ARIA_DISABLED) !== 'false'
    );
    this.foundation_.setupTrackMarker();
  }

  layout() {
    this.foundation_.layout();
  }

  /** @param {number=} amount */
  stepUp(amount = (this.step || 1)) {
    this.value += amount;
  }

  /** @param {number=} amount */
  stepDown(amount = (this.step || 1)) {
    this.value -= amount;
  }
}

export {MDCSliderFoundation, MDCSlider};
