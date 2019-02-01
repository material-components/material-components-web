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

import MDCComponent from '@material/base/component';
import {MDCRipple} from '@material/ripple/index';
import {closest, matches} from '@material/dom/ponyfill';
import MDCDialogFoundation from './foundation';
import * as util from './util';
import * as createFocusTrap from 'focus-trap';

import {SpecificEventListener} from '@material/dom/index';

const strings = MDCDialogFoundation.strings;

class MDCDialog extends MDCComponent<MDCDialogFoundation> {

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

  static attachTo(root: HTMLElement) {
    return new MDCDialog(root);
  }

  private buttonRipples_!: MDCRipple[];

  private buttons_!: HTMLElement[];

  private defaultButton_!: HTMLElement | null;

  private container_!: HTMLElement;

  private content_: HTMLElement | null = null;
  private initialFocusEl_: HTMLElement | null = null;
  private focusTrapFactory_!: (
    element: HTMLElement | string,
    userOptions?: createFocusTrap.Options
  ) => createFocusTrap.FocusTrap;

  private focusTrap_!: createFocusTrap.FocusTrap;

  private handleInteraction_!: SpecificEventListener<'click'|'keydown'>;

  private handleDocumentKeydown_!: SpecificEventListener<'keydown'>;
  private handleOpening_!: () => void;

  private handleClosing_!: () => void;

  private layout_!: () => void;

  initialize (focusTrapFactory = createFocusTrap, initialFocusEl = null) {
    this.container_ = this.root_.querySelector(strings.CONTAINER_SELECTOR) as HTMLElement;
    if (!this.container_) {
      throw new Error(`Dialog component requires a ${strings.CONTAINER_SELECTOR} container element`);
    }
    this.content_ = this.root_.querySelector(strings.CONTENT_SELECTOR);
    this.buttons_ = [].slice.call(this.root_.querySelectorAll(strings.BUTTON_SELECTOR));
    this.defaultButton_ = this.root_.querySelector(strings.DEFAULT_BUTTON_SELECTOR);
    this.focusTrapFactory_ = focusTrapFactory as unknown as util.focusTrap;
    this.initialFocusEl_ = initialFocusEl;
    this.buttonRipples_ = [];

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

    this.listen('click', this.handleInteraction_ as EventListener);
    this.listen('keydown', this.handleInteraction_ as EventListener);
    this.listen(strings.OPENING_EVENT, this.handleOpening_);
    this.listen(strings.CLOSING_EVENT, this.handleClosing_);
  }

  destroy() {
    this.unlisten('click', this.handleInteraction_ as EventListener);
    this.unlisten('keydown', this.handleInteraction_ as EventListener);
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
      eventTargetMatches: (target, selector) => {
        if (!target) return false;
        return matches(target as Element, selector);
      },
      trapFocus: () => this.focusTrap_.activate(),
      releaseFocus: () => this.focusTrap_.deactivate(),
      isContentScrollable: () => !!this.content_ && util.isScrollable(/** @type {!Element} */ (this.content_)),
      areButtonsStacked: () => util.areTopsMisaligned(this.buttons_),
      getActionFromEvent: (event: MouseEvent | KeyboardEvent) => {
        if (!event.target) return '';
        const element = closest(event.target as Element, `[${strings.ACTION_ATTRIBUTE}]`);
        return element && element.getAttribute(strings.ACTION_ATTRIBUTE);
      },
      clickDefaultButton: () => {
        if (this.defaultButton_) {
          this.defaultButton_.click();
        }
      },
      reverseButtons: () => {
        this.buttons_.reverse();
        this.buttons_.forEach((button) => {
          if (!button.parentElement) return;
          button.parentElement.appendChild(button);
        });
      },
      notifyOpening: () => this.emit(strings.OPENING_EVENT, {}),
      notifyOpened: () => this.emit(strings.OPENED_EVENT, {}),
      notifyClosing: (action) => this.emit(strings.CLOSING_EVENT, action ? {action} : {}),
      notifyClosed: (action) => this.emit(strings.CLOSED_EVENT, action ? {action} : {}),
    });
  }
}

export {MDCDialog, MDCDialogFoundation, util};
