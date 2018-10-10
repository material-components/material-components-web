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

import {MDCComponent} from '@material/base/index';
import {MDCRipple} from '@material/ripple/index';

import MDCDialogFoundation from './foundation';
import * as util from './util';
import {closest, matches} from '@material/dom/ponyfill';

import createFocusTrap from 'focus-trap';

const strings = MDCDialogFoundation.strings;

class MDCDialog extends MDCComponent {
  constructor(...args) {
    super(...args);

    /**
     * @type {!Array<!MDCRipple>}
     * @private
     */
    this.buttonRipples_;

    /** @private {!Array<!Element>} */
    this.buttons_;

    /** @private {?Element} */
    this.defaultButton_;

    /** @private {!Element} */
    this.container_;

    /** @private {?Element} */
    this.content_;

    /** @private {?Element} */
    this.initialFocusEl_;

    /** @private {!Function} */
    this.focusTrapFactory_;

    /** @private {!FocusTrapInstance} */
    this.focusTrap_;

    /** @private {!Function} */
    this.handleInteraction_;

    /** @private {!Function} */
    this.handleDocumentKeydown_;

    /** @private {!Function} */
    this.handleOpening_;

    /** @private {!Function} */
    this.handleClosing_;

    /** @private {Function} */
    this.layout_;
  }

  static attachTo(root) {
    return new MDCDialog(root);
  }

  get isOpen() {
    return this.foundation_.isOpen();
  }

  get escapeKeyAction() {
    return this.foundation_.getEscapeKeyAction();
  }

  set escapeKeyAction(action) {
    this.foundation_.setEscapeKeyAction(action);
  }

  get scrimClickAction() {
    return this.foundation_.getScrimClickAction();
  }

  set scrimClickAction(action) {
    this.foundation_.setScrimClickAction(action);
  }

  get autoStackButtons() {
    return this.foundation_.getAutoStackButtons();
  }

  set autoStackButtons(autoStack) {
    this.foundation_.setAutoStackButtons(autoStack);
  }

  initialize(focusTrapFactory = createFocusTrap, initialFocusEl = null) {
    this.container_ = /** @type {!Element} */ (this.root_.querySelector(strings.CONTAINER_SELECTOR));
    this.content_ = this.root_.querySelector(strings.CONTENT_SELECTOR);
    this.buttons_ = [].slice.call(this.root_.querySelectorAll(strings.BUTTON_SELECTOR));
    this.defaultButton_ = this.root_.querySelector(strings.DEFAULT_BUTTON_SELECTOR);
    this.buttonRipples_ = [];
    this.focusTrapFactory_ = focusTrapFactory;
    this.initialFocusEl_ = initialFocusEl;

    for (let i = 0, buttonEl; buttonEl = this.buttons_[i]; i++) {
      this.buttonRipples_.push(new MDCRipple(buttonEl));
    }
  }

  initialSyncWithDOM() {
    this.focusTrap_ = util.createFocusTrapInstance(this.container_, this.focusTrapFactory_, this.initialFocusEl_);

    this.handleInteraction_ = this.foundation_.handleInteraction.bind(this.foundation_);
    this.handleDocumentKeydown_ = this.foundation_.handleDocumentKeydown.bind(this.foundation_);
    this.layout_ = this.layout.bind(this);

    const LAYOUT_EVENTS = ['resize', 'orientationchange'];
    this.handleOpening_ = () => {
      LAYOUT_EVENTS.forEach((type) => window.addEventListener(type, this.layout_));
      document.addEventListener('keydown', this.handleDocumentKeydown_);
    };
    this.handleClosing_ = () => {
      LAYOUT_EVENTS.forEach((type) => window.removeEventListener(type, this.layout_));
      document.removeEventListener('keydown', this.handleDocumentKeydown_);
    };

    this.listen('click', this.handleInteraction_);
    this.listen('keydown', this.handleInteraction_);
    this.listen(strings.OPENING_EVENT, this.handleOpening_);
    this.listen(strings.CLOSING_EVENT, this.handleClosing_);
  }

  destroy() {
    this.unlisten('click', this.handleInteraction_);
    this.unlisten('keydown', this.handleInteraction_);
    this.unlisten(strings.OPENING_EVENT, this.handleOpening_);
    this.unlisten(strings.CLOSING_EVENT, this.handleClosing_);
    this.handleClosing_();

    this.buttonRipples_.forEach((ripple) => ripple.destroy());
    super.destroy();
  }

  layout() {
    this.foundation_.layout();
  }

  open() {
    this.foundation_.open();
  }

  /**
   * @param {string=} action
   */
  close(action = '') {
    this.foundation_.close(action);
  }

  getDefaultFoundation() {
    return new MDCDialogFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      addBodyClass: (className) => document.body.classList.add(className),
      removeBodyClass: (className) => document.body.classList.remove(className),
      eventTargetMatches: (target, selector) => matches(target, selector),
      trapFocus: () => this.focusTrap_.activate(),
      releaseFocus: () => this.focusTrap_.deactivate(),
      isContentScrollable: () => !!this.content_ && util.isScrollable(/** @type {!Element} */ (this.content_)),
      areButtonsStacked: () => util.areTopsMisaligned(this.buttons_),
      getActionFromEvent: (event) => {
        const element = closest(event.target, `[${strings.ACTION_ATTRIBUTE}]`);
        return element && element.getAttribute(strings.ACTION_ATTRIBUTE);
      },
      clickDefaultButton: () => {
        if (this.defaultButton_) {
          this.defaultButton_.click();
        }
      },
      reverseButtons: () => {
        this.buttons_.reverse();
        this.buttons_.forEach((button) => button.parentElement.appendChild(button));
      },
      notifyOpening: () => this.emit(strings.OPENING_EVENT, {}),
      notifyOpened: () => this.emit(strings.OPENED_EVENT, {}),
      notifyClosing: (action) => this.emit(strings.CLOSING_EVENT, action ? {action} : {}),
      notifyClosed: (action) => this.emit(strings.CLOSED_EVENT, action ? {action} : {}),
    });
  }
}

export {MDCDialog, MDCDialogFoundation, util};
