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

import {getCorrectPropertyName} from '@material/animation/util';
import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';
import {KEY, normalizeKey} from '@material/dom/keyboard';

import {MDCSliderAdapter} from './adapter';
import {attributes, cssClasses, numbers} from './constants';
import {Thumb, TickMark} from './types';

// Accessing `window` without a `typeof` check will throw on Node environments.
const HAS_WINDOW = typeof window !== 'undefined';

/**
 * Foundation class for slider. Responsibilities include:
 * - Updating slider values (internal state and DOM updates) based on client
 *   'x' position.
 * - Updating DOM after slider property updates (e.g. min, max).
 */
export class MDCSliderFoundation extends MDCFoundation<MDCSliderAdapter> {
  static SUPPORTS_POINTER_EVENTS = HAS_WINDOW && Boolean(window.PointerEvent);

  // Whether the initial styles (to position the thumb, before component
  // initialization) have been removed.
  private initialStylesRemoved = false;

  private min!: number;       // Assigned in init()
  private max!: number;       // Assigned in init()
  // If `isRange`, this is the value of Thumb.START. Otherwise, defaults to min.
  private valueStart!: number;  // Assigned in init()
  // If `isRange`, this it the value of Thumb.END. Otherwise, it is the
  // value of the single thumb.
  private value!: number;     // Assigned in init()
  private rect!: ClientRect;  // Assigned in layout() via init()

  private isDisabled = false;

  private isDiscrete = false;
  // Step value for discrete sliders.
  private step = 1;
  private bigStep = this.step * numbers.BIG_STEP_FACTOR;
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
  private thumbStartKeydownListener!:
      SpecificEventListener<'keydown'>;  // Assigned in #initialize.
  private thumbEndKeydownListener!:
      SpecificEventListener<'keydown'>;  // Assigned in #initialize.
  private thumbFocusOrMouseenterListener!:
      SpecificEventListener<'focus'|'mouseenter'>;  // Assigned in #initialize.
  private thumbBlurOrMouseleaveListener!:
      SpecificEventListener<'blur'|'mouseleave'>;  // Assigned in #initialize.
  private resizeListener!:
      SpecificEventListener<'resize'>;  // Assigned in #initialize.

  init() {
    this.isDisabled = this.adapter.hasClass(cssClasses.DISABLED);
    this.isDiscrete = this.adapter.hasClass(cssClasses.DISCRETE);
    this.hasTickMarks = this.adapter.hasClass(cssClasses.TICK_MARKS);
    this.isRange = this.adapter.hasClass(cssClasses.RANGE);

    const min = this.convertAttributeValueToNumber(
        this.adapter.getThumbAttribute(attributes.ARIA_VALUEMIN, Thumb.END),
        attributes.ARIA_VALUEMIN);
    const max = this.convertAttributeValueToNumber(
        this.adapter.getThumbAttribute(attributes.ARIA_VALUEMAX, Thumb.END),
        attributes.ARIA_VALUEMAX);
    const value = this.convertAttributeValueToNumber(
        this.adapter.getThumbAttribute(attributes.ARIA_VALUENOW, Thumb.END),
        attributes.ARIA_VALUENOW);
    const valueStart = this.isRange ?
        this.convertAttributeValueToNumber(
            this.adapter.getThumbAttribute(
                attributes.ARIA_VALUENOW, Thumb.START),
            attributes.ARIA_VALUENOW) :
        min;

    this.validateProperties({min, max, value, valueStart});

    this.min = min;
    this.max = max;
    this.value = value;
    this.valueStart = valueStart;

    this.valueBeforeDownEvent = value;
    this.valueStartBeforeDownEvent = valueStart;

    if (this.isDiscrete) {
      const step = this.convertAttributeValueToNumber(
          this.adapter.getAttribute(attributes.DATA_ATTR_STEP),
          attributes.DATA_ATTR_STEP);
      if (step <= 0) {
        throw new Error(
            `MDCSliderFoundation: step must be a positive number. ` +
            `Current step: ${step}`);
      }
      this.step = step;

      const bigStep = this.adapter.getAttribute(attributes.DATA_ATTR_BIG_STEP);
      this.bigStep = bigStep !== null ?
          this.convertAttributeValueToNumber(
              bigStep, attributes.DATA_ATTR_BIG_STEP) :
          step * numbers.BIG_STEP_FACTOR;
    }

    this.mousedownOrTouchstartListener =
        this.handleMousedownOrTouchstart.bind(this);
    this.moveListener = this.handleMove.bind(this);
    this.pointerdownListener = this.handlePointerdown.bind(this);
    this.pointerupListener = this.handlePointerup.bind(this);
    this.thumbStartKeydownListener = (event: KeyboardEvent) => {
      this.handleThumbKeydown(event, Thumb.START);
    };
    this.thumbEndKeydownListener = (event: KeyboardEvent) => {
      this.handleThumbKeydown(event, Thumb.END);
    };
    this.thumbFocusOrMouseenterListener =
        this.handleThumbFocusOrMouseenter.bind(this);
    this.thumbBlurOrMouseleaveListener =
        this.handleThumbBlurOrMouseleave.bind(this);
    this.resizeListener = this.layout.bind(this);
    this.registerEventHandlers();
  }

  destroy() {
    this.deregisterEventHandlers();
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

  getStep() {
    return this.step;
  }

  getBigStep() {
    return this.bigStep;
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
        this.adapter.setThumbAttribute('tabindex', '-1', Thumb.START);
        this.adapter.setThumbAttribute('aria-disabled', 'true', Thumb.START);
      }
      this.adapter.setThumbAttribute('tabindex', '-1', Thumb.END);
      this.adapter.setThumbAttribute('aria-disabled', 'true', Thumb.END);
    } else {
      this.adapter.removeClass(cssClasses.DISABLED);

      if (this.isRange) {
        this.adapter.setThumbAttribute('tabindex', '0', Thumb.START);
        this.adapter.setThumbAttribute('aria-disabled', 'false', Thumb.START);
      }
      this.adapter.setThumbAttribute('tabindex', '0', Thumb.END);
      this.adapter.setThumbAttribute('aria-disabled', 'false', Thumb.END);
    }
  }

  /**
   * - Syncs slider boundingClientRect with the current DOM.
   * - Updates UI based on internal state.
   */
  layout() {
    this.rect = this.adapter.getBoundingClientRect();
    if (this.isRange) {
      this.startThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.START);
      this.endThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.END);
    }

    this.updateUI();
  }

  /**
   * Handles pointer down events on the slider root element.
   */
  handleDown(event: PointerEvent|MouseEvent|TouchEvent) {
    if (this.isDisabled) return;

    this.valueStartBeforeDownEvent = this.valueStart;
    this.valueBeforeDownEvent = this.value;

    const clientX = event instanceof MouseEvent ?
        event.clientX :
        event.targetTouches[0].clientX;
    this.downEventClientX = clientX;
    const value = this.mapClientXOnSliderScale(clientX);
    this.thumb = this.getThumbFromDownEvent(clientX, value);
    if (this.thumb === null) return;

    // Presses within the range do not invoke slider updates.
    const newValueInCurrentRange =
        this.isRange && value >= this.valueStart && value <= this.value;
    if (newValueInCurrentRange) return;

    this.updateValue(value, this.thumb, {emitInputEvent: true});
  }

  /**
   * Handles pointer move events on the slider root element.
   */
  handleMove(event: PointerEvent|MouseEvent|TouchEvent) {
    if (this.isDisabled) return;

    // Prevent scrolling.
    event.preventDefault();

    const clientX = event instanceof MouseEvent ?
        event.clientX :
        event.targetTouches[0].clientX;
    this.thumb = this.getThumbFromMoveEvent(clientX);
    if (this.thumb === null) return;

    const value = this.mapClientXOnSliderScale(clientX);
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

    this.thumb = null;
  }

  /**
   * Handles keydown events on the slider thumbs.
   */
  handleThumbKeydown(event: KeyboardEvent, thumb: Thumb) {
    if (this.isDisabled) return;

    const key = normalizeKey(event);
    if (key !== KEY.ARROW_LEFT && key !== KEY.ARROW_UP &&
        key !== KEY.ARROW_RIGHT && key !== KEY.ARROW_DOWN && key !== KEY.HOME &&
        key !== KEY.END && key !== KEY.PAGE_UP && key !== KEY.PAGE_DOWN) {
      return;
    }

    // Prevent scrolling.
    event.preventDefault();

    const value = this.getValueForKey(key, thumb);
    const currentValue = thumb === Thumb.START ? this.valueStart : this.value;
    if (value === currentValue) return;

    this.updateValue(
        this.getValueForKey(key, thumb), thumb,
        {emitChangeEvent: true, emitInputEvent: true});
  }

  /**
   * Shows the value indicator, as follows:
   * - Range slider: Shows value indicator on both thumbs, on either hover or
   *   focus.
   * - Single point slider: Shows value indicator on thumb, only on focus.
   */
  handleThumbFocusOrMouseenter(event: FocusEvent|MouseEvent) {
    if (!this.isDiscrete) return;

    if (this.isRange) {
      this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
      this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
    } else if (event.type === 'focus') {
      // If single point slider, only show value indicator on focus, not hover.
      this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
    }
  }

  /**
   * Hides the value indicator, as follows:
   * - Range slider: Hides value indicator on both thumbs, on either blur
   *   or mouseleave, provided there is no thumb already focused.
   * - Single point slider: Hides value indicator on thumb, on blur.
   */
  handleThumbBlurOrMouseleave(event: FocusEvent|MouseEvent) {
    if (!this.isDiscrete) return;

    if (this.isRange && !this.adapter.isThumbFocused(Thumb.START) &&
        !this.adapter.isThumbFocused(Thumb.END)) {
      this.adapter.removeThumbClass(
          cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
      this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
    } else if (!this.isRange && event.type === 'blur') {
      this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
    }
  }

  /**
   * @return Returns new value for the given thumb, based on key pressed.
   *     E.g. ARROW_DOWN on discrete slider decrements the current thumb
   *     value by the `step` value.
   */
  private getValueForKey(key: string, thumb: Thumb): number {
    const delta = this.step || (this.max - this.min) / 100;
    const deltaBigStep = this.bigStep || (this.max - this.min) / 10;
    const value = thumb === Thumb.START ? this.valueStart : this.value;
    switch (key) {
      case KEY.ARROW_LEFT:
        return this.adapter.isRTL() ? value + delta : value - delta;
      case KEY.ARROW_DOWN:
        return value - delta;
      case KEY.ARROW_RIGHT:
        return this.adapter.isRTL() ? value - delta : value + delta;
      case KEY.ARROW_UP:
        return value + delta;
      case KEY.HOME:
        return this.min;
      case KEY.END:
        return this.max;
      case KEY.PAGE_DOWN:
        return value - deltaBigStep;
      case KEY.PAGE_UP:
        return value + deltaBigStep;
      default:
        return value;
    }
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

    // Otherwise, if press occurred outside of the range, return either start
    // or end thumb based on which the press is closer to.
    if (value < this.valueStart) {
      return Thumb.START;
    }
    if (value > this.value) {
      return Thumb.END;
    }

    return null;
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
    this.updateThumbAndTrackUI(thumb);
    this.updateValueIndicatorUI(thumb);
    this.updateTickMarksUI();
  }

  /**
   * @param thumb Thumb whose value indicator to update.
   */
  private updateValueIndicatorUI(thumb?: Thumb) {
    if (!this.isDiscrete || !thumb) return;

    const value =
        this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
    this.adapter.setValueIndicatorText(
        value, thumb === Thumb.START ? Thumb.START : Thumb.END);
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
  private mapClientXOnSliderScale(clientX: number) {
    const xPos = clientX - this.rect.left;
    let pctComplete = xPos / this.rect.width;
    if (this.adapter.isRTL()) {
      pctComplete = 1 - pctComplete;
    }

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    const value = this.min + pctComplete * (this.max - this.min);
    if (this.isDiscrete && value !== this.max && value !== this.min) {
      return this.quantize(value);
    }
    return value;
  }

  /**
   * Updates slider value (internal state and UI) based on the given value.
   */
  private updateValue(value: number, thumb: Thumb, {
    emitInputEvent,
    emitChangeEvent
  }: {emitInputEvent?: boolean, emitChangeEvent?: boolean} = {}) {
    value = this.clampValue(value, thumb);

    if (this.isRange && thumb === Thumb.START) {
      // Exit early if current value is the same as the new value.
      if (this.valueStart === value) return;

      this.valueStart = value;
      this.adapter.setThumbAttribute(
          attributes.ARIA_VALUENOW, String(this.valueStart), Thumb.START);
    } else {
      // Exit early if current value is the same as the new value.
      if (this.value === value) return;

      this.value = value;
      this.adapter.setThumbAttribute(
          attributes.ARIA_VALUENOW, String(this.value), Thumb.END);
    }

    this.updateUI(thumb);

    if (emitInputEvent) {
      this.adapter.emitInputEvent(
          thumb === Thumb.START ? this.valueStart : this.value, thumb);
    }
    if (emitChangeEvent) {
      this.adapter.emitChangeEvent(
          thumb === Thumb.START ? this.valueStart : this.value, thumb);
    }
  }

  /** Calculates the quantized value based on step value. */
  private quantize(value: number): number {
    const numSteps = Math.round(value / this.step);
    return numSteps * this.step;
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

      requestAnimationFrame(() => {
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
        if (thumb === Thumb.START || !thumb) {
          this.adapter.setThumbStyleProperty(
              transformProp, `translateX(${thumbStartPos}px)`, Thumb.START);
        }
        if (thumb === Thumb.END || !thumb) {
          this.adapter.setThumbStyleProperty(
              transformProp, `translateX(${thumbEndPos}px)`, Thumb.END);
        }

        this.removeInitialStyles(isRtl);
        this.updateOverlappingThumbsUI(thumbStartPos, thumbEndPos, thumb);
        this.focusThumbIfDragging(thumb);
      });
    } else {
      requestAnimationFrame(() => {
        const thumbStartPos = isRtl ? this.rect.width - rangePx : rangePx;
        this.adapter.setThumbStyleProperty(
            transformProp, `translateX(${thumbStartPos}px)`, Thumb.END);
        this.adapter.setTrackActiveStyleProperty(
            transformProp, `scaleX(${pctComplete})`);

        this.removeInitialStyles(isRtl);
        this.focusThumbIfDragging(thumb);
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

    const position = isRtl ? 'right' : 'left';
    this.adapter.removeThumbStyleProperty(position, Thumb.END);
    if (this.isRange) {
      this.adapter.removeThumbStyleProperty(position, Thumb.START);
    }

    this.initialStylesRemoved = true;
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

  private focusThumbIfDragging(thumb?: Thumb) {
    if (!thumb) return;
    // Not dragging thumb via pointer interaction.
    if (this.thumb === null) return;

    if (!this.adapter.isThumbFocused(thumb)) {
      this.adapter.focusThumb(thumb);
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
  private validateProperties(
      {min, max, value, valueStart}:
          {min: number, max: number, value: number, valueStart: number}) {
    if (min >= max) {
      throw new Error(
          `MDCSliderFoundation: min must be strictly less than max. ` +
          `Current: [min: ${min}, max: ${max}]`);
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
    } else {  // Single point slider.
      if (value < min || value > max) {
        throw new Error(
            `MDCSliderFoundation: value must be in [min, max] range. ` +
            `Current value: ${value}`);
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
          Thumb.START, 'keydown', this.thumbStartKeydownListener);
      this.adapter.registerThumbEventHandler(
          Thumb.START, 'focus', this.thumbFocusOrMouseenterListener);
      this.adapter.registerThumbEventHandler(
          Thumb.START, 'mouseenter', this.thumbFocusOrMouseenterListener);
      this.adapter.registerThumbEventHandler(
          Thumb.START, 'blur', this.thumbBlurOrMouseleaveListener);
      this.adapter.registerThumbEventHandler(
          Thumb.START, 'mouseleave', this.thumbBlurOrMouseleaveListener);
    }

    this.adapter.registerThumbEventHandler(
        Thumb.END, 'keydown', this.thumbEndKeydownListener);
    this.adapter.registerThumbEventHandler(
        Thumb.END, 'focus', this.thumbFocusOrMouseenterListener);
    this.adapter.registerThumbEventHandler(
        Thumb.END, 'mouseenter', this.thumbFocusOrMouseenterListener);
    this.adapter.registerThumbEventHandler(
        Thumb.END, 'blur', this.thumbBlurOrMouseleaveListener);
    this.adapter.registerThumbEventHandler(
        Thumb.END, 'mouseleave', this.thumbBlurOrMouseleaveListener);
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
          Thumb.START, 'keydown', this.thumbStartKeydownListener);
      this.adapter.deregisterThumbEventHandler(
          Thumb.START, 'focus', this.thumbFocusOrMouseenterListener);
      this.adapter.deregisterThumbEventHandler(
          Thumb.START, 'mouseenter', this.thumbFocusOrMouseenterListener);
      this.adapter.deregisterThumbEventHandler(
          Thumb.START, 'blur', this.thumbBlurOrMouseleaveListener);
      this.adapter.deregisterThumbEventHandler(
          Thumb.START, 'mouseleave', this.thumbBlurOrMouseleaveListener);
    }

    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'keydown', this.thumbEndKeydownListener);
    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'focus', this.thumbFocusOrMouseenterListener);
    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'mouseenter', this.thumbFocusOrMouseenterListener);
    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'blur', this.thumbBlurOrMouseleaveListener);
    this.adapter.deregisterThumbEventHandler(
        Thumb.END, 'mouseleave', this.thumbBlurOrMouseleaveListener);
  }

  private handleMousedownOrTouchstart(event: MouseEvent|TouchEvent) {
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

  private handlePointerdown(event: PointerEvent) {
    this.adapter.setPointerCapture(event.pointerId);
    this.adapter.registerEventHandler('pointermove', this.moveListener);

    this.handleDown(event);
  }

  private handlePointerup() {
    this.handleUp();

    this.adapter.deregisterEventHandler('pointermove', this.moveListener);
  }
}
