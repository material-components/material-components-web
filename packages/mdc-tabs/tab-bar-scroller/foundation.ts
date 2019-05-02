/**
 * @license
 * Copyright 2017 Google Inc.
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
import {SpecificEventListener} from '@material/base/types';
import {MDCTabBarScrollerAdapter} from './adapter';
import {cssClasses, strings} from './constants';

type InteractionEventType = 'touchstart' | 'mousedown' | 'focus';

const INTERACTION_EVENTS: InteractionEventType[] = ['touchstart', 'mousedown', 'focus'];

export class MDCTabBarScrollerFoundation extends MDCFoundation<MDCTabBarScrollerAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCTabBarScrollerAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      eventTargetHasClass: () => false,
      addClassToForwardIndicator: () => undefined,
      removeClassFromForwardIndicator: () => undefined,
      addClassToBackIndicator: () => undefined,
      removeClassFromBackIndicator: () => undefined,
      isRTL: () => false,
      registerBackIndicatorClickHandler: () => undefined,
      deregisterBackIndicatorClickHandler: () => undefined,
      registerForwardIndicatorClickHandler: () => undefined,
      deregisterForwardIndicatorClickHandler: () => undefined,
      registerCapturedInteractionHandler: () => undefined,
      deregisterCapturedInteractionHandler: () => undefined,
      registerWindowResizeHandler: () => undefined,
      deregisterWindowResizeHandler: () => undefined,
      getNumberOfTabs: () => 0,
      getComputedWidthForTabAtIndex: () => 0,
      getComputedLeftForTabAtIndex: () => 0,
      getOffsetWidthForScrollFrame: () => 0,
      getScrollLeftForScrollFrame: () => 0,
      setScrollLeftForScrollFrame: () => undefined,
      getOffsetWidthForTabBar: () => 0,
      setTransformStyleForTabBar: () => undefined,
      getOffsetLeftForEventTarget: () => 0,
      getOffsetWidthForEventTarget: () => 0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private pointerDownRecognized_ = false;
  private currentTranslateOffset_ = 0;
  private focusedTarget_: HTMLElement | null = null;
  private layoutFrame_ = 0;
  private scrollFrameScrollLeft_ = 0;

  private readonly forwardIndicatorClickHandler_: SpecificEventListener<'click'>;
  private readonly backIndicatorClickHandler_: SpecificEventListener<'click'>;
  private readonly resizeHandler_: SpecificEventListener<'resize'>;
  private readonly interactionHandler_: SpecificEventListener<InteractionEventType>;

  constructor(adapter?: Partial<MDCTabBarScrollerAdapter>) {
    super({...MDCTabBarScrollerFoundation.defaultAdapter, ...adapter});

    this.forwardIndicatorClickHandler_ = (evt) => this.scrollForward(evt);
    this.backIndicatorClickHandler_ = (evt) => this.scrollBack(evt);
    this.resizeHandler_ = () => this.layout();
    this.interactionHandler_ = (evt) => {
      if (evt.type === 'touchstart' || evt.type === 'mousedown') {
        this.pointerDownRecognized_ = true;
      }
      this.handlePossibleTabKeyboardFocus_(evt);
      if (evt.type === 'focus') {
        this.pointerDownRecognized_ = false;
      }
    };
  }

  init() {
    this.adapter_.registerBackIndicatorClickHandler(this.backIndicatorClickHandler_);
    this.adapter_.registerForwardIndicatorClickHandler(this.forwardIndicatorClickHandler_);
    this.adapter_.registerWindowResizeHandler(this.resizeHandler_);
    INTERACTION_EVENTS.forEach((evtType) => {
      this.adapter_.registerCapturedInteractionHandler(evtType, this.interactionHandler_);
    });
    this.layout();
  }

  destroy() {
    this.adapter_.deregisterBackIndicatorClickHandler(this.backIndicatorClickHandler_);
    this.adapter_.deregisterForwardIndicatorClickHandler(this.forwardIndicatorClickHandler_);
    this.adapter_.deregisterWindowResizeHandler(this.resizeHandler_);
    INTERACTION_EVENTS.forEach((evtType) => {
      this.adapter_.deregisterCapturedInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  scrollBack(evt?: MouseEvent) {
    if (evt) {
      evt.preventDefault();
    }

    let tabWidthAccumulator = 0;
    let scrollTargetIndex = 0;

    for (let i = this.adapter_.getNumberOfTabs() - 1; i > 0; i--) {
      const tabOffsetLeft = this.adapter_.getComputedLeftForTabAtIndex(i);
      const tabBarWidthLessTabOffsetLeft = this.adapter_.getOffsetWidthForTabBar() - tabOffsetLeft;

      let tabIsNotOccluded = tabOffsetLeft > this.currentTranslateOffset_;
      if (this.isRTL_()) {
        tabIsNotOccluded = tabBarWidthLessTabOffsetLeft > this.currentTranslateOffset_;
      }

      if (tabIsNotOccluded) {
        continue;
      }

      tabWidthAccumulator += this.adapter_.getComputedWidthForTabAtIndex(i);

      const scrollTargetDetermined = tabWidthAccumulator > this.adapter_.getOffsetWidthForScrollFrame();
      if (scrollTargetDetermined) {
        scrollTargetIndex = this.isRTL_() ? i + 1 : i;
        break;
      }
    }

    this.scrollToTabAtIndex(scrollTargetIndex);
  }

  scrollForward(evt?: MouseEvent) {
    if (evt) {
      evt.preventDefault();
    }

    const scrollFrameOffsetWidth = this.adapter_.getOffsetWidthForScrollFrame() + this.currentTranslateOffset_;
    let scrollTargetIndex = 0;

    for (let i = 0; i < this.adapter_.getNumberOfTabs(); i++) {
      const tabOffsetLeftAndWidth =
          this.adapter_.getComputedLeftForTabAtIndex(i) + this.adapter_.getComputedWidthForTabAtIndex(i);
      let scrollTargetDetermined = tabOffsetLeftAndWidth > scrollFrameOffsetWidth;

      if (this.isRTL_()) {
        const frameOffsetAndTabWidth =
            scrollFrameOffsetWidth - this.adapter_.getComputedWidthForTabAtIndex(i);
        const tabRightOffset =
            this.adapter_.getOffsetWidthForTabBar() - tabOffsetLeftAndWidth;

        scrollTargetDetermined = tabRightOffset > frameOffsetAndTabWidth;
      }

      if (scrollTargetDetermined) {
        scrollTargetIndex = i;
        break;
      }
    }

    this.scrollToTabAtIndex(scrollTargetIndex);
  }

  layout() {
    cancelAnimationFrame(this.layoutFrame_);
    this.scrollFrameScrollLeft_ = this.adapter_.getScrollLeftForScrollFrame();
    this.layoutFrame_ = requestAnimationFrame(() => this.layout_());
  }

  scrollToTabAtIndex(index: number) {
    const scrollTargetOffsetLeft = this.adapter_.getComputedLeftForTabAtIndex(index);
    const scrollTargetOffsetWidth = this.adapter_.getComputedWidthForTabAtIndex(index);

    this.currentTranslateOffset_ =
        this.normalizeForRTL_(scrollTargetOffsetLeft, scrollTargetOffsetWidth);

    requestAnimationFrame(() => this.shiftFrame_());
  }

  private layout_() {
    const frameWidth = this.adapter_.getOffsetWidthForScrollFrame();
    const isOverflowing = this.adapter_.getOffsetWidthForTabBar() > frameWidth;

    if (!isOverflowing) {
      this.currentTranslateOffset_ = 0;
    }

    this.shiftFrame_();
    this.updateIndicatorEnabledStates_();
  }

  private shiftFrame_() {
    const shiftAmount = this.isRTL_() ?
        this.currentTranslateOffset_ : -this.currentTranslateOffset_;

    this.adapter_.setTransformStyleForTabBar(`translateX(${shiftAmount}px)`);
    this.updateIndicatorEnabledStates_();
  }

  private handlePossibleTabKeyboardFocus_(evt: MouseEvent | TouchEvent | FocusEvent) {
    const target = evt.target as HTMLElement;

    if (!this.adapter_.eventTargetHasClass(target, cssClasses.TAB) || this.pointerDownRecognized_) {
      return;
    }

    const resetAmt = this.isRTL_() ? this.scrollFrameScrollLeft_ : 0;
    this.adapter_.setScrollLeftForScrollFrame(resetAmt);

    this.focusedTarget_ = target;

    const scrollFrameWidth = this.adapter_.getOffsetWidthForScrollFrame();
    const tabBarWidth = this.adapter_.getOffsetWidthForTabBar();
    const leftEdge = this.adapter_.getOffsetLeftForEventTarget(this.focusedTarget_);
    const rightEdge = leftEdge + this.adapter_.getOffsetWidthForEventTarget(this.focusedTarget_);

    let shouldScrollBack = rightEdge <= this.currentTranslateOffset_;
    let shouldScrollForward = rightEdge > this.currentTranslateOffset_ + scrollFrameWidth;

    if (this.isRTL_()) {
      const normalizedLeftOffset = tabBarWidth - leftEdge;
      shouldScrollBack = leftEdge >= tabBarWidth - this.currentTranslateOffset_;
      shouldScrollForward = normalizedLeftOffset > scrollFrameWidth + this.currentTranslateOffset_;
    }

    if (shouldScrollForward) {
      this.scrollForward();
    } else if (shouldScrollBack) {
      this.scrollBack();
    }

    this.pointerDownRecognized_ = false;
  }

  private updateIndicatorEnabledStates_() {
    const {INDICATOR_ENABLED} = cssClasses;
    if (this.currentTranslateOffset_ === 0) {
      this.adapter_.removeClassFromBackIndicator(INDICATOR_ENABLED);
    } else {
      this.adapter_.addClassToBackIndicator(INDICATOR_ENABLED);
    }

    const remainingTabBarWidth = this.adapter_.getOffsetWidthForTabBar() - this.currentTranslateOffset_;
    if (remainingTabBarWidth > this.adapter_.getOffsetWidthForScrollFrame()) {
      this.adapter_.addClassToForwardIndicator(INDICATOR_ENABLED);
    } else {
      this.adapter_.removeClassFromForwardIndicator(INDICATOR_ENABLED);
    }
  }

  private normalizeForRTL_(left: number, width: number) {
    return this.isRTL_() ? this.adapter_.getOffsetWidthForTabBar() - (left + width) : left;
  }

  private isRTL_() {
    return this.adapter_.isRTL();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabBarScrollerFoundation;
