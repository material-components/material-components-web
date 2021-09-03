/**
 * @license
 * Copyright 2020 Google Inc.
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

import {AnimationFrame} from '@material/animation/animationframe';
import {getCorrectPropertyName} from '@material/animation/util';
import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';

import {MDCSliderAdapter} from './adapter';
import {attributes, cssClasses, numbers} from './constants';
import {Thumb, TickMark} from './types';

enum AnimationKeys {
  SLIDER_UPDATE = 'slider_update'
}

// Accessing `window` without a `typeof` check will throw on Node environments.
const HAS_WINDOW = typeof window !== 'undefined';

/**
 * Foundation class for slider. Responsibilities include:
 * - Updating slider values (internal state and DOM updates) based on client
 *   'x' position.
 * - Updating DOM after slider property updates (e.g. min, max).
 */
export class MDCSliderFoundation extends MDCFoundation<MDCSliderAdapter> {
  static SUPPORTS_POINTER_EVENTS = HAS_WINDOW && Boolean(window.PointerEvent) &&
      // #setPointerCapture is buggy on iOS, so we can't use pointer events
      // until the following bug is fixed:
      // https://bugs.webkit.org/show_bug.cgi?id=220196
      !isIOS();

  // Whether the initial styles (to position the thumb, before component
  // initialization) have been removed.
  private initialStylesRemoved = false;

  private min!: number;  // Assigned in init()
  private max!: number;  // Assigned in init()
  // If `isRange`, this is the value of Thumb.START. Otherwise, defaults to min.
  private valueStart!: number;  // Assigned in init()
  // If `isRange`, this it the value of Thumb.END. Otherwise, it is the
  // value of the single thumb.
  private value!: number;     // Assigned in init()
  private rect!: ClientRect;  // Assigned in layout() via init()

  private isDisabled = false;

  private isDiscrete = false;
  private step = numbers.STEP_SIZE;
  // Number of digits after the decimal point to round to, when computing
  // values. This is based on the step size by default and is used to
  // avoid floating point precision errors in JS.
  private numDecimalPlaces!: number;  // Assigned in init()
  private hasTickMarks = false;

  // The following properties are only set for range sliders.
  private isRange = false;
  // Tracks the thumb being moved across a slider pointer interaction (down,
  // move event).
  private thumb: Thumb|null = null;
  // `clientX` from the most recent down event. Used in subsequent move
  // events to determine which thumb to move (in the case of
  // overlapping thumbs).
  private downEventClientX: number|null = null;
  // `valueStart` before the most recent down event. Used in subsequent up
  // events to determine whether to fire the `change` event.
  private valueStartBeforeDownEvent!: number;  // Assigned in init()
  // `value` before the most recent down event. Used in subsequent up
  // events to determine whether to fire the `change` event.
  private valueBeforeDownEvent!: number;  // Assigned in init()
  // Width of the start thumb knob.
  private startThumbKnobWidth = 0;
  // Width of the end thumb knob.
  private endThumbKnobWidth = 0;

  private readonly animFrame: AnimationFrame;

  // Assigned in #initialize.
  private mousedownOrTouchstartListener!:
      SpecificEventListener<'mousedown'|'touchstart'>;
  // Assigned in #initialize.
  private moveListener!:
      SpecificEventListener<'pointermove'|'mousemove'|'touchmove'>;
  private pointerdownListener!:
      SpecificEventListener<'pointerdown'>;  // Assigned in #initialize.
  private pointerupListener!:
      SpecificEventListener<'pointerup'>;  // Assigned in #initialize.
  private thumbMouseenterListener!:
      SpecificEventListener<'mouseenter'>;  // Assigned in #initialize.
  private thumbMouseleaveListener!:
      SpecificEventListener<'mouseleave'>;  // Assigned in #initialize.
  private inputStartChangeListener!:
      SpecificEventListener<'change'>;  // Assigned in #initialize.
  private inputEndChangeListener!:
      SpecificEventListener<'change'>;  // Assigned in #initialize.
  private inputStartFocusListener!:
      SpecificEventListener<'focus'>;  // Assigned in #initialize.
  private inputEndFocusListener!:
      SpecificEventListener<'focus'>;  // Assigned in #initialize.
  private inputStartBlurListener!:
      SpecificEventListener<'blur'>;  // Assigned in #initialize.
  private inputEndBlurListener!:
      SpecificEventListener<'blur'>;  // Assigned in #initialize.
  private resizeListener!:
      SpecificEventListener<'resize'>;  // Assigned in #initialize.

  constructor(adapter?: Partial<MDCSliderAdapter>) {
    super({...MDCSliderFoundation.defaultAdapter, ...adapter});

    this.animFrame = new AnimationFrame();
  }

  static override get defaultAdapter(): MDCSliderAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same
    // order as the adapter interface.
    return {
      hasClass: () => false,
      addClass: () => undefined,
      removeClass: () => undefined,
      addThumbClass: () => undefined,
      removeThumbClass: () => undefined,
      getAttribute: () => null,
      getInputValue: () => '',
      setInputValue: () => undefined,
      getInputAttribute: () => null,
      setInputAttribute: () => null,
      removeInputAttribute: () => null,
      focusInput: () => undefined,
      isInputFocused: () => false,
      getThumbKnobWidth: () => 0,
      getThumbBoundingClientRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0}),
      getBoundingClientRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0}),
      isRTL: () => false,
      setThumbStyleProperty: () => undefined,
      removeThumbStyleProperty: () => undefined,
      setTrackActiveStyleProperty: () => undefined,
      removeTrackActiveStyleProperty: () => undefined,
      setValueIndicatorText: () => undefined,
      getValueToAriaValueTextFn: () => null,
      updateTickMarks: () => undefined,
      setPointerCapture: () => undefined,
      emitChangeEvent: () => undefined,
      emitInputEvent: () => undefined,
      emitDragStartEvent: () => undefined,
      emitDragEndEvent: () => undefined,
      registerEventHandler: () => undefined,
      deregisterEventHandler: () => undefined,
      registerThumbEventHandler: () => undefined,
      deregisterThumbEventHandler: () => undefined,
      registerInputEventHandler: () => undefined,
      deregisterInputEventHandler: () => undefined,
      registerBodyEventHandler: () => undefined,
      deregisterBodyEventHandler: () => undefined,
      registerWindowEventHandler: () => undefined,
      deregisterWindowEventHandler: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  override init() {
    this.isDisabled = this.adapter.hasClass(cssClasses.DISABLED);
    this.isDiscrete = this.adapter.hasClass(cssClasses.DISCRETE);
    this.hasTickMarks = this.adapter.hasClass(cssClasses.TICK_MARKS);
    this.isRange = this.adapter.hasClass(cssClasses.RANGE);

    const min = this.convertAttributeValueToNumber(
        this.adapter.getInputAttribute(
            attributes.INPUT_MIN, this.isRange ? Thumb.START : Thumb.END),
        attributes.INPUT_MIN);
    const max = this.convertAttributeValueToNumber(
        this.adapter.getInputAttribute(attributes.INPUT_MAX, Thumb.END),
        attributes.INPUT_MAX);
    const value = this.convertAttributeValueToNumber(
        this.adapter.getInputAttribute(attributes.INPUT_VALUE, Thumb.END),
        attributes.INPUT_VALUE);
    const valueStart = this.isRange ?
        this.convertAttributeValueToNumber(
            this.adapter.getInputAttribute(attributes.INPUT_VALUE, Thumb.START),
            attributes.INPUT_VALUE) :
        min;
    const stepAttr =
        this.adapter.getInputAttribute(attributes.INPUT_STEP, Thumb.END);
    const step = stepAttr ?
        this.convertAttributeValueToNumber(stepAttr, attributes.INPUT_STEP) :
        this.step;

    this.validateProperties({min, max, value, valueStart, step});

    this.min = min;
    this.max = max;
    this.value = value;
    this.valueStart = valueStart;
    this.step = step;
    this.numDecimalPlaces = getNumDecimalPlaces(this.step);

    this.valueBeforeDownEvent = value;
    this.valueStartBeforeDownEvent = valueStart;

    this.mousedownOrTouchstartListener =
        this.handleMousedownOrTouchstart.bind(this);
    this.moveListener = this.handleMove.bind(this);
    this.pointerdownListener = this.handlePointerdown.bind(this);
    this.pointerupListener = this.handlePointerup.bind(this);
    this.thumbMouseenterListener = this.handleThumbMouseenter.bind(this);
    this.thumbMouseleaveListener = this.handleThumbMouseleave.bind(this);
    this.inputStartChangeListener = () => {
      this.handleInputChange(Thumb.START);
    };
    this.inputEndChangeListener = () => {
      this.handleInputChange(Thumb.END);
    };
    this.inputStartFocusListener = () => {
      this.handleInputFocus(Thumb.START);
    };
    this.inputEndFocusListener = () => {
      this.handleInputFocus(Thumb.END);
    };
    this.inputStartBlurListener = () => {
      this.handleInputBlur(Thumb.START);
    };
    this.inputEndBlurListener = () => {
      this.handleInputBlur(Thumb.END);
    };
    this.resizeListener = this.handleResize.bind(this);
    this.registerEventHandlers();
  }

  override destroy() {
    this.deregisterEventHandlers();
  }

  setMin(value: number) {
    this.min = value;
    if (!this.isRange) {
      this.valueStart = value;
    }
    this.updateUI();
  }

  setMax(value: number) {
    this.max = value;
    this.updateUI();
  }

  getMin() {
    return this.min;
  }

  getMax() {
    return this.max;
  }

  /**
   * - For single point sliders, returns the thumb value.
   * - For range (two-thumb) sliders, returns the end thumb's value.
   */
  getValue() {
    return this.value;
  }

  /**
   * - For single point sliders, sets the thumb value.
   * - For range (two-thumb) sliders, sets the end thumb's value.
   */
  setValue(value: number) {
    if (this.isRange && value < this.valueStart) {
      throw new Error(
          `end thumb value (${value}) must be >= start thumb ` +
          `value (${this.valueStart})`);
    }

    this.updateValue(value, Thumb.END);
  }

  /**
   * Only applicable for range sliders.
   * @return The start thumb's value.
   */
  getValueStart() {
    if (!this.isRange) {
      throw new Error('`valueStart` is only applicable for range sliders.');
    }

    return this.valueStart;
  }

  /**
   * Only applicable for range sliders. Sets the start thumb's value.
   */
  setValueStart(valueStart: number) {
    if (!this.isRange) {
      throw new Error('`valueStart` is only applicable for range sliders.');
    }
    if (this.isRange && valueStart > this.value) {
      throw new Error(
          `start thumb value (${valueStart}) must be <= end thumb ` +
          `value (${this.value})`);
    }

    this.updateValue(valueStart, Thumb.START);
  }

  setStep(value: number) {
    this.step = value;
    this.numDecimalPlaces = getNumDecimalPlaces(value);

    this.updateUI();
  }

  setIsDiscrete(value: boolean) {
    this.isDiscrete = value;
    this.updateValueIndicatorUI();
    this.updateTickMarksUI();
  }

  getStep() {
    return this.step;
  }

  setHasTickMarks(value: boolean) {
    this.hasTickMarks = value;
    this.updateTickMarksUI();
  }

  getDisabled() {
    return this.isDisabled;
  }

  /**
   * Sets disabled state, including updating styles and thumb tabindex.
   */
  setDisabled(disabled: boolean) {
    this.isDisabled = disabled;

    if (disabled) {
      this.adapter.addClass(cssClasses.DISABLED);

      if (this.isRange) {
        this.adapter.setInputAttribute(
            attributes.INPUT_DISABLED, '', Thumb.START);
      }
      this.adapter.setInputAttribute(attributes.INPUT_DISABLED, '', Thumb.END);
    } else {
      this.adapter.removeClass(cssClasses.DISABLED);

      if (this.isRange) {
        this.adapter.removeInputAttribute(
            attributes.INPUT_DISABLED, Thumb.START);
      }
      this.adapter.removeInputAttribute(attributes.INPUT_DISABLED, Thumb.END);
    }
  }

  /** @return Whether the slider is a range slider. */
  getIsRange() {
    return this.isRange;
  }

  /**
   * - Syncs slider boundingClientRect with the current DOM.
   * - Updates UI based on internal state.
   */
  layout({skipUpdateUI}: {skipUpdateUI?: boolean} = {}) {
    this.rect = this.adapter.getBoundingClientRect();
    if (this.isRange) {
      this.startThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.START);
      this.endThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.END);
    }

    if (!skipUpdateUI) {
      this.updateUI();
    }
  }

  /** Handles resize events on the window. */
  handleResize() {
    this.layout();
  }

  /**
   * Handles pointer down events on the slider root element.
   */
  handleDown(event: PointerEvent|MouseEvent|TouchEvent) {
    if (this.isDisabled) return;

    this.valueStartBeforeDownEvent = this.valueStart;
    this.valueBeforeDownEvent = this.value;

    const clientX = (event as MouseEvent).clientX != null ?
        (event as MouseEvent).clientX :
        (event as TouchEvent).targetTouches[0].clientX;
    this.downEventClientX = clientX;
    const value = this.mapClientXOnSliderScale(clientX);
    this.thumb = this.getThumbFromDownEvent(clientX, value);
    if (this.thumb === null) return;

    this.handleDragStart(event, value, this.thumb);
    this.updateValue(value, this.thumb, {emitInputEvent: true});
  }

  /**
   * Handles pointer move events on the slider root element.
   */
  handleMove(event: PointerEvent|MouseEvent|TouchEvent) {
    if (this.isDisabled) return;

    // Prevent scrolling.
    event.preventDefault();

    const clientX = (event as MouseEvent).clientX != null ?
        (event as MouseEvent).clientX :
        (event as TouchEvent).targetTouches[0].clientX;
    const dragAlreadyStarted = this.thumb != null;
    this.thumb = this.getThumbFromMoveEvent(clientX);
    if (this.thumb === null) return;

    const value = this.mapClientXOnSliderScale(clientX);
    if (!dragAlreadyStarted) {
      this.handleDragStart(event, value, this.thumb);
      this.adapter.emitDragStartEvent(value, this.thumb);
    }
    this.updateValue(value, this.thumb, {emitInputEvent: true});
  }

  /**
   * Handles pointer up events on the slider root element.
   */
  handleUp() {
    if (this.isDisabled || this.thumb === null) return;

    const oldValue = this.thumb === Thumb.START ?
        this.valueStartBeforeDownEvent :
        this.valueBeforeDownEvent;
    const newValue = this.thumb === Thumb.START ? this.valueStart : this.value;
    if (oldValue !== newValue) {
      this.adapter.emitChangeEvent(newValue, this.thumb);
    }

    this.adapter.emitDragEndEvent(newValue, this.thumb);
    this.thumb = null;
  }

  /**
   * For range, discrete slider, shows the value indicator on both thumbs.
   */
  handleThumbMouseenter() {
    if (!this.isDiscrete || !this.isRange) return;

    this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
    this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
  }

  /**
   * For range, discrete slider, hides the value indicator on both thumbs.
   */
  handleThumbMouseleave() {
    if (!this.isDiscrete || !this.isRange) return;
    if (this.adapter.isInputFocused(Thumb.START) ||
        this.adapter.isInputFocused(Thumb.END)) {
      // Leave value indicator shown if either input is focused.
      return;
    }

    this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
    this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
  }

  handleMousedownOrTouchstart(event: MouseEvent|TouchEvent) {
    const moveEventType =
        event.type === 'mousedown' ? 'mousemove' : 'touchmove';
    // After a down event on the slider root, listen for move events on
    // body (so the slider value is updated for events outside of the
    // slider root).
    this.adapter.registerBodyEventHandler(moveEventType, this.moveListener);

    const upHandler = () => {
      this.handleUp();

      // Once the drag is finished (up event on body), remove the move
      // handler.
      this.adapter.deregisterBodyEventHandler(moveEventType, this.moveListener);

      // Also stop listening for subsequent up events.
      this.adapter.deregisterEventHandler('mouseup', upHandler);
      this.adapter.deregisterEventHandler('touchend', upHandler);
    };

    this.adapter.registerBodyEventHandler('mouseup', upHandler);
    this.adapter.registerBodyEventHandler('touchend', upHandler);

    this.handleDown(event);
  }

  handlePointerdown(event: PointerEvent) {
    this.adapter.setPointerCapture(event.pointerId);
    this.adapter.registerEventHandler('pointermove', this.moveListener);

    this.handleDown(event);
  }

  /**
   * Handles input `change` event by setting internal slider value to match
   * input's new value.
   */
  handleInputChange(thumb: Thumb) {
    const value = Number(this.adapter.getInputValue(thumb));
    if (thumb === Thumb.START) {
      this.setValueStart(value);
    } else {
      this.setValue(value);
    }

    this.adapter.emitChangeEvent(
        thumb === Thumb.START ? this.valueStart : this.value, thumb);
    this.adapter.emitInputEvent(
        thumb === Thumb.START ? this.valueStart : this.value, thumb);
  }

  /** Shows activated state and value indicator on thumb(s). */
  handleInputFocus(thumb: Thumb) {
    this.adapter.addThumbClass(cssClasses.THUMB_FOCUSED, thumb);
    if (!this.isDiscrete) return;

    this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, thumb);
    if (this.isRange) {
      const otherThumb = thumb === Thumb.START ? Thumb.END : Thumb.START;
      this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, otherThumb);
    }
  }

  /** Removes activated state and value indicator from thumb(s). */
  handleInputBlur(thumb: Thumb) {
    this.adapter.removeThumbClass(cssClasses.THUMB_FOCUSED, thumb);
    if (!this.isDiscrete) return;

    this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, thumb);
    if (this.isRange) {
      const otherThumb = thumb === Thumb.START ? Thumb.END : Thumb.START;
      this.adapter.removeThumbClass(
          cssClasses.THUMB_WITH_INDICATOR, otherThumb);
    }
  }

  /**
   * Emits custom dragStart event, along with focusing the underlying input.
   */
  private handleDragStart(
      event: PointerEvent|MouseEvent|TouchEvent, value: number, thumb: Thumb) {
    this.adapter.emitDragStartEvent(value, thumb);

    this.adapter.focusInput(thumb);
    // Prevent the input (that we just focused) from losing focus.
    event.preventDefault();
  }

  /**
   * @return The thumb to be moved based on initial down event.
   */
  private getThumbFromDownEvent(clientX: number, value: number): Thumb|null {
    // For single point slider, thumb to be moved is always the END (only)
    // thumb.
    if (!this.isRange) return Thumb.END;

    // Check if event press point is in the bounds of any thumb.
    const thumbStartRect = this.adapter.getThumbBoundingClientRect(Thumb.START);
    const thumbEndRect = this.adapter.getThumbBoundingClientRect(Thumb.END);
    const inThumbStartBounds =
        clientX >= thumbStartRect.left && clientX <= thumbStartRect.right;
    const inThumbEndBounds =
        clientX >= thumbEndRect.left && clientX <= thumbEndRect.right;

    if (inThumbStartBounds && inThumbEndBounds) {
      // Thumbs overlapping. Thumb to be moved cannot be determined yet.
      return null;
    }

    // If press is in bounds for either thumb on down event, that's the thumb
    // to be moved.
    if (inThumbStartBounds) {
      return Thumb.START;
    }
    if (inThumbEndBounds) {
      return Thumb.END;
    }

    // For presses outside the range, return whichever thumb is closer.
    if (value < this.valueStart) {
      return Thumb.START;
    }
    if (value > this.value) {
      return Thumb.END;
    }

    // For presses inside the range, return whichever thumb is closer.
    return (value - this.valueStart <= this.value - value) ? Thumb.START :
                                                             Thumb.END;
  }

  /**
   * @return The thumb to be moved based on move event (based on drag
   *     direction from original down event). Only applicable if thumbs
   *     were overlapping in the down event.
   */
  private getThumbFromMoveEvent(clientX: number): Thumb|null {
    // Thumb has already been chosen.
    if (this.thumb !== null) return this.thumb;

    if (this.downEventClientX === null) {
      throw new Error('`downEventClientX` is null after move event.');
    }

    const moveDistanceUnderThreshold =
        Math.abs(this.downEventClientX - clientX) < numbers.THUMB_UPDATE_MIN_PX;
    if (moveDistanceUnderThreshold) return this.thumb;

    const draggedThumbToLeft = clientX < this.downEventClientX;
    if (draggedThumbToLeft) {
      return this.adapter.isRTL() ? Thumb.END : Thumb.START;
    } else {
      return this.adapter.isRTL() ? Thumb.START : Thumb.END;
    }
  }

  /**
   * Updates UI based on internal state.
   * @param thumb Thumb whose value is being updated. If undefined, UI is
   *     updated for both thumbs based on current internal state.
   */
  private updateUI(thumb?: Thumb) {
    this.updateThumbAndInputAttributes(thumb);
    this.updateThumbAndTrackUI(thumb);
    this.updateValueIndicatorUI(thumb);
    this.updateTickMarksUI();
  }

  /**
   * Updates thumb and input attributes based on current value.
   * @param thumb Thumb whose aria attributes to update.
   */
  private updateThumbAndInputAttributes(thumb?: Thumb) {
    if (!thumb) return;

    const value =
        this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
    const valueStr = String(value);
    this.adapter.setInputAttribute(attributes.INPUT_VALUE, valueStr, thumb);
    if (this.isRange && thumb === Thumb.START) {
      this.adapter.setInputAttribute(attributes.INPUT_MIN, valueStr, Thumb.END);
    } else if (this.isRange && thumb === Thumb.END) {
      this.adapter.setInputAttribute(
          attributes.INPUT_MAX, valueStr, Thumb.START);
    }

    // Sync attribute with property.
    if (this.adapter.getInputValue(thumb) !== valueStr) {
      this.adapter.setInputValue(valueStr, thumb);
    }

    const valueToAriaValueTextFn = this.adapter.getValueToAriaValueTextFn();
    if (valueToAriaValueTextFn) {
      this.adapter.setInputAttribute(
          attributes.ARIA_VALUETEXT, valueToAriaValueTextFn(value), thumb);
    }
  }

  /**
   * Updates value indicator UI based on current value.
   * @param thumb Thumb whose value indicator to update. If undefined, all
   *     thumbs' value indicators are updated.
   */
  private updateValueIndicatorUI(thumb?: Thumb) {
    if (!this.isDiscrete) return;

    const value =
        this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
    this.adapter.setValueIndicatorText(
        value, thumb === Thumb.START ? Thumb.START : Thumb.END);

    if (!thumb && this.isRange) {
      this.adapter.setValueIndicatorText(this.valueStart, Thumb.START);
    }
  }

  /**
   * Updates tick marks UI within slider, based on current min, max, and step.
   */
  private updateTickMarksUI() {
    if (!this.isDiscrete || !this.hasTickMarks) return;

    const numTickMarksInactiveStart = (this.valueStart - this.min) / this.step;
    const numTickMarksActive = (this.value - this.valueStart) / this.step + 1;
    const numTickMarksInactiveEnd = (this.max - this.value) / this.step;
    const tickMarksInactiveStart =
        Array.from<TickMark>({length: numTickMarksInactiveStart})
            .fill(TickMark.INACTIVE);
    const tickMarksActive = Array.from<TickMark>({length: numTickMarksActive})
                                .fill(TickMark.ACTIVE);
    const tickMarksInactiveEnd =
        Array.from<TickMark>({length: numTickMarksInactiveEnd})
            .fill(TickMark.INACTIVE);

    this.adapter.updateTickMarks(tickMarksInactiveStart.concat(tickMarksActive)
                                     .concat(tickMarksInactiveEnd));
  }

  /** Maps clientX to a value on the slider scale. */
  private mapClientXOnSliderScale(clientX: number): number {
    const xPos = clientX - this.rect.left;
    let pctComplete = xPos / this.rect.width;
    if (this.adapter.isRTL()) {
      pctComplete = 1 - pctComplete;
    }

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    const value = this.min + pctComplete * (this.max - this.min);
    if (value === this.max || value === this.min) {
      return value;
    }
    return Number(this.quantize(value).toFixed(this.numDecimalPlaces));
  }

  /** Calculates the quantized value based on step value. */
  private quantize(value: number): number {
    const numSteps = Math.round((value - this.min) / this.step);
    return this.min + numSteps * this.step;
  }

  /**
   * Updates slider value (internal state and UI) based on the given value.
   */
  private updateValue(value: number, thumb: Thumb, {
    emitInputEvent,
  }: {emitInputEvent?: boolean} = {}) {
    value = this.clampValue(value, thumb);

    if (this.isRange && thumb === Thumb.START) {
      // Exit early if current value is the same as the new value.
      if (this.valueStart === value) return;

      this.valueStart = value;
    } else {
      // Exit early if current value is the same as the new value.
      if (this.value === value) return;

      this.value = value;
    }

    this.updateUI(thumb);

    if (emitInputEvent) {
      this.adapter.emitInputEvent(
          thumb === Thumb.START ? this.valueStart : this.value, thumb);
    }
  }

  /**
   * Clamps the given value for the given thumb based on slider properties:
   * - Restricts value within [min, max].
   * - If range slider, clamp start value <= end value, and
   *   end value >= start value.
   */
  private clampValue(value: number, thumb: Thumb): number {
    // Clamp value to [min, max] range.
    value = Math.min(Math.max(value, this.min), this.max);

    const thumbStartMovedPastThumbEnd =
        this.isRange && thumb === Thumb.START && value > this.value;
    if (thumbStartMovedPastThumbEnd) {
      return this.value;
    }
    const thumbEndMovedPastThumbStart =
        this.isRange && thumb === Thumb.END && value < this.valueStart;
    if (thumbEndMovedPastThumbStart) {
      return this.valueStart;
    }

    return value;
  }

  /**
   * Updates the active track and thumb style properties to reflect current
   * value.
   */
  private updateThumbAndTrackUI(thumb?: Thumb) {
    const {max, min} = this;
    const pctComplete = (this.value - this.valueStart) / (max - min);
    const rangePx = pctComplete * this.rect.width;
    const isRtl = this.adapter.isRTL();

    const transformProp =
        HAS_WINDOW ? getCorrectPropertyName(window, 'transform') : 'transform';
    if (this.isRange) {
      const thumbLeftPos = this.adapter.isRTL() ?
          (max - this.value) / (max - min) * this.rect.width :
          (this.valueStart - min) / (max - min) * this.rect.width;
      const thumbRightPos = thumbLeftPos + rangePx;

      this.animFrame.request(AnimationKeys.SLIDER_UPDATE, () => {
        // Set active track styles, accounting for animation direction by
        // setting `transform-origin`.
        const trackAnimatesFromRight = (!isRtl && thumb === Thumb.START) ||
            (isRtl && thumb !== Thumb.START);
        if (trackAnimatesFromRight) {
          this.adapter.setTrackActiveStyleProperty('transform-origin', 'right');
          this.adapter.setTrackActiveStyleProperty('left', 'unset');
          this.adapter.setTrackActiveStyleProperty(
              'right', `${this.rect.width - thumbRightPos}px`);
        } else {
          this.adapter.setTrackActiveStyleProperty('transform-origin', 'left');
          this.adapter.setTrackActiveStyleProperty('right', 'unset');
          this.adapter.setTrackActiveStyleProperty('left', `${thumbLeftPos}px`);
        }
        this.adapter.setTrackActiveStyleProperty(
            transformProp, `scaleX(${pctComplete})`);

        // Set thumb styles.
        const thumbStartPos = isRtl ? thumbRightPos : thumbLeftPos;
        const thumbEndPos = this.adapter.isRTL() ? thumbLeftPos : thumbRightPos;
        if (thumb === Thumb.START || !thumb || !this.initialStylesRemoved) {
          this.adapter.setThumbStyleProperty(
              transformProp, `translateX(${thumbStartPos}px)`, Thumb.START);
        }
        if (thumb === Thumb.END || !thumb || !this.initialStylesRemoved) {
          this.adapter.setThumbStyleProperty(
              transformProp, `translateX(${thumbEndPos}px)`, Thumb.END);
        }

        this.removeInitialStyles(isRtl);
        this.updateOverlappingThumbsUI(thumbStartPos, thumbEndPos, thumb);
      });
    } else {
      this.animFrame.request(AnimationKeys.SLIDER_UPDATE, () => {
        const thumbStartPos = isRtl ? this.rect.width - rangePx : rangePx;
        this.adapter.setThumbStyleProperty(
            transformProp, `translateX(${thumbStartPos}px)`, Thumb.END);
        this.adapter.setTrackActiveStyleProperty(
            transformProp, `scaleX(${pctComplete})`);

        this.removeInitialStyles(isRtl);
      });
    }
  }

  /**
   * Removes initial inline styles if not already removed. `left:<...>%`
   * inline styles can be added to position the thumb correctly before JS
   * initialization. However, they need to be removed before the JS starts
   * positioning the thumb. This is because the JS uses
   * `transform:translateX(<...>)px` (for performance reasons) to position
   * the thumb (which is not possible for initial styles since we need the
   * bounding rect measurements).
   */
  private removeInitialStyles(isRtl: boolean) {
    if (this.initialStylesRemoved) return;

    // Remove thumb position properties that were added for initial render.
    const position = isRtl ? 'right' : 'left';
    this.adapter.removeThumbStyleProperty(position, Thumb.END);
    if (this.isRange) {
      this.adapter.removeThumbStyleProperty(position, Thumb.START);
    }

    this.initialStylesRemoved = true;

    this.resetTrackAndThumbAnimation();
  }

  /**
   * Resets track/thumb animation to prevent animation when adding
   * `transform` styles to thumb initially.
   */
  private resetTrackAndThumbAnimation() {
    if (!this.isDiscrete) return;

    // Set transition properties to default (no animation), so that the
    // newly added `transform` styles do not animate thumb/track from
    // their default positions.
    const transitionProp = HAS_WINDOW ?
        getCorrectPropertyName(window, 'transition') :
        'transition';
    const transitionDefault = 'all 0s ease 0s';
    this.adapter.setThumbStyleProperty(
        transitionProp, transitionDefault, Thumb.END);
    if (this.isRange) {
      this.adapter.setThumbStyleProperty(
          transitionProp, transitionDefault, Thumb.START);
    }
    this.adapter.setTrackActiveStyleProperty(transitionProp, transitionDefault);

    // In the next frame, remove the transition inline styles we just
    // added, such that any animations added in the CSS can now take effect.
    requestAnimationFrame(() => {
      this.adapter.removeThumbStyleProperty(transitionProp, Thumb.END);
      this.adapter.removeTrackActiveStyleProperty(transitionProp);
      if (this.isRange) {
        this.adapter.removeThumbStyleProperty(transitionProp, Thumb.START);
      }
    });
  }

  /**
   * Adds THUMB_TOP class to active thumb if thumb knobs overlap; otherwise
   * removes THUMB_TOP class from both thumbs.
   * @param thumb Thumb that is active (being moved).
   */
  private updateOverlappingThumbsUI(
      thumbStartPos: number, thumbEndPos: number, thumb?: Thumb) {
    let thumbsOverlap = false;
    if (this.adapter.isRTL()) {
      const startThumbLeftEdge = thumbStartPos - this.startThumbKnobWidth / 2;
      const endThumbRightEdge = thumbEndPos + this.endThumbKnobWidth / 2;
      thumbsOverlap = endThumbRightEdge >= startThumbLeftEdge;
    } else {
      const startThumbRightEdge = thumbStartPos + this.startThumbKnobWidth / 2;
      const endThumbLeftEdge = thumbEndPos - this.endThumbKnobWidth / 2;
      thumbsOverlap = startThumbRightEdge >= endThumbLeftEdge;
    }

    if (thumbsOverlap) {
      this.adapter.addThumbClass(
          cssClasses.THUMB_TOP,
          // If no thumb was dragged (in the case of initial layout), end
          // thumb is on top by default.
          thumb || Thumb.END);
      this.adapter.removeThumbClass(
          cssClasses.THUMB_TOP,
          thumb === Thumb.START ? Thumb.END : Thumb.START);
    } else {
      this.adapter.removeThumbClass(cssClasses.THUMB_TOP, Thumb.START);
      this.adapter.removeThumbClass(cssClasses.THUMB_TOP, Thumb.END);
    }
  }

  /**
   * Converts attribute value to a number, e.g. '100' => 100. Throws errors
   * for invalid values.
   * @param attributeValue Attribute value, e.g. 100.
   * @param attributeName Attribute name, e.g. `aria-valuemax`.
   */
  private convertAttributeValueToNumber(
      attributeValue: string|null, attributeName: string) {
    if (attributeValue === null) {
      throw new Error(
          `MDCSliderFoundation: \`${attributeName}\` must be non-null.`);
    }

    const value = Number(attributeValue);
    if (isNaN(value)) {
      throw new Error(
          `MDCSliderFoundation: \`${attributeName}\` value is ` +
          `\`${attributeValue}\`, but must be a number.`);
    }

    return value;
  }

  /** Checks that the given properties are valid slider values. */
  private validateProperties({min, max, value, valueStart, step}: {
    min: number,
    max: number,
    value: number,
    valueStart: number,
    step: number
  }) {
    if (min >= max) {
      throw new Error(
          `MDCSliderFoundation: min must be strictly less than max. ` +
          `Current: [min: ${min}, max: ${max}]`);
    }

    if (step <= 0) {
      throw new Error(
          `MDCSliderFoundation: step must be a positive number. ` +
          `Current step: ${this.step}`);
    }

    if (this.isRange) {
      if (value < min || value > max || valueStart < min || valueStart > max) {
        throw new Error(
            `MDCSliderFoundation: values must be in [min, max] range. ` +
            `Current values: [start value: ${valueStart}, end value: ${
                value}]`);
      }

      if (valueStart > value) {
        throw new Error(
            `MDCSliderFoundation: start value must be <= end value. ` +
            `Current values: [start value: ${valueStart}, end value: ${
                value}]`);
      }

      const numStepsValueStartFromMin = (valueStart - min) / step;
      const numStepsValueFromMin = (value - min) / step;
      if ((numStepsValueStartFromMin % 1) !== 0 ||
          (numStepsValueFromMin % 1) !== 0) {
        throw new Error(
            `MDCSliderFoundation: Slider values must be valid based on the ` +
            `step value. Current values: [start value: ${valueStart}, ` +
            `end value: ${value}]`);
      }
    } else {  // Single point slider.
      if (value < min || value > max) {
        throw new Error(
            `MDCSliderFoundation: value must be in [min, max] range. ` +
            `Current value: ${value}`);
      }

      const numStepsValueFromMin = (value - min) / step;
      if ((numStepsValueFromMin % 1) !== 0) {
        throw new Error(
            `MDCSliderFoundation: Slider value must be valid based on the ` +
            `step value. Current value: ${value}`);
      }
    }
  }

  private registerEventHandlers() {
    this.adapter.registerWindowEventHandler('resize', this.resizeListener);

    if (MDCSliderFoundation.SUPPORTS_POINTER_EVENTS) {
      // If supported, use pointer events API with #setPointerCapture.
      this.adapter.registerEventHandler(
          'pointerdown', this.pointerdownListener);
      this.adapter.registerEventHandler('pointerup', this.pointerupListener);
    } else {
      // Otherwise, fall back to mousedown/touchstart events.
      this.adapter.registerEventHandler(
          'mousedown', this.mousedownOrTouchstartListener);
      this.adapter.registerEventHandler(
          'touchstart', this.mousedownOrTouchstartListener);
    }

    if (this.isRange) {
      this.adapter.registerThumbEventHandler(
          Thumb.START, 'mouseenter', this.thumbMouseenterListener);
      this.adapter.registerThumbEventHandler(
          Thumb.START, 'mouseleave', this.thumbMouseleaveListener);

      this.adapter.registerInputEventHandler(
          Thumb.START, 'change', this.inputStartChangeListener);
      this.adapter.registerInputEventHandler(
          Thumb.START, 'focus', this.inputStartFocusListener);
      this.adapter.registerInputEventHandler(
          Thumb.START, 'blur', this.inputStartBlurListener);
    }

    this.adapter.registerThumbEventHandler(
        Thumb.END, 'mouseenter', this.thumbMouseenterListener);
    this.adapter.registerThumbEventHandler(
        Thumb.END, 'mouseleave', this.thumbMouseleaveListener);

    this.adapter.registerInputEventHandler(
        Thumb.END, 'change', this.inputEndChangeListener);
    this.adapter.registerInputEventHandler(
        Thumb.END, 'focus', this.inputEndFocusListener);
    this.adapter.registerInputEventHandler(
        Thumb.END, 'blur', this.inputEndBlurListener);
  }

  private deregisterEventHandlers() {
    this.adapter.deregisterWindowEventHandler('resize', this.resizeListener);

    if (MDCSliderFoundation.SUPPORTS_POINTER_EVENTS) {
      this.adapter.deregisterEventHandler(
          'pointerdown', this.pointerdownListener);
      this.adapter.deregisterEventHandler('pointerup', this.pointerupListener);
    } else {
      this.adapter.deregisterEventHandler(
          'mousedown', this.mousedownOrTouchstartListener);
      this.adapter.deregisterEventHandler(
          'touchstart', this.mousedownOrTouchstartListener);
    }

    if (this.isRange) {
      this.adapter.deregisterThumbEventHandler(
          Thumb.START, 'mouseenter', this.thumbMouseenterListener);
      this.adapter.deregisterThumbEventHandler(
          Thumb.START, 'mouseleave', this.thumbMouseleaveListener);

      this.adapter.deregisterInputEventHandler(
          Thumb.START, 'change', this.inputStartChangeListener);
      this.adapter.deregisterInputEventHandler(
          Thumb.START, 'focus', this.inputStartFocusListener);
      this.adapter.deregisterInputEventHandler(
          Thumb.START, 'blur', this.inputStartBlurListener);
    }

    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'mouseenter', this.thumbMouseenterListener);
    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'mouseleave', this.thumbMouseleaveListener);

    this.adapter.deregisterInputEventHandler(
        Thumb.END, 'change', this.inputEndChangeListener);
    this.adapter.deregisterInputEventHandler(
        Thumb.END, 'focus', this.inputEndFocusListener);
    this.adapter.deregisterInputEventHandler(
        Thumb.END, 'blur', this.inputEndBlurListener);
  }

  private handlePointerup() {
    this.handleUp();

    this.adapter.deregisterEventHandler('pointermove', this.moveListener);
  }
}

function isIOS() {
  // Source:
  // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
  return [
    'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone',
    'iPod'
  ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}

/**
 * Given a number, returns the number of digits that appear after the
 * decimal point.
 * See
 * https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
 */
function getNumDecimalPlaces(n: number): number {
  // Pull out the fraction and the exponent.
  const match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(String(n));
  // NaN or Infinity or integer.
  // We arbitrarily decide that Infinity is integral.
  if (!match) return 0;

  const fraction = match[1] || '';  // E.g. 1.234e-2 => 234
  const exponent = match[2] || 0;   // E.g. 1.234e-2 => -2
  // Count the number of digits in the fraction and subtract the
  // exponent to simulate moving the decimal point left by exponent places.
  // 1.234e+2 has 1 fraction digit and '234'.length -  2 == 1
  // 1.234e-2 has 5 fraction digit and '234'.length - -2 == 5
  return Math.max(
      0,  // lower limit
      (fraction === '0' ? 0 : fraction.length) - Number(exponent));
}
