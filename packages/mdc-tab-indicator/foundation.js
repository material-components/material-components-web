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

/* eslint no-unused-vars: [2, {"args": "none"}] */

import MDCFoundation from '@material/base/foundation';
import MDCTabIndicatorAdapter from './adapter';
import {cssClasses} from './constants';

/* eslint-disable no-unused-vars */
import MDCTabDimensions from '@material/tab/dimensions';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCFoundation<!MDCTabIndicatorAdapter>}
 * @abstract
 */
class MDCTabIndicatorFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * @see MDCTabIndicatorAdapter for typing information
   * @return {!MDCTabIndicatorAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabIndicatorAdapter} */ ({
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      setRootStyleProperty: () => {},
    });
  }

  /** @param {!MDCTabIndicatorAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCTabIndicatorFoundation.defaultAdapter, adapter));

    /** @private {function(): undefined} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
  }

  /**
   * Handles the "transitionend" event
   */
  handleTransitionEnd() {
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.removeClass(cssClasses.ANIMATING);
  }


  /**
   * Animates the indicator's position
   * @param {!MDCTabDimensions} tabDimensions
   */
  animatePosition(tabDimensions) {
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING);
    this.layout(tabDimensions);
  }

  /**
   * Calculates the indicator size and applies it
   * @param {!MDCTabDimensions} tabDimensions
   * @abstract
   */
  layout(tabDimensions) {}
}

export default MDCTabIndicatorFoundation;
