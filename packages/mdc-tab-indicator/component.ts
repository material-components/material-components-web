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

export type MDCTabIndicatorFactory = (el: Element, foundation?: MDCTabIndicatorFoundation) => MDCTabIndicator;

export class MDCTabIndicator extends MDCComponent<MDCTabIndicatorFoundation> {
  static override attachTo(root: Element): MDCTabIndicator {
    return new MDCTabIndicator(root);
  }

  private content!: HTMLElement;  // assigned in initialize()

  override initialize() {
    this.content = this.root.querySelector<HTMLElement>(
        MDCTabIndicatorFoundation.strings.CONTENT_SELECTOR)!;
  }

  computeContentClientRect(): ClientRect {
    return this.foundation.computeContentClientRect();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabIndicatorAdapter = {
      addClass: (className) => this.root.classList.add(className),
      removeClass: (className) => this.root.classList.remove(className),
      computeContentClientRect: () => this.content.getBoundingClientRect(),
      setContentStyleProperty: (prop, value) => {
        this.content.style.setProperty(prop, value);
      },
    };
    // tslint:enable:object-literal-sort-keys

    if (this.root.classList.contains(
            MDCTabIndicatorFoundation.cssClasses.FADE)) {
      return new MDCFadingTabIndicatorFoundation(adapter);
    }

    // Default to the sliding indicator
    return new MDCSlidingTabIndicatorFoundation(adapter);
  }

  activate(previousIndicatorClientRect?: ClientRect) {
    this.foundation.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.foundation.deactivate();
  }
}
