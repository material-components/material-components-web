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
      setValueLabelTextStyleProperty: () => {},
      removeValueLabelTextStyle: () => {},
      getDigitWidth: () => {},
      getCommaWidth: () => {},
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
    this.discreteMotion_ = false;
    /** @private {boolean} */
    this.isDiscrete_ = false;
    /** @private {boolean} */
    this.interactingWithSlider_ = false;
    /** @private {number} */
    this.min_ = 0;
    /** @private {number} */
    this.max_ = 100;
    /** @private {number} */
    this.value_ = 0;
    /** @private {number} */
    this.step_ = 0;
    /** @private {function(): undefined} */
    this.thumbFocusHandler_ = () => this.handleThumbFocus();
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
    this.adapter_.registerThumbEventHandler('focus', this.thumbFocusHandler_);
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
    this.adapter_.deregisterThumbEventHandler('focus', this.thumbFocusHandler_);
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
    // Calculate number of marks without using Math.ceil
    const rawNumMarks = (this.max_ - this.min_) / this.step_;

    // Check to see if indivisible
    if (rawNumMarks === numMarks) {
      return;
    }
    const lastStepRatio = (this.max_ - numMarks * this.step_) / this.step_ + 1;
    this.adapter_.setLastTickMarkStyleProperty('flex', String(lastStepRatio));
  }

  /**
   * Called when the thumb is focused
   */
  handleThumbFocus() {
    this.setActive_(true);
    this.updateUIForCurrentValue_();
  }

  /**
   * Called when the thumb blurs
   */
  handleThumbBlur() {
    if (!this.interactingWithSlider_) {
      this.setActive_(false);
      this.setDiscreteMotion_(false);
      if (this.isDiscrete_) {
        this.adapter_.removeValueLabelTextStyle();
      }
    }
  }

  /**
   * Called when the inTransit transition ends
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    if (this.inTransit_ && this.adapter_.eventTargetHasClass(evt.target, cssClasses.TRACK_FILL)) {
      this.setInTransit_(false);
    }
    // After value label grows, the discrete-motion class is added to adjust the snapping motion
    if (this.isDiscrete_ && this.adapter_.eventTargetHasClass(evt.target, cssClasses.VALUE_LABEL_TEXT)
      && this.active_) {
      this.setDiscreteMotion_(true);
    }
  }

  /**
   * Called when the user starts interacting with the slider
   * @param {!Event} evt
   */
  handleInteractionStart(evt) {
    this.interactingWithSlider_ = true;
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
    this.adapter_.deactivateRipple();
    this.adapter_.focusThumb();
    this.interactingWithSlider_ = false;
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
  /**
   * Calculates the locale string value length
   * @return {number}
   */
  calcLocaleStringWidth_() {
    const digitWidth = this.adapter_.getDigitWidth();
    const commaWidth = this.adapter_.getCommaWidth();
    const numOfCommas = this.value_.toLocaleString().length - this.value_.toString().length;
    return this.value_.toString().length * digitWidth + numOfCommas * commaWidth;
  }

  /**
   * Calculates the value label path
   * @return {string}
   */
  calcPath_(translatePx) {
    const digitWidth = this.adapter_.getDigitWidth();
    const localeStringWidth = this.calcLocaleStringWidth_();
    const maxTopLobeHorizontal = 30;

    // Less than 2 characters does not need to add horizontal space
    const labelHorizontalWidth = this.value_.toString().length > 2 ? localeStringWidth - (2 * digitWidth) : 0;
    // The distance added to widen the top lobe
    const topLobeHorizontal = Math.min(labelHorizontalWidth, maxTopLobeHorizontal);
    // Value to add to the sides of the toplobe to adjust for big numbers
    const extraHorizontalWidth = Math.max(labelHorizontalWidth - maxTopLobeHorizontal, 0);

    // Distributes the extra length to left and right
    let extraHorizontalWidthLeft = extraHorizontalWidth * 3 / 4;
    let extraHorizontalWidthRight = extraHorizontalWidth / 4;

    // Max width of one side of the top lobe neck arc
    // Used for when there is extraHorizontalWidth meaning that the arc is at its max width and
    // for finding the top neck corner theta since (topNeckArcWidth - topLobeHorizontal/2) affects the theta
    const topNeckArcWidth = 15;
    // If the thumb is reaching the ends of the slider then edit the left and right to make sure
    // it does not bleed off the screen.
    const distanceFromLeft =
      this.adapter_.isRTL() ? this.rect_.width - translatePx - topNeckArcWidth : translatePx - topNeckArcWidth;
    const distanceFromRight =
      this.adapter_.isRTL() ? translatePx - topNeckArcWidth : this.rect_.width - translatePx - topNeckArcWidth;

    if (distanceFromLeft < extraHorizontalWidthLeft) {
      extraHorizontalWidthRight = extraHorizontalWidth - distanceFromLeft;
      extraHorizontalWidthLeft = distanceFromLeft;
    }
    if (distanceFromRight < extraHorizontalWidthRight) {
      extraHorizontalWidthLeft = extraHorizontalWidth - distanceFromRight;
      extraHorizontalWidthRight = distanceFromRight;
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
    // X position for the right side of the stem
    const rightStemX = 17;
    // X position for the left side of the stem
    const leftStemX = 15;
    // Angle of the top neck corner
    const topNeckCornerTheta = Math.acos((topNeckArcWidth - topLobeHorizontal/2)/(topLobeRadius+topNeckRadius));
    // Y position of the top neck corner
    const topNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) -
      Math.pow(topNeckArcWidth - topLobeHorizontal/2, 2));
    // Distance between the top lobe and the bottom lobe
    const centersDifference = 40;
    // Radius of the bottom lobe
    const bottomLobeRadius = 6;
    // Radius of the bottom neck
    const bottomNeckRadius = 4.5;
    // Angle of the bottom neck (50 degrees)
    const bottomNeckTheta = 5 * Math.PI / 18;
    // Height of the bottom neck, used for the math below
    const bottomNeckHeight = Math.sin(bottomNeckTheta) * (bottomLobeRadius+bottomNeckRadius);
    // Height of value label
    const valueLabelHeight = topLobeRadius + centersDifference + bottomLobeRadius;
    // Offset values to adjust the value label to the svg of the thumb.
    const offsetY = -39;
    const offsetX = 1;

    // Each point that is needed to create the path is created here.
    const pointA = {
      x: rightStemX + (topNeckRadius - (Math.cos(topNeckCornerTheta) * topNeckRadius)) + offsetX,
      y: topLobeRadius + (topNeckCornerCenterY - (Math.sin(topNeckCornerTheta) * topNeckRadius)) + offsetY,
    };
    const pointB = {
      x: rightStemX + offsetX,
      y: topLobeRadius + topNeckCornerCenterY + offsetY,
    };
    const pointC = {
      x: rightStemX + offsetX,
      y: topLobeRadius + centersDifference - bottomNeckHeight + offsetY,
    };
    const pointD = {
      x: rightStemX + bottomNeckRadius - (Math.cos(bottomNeckTheta) * bottomNeckRadius) + 1 + offsetX,
      y: (topLobeRadius + centersDifference - bottomNeckHeight) +
         (Math.sin(bottomNeckTheta) * bottomNeckRadius) + offsetY,
    };
    const pointE = {
      x: topLobeRadius + offsetX,
      y: valueLabelHeight + offsetY,
    };
    const pointF = {
      x: leftStemX - bottomNeckRadius + (Math.cos(bottomNeckTheta) * bottomNeckRadius) - 1 + offsetX,
      y: (topLobeRadius + centersDifference - bottomNeckHeight) +
         (Math.sin(bottomNeckTheta) * bottomNeckRadius) + offsetY,
    };
    const pointG = {
      x: leftStemX + offsetX,
      y: topLobeRadius + centersDifference - bottomNeckHeight + offsetY,
    };
    const pointH = {
      x: leftStemX + offsetX,
      y: topLobeRadius + topNeckCornerCenterY + offsetY,
    };
    const pointI = {
      x: leftStemX - topNeckRadius + (Math.cos(topNeckCornerTheta) * topNeckRadius) + offsetX,
      y: topLobeRadius + (topNeckCornerCenterY - (Math.sin(topNeckCornerTheta) * topNeckRadius)) + offsetY,
    };
    const start = {
      x: topLobeRadius + (topLobeHorizontal / 2) + offsetX,
      y: 0 + offsetY,
    };
    const end = {
      x: topLobeRadius - (topLobeHorizontal / 2) + offsetX,
      y: 0 + offsetY,
    };

    // If there is extra, update the start, end, and pointA X positions for correct path
    if (extraHorizontalWidth > 0) {
      start.x = start.x + extraHorizontalWidthRight;
      end.x = end.x - extraHorizontalWidthLeft;
      pointA.x = pointA.x + extraHorizontalWidthRight;
    }

    // When the slider reaches a certain point close to the edges the extra on the side closest to the edge
    // is negative and the angles of the neck need to be updates to create smooth value label
    if (extraHorizontalWidthLeft < 0 && extraHorizontalWidth > 0) {
      const topLobeHorizontalLeft = this.adapter_.isRTL() ? (this.rect_.width - translatePx) * 2 : translatePx * 2;

      const leftTopNeckCornerTheta =
        Math.acos((topNeckArcWidth - (topLobeHorizontalLeft)/2)/(topLobeRadius+topNeckRadius));
      const leftTopNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) -
        Math.pow(topNeckArcWidth - (topLobeHorizontalLeft)/2, 2));

      pointI.x = topNeckArcWidth - topNeckRadius + (Math.cos(leftTopNeckCornerTheta) * topNeckRadius) + offsetX;
      pointI.y =
        topLobeRadius + (leftTopNeckCornerCenterY - (Math.sin(leftTopNeckCornerTheta) * topNeckRadius)) + offsetY;
      pointH.y = topLobeRadius + leftTopNeckCornerCenterY + offsetY;
    }
    if (extraHorizontalWidthRight < 0 && extraHorizontalWidth > 0) {
      const topLobeHorizontalRight = this.adapter_.isRTL() ? translatePx * 2 : (this.rect_.width - translatePx) * 2;

      const leftTopNeckCornerTheta =
        Math.acos((topNeckArcWidth - (topLobeHorizontalRight)/2)/(topLobeRadius+topNeckRadius));
      const leftTopNeckCornerCenterY = Math.sqrt(Math.pow(topLobeRadius+topNeckRadius, 2) -
        Math.pow(topNeckArcWidth - (topLobeHorizontalRight)/2, 2));

      pointA.x = rightStemX + (topNeckRadius - (Math.cos(leftTopNeckCornerTheta) * topNeckRadius)) + offsetX;
      pointA.y =
        topLobeRadius + (leftTopNeckCornerCenterY - (Math.sin(leftTopNeckCornerTheta) * topNeckRadius)) + offsetY,
      pointB.y = topLobeRadius + leftTopNeckCornerCenterY + offsetY;
    }

    // Path is created with string concatenation
    let path = 'M ' + start.x + ' ' + start.y
      + ' A ' + topLobeRadius + ' ' + topLobeRadius + ' 0 0 1 ' + pointA.x + ' ' + pointA.y;
    // If there is extra right that needs to be added, it is added here
    if (extraHorizontalWidth > 0 && extraHorizontalWidthRight > 0) {
      path = path + ' L ' + (pointA.x - extraHorizontalWidthRight) + ' ' + pointA.y;
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
    if (extraHorizontalWidth > 0 && extraHorizontalWidthLeft > 0) {
      path = path + ' L ' + (pointI.x - extraHorizontalWidthLeft) + ' ' + pointI.y;
    }
    // Path is finished off here
    path = path + ' A ' + topLobeRadius + ' ' + topLobeRadius + ' 0 0 1 ' + end.x + ' ' + end.y + ' Z';
    return path;
  }

  /**
   * Calculates the value label text x attribute value
   * @param {number} translatePx
   * @return {number}
   */
  calcValueLabelTextXValue_(translatePx) {
    const localeStringWidth = this.calcLocaleStringWidth_();
    let extraTranslateValue = 0;
    let topLobeHorizontal = 0;
    // Max width of one side of the top lobe neck arc
    // Used for when there is extraHorizontalWidth meaning that the arc is at its max width and
    // for finding the top neck corner theta since (topNeckArcWidth - topLobeHorizontal/2) affects the theta
    const topNeckArcWidth = 15;
    const digitWidth = this.adapter_.getDigitWidth();
    // The workspace of the svg element width
    const svgWidth = 34;

    // Calculates default translateX value for the size of the text
    let xValue = (svgWidth - localeStringWidth);
    if (this.value_.toString().length > 5) {
      xValue = (xValue * 0.75) + 4;
    } else {
      xValue = xValue / 2;
    }
    if (this.adapter_.isRTL()) {
      xValue = xValue + localeStringWidth;
    }

    // Calculates any extra translate value on either side if the slider is near the ends
    if (this.value_.toString().length > 2) {
      topLobeHorizontal = localeStringWidth - (2 * digitWidth);
    }
    const extraHorizontalWidth = topLobeHorizontal - 30;
    let extraHorizontalWidthLeft = extraHorizontalWidth * 3 / 4;
    let extraHorizontalWidthRight = extraHorizontalWidth / 4;
    if (this.adapter_.isRTL()) {
      const temp = extraHorizontalWidthRight;
      extraHorizontalWidthRight = extraHorizontalWidthLeft;
      extraHorizontalWidthLeft = temp;
    }
    if (translatePx - topNeckArcWidth < extraHorizontalWidthLeft && topLobeHorizontal > 30) {
      extraTranslateValue = extraHorizontalWidthLeft - translatePx + topNeckArcWidth;
    }
    if (this.rect_.width - translatePx - topNeckArcWidth < extraHorizontalWidthRight && topLobeHorizontal > 30) {
      extraTranslateValue = -(extraHorizontalWidthRight - (this.rect_.width - translatePx - topNeckArcWidth));
    }
    if (this.adapter_.isRTL()) {
      extraTranslateValue = -extraTranslateValue;
      extraTranslateValue -= svgWidth;
    }
    return xValue + extraTranslateValue;
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
        const xValue = this.calcValueLabelTextXValue_(translatePx);
        this.adapter_.setValueLabelPath(path);
        this.adapter_.setValueLabelText(this.value_.toLocaleString());
        this.adapter_.setValueLabelTextStyleProperty('transform', `translateX(${xValue}px) translateY(-39px)`);
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
   * Toggles the discreteMotion state of the slider to provide the discrete snapping motion
   * @param {boolean} discreteMotion
   */
  setDiscreteMotion_(discreteMotion) {
    this.discreteMotion_ = discreteMotion;
    this.toggleClass_(cssClasses.DISCRETE_MOTION, this.discreteMotion_);
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
