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

import MDCFoundation from '../mdc-base/foundation';
import {strings} from './constants';

const ELEMENTS_KEY_ALLOWED_IN = ['index', 'button', 'textarea'];

class MDCListFoundation extends MDCFoundation {
  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return /** {MDCListAdapter */ ({
      getListItemCount: () => {},
      getCurrentFocusedIndex: () => {},
      focusItemAtIndex: () => {},
    });
  }

  constructor(adapter = /** @type {!MDCListFoundation} */ ({})) {
    super(Object.assign(MDCListFoundation.defaultAdapter, adapter));
    /** {boolean} */
    this.wrapFocus = false;
    /** {boolean} */
    this.isVertical = true;
  }

  handleKeydown(evt) {
    const arrowLeft = evt.key === 'ArrowLeft' || evt.keyCode === 37;
    const arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const arrowRight = evt.key === 'ArrowRight' || evt.keyCode === 39;
    const arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
    const isHome = evt.key === 'Home' || evt.keyCode === 36;
    const isEnd = evt.key === 'End' || evt.keyCode === 35;
    const currentIndex = this.adapter_.getCurrentFocusedIndex();

    if ((this.isVertical && arrowDown) || (!this.isVertical && arrowRight)) {
      this.preventDefaultEvent_(evt);
      this.focusNextElement(currentIndex);
    } else if ((this.isVertical && arrowUp) || (!this.isVertical && arrowLeft)) {
      this.preventDefaultEvent_(evt);
      this.focusPrevElement(currentIndex);
    } else if (isHome) {
      this.preventDefaultEvent_(evt);
      this.focusFirstElement();
    } else if (isEnd) {
      this.preventDefaultEvent_(evt);
      this.focusLastElement();
    }
  }

  preventDefaultEvent_(evt) {
    const tagName = ('' + evt.target.tagName).toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
      evt.preventDefault();
    }
  }

  focusNextElement(index) {
    const count = this.adapter_.getListItemCount();
    let nextIndex = index + 1;
    if (nextIndex >= count) {
      if (this.wrapFocus) {
        nextIndex = 0;
      } else {
        nextIndex = index;
      }
    }
    this.adapter_.focusItemAtIndex(nextIndex);
  }

  focusPrevElement(index) {
    let prevIndex = index - 1;
    if (prevIndex < 0) {
      if (this.wrapFocus) {
        prevIndex = this.adapter_.getListItemCount() - 1;
      } else {
        prevIndex = 0;
      }
    }
    this.adapter_.focusItemAtIndex(prevIndex);
  }

  focusFirstElement() {
    this.adapter_.focusItemAtIndex(0);
  }

  focusLastElement() {
    const lastIndex = this.adapter_.getListItemCount() - 1;
    if (lastIndex >= 0) {
      this.adapter_.focusItemAtIndex(lastIndex);
    }
  }
}

export {MDCListFoundation};
