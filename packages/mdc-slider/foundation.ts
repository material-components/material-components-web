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

import {getCorrectEventName, getCorrectPropertyName} from '@material/animation/util';
import {MDCFoundation} from '@material/base/foundation';
import {EventType, SpecificEventListener} from '@material/base/types';
import {MDCSliderAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

type UpEventType = 'mouseup' | 'pointerup' | 'touchend';
type DownEventType = 'mousedown' | 'pointerdown' | 'touchstart';
type MoveEventType = 'mousemove' | 'pointermove' | 'touchmove';
type MouseLikeEvent = MouseEvent | PointerEvent | TouchEvent;

type MoveEventMap = {
  readonly [K in DownEventType]: MoveEventType;
};

const DOWN_EVENTS: DownEventType[] = ['mousedown', 'pointerdown', 'touchstart'];
const UP_EVENTS: UpEventType[] = ['mouseup', 'pointerup', 'touchend'];

const MOVE_EVENT_MAP: MoveEventMap = {
  mousedown: 'mousemove',
  pointerdown: 'pointermove',
  touchstart: 'touchmove',
};

const KEY_IDS = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  END: 'End',
  HOME: 'Home',
  PAGE_DOWN: 'PageDown',
  PAGE_UP: 'PageUp',
};

export class MDCSliderFoundation extends MDCFoundation<MDCSliderAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter(): MDCSliderAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      hasClass: () => false,
      addClass: () => undefined,
      removeClass: () => undefined,
      getAttribute: () => null,
      setAttribute: () => undefined,
      removeAttribute: () => undefined,
      computeBoundingRect: () => ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0}),
      getTabIndex: () => 0,
      registerInteractionHandler: () => undefined,
      deregisterInteractionHandler: () => undefined,
      registerThumbContainerInteractionHandler: () => undefined,
      deregisterThumbContainerInteractionHandler: () => undefined,
      registerBodyInteractionHandler: () => undefined,
      deregisterBodyInteractionHandler: () => undefined,
      registerResizeHandler: () => undefined,
      deregisterResizeHandler: () => undefined,
      notifyInput: () => undefined,
      notifyChange: () => undefined,
      setThumbContainerStyleProperty: () => undefined,
      setTrackStyleProperty: () => undefined,
      setMarkerValue: () => undefined,
      setTrackMarkers: () => undefined,
      isRTL: () => false,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private rect_!: ClientRect; // assigned in layout() via init()

  /**
   * We set this to NaN since we want it to be a number, but we can't use '0' or '-1'
   * because those could be valid tabindices set by the client code.
   */
  private savedTabIndex_ = NaN;

  private active_ = false;
  private inTransit_ = false;
  private isDiscrete_ = false;
  private hasTrackMarker_ = false;
  private handlingThumbTargetEvt_ = false;
  private min_ = 0;
  private max_ = 100;
  private step_ = 0;
  private value_ = 0;
  private disabled_ = false;
  private preventFocusState_ = false;

  private readonly thumbContainerPointerHandler_: SpecificEventListener<DownEventType>;
  private readonly interactionStartHandler_: SpecificEventListener<DownEventType>;
  private readonly keydownHandler_: SpecificEventListener<'keydown'>;
  private readonly focusHandler_: SpecificEventListener<'focus'>;
  private readonly blurHandler_: SpecificEventListener<'blur'>;
  private readonly resizeHandler_: SpecificEventListener<'resize'>;

  constructor(adapter?: Partial<MDCSliderAdapter>) {
    super({...MDCSliderFoundation.defaultAdapter, ...adapter});

    this.thumbContainerPointerHandler_ = () => this.handlingThumbTargetEvt_ = true;
    this.interactionStartHandler_ = (evt: MouseLikeEvent) => this.handleDown_(evt);
    this.keydownHandler_ = (evt) => this.handleKeydown_(evt);
    this.focusHandler_ = () => this.handleFocus_();
    this.blurHandler_ = () => this.handleBlur_();
    this.resizeHandler_ = () => this.layout();
  }

  init() {
    this.isDiscrete_ = this.adapter_.hasClass(cssClasses.IS_DISCRETE);
    this.hasTrackMarker_ = this.adapter_.hasClass(cssClasses.HAS_TRACK_MARKER);

    DOWN_EVENTS.forEach((evtName) => {
      this.adapter_.registerInteractionHandler(evtName, this.interactionStartHandler_);
      this.adapter_.registerThumbContainerInteractionHandler(evtName, this.thumbContainerPointerHandler_);
    });

    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
    this.adapter_.registerResizeHandler(this.resizeHandler_);

    this.layout();

    // At last step, provide a reasonable default value to discrete slider
    if (this.isDiscrete_ && this.getStep() === 0) {
      this.step_ = 1;
    }
  }

  destroy() {
    DOWN_EVENTS.forEach((evtName) => {
      this.adapter_.deregisterInteractionHandler(evtName, this.interactionStartHandler_);
      this.adapter_.deregisterThumbContainerInteractionHandler(evtName, this.thumbContainerPointerHandler_);
    });

    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
  }

  setupTrackMarker() {
    if (this.isDiscrete_ && this.hasTrackMarker_ && this.getStep() !== 0) {
      this.adapter_.setTrackMarkers(this.getStep(), this.getMax(), this.getMin());
    }
  }

  layout() {
    this.rect_ = this.adapter_.computeBoundingRect();
    this.updateUIForCurrentValue_();
  }

  getValue(): number {
    return this.value_;
  }

  setValue(value: number) {
    this.setValue_(value, false);
  }

  getMax(): number {
    return this.max_;
  }

  setMax(max: number) {
    if (max < this.min_) {
      throw new Error('Cannot set max to be less than the slider\'s minimum value');
    }
    this.max_ = max;
    this.setValue_(this.value_, false, true);
    this.adapter_.setAttribute(strings.ARIA_VALUEMAX, String(this.max_));
    this.setupTrackMarker();
  }

  getMin(): number {
    return this.min_;
  }

  setMin(min: number) {
    if (min > this.max_) {
      throw new Error('Cannot set min to be greater than the slider\'s maximum value');
    }
    this.min_ = min;
    this.setValue_(this.value_, false, true);
    this.adapter_.setAttribute(strings.ARIA_VALUEMIN, String(this.min_));
    this.setupTrackMarker();
  }

  getStep(): number {
    return this.step_;
  }

  setStep(step: number) {
    if (step < 0) {
      throw new Error('Step cannot be set to a negative number');
    }
    if (this.isDiscrete_ && (typeof (step) !== 'number' || step < 1)) {
      step = 1;
    }
    this.step_ = step;
    this.setValue_(this.value_, false, true);
    this.setupTrackMarker();
  }

  isDisabled(): boolean {
    return this.disabled_;
  }

  setDisabled(disabled: boolean) {
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

  /**
   * Called when the user starts interacting with the slider
   */
  private handleDown_(downEvent: MouseLikeEvent) {
    if (this.disabled_) {
      return;
    }

    this.preventFocusState_ = true;
    this.setInTransit_(!this.handlingThumbTargetEvt_);
    this.handlingThumbTargetEvt_ = false;
    this.setActive_(true);

    const moveHandler = (moveEvent: MouseLikeEvent) => {
      this.handleMove_(moveEvent);
    };

    const moveEventType = MOVE_EVENT_MAP[downEvent.type as DownEventType];

    // Note: upHandler is [de]registered on ALL potential pointer-related release event types, since some browsers
    // do not always fire these consistently in pairs.
    // (See https://github.com/material-components/material-components-web/issues/1192)
    const upHandler = () => {
      this.handleUp_();
      this.adapter_.deregisterBodyInteractionHandler(moveEventType, moveHandler);
      UP_EVENTS.forEach((evtName) => this.adapter_.deregisterBodyInteractionHandler(evtName, upHandler));
    };

    this.adapter_.registerBodyInteractionHandler(moveEventType, moveHandler);
    UP_EVENTS.forEach((evtName) => this.adapter_.registerBodyInteractionHandler(evtName, upHandler));
    this.setValueFromEvt_(downEvent);
  }

  /**
   * Called when the user moves the slider
   */
  private handleMove_(evt: MouseLikeEvent) {
    evt.preventDefault();
    this.setValueFromEvt_(evt);
  }

  /**
   * Called when the user's interaction with the slider ends
   */
  private handleUp_() {
    this.setActive_(false);
    this.adapter_.notifyChange();
  }

  /**
   * Returns the pageX of the event
   */
  private getPageX_(evt: MouseLikeEvent): number {
    if ((evt as TouchEvent).targetTouches && (evt as TouchEvent).targetTouches.length > 0) {
      return (evt as TouchEvent).targetTouches[0].pageX;
    }
    return (evt as MouseEvent).pageX;
  }

  /**
   * Sets the slider value from an event
   */
  private setValueFromEvt_(evt: MouseLikeEvent) {
    const pageX = this.getPageX_(evt);
    const value = this.computeValueFromPageX_(pageX);
    this.setValue_(value, true);
  }

  /**
   * Computes the new value from the pageX position
   */
  private computeValueFromPageX_(pageX: number): number {
    const {max_: max, min_: min} = this;
    const xPos = pageX - (this.rect_.left + window.pageXOffset);
    let pctComplete = xPos / this.rect_.width;
    if (this.adapter_.isRTL()) {
      pctComplete = 1 - pctComplete;
    }
    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    return min + pctComplete * (max - min);
  }

  /**
   * Handles keydown events
   */
  private handleKeydown_(evt: KeyboardEvent) {
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

  /**
   * Returns the computed name of the event
   */
  private getKeyId_(kbdEvt: KeyboardEvent): string {
    if (kbdEvt.key === KEY_IDS.ARROW_LEFT || kbdEvt.keyCode === 37) {
      return KEY_IDS.ARROW_LEFT;
    }
    if (kbdEvt.key === KEY_IDS.ARROW_RIGHT || kbdEvt.keyCode === 39) {
      return KEY_IDS.ARROW_RIGHT;
    }
    if (kbdEvt.key === KEY_IDS.ARROW_UP || kbdEvt.keyCode === 38) {
      return KEY_IDS.ARROW_UP;
    }
    if (kbdEvt.key === KEY_IDS.ARROW_DOWN || kbdEvt.keyCode === 40) {
      return KEY_IDS.ARROW_DOWN;
    }
    if (kbdEvt.key === KEY_IDS.HOME || kbdEvt.keyCode === 36) {
      return KEY_IDS.HOME;
    }
    if (kbdEvt.key === KEY_IDS.END || kbdEvt.keyCode === 35) {
      return KEY_IDS.END;
    }
    if (kbdEvt.key === KEY_IDS.PAGE_UP || kbdEvt.keyCode === 33) {
      return KEY_IDS.PAGE_UP;
    }
    if (kbdEvt.key === KEY_IDS.PAGE_DOWN || kbdEvt.keyCode === 34) {
      return KEY_IDS.PAGE_DOWN;
    }
    return '';
  }

  /**
   * Computes the value given a keyboard key ID
   */
  private getValueForKeyId_(keyId: string): number {
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

  private handleFocus_() {
    if (this.preventFocusState_) {
      return;
    }
    this.adapter_.addClass(cssClasses.FOCUS);
  }

  private handleBlur_() {
    this.preventFocusState_ = false;
    this.adapter_.removeClass(cssClasses.FOCUS);
  }

  /**
   * Sets the value of the slider
   */
  private setValue_(value: number, shouldFireInput: boolean, force = false) {
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

  /**
   * Calculates the quantized value
   */
  private quantize_(value: number): number {
    const numSteps = Math.round(value / this.step_);
    return numSteps * this.step_;
  }

  private updateUIForCurrentValue_() {
    const {max_: max, min_: min, value_: value} = this;
    const pctComplete = (value - min) / (max - min);
    let translatePx = pctComplete * this.rect_.width;
    if (this.adapter_.isRTL()) {
      translatePx = this.rect_.width - translatePx;
    }

    const transformProp = getCorrectPropertyName(window, 'transform');
    const transitionendEvtName = getCorrectEventName(window, 'transitionend') as EventType;

    if (this.inTransit_) {
      const onTransitionEnd = () => {
        this.setInTransit_(false);
        this.adapter_.deregisterThumbContainerInteractionHandler(transitionendEvtName, onTransitionEnd);
      };
      this.adapter_.registerThumbContainerInteractionHandler(transitionendEvtName, onTransitionEnd);
    }

    requestAnimationFrame(() => {
      // NOTE(traviskaufman): It would be nice to use calc() here,
      // but IE cannot handle calcs in transforms correctly.
      // See: https://goo.gl/NC2itk
      // Also note that the -50% offset is used to center the slider thumb.
      this.adapter_.setThumbContainerStyleProperty(transformProp, `translateX(${translatePx}px) translateX(-50%)`);
      this.adapter_.setTrackStyleProperty(transformProp, `scaleX(${pctComplete})`);
    });
  }

  /**
   * Toggles the active state of the slider
   */
  private setActive_(active: boolean) {
    this.active_ = active;
    this.toggleClass_(cssClasses.ACTIVE, this.active_);
  }

  /**
   * Toggles the inTransit state of the slider
   */
  private setInTransit_(inTransit: boolean) {
    this.inTransit_ = inTransit;
    this.toggleClass_(cssClasses.IN_TRANSIT, this.inTransit_);
  }

  /**
   * Conditionally adds or removes a class based on shouldBePresent
   */
  private toggleClass_(className: string, shouldBePresent: boolean) {
    if (shouldBePresent) {
      this.adapter_.addClass(className);
    } else {
      this.adapter_.removeClass(className);
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSliderFoundation;
