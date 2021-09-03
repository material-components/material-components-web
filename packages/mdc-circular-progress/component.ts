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

import {MDCComponent} from '@material/base/component';
import {MDCProgressIndicator} from '@material/progress-indicator/component';
import {MDCCircularProgressAdapter} from './adapter';
import {MDCCircularProgressFoundation} from './foundation';

export class MDCCircularProgress extends
    MDCComponent<MDCCircularProgressFoundation> implements
        MDCProgressIndicator {
  private determinateCircle!: HTMLElement;

  override initialize() {
    this.determinateCircle = this.root.querySelector<HTMLElement>(
        MDCCircularProgressFoundation.strings.DETERMINATE_CIRCLE_SELECTOR)!;
  }

  static override attachTo(root: Element) {
    return new MDCCircularProgress(root);
  }

  /**
   * Sets whether the progress indicator is in determinate mode.
   * @param isDeterminate Whether the indicator should be determinate.
   */
  set determinate(value: boolean) {
    this.foundation.setDeterminate(value);
  }

  /**
   * Sets the current progress value. In indeterminate mode, this has no
   * visual effect but will be reflected if the indicator is switched to
   * determinate mode.
   * @param value The current progress value, which must be between 0 and 1.
   */
  set progress(value: number) {
    this.foundation.setProgress(value);
  }

  /**
   * Whether the progress indicator is hidden.
   */
  get isClosed() {
    return this.foundation.isClosed();
  }

  /**
   * Shows the progress indicator.
   */
  open() {
    this.foundation.open();
  }

  /**
   * Hides the progress indicator.
   */
  close() {
    this.foundation.close();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCCircularProgressAdapter = {
      addClass: (className: string) => {
        this.root.classList.add(className);
      },
      getDeterminateCircleAttribute: (attributeName: string) =>
          this.determinateCircle.getAttribute(attributeName),
      hasClass: (className: string) => this.root.classList.contains(className),
      removeClass: (className: string) => {
        this.root.classList.remove(className);
      },
      removeAttribute: (attributeName: string) => {
        this.root.removeAttribute(attributeName);
      },
      setAttribute: (attributeName: string, value: string) => {
        this.root.setAttribute(attributeName, value);
      },
      setDeterminateCircleAttribute: (attributeName: string, value: string) => {
        this.determinateCircle.setAttribute(attributeName, value);
      },
    };
    return new MDCCircularProgressFoundation(adapter);
  }
}
