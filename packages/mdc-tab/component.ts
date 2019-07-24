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

export type MDCTabFactory = (el: Element, foundation?: MDCTabFoundation) => MDCTab;

// tslint:disable:max-line-length
/**
 * @events `MDCTab:interacted {"detail": {"tabId": string}}` Emitted when the Tab is interacted with, regardless of its active state. Used by parent components to know which Tab to activate.
 */
// tslint:enable:max-line-length
export class MDCTab extends MDCComponent<MDCTabFoundation> implements MDCRippleCapableSurface {
  static attachTo(root: Element): MDCTab {
    return new MDCTab(root);
  }

  /**
   * Value of the root tab element's `id` attribute.
   */
  id!: string; // assigned in initialize();

  // Public visibility for this property is required by MDCRippleCapableSurface.
  root_!: HTMLElement; // assigned in MDCComponent constructor

  private ripple_!: MDCRipple; // assigned in initialize();
  private tabIndicator_!: MDCTabIndicator; // assigned in initialize();
  private content_!: HTMLElement; // assigned in initialize();
  private handleClick_!: SpecificEventListener<'click'>; // assigned in initialize();

  initialize(
      rippleFactory: MDCRippleFactory = (el, foundation) => new MDCRipple(el, foundation),
      tabIndicatorFactory: MDCTabIndicatorFactory = (el) => new MDCTabIndicator(el),
  ) {
    this.id = this.root_.id;
    const rippleSurface = this.root_.querySelector<HTMLElement>(MDCTabFoundation.strings.RIPPLE_SELECTOR)!;
    const rippleAdapter = {
      ...MDCRipple.createAdapter(this),
      addClass: (className: string) => rippleSurface.classList.add(className),
      removeClass: (className: string) => rippleSurface.classList.remove(className),
      updateCssVariable: (varName: string, value: string) => rippleSurface.style.setProperty(varName, value),
    };
    const rippleFoundation = new MDCRippleFoundation(rippleAdapter);
    this.ripple_ = rippleFactory(this.root_, rippleFoundation);

    const tabIndicatorElement = this.root_.querySelector(MDCTabFoundation.strings.TAB_INDICATOR_SELECTOR)!;
    this.tabIndicator_ = tabIndicatorFactory(tabIndicatorElement);
    this.content_ = this.root_.querySelector<HTMLElement>(MDCTabFoundation.strings.CONTENT_SELECTOR)!;
  }

  initialSyncWithDOM() {
    this.handleClick_ = () => this.foundation_.handleClick();
    this.listen('click', this.handleClick_);
  }

  destroy() {
    this.unlisten('click', this.handleClick_);
    this.ripple_.destroy();
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabAdapter = {
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      activateIndicator: (previousIndicatorClientRect) => this.tabIndicator_.activate(previousIndicatorClientRect),
      deactivateIndicator: () => this.tabIndicator_.deactivate(),
      notifyInteracted: () => this.emit<MDCTabInteractionEventDetail>(
          MDCTabFoundation.strings.INTERACTED_EVENT, {tabId: this.id}, true /* bubble */),
      getOffsetLeft: () => this.root_.offsetLeft,
      getOffsetWidth: () => this.root_.offsetWidth,
      getContentOffsetLeft: () => this.content_.offsetLeft,
      getContentOffsetWidth: () => this.content_.offsetWidth,
      focus: () => this.root_.focus(),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTabFoundation(adapter);
  }

  /**
   * Getter for the active state of the tab. Allows getting the active state of the tab.
   */
  get active(): boolean {
    return this.foundation_.isActive();
  }

  /**
   * Sets whether the tab should focus itself when activated. Defaults to `true`.
   */
  set focusOnActivate(focusOnActivate: boolean) {
    this.foundation_.setFocusOnActivate(focusOnActivate);
  }

  /**
   * Activates the indicator. `previousIndicatorClientRect` is an optional argument.
   */
  activate(computeIndicatorClientRect?: ClientRect) {
    this.foundation_.activate(computeIndicatorClientRect);
  }

  /**
   * Deactivates the indicator.
   */
  deactivate() {
    this.foundation_.deactivate();
  }

  /**
   * Returns the bounding client rect of the indicator.
   */
  computeIndicatorClientRect(): ClientRect {
    return this.tabIndicator_.computeContentClientRect();
  }

  /**
   * Returns the dimensions of the Tab.
   */
  computeDimensions(): MDCTabDimensions {
    return this.foundation_.computeDimensions();
  }

  /**
   * Focuses the tab.
   */
  focus() {
    this.root_.focus();
  }
}
