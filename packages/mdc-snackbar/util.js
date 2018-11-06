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

import {numbers, strings} from './constants';

const {ARIA_LIVE_DELAY_MS} = numbers;
const {LABEL_TEXT_ATTR} = strings;

export function announce(rootEl, labelEl) {
  const labelText = labelEl.textContent;
  const priority = rootEl.getAttribute('aria-live');

  if (!labelText) {
    return;
  }

  // Temporarily disable `aria-live` to prevent NVDA from announcing an empty message.
  // If the snackbar has an action button, clearing `textContent` will cause NVDA to
  // announce the button, but not the label.
  rootEl.setAttribute('aria-live', 'off');

  // Temporarily clear `textContent` to force a DOM mutation event that will be detected by screen readers.
  // `aria-live` elements are only announced when the element's `textContent` *changes*, so snackbars
  // sent to the browser in the initial HTML response won't be read unless we clear the element's `textContent` first.
  // Similarly, displaying the same snackbar message twice in a row doesn't trigger a DOM mutation event,
  // so screen readers won't announce the second message unless we first clear `textContent`.
  //
  // This technique has been tested in:
  //
  //   * JAWS 18.0 & 2019:
  //       - Chrome 70
  //       - Firefox 60 (ESR)
  //       - IE 11
  //   * NVDA 2017 & 2018:
  //       - Chrome 70
  //       - Firefox 60 (ESR)
  //       - IE 11
  labelEl.textContent = '';

  // Prevent visual jank by temporarily displaying the label text in the ::before pseudo-element.
  // CSS generated content is normally announced by screen readers (except in IE 11; see
  // https://tink.uk/accessibility-support-for-css-generated-content/). However, we previously disabled `aria-live`,
  // so this DOM update will be ignored by screen readers.
  labelEl.setAttribute(LABEL_TEXT_ATTR, labelText);

  setTimeout(() => {
    // Allow screen readers to announce changes to the DOM again.
    rootEl.setAttribute('aria-live', priority);

    // Remove the message from the ::before pseudo-element.
    labelEl.removeAttribute(LABEL_TEXT_ATTR);

    // Restore the original label text, which will be announced by screen readers.
    labelEl.textContent = labelText;
  }, ARIA_LIVE_DELAY_MS);
}
