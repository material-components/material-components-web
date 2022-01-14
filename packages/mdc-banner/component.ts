/**
 * @license
 * Copyright 2020 Google Inc.
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
import {closest} from '@material/dom/ponyfill';

import {MDCBannerAdapter} from './adapter';
import {CloseReason, events, MDCBannerActionEventDetail, MDCBannerCloseEventDetail, MDCBannerFocusTrapFactory, selectors} from './constants';
import {MDCBannerFoundation} from './foundation';

/** Vanilla JS implementation of banner component. */
export class MDCBanner extends MDCComponent<MDCBannerFoundation> {
  static override attachTo(root: Element) {
    return new MDCBanner(root);
  }

  override root!: HTMLElement;  // Assigned in MDCComponent constructor.
  private handleContentClick!:
      SpecificEventListener<'click'>;            // Assigned in #initialize.
  private primaryActionEl!: HTMLElement;         // Assigned in #initialize.
  private secondaryActionEl!: HTMLElement|null;  // Assigned in #initialize.
  private textEl!: HTMLElement;                  // Assigned in #initialize.
  private contentEl!: HTMLElement;               // Assigned in #initialize.
  private focusTrap!: FocusTrap;  // assigned in initialSyncWithDOM()
  private focusTrapFactory!:
      MDCBannerFocusTrapFactory;  // assigned in initialize()

  override initialize(
      focusTrapFactory: MDCBannerFocusTrapFactory = (el, focusOptions) =>
          new FocusTrap(el, focusOptions),
  ) {
    this.contentEl = this.root.querySelector(selectors.CONTENT) as HTMLElement;
    this.textEl = this.root.querySelector(selectors.TEXT) as HTMLElement;
    this.primaryActionEl =
        this.root.querySelector(selectors.PRIMARY_ACTION) as HTMLElement;
    this.secondaryActionEl =
        this.root.querySelector(selectors.SECONDARY_ACTION) as HTMLElement;
    this.focusTrapFactory = focusTrapFactory;

    this.handleContentClick = (evt) => {
      const target = evt.target as Element;
      if (closest(target, selectors.PRIMARY_ACTION)) {
        this.foundation.handlePrimaryActionClick();
      } else if (closest(target, selectors.SECONDARY_ACTION)) {
        this.foundation.handleSecondaryActionClick();
      }
    };
  }

  override initialSyncWithDOM() {
    this.registerContentClickHandler(this.handleContentClick);
    this.focusTrap = this.focusTrapFactory(
        this.root, {initialFocusEl: this.primaryActionEl});
  }

  override destroy() {
    super.destroy();
    this.deregisterContentClickHandler(this.handleContentClick);
  }

  layout() {
    this.foundation.layout();
  }

  /**
   * Opens the banner and fires events.OPENING to indicate the beginning of its
   * opening animation and then events.OPENED once the animation finishes.
   */
  open() {
    this.foundation.open();
  }

  /**
   * Closes the banner and fires events.CLOSING to indicate the beginning of its
   * closing animation and then events.CLOSED once the animation finishes.
   * @param reason Why the banner was closed. Value will be passed to
   *     events.CLOSING and events.CLOSED via the `event.detail.reason`
   *     property. Standard values are CloseReason.PRIMARY and
   *     CloseReason.SECONDARY, but CloseReason.UNSPECIFIED is provided for
   *     custom handling of programmatic closing of the banner.
   */
  close(reason: CloseReason) {
    this.foundation.close(reason);
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCBannerAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      getContentHeight: () => {
        return this.contentEl.offsetHeight;
      },
      notifyClosed: (reason) => {
        this.emit<MDCBannerCloseEventDetail>(events.CLOSED, {reason});
      },
      notifyClosing: (reason) => {
        this.emit<MDCBannerCloseEventDetail>(events.CLOSING, {reason});
      },
      notifyOpened: () => {
        this.emit(events.OPENED, {});
      },
      notifyOpening: () => {
        this.emit(events.OPENING, {});
      },
      notifyActionClicked: (action) => {
        this.emit<MDCBannerActionEventDetail>(events.ACTION_CLICKED, {action});
      },
      releaseFocus: () => {
        this.focusTrap.releaseFocus();
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setStyleProperty: (propertyName, value) => {
        this.root.style.setProperty(propertyName, value);
      },
      trapFocus: () => {
        this.focusTrap.trapFocus();
      },
    };
    return new MDCBannerFoundation(adapter);
  }

  get isOpen(): boolean {
    return this.foundation.isOpen();
  }

  getText(): string {
    return this.textEl.textContent || '';
  }

  setText(text: string) {
    this.textEl.textContent = text;
  }

  getPrimaryActionText(): string {
    return this.primaryActionEl.textContent || '';
  }

  setPrimaryActionText(actionButtonText: string) {
    this.primaryActionEl.textContent = actionButtonText;
  }

  /** Returns null if the banner has no secondary action. */
  getSecondaryActionText(): string|null {
    return this.secondaryActionEl ? this.secondaryActionEl.textContent || '' :
                                    null;
  }

  setSecondaryActionText(actionButtonText: string) {
    if (this.secondaryActionEl) {
      this.secondaryActionEl.textContent = actionButtonText;
    }
  }

  private registerContentClickHandler(handler: SpecificEventListener<'click'>) {
    this.contentEl.addEventListener('click', handler as EventListener);
  }

  private deregisterContentClickHandler(handler:
                                            SpecificEventListener<'click'>) {
    this.contentEl.removeEventListener('click', handler as EventListener);
  }
}
