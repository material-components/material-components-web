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

type InteractionEventType =
    'wheel'|'touchstart'|'pointerdown'|'mousedown'|'keydown';

/** MDC Tab Scroller Factory */
export type MDCTabScrollerFactory =
    (el: HTMLElement, foundation?: MDCTabScrollerFoundation) => MDCTabScroller;

/** MDC Tab Scroller */
export class MDCTabScroller extends MDCComponent<MDCTabScrollerFoundation> {
  static override attachTo(root: HTMLElement): MDCTabScroller {
    return new MDCTabScroller(root);
  }

  private content!: HTMLElement;  // assigned in initialize()
  private area!: HTMLElement;     // assigned in initialize()
  private handleInteraction!:
      SpecificEventListener<InteractionEventType>;  // assigned in
                                                    // initialSyncWithDOM()
  private handleTransitionEnd!:
      SpecificEventListener<'transitionend'>;  // assigned in
                                               // initialSyncWithDOM()

  override initialize() {
    this.area = this.root.querySelector<HTMLElement>(
        MDCTabScrollerFoundation.strings.AREA_SELECTOR)!;
    this.content = this.root.querySelector<HTMLElement>(
        MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)!;
  }

  override initialSyncWithDOM() {
    this.handleInteraction = () => {
      this.foundation.handleInteraction();
    };
    this.handleTransitionEnd = (evt) => {
      this.foundation.handleTransitionEnd(evt);
    };

    this.area.addEventListener('wheel', this.handleInteraction, applyPassive());
    this.area.addEventListener(
        'touchstart', this.handleInteraction, applyPassive());
    this.area.addEventListener(
        'pointerdown', this.handleInteraction, applyPassive());
    this.area.addEventListener(
        'mousedown', this.handleInteraction, applyPassive());
    this.area.addEventListener(
        'keydown', this.handleInteraction, applyPassive());
    this.content.addEventListener('transitionend', this.handleTransitionEnd);
  }

  override destroy() {
    super.destroy();

    this.area.removeEventListener(
        'wheel', this.handleInteraction, applyPassive());
    this.area.removeEventListener(
        'touchstart', this.handleInteraction, applyPassive());
    this.area.removeEventListener(
        'pointerdown', this.handleInteraction, applyPassive());
    this.area.removeEventListener(
        'mousedown', this.handleInteraction, applyPassive());
    this.area.removeEventListener(
        'keydown', this.handleInteraction, applyPassive());
    this.content.removeEventListener('transitionend', this.handleTransitionEnd);
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabScrollerAdapter = {
      eventTargetMatchesSelector: (evtTarget, selector) =>
          matches(evtTarget as Element, selector),
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      addScrollAreaClass: (className) => {
        this.area.classList.add(className);
      },
      setScrollAreaStyleProperty: (prop, value) => {
        this.area.style.setProperty(prop, value);
      },
      setScrollContentStyleProperty: (prop, value) => {
        this.content.style.setProperty(prop, value);
      },
      getScrollContentStyleValue: (propName) =>
          window.getComputedStyle(this.content).getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX) => this.area.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.area.scrollLeft,
      getScrollContentOffsetWidth: () => this.content.offsetWidth,
      getScrollAreaOffsetWidth: () => this.area.offsetWidth,
      computeScrollAreaClientRect: () => this.area.getBoundingClientRect(),
      computeScrollContentClientRect: () =>
          this.content.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () =>
          util.computeHorizontalScrollbarHeight(document),
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTabScrollerFoundation(adapter);
  }

  /**
   * Returns the current visual scroll position
   */
  getScrollPosition(): number {
    return this.foundation.getScrollPosition();
  }

  /**
   * Returns the width of the scroll content
   */
  getScrollContentWidth(): number {
    return this.content.offsetWidth;
  }

  /**
   * Increments the scroll value by the given amount
   * @param scrollXIncrement The pixel value by which to increment the scroll
   *     value
   */
  incrementScroll(scrollXIncrement: number) {
    this.foundation.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param scrollX The pixel value to scroll to
   */
  scrollTo(scrollX: number) {
    this.foundation.scrollTo(scrollX);
  }
}
