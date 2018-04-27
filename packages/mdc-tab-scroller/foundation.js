/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *      http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import MDCFoundation from '@material/base/foundation';
import {cssClasses, strings} from './constants';
/* eslint-disable no-unused-vars */
import {MDCTabScrollerAnimation, MDCTabScrollerEdges, MDCTabScrollerAdapter} from './adapter';
import MDCTabScrollerRTL from './rtl-scroller';
/* eslint-enable no-unused-vars */
import MDCTabScrollerRTLDefault from './rtl-default-scroller';
import MDCTabScrollerRTLNegative from './rtl-negative-scroller';
import MDCTabScrollerRTLReverse from './rtl-reverse-scroller';

const INTERACTION_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'mousedown', 'keydown'];

/**
 * @extends {MDCFoundation<!MDCTabScrollerAdapter>}
 * @final
 */
class MDCTabScrollerFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * @see MDCTabScrollerAdapter for typing information
   * @return {!MDCTabScrollerAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabScrollerAdapter} */ ({
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      addClass: () => {},
      removeClass: () => {},
      setContentStyleProperty: () => {},
      getContentStyleValue: () => {},
      setScrollLeft: () => {},
      getScrollLeft: () => {},
      getContentOffsetWidth: () => {},
      getOffsetWidth: () => {},
      computeClientRect: () => {},
      computeContentClientRect: () => {},
    });
  }

  /** @param {!MDCTabScrollerAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCTabScrollerFoundation.defaultAdapter, adapter));

    /** @private {function(?Event=)} */
    this.handleInteraction_ = () => this.handleInteraction();

    /** @private {function(?Event=)} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();

    /** @private {boolean} */
    this.shouldHandleInteraction_ = false;

    /** @private {boolean} */
    this.isAnimating_ = false;

    /** @private {?MDCTabScrollerRTL} */
    this.rtlScrollerInstance_;
  }

  /**
   * Computes the current visual scroll position
   * @return {number}
   */
  computeCurrentScrollPosition() {
    if (this.isRTL_()) {
      return this.computeCurrentScrollPositionRTL_();
    }

    const currentTranslateX = this.calculateCurrentTranslateX_();
    const scrollLeft = this.adapter_.getScrollLeft();
    return scrollLeft - currentTranslateX;
  }

  /**
   * Handles interaction events that occur during transition
   */
  handleInteraction() {
    // Early exit if we're already handling the interaction
    // This is necessary for cases like scrolling where the event handler can
    // fire multiple times before it is unbound.
    if (!this.shouldHandleInteraction_) {
      return;
    }

    // Prevent other event listeners from handling this event
    this.shouldHandleInteraction_ = false;
    this.stopScrollAnimation_();
    this.deregisterInteractionHandlers_();
  }

  /**
   * Handles the transitionend event
   */
  handleTransitionEnd() {
    this.isAnimating_ = false;
    this.shouldHandleInteraction_ = false;
    this.deregisterInteractionHandlers_();
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
  }

  /**
   * Increment the scroll value by the given amount
   * @param {number} scrollXIncrement The value by which to increment the scroll position
   */
  incrementScroll(scrollXIncrement) {
    if (this.isRTL_()) {
      return this.incrementScrollRTL_(scrollXIncrement);
    }

    this.incrementScroll_(scrollXIncrement);
  }

  /**
   * Scrolls to the given scrollX value
   * @param {number} scrollX
   */
  scrollTo(scrollX) {
    if (this.isRTL_()) {
      return this.scrollToRTL_(scrollX);
    }

    this.scrollTo_(scrollX);
  }

  /**
   * @return {!MDCTabScrollerRTL}
   */
  getRTLScroller() {
    if (!this.rtlScrollerInstance_) {
      this.rtlScrollerInstance_ = this.rtlScrollerFactory_();
    }

    return this.rtlScrollerInstance_;
  }

  /**
   * Returns the translateX value from a CSS matrix transform function string
   * @return {number}
   * @private
   */
  calculateCurrentTranslateX_() {
    const transformValue = this.adapter_.getContentStyleValue('transform');
    // Early exit if no transform is present
    if (transformValue === 'none') {
      return 0;
    }

    // The transform value comes back as a matrix transformation in the form
    // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
    // we're going to grab all the parenthesizedvalues, strip out tx, and parse it.
    const results = /\((.+)\)/.exec(transformValue)[1];
    const parts = results.split(',');
    return parseFloat(parts[4]);
  }

  /**
   * Calculates a safe scroll value that is > 0 and < the max scroll value
   * @param {number} scrollX The distance to scroll
   * @return {number}
   * @private
   */
  clampScrollValue_(scrollX) {
    const edges = this.calculateScrollEdges_();
    return Math.min(Math.max(edges.left, scrollX), edges.right);
  }

  /**
   * @return {number}
   * @private
   */
  computeCurrentScrollPositionRTL_() {
    const translateX = this.calculateCurrentTranslateX_();
    return this.getRTLScroller().computeCurrentScrollPositionRTL(translateX);
  }

  /**
   * @return {!MDCTabScrollerEdges}
   * @private
   */
  calculateScrollEdges_() {
    const contentWidth = this.adapter_.getContentOffsetWidth();
    const rootWidth = this.adapter_.getOffsetWidth();
    return /** @type {!MDCTabScrollerEdges} */ ({
      left: 0,
      right: Math.round(contentWidth - rootWidth),
    });
  }

  /**
   * Deregisters interaction events
   * @private
   */
  deregisterInteractionHandlers_() {
    INTERACTION_EVENTS.forEach((eventName) => {
      this.adapter_.deregisterEventHandler(eventName, this.handleInteraction_);
    });
    this.shouldHandleInteraction_ = false;
  }

  /**
   * Registers interaction events
   * @private
   */
  registerInteractionHandlers_() {
    INTERACTION_EVENTS.forEach((eventName) => {
      this.adapter_.registerEventHandler(eventName, this.handleInteraction_);
    });
    this.shouldHandleInteraction_ = true;
  }

  /**
   * Internal scroll method
   * @param {number} scrollX The new scroll position
   * @private
   */
  scrollTo_(scrollX) {
    const currentScrollX = this.computeCurrentScrollPosition();
    const safeScrollX = this.clampScrollValue_(scrollX);
    const scrollDelta = safeScrollX - currentScrollX;
    this.animate_(/** @type {!MDCTabScrollerAnimation} */ ({
      scrollX: safeScrollX,
      translateX: scrollDelta,
    }));
  }

  /**
   * Internal RTL scroll method
   * @param {number} scrollX The new scroll position
   * @private
   */
  scrollToRTL_(scrollX) {
    this.animate_(this.getRTLScroller().scrollToRTL(scrollX));
  }

  /**
   * Internal increment scroll method
   * @param {number} scrollX The new scroll position increment
   * @private
   */
  incrementScroll_(scrollX) {
    const currentScrollX = this.computeCurrentScrollPosition();
    const targetScrollX = scrollX + currentScrollX;
    const safeScrollX = this.clampScrollValue_(targetScrollX);
    const scrollDelta = safeScrollX - currentScrollX;
    this.animate_(/** @type {!MDCTabScrollerAnimation} */ ({
      scrollX: safeScrollX,
      translateX: scrollDelta,
    }));
  }

  /**
   * Internal incremenet scroll RTL method
   * @param {number} scrollX The new scroll position RTL increment
   * @private
   */
  incrementScrollRTL_(scrollX) {
    this.animate_(this.getRTLScroller().incrementScrollRTL(scrollX));
  }

  /**
   * Animates the tab scrolling
   * @param {!MDCTabScrollerAnimation} animation The animation to apply
   * @private
   */
  animate_(animation) {
    // Early exit if there's no animation to perform
    if (animation.translateX === 0) {
      return;
    }

    this.deregisterInteractionHandlers_();
    this.stopScrollAnimation_();
    // This animation uses the FLIP approach.
    // Read more here: https://aerotwist.com/blog/flip-your-animations/
    this.adapter_.setScrollLeft(animation.scrollX);
    this.adapter_.setContentStyleProperty('transform', `translateX(${animation.translateX}px)`);
    // Force repaint
    this.adapter_.computeClientRect();

    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
      this.adapter_.setContentStyleProperty('transform', 'none');
      this.isAnimating_ = true;
    });

    this.registerInteractionHandlers_();
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
  }

  /**
   * Stops scroll animation
   * @private
   */
  stopScrollAnimation_() {
    // Early exit if not animating
    if (!this.isAnimating_) {
      return;
    }

    this.isAnimating_ = false;
    const currentScrollPosition = this.computeCurrentScrollPosition();
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
    this.adapter_.setContentStyleProperty('transform', 'translateX(0px)');
    this.adapter_.setScrollLeft(currentScrollPosition);
  }

  /**
   * Determines the RTL Scroller to use
   * @return {!MDCTabScrollerRTL}
   * @private
   */
  rtlScrollerFactory_() {
    const initialScrollLeft = this.adapter_.getScrollLeft();
    this.adapter_.setScrollLeft(initialScrollLeft - 1);
    const newScrollLeft = this.adapter_.getScrollLeft();

    if (newScrollLeft < 0) {
      // Undo the scrollLeft test check
      this.adapter_.setScrollLeft(initialScrollLeft);
      return new MDCTabScrollerRTLNegative(this.adapter_);
    }

    const rootClientRect = this.adapter_.computeClientRect();
    const contentClientRect = this.adapter_.computeContentClientRect();
    const rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
    // Undo the scrollLeft test check
    this.adapter_.setScrollLeft(initialScrollLeft);

    if (rightEdgeDelta === newScrollLeft) {
      return new MDCTabScrollerRTLReverse(this.adapter_);
    }

    return new MDCTabScrollerRTLDefault(this.adapter_);
  }

  /**
   * @return {boolean}
   * @private
   */
  isRTL_() {
    return this.adapter_.getContentStyleValue('direction') === 'rtl';
  }
}

export default MDCTabScrollerFoundation;
