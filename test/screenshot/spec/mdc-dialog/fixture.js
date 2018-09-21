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

    [strings.OPENING_EVENT, strings.OPENED_EVENT].forEach((eventName) => {
      dialog.listen(eventName, (evt) => console.log(eventName, evt));
    });

    [strings.CLOSING_EVENT, strings.CLOSED_EVENT].forEach((eventName) => {
      dialog.listen(eventName, (evt) => console.log(eventName, evt.detail.action, evt));
    });

    const surfaceEl = dialogEl.querySelector('.mdc-dialog__surface');
    const contentEl = dialogEl.querySelector('.mdc-dialog__content');
    const shouldScrollToBottom = dialogEl.classList.contains('test-dialog--scroll-to-bottom');
    if (contentEl && shouldScrollToBottom) {
      const scrollToBottom = () => {
        const tryToScroll = () => {
          contentEl.scrollTop = contentEl.scrollHeight;
          if (contentEl.scrollTop === 0) {
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
      openButtonEl.addEventListener('click', () => dialog.open());
    }

    const listEl = dialogEl.querySelector('.mdc-list');
    if (listEl) {
      const list = new mdc.list.MDCList(listEl);
      dialog.listen(strings.OPENED_EVENT, () => list.layout());
    }

    dialog.listen(strings.CLOSING_EVENT, () => {
      window.mdc.testFixture.removeRedlines();
    });

    dialog.listen(strings.OPENED_EVENT, () => {
      const isStacked = () => dialogEl.classList.contains('mdc-dialog--stacked');
      const isSideBySide = () => !dialogEl.classList.contains('mdc-dialog--stacked');
      const isScrollable = () => dialogEl.classList.contains('mdc-dialog--scrollable');

      const anyTitleEl = document.querySelector('.mdc-dialog__title');
      const oneLineTitleEl = document.querySelector(
        '.mdc-dialog__title:not(.test-dialog__title--3-line):not(.test-dialog__title--5-line)'
      );
      const threeLineTitleEl = document.querySelector('.test-dialog__title--3-line');

      const contentRectEl = document.querySelector('.test-dialog__content-rect');
      const listItemEl = document.querySelector('.mdc-list-item');
      const listItemGraphicEl = document.querySelector('.mdc-list-item:last-child .mdc-list-item__graphic');
      const listItemLabelEl = document.querySelector('.mdc-list-item:last-child .test-list-item__label');

      const actionsEl = document.querySelector('.mdc-dialog__actions');
      const buttonEls = [].slice.call(document.querySelectorAll('.mdc-dialog__button'));
      const firstButtonEl = buttonEls[0];
      const secondLastButtonEl = buttonEls[buttonEls.length - 2];
      const lastButtonEl = buttonEls[buttonEls.length - 1];

      const firstParagraphEls =
        contentEl ? [].slice.call(contentEl.querySelectorAll([
          '.mdc-dialog__content h1:first-child',
          '.mdc-dialog__content h2:first-child',
          '.mdc-dialog__content h3:first-child',
          '.mdc-dialog__content h4:first-child',
          '.mdc-dialog__content h5:first-child',
          '.mdc-dialog__content h6:first-child',
          '.mdc-dialog__content p:first-child',
        ].join(', '))) : null;

      const lastParagraphEls =
        contentEl ? [].slice.call(contentEl.querySelectorAll([
          '.mdc-dialog__content h1:last-child',
          '.mdc-dialog__content h2:last-child',
          '.mdc-dialog__content h3:last-child',
          '.mdc-dialog__content h4:last-child',
          '.mdc-dialog__content h5:last-child',
          '.mdc-dialog__content h6:last-child',
          '.mdc-dialog__content p:last-child',
        ].join(', '))) : null;

      const firstParagraphEl = firstParagraphEls[0];
      const lastParagraphEl = lastParagraphEls[lastParagraphEls.length - 1];

      /*
       * Title
       */

      window.mdc.testFixture.addRedline({
        name: 'Title typography baseline',
        fromEl: anyTitleEl,
        fromSide: 'top',
        toEl: anyTitleEl,
        toSide: 'first-baseline',
        specDistancePx: 40,
        displayAlignment: 'left',
        displayOffsetPx: 24,
      });

      window.mdc.testFixture.addRedline({
        name: 'Title height (1-line)',
        fromEl: oneLineTitleEl,
        fromSide: 'top',
        toEl: oneLineTitleEl,
        toSide: 'bottom',
        specDistancePx: 64,
        displayTargetEl: oneLineTitleEl,
        flipLabel: true,
      });

      window.mdc.testFixture.addRedline({
        name: 'Title height (3-line)',
        fromEl: threeLineTitleEl,
        fromSide: 'top',
        toEl: threeLineTitleEl,
        toSide: 'bottom',
        specDistancePx: 128,
        displayTargetEl: threeLineTitleEl,
        flipLabel: true,
      });

      /*
       * Content
       */

      window.mdc.testFixture.addRedline({
        name: 'Content padding left',
        fromEl: surfaceEl,
        fromSide: 'left',
        toEl: contentRectEl,
        toSide: 'left',
        specDistancePx: 24,
        displayTargetEl: surfaceEl,
        displayOffsetPx: -10,
      });

      window.mdc.testFixture.addRedline({
        name: 'Content padding right',
        fromEl: contentRectEl,
        fromSide: 'right',
        toEl: surfaceEl,
        toSide: 'right',
        specDistancePx: 24,
        displayTargetEl: surfaceEl,
        displayOffsetPx: -10,
      });

      window.mdc.testFixture.addRedline({
        name: 'Content typography baseline top',
        fromEl: anyTitleEl,
        fromSide: 'last-baseline',
        toEl: firstParagraphEl,
        toSide: 'first-baseline',
        specDistancePx: 36,
        displayAlignment: 'left',
        displayOffsetPx: 48,
        flipLabel: true,
        conditionFn: () => contentEl.scrollTop === 0,
      });

      window.mdc.testFixture.addRedline({
        name: 'Content typography baseline bottom',
        fromEl: lastParagraphEl,
        fromSide: 'last-baseline',
        toEl: actionsEl,
        toSide: 'top',
        specDistancePx: 28,
        displayAlignment: 'left',
        displayOffsetPx: 48,
        flipLabel: true,
        conditionFn: () => !isScrollable() || contentEl.scrollTop + contentEl.offsetHeight === contentEl.scrollHeight,
      });

      /*
       * Action buttons
       */

      window.mdc.testFixture.addRedline({
        name: 'Actions height (1-line)',
        fromEl: actionsEl,
        fromSide: 'top',
        toEl: actionsEl,
        toSide: 'bottom',
        specDistancePx: 52,
        displayAlignment: 'left',
        conditionFn: isSideBySide,
      });

      window.mdc.testFixture.addRedline({
        name: 'Actions padding top',
        fromEl: actionsEl,
        fromSide: 'top',
        toEl: firstButtonEl,
        toSide: 'top',
        specDistancePx: 8,
        conditionFn: isSideBySide,
      });

      window.mdc.testFixture.addRedline({
        name: 'Actions padding bottom',
        fromEl: lastButtonEl,
        fromSide: 'bottom',
        toEl: actionsEl,
        toSide: 'bottom',
        specDistancePx: 8,
        conditionFn: isSideBySide,
      });

      window.mdc.testFixture.addRedline({
        name: 'Actions padding right',
        fromEl: lastButtonEl,
        fromSide: 'right',
        toEl: actionsEl,
        toSide: 'right',
        specDistancePx: 8,
        displayTargetEl: actionsEl,
      });

      window.mdc.testFixture.addRedline({
        name: 'Stacked button margin',
        fromEl: secondLastButtonEl,
        fromSide: 'bottom',
        toEl: lastButtonEl,
        toSide: 'top',
        specDistancePx: 12,
        conditionFn: isStacked,
      });

      window.mdc.testFixture.addRedline({
        name: 'Side-by-side button margin',
        fromEl: secondLastButtonEl,
        fromSide: 'right',
        toEl: lastButtonEl,
        toSide: 'left',
        specDistancePx: 8,
        displayAlignment: 'bottom',
        conditionFn: isSideBySide,
      });

      /*
       * Simple dialog - list items
       */

      window.mdc.testFixture.addRedline({
        name: 'Simple list item height',
        fromEl: listItemEl,
        fromSide: 'top',
        toEl: listItemEl,
        toSide: 'bottom',
        specDistancePx: 56,
        flipLabel: true,
      });

      window.mdc.testFixture.addRedline({
        name: 'Simple list item graphic width',
        fromEl: listItemGraphicEl,
        fromSide: 'left',
        toEl: listItemGraphicEl,
        toSide: 'right',
        specDistancePx: 40,
        flipLabel: true,
      });

      window.mdc.testFixture.addRedline({
        name: 'Simple list item graphic width',
        fromEl: listItemGraphicEl,
        fromSide: 'right',
        toEl: listItemLabelEl,
        toSide: 'left',
        specDistancePx: 20,
        flipLabel: false,
      });
    });

    dialog.open();
  });
});
