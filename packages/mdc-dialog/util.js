/**
 * @license
 * Copyright 2016 Google Inc.
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

import createFocusTrap from 'focus-trap';

export default class MDCDialogUtil {
  /**
   * @param {!HTMLElement} surfaceEl
   * @param {?HTMLElement=} initialFocusEl
   * @param {function(!HTMLElement, !FocusTrapCreateOptions): !focusTrap} focusTrapFactory
   * @return {!focusTrap}
   */
  createFocusTrapInstance(surfaceEl, initialFocusEl = null, focusTrapFactory = createFocusTrap) {
    return focusTrapFactory(surfaceEl, {
      initialFocus: initialFocusEl,
      clickOutsideDeactivates: false,
    });
  }

  /**
   * @param {!HTMLElement} el
   * @return {boolean}
   */
  isScrollable(el) {
    return el.scrollHeight > el.offsetHeight;
  }

  /**
   * @param {!Array<!HTMLElement>|!NodeList} els
   * @return {boolean}
   */
  areTopsMisaligned(els) {
    const tops = new Set();
    [].forEach.call(els, (el) => tops.add(el.offsetTop));
    return tops.size > 1;
  }
}
