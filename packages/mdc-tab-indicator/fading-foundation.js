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
class MDCFadingTabIndicatorFoundation extends MDCTabIndicatorFoundation {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @private {function(?Event): undefined} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
  }

  /** Handles the transitionend event */
  handleTransitionEnd() {
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.FADING_ACTIVATE);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.FADING_DEACTIVATE);
  }

  activate() {
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.FADING_ACTIVATE);
    this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }

  deactivate() {
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(MDCTabIndicatorFoundation.cssClasses.FADING_DEACTIVATE);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }
}

export default MDCFadingTabIndicatorFoundation;
