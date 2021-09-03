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

import {MDCFoundation} from '@material/base/foundation';
import {MDCProgressIndicatorFoundation} from '@material/progress-indicator/foundation';
import {MDCCircularProgressAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCCircularProgressFoundation extends
    MDCFoundation<MDCCircularProgressAdapter> implements
        MDCProgressIndicatorFoundation {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get defaultAdapter(): MDCCircularProgressAdapter {
    return {
      addClass: () => undefined,
      getDeterminateCircleAttribute: () => null,
      hasClass: () => false,
      removeClass: () => undefined,
      removeAttribute: () => undefined,
      setAttribute: () => undefined,
      setDeterminateCircleAttribute: () => undefined,
    };
  }

  private closed!: boolean;
  private determinate!: boolean;
  private progress!: number;
  private radius!: number;

  constructor(adapter?: Partial<MDCCircularProgressAdapter>) {
    super({...MDCCircularProgressFoundation.defaultAdapter, ...adapter});
  }

  override init() {
    this.closed = this.adapter.hasClass(cssClasses.CLOSED_CLASS);
    this.determinate = !this.adapter.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.progress = 0;

    if (this.determinate) {
      this.adapter.setAttribute(
          strings.ARIA_VALUENOW, this.progress.toString());
    }

    this.radius =
        Number(this.adapter.getDeterminateCircleAttribute(strings.RADIUS));
  }

  /**
   * Sets whether the progress indicator is in determinate mode.
   * @param determinate Whether the indicator should be determinate.
   */
  setDeterminate(determinate: boolean) {
    this.determinate = determinate;

    if (this.determinate) {
      this.adapter.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.setProgress(this.progress);
    } else {
      this.adapter.addClass(cssClasses.INDETERMINATE_CLASS);
      this.adapter.removeAttribute(strings.ARIA_VALUENOW);
    }
  }

  isDeterminate() {
    return this.determinate;
  }

  /**
   * Sets the current progress value. In indeterminate mode, this has no
   * visual effect but will be reflected if the indicator is switched to
   * determinate mode.
   * @param value The current progress value, which must be between 0 and 1.
   */
  setProgress(value: number) {
    this.progress = value;
    if (this.determinate) {
      const unfilledArcLength =
          (1 - this.progress) * (2 * Math.PI * this.radius);

      this.adapter.setDeterminateCircleAttribute(
          strings.STROKE_DASHOFFSET, `${unfilledArcLength}`);
      this.adapter.setAttribute(
          strings.ARIA_VALUENOW, this.progress.toString());
    }
  }

  getProgress() {
    return this.progress;
  }

  /**
   * Shows the progress indicator.
   */
  open() {
    this.closed = false;
    this.adapter.removeClass(cssClasses.CLOSED_CLASS);
    this.adapter.removeAttribute(strings.ARIA_HIDDEN);
  }

  /**
   * Hides the progress indicator
   */
  close() {
    this.closed = true;
    this.adapter.addClass(cssClasses.CLOSED_CLASS);
    this.adapter.setAttribute(strings.ARIA_HIDDEN, 'true');
  }

  /**
   * @return Returns whether the progress indicator is hidden.
   */
  isClosed() {
    return this.closed;
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCCircularProgressFoundation;
