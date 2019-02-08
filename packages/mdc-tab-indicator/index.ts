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

import MDCComponent from '@material/base/component';

import MDCTabIndicatorAdapter from './adapter';
import MDCTabIndicatorFoundation from './foundation';

import MDCFadingTabIndicatorFoundation from './fading-foundation';
import MDCSlidingTabIndicatorFoundation from './sliding-foundation';

/**
 * @final
 */
class MDCTabIndicator extends MDCComponent<MDCTabIndicatorFoundation> {
  static attachTo(root: HTMLElement): MDCTabIndicator {
    return new MDCTabIndicator(root);
  }

  content_?: HTMLElement;

  /**
   * @param {...?} args
   */
  constructor(
    root: HTMLElement,
    foundation?: MDCTabIndicatorFoundation,
    // tslint:disable-next-line:no-any a component can pass in anything it needs to the constructor
    ...args: any[]
  ) {
    super(root, foundation, ...args);
  }

  initialize() {
    this.content_ = this.root_.querySelector(MDCTabIndicatorFoundation.strings.CONTENT_SELECTOR) as HTMLElement;
  }

  /**
   * @return {!ClientRect}
   */
  computeContentClientRect() {
    return this.foundation_.computeContentClientRect();
  }

  /**
   * @return {!MDCTabIndicatorFoundation}
   */
  getDefaultFoundation(): MDCTabIndicatorFoundation {
    const adapter: MDCTabIndicatorAdapter = (Object.assign({
      addClass: (className: string) => this.root_.classList.add(className),
      computeContentClientRect: () => (this.content_ as HTMLElement).getBoundingClientRect(),
      removeClass: (className: string) => this.root_.classList.remove(className),
      setContentStyleProperty: (prop: string, value: string) =>
        (this.content_ as HTMLElement).style.setProperty(prop, value),
    }));

    if (this.root_.classList.contains(MDCTabIndicatorFoundation.cssClasses.FADE)) {
      return new MDCFadingTabIndicatorFoundation(adapter);
    }

    // Default to the sliding indicator
    return new MDCSlidingTabIndicatorFoundation(adapter);
  }

  /**
   * @param {!ClientRect=} previousIndicatorClientRect
   */
  activate(previousIndicatorClientRect: ClientRect) {
    this.foundation_.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.foundation_.deactivate();
  }
}

export {MDCTabIndicator, MDCTabIndicatorFoundation, MDCSlidingTabIndicatorFoundation, MDCFadingTabIndicatorFoundation};
