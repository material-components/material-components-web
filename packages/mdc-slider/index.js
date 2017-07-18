/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {strings} from './constants';
import MDCSliderFoundation from './foundation';

export {MDCSliderFoundation};

export class MDCSlider extends MDCComponent {
  static attachTo(root) {
    return new MDCSlider(root);
  }

  get value() {
    return this.foundation_.getValue();
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  get min() {
    return this.foundation_.getMin();
  }

  set min(min) {
    this.foundation_.setMin(min);
  }

  get max() {
    return this.foundation_.getMax();
  }

  set max(max) {
    this.foundation_.setMax(max);
  }

  get step() {
    return this.foundation_.getStep();
  }

  set step(step) {
    this.foundation_.setStep(step);
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  initialize() {
    this.thumbContainer_ = this.root_.querySelector(strings.THUMB_CONTAINER_SELECTOR);
    this.track_ = this.root_.querySelector(strings.TRACK_SELECTOR);
    this.pinValueMarker_ = this.root_.querySelector(strings.PIN_VALUE_MARKER_SELECTOR);
    this.trackMarkerContainer_ = this.root_.querySelector(strings.TRACK_MARKER_CONTAINER_SELECTOR);
  }

  getDefaultFoundation() {
    return new MDCSliderFoundation({
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
    });
  }

  initialSyncWithDOM() {
    const origValueNow = parseFloat(this.root_.getAttribute(strings.ARIA_VALUENOW));
    this.min = parseFloat(this.root_.getAttribute(strings.ARIA_VALUEMIN)) || this.min;
    this.max = parseFloat(this.root_.getAttribute(strings.ARIA_VALUEMAX)) || this.max;
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

  stepUp(amount = (this.step || 1)) {
    this.value += amount;
  }

  stepDown(amount = (this.step || 1)) {
    this.value -= amount;
  }
}
