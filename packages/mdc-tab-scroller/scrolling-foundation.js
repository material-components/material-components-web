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
    this.deregisterInteractionHandlers_();
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
    // Instead of unsetting the transform property, we need to set it to a
    // valid property, otherwise Firefox will keep animating
    this.adapter_.setContentStyleProperty('transform', 'translateX(0px)');

    // Update the scrollLeft to include the calculated translateX
    this.adapter_.setScrollLeft(this.adapter_.getScrollLeft() - this.calculateCurrentTranslateX());
  }

  /**
   * Handles the transitionend event
   */
  handleTransitionEnd() {
    this.deregisterInteractionHandlers_();
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
  }

  /**
   * Scrolls to the given scrollX value
   * @param {number} scrollX
   */
  scrollTo(scrollX) {
    const scrollLeft = this.calculateSafeScrollValue(scrollX);
    const currentScrollLeft = this.adapter_.getScrollLeft();
    const scrollDelta = scrollLeft - currentScrollLeft;

    // Early exit if there scroll values are the same
    if (scrollDelta === 0) {
      return;
    }

    // This animation uses the FLIP approach.
    // Read more here: https://aerotwist.com/blog/flip-your-animations/

    this.adapter_.setContentStyleProperty('transform', `translateX(${scrollDelta}px)`);
    // Setting scrollLeft triggers a repaint
    this.adapter_.setScrollLeft(scrollLeft);
    this.shouldHandleInteraction_ = false;

    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
      this.adapter_.setContentStyleProperty('transform', 'none');
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
