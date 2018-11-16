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

window.mdc.testFixture.fontsLoaded.then(() => {
  /** @type {!Array<function(): void>} */
  const queue = [];

  /** @param {function(): void} fn */
  function enqueue(fn) {
    queue.push(fn);
    if (queue.length === 1) {
      fn();
    }
  }

  function dequeue() {
    queue.shift();
    const nextFn = queue[0];
    if (nextFn) {
      setTimeout(nextFn, 250); // Insert a brief delay between queued snackbars (it's less visually jarring)
    }
  }

  // Export snackbar instances to `window` for manual testing/debugging in dev tools
  window.mdc.testFixture.snackbars = [];

  [].forEach.call(document.querySelectorAll('.mdc-snackbar'), (rootEl) => {
    /** @type {!MDCSnackbar} */
    const snackbar = mdc.snackbar.MDCSnackbar.attachTo(rootEl);

    const openButtonEl = document.querySelector(`[data-test-snackbar-id="${rootEl.id}"]`);
    if (openButtonEl) {
      openButtonEl.addEventListener('click', () => enqueue(() => snackbar.open()));
    }

    const {OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT} = mdc.snackbar.MDCSnackbarFoundation.strings;
    [OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT].forEach((eventName) => {
      snackbar.listen(eventName, (evt) => console.log(evt.type, evt.detail));
    });

    snackbar.listen(CLOSED_EVENT, dequeue);

    const timeoutMs = parseInt(rootEl.getAttribute('data-test-snackbar-timeout-ms'), 10);
    if (timeoutMs > 0) {
      snackbar.timeoutMs = timeoutMs;
    }

    window.mdc.testFixture.snackbars.push(snackbar);
  });

  window.mdc.testFixture.notifyDomReady();
});
