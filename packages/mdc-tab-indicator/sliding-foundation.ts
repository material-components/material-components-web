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

import {MDCTabIndicatorFoundation} from './foundation';

/* istanbul ignore next: subclass is not a branch statement */
export class MDCSlidingTabIndicatorFoundation extends
    MDCTabIndicatorFoundation {
  activate(previousIndicatorClientRect?: DOMRect) {
    // Early exit if no indicator is present to handle cases where an indicator
    // may be activated without a prior indicator state
    if (!previousIndicatorClientRect) {
      this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
      return;
    }

    // This animation uses the FLIP approach. You can read more about it at the
    // link below: https://aerotwist.com/blog/flip-your-animations/

    // Calculate the dimensions based on the dimensions of the previous
    // indicator
    const currentClientRect = this.computeContentClientRect();
    const widthDelta =
        previousIndicatorClientRect.width / currentClientRect.width;
    const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
    this.adapter.setContentStyleProperty(
        'transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);

    // Force repaint before updating classes and transform to ensure the
    // transform properly takes effect
    this.computeContentClientRect();

    this.adapter.removeClass(
        MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
    this.adapter.setContentStyleProperty('transform', '');
  }

  deactivate() {
    this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSlidingTabIndicatorFoundation;
