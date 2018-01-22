/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import MDCFoundation from '@material/base/foundation';
import MDCBottomLineAdapter from './adapter';
import {cssClasses, strings} from './constants';


/**
 * @extends {MDCFoundation<!MDCBottomLineAdapter>}
 * @final
 */
class MDCBottomLineFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCBottomLineAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCBottomLineAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCBottomLineAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      setAttr: () => {},
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      notifyAnimationEnd: () => {},
    });
  }

  /**
   * @param {!MDCBottomLineAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCBottomLineAdapter} */ ({})) {
    super(Object.assign(MDCBottomLineFoundation.defaultAdapter, adapter));

    /** @private {function(!Event): undefined} */
    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd(evt);
    /** @private {boolean} */
    this.isActive_ = false;
  }

  init() {
    this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);
  }

  destroy() {
    this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);
  }

  /**
   * Activates the bottom line
   */
  activate() {
    this.isActive_ = true;
    this.adapter_.addClass(cssClasses.BOTTOM_LINE_ACTIVE);
  }

  /**
   * Sets the transform origin given a user's click location.
   * @param {!Event} evt
   */
  setTransformOrigin(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const evtCoords = {x: evt.clientX, y: evt.clientY};
    const normalizedX = evtCoords.x - targetClientRect.left;
    const attributeString =
        `transform-origin: ${normalizedX}px center`;

    this.adapter_.setAttr('style', attributeString);
  }

  /**
   * Deactivates the bottom line
   */
  deactivate() {
    this.adapter_.removeClass(cssClasses.BOTTOM_LINE_ACTIVE);
  }

  /**
   * Sets our active flag to false to prepare to deactivate.
   */
  deactivateFocus() {
    this.isActive_ = false;
  }

  /**
   * Handles a transition end event
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    // Wait for the bottom line to be either transparent or opaque
    // before emitting the animation end event
    if (!this.isActive_ && evt.propertyName === 'opacity') {
      this.deactivate();
    }
  }
}

export default MDCBottomLineFoundation;
