/**
 * @license
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
import MDCSliderAdapter from './adapter';
import MDCSliderFoundation from './foundation';

const DOWN_EVENTS = [strings.MOUSE_DOWN, strings.POINTER_DOWN, strings.TOUCH_START];
const MOVE_EVENTS = [strings.MOUSE_MOVE, strings.POINTER_MOVE, strings.TOUCH_MOVE];
const END_EVENTS = [strings.MOUSE_UP, strings.POINTER_UP, strings.TOUCH_END];

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
    /** @private {!Function} */
    this.startHandler_;
    /** @private {!Function} */
    this.moveHandler_;
    /** @private {!Function} */
    this.endHandler_;
    /** @private {!Function} */
    this.layoutHandler_;
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
        getAttribute: (name) => this.root_.getAttribute(name),
        setAttribute: (name, value) => this.root_.setAttribute(name, value),
        computeBoundingRect: () => this.root_.getBoundingClientRect(),
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
      })
    );
  }

  initialSyncWithDOM() {
    const origValueNow = parseFloat(this.root_.getAttribute(strings.ARIA_VALUENOW));
    this.min = parseFloat(this.root_.getAttribute(strings.ARIA_VALUEMIN)) || this.min;
    this.max = parseFloat(this.root_.getAttribute(strings.ARIA_VALUEMAX)) || this.max;
    this.value = origValueNow || this.value;

    this.startHandler_ = this.foundation_.handleInteractionStart.bind(this.foundation_);
    this.moveHandler_ = this.foundation_.handleInteractionMove.bind(this.foundation_);
    this.endHandler_ = this.foundation_.handleInteractionEnd.bind(this.foundation_);
    this.layoutHandler_ = this.foundation_.layout.bind(this.foundation_);
    DOWN_EVENTS.forEach((evtName) => this.root_.addEventListener(evtName, this.startHandler_));
    MOVE_EVENTS.forEach((evtName) => document.body.addEventListener(evtName, this.moveHandler_));
    END_EVENTS.forEach((evtName) => document.body.addEventListener(evtName, this.endHandler_));
    window.addEventListener('resize', this.layoutHandler_);
  }

  destroy() {
    DOWN_EVENTS.forEach((evtName) => this.root_.removeEventListener(evtName, this.startHandler_));
    MOVE_EVENTS.forEach((evtName) => document.body.removeEventListener(evtName, this.moveHandler_));
    END_EVENTS.forEach((evtName) => document.body.removeEventListener(evtName, this.endHandler_));
    window.addEventListener('resize', this.layoutHandler_);
  }

  layout() {
    this.foundation_.layout();
  }
}

export {MDCSliderFoundation, MDCSlider};
