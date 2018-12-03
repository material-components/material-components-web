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
  class DialogFixture {
    get dialog() {
      return this.dialogInstance_;
    }

    /** @param {!HTMLElement} dialogEl */
    initialize(dialogEl) {
      /**
       * @type {!HTMLElement}
       * @private
       */
      this.dialogEl_ = dialogEl;

      /**
       * @type {!HTMLElement}
       * @private
       */
      this.surfaceEl_ = this.dialogEl_.querySelector('.mdc-dialog__surface');

      /**
       * @type {!HTMLElement}
       * @private
       */
      this.contentEl_ = this.dialogEl_.querySelector('.mdc-dialog__content');

      /**
       * @type {!MDCDialog}
       * @private
       */
      this.dialogInstance_ = new mdc.dialog.MDCDialog(this.dialogEl_);

      [strings.OPENING_EVENT, strings.OPENED_EVENT].forEach((eventName) => {
        this.dialogInstance_.listen(eventName, (evt) => console.log(eventName, evt));
      });

      [strings.CLOSING_EVENT, strings.CLOSED_EVENT].forEach((eventName) => {
        this.dialogInstance_.listen(eventName, (evt) => console.log(eventName, evt.detail.action, evt));
      });

      const shouldScrollToBottom = this.dialogEl_.classList.contains('test-dialog--scroll-to-bottom');
      if (shouldScrollToBottom) {
        this.dialogInstance_.listen(strings.OPENING_EVENT, () => this.scrollToBottom_());
        this.dialogInstance_.listen(strings.OPENED_EVENT, () => this.scrollToBottom_());
      }

      const listEl = this.dialogEl_.querySelector('.mdc-list');
      if (listEl) {
        const list = new mdc.list.MDCList(listEl);
        this.dialogInstance_.listen(strings.OPENED_EVENT, () => list.layout());
      }

      this.dialogInstance_.listen(strings.OPENED_EVENT, () => {
        this.addRedlines_();
      });

      this.dialogInstance_.listen(strings.CLOSING_EVENT, () => {
        this.removeRedlines_();
      });

      const openButtonEl = document.querySelector(`[data-test-dialog-id="${this.dialogEl_.id}"]`);
      if (openButtonEl) {
        openButtonEl.addEventListener('click', () => this.dialogInstance_.open());
      }

      this.dialogInstance_.open();
    }

    /** @private */
    addRedlines_() {
      const dialogEl = this.dialogEl_;
      const contentEl = this.contentEl_;

      const isSimple = () => dialogEl.classList.contains('test-dialog--simple');
      const isConfirmation = () => dialogEl.classList.contains('test-dialog--confirmation');
      const isStacked = () => dialogEl.classList.contains('mdc-dialog--stacked');
      const isSideBySide = () => !isStacked();
      const isScrollable = () => dialogEl.classList.contains('mdc-dialog--scrollable');
      const isNotScrollable = () => !isScrollable();
      const isRTL = () => Boolean(document.querySelector('[dir=rtl]'));
      const isLTR = () => !isRTL();

      const anyTitleEl = document.querySelector('.mdc-dialog__title');
      const oneLineTitleEl = document.querySelector(
        '.mdc-dialog__title:not(.test-dialog__title--3-line):not(.test-dialog__title--5-line)'
      );
      const threeLineTitleEl = document.querySelector('.mdc-dialog--scrollable .test-dialog__title--3-line');

      const contentNoTitleEl = dialogEl.querySelector('.mdc-dialog__content:first-child');
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

      const nonScrollableLastParagraphEl =
        document.querySelector('.mdc-dialog:not(.mdc-dialog--scrollable) .mdc-dialog__content p:last-child');

      const firstParagraphEl = firstParagraphEls[0];

      window.mdc.testFixture.addRedlines([
        /*
         * Title
         */

        {
          name: 'Title typography baseline',
          fromEl: anyTitleEl,
          fromSide: 'top',
          toEl: anyTitleEl,
          toSide: 'first-baseline',
          specDistancePx: 40,
          displayAlignment: 'left',
          displayOffsetPx: 24,
        },
        {
          name: 'Title height (1-line for Simple/Confirmation)',
          fromEl: oneLineTitleEl,
          fromSide: 'top',
          toEl: listItemEl,
          toSide: 'top',
          specDistancePx: 64, // NOTE: This currently seems to be measured off-by-one
          displayTargetEl: oneLineTitleEl,
          flipLabel: true,
        },
        {
          name: 'Title height (3-line)',
          fromEl: threeLineTitleEl,
          fromSide: 'top',
          toEl: threeLineTitleEl,
          toSide: 'bottom',
          specDistancePx: 128,
          displayTargetEl: threeLineTitleEl,
          flipLabel: true,
        },

        /*
         * Content
         */

        {
          name: 'Content padding left',
          fromEl: this.surfaceEl_,
          fromSide: 'left',
          toEl: contentRectEl,
          toSide: 'left',
          specDistancePx: 24,
          displayTargetEl: this.surfaceEl_,
          displayOffsetPx: -10,
        },
        {
          name: 'Content padding right',
          fromEl: contentRectEl,
          fromSide: 'right',
          toEl: this.surfaceEl_,
          toSide: 'right',
          specDistancePx: 24,
          displayTargetEl: this.surfaceEl_,
          displayOffsetPx: -10,
        },
        {
          name: 'Non-scrollable content typography baseline top (with title)',
          fromEl: anyTitleEl,
          fromSide: 'last-baseline',
          toEl: firstParagraphEl,
          toSide: 'first-baseline',
          specDistancePx: 36,
          displayAlignment: 'left',
          displayOffsetPx: 48,
          flipLabel: true,
          conditionFn: isNotScrollable,
        },
        {
          name: 'Non-scrollable content typography baseline top (without title)',
          fromEl: contentNoTitleEl,
          fromSide: 'top',
          toEl: firstParagraphEl,
          toSide: 'first-baseline',
          specDistancePx: 36, // NOTE: This currently seems to be measured off-by-one
          displayAlignment: 'left',
          displayOffsetPx: 48,
          flipLabel: true,
          conditionFn: isNotScrollable,
        },
        {
          name: 'Non-scrollable content typography baseline bottom',
          fromEl: nonScrollableLastParagraphEl,
          fromSide: 'last-baseline',
          toEl: actionsEl,
          toSide: 'top',
          specDistancePx: 28,
          displayAlignment: 'left',
          displayOffsetPx: 48,
          flipLabel: true,
          conditionFn: isNotScrollable,
        },

        /*
         * Action buttons
         */

        {
          name: 'Actions padding top',
          fromEl: actionsEl,
          fromSide: 'top',
          toEl: firstButtonEl,
          toSide: 'top',
          specDistancePx: 8,
        },
        {
          name: 'Actions padding bottom',
          fromEl: lastButtonEl,
          fromSide: 'bottom',
          toEl: actionsEl,
          toSide: 'bottom',
          specDistancePx: 8,
        },
        {
          name: 'Actions padding right',
          fromEl: lastButtonEl,
          fromSide: 'right',
          toEl: actionsEl,
          toSide: 'right',
          specDistancePx: 8,
          displayTargetEl: actionsEl,
          conditionFn: isLTR,
        },
        {
          name: 'Actions padding left',
          fromEl: lastButtonEl,
          fromSide: 'left',
          toEl: actionsEl,
          toSide: 'left',
          specDistancePx: 8,
          displayTargetEl: actionsEl,
          conditionFn: isRTL,
        },
        {
          name: 'Actions height (side-by-side)',
          fromEl: actionsEl,
          fromSide: 'top',
          toEl: actionsEl,
          toSide: 'bottom',
          specDistancePx: 52,
          displayAlignment: 'left',
          conditionFn: isSideBySide,
        },
        {
          name: 'Actions button margin (side-by-side)',
          fromEl: secondLastButtonEl,
          fromSide: isLTR() ? 'right' : 'left',
          toEl: lastButtonEl,
          toSide: isLTR() ? 'left' : 'right',
          specDistancePx: 8,
          displayAlignment: 'bottom',
          conditionFn: isSideBySide,
        },
        {
          name: 'Actions button margin (stacked)',
          fromEl: secondLastButtonEl,
          fromSide: 'bottom',
          toEl: lastButtonEl,
          toSide: 'top',
          specDistancePx: 12,
          conditionFn: isStacked,
        },

        /*
         * Simple dialog - list items
         */

        {
          name: 'Simple list item height',
          fromEl: listItemEl,
          fromSide: 'top',
          toEl: listItemEl,
          toSide: 'bottom',
          specDistancePx: 56,
          flipLabel: true,
          conditionFn: isSimple,
        },
        {
          name: 'Simple list item graphic width',
          fromEl: listItemGraphicEl,
          fromSide: 'left',
          toEl: listItemGraphicEl,
          toSide: 'right',
          specDistancePx: 40,
          flipLabel: true,
          conditionFn: isSimple,
        },
        {
          name: 'Simple list item label margin',
          fromEl: listItemGraphicEl,
          fromSide: isLTR() ? 'right' : 'left',
          toEl: listItemLabelEl,
          toSide: isLTR() ? 'left' : 'right',
          specDistancePx: 16, // NOTE: Dialog spec says this is 20, but that is inconsistent with List spec.
          flipLabel: false,
          conditionFn: isSimple,
        },

        /*
         * Confirmation dialog - list items
         */

        {
          name: 'Confirmation list item height',
          fromEl: listItemEl,
          fromSide: 'top',
          toEl: listItemEl,
          toSide: 'bottom',
          specDistancePx: 48,
          flipLabel: true,
          conditionFn: isConfirmation,
        },
        {
          name: 'Confirmation list item graphic width',
          fromEl: listItemGraphicEl,
          fromSide: 'left',
          toEl: listItemGraphicEl,
          toSide: 'right',
          specDistancePx: 24,
          flipLabel: true,
          conditionFn: isConfirmation,
        },
        {
          name: 'Confirmation list item label margin',
          fromEl: listItemGraphicEl,
          fromSide: isLTR() ? 'right' : 'left',
          toEl: listItemLabelEl,
          toSide: isLTR() ? 'left' : 'right',
          specDistancePx: 32,
          flipLabel: false,
          conditionFn: isConfirmation,
        },
      ]);

      window.mdc.testFixture.notifyDomReady();
    }

    /** @private */
    removeRedlines_() {
      window.mdc.testFixture.removeRedlines();
    }

    /** @private */
    scrollToBottom_() {
      if (!this.contentEl_) {
        return;
      }
      setTimeout(() => this.contentEl_.scrollTop = this.contentEl_.scrollHeight);
    }
  }

  mdc.testFixture.dialogs = [].map.call(document.querySelectorAll('.mdc-dialog'), (dialogEl) => {
    const dialogFixture = new DialogFixture();
    dialogFixture.initialize(dialogEl);
    return dialogFixture.dialog;
  });
});
