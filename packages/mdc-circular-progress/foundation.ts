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
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCCircularProgressAdapter {
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

  private isClosed_!: boolean;
  private isDeterminate_!: boolean;
  private progress_!: number;
  private radius_!: number;

  constructor(adapter?: Partial<MDCCircularProgressAdapter>) {
    super({...MDCCircularProgressFoundation.defaultAdapter, ...adapter});
  }

  init() {
    this.isClosed_ = this.adapter_.hasClass(cssClasses.CLOSED_CLASS);
    this.isDeterminate_ =
        !this.adapter_.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.progress_ = 0;

    if (this.isDeterminate_) {
      this.adapter_.setAttribute(
          strings.ARIA_VALUENOW, this.progress_.toString());
    }

    this.radius_ =
        Number(this.adapter_.getDeterminateCircleAttribute(strings.RADIUS));
  }

  isDeterminate() {
    return this.isDeterminate_;
  }

  getProgress() {
    return this.progress_;
  }

  /**
   * @return Returns whether the progress indicator is hidden.
   */
  isClosed() {
    return this.isClosed_;
  }

  /**
   * Sets whether the progress indicator is in determinate mode.
   * @param isDeterminate Whether the indicator should be determinate.
   */
  setDeterminate(isDeterminate: boolean) {
    this.isDeterminate_ = isDeterminate;

    if (this.isDeterminate_) {
      this.adapter_.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.setProgress(this.progress_);
    } else {
      this.adapter_.addClass(cssClasses.INDETERMINATE_CLASS);
      this.adapter_.removeAttribute(strings.ARIA_VALUENOW);
    }
  }

  /**
   * Sets the current progress value. In indeterminate mode, this has no
   * visual effect but will be reflected if the indicator is switched to
   * determinate mode.
   * @param value The current progress value, which must be between 0 and 1.
   */
  setProgress(value: number) {
    this.progress_ = value;
    if (this.isDeterminate_) {
      const unfilledArcLength =
          (1 - this.progress_) * (2 * Math.PI * this.radius_);

      this.adapter_.setDeterminateCircleAttribute(
          strings.STROKE_DASHOFFSET, `${unfilledArcLength}`);
      this.adapter_.setAttribute(
          strings.ARIA_VALUENOW, this.progress_.toString());
    }
  }

  /**
   * Shows the progress indicator.
   */
  open() {
    this.isClosed_ = false;
    this.adapter_.removeClass(cssClasses.CLOSED_CLASS);
  }

  /**
   * Hides the progress indicator
   */
  close() {
    this.isClosed_ = true;
    this.adapter_.addClass(cssClasses.CLOSED_CLASS);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCCircularProgressFoundation;
