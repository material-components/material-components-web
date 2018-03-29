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
 * @final
 */
class MDCTabIndicatorBarFoundation extends MDCTabIndicatorFoundation {
  /**
   * @param {!ClientRect=} previousClientRect
   */
  activate(previousClientRect) {
    // Activate the tab
    this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);

    // Early exit if no indicator is present to handle cases where an indicator
    // may be activated without a prior indicator state
    if (!previousClientRect) {
      return;
    }

    // This animation uses the FLIP approach. You can read more about it at the link below:
    // https://aerotwist.com/blog/flip-your-animations/

    // Calculate the dimensions based on the dimensions of the previous indicator
    const currentClientRect = this.adapter_.getClientRect();
    const widthDelta = previousClientRect.width / currentClientRect.width;
    const xPosition = previousClientRect.left - currentClientRect.left;
    this.adapter_.setStyleProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);

    // Force repaint
    this.adapter_.getClientRect();

    // Add animating class and remove transformation in a new frame
    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING);
      this.adapter_.setStyleProperty('transform', '');
    });

    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
  }

  deactivate() {
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }
}

export default MDCTabIndicatorBarFoundation;
