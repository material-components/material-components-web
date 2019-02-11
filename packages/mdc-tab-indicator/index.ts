/**
 * @license
 * Copyright 2018 Google Inc.
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

import {MDCTabIndicatorAdapter} from './adapter';
import {MDCFadingTabIndicatorFoundation} from './fading-foundation';
import {MDCTabIndicatorFoundation} from './foundation';
import {MDCSlidingTabIndicatorFoundation} from './sliding-foundation';

class MDCTabIndicator extends MDCComponent<MDCTabIndicatorFoundation> {
  static attachTo(root: Element): MDCTabIndicator {
    return new MDCTabIndicator(root);
  }

  private content_!: HTMLElement; // assigned in initialize()

  initialize() {
    this.content_ = this.root_.querySelector<HTMLElement>(MDCTabIndicatorFoundation.strings.CONTENT_SELECTOR)!;
  }

  computeContentClientRect(): ClientRect {
    return this.foundation_.computeContentClientRect();
  }

  getDefaultFoundation(): MDCTabIndicatorFoundation {
    // tslint:disable:object-literal-sort-keys
    const adapter: MDCTabIndicatorAdapter = {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      computeContentClientRect: () => this.content_.getBoundingClientRect(),
      setContentStyleProperty: (prop, value) => this.content_.style.setProperty(prop, value),
    };
    // tslint:enable:object-literal-sort-keys

    if (this.root_.classList.contains(MDCTabIndicatorFoundation.cssClasses.FADE)) {
      return new MDCFadingTabIndicatorFoundation(adapter);
    }

    // Default to the sliding indicator
    return new MDCSlidingTabIndicatorFoundation(adapter);
  }

  activate(previousIndicatorClientRect?: ClientRect | null) {
    this.foundation_.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.foundation_.deactivate();
  }
}

export {MDCTabIndicator as default, MDCTabIndicator};
export * from './adapter';
export * from './constants';
export * from './foundation';
export * from './fading-foundation';
export * from './sliding-foundation';
