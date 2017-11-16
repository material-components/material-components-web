/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {cssClasses, strings, numbers} from './constants';

import {getCorrectEventName, getCorrectPropertyName} from '@material/animation';
import MDCFoundation from '@material/base/foundation';

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

// Events that can constitute the user releasing drag on a slider
const UP_EVENTS = ['mouseup', 'pointerup', 'touchend'];

export default class MDCSliderFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter() {
    return {
      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      getAttribute: (/* name: string */) => /* string|null */ null,
      setAttribute: (/* name: string, value: string */) => {},
      removeAttribute: (/* name: string */) => {},
      computeBoundingRect: () => /* ClientRect */ ({
        top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0,
      }),
      getTabIndex: () => /* number */ 0,
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerThumbContainerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterThumbContainerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerBodyInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterBodyInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      notifyInput: () => {},
      notifyChange: () => {},
      setThumbContainerStyleProperty: (/* propertyName: string, value: string */) => {},
      setTrackStyleProperty: (/* propertyName: string, value: string */) => {},
      setMarkerValue: (/* value: number */) => {},
      appendTrackMarkers: (/* numMarkers: number */) => {},
      removeTrackMarkers: () => {},
      setLastTrackMarkersStyleProperty: (/* propertyName: string, value: string */) => {},
      isRTL: () => /* boolean */ false,
    };
  }

  constructor(adapter = {}) {
    super(Object.assign(MDCSliderFoundation.defaultAdapter, adapter));
    this.rect_ = null;
    // We set this to NaN since we want it to be a number, but we can't use '0' or '-1'
    // because those could be valid tabindices set by the client code.
    this.savedTabIndex_ = NaN;
    this.active_ = false;
    this.inTransit_ = false;
    this.isDiscrete_ = false;
    this.hasTrackMarker_ = false;
    this.handlingThumbTargetEvt_ = false;
    this.min_ = 0;
    this.max_ = 100;
    this.step_ = 0;
    this.value_ = 0;
    this.disabled_ = false;
    this.preventFocusState_ = false;
    this.updateUIFrame_ = 0;
    this.thumbContainerPointerHandler_ = () => {
      this.handlingThumbTargetEvt_ = true;
    };
    this.mousedownHandler_ = this.createDownHandler_('mousemove');
    this.pointerdownHandler_ = this.createDownHandler_('pointermove');
    this.touchstartHandler_ = this.createDownHandler_(
      'touchmove', ({targetTouches}) => targetTouches[0].pageX);
    this.keydownHandler_ = (evt) => this.handleKeydown_(evt);
    this.focusHandler_ = () => this.handleFocus_();
    this.blurHandler_ = () => this.handleBlur_();
    this.resizeHandler_ = () => this.layout();
  }

  init() {
    this.isDiscrete_ = this.adapter_.hasClass(cssClasses.IS_DISCRETE);
    this.hasTrackMarker_ = this.adapter_.hasClass(cssClasses.HAS_TRACK_MARKER);
    this.adapter_.registerInteractionHandler('mousedown', this.mousedownHandler_);
    this.adapter_.registerInteractionHandler('pointerdown', this.pointerdownHandler_);
    this.adapter_.registerInteractionHandler('touchstart', this.touchstartHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
    ['mousedown', 'pointerdown', 'touchstart'].forEach((evtName) => {
      this.adapter_.registerThumbContainerInteractionHandler(evtName, this.thumbContainerPointerHandler_);
    });
    this.adapter_.registerResizeHandler(this.resizeHandler_);
    this.layout();
    // At last step, provide a reasonable default value to discrete slider
    if (this.isDiscrete_ && this.getStep() == 0) {
      this.step_ = 1;
    }
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('mousedown', this.mousedownHandler_);
    this.adapter_.deregisterInteractionHandler('pointerdown', this.pointerdownHandler_);
    this.adapter_.deregisterInteractionHandler('touchstart', this.touchstartHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);
    ['mousedown', 'pointerdown', 'touchstart'].forEach((evtName) => {
      this.adapter_.deregisterThumbContainerInteractionHandler(evtName, this.thumbContainerPointerHandler_);
    });
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
  }

  setupTrackMarker() {
    if (this.isDiscrete_ && this.hasTrackMarker_&& this.getStep() != 0) {
      const min = this.getMin();
      const max = this.getMax();
      const step = this.getStep();
      let numMarkers = (max - min) / step;

      // In case distance between max & min is indivisible to step,
      // we place the secondary to last marker proportionally at where thumb
      // could reach and place the last marker at max value
      const indivisible = Math.ceil(numMarkers) !== numMarkers;
      if (indivisible) {
        numMarkers = Math.ceil(numMarkers);
      }

      this.adapter_.removeTrackMarkers();
      this.adapter_.appendTrackMarkers(numMarkers);

      if (indivisible) {
        const lastStepRatio = (max - numMarkers * step) / step + 1;
        const flex = getCorrectPropertyName(window, 'flex');
        this.adapter_.setLastTrackMarkersStyleProperty(flex, lastStepRatio);
      }
    }
  }

  layout() {
    this.rect_ = this.adapter_.computeBoundingRect();
    this.updateUIForCurrentValue_();
  }

  getValue() {
    return this.value_;
  }

  setValue(value) {
    this.setValue_(value, false);
  }

  getMax() {
    return this.max_;
  }

  setMax(max) {
    if (max < this.min_) {
      throw new Error('Cannot set max to be less than the slider\'s minimum value');
    }
    this.max_ = max;
    this.setValue_(this.value_, false, true);
    this.adapter_.setAttribute(strings.ARIA_VALUEMAX, String(this.max_));
    this.setupTrackMarker();
  }

  getMin() {
    return this.min_;
  }

  setMin(min) {
    if (min > this.max_) {
      throw new Error('Cannot set min to be greater than the slider\'s maximum value');
    }
    this.min_ = min;
    this.setValue_(this.value_, false, true);
    this.adapter_.setAttribute(strings.ARIA_VALUEMIN, String(this.min_));
    this.setupTrackMarker();
  }

  getStep() {
    return this.step_;
  }

  setStep(step) {
    if (step < 0) {
      throw new Error('Step cannot be set to a negative number');
    }
    if (this.isDiscrete_ && (typeof(step) !== 'number' || step < 1)) {
      step = 1;
    }
    this.step_ = step;
    this.setValue_(this.value_, false, true);
    this.setupTrackMarker();
  }

  isDisabled() {
    return this.disabled_;
  }

  setDisabled(disabled) {
    this.disabled_ = disabled;
    this.toggleClass_(cssClasses.DISABLED, this.disabled_);
    if (this.disabled_) {
      this.savedTabIndex_ = this.adapter_.getTabIndex();
      this.adapter_.setAttribute(strings.ARIA_DISABLED, 'true');
      this.adapter_.removeAttribute('tabindex');
    } else {
      this.adapter_.removeAttribute(strings.ARIA_DISABLED);
      if (!isNaN(this.savedTabIndex_)) {
        this.adapter_.setAttribute('tabindex', String(this.savedTabIndex_));
      }
    }
  }

  createDownHandler_(moveEvt, getPageX = ({pageX}) => pageX) {
    const moveHandler = (evt) => {
      evt.preventDefault();
      this.setValueFromEvt_(evt, getPageX);
    };

    // Note: upHandler is [de]registered on ALL potential pointer-related release event types, since some browsers
    // do not always fire these consistently in pairs.
    // (See https://github.com/material-components/material-components-web/issues/1192)
    const upHandler = () => {
      this.setActive_(false);
      this.adapter_.deregisterBodyInteractionHandler(moveEvt, moveHandler);
      UP_EVENTS.forEach((type) => this.adapter_.deregisterBodyInteractionHandler(type, upHandler));
      this.adapter_.notifyChange();
    };

    const downHandler = (evt) => {
      if (this.disabled_) {
        return;
      }

      this.preventFocusState_ = true;
      this.setInTransit_(!this.handlingThumbTargetEvt_);
      this.handlingThumbTargetEvt_ = false;

      this.setActive_(true);

      this.adapter_.registerBodyInteractionHandler(moveEvt, moveHandler);
      UP_EVENTS.forEach((type) => this.adapter_.registerBodyInteractionHandler(type, upHandler));
      this.setValueFromEvt_(evt, getPageX);
    };

    return downHandler;
  }

  setValueFromEvt_(evt, getPageX) {
    const pageX = getPageX(evt);
    const value = this.computeValueFromPageX_(pageX);
    this.setValue_(value, true);
  }

  computeValueFromPageX_(pageX) {
    const {max_: max, min_: min} = this;
    const xPos = pageX - this.rect_.left;
    let pctComplete = xPos / this.rect_.width;
    if (this.adapter_.isRTL()) {
      pctComplete = 1 - pctComplete;
    }
    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    return min + pctComplete * (max - min);
  }

  handleKeydown_(evt) {
    const keyId = this.getKeyId_(evt);
    const value = this.getValueForKeyId_(keyId);
    if (isNaN(value)) {
      return;
    }

    // Prevent page from scrolling due to key presses that would normally scroll the page
    evt.preventDefault();
    this.adapter_.addClass(cssClasses.FOCUS);
    this.setValue_(value, true);
    this.adapter_.notifyChange();
  }

  getKeyId_(kbdEvt) {
    switch (kbdEvt.key || kbdEvt.keyCode) {
    case KEY_IDS.ARROW_LEFT:
    case 37:
      return KEY_IDS.ARROW_LEFT;
    case KEY_IDS.ARROW_RIGHT:
    case 39:
      return KEY_IDS.ARROW_RIGHT;
    case KEY_IDS.ARROW_UP:
    case 38:
      return KEY_IDS.ARROW_UP;
    case KEY_IDS.ARROW_DOWN:
    case 40:
      return KEY_IDS.ARROW_DOWN;
    case KEY_IDS.HOME:
    case 36:
      return KEY_IDS.HOME;
    case KEY_IDS.END:
    case 35:
      return KEY_IDS.END;
    case KEY_IDS.PAGE_UP:
    case 33:
      return KEY_IDS.PAGE_UP;
    case KEY_IDS.PAGE_DOWN:
    case 34:
      return KEY_IDS.PAGE_DOWN;
    default:
      // Doesn't matter
      return '';
    }
  }

  getValueForKeyId_(keyId) {
    const {max_: max, min_: min, step_: step} = this;
    let delta = step || (max - min) / 100;
    const valueNeedsToBeFlipped = this.adapter_.isRTL() && (
      keyId === KEY_IDS.ARROW_LEFT || keyId === KEY_IDS.ARROW_RIGHT
    );
    if (valueNeedsToBeFlipped) {
      delta = -delta;
    }

    switch (keyId) {
    case KEY_IDS.ARROW_LEFT:
    case KEY_IDS.ARROW_DOWN:
      return this.value_ - delta;
    case KEY_IDS.ARROW_RIGHT:
    case KEY_IDS.ARROW_UP:
      return this.value_ + delta;
    case KEY_IDS.HOME:
      return this.min_;
    case KEY_IDS.END:
      return this.max_;
    case KEY_IDS.PAGE_UP:
      return this.value_ + delta * numbers.PAGE_FACTOR;
    case KEY_IDS.PAGE_DOWN:
      return this.value_ - delta * numbers.PAGE_FACTOR;
    default:
      return NaN;
    }
  }

  handleFocus_() {
    if (this.preventFocusState_) {
      return;
    }
    this.adapter_.addClass(cssClasses.FOCUS);
  }

  handleBlur_() {
    this.preventFocusState_ = false;
    this.adapter_.removeClass(cssClasses.FOCUS);
  }

  setValue_(value, shouldFireInput, force = false) {
    if (value === this.value_ && !force) {
      return;
    }

    const {min_: min, max_: max} = this;
    const valueSetToBoundary = value === min || value === max;
    if (this.step_ && !valueSetToBoundary) {
      value = this.quantize_(value);
    }
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    this.value_ = value;
    this.adapter_.setAttribute(strings.ARIA_VALUENOW, String(this.value_));
    this.updateUIForCurrentValue_();

    if (shouldFireInput) {
      this.adapter_.notifyInput();
      if (this.isDiscrete_) {
        this.adapter_.setMarkerValue(value);
      }
    }
  }

  quantize_(value) {
    const numSteps = Math.round(value / this.step_);
    const quantizedVal = numSteps * this.step_;
    return quantizedVal;
  }

  updateUIForCurrentValue_() {
    const {max_: max, min_: min, value_: value} = this;
    const pctComplete = (value - min) / (max - min);
    let translatePx = pctComplete * this.rect_.width;
    if (this.adapter_.isRTL()) {
      translatePx = this.rect_.width - translatePx;
    }

    const transformProp = getCorrectPropertyName(window, 'transform');
    const transitionendEvtName = getCorrectEventName(window, 'transitionend');

    if (this.inTransit_) {
      const onTransitionEnd = () => {
        this.setInTransit_(false);
        this.adapter_.deregisterThumbContainerInteractionHandler(transitionendEvtName, onTransitionEnd);
      };
      this.adapter_.registerThumbContainerInteractionHandler(transitionendEvtName, onTransitionEnd);
    }

    this.updateUIFrame_ = requestAnimationFrame(() => {
      // NOTE(traviskaufman): It would be nice to use calc() here,
      // but IE cannot handle calcs in transforms correctly.
      // See: https://goo.gl/NC2itk
      // Also note that the -50% offset is used to center the slider thumb.
      this.adapter_.setThumbContainerStyleProperty(transformProp, `translateX(${translatePx}px) translateX(-50%)`);
      this.adapter_.setTrackStyleProperty(transformProp, `scaleX(${pctComplete})`);
    });
  }

  setActive_(active) {
    this.active_ = active;
    this.toggleClass_(cssClasses.ACTIVE, this.active_);
  }

  setInTransit_(inTransit) {
    this.inTransit_ = inTransit;
    this.toggleClass_(cssClasses.IN_TRANSIT, this.inTransit_);
  }

  toggleClass_(className, shouldBePresent) {
    if (shouldBePresent) {
      this.adapter_.addClass(className);
    } else {
      this.adapter_.removeClass(className);
    }
  }
}
