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

/* eslint-enable no-unused-vars */

import MDCFoundation from '@material/base/foundation';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCMenuSurfaceFoundation} from '../mdc-menu-surface/foundation';
import {numbers} from '../mdc-menu-surface/constants';

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
      getIndexFromEvent: () => {},
    });
  }

  /** @param {!MDCMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuFoundation.defaultAdapter, adapter));

    this.closeAnimationEndTimerId_;
  }

  init() {}

  destroy() {
    clearTimeout(this.closeAnimationEndTimerId_);
  }

  handleKeydown(evt) {
    const {key, keyCode} = evt;

    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isTab = key === 'Tab' || keyCode === 13;

    if (isSpace || isEnter) {
      const index = this.adapter_.getFocusedElementIndex();
      this.handleSelection_(index);
      evt.preventDefault();
    } else if (isTab) {
      this.adapter_.closeSurface();
    }
  }

  handleClick() {
    const listItemIndex = this.adapter_.getFocusedElementIndex();
    if (listItemIndex < 0) {
      this.adapter_.closeSurface();
    } else {
      this.handleSelection_(listItemIndex);
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
}

export {MDCMenuFoundation};
