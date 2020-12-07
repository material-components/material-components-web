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

export const cssClasses = {
  CLOSED_CLASS: 'mdc-linear-progress--closed',
  CLOSED_ANIMATION_OFF_CLASS: 'mdc-linear-progress--closed-animation-off',
  INDETERMINATE_CLASS: 'mdc-linear-progress--indeterminate',
  REVERSED_CLASS: 'mdc-linear-progress--reversed',
  ANIMATION_READY_CLASS: 'mdc-linear-progress--animation-ready',
};

export const strings = {
  ARIA_VALUEMAX: 'aria-valuemax',
  ARIA_VALUEMIN: 'aria-valuemin',
  ARIA_VALUENOW: 'aria-valuenow',
  BUFFER_BAR_SELECTOR: '.mdc-linear-progress__buffer-bar',
  FLEX_BASIS: 'flex-basis',
  PRIMARY_BAR_SELECTOR: '.mdc-linear-progress__primary-bar',
};

// these are percentages pulled from keyframes.scss
export const animationDimensionPercentages = {
  PRIMARY_HALF: .8367142,
  PRIMARY_FULL: 2.00611057,
  SECONDARY_QUARTER: .37651913,
  SECONDARY_HALF: .84386165,
  SECONDARY_FULL: 1.60277782,
};
