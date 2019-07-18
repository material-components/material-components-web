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
import {applyPassive} from '@material/dom/events';
import {matches} from '@material/dom/ponyfill';
import {MDCTabScrollerAdapter} from './adapter';
import {MDCTabScrollerFoundation} from './foundation';
import * as util from './util';

type InteractionEventType = 'wheel' | 'touchstart' | 'pointerdown' | 'mousedown' | 'keydown';

export type MDCTabScrollerFactory = (el: Element, foundation?: MDCTabScrollerFoundation) => MDCTabScroller;

export class MDCTabScroller extends MDCComponent<MDCTabScrollerFoundation> {
  static attachTo(root: Element): MDCTabScroller {
    return new MDCTabScroller(root);
  }

  private content_!: HTMLElement; // assigned in initialize()
  private area_!: HTMLElement; // assigned in initialize()
  private handleInteraction_!: SpecificEventListener<InteractionEventType>; // assigned in initialSyncWithDOM()
  private handleTransitionEnd_!: SpecificEventListener<'transitionend'>; // assigned in initialSyncWithDOM()

  initialize() {
    this.area_ = this.root_.querySelector<HTMLElement>(MDCTabScrollerFoundation.strings.AREA_SELECTOR)!;
    this.content_ = this.root_.querySelector<HTMLElement>(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)!;
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = () => this.foundation_.handleInteraction();
    this.handleTransitionEnd_ = (evt) => this.foundation_.handleTransitionEnd(evt);

    this.area_.addEventListener('wheel', this.handleInteraction_, applyPassive());
    this.area_.addEventListener('touchstart', this.handleInteraction_, applyPassive());
    this.area_.addEventListener('pointerdown', this.handleInteraction_, applyPassive());
    this.area_.addEventListener('mousedown', this.handleInteraction_, applyPassive());
    this.area_.addEventListener('keydown', this.handleInteraction_, applyPassive());
    this.content_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  destroy() {
    super.destroy();

    this.area_.removeEventListener('wheel', this.handleInteraction_, applyPassive());
    this.area_.removeEventListener('touchstart', this.handleInteraction_, applyPassive());
    this.area_.removeEventListener('pointerdown', this.handleInteraction_, applyPassive());
    this.area_.removeEventListener('mousedown', this.handleInteraction_, applyPassive());
    this.area_.removeEventListener('keydown', this.handleInteraction_, applyPassive());
    this.content_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabScrollerAdapter = {
      eventTargetMatchesSelector: (evtTarget, selector) => matches(evtTarget as Element, selector),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addScrollAreaClass: (className) => this.area_.classList.add(className),
      setScrollAreaStyleProperty: (prop, value) => this.area_.style.setProperty(prop, value),
      setScrollContentStyleProperty: (prop, value) => this.content_.style.setProperty(prop, value),
      getScrollContentStyleValue: (propName) => window.getComputedStyle(this.content_).getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX) => this.area_.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.area_.scrollLeft,
      getScrollContentOffsetWidth: () => this.content_.offsetWidth,
      getScrollAreaOffsetWidth: () => this.area_.offsetWidth,
      computeScrollAreaClientRect: () => this.area_.getBoundingClientRect(),
      computeScrollContentClientRect: () => this.content_.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () => util.computeHorizontalScrollbarHeight(document),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTabScrollerFoundation(adapter);
  }

  /**
   * Returns the current visual scroll position
   */
  getScrollPosition(): number {
    return this.foundation_.getScrollPosition();
  }

  /**
   * Returns the width of the scroll content
   */
  getScrollContentWidth(): number {
    return this.content_.offsetWidth;
  }

  /**
   * Increments the scroll value by the given amount
   * @param scrollXIncrement The pixel value by which to increment the scroll value
   */
  incrementScroll(scrollXIncrement: number) {
    this.foundation_.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param scrollX The pixel value to scroll to
   */
  scrollTo(scrollX: number) {
    this.foundation_.scrollTo(scrollX);
  }
}
