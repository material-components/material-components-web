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
import {MDCLinearProgressAdapter} from './adapter';
import {MDCLinearProgressFoundation} from './foundation';

export class MDCLinearProgress extends MDCComponent<MDCLinearProgressFoundation> {
  static attachTo(root: Element) {
    return new MDCLinearProgress(root);
  }

  set determinate(value: boolean) {
    this.foundation_.setDeterminate(value);
  }

  set progress(value: number) {
    this.foundation_.setProgress(value);
  }

  set buffer(value: number) {
    this.foundation_.setBuffer(value);
  }

  set reverse(value: boolean) {
    this.foundation_.setReverse(value);
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
    const adapter: MDCLinearProgressAdapter = {
      addClass: (className: string) => this.root_.classList.add(className),
      forceLayout: () => (this.root_ as HTMLElement).offsetWidth,
      getBuffer: () => this.root_.querySelector(MDCLinearProgressFoundation.strings.BUFFER_SELECTOR),
      getPrimaryBar: () => this.root_.querySelector(MDCLinearProgressFoundation.strings.PRIMARY_BAR_SELECTOR),
      hasClass: (className: string) => this.root_.classList.contains(className),
      removeAttribute: (attributeName: string) => {
        this.root_.removeAttribute(attributeName);
      },
      removeClass: (className: string) => this.root_.classList.remove(className),
      setAttribute: (attributeName: string, value: string) => {
        this.root_.setAttribute(attributeName, value);
      },
      setStyle: (el: HTMLElement, styleProperty: string, value: string) => el.style.setProperty(styleProperty, value),
    };
    return new MDCLinearProgressFoundation(adapter);
  }
}
