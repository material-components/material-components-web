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

import {MDCTopAppBarAdapter} from '../adapter';
import {cssClasses} from '../constants';
import {MDCTopAppBarBaseFoundation} from '../foundation';

export class MDCShortTopAppBarFoundation extends MDCTopAppBarBaseFoundation {
  // Public visibility for backward compatibility.
  get isCollapsed(): boolean {
    return this.isCollapsed_;
  }

  private isCollapsed_ = false;

  private isAlwaysCollapsed_ = false;

  /* istanbul ignore next: optional argument is not a branch statement */
  constructor(adapter?: Partial<MDCTopAppBarAdapter>) {
    super(adapter);
  }

  init() {
    super.init();

    if (this.adapter.getTotalActionItems() > 0) {
      this.adapter.addClass(cssClasses.SHORT_HAS_ACTION_ITEM_CLASS);
    }

    // If initialized with SHORT_COLLAPSED_CLASS, the bar should always be collapsed
    this.setAlwaysCollapsed(
      this.adapter.hasClass(cssClasses.SHORT_COLLAPSED_CLASS));
  }

  /**
   * Set if the short top app bar should always be collapsed.
   *
   * @param value When `true`, bar will always be collapsed. When `false`, bar may collapse or expand based on scroll.
   */
  setAlwaysCollapsed(value: boolean) {
    this.isAlwaysCollapsed_ = !!value;
    if (this.isAlwaysCollapsed_) {
      this.collapse_();
    } else {
      // let maybeCollapseBar_ determine if the bar should be collapsed
      this.maybeCollapseBar_();
    }
  }

  getAlwaysCollapsed() {
    return this.isAlwaysCollapsed_;
  }

  /**
   * Scroll handler for applying/removing the collapsed modifier class on the short top app bar.
   * @override
   */
  handleTargetScroll() {
    this.maybeCollapseBar_();
  }

  private maybeCollapseBar_() {
    if (this.isAlwaysCollapsed_) {
      return;
    }
    const currentScroll = this.adapter.getViewportScrollY();

    if (currentScroll <= 0) {
      if (this.isCollapsed_) {
        this.uncollapse_();
      }
    } else {
      if (!this.isCollapsed_) {
        this.collapse_();
      }
    }
  }

  private uncollapse_() {
    this.adapter.removeClass(cssClasses.SHORT_COLLAPSED_CLASS);
    this.isCollapsed_ = false;
  }

  private collapse_() {
    this.adapter.addClass(cssClasses.SHORT_COLLAPSED_CLASS);
    this.isCollapsed_ = true;
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCShortTopAppBarFoundation;
