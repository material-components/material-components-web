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
  [].forEach.call(document.querySelectorAll('.mdc-snackbar'), (el) => {
    const snackbar = mdc.snackbar.MDCSnackbar.attachTo(el);

    const openButtonEl = document.querySelector(`[data-test-snackbar-id="${el.id}"]`);
    if (openButtonEl) {
      openButtonEl.addEventListener('click', () => snackbar.open());
    }

    const {
      OPENING_EVENT,
      OPENED_EVENT,
      CLOSING_EVENT,
      CLOSED_EVENT,
    } = mdc.snackbar.MDCSnackbarFoundation.strings;

    [OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT].forEach((eventName) => {
      snackbar.listen(eventName, (evt) => console.log(evt.type, evt.detail));
    });
  });

  window.mdc.testFixture.notifyDomReady();
});
