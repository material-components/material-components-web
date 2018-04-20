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
import MDCTabScrollerAdapter from './adapter';
import {
  cssClasses,
  strings,
} from './constants';

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

    /** @private {?string} */
    this.rtlScrollType_;
  }

  /**
   * Computes the current visual scroll position
   * @return {number}
   */
  computeCurrentScrollPosition() {
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
    const currentScrollX = this.computeCurrentScrollPosition();
    const safeScrollX = this.calculateSafeScrollValue_(currentScrollX + scrollXIncrement);
    this.scrollTo_(safeScrollX, currentScrollX);
  }

  /**
   * Scrolls to the given scrollX value
   * @param {number} scrollX
   */
  scrollTo(scrollX) {
    const currentScrollX = this.computeCurrentScrollPosition();
    const safeScrollX = this.calculateSafeScrollValue_(scrollX);
    this.scrollTo_(safeScrollX, currentScrollX);
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
  calculateSafeScrollValue_(scrollX) {
    // Early exit for negative scroll values
    if (scrollX < 0) {
      return 0;
    }

    const contentWidth = this.adapter_.getContentOffsetWidth();
    const rootWidth = this.adapter_.getOffsetWidth();
    // Scroll values on most browsers are ints instead of floats so we round
    const maxScrollValue = Math.round(contentWidth - rootWidth);
    return Math.min(scrollX, maxScrollValue);
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
   * @return {boolean}
   * @private
   */
  isRTL_() {
    return this.adapter_.getContentStyleValue('direction') === 'rtl';
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
   * @param {number} newScrollX The new scroll position
   * @param {number} currentScrollX The current scroll position
   * @private
   */
  scrollTo_(newScrollX, currentScrollX) {
    const scrollDelta = newScrollX - currentScrollX;
    // Early exit if the scroll values are the same
    if (scrollDelta === 0) {
      return;
    }

    this.deregisterInteractionHandlers_();
    this.stopScrollAnimation_();

    if (this.isRTL_()) {
      const direction = this.computeScrollDirection_();
      console.log('scroll direction', direction);
    }

    // This animation uses the FLIP approach.
    // Read more here: https://aerotwist.com/blog/flip-your-animations/

    this.adapter_.setContentStyleProperty('transform', `translateX(${scrollDelta}px)`);
    // Setting scrollLeft triggers the repaint necessary for FLIP
    this.adapter_.setScrollLeft(newScrollX);

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

  computeScrollDirection_() {
    if (this.rtlScrollType_) {
      return this.rtlScrollType_;
    }

    const initialScrollLeft = this.adapter_.getScrollLeft();
    this.adapter_.setScrollLeft(initialScrollLeft - 1);
    const newScrollLeft = this.adapter_.getScrollLeft();

    // Firefox/Opera
    if (newScrollLeft < 0) {
      this.rtlScrollType_ = MDCTabScrollerFoundation.strings.RTL_NEGATIVE;
      // Early exit
      return this.rtlScrollType_;
    }

    const rootClientRect = this.adapter_.computeClientRect();
    const contentClientRect = this.adapter_.computeContentClientRect();
    const rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);

    if (rightEdgeDelta === initialScrollLeft) {
      // IE/Edge
      this.rtlScrollType_ = MDCTabScrollerFoundation.strings.RTL_REVERSE;
    } else {
      // Webkit
      this.rtlScrollType_ = MDCTabScrollerFoundation.strings.RTL_DEFAULT;
    }

    return this.rtlScrollType_;
  }
}

export default MDCTabScrollerFoundation;
