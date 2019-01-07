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

import MDCComponent from '@material/base/component';
import MDCSnackbarFoundation from './foundation';
import {strings} from './constants';
import * as util from './util';
import * as ponyfill from '@material/dom/ponyfill';

const {
  SURFACE_SELECTOR, LABEL_SELECTOR, ACTION_SELECTOR, DISMISS_SELECTOR,
  OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT,
} = strings;

class MDCSnackbar extends MDCComponent {
  static attachTo(root) {
    return new MDCSnackbar(root);
  }

  constructor(...args) {
    super(...args);

    /** @type {!HTMLElement} */
    this.surfaceEl_;

    /** @type {!HTMLElement} */
    this.labelEl_;

    /** @type {!HTMLElement} */
    this.actionEl_;

    /** @type {function(!HTMLElement, !HTMLElement=): void} */
    this.announce_;

    /** @private {!Function} */
    this.handleKeyDown_;

    /** @private {!Function} */
    this.handleSurfaceClick_;
  }

  /**
   * @param {function(): function(!HTMLElement, !HTMLElement=):void} announceFactory
   */
  initialize(announceFactory = () => util.announce) {
    this.announce_ = announceFactory();
  }

  initialSyncWithDOM() {
    this.surfaceEl_ = /** @type {!HTMLElement} */ (this.root_.querySelector(SURFACE_SELECTOR));
    this.labelEl_ = /** @type {!HTMLElement} */ (this.root_.querySelector(LABEL_SELECTOR));
    this.actionEl_ = /** @type {!HTMLElement} */ (this.root_.querySelector(ACTION_SELECTOR));

    this.handleKeyDown_ = (evt) => this.foundation_.handleKeyDown(evt);
    this.handleSurfaceClick_ = (evt) => {
      if (this.isActionButton_(evt.target)) {
        this.foundation_.handleActionButtonClick(evt);
      } else if (this.isActionIcon_(evt.target)) {
        this.foundation_.handleActionIconClick(evt);
      }
    };

    this.registerKeyDownHandler_(this.handleKeyDown_);
    this.registerSurfaceClickHandler_(this.handleSurfaceClick_);
  }

  destroy() {
    super.destroy();
    this.deregisterKeyDownHandler_(this.handleKeyDown_);
    this.deregisterSurfaceClickHandler_(this.handleSurfaceClick_);
  }

  open() {
    this.foundation_.open();
  }

  /**
   * @param {string=} reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
   *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
   *     client-specific values may also be used if desired.
   */
  close(reason = '') {
    this.foundation_.close(reason);
  }

  /**
   * @return {!MDCSnackbarFoundation}
   */
  getDefaultFoundation() {
    /* eslint brace-style: "off" */
    return new MDCSnackbarFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      announce: () => this.announce_(this.labelEl_),
      notifyOpening: () => this.emit(OPENING_EVENT, {}),
      notifyOpened: () => this.emit(OPENED_EVENT, {}),
      notifyClosing: (reason) => this.emit(CLOSING_EVENT, reason ? {reason} : {}),
      notifyClosed: (reason) => this.emit(CLOSED_EVENT, reason ? {reason} : {}),
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
    return this.labelEl_.textContent;
  }

  /**
   * @param {string} labelText
   */
  set labelText(labelText) {
    this.labelEl_.textContent = labelText;
  }

  /**
   * @return {string}
   */
  get actionButtonText() {
    return this.actionEl_.textContent;
  }

  /**
   * @param {string} actionButtonText
   */
  set actionButtonText(actionButtonText) {
    this.actionEl_.textContent = actionButtonText;
  }

  /**
   * @param {!Function} handler
   * @private
   */
  registerKeyDownHandler_(handler) {
    this.listen('keydown', handler);
  }

  /**
   * @param {!Function} handler
   * @private
   */
  deregisterKeyDownHandler_(handler) {
    this.unlisten('keydown', handler);
  }

  /**
   * @param {!Function} handler
   * @private
   */
  registerSurfaceClickHandler_(handler) {
    this.surfaceEl_.addEventListener('click', handler);
  }

  /**
   * @param {!Function} handler
   * @private
   */
  deregisterSurfaceClickHandler_(handler) {
    this.surfaceEl_.removeEventListener('click', handler);
  }

  /**
   * @param {!Element} target
   * @return {boolean}
   * @private
   */
  isActionButton_(target) {
    return Boolean(ponyfill.closest(target, ACTION_SELECTOR));
  }

  /**
   * @param {!Element} target
   * @return {boolean}
   * @private
   */
  isActionIcon_(target) {
    return Boolean(ponyfill.closest(target, DISMISS_SELECTOR));
  }
}

export {MDCSnackbar, MDCSnackbarFoundation, util};
