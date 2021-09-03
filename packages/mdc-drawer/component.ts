/**
 * @license
 * Copyright 2016 Google Inc.
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
import {MDCList, MDCListFactory} from '@material/list/component';
import {MDCDrawerAdapter} from './adapter';
import {MDCDismissibleDrawerFoundation} from './dismissible/foundation';
import {MDCModalDrawerFoundation} from './modal/foundation';
import * as util from './util';
import {MDCDrawerFocusTrapFactory} from './util';

const {cssClasses, strings} = MDCDismissibleDrawerFoundation;

/**
 * @events `MDCDrawer:closed {}` Emits when the navigation drawer has closed.
 * @events `MDCDrawer:opened {}` Emits when the navigation drawer has opened.
 */
export class MDCDrawer extends MDCComponent<MDCDismissibleDrawerFoundation> {
  static override attachTo(root: Element): MDCDrawer {
    return new MDCDrawer(root);
  }

  /**
   * @return boolean Proxies to the foundation's `open`/`close` methods.
   * Also returns true if drawer is in the open position.
   */
  get open(): boolean {
    return this.foundation.isOpen();
  }

  /**
   * Toggles the drawer open and closed.
   */
  set open(isOpen: boolean) {
    if (isOpen) {
      this.foundation.open();
    } else {
      this.foundation.close();
    }
  }

  private previousFocus?: Element|null;
  private scrim!: HTMLElement|null;  // assigned in initialSyncWithDOM()
  private innerList?: MDCList;       // assigned in initialize()

  private focusTrap?: FocusTrap;  // assigned in initialSyncWithDOM()
  private focusTrapFactory!:
      MDCDrawerFocusTrapFactory;  // assigned in initialize()

  private handleScrimClick?:
      SpecificEventListener<'click'>;  // initialized in initialSyncWithDOM()
  private handleKeydown!:
      SpecificEventListener<'keydown'>;  // initialized in initialSyncWithDOM()
  private handleTransitionEnd!:
      SpecificEventListener<'transitionend'>;  // initialized in
                                               // initialSyncWithDOM()

  get list(): MDCList|undefined {
    return this.innerList;
  }

  override initialize(
      focusTrapFactory: MDCDrawerFocusTrapFactory = (el) => new FocusTrap(el),
      listFactory: MDCListFactory = (el) => new MDCList(el),
  ) {
    const listEl = this.root.querySelector(strings.LIST_SELECTOR);
    if (listEl) {
      this.innerList = listFactory(listEl);
      this.innerList.wrapFocus = true;
    }
    this.focusTrapFactory = focusTrapFactory;
  }

  override initialSyncWithDOM() {
    const {MODAL} = cssClasses;
    const {SCRIM_SELECTOR} = strings;

    this.scrim = (this.root.parentNode as Element)
                     .querySelector<HTMLElement>(SCRIM_SELECTOR);

    if (this.scrim && this.root.classList.contains(MODAL)) {
      this.handleScrimClick = () =>
          (this.foundation as MDCModalDrawerFoundation).handleScrimClick();
      this.scrim.addEventListener('click', this.handleScrimClick);
      this.focusTrap = util.createFocusTrapInstance(
          this.root as HTMLElement, this.focusTrapFactory);
    }

    this.handleKeydown = (evt) => {
      this.foundation.handleKeydown(evt);
    };
    this.handleTransitionEnd = (evt) => {
      this.foundation.handleTransitionEnd(evt);
    };
    this.listen('keydown', this.handleKeydown);
    this.listen('transitionend', this.handleTransitionEnd);
  }

  override destroy() {
    this.unlisten('keydown', this.handleKeydown);
    this.unlisten('transitionend', this.handleTransitionEnd);

    if (this.innerList) {
      this.innerList.destroy();
    }

    const {MODAL} = cssClasses;
    if (this.scrim && this.handleScrimClick &&
        this.root.classList.contains(MODAL)) {
      this.scrim.removeEventListener('click', this.handleScrimClick);
      // Ensure drawer is closed to hide scrim and release focus
      this.open = false;
    }
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCDrawerAdapter = {
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      elementHasClass: (element, className) =>
          element.classList.contains(className),
      saveFocus: () => {
        this.previousFocus = document.activeElement;
      },
      restoreFocus: () => {
        const previousFocus = this.previousFocus as HTMLOrSVGElement | null;
        if (previousFocus && previousFocus.focus &&
            this.root.contains(document.activeElement)) {
          previousFocus.focus();
        }
      },
      focusActiveNavigationItem: () => {
        const activeNavItemEl = this.root.querySelector<HTMLElement>(
            strings.LIST_ITEM_ACTIVATED_SELECTOR);
        if (activeNavItemEl) {
          activeNavItemEl.focus();
        }
      },
      notifyClose: () => {
        this.emit(strings.CLOSE_EVENT, {}, true /* shouldBubble */);
      },
      notifyOpen: () => {
        this.emit(strings.OPEN_EVENT, {}, true /* shouldBubble */);
      },
      trapFocus: () => {
        this.focusTrap!.trapFocus();
      },
      releaseFocus: () => {
        this.focusTrap!.releaseFocus();
      },
    };
    // tslint:enable:object-literal-sort-keys

    const {DISMISSIBLE, MODAL} = cssClasses;
    if (this.root.classList.contains(DISMISSIBLE)) {
      return new MDCDismissibleDrawerFoundation(adapter);
    } else if (this.root.classList.contains(MODAL)) {
      return new MDCModalDrawerFoundation(adapter);
    } else {
      throw new Error(
          `MDCDrawer: Failed to instantiate component. Supported variants are ${
              DISMISSIBLE} and ${MODAL}.`);
    }
  }
}
