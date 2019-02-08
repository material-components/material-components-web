/**
 * @license
 * Copyright 2019 Google Inc.
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

/* eslint-disable no-unused-vars */
import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
import {MDCTabIndicator} from '@material/tab-indicator/index';
import {MDCTabDimensions} from './adapter';
/* eslint-enable no-unused-vars */

import MDCTabFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTabFoundation>}
 * @final
 */
class MDCTab extends MDCComponent<MDCTabFoundation> implements RippleCapableSurface {

  static attachTo(root: HTMLElement): MDCTab {
    return new MDCTab(root);
  }

  id?: string;
  private ripple_: MDCRipple;
  private tabIndicator_!: MDCTabIndicator;
  private content_!: HTMLElement;
  private handleClick_?: EventListener;

  constructor(
    root: HTMLElement,
    foundation?: MDCTabFoundation,
    // tslint:disable-next-line:no-any a component can pass in anything it needs to the constructor
    ...args: any[]
  ) {
    super(root, foundation, ...args);
  }

  initialize(
    rippleFactory = (el: Element, foundation: MDCTabFoundation) => new MDCRipple(el, foundation),
    tabIndicatorFactory = (el: HTMLElement) => new MDCTabIndicator(el)) {
    this.id = this.root_.id;
    const rippleSurface = this.root_.querySelector(MDCTabFoundation.strings.RIPPLE_SELECTOR) as HTMLElement;
    const rippleAdapter = Object.assign(MDCRipple.createAdapter(this), {
      addClass: (className: string) => rippleSurface.classList.add(className),
      removeClass: (className: string) => rippleSurface.classList.remove(className),
      updateCssVariable: (varName: string, value: string) => rippleSurface.style.setProperty(varName, value),
    });
    const rippleFoundation = new MDCRippleFoundation(rippleAdapter);
    this.ripple_ = rippleFactory(this.root_, rippleFoundation);

    const tabIndicatorElement = this.root_.querySelector(
      MDCTabFoundation.strings.TAB_INDICATOR_SELECTOR) as HTMLElement;
    this.tabIndicator_ = tabIndicatorFactory(tabIndicatorElement);

    this.content_ = this.root_.querySelector(MDCTabFoundation.strings.CONTENT_SELECTOR) as HTMLElement;
  }

  initialSyncWithDOM() {
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_);
    this.listen('click', this.handleClick_);
  }

  destroy() {
    this.unlisten('click', this.handleClick_ as EventListener);
    this.ripple_.destroy();
    super.destroy();
  }

  /**
   * @return {!MDCTabFoundation}
   */
  getDefaultFoundation(): MDCTabFoundation {
    return new MDCTabFoundation({
        activateIndicator: (previousIndicatorClientRect: ClientRect) =>
          this.tabIndicator_.activate(previousIndicatorClientRect),
        addClass: (className: string) => this.root_.classList.add(className),
        deactivateIndicator: () => this.tabIndicator_.deactivate(),
        focus: () => this.root_.focus(),
        getContentOffsetLeft: () => (this.content_ as HTMLElement).offsetLeft,
        getContentOffsetWidth: () => (this.content_ as HTMLElement).offsetWidth,
        getOffsetLeft: () => this.root_.offsetLeft,
        getOffsetWidth: () => this.root_.offsetWidth,
        hasClass: (className) => this.root_.classList.contains(className),
        notifyInteracted: () => this.emit(
          MDCTabFoundation.strings.INTERACTED_EVENT, {tabId: this.id}, true /* bubble */),
        removeClass: (className) => this.root_.classList.remove(className),
        setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      });
  }

  /**
   * Getter for the active state of the tab
   */
  get active(): boolean {
    return this.foundation_.isActive();
  }

  set focusOnActivate(focusOnActivate: boolean) {
    this.foundation_.setFocusOnActivate(focusOnActivate);
  }

  /**
   * Activates the tab
   */
  activate(computeIndicatorClientRect: ClientRect) {
    this.foundation_.activate(computeIndicatorClientRect);
  }

  /**
   * Deactivates the tab
   */
  deactivate() {
    this.foundation_.deactivate();
  }

  /**
   * Returns the indicator's client rect
   */
  computeIndicatorClientRect(): ClientRect {
    return this.tabIndicator_.computeContentClientRect();
  }

  computeDimensions(): MDCTabDimensions {
    return this.foundation_.computeDimensions();
  }

  /**
   * Focuses the tab
   */
  focus() {
    this.root_.focus();
  }
}

export {MDCTab, MDCTabFoundation};
