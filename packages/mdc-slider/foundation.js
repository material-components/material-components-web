/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
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

import {strings} from './constants';
import MDCSliderAdapter from './adapter';

import MDCFoundation from '@material/base/foundation';

/**
 * @extends {MDCFoundation<!MDCSliderAdapter>}
 */
class MDCSliderFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return {!MDCSliderAdapter} */
  static get defaultAdapter() {
    return /** @type {!MDCSliderAdapter} */ ({
      hasClass: () => {},
      addClass: () => {},
      removeClass: () => {},
      getAttribute: () => {},
      setAttribute: () => {},
      computeBoundingRect: () => {},
      notifyInput: () => {},
      notifyChange: () => {},
      setThumbStyleProperty: () => {},
      setTrackFillStyleProperty: () => {},
    });
  }

  /**
   * Creates a new instance of MDCSliderFoundation
   * @param {?MDCSliderAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSliderFoundation.defaultAdapter, adapter));
    /** @private {?ClientRect} */
    this.rect_ = null;
    /** @private {number} */
    this.min_ = 0;
    /** @private {number} */
    this.max_ = 100;
    /** @private {number} */
    this.value_ = 0;
    /** @private {string} */
    this.acceptableMoveEvent_ = '';
    /** @private {string} */
    this.acceptableEndEvent_ = '';
  }

  init() {
    this.layout();
  }

  layout() {
    this.rect_ = this.adapter_.computeBoundingRect();
    this.updateUIForCurrentValue_();
  }

  /** @return {number} */
  getValue() {
    return this.value_;
  }

  /** @param {number} value */
  setValue(value) {
    this.setValue_(value);
  }

  /** @return {number} */
  getMax() {
    return this.max_;
  }

  /** @param {number} max */
  setMax(max) {
    if (max < this.min_) {
      return;
    }
    this.max_ = max;
    this.setValue_(this.value_);
    this.adapter_.setAttribute(strings.ARIA_VALUEMAX, String(this.max_));
  }

  /** @return {number} */
  getMin() {
    return this.min_;
  }

  /** @param {number} min */
  setMin(min) {
    if (min > this.max_) {
      return;
    }
    this.min_ = min;
    this.setValue_(this.value_);
    this.adapter_.setAttribute(strings.ARIA_VALUEMIN, String(this.min_));
  }

  /**
   * Called when the user starts interacting with the slider
   * @param {!Event} evt
   */
  handleInteractionStart(evt) {
    if (!this.acceptableMoveEvent_) {
      this.assignMoveEndEvents_(evt.type);
    }
    this.setValueFromEvt_(evt);
  }

  /**
   * Called when the user moves the slider
   * @param {!Event} evt
   */
  handleInteractionMove(evt) {
    if (evt.type == this.acceptableMoveEvent_) {
      evt.preventDefault();
      this.setValueFromEvt_(evt);
    }
  }

  /**
   * Called when the user's interaction with the slider ends
   * @param {!Event} evt
   */
  handleInteractionEnd(evt) {
    if (evt.type == this.acceptableEndEvent_) {
      this.assignMoveEndEvents_('reset');
      this.adapter_.notifyChange();
    }
  }

  /**
   * Assigns acceptable move and end events
   * @param {string} evtName
   */
  assignMoveEndEvents_(evtName) {
    switch (evtName) {
    case strings.MOUSE_DOWN:
      this.acceptableMoveEvent_ = strings.MOUSE_MOVE;
      this.acceptableEndEvent_ = strings.MOUSE_UP;
      return;
    case strings.POINTER_DOWN:
      this.acceptableMoveEvent_ = strings.POINTER_MOVE;
      this.acceptableEndEvent_ = strings.POINTER_UP;
      return;
    case strings.TOUCH_START:
      this.acceptableMoveEvent_ = strings.TOUCH_MOVE;
      this.acceptableEndEvent_ = strings.TOUCH_END;
      return;
    case 'reset':
      this.acceptableMoveEvent_ = '';
      this.acceptableEndEvent_ = '';
      return;
    default:
      return;
    }
  }

  /**
   * Returns the pageX of the event
   * @param {!Event} evt
   * @return {number}
   * @private
   */
  getPageX_(evt) {
    if (evt.targetTouches && evt.targetTouches.length > 0) {
      return evt.targetTouches[0].pageX;
    }
    return evt.pageX;
  }

  /**
   * Sets the slider value from an event
   * @param {!Event} evt
   * @private
   */
  setValueFromEvt_(evt) {
    const pageX = this.getPageX_(evt);
    const value = this.computeValueFromPageX_(pageX);
    this.setValue_(value);
  }

  /**
   * Computes the new value from the pageX position
   * @param {number} pageX
   * @return {number}
   */
  computeValueFromPageX_(pageX) {
    const xPos = pageX - this.rect_.left;
    const pctComplete = xPos / this.rect_.width;

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    return this.min_ + pctComplete * (this.max_ - this.min_);
  }

  /**
   * Sets the value of the slider
   * @param {number} value
   */
  setValue_(value) {
    if (value < this.min_) {
      value = this.min_;
    } else if (value > this.max_) {
      value = this.max_;
    }
    this.value_ = value;
    this.adapter_.setAttribute(strings.ARIA_VALUENOW, String(this.value_));
    this.updateUIForCurrentValue_();
    this.adapter_.notifyInput();
  }

  /**
   * Updates the track-fill and thumb style properties to reflect current value
   */
  updateUIForCurrentValue_() {
    const pctComplete = (this.value_ - this.min_) / (this.max_ - this.min_);
    const translatePx = pctComplete * this.rect_.width;

    requestAnimationFrame(() => {
      this.adapter_.setThumbStyleProperty('transform', `translateX(${translatePx}px) translateX(-50%)`);
      this.adapter_.setTrackFillStyleProperty('transform', `scaleX(${translatePx})`);
    });
  }
}

export default MDCSliderFoundation;
