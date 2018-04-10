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

import MDCTabIndicatorFoundation from './foundation';

/**
 * @extends {MDCTabIndicatorFoundation}
 * @final
 */
class MDCSlidingTabIndicatorFoundation extends MDCTabIndicatorFoundation {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @private {function(?Event): undefined} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
  }

  /** Handles the transitionend event */
  handleTransitionEnd() {
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE);
  }

  /** @param {!ClientRect=} previousIndicatorClientRect */
  activate(previousIndicatorClientRect) {
    this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);

    // Early exit if no indicator is present to handle cases where an indicator
    // may be activated without a prior indicator state
    if (!previousIndicatorClientRect) {
      return;
    }

    // This animation uses the FLIP approach. You can read more about it at the link below:
    // https://aerotwist.com/blog/flip-your-animations/

    // Calculate the dimensions based on the dimensions of the previous indicator
    const currentClientRect = this.computeContentClientRect();
    const widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
    const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    this.adapter_.setContentStyleProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);

    // Force repaint
    this.computeContentClientRect();

    // Add animating class and remove transformation in a new frame
    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE);
      this.adapter_.setContentStyleProperty('transform', '');
    });

    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
  }

  deactivate() {
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
    // We remove the animating class in deactivate in case the Tab is deactivated before the animation completes and
    // the "transitionend" handler isn't called.
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.SLIDING_ACTIVATE);
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
  }
}

export default MDCSlidingTabIndicatorFoundation;
