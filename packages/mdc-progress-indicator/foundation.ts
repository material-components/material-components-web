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

/**
 * The interface for the foundation of MDC's progress indicators.
 *
 * @public
 */
export interface MDCProgressIndicatorFoundation {
  /**
   * Toggles the component between the determinate and indeterminate state.
   *
   * @param isDeterminate - Whether the component is in determinate state
   */
  setDeterminate(isDeterminate: boolean): void;

  /**
   * @return Whether the component is determinate.
   */
  isDeterminate(): boolean;

  /**
   * Sets the current progress value.
   *
   * @param value - the current progress value, should be between [0,1]
   */
  setProgress(value: number): void;

  /**
   * @return the current progress value [0,1];
   */
  getProgress(): number;

  /**
   * Puts the component in the open state.
   */
  open(): void;

  /**
   * Puts the component in the closed state.
   */
  close(): void;

  /**
   * @return Whether the component is closed.
   */
  isClosed(): boolean;
}
