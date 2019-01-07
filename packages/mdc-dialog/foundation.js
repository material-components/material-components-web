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

import MDCFoundation from '@material/base/foundation';
import MDCDialogAdapter from './adapter';
import {cssClasses, numbers, strings} from './constants';

class MDCDialogFoundation extends MDCFoundation {
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
    return /** @type {!MDCDialogAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      addBodyClass: (/* className: string */) => {},
      removeBodyClass: (/* className: string */) => {},
      eventTargetMatches: (/* target: !EventTarget, selector: string */) => {},
      trapFocus: () => {},
      releaseFocus: () => {},
      isContentScrollable: () => {},
      areButtonsStacked: () => {},
      getActionFromEvent: (/* event: !Event */) => {},
      clickDefaultButton: () => {},
      reverseButtons: () => {},
      notifyOpening: () => {},
      notifyOpened: () => {},
      notifyClosing: (/* action: ?string */) => {},
      notifyClosed: (/* action: ?string */) => {},
    });
  }

  /**
   * @param {!MDCDialogAdapter=} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCDialogFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.isOpen_ = false;

    /** @private {number} */
    this.animationFrame_ = 0;

    /** @private {number} */
    this.animationTimer_ = 0;

    /** @private {number} */
    this.layoutFrame_ = 0;

    /** @private {string} */
    this.escapeKeyAction_ = strings.CLOSE_ACTION;

    /** @private {string} */
    this.scrimClickAction_ = strings.CLOSE_ACTION;

    /** @private {boolean} */
    this.autoStackButtons_ = true;

    /** @private {boolean} */
    this.areButtonsStacked_ = false;
  };

  init() {
    if (this.adapter_.hasClass(cssClasses.STACKED)) {
      this.setAutoStackButtons(false);
    }
  };

  destroy() {
    if (this.isOpen_) {
      this.close(strings.DESTROY_ACTION);
    }

    if (this.animationTimer_) {
      clearTimeout(this.animationTimer_);
      this.handleAnimationTimerEnd_();
    }

    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
      this.layoutFrame_ = 0;
    }
  }

  open() {
    this.isOpen_ = true;
    this.adapter_.notifyOpening();
    this.adapter_.addClass(cssClasses.OPENING);

    // Wait a frame once display is no longer "none", to establish basis for animation
    this.runNextAnimationFrame_(() => {
      this.adapter_.addClass(cssClasses.OPEN);
      this.adapter_.addBodyClass(cssClasses.SCROLL_LOCK);

      this.layout();

      this.animationTimer_ = setTimeout(() => {
        this.handleAnimationTimerEnd_();
        this.adapter_.trapFocus();
        this.adapter_.notifyOpened();
      }, numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    });
  }

  /**
   * @param {string=} action
   */
  close(action = '') {
    if (!this.isOpen_) {
      // Avoid redundant close calls (and events), e.g. from keydown on elements that inherently emit click
      return;
    }

    this.isOpen_ = false;
    this.adapter_.notifyClosing(action);
    this.adapter_.addClass(cssClasses.CLOSING);
    this.adapter_.removeClass(cssClasses.OPEN);
    this.adapter_.removeBodyClass(cssClasses.SCROLL_LOCK);

    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = 0;

    clearTimeout(this.animationTimer_);
    this.animationTimer_ = setTimeout(() => {
      this.adapter_.releaseFocus();
      this.handleAnimationTimerEnd_();
      this.adapter_.notifyClosed(action);
    }, numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
  }

  isOpen() {
    return this.isOpen_;
  }

  /** @return {string} */
  getEscapeKeyAction() {
    return this.escapeKeyAction_;
  }

  /** @param {string} action */
  setEscapeKeyAction(action) {
    this.escapeKeyAction_ = action;
  }

  /** @return {string} */
  getScrimClickAction() {
    return this.scrimClickAction_;
  }

  /** @param {string} action */
  setScrimClickAction(action) {
    this.scrimClickAction_ = action;
  }

  /** @return {boolean} */
  getAutoStackButtons() {
    return this.autoStackButtons_;
  }

  /** @param {boolean} autoStack */
  setAutoStackButtons(autoStack) {
    this.autoStackButtons_ = autoStack;
  }

  layout() {
    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
    }
    this.layoutFrame_ = requestAnimationFrame(() => {
      this.layoutInternal_();
      this.layoutFrame_ = 0;
    });
  }

  layoutInternal_() {
    if (this.autoStackButtons_) {
      this.detectStackedButtons_();
    }
    this.detectScrollableContent_();
  }

  /** @private */
  detectStackedButtons_() {
    // Remove the class first to let us measure the buttons' natural positions.
    this.adapter_.removeClass(cssClasses.STACKED);

    const areButtonsStacked = this.adapter_.areButtonsStacked();

    if (areButtonsStacked) {
      this.adapter_.addClass(cssClasses.STACKED);
    }

    if (areButtonsStacked !== this.areButtonsStacked_) {
      this.adapter_.reverseButtons();
      this.areButtonsStacked_ = areButtonsStacked;
    }
  }

  /** @private */
  detectScrollableContent_() {
    // Remove the class first to let us measure the natural height of the content.
    this.adapter_.removeClass(cssClasses.SCROLLABLE);
    if (this.adapter_.isContentScrollable()) {
      this.adapter_.addClass(cssClasses.SCROLLABLE);
    }
  }

  /**
   * @param {!Event} evt
   * @private
   */
  handleInteraction(evt) {
    const isClick = evt.type === 'click';
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;

    // Check for scrim click first since it doesn't require querying ancestors
    if (isClick && this.adapter_.eventTargetMatches(evt.target, strings.SCRIM_SELECTOR) &&
      this.scrimClickAction_ !== '') {
      this.close(this.scrimClickAction_);
    } else if (isClick || evt.key === 'Space' || evt.keyCode === 32 || isEnter) {
      const action = this.adapter_.getActionFromEvent(evt);
      if (action) {
        this.close(action);
      } else if (isEnter && !this.adapter_.eventTargetMatches(evt.target, strings.SUPPRESS_DEFAULT_PRESS_SELECTOR)) {
        this.adapter_.clickDefaultButton();
      }
    }
  }

  /**
   * @param {!KeyboardEvent} evt
   * @private
   */
  handleDocumentKeydown(evt) {
    if ((evt.key === 'Escape' || evt.keyCode === 27) && this.escapeKeyAction_ !== '') {
      this.close(this.escapeKeyAction_);
    }
  }

  /** @private */
  handleAnimationTimerEnd_() {
    this.animationTimer_ = 0;
    this.adapter_.removeClass(cssClasses.OPENING);
    this.adapter_.removeClass(cssClasses.CLOSING);
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
   * @param {Function} callback
   * @private
   */
  runNextAnimationFrame_(callback) {
    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = requestAnimationFrame(() => {
      this.animationFrame_ = 0;
      clearTimeout(this.animationTimer_);
      this.animationTimer_ = setTimeout(callback, 0);
    });
  }
}

export default MDCDialogFoundation;
