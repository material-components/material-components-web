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

import {strings, cssClasses} from './constants';
import MDCSliderAdapter from './adapter';

import MDCFoundation from '@material/base/foundation';

/** @enum {string} */
const KEY_IDS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/** @enum {string} */
const MOVE_EVENT_MAP = {
  'mousedown': 'mousemove',
  'touchstart': 'touchmove',
  'pointerdown': 'pointermove',
};

const DOWN_EVENTS = ['mousedown', 'pointerdown', 'touchstart'];
const UP_EVENTS = ['mouseup', 'pointerup', 'touchend'];

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
      setValueLabelPath: () => {},
      setValueLabelText: () => {},
      computeBoundingRect: () => {},
      eventTargetHasClass: () => {},
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      registerThumbEventHandler: () => {},
      deregisterThumbEventHandler: () => {},
      registerBodyEventHandler: () => {},
      deregisterBodyEventHandler: () => {},
      registerWindowResizeHandler: () => {},
      deregisterWindowResizeHandler: () => {},
      notifyInput: () => {},
      notifyChange: () => {},
      setThumbStyleProperty: () => {},
      setTrackFillStyleProperty: () => {},
      focusThumb: () => {},
      activateRipple: () => {},
      deactivateRipple: () => {},
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
    /** @private {boolean} */
    this.active_ = false;
    /** @private {boolean} */
    this.inTransit_ = false;
    /** @private {boolean} */
    this.isDiscrete = false;
    /** @private {number} */
    this.min_ = 0;
    /** @private {number} */
    this.max_ = 100;
    /** @private {number} */
    this.value_ = 0;
    /** @private {number} */
    this.step_ = 0;
    /** @private {boolean} */
    this.handlingThumbTargetEvt_ = false;
    /** @private {function(): undefined} */
    this.thumbPointerHandler_ = () => this.handleThumbPointer();
    /** @private {function(!Event): undefined} */
    this.interactionStartHandler_ = (evt) => this.handleInteractionStart(evt);
    /** @private {function(!Event): undefined} */
    this.interactionMoveHandler_ = (evt) => this.handleInteractionMove(evt);
    /** @private {function(): undefined} */
    this.interactionEndHandler_ = () => this.handleInteractionEnd();
    /** @private {function(!Event): undefined} */
    this.keydownHandler_ = (evt) => this.handleKeydown(evt);
    /** @private {function(): undefined} */
    this.windowResizeHandler_ = () => this.layout();
  }

  init() {
    this.isDiscrete_ = this.adapter_.hasClass(cssClasses.IS_DISCRETE);
    DOWN_EVENTS.forEach((evtName) => this.adapter_.registerEventHandler(evtName, this.interactionStartHandler_));
    DOWN_EVENTS.forEach((evtName) => {
      this.adapter_.registerThumbEventHandler(evtName, this.thumbPointerHandler_);
    });
    this.adapter_.registerEventHandler('keydown', this.keydownHandler_);
    this.adapter_.registerEventHandler('keyup', this.interactionEndHandler_);
    this.adapter_.registerWindowResizeHandler(this.windowResizeHandler_);
    this.layout();
    // At last step, provide a reasonable default value to discrete slider
    if (this.isDiscrete_ && this.getStep() == 0) {
      this.step_ = 1;
    }
  }

  destroy() {
    DOWN_EVENTS.forEach((evtName) => {
      this.adapter_.deregisterEventHandler(evtName, this.interactionStartHandler_);
    });
    DOWN_EVENTS.forEach((evtName) => {
      this.adapter_.deregisterThumbEventHandler(evtName, this.thumbPointerHandler_);
    });
    this.adapter_.deregisterEventHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterEventHandler('keyup', this.interactionEndHandler_);
    this.adapter_.deregisterWindowResizeHandler(this.windowResizeHandler_);
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

  /** @return {number} */
  getStep() {
    return this.step_;
  }

  /** @param {number} step */
  setStep(step) {
    if (step < 0) {
      return;
    }
    this.step_ = step;
    this.setValue_(this.value_);
    this.adapter_.setAttribute(strings.DATA_STEP, String(this.step_));
  }

  /**
   * Called when the user starts interacting with the thumb
   */
  handleThumbPointer() {
    this.handlingThumbTargetEvt_ = true;
  }

  /**
   * Called when the user starts interacting with the slider
   * @param {!Event} evt
   */
  handleInteractionStart(evt) {
    this.setActive_(true);
    this.adapter_.activateRipple();

    this.setInTransit_(!this.handlingThumbTargetEvt_);
    this.handlingThumbTargetEvt_ = false;

    const moveHandler = (evt) => {
      this.interactionMoveHandler_(evt);
    };

    // Note: endHandler is [de]registered on ALL potential pointer-related release event types, since some browsers
    // do not always fire these consistently in pairs.
    // (See https://github.com/material-components/material-components-web/issues/1192)
    const endHandler = () => {
      this.interactionEndHandler_();
      this.adapter_.deregisterBodyEventHandler(MOVE_EVENT_MAP[evt.type], moveHandler);
      UP_EVENTS.forEach((evtName) => this.adapter_.deregisterBodyEventHandler(evtName, endHandler));
    };

    this.adapter_.registerBodyEventHandler(MOVE_EVENT_MAP[evt.type], moveHandler);
    UP_EVENTS.forEach((evtName) => this.adapter_.registerBodyEventHandler(evtName, endHandler));
    this.setValueFromEvt_(evt);
  }

  /**
   * Called when the user moves the slider
   * @param {!Event} evt
   */
  handleInteractionMove(evt) {
    evt.preventDefault();
    this.setValueFromEvt_(evt);
  }

  /**
   * Called when the user's interaction with the slider ends
   */
  handleInteractionEnd() {
    this.setActive_(false);
    this.adapter_.notifyChange();
    this.adapter_.deactivateRipple();
    this.adapter_.focusThumb();
  }

  /**
   * Handles keydown events
   * @param {!Event} evt
   */
  handleKeydown(evt) {
    const value = this.getKeyIdValue_(evt);
    if (isNaN(value)) {
      return;
    }

    this.setActive_(true);
    this.setInTransit_(!this.handlingThumbTargetEvt_);
    this.handlingThumbTargetEvt_ = false;

    // Prevent page from scrolling due to key presses that would normally scroll the page
    evt.preventDefault();
    this.setValue_(value);
    this.adapter_.notifyChange();
  }

  /**
   * Returns the computed name of the event
   * @param {!Event} kbdEvt
   * @return {number}
   * @private
   */
  getKeyIdValue_(kbdEvt) {
    const delta = this.step_ || (this.max_ - this.min_) / 100;

    if (kbdEvt.key === KEY_IDS.ARROW_LEFT || kbdEvt.keyCode === 37
      || kbdEvt.key === KEY_IDS.ARROW_DOWN || kbdEvt.keyCode === 40) {
      return this.value_ - delta;
    }
    if (kbdEvt.key === KEY_IDS.ARROW_RIGHT || kbdEvt.keyCode === 39
      || kbdEvt.key === KEY_IDS.ARROW_UP || kbdEvt.keyCode === 38) {
      return this.value_ + delta;
    }
    if (kbdEvt.key === KEY_IDS.HOME || kbdEvt.keyCode === 36) {
      return this.min_;
    }
    if (kbdEvt.key === KEY_IDS.END || kbdEvt.keyCode === 35) {
      return this.max_;
    }
    if (kbdEvt.key === KEY_IDS.PAGE_UP || kbdEvt.keyCode === 33) {
      return this.value_ + delta * 5;
    }
    if (kbdEvt.key === KEY_IDS.PAGE_DOWN || kbdEvt.keyCode === 34) {
      return this.value_ - delta * 5;
    }

    return NaN;
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
    const valueSetToBoundary = value === this.min_ || value === this.max_;
    if (this.isDiscrete_ && !valueSetToBoundary) {
      value = this.setDiscreteValue_(value);
    }
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
   * Calculates the discrete value
   * @param {number} value
   * @return {number}
   */
  setDiscreteValue_(value) {
    const numSteps = Math.round(value / this.step_);
    const discreteValue = numSteps * this.step_;
    return discreteValue;
  }

  /**
   * Calculates the value label path
   * @return {number}
   */
  calcPath_() {
    const topLobeRadius = 16;
    const topNeckRadius = 14;
    if (this.value_.toString().length <= 2) {
      var topLobeHorizontal = 0;
    } else {
      var topLobeHorizontal = (this.value_.toString().length - 2) * 8.98;
    }
    const extra = topLobeHorizontal - 30;
    if (extra > 0) {
      topLobeHorizontal = 30;
    }
    const topNeckTheta = Math.asin((15 - topLobeHorizontal)/(topLobeRadius+topNeckRadius));
    const topNeckCornerTheta = Math.acos((15 - topLobeHorizontal/2)/(topLobeRadius+topNeckRadius));
    const topNeckCornerCenterX = 31;
    const topNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) - Math.pow(15 - topLobeHorizontal/2, 2));

    const centersDifference = 40;
    const bottomLobeRadius = 6;
    const bottomNeckRadius = 4.5;
    const bottomNeckTheta = 5 * Math.PI / 18;
    const bottomNeckHeight = Math.sin(bottomNeckTheta) * (bottomLobeRadius+bottomNeckRadius);
    const offsetY = -39;
    const offsetX = 1;

    let pointA = {
      x: 17 + (topNeckRadius - (Math.cos(topNeckCornerTheta) * topNeckRadius)) + offsetX,
        y: 16 + (topNeckCornerCenterY - (Math.sin(topNeckCornerTheta) * topNeckRadius)) + offsetY
        };
    const pointB = {
      x: 17 + offsetX,
        y: 16 + topNeckCornerCenterY + offsetY
        };
    const pointC = {
      x: 17 + offsetX,
        y: 16 + centersDifference - bottomNeckHeight + offsetY
        };
    const pointD = {
      x: 17 + bottomNeckRadius - (Math.cos(bottomNeckTheta) * bottomNeckRadius) + 1 + offsetX,
        y: (16 + centersDifference - bottomNeckHeight) + (Math.sin(bottomNeckTheta) * bottomNeckRadius) + offsetY
        };
    const pointE = {
      x: 16 + offsetX,
        y: 62 + offsetY
        };
    const pointF = {
      x: 15 - bottomNeckRadius + (Math.cos(bottomNeckTheta) * bottomNeckRadius) - 1 + offsetX,
        y: (16 + centersDifference - bottomNeckHeight) + (Math.sin(bottomNeckTheta) * bottomNeckRadius) + offsetY
        };
    const pointG = {
      x: 15 + offsetX,
        y: 16 + centersDifference - bottomNeckHeight + offsetY
        };
    const pointH = {
      x: 15 + offsetX,
        y: 16 + topNeckCornerCenterY + offsetY
        };
    let pointI = {
      x: 15 - topNeckRadius + (Math.cos(topNeckCornerTheta) * topNeckRadius) + offsetX,
        y: 16 + (topNeckCornerCenterY - (Math.sin(topNeckCornerTheta) * topNeckRadius)) + offsetY
        };
      
      let start = {
        x: 16 + (topLobeHorizontal/2) + offsetX,
          y: 0 + offsetY
          };
      let end = {
        x: 16 - (topLobeHorizontal/2) + offsetX,
          y: 0 + offsetY
          };
    if (extra > 0) {
      start = {
      x: 16 + (topLobeHorizontal/2) + extra/4 + offsetX,
        y: 0 + offsetY
        };
      end = {
      x: 16 - (topLobeHorizontal/2) - (extra*3/4) + offsetX,
        y: 0 + offsetY
        };
      pointA.x = pointA.x + extra/4;
    } 
      
    let path = "M " + start.x + " " + start.y
          + " A " + topLobeRadius + " " + topLobeRadius + " 0 0 1 " + pointA.x + " " + pointA.y;
    if (extra > 0) {
      path = path + " L " + (pointA.x - extra/4) + " " + pointA.y;
    }
    path = path + " A " + topNeckRadius + " " + topNeckRadius + " 0 0 0 " + pointB.x + " " + pointB.y
                + " L " + pointC.x + " " + pointC.y
                + " A " + bottomNeckRadius + " " + bottomNeckRadius + " 0 0 0 " + pointD.x + " " + pointD.y
                + " A " + bottomLobeRadius + " " + bottomLobeRadius + " 0 0 1 " + pointE.x + " " + pointE.y
                + " A " + bottomLobeRadius + " " + bottomLobeRadius + " 0 0 1 " + pointF.x + " " + pointF.y
                + " A " + bottomNeckRadius + " " + bottomNeckRadius + " 0 0 0 " + pointG.x + " " + pointG.y
                + " L " + pointH.x + " " + pointH.y
                + " A " + topNeckRadius + " " + topNeckRadius + " 0 0 0 " + pointI.x + " " + pointI.y;
    if (extra > 0) {
      path = path + " L " + (pointI.x - (3 * extra/4)) + " " + pointI.y;
    }
    path = path + " A " + topLobeRadius + " " + topLobeRadius + " 0 0 1 " + end.x + " " + end.y + " Z";       
    return path;
  }

  /**
   * Updates the track-fill and thumb style properties to reflect current value
   */
  updateUIForCurrentValue_() {
    const pctComplete = (this.value_ - this.min_) / (this.max_ - this.min_);
    const translatePx = pctComplete * this.rect_.width;

    if (this.inTransit_) {
      const onTransitionEnd = (evt) => {
        if (this.adapter_.eventTargetHasClass(evt.target, 'mdc-slider__track-fill')) {
          this.setInTransit_(false);
          this.adapter_.deregisterEventHandler('transitionend', onTransitionEnd);
        }
      };
      this.adapter_.registerEventHandler('transitionend', onTransitionEnd);
    }

    if (this.isDiscrete_) {
      const xValue = (34 - (this.value_.toString().length * 8.98)) / 2;
      const path = this.calcPath_();
      this.adapter_.setValueLabelPath(path);
      this.adapter_.setValueLabelText(xValue, String(this.value_));
    }

    requestAnimationFrame(() => {
      this.adapter_.setThumbStyleProperty('transform', `translateX(${translatePx}px) translateX(-50%)`);
      this.adapter_.setTrackFillStyleProperty('transform', `scaleX(${translatePx})`);
    });
  }

  /**
   * Toggles the active state of the slider
   * @param {boolean} active
   */
  setActive_(active) {
    this.active_ = active;
    this.toggleClass_(cssClasses.ACTIVE, this.active_);
  }

  /**
   * Toggles the inTransit state of the slider
   * @param {boolean} inTransit
   */
  setInTransit_(inTransit) {
    this.inTransit_ = inTransit;
    this.toggleClass_(cssClasses.IN_TRANSIT, this.inTransit_);
  }

  /**
   * Conditionally adds or removes a class based on shouldBePresent
   * @param {string} className
   * @param {boolean} shouldBePresent
   */
  toggleClass_(className, shouldBePresent) {
    if (shouldBePresent) {
      this.adapter_.addClass(className);
    } else {
      this.adapter_.removeClass(className);
    }
  }
}

export default MDCSliderFoundation;
