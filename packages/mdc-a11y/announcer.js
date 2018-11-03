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

import {AriaLivePriority} from './constants';

/**
 * Announces notification messages to screen reader users.
 */
class MDCAnnouncer {
  /**
   * @param {!Node=} root
   */
  constructor(root = document.body) {
    /**
     * @type {!Node}
     * @private
     */
    this.root_ = root;

    /**
     * @type {!Object<!AriaLivePriority|string, !HTMLElement>}
     * @private
     */
    this.liveRegions_ = {};
  }

  destroy() {
    Object.keys(this.liveRegions_).forEach((key) => {
      this.root_.removeChild(this.liveRegions_[key]);
      delete this.liveRegions_[key];
    });
  }

  say(message, priority = AriaLivePriority.POLITE) {
    const liveRegion = this.getLiveRegion_(priority);

    // Clear `textContent` to force a DOM mutation that will be detected by screen readers.
    // `aria-live` elements are only announced when the element's `textContent` *changes*,
    // so snackbars sent to the browser in the initial HTML response won't be read unless we
    // clear the element's `textContent` first.
    // Similarly, displaying the same message twice in a row doesn't trigger a DOM mutation event,
    // so screen readers won't announce the second message unless we clear `textContent`.
    // TODO(acdvorak): Can we just append a dummy HTML element like `<div>.</div>` and then immediately remove it?
    liveRegion.setAttribute('aria-live', 'off');
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
    }, 500); // Timer must be >= ~500ms to make NVDA work
  }

  /**
   * @param {!AriaLivePriority|string} priority
   * @return {!HTMLElement}
   * @private
   */
  getLiveRegion_(priority) {
    let liveRegion = this.liveRegions_[priority];
    if (liveRegion) {
      return liveRegion;
    }

    liveRegion = document.createElement('div');

    // TODO(acdvorak): Create a CSS class for this?
    liveRegion.style.position = 'absolute';
    liveRegion.style.top = '-1000px';
    liveRegion.style.left = '-1000px';
    liveRegion.style.height = '1px'; // IE declares height:0 invisible to third-party tools like JAWS
    liveRegion.style.overflow = 'hidden';

    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');

    this.root_.appendChild(liveRegion);

    this.liveRegions_[priority] = liveRegion;

    return liveRegion;
  }
}

export {MDCAnnouncer};
