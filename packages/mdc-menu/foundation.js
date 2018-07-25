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

import MDCFoundation from '@material/base/foundation';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];

/**
 * @extends {MDCFoundation<!MDCMenuAdapter>}
 */
class MDCMenuFoundation extends MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{strings} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCMenuAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCMenuAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCMenuAdapter} */ ({
      selectElementAtIndex: () => {},
      closeSurface: () => {},
      getFocusedElementIndex: () => {},
      removeClassFromSelectionGroup: () => {},
      notifySelected: () => {},
      isListItem: () => {},
      toggleCheckbox: () => {},
    });
  }

  /** @param {!MDCMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuFoundation.defaultAdapter, adapter));

    /** @param {number} value */
    this.closeAnimationEndTimerId_;
  }

  init() {}

  destroy() {
    clearTimeout(this.closeAnimationEndTimerId_);
  }

  /**
   * Handler function for the keydown event.
   * @param {Event} evt
   */
  handleKeydown(evt) {
    const {key, keyCode} = evt;

    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isTab = key === 'Tab' || keyCode === 13;

    if (isSpace || isEnter) {
      this.handleClick(evt);
    } else if (isTab) {
      this.adapter_.closeSurface();
    }
  }

  /**
   * Handler function for the click and space/enter key events.
   * @param {Event} evt
   */
  handleClick(evt) {
    const listItemIndex = this.adapter_.getFocusedElementIndex();
    if (listItemIndex >= 0) {
      this.handleSelection_(listItemIndex);
      this.preventDefaultEvent_(evt);
      this.adapter_.toggleCheckbox(evt.target);
    }
  }

  handleSelection_(index) {
    this.adapter_.notifySelected({index});
    this.adapter_.closeSurface();
    // Wait for the menu to close before adding/removing classes that affect styles.
    this.closeAnimationEndTimerId_ = setTimeout(() => {
      this.adapter_.removeClassFromSelectionGroup(index);
      this.adapter_.selectElementAtIndex(index);
    }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
  }

  /**
   * Ensures that preventDefault is only called if the containing element doesn't
   * consume the event, and it will cause an unintended scroll.
   * @param {Event} evt
   * @private
   */
  preventDefaultEvent_(evt) {
    const tagName = `${evt.target.tagName}`.toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
      evt.preventDefault();
    }
  }
}

export {MDCMenuFoundation};
