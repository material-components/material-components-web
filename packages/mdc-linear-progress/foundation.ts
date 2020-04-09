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

import {getCorrectPropertyName} from '@material/animation/util';
import {MDCFoundation} from '@material/base/foundation';
import {MDCProgressIndicatorFoundation} from '@material/progress-indicator/foundation';
import {MDCLinearProgressAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCLinearProgressFoundation extends
    MDCFoundation<MDCLinearProgressAdapter> implements
        MDCProgressIndicatorFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCLinearProgressAdapter {
    return {
      addClass: () => undefined,
      forceLayout: () => undefined,
      setBufferBarStyle: () => null,
      setPrimaryBarStyle: () => null,
      hasClass: () => false,
      removeAttribute: () => undefined,
      removeClass: () => undefined,
      setAttribute: () => undefined,
    };
  }

  private isDeterminate_!: boolean;
  private isReversed_!: boolean;
  private progress_!: number;
  private buffer_!: number;

  constructor(adapter?: Partial<MDCLinearProgressAdapter>) {
    super({...MDCLinearProgressFoundation.defaultAdapter, ...adapter});
  }

  init() {
    this.isDeterminate_ = !this.adapter_.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.isReversed_ = this.adapter_.hasClass(cssClasses.REVERSED_CLASS);
    this.progress_ = 0;
    this.buffer_ = 1;
  }

  setDeterminate(isDeterminate: boolean) {
    this.isDeterminate_ = isDeterminate;

    if (this.isDeterminate_) {
      this.adapter_.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.adapter_.setAttribute(strings.ARIA_VALUENOW, this.progress_.toString());
      this.setPrimaryBarProgress_(this.progress_);
      this.setBufferBarProgress_(this.buffer_);

      return;
    }

    if (this.isReversed_) {
      // Adding/removing REVERSED_CLASS starts a translate animation, while
      // adding INDETERMINATE_CLASS starts a scale animation. Here, we reset
      // the translate animation in order to keep it in sync with the new
      // scale animation that will start from adding INDETERMINATE_CLASS
      // below.
      this.adapter_.removeClass(cssClasses.REVERSED_CLASS);
      this.adapter_.forceLayout();
      this.adapter_.addClass(cssClasses.REVERSED_CLASS);
    }

    this.adapter_.addClass(cssClasses.INDETERMINATE_CLASS);
    this.adapter_.removeAttribute(strings.ARIA_VALUENOW);
    this.setPrimaryBarProgress_(1);
    this.setBufferBarProgress_(1);
  }

  isDeterminate() {
    return this.isDeterminate_;
  }

  setProgress(value: number) {
    this.progress_ = value;
    if (this.isDeterminate_) {
      this.setPrimaryBarProgress_(value);
      this.adapter_.setAttribute(strings.ARIA_VALUENOW, value.toString());
    }
  }

  getProgress() {
    return this.progress_;
  }

  setBuffer(value: number) {
    this.buffer_ = value;
    if (this.isDeterminate_) {
      this.setBufferBarProgress_(value);
    }
  }

  setReverse(isReversed: boolean) {
    this.isReversed_ = isReversed;

    if (!this.isDeterminate_) {
      // Adding INDETERMINATE_CLASS starts a scale animation, while
      // adding/removing REVERSED_CLASS starts a translate animation. Here, we
      // reset the scale animation in order to keep it in sync with the new
      // translate animation that will start from adding/removing REVERSED_CLASS
      // below.
      this.adapter_.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.adapter_.forceLayout();
      this.adapter_.addClass(cssClasses.INDETERMINATE_CLASS);
    }

    if (this.isReversed_) {
      this.adapter_.addClass(cssClasses.REVERSED_CLASS);
      return;
    }

    this.adapter_.removeClass(cssClasses.REVERSED_CLASS);
  }

  open() {
    this.adapter_.removeClass(cssClasses.CLOSED_CLASS);
  }

  close() {
    this.adapter_.addClass(cssClasses.CLOSED_CLASS);
  }

  private setPrimaryBarProgress_(progressValue: number) {
    const value = `scaleX(${progressValue})`;

    // Accessing `window` without a `typeof` check will throw on Node environments.
    const transformProp = typeof window !== 'undefined' ?
        getCorrectPropertyName(window, 'transform') : 'transform';
    this.adapter_.setPrimaryBarStyle(transformProp, value);
  }

  private setBufferBarProgress_(progressValue: number) {
    const value = `${progressValue * 100}%`;
    this.adapter_.setBufferBarStyle(strings.FLEX_BASIS, value);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCLinearProgressFoundation;
