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

import MDCTabScrollerFoundation from './foundation';

const INTERACTION_EVENTS = ['scroll', 'touchstart', 'pointerdown', 'mousedown', 'keydown'];

/**
 * @extends {MDCTabScrollerFoundation}
 * @final
 */
class MDCTabScrollingFoundation extends MDCTabScrollerFoundation {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @private {function(?Event=)} */
    this.handleInteraction_ = () => this.handleInteraction();

    /** @private {function(?Event=)} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();

    /** @private {boolean} */
    this.shouldHandleInteraction_ = false;

    /** @private {boolean} */
    this.isAnimating_ = false;
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
    this.deregisterInteractionHandlers_();
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
  }

  /**
   * Scrolls to the given scrollX value
   * @param {number} scrollX
   */
  scrollTo(scrollX) {
    const currentScrollX = this.computeCurrentScrollPosition();
    const safeScrollX = this.calculateSafeScrollValue(scrollX);
    this.scrollTo_(safeScrollX, currentScrollX);
  }

  /**
   * Increment the scroll value by the given amount
   * @param {number} scrollXIncrement The value by which to increment the scroll position
   */
  incrementScroll(scrollXIncrement) {
    const currentScrollX = this.computeCurrentScrollPosition();
    const safeScrollX = this.calculateSafeScrollValue(currentScrollX + scrollXIncrement);
    this.scrollTo_(safeScrollX, currentScrollX);
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

    this.stopScrollAnimation_();
    this.shouldHandleInteraction_ = false;

    // This animation uses the FLIP approach.
    // Read more here: https://aerotwist.com/blog/flip-your-animations/

    this.adapter_.setContentStyleProperty('transform', `translateX(${scrollDelta}px)`);
    // Setting scrollLeft triggers the repaint necessary for FLIP
    this.adapter_.setScrollLeft(newScrollX);

    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
      this.adapter_.setContentStyleProperty('transform', 'none');
      this.isAnimating_ = true;
      requestAnimationFrame(() => {
        // Double-wrapped in a rAF because Firefox gets frisky with the scroll
        // event and triggers a scroll event even though the handlers are bound
        // *after* the scrollLeft value is set. This double-wrapped rAF ensures
        // that we don't accidentally handle the scrollEvent we've triggered.
        // See https://youtu.be/mmq-KVeO-uU?t=14m0s for a great explanation.
        this.registerInteractionHandlers_();
      });
    });

    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.shouldHandleInteraction_ = true;
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
   * Registers interaction events
   * @private
   */
  registerInteractionHandlers_() {
    INTERACTION_EVENTS.forEach((eventName) => {
      this.adapter_.registerEventHandler(eventName, this.handleInteraction_);
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
  }
}

export default MDCTabScrollingFoundation;
