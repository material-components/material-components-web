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

import {strings} from '../../../../packages/mdc-dialog/constants';

window.mdc.testFixture.fontsLoaded.then(() => {
  [].forEach.call(document.querySelectorAll('.mdc-dialog'), /** @param {!HTMLElement} dialogEl */ (dialogEl) => {
    /** @type {!MDCDialog} */
    const dialog = new mdc.dialog.MDCDialog(dialogEl);

    const eventNames = [
      strings.OPENING_EVENT, strings.OPENED_EVENT,
      strings.CLOSING_EVENT, strings.CLOSED_EVENT,
    ];

    eventNames.forEach((eventName) => {
      dialog.listen(eventName, (evt) => console.log(eventName, evt));
    });

    const bodyEl = dialogEl.querySelector('.mdc-dialog__content');
    const shouldScrollToBottom = dialogEl.classList.contains('test-dialog--scroll-to-bottom');
    if (bodyEl && shouldScrollToBottom) {
      const scrollToBottom = () => {
        const tryToScroll = () => {
          bodyEl.scrollTop = bodyEl.scrollHeight;
          if (bodyEl.scrollTop === 0) {
            requestAnimationFrame(tryToScroll);
          }
        };
        tryToScroll();
      };
      dialog.listen(strings.OPENING_EVENT, scrollToBottom);
      dialog.listen(strings.OPENED_EVENT, scrollToBottom);
    }

    const openButtonEl = dialogEl.id ? document.querySelector(`[data-test-dialog-id="${dialogEl.id}"]`) : null;
    if (openButtonEl) {
      openButtonEl.addEventListener('click', () => dialog.show());
    }

    dialog.show();
  });
});
