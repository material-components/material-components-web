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

    dialog.listen(strings.OPENED_EVENT, () => {
      const anyTitleEl = document.querySelector('.mdc-dialog__title');
      const oneLineTitleEl = document.querySelector(
        '.mdc-dialog__title:not(.test-dialog__title--3-line):not(.test-dialog__title--5-line)'
      );
      const threeLineTitleEl = document.querySelector('.test-dialog__title--3-line');
      const contentEl = document.querySelector('.mdc-dialog__content');
      const anyActionsEl = document.querySelector('.mdc-dialog__actions');
      const nonStackedNonScrollableActionsEl = document.querySelector(
        '.mdc-dialog:not(.mdc-dialog--stacked):not(.mdc-dialog--scrollable) .mdc-dialog__actions'
      );

      const buttonEls = [].slice.call(document.querySelectorAll('.mdc-dialog__button'));
      const firstButton = buttonEls[0];
      const lastButton = buttonEls[buttonEls.length - 1];

      const firstParagraphEls =
        contentEl ? [].slice.call(contentEl.querySelectorAll([
          '.mdc-dialog__content > h1:first-child',
          '.mdc-dialog__content > h2:first-child',
          '.mdc-dialog__content > h3:first-child',
          '.mdc-dialog__content > h4:first-child',
          '.mdc-dialog__content > h5:first-child',
          '.mdc-dialog__content > h6:first-child',
          '.mdc-dialog__content > p:first-child',
        ].join(', '))) : null;

      const lastParagraphEls =
        contentEl ? [].slice.call(contentEl.querySelectorAll([
          '.mdc-dialog__content > h1:last-child',
          '.mdc-dialog__content > h2:last-child',
          '.mdc-dialog__content > h3:last-child',
          '.mdc-dialog__content > h4:last-child',
          '.mdc-dialog__content > h5:last-child',
          '.mdc-dialog__content > h6:last-child',
          '.mdc-dialog__content > p:last-child',
        ].join(', '))) : null;

      const firstParagraphEl = firstParagraphEls[0];
      const lastParagraphEl = lastParagraphEls[lastParagraphEls.length - 1];

      window.mdc.testFixture.addRedline({
        fromEl: anyTitleEl,
        fromSide: 'top',
        toEl: anyTitleEl,
        toSide: 'first-baseline',
        specDistancePx: 40,
        displayOffsetPx: 0,
        displayAlignment: 'left',
      });

      window.mdc.testFixture.addRedline({
        fromEl: oneLineTitleEl,
        fromSide: 'top',
        toEl: oneLineTitleEl,
        toSide: 'bottom',
        specDistancePx: 64,
        displayOffsetPx: 50,
        displayAlignment: 'left',
      });

      window.mdc.testFixture.addRedline({
        fromEl: threeLineTitleEl,
        fromSide: 'top',
        toEl: threeLineTitleEl,
        toSide: 'bottom',
        specDistancePx: 128,
        displayOffsetPx: 100,
        displayAlignment: 'left',
      });

      window.mdc.testFixture.addRedline({
        fromEl: anyTitleEl,
        fromSide: 'last-baseline',
        toEl: firstParagraphEl,
        toSide: 'first-baseline',
        specDistancePx: 36,
        displayOffsetPx: 0,
        displayAlignment: 'left',
      });

      window.mdc.testFixture.addRedline({
        fromEl: nonStackedNonScrollableActionsEl,
        fromSide: 'top',
        toEl: nonStackedNonScrollableActionsEl,
        toSide: 'bottom',
        specDistancePx: 52,
        displayOffsetPx: 0,
        displayAlignment: 'left',
      });

      window.mdc.testFixture.addRedline({
        fromEl: anyActionsEl,
        fromSide: 'top',
        toEl: firstButton,
        toSide: 'top',
        specDistancePx: 8,
        displayOffsetPx: 0,
        displayAlignment: 'center',
      });

      window.mdc.testFixture.addRedline({
        fromEl: lastButton,
        fromSide: 'bottom',
        toEl: anyActionsEl,
        toSide: 'bottom',
        specDistancePx: 8,
        displayOffsetPx: 0,
        displayAlignment: 'center',
      });

      window.mdc.testFixture.addRedline({
        fromEl: lastParagraphEl,
        fromSide: 'last-baseline',
        toEl: nonStackedNonScrollableActionsEl,
        toSide: 'top',
        specDistancePx: 28,
        displayOffsetPx: 100,
        displayAlignment: 'left',
      });
    });

    dialog.show();
  });
});
