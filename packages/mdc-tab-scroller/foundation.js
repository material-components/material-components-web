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

// Interaction events registered on the root element
const INTERACTION_EVENT_TYPES = ['scroll', 'touchstart', 'pointerdown', 'mousedown', 'keydown'];

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
      computeContentClientRect: () => {},
      computeClientRect: () => {},
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

    // Compute the current translateX value
    const transform = this.adapter_.getContentStyleValue('transform');
    const currentTranslateX = this.calculateTranslateX_(transform);
    // Stop animating
    this.adapter_.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
    // Instead of unsetting the transform property, we need to set it to a
    // valid property, otherwise Firefox will keep animating
    this.adapter_.setContentStyleProperty('transform', 'translateX(0px)');

    // Update the scrollLeft to include the calculated translateX
    this.adapter_.setScrollLeft(this.adapter_.getScrollLeft() - currentTranslateX);
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
    const scrollLeft = this.calculateSafeScrollValue_(scrollX);
    // Calculate the difference between the current scroll left and the new one
    const currentScrollLeft = this.adapter_.getScrollLeft();
    const scrollDelta = scrollLeft - currentScrollLeft;

    // Early exit if there scroll values are the same
    if (scrollDelta === 0) {
      return;
    }

    // This animation uses the FLIP approach.
    // Read more here: https://aerotwist.com/blog/flip-your-animations/

    // Apply the transformation
    this.adapter_.setContentStyleProperty('transform', `translateX(${scrollDelta}px)`);
    this.adapter_.setScrollLeft(scrollLeft);
    this.shouldHandleInteraction_ = false;

    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
      this.adapter_.setContentStyleProperty('transform', 'none');
      this.registerInteractionHandlers_();
    });

    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);

    // Double-wrapped in a rAF because Firefox gets frisky with the scroll
    // event and triggers a scroll event even though the handlers are bound
    // *after* the scrollLeft value is set. This double-wrapped rAF ensures
    // that we don't accidentally cancel the transition before it happens.
    // See https://youtu.be/mmq-KVeO-uU?t=14m0s for an excellent explanation.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.shouldHandleInteraction_ = true;
      });
    });
  }

  /**
   * Registers interaction events
   * @private
   */
  registerInteractionHandlers_() {
    INTERACTION_EVENT_TYPES.forEach((eventName) => {
      this.adapter_.registerEventHandler(eventName, this.handleInteraction_);
    });
  }

  /**
   * Deregisters interaction events
   * @private
   */
  deregisterInteractionHandlers_() {
    INTERACTION_EVENT_TYPES.forEach((eventName) => {
      this.adapter_.deregisterEventHandler(eventName, this.handleInteraction_);
    });
  }

  calculateTranslateX_(transformValue) {
    // The transform value comes back as a matrix transformation in the form
    // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
    // we're going to grab all the values, strip out tx, and parse it.
    const results = /\((.+)\)/.exec(transformValue)[1];
    return parseFloat(results.split(',')[4]);
  }

  calculateSafeScrollValue_(scrollLeft) {
    if (scrollLeft < 0) {
      return 0;
    }
    const contentClientRect = this.adapter_.computeContentClientRect();
    const rootClientRect = this.adapter_.computeClientRect();
    const maxScrollValue = Math.floor(contentClientRect.width - rootClientRect.width);
    return Math.min(scrollLeft, maxScrollValue);
  }
}

export default MDCTabScrollerFoundation;
