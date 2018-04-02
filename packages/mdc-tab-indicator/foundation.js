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
import MDCTabIndcatorAdapter from './adapter';
import {
  cssClasses,
} from './constants';

/**
 * @extends {MDCFoundation<!MDCTabIndcatorAdapter>}
 * @abstract
 */
class MDCTabIndicatorFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * @see MDCTabIndcatorAdapter for typing information
   * @return {!MDCTabIndcatorAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabIndcatorAdapter} */ ({
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      addClass: () => {},
      removeClass: () => {},
      computeClientRect: () => {},
      setStyleProperty: () => {},
    });
  }

  /** @param {!MDCTabIndcatorAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCTabIndicatorFoundation.defaultAdapter, adapter));

    /** @private {function(?Event): undefined} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
  }

  /**
   * Handles the transitionend event
   */
  handleTransitionEnd() {
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING_ICON_ACTIVATE);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING_ICON_DEACTIVATE);
    this.adapter_.removeClass(MDCTabIndicatorFoundation.cssClasses.ANIMATING);
  }

  /** @return {!ClientRect} */
  computeClientRect() {
    return this.adapter_.computeClientRect();
  }

  /**
   * Activates the indicator
   * @param {!ClientRect=} previousClientRect
   * @abstract
   */
  activate(previousClientRect) {} // eslint-disable-line no-unused-vars

  /** @abstract */
  deactivate() {}
}

export default MDCTabIndicatorFoundation;
