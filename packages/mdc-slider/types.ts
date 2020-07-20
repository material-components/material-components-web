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

/** Tick mark enum, for discrete sliders. */
export enum TickMark {
  ACTIVE,
  INACTIVE,
}

/**
 * Thumb types: range slider has two thumbs (START, END) whereas single point
 * slider only has one thumb (END).
 */
export enum Thumb {
  // Thumb at start of slider (e.g. in LTR mode, left thumb on range slider).
  START = 1,
  // Thumb at end of slider (e.g. in LTR mode, right thumb on range slider,
  // or only thumb on single point slider).
  END,
}

/** Interface for `detail` of slider custom change and input events. */
export interface MDCSliderChangeEventDetail {
  // The new value after change.
  value: number;

  // The thumb for which the value has changed:
  // - For single point slider, this will always be Thumb.END.
  // - For range slider, either Thumb.START or Thumb.END.
  thumb: Thumb;
}
