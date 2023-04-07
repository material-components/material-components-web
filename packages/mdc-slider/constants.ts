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

/** Slider element classes. */
export const cssClasses = {
  DISABLED: 'mdc-slider--disabled',
  DISCRETE: 'mdc-slider--discrete',
  INPUT: 'mdc-slider__input',
  RANGE: 'mdc-slider--range',
  THUMB: 'mdc-slider__thumb',
  // Applied when thumb is in the focused state.
  THUMB_FOCUSED: 'mdc-slider__thumb--focused',
  THUMB_KNOB: 'mdc-slider__thumb-knob',
  // Class added to the top thumb (for overlapping thumbs in range slider).
  THUMB_TOP: 'mdc-slider__thumb--top',
  THUMB_WITH_INDICATOR: 'mdc-slider__thumb--with-indicator',
  TICK_MARKS: 'mdc-slider--tick-marks',
  TICK_MARKS_CONTAINER: 'mdc-slider__tick-marks',
  TICK_MARK_ACTIVE: 'mdc-slider__tick-mark--active',
  TICK_MARK_INACTIVE: 'mdc-slider__tick-mark--inactive',
  TRACK: 'mdc-slider__track',
  // The active track fill element that will be scaled as the value changes.
  TRACK_ACTIVE: 'mdc-slider__track--active_fill',
  VALUE_INDICATOR_CONTAINER: 'mdc-slider__value-indicator-container',
  VALUE_INDICATOR_TEXT: 'mdc-slider__value-indicator-text',
};

/** Slider numbers. */
export const numbers = {
  // Default step size.
  STEP_SIZE: 1,
  // Default minimum difference between the start and end values.
  MIN_RANGE: 0,
  // Minimum absolute difference between clientX of move event / down event
  // for which to update thumb, in the case of overlapping thumbs.
  // This is needed to reduce chances of choosing the thumb based on
  // pointer jitter.
  THUMB_UPDATE_MIN_PX: 5,
};

/** Slider attributes. */
export const attributes = {
  ARIA_VALUETEXT: 'aria-valuetext',
  INPUT_DISABLED: 'disabled',
  INPUT_MIN: 'min',
  INPUT_MAX: 'max',
  INPUT_VALUE: 'value',
  INPUT_STEP: 'step',
  DATA_MIN_RANGE: 'data-min-range',
};

/** Slider events. */
export const events = {
  CHANGE: 'MDCSlider:change',
  INPUT: 'MDCSlider:input',
};

/** Slider strings. */
export const strings = {
  VAR_VALUE_INDICATOR_CARET_LEFT: '--slider-value-indicator-caret-left',
  VAR_VALUE_INDICATOR_CARET_RIGHT: '--slider-value-indicator-caret-right',
  VAR_VALUE_INDICATOR_CARET_TRANSFORM:
      '--slider-value-indicator-caret-transform',
  VAR_VALUE_INDICATOR_CONTAINER_LEFT: '--slider-value-indicator-container-left',
  VAR_VALUE_INDICATOR_CONTAINER_RIGHT:
      '--slider-value-indicator-container-right',
  VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM:
      '--slider-value-indicator-container-transform',
};
