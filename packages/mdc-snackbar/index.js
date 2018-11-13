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

import {MDCComponent} from '@material/base/index';
import MDCSnackbarFoundation from './foundation';
import {getCorrectEventName} from '@material/animation/index';
import {strings} from "./constants";
import * as ponyfill from "@material/dom/ponyfill";

class MDCSnackbar extends MDCComponent {
  static attachTo(root) {
    return new MDCSnackbar(root);
  }

  initialSyncWithDOM() {
    const {SURFACE_SELECTOR} = MDCSnackbarFoundation.strings;

    /** @type {!HTMLElement} */
    this.surfaceEl_ = this.root_.querySelector(SURFACE_SELECTOR);

    this.handleTransitionEnd_ = this.foundation_.handleTransitionEnd.bind(this.foundation_);
    this.handleInteraction_ = this.foundation_.handleInteraction.bind(this.foundation_);
    this.handleDocumentKeyDown_ = this.foundation_.handleDocumentKeyDown.bind(this.foundation_);

    this.registerTransitionEndHandler_(this.handleTransitionEnd_);
    this.registerInteractionHandler_(this.handleInteraction_);
  }

  destroy() {
    super.destroy();
    this.deregisterTransitionEndHandler_(this.handleTransitionEnd_);
    this.deregisterInteractionHandler_(this.handleInteraction_);
    this.deregisterDocumentKeyDownHandler_(this.handleDocumentKeyDown_);
  }

  open() {
    if (this.isOpen) {
      return;
    }
    this.registerDocumentKeyDownHandler_(this.handleDocumentKeyDown_);
    this.foundation_.open();
  }

  /**
   * @param {string=} reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
   *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
   *     client-specific values may also be used if desired.
   */
  close(reason = '') {
    if (!this.isOpen) {
      return;
    }
    this.deregisterDocumentKeyDownHandler_(this.handleDocumentKeyDown_);
    this.foundation_.close(reason);
  }

  /**
   * @return {!MDCSnackbarFoundation}
   */
  getDefaultFoundation() {
    const {SURFACE_SELECTOR, ACTION_BUTTON_SELECTOR, ACTION_ICON_SELECTOR} = strings;

    /* eslint brace-style: "off" */
    return new MDCSnackbarFoundation({
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),

      isSurface: (target) => ponyfill.matches(target, SURFACE_SELECTOR),
      isActionButton: (target) => Boolean(ponyfill.closest(target, ACTION_BUTTON_SELECTOR)),
      isActionIcon: (target) => Boolean(ponyfill.closest(target, ACTION_ICON_SELECTOR)),

      notifyOpening: () => this.emit(MDCSnackbarFoundation.strings.OPENING_EVENT),
      notifyOpened: () => this.emit(MDCSnackbarFoundation.strings.OPENED_EVENT),
      notifyClosing: (reason) => this.emit(MDCSnackbarFoundation.strings.CLOSING_EVENT, {reason}),
      notifyClosed: (reason) => this.emit(MDCSnackbarFoundation.strings.CLOSED_EVENT, {reason}),
    });
  }

  /**
   * @return {number}
   */
  get timeoutMs() {
    return this.foundation_.getTimeoutMs();
  }

  /**
   * @param {number} timeoutMs
   */
  set timeoutMs(timeoutMs) {
    this.foundation_.setTimeoutMs(timeoutMs);
  }

  /**
   * @return {boolean}
   */
  get closeOnEscape() {
    return this.foundation_.getCloseOnEscape();
  }

  /**
   * @param {boolean} closeOnEscape
   */
  set closeOnEscape(closeOnEscape) {
    this.foundation_.setCloseOnEscape(closeOnEscape);
  }

  /**
   * @return {boolean}
   */
  get isOpen() {
    return this.foundation_.isOpen();
  }

  /**
   * @return {string}
   */
  get labelText() {
    const {LABEL_SELECTOR} = MDCSnackbarFoundation.strings;
    return this.root_.querySelector(LABEL_SELECTOR).textContent;
  }

  /**
   * @param {string} labelText
   */
  set labelText(labelText) {
    const {LABEL_SELECTOR} = MDCSnackbarFoundation.strings;
    this.root_.querySelector(LABEL_SELECTOR).textContent = labelText;
  }

  /**
   * @return {string}
   */
  get actionButtonText() {
    const {ACTION_BUTTON_SELECTOR} = MDCSnackbarFoundation.strings;
    return this.root_.querySelector(ACTION_BUTTON_SELECTOR).textContent;
  }

  /**
   * @param {string} actionButtonText
   */
  set actionButtonText(actionButtonText) {
    const {ACTION_BUTTON_SELECTOR} = MDCSnackbarFoundation.strings;
    this.root_.querySelector(ACTION_BUTTON_SELECTOR).textContent = actionButtonText;
  }

  /**
   * @param {!EventListener} handler
   * @private
   */
  registerTransitionEndHandler_(handler) {
    this.listen(getCorrectEventName(window, 'transitionend'), handler);
  }

  /**
   * @param {!EventListener} handler
   * @private
   */
  deregisterTransitionEndHandler_(handler) {
    this.unlisten(getCorrectEventName(window, 'transitionend'), handler);
  }

  /**
   * @param {!EventListener} handler
   * @private
   */
  registerInteractionHandler_(handler) {
    this.surfaceEl_.addEventListener('click', handler);
  }

  /**
   * @param {!EventListener} handler
   * @private
   */
  deregisterInteractionHandler_(handler) {
    this.surfaceEl_.removeEventListener('click', handler);
  }

  /**
   * @param {!EventListener} handler
   * @private
   */
  registerDocumentKeyDownHandler_(handler) {
    document.addEventListener('keydown', handler);
  }

  /**
   * @param {!EventListener} handler
   * @private
   */
  deregisterDocumentKeyDownHandler_(handler) {
    document.removeEventListener('keydown', handler);
  }
}

export {MDCSnackbar, MDCSnackbarFoundation};
