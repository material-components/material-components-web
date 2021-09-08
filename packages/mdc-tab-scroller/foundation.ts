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

import {MDCFoundation} from '@material/base/foundation';
import {MDCTabScrollerAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCTabScrollerRTLDefault} from './rtl-default-scroller';
import {MDCTabScrollerRTLNegative} from './rtl-negative-scroller';
import {MDCTabScrollerRTLReverse} from './rtl-reverse-scroller';
import {MDCTabScrollerRTL} from './rtl-scroller';
import {MDCTabScrollerAnimation, MDCTabScrollerHorizontalEdges} from './types';

export class MDCTabScrollerFoundation extends MDCFoundation<MDCTabScrollerAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get defaultAdapter(): MDCTabScrollerAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      eventTargetMatchesSelector: () => false,
      addClass: () => undefined,
      removeClass: () => undefined,
      addScrollAreaClass: () => undefined,
      setScrollAreaStyleProperty: () => undefined,
      setScrollContentStyleProperty: () => undefined,
      getScrollContentStyleValue: () => '',
      setScrollAreaScrollLeft: () => undefined,
      getScrollAreaScrollLeft: () => 0,
      getScrollContentOffsetWidth: () => 0,
      getScrollAreaOffsetWidth: () => 0,
      computeScrollAreaClientRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      computeScrollContentClientRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      computeHorizontalScrollbarHeight: () => 0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  /**
   * Controls whether we should handle the transitionend and interaction events during the animation.
   */
  private isAnimating = false;

  /**
   * The MDCTabScrollerRTL instance varies per browser and allows us to encapsulate the peculiar browser behavior
   * of RTL scrolling in it's own class.
   */
  private rtlScrollerInstance?: MDCTabScrollerRTL;

  constructor(adapter?: Partial<MDCTabScrollerAdapter>) {
    super({...MDCTabScrollerFoundation.defaultAdapter, ...adapter});
  }

  override init() {
    // Compute horizontal scrollbar height on scroller with overflow initially hidden, then update overflow to scroll
    // and immediately adjust bottom margin to avoid the scrollbar initially appearing before JS runs.
    const horizontalScrollbarHeight =
        this.adapter.computeHorizontalScrollbarHeight();
    this.adapter.setScrollAreaStyleProperty(
        'margin-bottom', -horizontalScrollbarHeight + 'px');
    this.adapter.addScrollAreaClass(
        MDCTabScrollerFoundation.cssClasses.SCROLL_AREA_SCROLL);
  }

  /**
   * Computes the current visual scroll position
   */
  getScrollPosition(): number {
    if (this.isRTL()) {
      return this.computeCurrentScrollPositionRTL();
    }

    const currentTranslateX = this.calculateCurrentTranslateX();
    const scrollLeft = this.adapter.getScrollAreaScrollLeft();
    return scrollLeft - currentTranslateX;
  }

  /**
   * Handles interaction events that occur during transition
   */
  handleInteraction() {
    // Early exit if we aren't animating
    if (!this.isAnimating) {
      return;
    }

    // Prevent other event listeners from handling this event
    this.stopScrollAnimation();
  }

  /**
   * Handles the transitionend event
   */
  handleTransitionEnd(evt: Event) {
    // Early exit if we aren't animating or the event was triggered by a different element.
    const evtTarget = evt.target as Element;
    if (!this.isAnimating ||
        !this.adapter.eventTargetMatchesSelector(
            evtTarget, MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)) {
      return;
    }

    this.isAnimating = false;
    this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
  }

  /**
   * Increment the scroll value by the scrollXIncrement using animation.
   * @param scrollXIncrement The value by which to increment the scroll position
   */
  incrementScroll(scrollXIncrement: number) {
    // Early exit for non-operational increment values
    if (scrollXIncrement === 0) {
      return;
    }

    this.animate(this.getIncrementScrollOperation(scrollXIncrement));
  }

  /**
   * Increment the scroll value by the scrollXIncrement without animation.
   * @param scrollXIncrement The value by which to increment the scroll position
   */
  incrementScrollImmediate(scrollXIncrement: number) {
    // Early exit for non-operational increment values
    if (scrollXIncrement === 0) {
      return;
    }

    const operation = this.getIncrementScrollOperation(scrollXIncrement);
    if (operation.scrollDelta === 0) {
      return;
    }

    this.stopScrollAnimation();
    this.adapter.setScrollAreaScrollLeft(operation.finalScrollPosition);
  }

  /**
   * Scrolls to the given scrollX value
   */
  scrollTo(scrollX: number) {
    if (this.isRTL()) {
      this.scrollToImplRTL(scrollX);
      return;
    }

    this.scrollToImpl(scrollX);
  }

  /**
   * @return Browser-specific {@link MDCTabScrollerRTL} instance.
   */
  getRTLScroller(): MDCTabScrollerRTL {
    if (!this.rtlScrollerInstance) {
      this.rtlScrollerInstance = this.rtlScrollerFactory();
    }

    return this.rtlScrollerInstance;
  }

  /**
   * @return translateX value from a CSS matrix transform function string.
   */
  private calculateCurrentTranslateX(): number {
    const transformValue = this.adapter.getScrollContentStyleValue('transform');
    // Early exit if no transform is present
    if (transformValue === 'none') {
      return 0;
    }

    // The transform value comes back as a matrix transformation in the form
    // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
    // we're going to grab all the parenthesized values, strip out tx, and
    // parse it.
    const match = /\((.+?)\)/.exec(transformValue);
    if (!match) {
      return 0;
    }

    const matrixParams = match[1];

    // tslint:disable-next-line:ban-ts-ignore "Unused vars" should be a linter warning, not a compiler error.
    // @ts-ignore These unused variables should retain their semantic names for clarity.
    const [a, b, c, d, tx, ty] = matrixParams.split(',');

    return parseFloat(tx); // tslint:disable-line:ban
  }

  /**
   * Calculates a safe scroll value that is > 0 and < the max scroll value
   * @param scrollX The distance to scroll
   */
  private clampScrollValue(scrollX: number): number {
    const edges = this.calculateScrollEdges();
    return Math.min(Math.max(edges.left, scrollX), edges.right);
  }

  private computeCurrentScrollPositionRTL(): number {
    const translateX = this.calculateCurrentTranslateX();
    return this.getRTLScroller().getScrollPositionRTL(translateX);
  }

  private calculateScrollEdges(): MDCTabScrollerHorizontalEdges {
    const contentWidth = this.adapter.getScrollContentOffsetWidth();
    const rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: 0,
      right: contentWidth - rootWidth,
    };
  }

  /**
   * Internal scroll method
   * @param scrollX The new scroll position
   */
  private scrollToImpl(scrollX: number) {
    const currentScrollX = this.getScrollPosition();
    const safeScrollX = this.clampScrollValue(scrollX);
    const scrollDelta = safeScrollX - currentScrollX;
    this.animate({
      finalScrollPosition: safeScrollX,
      scrollDelta,
    });
  }

  /**
   * Internal RTL scroll method
   * @param scrollX The new scroll position
   */
  private scrollToImplRTL(scrollX: number) {
    const animation = this.getRTLScroller().scrollToRTL(scrollX);
    this.animate(animation);
  }

  /**
   * Internal method to compute the increment scroll operation values.
   * @param scrollX The desired scroll position increment
   * @return MDCTabScrollerAnimation with the sanitized values for performing the scroll operation.
   */
  private getIncrementScrollOperation(scrollX: number):
      MDCTabScrollerAnimation {
    if (this.isRTL()) {
      return this.getRTLScroller().incrementScrollRTL(scrollX);
    }

    const currentScrollX = this.getScrollPosition();
    const targetScrollX = scrollX + currentScrollX;
    const safeScrollX = this.clampScrollValue(targetScrollX);
    const scrollDelta = safeScrollX - currentScrollX;
    return {
      finalScrollPosition: safeScrollX,
      scrollDelta,
    };
  }

  /**
   * Animates the tab scrolling
   * @param animation The animation to apply
   */
  private animate(animation: MDCTabScrollerAnimation) {
    // Early exit if translateX is 0, which means there's no animation to perform
    if (animation.scrollDelta === 0) {
      return;
    }

    this.stopScrollAnimation();
    // This animation uses the FLIP approach.
    // Read more here: https://aerotwist.com/blog/flip-your-animations/
    this.adapter.setScrollAreaScrollLeft(animation.finalScrollPosition);
    this.adapter.setScrollContentStyleProperty(
        'transform', `translateX(${animation.scrollDelta}px)`);
    // Force repaint
    this.adapter.computeScrollAreaClientRect();

    requestAnimationFrame(() => {
      this.adapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
      this.adapter.setScrollContentStyleProperty('transform', 'none');
    });

    this.isAnimating = true;
  }

  /**
   * Stops scroll animation
   */
  private stopScrollAnimation() {
    this.isAnimating = false;
    const currentScrollPosition = this.getAnimatingScrollPosition();
    this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
    this.adapter.setScrollContentStyleProperty('transform', 'translateX(0px)');
    this.adapter.setScrollAreaScrollLeft(currentScrollPosition);
  }

  /**
   * Gets the current scroll position during animation
   */
  private getAnimatingScrollPosition(): number {
    const currentTranslateX = this.calculateCurrentTranslateX();
    const scrollLeft = this.adapter.getScrollAreaScrollLeft();
    if (this.isRTL()) {
      return this.getRTLScroller().getAnimatingScrollPosition(scrollLeft, currentTranslateX);
    }

    return scrollLeft - currentTranslateX;
  }

  /**
   * Determines the RTL Scroller to use
   */
  private rtlScrollerFactory(): MDCTabScrollerRTL {
    // Browsers have three different implementations of scrollLeft in RTL mode,
    // dependent on the browser. The behavior is based off the max LTR
    // scrollLeft value and 0.
    //
    // * Default scrolling in RTL *
    //    - Left-most value: 0
    //    - Right-most value: Max LTR scrollLeft value
    //
    // * Negative scrolling in RTL *
    //    - Left-most value: Negated max LTR scrollLeft value
    //    - Right-most value: 0
    //
    // * Reverse scrolling in RTL *
    //    - Left-most value: Max LTR scrollLeft value
    //    - Right-most value: 0
    //
    // We use those principles below to determine which RTL scrollLeft
    // behavior is implemented in the current browser.
    const initialScrollLeft = this.adapter.getScrollAreaScrollLeft();
    this.adapter.setScrollAreaScrollLeft(initialScrollLeft - 1);
    const newScrollLeft = this.adapter.getScrollAreaScrollLeft();

    // If the newScrollLeft value is negative,then we know that the browser has
    // implemented negative RTL scrolling, since all other implementations have
    // only positive values.
    if (newScrollLeft < 0) {
      // Undo the scrollLeft test check
      this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
      return new MDCTabScrollerRTLNegative(this.adapter);
    }

    const rootClientRect = this.adapter.computeScrollAreaClientRect();
    const contentClientRect = this.adapter.computeScrollContentClientRect();
    const rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
    // Undo the scrollLeft test check
    this.adapter.setScrollAreaScrollLeft(initialScrollLeft);

    // By calculating the clientRect of the root element and the clientRect of
    // the content element, we can determine how much the scroll value changed
    // when we performed the scrollLeft subtraction above.
    if (rightEdgeDelta === newScrollLeft) {
      return new MDCTabScrollerRTLReverse(this.adapter);
    }

    return new MDCTabScrollerRTLDefault(this.adapter);
  }

  private isRTL(): boolean {
    return this.adapter.getScrollContentStyleValue('direction') === 'rtl';
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabScrollerFoundation;
