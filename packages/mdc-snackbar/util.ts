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
const {DATA_LIVE_LABEL_TEXT} = strings;

/** Accounce helper for snackbar */
export function announce(ariaEl: HTMLElement, labelEl: HTMLElement = ariaEl) {
  const priority = ariaEl.getAttribute('aria-live');

  // Trim text to ignore `&nbsp;` (see below).
  // textContent is only null if the node is a document, DOCTYPE, or notation.
  const labelText = labelEl.textContent!.trim();
  if (!labelText || !priority) {
    return;
  }

  // Temporarily disable `aria-live` to prevent JAWS+Firefox from announcing the
  // message twice.
  ariaEl.setAttribute('aria-live', 'off');

  // Temporarily clear `textContent` to force a DOM mutation event that will be
  // detected by screen readers. `aria-live` elements are only announced when
  // the element's `textContent` *changes*, so snackbars sent to the browser in
  // the initial HTML response won't be read unless we clear the element's
  // `textContent` first. Similarly, displaying the same snackbar message twice
  // in a row doesn't trigger a DOM mutation event, so screen readers won't
  // announce the second message unless we first clear `textContent`.
  //
  // We have to clear the label text two different ways to make it work in all
  // browsers and screen readers:
  //
  //   1. `textContent = ''` is required for IE11 + JAWS
  //   2. `innerHTML = '&nbsp;'` is required for Chrome + JAWS and NVDA
  //
  // All other browser/screen reader combinations support both methods.
  //
  // The wrapper `<span>` visually hides the space character so that it doesn't
  // cause jank when added/removed. N.B.: Setting `position: absolute`,
  // `opacity: 0`, or `height: 0` prevents Chrome from detecting the DOM change.
  //
  // This technique has been tested in:
  //
  //   * JAWS 2019:
  //       - Chrome 70
  //       - Firefox 60 (ESR)
  //       - IE 11
  //   * NVDA 2018:
  //       - Chrome 70
  //       - Firefox 60 (ESR)
  //       - IE 11
  //   * ChromeVox 53
  labelEl.textContent = '';
  // For the second case, assigning a string directly to innerHTML results in a
  // Trusted Types violation. Work around that by using document.createElement.
  const span = document.createElement('span');
  span.setAttribute('style', 'display: inline-block; width: 0; height: 1px;');
  span.textContent = '\u00a0';  // Equivalent to &nbsp;
  labelEl.appendChild(span);

  // Prevent visual jank by temporarily displaying the label text in the
  // ::before pseudo-element. CSS generated content is normally announced by
  // screen readers (except in IE 11; see
  // https://tink.uk/accessibility-support-for-css-generated-content/); however,
  // `aria-live` is turned off, so this DOM update will be ignored by screen
  // readers.
  labelEl.dataset[DATA_LIVE_LABEL_TEXT] = labelText;

  setTimeout(() => {
    // Allow screen readers to announce changes to the DOM again.
    ariaEl.setAttribute('aria-live', priority);

    // Remove the message from the ::before pseudo-element.
    delete labelEl.dataset[DATA_LIVE_LABEL_TEXT];

    // Restore the original label text, which will be announced by screen
    // readers.
    labelEl.textContent = labelText;
  }, ARIA_LIVE_DELAY_MS);
}
