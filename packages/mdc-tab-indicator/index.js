/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

import {cssClasses} from './constants';
import MDCTabIndicatorAdapter from './adapter';
import MDCTabWidthIndicatorFoundation from './tab-width-foundation';
import MDCTextLabelWidthIndicatorFoundation from './text-label-width-foundation';

/* eslint-disable no-unused-vars */
import MDCTabDimensions from '@material/tab/dimensions';
import MDCTabIndicatorFoundation from './foundation';
/* eslint-enable no-unused-vars */

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
   * @return {!MDCTabIndicatorFoundation}
   */
  getDefaultFoundation() {
    const defaultAdapter = /** @type {!MDCTabIndicatorAdapter} */ (Object.assign({
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setRootStyleProperty: (attr, value) => this.root_.style[attr] = value,
    }));

    if (defaultAdapter.hasClass(cssClasses.MATCH_TEXT_LABEL)) {
      return new MDCTextLabelWidthIndicatorFoundation(defaultAdapter);
    } else {
      return new MDCTabWidthIndicatorFoundation(defaultAdapter);
    }
  }

  /** @param {!MDCTabDimensions} tabDimensions */
  animate(tabDimensions) {
    this.foundation_.animatePosition(tabDimensions);
  }

  /** @param {!MDCTabDimensions} tabDimensions */
  layout(tabDimensions) {
    this.foundation_.layout(tabDimensions);
  }
}

export {MDCTabIndicator, MDCTabWidthIndicatorFoundation, MDCTextLabelWidthIndicatorFoundation};
