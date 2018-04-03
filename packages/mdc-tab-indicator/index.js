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

import MDCComponent from '@material/base/component';

import MDCTabIndicatorAdapter from './adapter';
import MDCTabIndicatorFoundation from './foundation';

import MDCSlidingTabIndicatorFoundation from './sliding-foundation';
import MDCFadingTabIndicatorFoundation from './fading-foundation';

/**
 * @extends {MDCComponent<!MDCTabIndicatorFoundation>}
 * @final
 */
class MDCTabIndicator extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCTabIndicator}
   */
  static attachTo(root) {
    return new MDCTabIndicator(root);
  }

  /**
   * @return {!ClientRect}
   */
  computeClientRect() {
    return this.foundation_.computeClientRect();
  }

  /**
   * @return {!MDCTabIndicatorFoundation}
   */
  getDefaultFoundation() {
    const adapter = /** @type {!MDCTabIndicatorAdapter} */ (Object.assign({
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      computeClientRect: () => this.root_.getBoundingClientRect(),
      setStyleProperty: (prop, value) => this.root_.style.setProperty(prop, value),
    }));

    if (this.root_.classList.contains(MDCTabIndicatorFoundation.cssClasses.FADE)) {
      return new MDCFadingTabIndicatorFoundation(adapter);
    }

    // Default to the bar indicator
    return new MDCSlidingTabIndicatorFoundation(adapter);
  }

  /**
   * @param {!ClientRect=} previousTabClientRect
   */
  activate(previousTabClientRect) {
    this.foundation_.activate(previousTabClientRect);
  }

  deactivate() {
    this.foundation_.deactivate();
  }
}

export {MDCTabIndicator, MDCTabIndicatorFoundation, MDCSlidingTabIndicatorFoundation, MDCIconTabIndicatorFoundation};
