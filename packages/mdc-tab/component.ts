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
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCRippleFoundation} from '@material/ripple/foundation';
import {MDCRippleCapableSurface} from '@material/ripple/types';
import {MDCTabIndicator, MDCTabIndicatorFactory} from '@material/tab-indicator/component';

import {MDCTabAdapter} from './adapter';
import {MDCTabFoundation} from './foundation';
import {MDCTabDimensions, MDCTabInteractionEventDetail} from './types';

/** MDC Tab Factory */
export type MDCTabFactory = (el: HTMLElement, foundation?: MDCTabFoundation) =>
    MDCTab;

/** MDC Tab */
export class MDCTab extends MDCComponent<MDCTabFoundation> implements
    MDCRippleCapableSurface {
  static override attachTo(root: HTMLElement): MDCTab {
    return new MDCTab(root);
  }

  id!: string;  // assigned in initialize();

  private ripple!: MDCRipple;              // assigned in initialize();
  private tabIndicator!: MDCTabIndicator;  // assigned in initialize();
  private content!: HTMLElement;           // assigned in initialize();
  private handleClick!:
      SpecificEventListener<'click'>;  // assigned in initialize();

  override initialize(
      rippleFactory:
          MDCRippleFactory = (el, foundation) => new MDCRipple(el, foundation),
      tabIndicatorFactory:
          MDCTabIndicatorFactory = (el) => new MDCTabIndicator(el),
  ) {
    this.id = this.root.id;
    const rippleFoundation =
        new MDCRippleFoundation(MDCRipple.createAdapter(this));
    this.ripple = rippleFactory(this.root, rippleFoundation);

    const tabIndicatorElement = this.root.querySelector<HTMLElement>(
        MDCTabFoundation.strings.TAB_INDICATOR_SELECTOR)!;
    this.tabIndicator = tabIndicatorFactory(tabIndicatorElement);
    this.content = this.root.querySelector<HTMLElement>(
        MDCTabFoundation.strings.CONTENT_SELECTOR)!;
  }

  override initialSyncWithDOM() {
    this.handleClick = () => {
      this.foundation.handleClick();
    };
    this.listen('click', this.handleClick);
  }

  override destroy() {
    this.unlisten('click', this.handleClick);
    this.ripple.destroy();
    super.destroy();
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabAdapter = {
      setAttr: (attr, value) => {
        this.safeSetAttribute(this.root, attr, value);
      },
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      activateIndicator: (previousIndicatorClientRect) => {
        this.tabIndicator.activate(previousIndicatorClientRect);
      },
      deactivateIndicator: () => {
        this.tabIndicator.deactivate();
      },
      notifyInteracted: () => {
        this.emit<MDCTabInteractionEventDetail>(
            MDCTabFoundation.strings.INTERACTED_EVENT, {tabId: this.id},
            true /* bubble */);
      },
      getOffsetLeft: () => this.root.offsetLeft,
      getOffsetWidth: () => this.root.offsetWidth,
      getContentOffsetLeft: () => this.content.offsetLeft,
      getContentOffsetWidth: () => this.content.offsetWidth,
      focus: () => {
        this.root.focus();
      },
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTabFoundation(adapter);
  }

  /**
   * Getter for the active state of the tab
   */
  get active(): boolean {
    return this.foundation.isActive();
  }

  set focusOnActivate(focusOnActivate: boolean) {
    this.foundation.setFocusOnActivate(focusOnActivate);
  }

  /**
   * Activates the tab
   */
  activate(computeIndicatorClientRect?: DOMRect) {
    this.foundation.activate(computeIndicatorClientRect);
  }

  /**
   * Deactivates the tab
   */
  deactivate() {
    this.foundation.deactivate();
  }

  /**
   * Returns the indicator's client rect
   */
  computeIndicatorClientRect(): DOMRect {
    return this.tabIndicator.computeContentClientRect();
  }

  computeDimensions(): MDCTabDimensions {
    return this.foundation.computeDimensions();
  }

  /**
   * Focuses the tab
   */
  focus() {
    this.root.focus();
  }
}
