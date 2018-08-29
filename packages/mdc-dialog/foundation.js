/**
 * @license
 * Copyright 2017 Google Inc.
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

import {MDCFoundation} from '@material/base/index';
import {cssClasses, strings, numbers} from './constants';

export default class MDCDialogFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter() {
    return ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      addBodyClass: (/* className: string */) => {},
      removeBodyClass: (/* className: string */) => {},
      eventTargetHasClass: (/* target: !EventTarget, className: string */) => /* boolean */ false,
      eventTargetMatchesSelector: (/* target: !EventTarget, selector: string */) => /* boolean */ false,
      registerInteractionHandler: (/* evt: string, handler: !EventListener */) => {},
      deregisterInteractionHandler: (/* evt: string, handler: !EventListener */) => {},
      registerSurfaceInteractionHandler: (/* evt: string, handler: !EventListener */) => {},
      deregisterSurfaceInteractionHandler: (/* evt: string, handler: !EventListener */) => {},
      registerDocumentKeydownHandler: (/* handler: !EventListener */) => {},
      deregisterDocumentKeydownHandler: (/* handler: !EventListener */) => {},
      isScrollable: (/* element: !HTMLElement */) => false,
      getContentElement: () => document.createElement('div'),
      getButtonElements: () => [],
      notifyYes: () => {},
      notifyNo: () => {},
      notifyCancel: () => {},
      notifyOpening: () => {},
      notifyOpened: () => {},
      notifyClosing: () => {},
      notifyClosed: () => {},
      trapFocusOnSurface: () => {},
      untrapFocusOnSurface: () => {},
      isDialog: (/* el: !Element */) => /* boolean */ false,
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));

    /**
     * @type {boolean}
     * @private
     */
    this.isOpen_ = false;

    this.componentClickHandler_ = (evt) => {
      // TODO(acdvorak): Make this client-configurable. Maybe use a data-* attribute?
      //   1) data-mdc-dialog-action="cancel" (should already work!)
      //   2) data-mdc-dialog-scrim-closes="false"
      if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.SCRIM)) {
        this.cancel(true);
      }
    };

    this.dialogClickHandler_ = (evt) => this.handleDialogClick_(evt);

    this.documentKeydownHandler_ = (evt) => {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        this.cancel(true);
      }
    };

    this.timerId_ = 0;
  };

  destroy() {
    // Ensure that dialog is cleaned up when destroyed
    if (this.isOpen_) {
      this.close();
    }
    // Final cleanup of animating class in case the timer has not completed.
    this.adapter_.removeClass(cssClasses.ANIMATING);
    clearTimeout(this.timerId_);
  }

  open() {
    this.adapter_.notifyOpening();
    this.isOpen_ = true;
    this.disableScroll_();
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.registerSurfaceInteractionHandler('click', this.dialogClickHandler_);
    this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.addClass(cssClasses.ANIMATING);
    this.adapter_.addClass(cssClasses.OPEN);

    this.detectStackedButtons_();
    this.detectScrollableContent_();

    clearTimeout(this.timerId_);
    this.timerId_ = setTimeout(() => {
      this.handleAnimationTimerEnd_();
      this.adapter_.notifyOpened();
    }, numbers.DIALOG_ANIMATION_TIME_MS);
  }

  close() {
    this.adapter_.notifyClosing();
    this.isOpen_ = false;
    this.enableScroll_();
    this.adapter_.deregisterSurfaceInteractionHandler('click', this.dialogClickHandler_);
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.deregisterInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.untrapFocusOnSurface();
    this.adapter_.addClass(cssClasses.ANIMATING);
    this.adapter_.removeClass(cssClasses.OPEN);

    clearTimeout(this.timerId_);
    this.timerId_ = setTimeout(() => {
      this.handleAnimationTimerEnd_();
      this.adapter_.notifyClosed();
    }, numbers.DIALOG_ANIMATION_TIME_MS);
  }

  isOpen() {
    return this.isOpen_;
  }

  yes(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyYes();
    }

    this.close();
  }

  no(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyNo();
    }

    this.close();
  }

  cancel(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyCancel();
    }

    this.close();
  }

  /** @private */
  detectStackedButtons_() {
    const isStacked = this.isStacked_();
    if (isStacked) {
      this.adapter_.addClass(cssClasses.STACKED);
    } else {
      this.adapter_.removeClass(cssClasses.STACKED);
    }
  }

  /**
   * @return {boolean}
   * @private
   */
  isStacked_() {
    /** @type {!Array<!HTMLElement>} */
    const buttonEls = [].slice.call(this.adapter_.getButtonElements());
    const offsetTopSet = new Set();
    buttonEls.forEach((buttonEl) => {
      offsetTopSet.add(buttonEl.offsetTop);
    });
    return offsetTopSet.size > 1;
  }

  /** @private */
  detectScrollableContent_() {
    // CAUTION: Deep voodoo magic below. Modify at your own risk.
    // The *exact* sequence of rAF and addClass/removeClass calls is necessary to fix a flexbox bug in IE 11.
    // See https://github.com/philipwalton/flexbugs/issues/216
    requestAnimationFrame(() => {
      this.adapter_.addClass(cssClasses.FIX_IE_OVERFLOW);
      requestAnimationFrame(() => {
        this.detectScrollableContentImpl_();
        requestAnimationFrame(() => {
          this.adapter_.removeClass(cssClasses.FIX_IE_OVERFLOW);
        });
      });
    });
  }

  /** @private */
  detectScrollableContentImpl_() {
    const contentEl = this.adapter_.getContentElement();
    if (contentEl && this.adapter_.isScrollable(contentEl)) {
      this.adapter_.addClass(cssClasses.SCROLLABLE);
    } else {
      this.adapter_.removeClass(cssClasses.SCROLLABLE);
    }
  }

  /**
   * @param {!Event} evt
   * @private
   */
  handleDialogClick_(evt) {
    const {target} = evt;
    if (this.adapter_.eventTargetMatchesSelector(target, strings.YES_BTN_SELECTOR)) {
      this.yes(true);
    } else if (this.adapter_.eventTargetMatchesSelector(target, strings.NO_BTN_SELECTOR)) {
      this.no(true);
    } else if (this.adapter_.eventTargetMatchesSelector(target, strings.CANCEL_BTN_SELECTOR)) {
      this.cancel(true);
    }
  }

  /** @private */
  handleAnimationTimerEnd_() {
    this.adapter_.removeClass(cssClasses.ANIMATING);
    if (this.isOpen_) {
      this.adapter_.trapFocusOnSurface();
    }
  }

  /** @private */
  disableScroll_() {
    this.adapter_.addBodyClass(cssClasses.SCROLL_LOCK);
  }

  /** @private */
  enableScroll_() {
    this.adapter_.removeBodyClass(cssClasses.SCROLL_LOCK);
  }
}
