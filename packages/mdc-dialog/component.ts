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

import {MDCComponent} from '@material/base/component';
import {SpecificEventListener} from '@material/base/types';
import {FocusTrap} from '@material/dom/focus-trap';
import {closest, matches} from '@material/dom/ponyfill';
import {MDCRipple} from '@material/ripple/component';
import {MDCDialogAdapter} from './adapter';
import {MDCDialogFoundation} from './foundation';
import {MDCDialogCloseEventDetail} from './types';
import * as util from './util';
import {MDCDialogFocusTrapFactory} from './util';

const {strings} = MDCDialogFoundation;

export class MDCDialog extends MDCComponent<MDCDialogFoundation> {
  get isOpen() {
    return this.foundation.isOpen();
  }

  get escapeKeyAction() {
    return this.foundation.getEscapeKeyAction();
  }

  set escapeKeyAction(action) {
    this.foundation.setEscapeKeyAction(action);
  }

  get scrimClickAction() {
    return this.foundation.getScrimClickAction();
  }

  set scrimClickAction(action) {
    this.foundation.setScrimClickAction(action);
  }

  get autoStackButtons() {
    return this.foundation.getAutoStackButtons();
  }

  set autoStackButtons(autoStack) {
    this.foundation.setAutoStackButtons(autoStack);
  }

  static attachTo(root: Element) {
    return new MDCDialog(root);
  }

  private buttonRipples_!: MDCRipple[]; // assigned in initialize()
  private buttons_!: HTMLElement[]; // assigned in initialize()
  private container_!: HTMLElement; // assigned in initialize()
  private content_!: HTMLElement | null; // assigned in initialize()
  private defaultButton_!: HTMLElement | null; // assigned in initialize()

  private focusTrap_!: FocusTrap; // assigned in initialSyncWithDOM()
  private focusTrapFactory_!: MDCDialogFocusTrapFactory; // assigned in initialize()

  private handleClick_!: SpecificEventListener<'click'>; // assigned in initialSyncWithDOM()
  private handleKeydown_!: SpecificEventListener<'keydown'>; // assigned in initialSyncWithDOM()
  private handleDocumentKeydown_!: SpecificEventListener<'keydown'>; // assigned in initialSyncWithDOM()
  private handleLayout_!: EventListener; // assigned in initialSyncWithDOM()
  private handleOpening_!: EventListener; // assigned in initialSyncWithDOM()
  private handleClosing_!: () => void; // assigned in initialSyncWithDOM()

  initialize(
      focusTrapFactory: MDCDialogFocusTrapFactory = (el, focusOptions) => new FocusTrap(el, focusOptions),
  ) {
    const container =
        this.root.querySelector<HTMLElement>(strings.CONTAINER_SELECTOR);
    if (!container) {
      throw new Error(`Dialog component requires a ${strings.CONTAINER_SELECTOR} container element`);
    }
    this.container_ = container;
    this.content_ =
        this.root.querySelector<HTMLElement>(strings.CONTENT_SELECTOR);
    this.buttons_ = [].slice.call(
        this.root.querySelectorAll<HTMLElement>(strings.BUTTON_SELECTOR));
    this.defaultButton_ = this.root.querySelector<HTMLElement>(
        `[${strings.BUTTON_DEFAULT_ATTRIBUTE}]`);
    this.focusTrapFactory_ = focusTrapFactory;
    this.buttonRipples_ = [];

    for (const buttonEl of this.buttons_) {
      this.buttonRipples_.push(new MDCRipple(buttonEl));
    }
  }

  initialSyncWithDOM() {
    this.focusTrap_ = util.createFocusTrapInstance(
        this.container_, this.focusTrapFactory_, this.getInitialFocusEl_() || undefined);

    this.handleClick_ = this.foundation.handleClick.bind(this.foundation);
    this.handleKeydown_ = this.foundation.handleKeydown.bind(this.foundation);
    this.handleDocumentKeydown_ =
        this.foundation.handleDocumentKeydown.bind(this.foundation);
    this.handleLayout_ = this.layout.bind(this);

    const LAYOUT_EVENTS = ['resize', 'orientationchange'];
    this.handleOpening_ = () => {
      LAYOUT_EVENTS.forEach((evtType) => window.addEventListener(evtType, this.handleLayout_));
      document.addEventListener('keydown', this.handleDocumentKeydown_);
    };
    this.handleClosing_ = () => {
      LAYOUT_EVENTS.forEach((evtType) => window.removeEventListener(evtType, this.handleLayout_));
      document.removeEventListener('keydown', this.handleDocumentKeydown_);
    };

    this.listen('click', this.handleClick_);
    this.listen('keydown', this.handleKeydown_);
    this.listen(strings.OPENING_EVENT, this.handleOpening_);
    this.listen(strings.CLOSING_EVENT, this.handleClosing_);
  }

  destroy() {
    this.unlisten('click', this.handleClick_);
    this.unlisten('keydown', this.handleKeydown_);
    this.unlisten(strings.OPENING_EVENT, this.handleOpening_);
    this.unlisten(strings.CLOSING_EVENT, this.handleClosing_);
    this.handleClosing_();

    this.buttonRipples_.forEach((ripple) => ripple.destroy());
    super.destroy();
  }

  layout() {
    this.foundation.layout();
  }

  open() {
    this.foundation.open();
  }

  close(action = '') {
    this.foundation.close(action);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCDialogAdapter = {
      addBodyClass: (className) => document.body.classList.add(className),
      addClass: (className) => this.root.classList.add(className),
      areButtonsStacked: () => util.areTopsMisaligned(this.buttons_),
      clickDefaultButton: () =>
          this.defaultButton_ && this.defaultButton_.click(),
      eventTargetMatches: (target, selector) =>
          target ? matches(target as Element, selector) : false,
      getActionFromEvent: (evt: Event) => {
        if (!evt.target) {
          return '';
        }
        const element = closest(evt.target as Element, `[${strings.ACTION_ATTRIBUTE}]`);
        return element && element.getAttribute(strings.ACTION_ATTRIBUTE);
      },
      getInitialFocusEl: () => this.getInitialFocusEl_(),
      hasClass: (className) => this.root.classList.contains(className),
      isContentScrollable: () => util.isScrollable(this.content_),
      notifyClosed: (action) => this.emit<MDCDialogCloseEventDetail>(
          strings.CLOSED_EVENT, action ? {action} : {}),
      notifyClosing: (action) => this.emit<MDCDialogCloseEventDetail>(
          strings.CLOSING_EVENT, action ? {action} : {}),
      notifyOpened: () => this.emit(strings.OPENED_EVENT, {}),
      notifyOpening: () => this.emit(strings.OPENING_EVENT, {}),
      releaseFocus: () => this.focusTrap_.releaseFocus(),
      removeBodyClass: (className) => document.body.classList.remove(className),
      removeClass: (className) => this.root.classList.remove(className),
      reverseButtons: () => {
        this.buttons_.reverse();
        this.buttons_.forEach((button) => {
          button.parentElement!.appendChild(button);
        });
      },
      trapFocus: () => this.focusTrap_.trapFocus(),
    };
    return new MDCDialogFoundation(adapter);
  }

  private getInitialFocusEl_(): HTMLElement|null {
    return document.querySelector(`[${strings.INITIAL_FOCUS_ATTRIBUTE}]`);
  }
}
