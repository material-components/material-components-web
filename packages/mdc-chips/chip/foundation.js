/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import MDCChipAdapter from './adapter';
import {strings, cssClasses} from './constants';


/**
 * @extends {MDCFoundation<!MDCChipAdapter>}
 * @final
 */
class MDCChipFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCChipAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCChipAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCChipAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      registerTrailingIconInteractionHandler: () => {},
      deregisterTrailingIconInteractionHandler: () => {},
      notifyInteraction: () => {},
      notifyTrailingIconInteraction: () => {},
    });
  }

  /**
   * @param {!MDCChipAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCChipFoundation.defaultAdapter, adapter));

    /** @private {function(!Event): undefined} */
    this.interactionHandler_ = (evt) => this.handleInteraction_(evt);
    /** @private {function(!Event): undefined} */
    this.trailingIconInteractionHandler_ = (evt) => this.handleTrailingIconInteraction_(evt);
  }

  init() {
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.registerInteractionHandler(evtType, this.interactionHandler_);
      this.adapter_.registerTrailingIconInteractionHandler(evtType, this.trailingIconInteractionHandler_);
    });
    ['touchstart', 'pointerdown', 'mousedown'].forEach((evtType) => {
      this.adapter_.registerTrailingIconInteractionHandler(evtType, this.trailingIconInteractionHandler_);
    });
  }

  destroy() {
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.interactionHandler_);
      this.adapter_.deregisterTrailingIconInteractionHandler(evtType, this.trailingIconInteractionHandler_);
    });
    ['touchstart', 'pointerdown', 'mousedown'].forEach((evtType) => {
      this.adapter_.deregisterTrailingIconInteractionHandler(evtType, this.trailingIconInteractionHandler_);
    });
  }

  /**
   * Toggles the selected class on the chip element.
   */
  toggleSelected() {
    if (this.adapter_.hasClass(cssClasses.SELECTED)) {
      this.adapter_.removeClass(cssClasses.SELECTED);
    } else {
      this.adapter_.addClass(cssClasses.SELECTED);
    }
  }

  /**
   * Handles an interaction event on the root element.
   * @param {!Event} evt
   */
  handleInteraction_(evt) {
    if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {
      this.adapter_.notifyInteraction();
    }
  }

  /**
   * Handles an interaction event on the trailing icon element. This is used to
   * prevent the ripple from activating on interaction with the trailing icon.
   * @param {!Event} evt
   */
  handleTrailingIconInteraction_(evt) {
    evt.stopPropagation();
    if (evt.type === 'click' || evt.key === 'Enter' || evt.keyCode === 13) {
      this.adapter_.notifyTrailingIconInteraction();
    }
  }
}

export default MDCChipFoundation;
