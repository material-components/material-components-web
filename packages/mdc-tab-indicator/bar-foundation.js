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
   * @override
   */
  activate(previousClientRect) {
    // Activate the tab
    this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
    if (!previousClientRect) {
      return;
    }

    // Calculate the dimensions based on the dimensions of the previous indicator
    const currentClientRect = this.adapter_.getClientRect();
    const widthDelta = previousClientRect.width / currentClientRect.width;
    const xPosition = previousClientRect.left - currentClientRect.left;
    this.adapter_.setStyleProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);
    // Force repaint
    this.adapter_.getClientRect();
    // Add class and undo styling in a new frame
    requestAnimationFrame(() => {
      this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING_BAR);
      this.adapter_.setStyleProperty('transform', '');
    });
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
  }

  /** @override */
  deactivate() {
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }
}

export default MDCTabIndicatorBarFoundation;
