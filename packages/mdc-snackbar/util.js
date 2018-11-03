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

import {numbers} from './constants';

const {ARIA_LIVE_DELAY_MS} = numbers;

export function announce(rootEl, labelEl) {
  const labelText = labelEl.textContent;
  const priority = rootEl.getAttribute('aria-live');

  // Temporarily disable `aria-live` to prevent NVDA from announcing an empty message.
  // If the snackbar has an action button, clearing `textContent` will cause NVDA to
  // announce the button text only (without the label text).
  rootEl.setAttribute('aria-live', 'off');

  // Temporarily clear `textContent` to force a DOM mutation event that will be detected by screen readers.
  // `aria-live` elements are only announced when the element's `textContent` *changes*, so snackbars
  // sent to the browser in the initial HTML response won't be read unless we clear the element's `textContent` first.
  // Similarly, displaying the same snackbar message twice in a row doesn't trigger a DOM mutation event,
  // so screen readers won't announce the second message unless we first clear `textContent`.
  //
  // This technique has been tested and works in:
  // - JAWS 18.0 + Chrome 70
  // - JAWS 18.0 + IE 11
  // - NVDA 2017 & 2018 in IE 11
  // - NVDA 2017 & 2018 in Firefox 60 ESR
  // - NVDA 2017 & 2018 in Chrome 70
  labelEl.textContent = '';

  setTimeout(() => {
    // Allow screen readers to announce changes to the DOM.
    rootEl.setAttribute('aria-live', priority);

    // Restore the original label text, which will be announced by screen readers.
    labelEl.textContent = labelText;
  }, ARIA_LIVE_DELAY_MS);
}
