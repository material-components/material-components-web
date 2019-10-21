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

import {MDCComponent} from '@material/base/component';
import {MDCCircularProgressAdapter} from './adapter';
import {MDCCircularProgressFoundation} from './foundation';

export class MDCCircularProgress extends MDCComponent<MDCCircularProgressFoundation> {

  private determCircle_!: HTMLElement;

  initialize() {
    this.determCircle_ =
      this.root_.querySelector<HTMLElement>(MDCCircularProgressFoundation.strings.DETERM_CIRCLE_SELECTOR)!;
  }

  static attachTo(root: Element) {
    return new MDCCircularProgress(root);
  }

  set determinate(value: boolean) {
    this.foundation_.setDeterminate(value);
  }

  set progress(value: number) {
    this.foundation_.setProgress(value);
  }

  get isClosed() {
    return this.foundation_.isClosed();
  }

  open() {
    this.foundation_.open();
  }

  close() {
    this.foundation_.close();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCCircularProgressAdapter = {
      addClass: (className: string) => this.root_.classList.add(className),
      forceLayout: () => (this.root_ as HTMLElement).offsetWidth,
      getDetermCircleAttribute: (attributeName: string) => this.determCircle_.getAttribute(attributeName),
      hasClass: (className: string) => this.root_.classList.contains(className),
      removeClass: (className: string) => this.root_.classList.remove(className),
      removeAttribute: (attributeName: string) => this.root_.removeAttribute(attributeName),
      setAttribute: (attributeName: string, value: string) => this.root_.setAttribute(attributeName, value),
      setDetermCircleAttribute: (attributeName: string, value: string) => this.determCircle_.setAttribute(attributeName, value),
    };
    return new MDCCircularProgressFoundation(adapter);
  }
}
