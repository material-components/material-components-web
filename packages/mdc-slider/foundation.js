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

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return {!MDCSliderAdapter} */
  static get defaultAdapter() {
    return /** @type {!MDCSliderAdapter} */ ({
      hasClass: () => {},
      addClass: () => {},
      removeClass: () => {},
      setThumbAttribute: () => {},
      setValueLabelPath: () => {},
      setValueLabelText: () => {},
      removeValueLabelTextStyle: () => {},
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
      setLastTickMarkStyleProperty: () => {},
      focusThumb: () => {},
      activateRipple: () => {},
      deactivateRipple: () => {},
      isRTL: () => false,
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
    this.pressed_ = false;
    /** @private {boolean} */
    this.isDiscrete_ = false;
    /** @private {boolean} */
    this.keydownDiscrete_ = false;
    /** @private {number} */
    this.min_ = 0;
    /** @private {number} */
    this.max_ = 100;
    /** @private {number} */
    this.value_ = 0;
    /** @private {number} */
    this.step_ = 0;
    /** @private {function(): undefined} */
    this.thumbBlurHandler_ = () => this.handleThumbBlur();
    /** @private {function(!Event): undefined} */
    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd(evt);
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
    this.isDiscrete_ = this.adapter_.hasClass(cssClasses.DISCRETE);
    DOWN_EVENTS.forEach((evtName) => this.adapter_.registerEventHandler(evtName, this.interactionStartHandler_));
    this.adapter_.registerEventHandler('keydown', this.keydownHandler_);
    this.adapter_.registerEventHandler('keyup', this.interactionEndHandler_);
    this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);
    this.adapter_.registerThumbEventHandler('blur', this.thumbBlurHandler_);
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
    this.adapter_.deregisterEventHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterEventHandler('keyup', this.interactionEndHandler_);
    this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);
    this.adapter_.deregisterThumbEventHandler('blur', this.thumbBlurHandler_);
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
    this.adapter_.setThumbAttribute(strings.ARIA_VALUEMAX, String(this.max_));
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
    this.adapter_.setThumbAttribute(strings.ARIA_VALUEMIN, String(this.min_));
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
    this.adapter_.setThumbAttribute(strings.DATA_STEP, String(this.step_));
  }

  /**
   * Called when the thumb blurs
   */
  handleThumbBlur() {
    if (this.isDiscrete_ && this.keydownDiscrete_) {
      this.keydownDiscrete_ = false;
      this.setActive_(false);
      this.setPressed_(false);
      this.adapter_.removeValueLabelTextStyle();
    }
  }

  /**
   * Calculates the number of tick marks for discrete slider
   * @return {number}
   */
  calculateNumberOfTickMarks() {
    if (this.step_ < 1) {
      this.step_ = 1;
    }
    let numMarks = (this.max_ - this.min_) / this.step_;
    numMarks = Math.ceil(numMarks);
    return numMarks;
  }

  /**
   * Adjusts the last tick mark style
   * @param {number} numMarks
   */
  adjustLastTickMark(numMarks) {
    const lastStepRatio = (this.max_ - numMarks * this.step_) / this.step_ + 1;
    this.adapter_.setLastTickMarkStyleProperty('flex', String(lastStepRatio));
  }

  /**
   * Called when the inTransit transition ends
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    if (this.inTransit_ && this.adapter_.eventTargetHasClass(evt.target, cssClasses.TRACK_FILL)) {
      this.setInTransit_(false);
    }
    if (this.isDiscrete_ && this.adapter_.eventTargetHasClass(evt.target, 'mdc-slider__value-label') && this.active_) {
      this.setPressed_(true);
    }
  }

  /**
   * Called when the user starts interacting with the slider
   * @param {!Event} evt
   */
  handleInteractionStart(evt) {
    this.keydownDiscrete_ = false;
    this.setActive_(true);
    this.adapter_.activateRipple();

    const shouldTransition =
      this.adapter_.eventTargetHasClass(evt.target, cssClasses.SLIDER) ||
      this.adapter_.eventTargetHasClass(evt.target, cssClasses.TRACK) ||
      this.adapter_.eventTargetHasClass(evt.target, cssClasses.TRACK_FILL);
    this.setInTransit_(shouldTransition);

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
    this.adapter_.notifyChange();
    if (!this.keydownDiscrete_) {
      this.setActive_(false);
      this.setPressed_(false);
      this.adapter_.deactivateRipple();
      this.adapter_.focusThumb();
      if (this.isDiscrete_) {
        this.adapter_.removeValueLabelTextStyle();
      }
    }
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

    if (this.isDiscrete_) {
      this.keydownDiscrete_ = true;
    }
    this.setActive_(true);
    if (!this.isDiscrete_) {
      this.setInTransit_(true);
    }

    // Prevent page from scrolling due to key presses that would normally scroll the page
    evt.preventDefault();
    this.setValue_(value);
    this.adapter_.notifyChange();
  }

  /**
   * Returns the computed name of the event
   * @param {!Event} keyboardEvt
   * @return {number}
   * @private
   */
  getKeyIdValue_(keyboardEvt) {
    let delta = this.step_ || (this.max_ - this.min_) / 100;
    if (this.adapter_.isRTL() && (
      keyboardEvt.key === KEY_IDS.ARROW_LEFT || keyboardEvt.keyCode === 37 ||
      keyboardEvt.key === KEY_IDS.ARROW_RIGHT || keyboardEvt.keyCode === 39)) {
      delta = -delta;
    }

    if (keyboardEvt.key === KEY_IDS.ARROW_LEFT || keyboardEvt.keyCode === 37
      || keyboardEvt.key === KEY_IDS.ARROW_DOWN || keyboardEvt.keyCode === 40) {
      return this.value_ - delta;
    }
    if (keyboardEvt.key === KEY_IDS.ARROW_RIGHT || keyboardEvt.keyCode === 39
      || keyboardEvt.key === KEY_IDS.ARROW_UP || keyboardEvt.keyCode === 38) {
      return this.value_ + delta;
    }
    if (keyboardEvt.key === KEY_IDS.HOME || keyboardEvt.keyCode === 36) {
      return this.min_;
    }
    if (keyboardEvt.key === KEY_IDS.END || keyboardEvt.keyCode === 35) {
      return this.max_;
    }
    if (keyboardEvt.key === KEY_IDS.PAGE_UP || keyboardEvt.keyCode === 33) {
      return this.value_ + delta * 5;
    }
    if (keyboardEvt.key === KEY_IDS.PAGE_DOWN || keyboardEvt.keyCode === 34) {
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
    let pctComplete = xPos / this.rect_.width;
    if (this.adapter_.isRTL()) {
      pctComplete = 1 - pctComplete;
    }

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
    this.adapter_.setThumbAttribute(strings.ARIA_VALUENOW, String(this.value_));
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

  calcLocaleString_() {
    const characterWidth = 8.98;
    const commaWidth = 3.16;
    const numOfCommas = this.value_.toLocaleString().length - this.value_.toString().length;
    return this.value_.toString().length * characterWidth + numOfCommas * commaWidth;
  }

  /**
   * Calculates the value label path
   * @return {string}
   */
  calcPath_(translatePx) {
    // Instantiate the addExtra boolean to be used later and the length of the top lobe
    let addExtra = false;
    const characterWidth = 8.98;
    let topLobeHorizontal = 0;
    const valueLocaleString = this.calcLocaleString_();

    // Less than 2 characters does not need to add horizontal space
    if (this.value_.toString().length > 2) {
      topLobeHorizontal = valueLocaleString - (2 * characterWidth);
    }

    // If topLopeHorizontal is greater than 30 then add what ever is after 30 to extra
    let extra = topLobeHorizontal - 30;
    if (extra > 0) {
      topLobeHorizontal = 30;
      addExtra = true;
    } else {
      extra = 0;
    }

    // Distributes the extra length to left and right
    let extraLeft = extra * 3 / 4;
    let extraRight = extra / 4;

    // If the thumb is reaching the ends of the slider then edit the left and right to make sure
    // it does not bleed off the screen.
    if (this.adapter_.isRTL()) {
      if (translatePx - 15 < extraRight) {
        extraLeft = extraRight + extraLeft - translatePx + 15;
        extraRight = translatePx - 15;
      }
      if (this.rect_.width - translatePx - 15 < extraLeft ) {
        extraRight = extraLeft + (extraRight - (this.rect_.width - translatePx - 15));
        extraLeft = this.rect_.width - translatePx - 15;
      }
    } else {
      if (translatePx - 15 < extraLeft) {
        extraRight = extraRight + extraLeft - translatePx + 15;
        extraLeft = translatePx - 15;
      }
      if (this.rect_.width - translatePx - 15 < extraRight ) {
        extraLeft = extraLeft + (extraRight - (this.rect_.width - translatePx - 15));
        extraRight = this.rect_.width - translatePx - 15;
      }
    }

    // These constants define the shape of the default value label.
    // The value label changes shape based on the size of
    // the text: The top lobe spreads horizontally, and the
    // top arc on the neck moves down to keep it merging smoothly
    // with the top lobe as it expands.

    // Radius of the top lobe of the value indicator.
    const topLobeRadius = 16;
    // Radius of the top neck of the value indicator.
    const topNeckRadius = 14;
    // Angle of the top neck corner
    const topNeckCornerTheta = Math.acos((15 - topLobeHorizontal/2)/(topLobeRadius+topNeckRadius));
    // Y position of the top neck corner
    const topNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) -
      Math.pow(15 - topLobeHorizontal/2, 2));
    // Distance between the top lobe and the bottom lobe
    const centersDifference = 40;
    // Radius of the bottom lobe
    const bottomLobeRadius = 6;
    // Radius of the bottom neck
    const bottomNeckRadius = 4.5;
    // Angle of the bottom neck
    const bottomNeckTheta = 5 * Math.PI / 18;
    // Height of the bottom neck, used for the math below
    const bottomNeckHeight = Math.sin(bottomNeckTheta) * (bottomLobeRadius+bottomNeckRadius);
    // Offset values to adjust the value label to the svg of the thumb.
    const offsetY = -39;
    const offsetX = 1;

    // Each point that is needed to create the path is created here.
    const pointA = {
      x: 17 + (topNeckRadius - (Math.cos(topNeckCornerTheta) * topNeckRadius)) + offsetX,
      y: 16 + (topNeckCornerCenterY - (Math.sin(topNeckCornerTheta) * topNeckRadius)) + offsetY,
    };
    const pointB = {
      x: 17 + offsetX,
      y: 16 + topNeckCornerCenterY + offsetY,
    };
    const pointC = {
      x: 17 + offsetX,
      y: 16 + centersDifference - bottomNeckHeight + offsetY,
    };
    const pointD = {
      x: 17 + bottomNeckRadius - (Math.cos(bottomNeckTheta) * bottomNeckRadius) + 1 + offsetX,
      y: (16 + centersDifference - bottomNeckHeight) + (Math.sin(bottomNeckTheta) * bottomNeckRadius) + offsetY,
    };
    const pointE = {
      x: 16 + offsetX,
      y: 62 + offsetY,
    };
    const pointF = {
      x: 15 - bottomNeckRadius + (Math.cos(bottomNeckTheta) * bottomNeckRadius) - 1 + offsetX,
      y: (16 + centersDifference - bottomNeckHeight) + (Math.sin(bottomNeckTheta) * bottomNeckRadius) + offsetY,
    };
    const pointG = {
      x: 15 + offsetX,
      y: 16 + centersDifference - bottomNeckHeight + offsetY,
    };
    const pointH = {
      x: 15 + offsetX,
      y: 16 + topNeckCornerCenterY + offsetY,
    };
    const pointI = {
      x: 15 - topNeckRadius + (Math.cos(topNeckCornerTheta) * topNeckRadius) + offsetX,
      y: 16 + (topNeckCornerCenterY - (Math.sin(topNeckCornerTheta) * topNeckRadius)) + offsetY,
    };
    const start = {
      x: 16 + (topLobeHorizontal / 2) + offsetX,
      y: 0 + offsetY,
    };
    const end = {
      x: 16 - (topLobeHorizontal / 2) + offsetX,
      y: 0 + offsetY,
    };

    // If there is extra, update the start, end, and pointA X positions for correct path
    if ((extra > 0 || extraLeft < 0 || extraRight < 0) && addExtra) {
      start.x = start.x + extraRight;
      end.x = end.x - extraLeft;
      pointA.x = pointA.x + extraRight;
    }

    // When the slider reaches a certain point close to the edges the extra on the side closest to the edge
    // is 0 and the angles of the neck need to be updates to create smooth value label
    if (extraLeft < 0 && addExtra) {
      if (this.adapter_.isRTL()) {
        topLobeHorizontal = (this.rect_.width - translatePx)*2;
      } else {
        topLobeHorizontal = translatePx*2;
      }
      const leftTopNeckCornerTheta = Math.acos((15 - (topLobeHorizontal)/2)/(topLobeRadius+topNeckRadius));
      const leftTopNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) -
        Math.pow(15 - (topLobeHorizontal)/2, 2));

      pointI.x = 15 - topNeckRadius + (Math.cos(leftTopNeckCornerTheta) * topNeckRadius) + offsetX;
      pointI.y = 16 + (leftTopNeckCornerCenterY - (Math.sin(leftTopNeckCornerTheta) * topNeckRadius)) + offsetY;
      pointH.y = 16 + leftTopNeckCornerCenterY + offsetY;
    }
    if (extraRight < 0 && addExtra) {
      if (this.adapter_.isRTL()) {
        topLobeHorizontal = translatePx*2;
      } else {
        topLobeHorizontal = (this.rect_.width - translatePx)*2;
      }
      const leftTopNeckCornerTheta = Math.acos((15 - (topLobeHorizontal)/2)/(topLobeRadius+topNeckRadius));
      const leftTopNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) -
        Math.pow(15 - (topLobeHorizontal)/2, 2));

      pointA.x = 17 + (topNeckRadius - (Math.cos(leftTopNeckCornerTheta) * topNeckRadius)) + offsetX;
      pointA.y = 16 + (leftTopNeckCornerCenterY - (Math.sin(leftTopNeckCornerTheta) * topNeckRadius)) + offsetY,
      pointB.y = 16 + leftTopNeckCornerCenterY + offsetY;
    }

    // Path is created with string concatenation
    let path = 'M ' + start.x + ' ' + start.y
      + ' A ' + topLobeRadius + ' ' + topLobeRadius + ' 0 0 1 ' + pointA.x + ' ' + pointA.y;
    // If there is extra right that needs to be added, it is added here
    if (addExtra && extraRight > 0) {
      path = path + ' L ' + (pointA.x - extraRight) + ' ' + pointA.y;
    }
    // The path continues to be concatenated here
    path = path + ' A ' + topNeckRadius + ' ' + topNeckRadius + ' 0 0 0 ' + pointB.x + ' ' + pointB.y
      + ' L ' + pointC.x + ' ' + pointC.y
      + ' A ' + bottomNeckRadius + ' ' + bottomNeckRadius + ' 0 0 0 ' + pointD.x + ' ' + pointD.y
      + ' A ' + bottomLobeRadius + ' ' + bottomLobeRadius + ' 0 0 1 ' + pointE.x + ' ' + pointE.y
      + ' A ' + bottomLobeRadius + ' ' + bottomLobeRadius + ' 0 0 1 ' + pointF.x + ' ' + pointF.y
      + ' A ' + bottomNeckRadius + ' ' + bottomNeckRadius + ' 0 0 0 ' + pointG.x + ' ' + pointG.y
      + ' L ' + pointH.x + ' ' + pointH.y
      + ' A ' + topNeckRadius + ' ' + topNeckRadius + ' 0 0 0 ' + pointI.x + ' ' + pointI.y;
    // If there is extra left that needs to be added, it is added here
    if (addExtra && extraLeft > 0) {
      path = path + ' L ' + (pointI.x - extraLeft) + ' ' + pointI.y;
    }
    // Path is finished off here
    path = path + ' A ' + topLobeRadius + ' ' + topLobeRadius + ' 0 0 1 ' + end.x + ' ' + end.y + ' Z';
    return path;
  }

  /**
   * Calculates the value label text x attribute value
   * @return {number}
   */
  calcValueLabelTextXValue_() {
    const valueLocaleString = this.calcLocaleString_();
    let xValue = (34 - valueLocaleString);
    if (this.value_.toString().length > 5) {
      xValue = (xValue * 0.75) + 4;
    } else {
      xValue = xValue / 2;
    }
    if (this.adapter_.isRTL()) {
      xValue = xValue + valueLocaleString;
    }
    return xValue;
  }

  /**
   * Calculates the value label text translate
   * @return {number}
   */
  calcValueLabelTextTranslate_(translatePx) {
    let translateValue = 0;
    let topLobeHorizontal = 0;
    const characterWidth = 8.98;
    const valueLocaleString = this.calcLocaleString_();
    if (this.value_.toString().length > 2) {
      topLobeHorizontal = valueLocaleString - (2 * characterWidth);
    }
    const extra = topLobeHorizontal - 30;
    let extraLeft = extra * 3 / 4;
    let extraRight = extra / 4;
    if (this.adapter_.isRTL()) {
      const temp = extraRight;
      extraRight = extraLeft;
      extraLeft = temp;
    }
    if (translatePx - 15 < extraLeft && topLobeHorizontal > 30) {
      translateValue = extraLeft - translatePx + 15;
    }
    if (this.rect_.width - translatePx - 15 < extraRight && topLobeHorizontal > 30) {
      translateValue = -(extraRight - (this.rect_.width - translatePx - 15));
    }
    if (this.adapter_.isRTL()) {
      translateValue = -translateValue;
    }
    return translateValue;
  }

  /**
   * Updates the track-fill and thumb style properties to reflect current value
   */
  updateUIForCurrentValue_() {
    const pctComplete = (this.value_ - this.min_) / (this.max_ - this.min_);
    const translatePx = pctComplete * this.rect_.width;

    requestAnimationFrame(() => {
      if (this.isDiscrete_ && this.active_) {
        const path = this.calcPath_(translatePx);
        const xValue = this.calcValueLabelTextXValue_();
        const translateValue = this.calcValueLabelTextTranslate_(translatePx);
        this.adapter_.setValueLabelPath(path);
        this.adapter_.setValueLabelText(
          String(xValue), this.value_.toLocaleString(), `transform: translateX(${translateValue}px)`);
      }
      if (this.adapter_.isRTL()) {
        this.adapter_.setThumbStyleProperty('transform', `translateX(-${translatePx}px) translateX(50%)`);
      } else {
        this.adapter_.setThumbStyleProperty('transform', `translateX(${translatePx}px) translateX(-50%)`);
      }
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
   * Toggles the pressed state of the slider
   * @param {boolean} pressed
   */
  setPressed_(pressed) {
    this.pressed_ = pressed;
    this.toggleClass_(cssClasses.PRESSED, this.pressed_);
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
