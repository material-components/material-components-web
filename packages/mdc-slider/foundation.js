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
      removeThumbAttribute: () => {},
      computeBoundingRect: () => {},
      getThumbTabIndex: () => {},
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
      hasTickMarkClass: () => {},
      addTickMarkClass: () => {},
      removeTickMarkClass: () => {},
      getTickMarks: () => {},
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
    this.animationFrameID_ = 0;
    /** @private {number} */
    this.min_ = 0;
    /** @private {number} */
    this.max_ = 100;
    /** @private {number} */
    this.value_ = 0;
    /** @private {number} */
    this.savedTabIndex_ = 0;
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

  /** @return {boolean} */
  isDisabled() {
    return this.adapter_.hasClass(cssClasses.DISABLED);
  }

  /** @param {boolean} disabled */
  setDisabled(disabled) {
    this.toggleClass_(cssClasses.DISABLED, disabled);
    if (disabled) {
      this.savedTabIndex_ = this.adapter_.getThumbTabIndex();
      this.adapter_.setThumbAttribute(strings.ARIA_DISABLED, 'true');
      this.adapter_.removeThumbAttribute('tabindex');
    } else {
      this.adapter_.removeThumbAttribute(strings.ARIA_DISABLED);
      if (!isNaN(this.savedTabIndex_)) {
        this.adapter_.setThumbAttribute('tabindex', String(this.savedTabIndex_));
      }
    }
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
   * Update the classes on the tick marks to distinguish filled
   * @param {number} currentTickMark
   * @private
   */
  updateTickMarkClasses_(currentTickMark) {
    const tickMarks = this.adapter_.getTickMarks();
    if (tickMarks && tickMarks.length) {
      for (let i = 0; i < currentTickMark; i++) {
        if (!this.adapter_.hasTickMarkClass(tickMarks[i], cssClasses.TICK_MARK_FILLED)) {
          this.adapter_.addTickMarkClass(tickMarks[i], cssClasses.TICK_MARK_FILLED);
        }
      }
      for (let i = currentTickMark; i < tickMarks.length; i++) {
        if (this.adapter_.hasTickMarkClass(tickMarks[i], cssClasses.TICK_MARK_FILLED)) {
          this.adapter_.removeTickMarkClass(tickMarks[i], cssClasses.TICK_MARK_FILLED);
        }
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
    if (this.isDisabled()) {
      return;
    }

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
   * @param {number} translatePx
   * @return {string}
   */
  calcPath_(translatePx) {
    const digitWidth = this.adapter_.getDigitWidth();
    const localeStringWidth = this.calcLocaleStringWidth_();
    // The maximum horizontal distance at the top of the top-lobe before extra
    // horizontal distance must be added to the bottom of the top-lobe
    const MAX_TOP_LOBE_HORIZONTAL = 30;

    // The width of the label beyond 2 characters. If the label is <=2 characters then
    // no horizontal distance needs to be added.
    const labelHorizontalWidth = this.value_.toString().length > 2 ? localeStringWidth - (2 * digitWidth) : 0;
    const topLobeHorizontal = Math.min(labelHorizontalWidth, MAX_TOP_LOBE_HORIZONTAL);
    // The extra horizontal distance to add to the bottom of the top-lobe
    const extraHorizontalWidth = Math.max(labelHorizontalWidth - MAX_TOP_LOBE_HORIZONTAL, 0);
    // Note: total horizontal distance added to the top-lobe = topLobeHorizontal + extraHorizontalWidth

    // Distribute the extra horizontal distance for the bottom of the top-lobe to left and right sides equally
    let extraHorizontalWidthLeft = extraHorizontalWidth / 2;
    let extraHorizontalWidthRight = extraHorizontalWidth / 2;

    // Max width of one side of the top-lobe neck. When extraHorizontalWidth > 0 that means
    // the left side and right side of the neck are at their max width.
    const MAX_TOP_NECK_WIDTH = 15;

    // The horizontal distance from the start of the slider to the start of the left neck arc
    const distanceFromLeft =
      this.adapter_.isRTL() ? this.rect_.width - translatePx - MAX_TOP_NECK_WIDTH : translatePx - MAX_TOP_NECK_WIDTH;
    // The horizontal distance from the end of the right neck arc to the end of the slider
    const distanceFromRight =
      this.adapter_.isRTL() ? translatePx - MAX_TOP_NECK_WIDTH : this.rect_.width - translatePx - MAX_TOP_NECK_WIDTH;
    // If the thumb is reaching the ends of the slider then edit extraHorizontalWidthLeft and
    // extraHorizontalWidthRight so it does not bleed off the screen.
    if (distanceFromLeft < extraHorizontalWidthLeft) {
      extraHorizontalWidthRight = extraHorizontalWidth - distanceFromLeft;
      extraHorizontalWidthLeft = distanceFromLeft;
    }
    if (distanceFromRight < extraHorizontalWidthRight) {
      extraHorizontalWidthLeft = extraHorizontalWidth - distanceFromRight;
      extraHorizontalWidthRight = distanceFromRight;
    }

    // These constants define the shape of the default value label.
    // The value label changes shape based on the size of the text: the top-lobe widens horizontally, and the neck of
    // the top-lobe creates a narrower arc (smaller circle) to merge the top-lobe and stem smoothly as it expands.

    // Radius of the top-lobe
    const TOP_LOBE_RADIUS = 16;
    // Radius of one side of the neck of the top-lobe
    const TOP_NECK_RADIUS = 14;
    // X position for the left side of the stem
    const STEM_LEFT_XPOS = 15;
    // X position for the right side of the stem
    const STEM_RIGHT_XPOS = 17;
    // Angle of the neck of the top-lobe
    const topNeckTheta = Math.acos((MAX_TOP_NECK_WIDTH - topLobeHorizontal/2)/(TOP_LOBE_RADIUS + TOP_NECK_RADIUS));
    // Y position of the center of neck of the top-lobe
    const topNeckCenterYPos = Math.sqrt(Math.pow(TOP_LOBE_RADIUS + TOP_NECK_RADIUS, 2) -
      Math.pow(MAX_TOP_NECK_WIDTH - topLobeHorizontal/2, 2));

    // Distance between the center of the top-lobe and center of the bottom-lobe
    const CENTERS_DISTANCE = 40;

    // Radius of the bottom-lobe
    const BOTTOM_LOBE_RADIUS = 6;
    // Radius of one side of the neck of the bottom-lobe
    const BOTTOM_NECK_RADIUS = 4.5;
    // Angle of the neck of the bottom-lobe (50 degrees)
    const BOTTOM_NECK_THETA = 5 * Math.PI / 18;
    // Height of the neck of the bottom-lobe
    const bottomNeckHeight = Math.sin(BOTTOM_NECK_THETA) * (BOTTOM_LOBE_RADIUS+BOTTOM_NECK_RADIUS);

    // Total height of value label
    const valueLabelHeight = TOP_LOBE_RADIUS + CENTERS_DISTANCE + BOTTOM_LOBE_RADIUS;
    // Offset values to adjust the value label to the svg of the thumb.
    const OFFSET_Y = -39;
    const OFFSET_X = 1;

    // Each point that is needed to create the path is created here.
    const pointA = {
      x: STEM_RIGHT_XPOS + (TOP_NECK_RADIUS - (Math.cos(topNeckTheta) * TOP_NECK_RADIUS)) + OFFSET_X,
      y: TOP_LOBE_RADIUS + (topNeckCenterYPos - (Math.sin(topNeckTheta) * TOP_NECK_RADIUS)) + OFFSET_Y,
    };
    const pointB = {
      x: STEM_RIGHT_XPOS + OFFSET_X,
      y: TOP_LOBE_RADIUS + topNeckCenterYPos + OFFSET_Y,
    };
    const pointC = {
      x: STEM_RIGHT_XPOS + OFFSET_X,
      y: TOP_LOBE_RADIUS + CENTERS_DISTANCE - bottomNeckHeight + OFFSET_Y,
    };
    const pointD = {
      x: STEM_RIGHT_XPOS + BOTTOM_NECK_RADIUS - (Math.cos(BOTTOM_NECK_THETA) * BOTTOM_NECK_RADIUS) + 1 + OFFSET_X,
      y: (TOP_LOBE_RADIUS + CENTERS_DISTANCE - bottomNeckHeight) +
         (Math.sin(BOTTOM_NECK_THETA) * BOTTOM_NECK_RADIUS) + OFFSET_Y,
    };
    const pointE = {
      x: TOP_LOBE_RADIUS + OFFSET_X,
      y: valueLabelHeight + OFFSET_Y,
    };
    const pointF = {
      x: STEM_LEFT_XPOS - BOTTOM_NECK_RADIUS + (Math.cos(BOTTOM_NECK_THETA) * BOTTOM_NECK_RADIUS) - 1 + OFFSET_X,
      y: (TOP_LOBE_RADIUS + CENTERS_DISTANCE - bottomNeckHeight) +
         (Math.sin(BOTTOM_NECK_THETA) * BOTTOM_NECK_RADIUS) + OFFSET_Y,
    };
    const pointG = {
      x: STEM_LEFT_XPOS + OFFSET_X,
      y: TOP_LOBE_RADIUS + CENTERS_DISTANCE - bottomNeckHeight + OFFSET_Y,
    };
    const pointH = {
      x: STEM_LEFT_XPOS + OFFSET_X,
      y: TOP_LOBE_RADIUS + topNeckCenterYPos + OFFSET_Y,
    };
    const pointI = {
      x: STEM_LEFT_XPOS - TOP_NECK_RADIUS + (Math.cos(topNeckTheta) * TOP_NECK_RADIUS) + OFFSET_X,
      y: TOP_LOBE_RADIUS + (topNeckCenterYPos - (Math.sin(topNeckTheta) * TOP_NECK_RADIUS)) + OFFSET_Y,
    };
    const start = {
      x: TOP_LOBE_RADIUS + (topLobeHorizontal / 2) + OFFSET_X,
      y: 0 + OFFSET_Y,
    };
    const end = {
      x: TOP_LOBE_RADIUS - (topLobeHorizontal / 2) + OFFSET_X,
      y: 0 + OFFSET_Y,
    };

    // If there is any extra horizontal distance, update the start, end, and pointA X positions
    if (extraHorizontalWidth > 0) {
      start.x = start.x + extraHorizontalWidthRight;
      pointA.x = pointA.x + extraHorizontalWidthRight;
      end.x = end.x - extraHorizontalWidthLeft;
    }

    // When the slider reaches the edge of the slider, the extra horizontal distance on the side closest to the edge
    // is negative and the angles of the neck needs to be updated to create smooth value label
    if (extraHorizontalWidth > 0) {
      if (extraHorizontalWidthLeft < 0) {
        const topLobeHorizontalLeft = this.adapter_.isRTL() ? (this.rect_.width - translatePx) * 2 : translatePx * 2;

        const leftTopNeckTheta =
          Math.acos((MAX_TOP_NECK_WIDTH - topLobeHorizontalLeft/2)/(TOP_LOBE_RADIUS + TOP_NECK_RADIUS));
        const leftTopNeckCornerCenterY = Math.sqrt(Math.pow(TOP_LOBE_RADIUS + TOP_NECK_RADIUS, 2) -
          Math.pow(MAX_TOP_NECK_WIDTH - topLobeHorizontalLeft/2, 2));

        pointI.x = MAX_TOP_NECK_WIDTH - TOP_NECK_RADIUS + (Math.cos(leftTopNeckTheta) * TOP_NECK_RADIUS) + OFFSET_X;
        pointI.y =
          TOP_LOBE_RADIUS + (leftTopNeckCornerCenterY - (Math.sin(leftTopNeckTheta) * TOP_NECK_RADIUS)) + OFFSET_Y;
        pointH.y = TOP_LOBE_RADIUS + leftTopNeckCornerCenterY + OFFSET_Y;
      }
      if (extraHorizontalWidthRight < 0) {
        const topLobeHorizontalRight = this.adapter_.isRTL() ? translatePx * 2 : (this.rect_.width - translatePx) * 2;

        const rightTopNeckTheta =
          Math.acos((MAX_TOP_NECK_WIDTH - topLobeHorizontalRight/2)/(TOP_LOBE_RADIUS + TOP_NECK_RADIUS));
        const rightTopNeckCornerCenterY = Math.sqrt(Math.pow(TOP_LOBE_RADIUS + TOP_NECK_RADIUS, 2) -
          Math.pow(MAX_TOP_NECK_WIDTH - topLobeHorizontalRight/2, 2));

        pointA.x = STEM_RIGHT_XPOS + (TOP_NECK_RADIUS - (Math.cos(rightTopNeckTheta) * TOP_NECK_RADIUS)) + OFFSET_X;
        pointA.y =
          TOP_LOBE_RADIUS + (rightTopNeckCornerCenterY - (Math.sin(rightTopNeckTheta) * TOP_NECK_RADIUS)) + OFFSET_Y;
        pointB.y = TOP_LOBE_RADIUS + rightTopNeckCornerCenterY + OFFSET_Y;
      }
    }

    // Draw right side of the top-lobe
    let path = 'M ' + start.x + ' ' + start.y
      + ' A ' + TOP_LOBE_RADIUS + ' ' + TOP_LOBE_RADIUS + ' 0 0 1 ' + pointA.x + ' ' + pointA.y;
    // Add extra horizontal distance on the right side
    if (extraHorizontalWidth > 0 && extraHorizontalWidthRight > 0) {
      path = path + ' L ' + (pointA.x - extraHorizontalWidthRight) + ' ' + pointA.y;
    }
    // Draw the neck, stem, and bottom lobe
    path = path + ' A ' + TOP_NECK_RADIUS + ' ' + TOP_NECK_RADIUS + ' 0 0 0 ' + pointB.x + ' ' + pointB.y
      + ' L ' + pointC.x + ' ' + pointC.y
      + ' A ' + BOTTOM_NECK_RADIUS + ' ' + BOTTOM_NECK_RADIUS + ' 0 0 0 ' + pointD.x + ' ' + pointD.y
      + ' A ' + BOTTOM_LOBE_RADIUS + ' ' + BOTTOM_LOBE_RADIUS + ' 0 0 1 ' + pointE.x + ' ' + pointE.y
      + ' A ' + BOTTOM_LOBE_RADIUS + ' ' + BOTTOM_LOBE_RADIUS + ' 0 0 1 ' + pointF.x + ' ' + pointF.y
      + ' A ' + BOTTOM_NECK_RADIUS + ' ' + BOTTOM_NECK_RADIUS + ' 0 0 0 ' + pointG.x + ' ' + pointG.y
      + ' L ' + pointH.x + ' ' + pointH.y
      + ' A ' + TOP_NECK_RADIUS + ' ' + TOP_NECK_RADIUS + ' 0 0 0 ' + pointI.x + ' ' + pointI.y;
    // Add extra horizontal distance on the left side
    if (extraHorizontalWidth > 0 && extraHorizontalWidthLeft > 0) {
      path = path + ' L ' + (pointI.x - extraHorizontalWidthLeft) + ' ' + pointI.y;
    }
    // Draw left side of the top-lobe and finish path
    path = path + ' A ' + TOP_LOBE_RADIUS + ' ' + TOP_LOBE_RADIUS + ' 0 0 1 ' + end.x + ' ' + end.y + ' Z';

    return path;
  }

  /**
   * Calculates the value label text x attribute value
   * @param {number} translatePx
   * @return {number}
   */
  calcValueLabelTextXValue_(translatePx) {
    // The workspace of the svg element width
    const SVG_WIDTH = 34;
    const digitWidth = this.adapter_.getDigitWidth();
    const localeStringWidth = this.calcLocaleStringWidth_();
    // Max width of one side of the top-lobe neck. When extraHorizontalWidth > 0 that means
    // the left side and right side of the neck are at their max width.
    const MAX_TOP_NECK_WIDTH = 15;

    // Default translateX value for the size of the text
    let xValue = (SVG_WIDTH - localeStringWidth) / 2;
    if (this.adapter_.isRTL()) {
      xValue = xValue + localeStringWidth;
    }

    // Add extra translate value on either side if the slider is near the ends
    let extraTranslateValue = 0;
    const topLobeHorizontal = this.value_.toString().length > 2 ? localeStringWidth - (2 * digitWidth) : 0;
    const extraHorizontalWidth = topLobeHorizontal - 30;
    if(extraHorizontalWidth > 0) {
      let extraHorizontalWidthLeft = extraHorizontalWidth / 2;
      let extraHorizontalWidthRight = extraHorizontalWidth / 2;
      if (this.adapter_.isRTL()) {
        const temp = extraHorizontalWidthRight;
        extraHorizontalWidthRight = extraHorizontalWidthLeft;
        extraHorizontalWidthLeft = temp;
      }

      if (translatePx - MAX_TOP_NECK_WIDTH < extraHorizontalWidthLeft) {
        extraTranslateValue = extraHorizontalWidthLeft - translatePx + MAX_TOP_NECK_WIDTH;
      }
      if (this.rect_.width - translatePx - MAX_TOP_NECK_WIDTH < extraHorizontalWidthRight) {
        extraTranslateValue = -(extraHorizontalWidthRight - (this.rect_.width - translatePx - MAX_TOP_NECK_WIDTH));
      }
    }

    if (this.adapter_.isRTL()) {
      extraTranslateValue = -extraTranslateValue - SVG_WIDTH;
    }
    return xValue + extraTranslateValue;
  }

  /**
   * Updates the track-fill and thumb style properties to reflect current value
   */
  updateUIForCurrentValue_() {
    const pctComplete = (this.value_ - this.min_) / (this.max_ - this.min_);
    const translatePx = pctComplete * this.rect_.width;

    if (this.animationFrameID_) {
      window.cancelAnimationFrame(this.animationFrameID_);
    }
    if (this.isDiscrete_) {
      const numSteps = Math.round((this.value_ - this.min_) / this.step_);
      this.updateTickMarkClasses_(numSteps);
    }
    this.animationFrameID_ = requestAnimationFrame(() => {
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
