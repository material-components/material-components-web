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

import {transformStyleProperties} from '@material/animation';
import MDCFoundation from '@material/base/foundation';
import MDCLinearProgressAdapter from './adapter';

import {cssClasses, strings} from './constants';

export default class MDCLinearProgressFoundation extends MDCFoundation<MDCLinearProgressAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCLinearProgressAdapter {
    return {
      addClass: (_className: string) => undefined,
      getBuffer: () => null,
      getPrimaryBar: () => null,
      hasClass: (_className: string) => false,
      removeClass: (_className: string) => undefined,
      setStyle: (_el: HTMLElement, _styleProperty: string, _value: string) => undefined,
    };
  }

  private isDeterminate_: boolean;
  private isReversed_: boolean;
  private progress_: number;

  init() {
    this.isDeterminate_ = !this.adapter_.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.isReversed_ = this.adapter_.hasClass(cssClasses.REVERSED_CLASS);
    this.progress_ = 0;
  }

  setDeterminate(isDeterminate: boolean) {
    this.isDeterminate_ = isDeterminate;
    if (this.isDeterminate_) {
      this.adapter_.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.setScale_(this.adapter_.getPrimaryBar(), this.progress_);
    } else {
      this.adapter_.addClass(cssClasses.INDETERMINATE_CLASS);
      this.setScale_(this.adapter_.getPrimaryBar(), 1);
      this.setScale_(this.adapter_.getBuffer(), 1);
    }
  }

  setProgress(value: number) {
    this.progress_ = value;
    if (this.isDeterminate_) {
      this.setScale_(this.adapter_.getPrimaryBar(), value);
    }
  }

  setBuffer(value: number) {
    if (this.isDeterminate_) {
      this.setScale_(this.adapter_.getBuffer(), value);
    }
  }

  setReverse(isReversed: boolean) {
    this.isReversed_ = isReversed;
    if (this.isReversed_) {
      this.adapter_.addClass(cssClasses.REVERSED_CLASS);
    } else {
      this.adapter_.removeClass(cssClasses.REVERSED_CLASS);
    }
  }

  open() {
    this.adapter_.removeClass(cssClasses.CLOSED_CLASS);
  }

  close() {
    this.adapter_.addClass(cssClasses.CLOSED_CLASS);
  }

  private setScale_(el: HTMLElement, scaleValue: number) {
    const value = `scaleX(${scaleValue})`;
    transformStyleProperties.forEach((transformStyleProperty) => {
      this.adapter_.setStyle(el, transformStyleProperty, value);
    });
  }
}
