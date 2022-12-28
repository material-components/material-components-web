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

import {cssClasses} from '../constants';
import {MDCTopAppBarFoundation} from '../standard/foundation';

/** MDC Fixed Top App Bar Foundation */
export class MDCFixedTopAppBarFoundation extends MDCTopAppBarFoundation {
  /**
   * State variable for the previous scroll iteration top app bar state
   */
  private wasScrolled = false;

  /**
   * Scroll handler for applying/removing the modifier class on the fixed top
   * app bar.
   */
  override handleTargetScroll() {
    const currentScroll = this.adapter.getViewportScrollY();

    if (currentScroll <= 0) {
      if (this.wasScrolled) {
        this.adapter.removeClass(cssClasses.FIXED_SCROLLED_CLASS);
        this.wasScrolled = false;
      }
    } else {
      if (!this.wasScrolled) {
        this.adapter.addClass(cssClasses.FIXED_SCROLLED_CLASS);
        this.wasScrolled = true;
      }
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCFixedTopAppBarFoundation;
