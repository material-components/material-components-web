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

import {MDCComponent} from '@material/base/component';
import {SpecificEventListener} from '@material/base/types';
import {closest} from '@material/dom/ponyfill';
import {MDCSnackbarAdapter} from './adapter';
import {strings} from './constants';
import {MDCSnackbarFoundation} from './foundation';
import {MDCSnackbarAnnouncer, MDCSnackbarAnnouncerFactory, MDCSnackbarCloseEventDetail} from './types';
import * as util from './util';

const {
  SURFACE_SELECTOR, LABEL_SELECTOR, ACTION_SELECTOR, DISMISS_SELECTOR,
  OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT,
} = strings;

export class MDCSnackbar extends MDCComponent<MDCSnackbarFoundation> {
  static attachTo(root: Element) {
    return new MDCSnackbar(root);
  }

  private announce_!: MDCSnackbarAnnouncer; // assigned in initialize()

  private actionEl_!: Element; // assigned in initialSyncWithDOM()
  private labelEl_!: Element; // assigned in initialSyncWithDOM()
  private surfaceEl_!: Element; // assigned in initialSyncWithDOM()

  private handleKeyDown_!: SpecificEventListener<'keydown'>; // assigned in initialSyncWithDOM()
  private handleSurfaceClick_!: SpecificEventListener<'click'>; // assigned in initialSyncWithDOM()

  initialize(announcerFactory: MDCSnackbarAnnouncerFactory = () => util.announce) {
    this.announce_ = announcerFactory();
  }

  initialSyncWithDOM() {
    this.surfaceEl_ = this.root_.querySelector(SURFACE_SELECTOR)!;
    this.labelEl_ = this.root_.querySelector(LABEL_SELECTOR)!;
    this.actionEl_ = this.root_.querySelector(ACTION_SELECTOR)!;

    this.handleKeyDown_ = (evt) => this.foundation_.handleKeyDown(evt);
    this.handleSurfaceClick_ = (evt) => {
      const target = evt.target as Element;
      if (this.isActionButton_(target)) {
        this.foundation_.handleActionButtonClick(evt);
      } else if (this.isActionIcon_(target)) {
        this.foundation_.handleActionIconClick(evt);
      }
    };

    this.registerWindowKeyDownHandler_(this.handleKeyDown_);
    this.registerSurfaceClickHandler_(this.handleSurfaceClick_);
  }

  destroy() {
    super.destroy();
    this.deregisterWindowKeyDownHandler_(this.handleKeyDown_);
    this.deregisterSurfaceClickHandler_(this.handleSurfaceClick_);
  }

  open() {
    this.foundation_.open();
  }

  /**
   * @param reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
   *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
   *     client-specific values may also be used if desired.
   */
  close(reason = '') {
    this.foundation_.close(reason);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCSnackbarAdapter = {
      addClass: (className) => this.root_.classList.add(className),
      announce: () => this.announce_(this.labelEl_),
      notifyClosed: (reason) => this.emit<MDCSnackbarCloseEventDetail>(CLOSED_EVENT, reason ? {reason} : {}),
      notifyClosing: (reason) => this.emit<MDCSnackbarCloseEventDetail>(CLOSING_EVENT, reason ? {reason} : {}),
      notifyOpened: () => this.emit(OPENED_EVENT, {}),
      notifyOpening: () => this.emit(OPENING_EVENT, {}),
      removeClass: (className) => this.root_.classList.remove(className),
    };
    return new MDCSnackbarFoundation(adapter);
  }

  get timeoutMs(): number {
    return this.foundation_.getTimeoutMs();
  }

  set timeoutMs(timeoutMs: number) {
    this.foundation_.setTimeoutMs(timeoutMs);
  }

  get closeOnEscape(): boolean {
    return this.foundation_.getCloseOnEscape();
  }

  set closeOnEscape(closeOnEscape: boolean) {
    this.foundation_.setCloseOnEscape(closeOnEscape);
  }

  get isOpen(): boolean {
    return this.foundation_.isOpen();
  }

  get labelText(): string {
    // This property only returns null if the node is a document, DOCTYPE, or notation.
    // On Element nodes, it always returns a string.
    return this.labelEl_.textContent!;
  }

  set labelText(labelText: string) {
    this.labelEl_.textContent = labelText;
  }

  get actionButtonText(): string {
    return this.actionEl_.textContent!;
  }

  set actionButtonText(actionButtonText: string) {
    this.actionEl_.textContent = actionButtonText;
  }

  private registerWindowKeyDownHandler_(handler: SpecificEventListener<'keydown'>) {
    window.addEventListener('keydown', handler);
  }

  private deregisterWindowKeyDownHandler_(handler: SpecificEventListener<'keydown'>) {
    window.removeEventListener('keydown', handler);
    this.unlisten('keydown', handler);
  }

  private registerSurfaceClickHandler_(handler: SpecificEventListener<'click'>) {
    this.surfaceEl_.addEventListener('click', handler as EventListener);
  }

  private deregisterSurfaceClickHandler_(handler: SpecificEventListener<'click'>) {
    this.surfaceEl_.removeEventListener('click', handler as EventListener);
  }

  private isActionButton_(target: Element): boolean {
    return Boolean(closest(target, ACTION_SELECTOR));
  }

  private isActionIcon_(target: Element): boolean {
    return Boolean(closest(target, DISMISS_SELECTOR));
  }
}
