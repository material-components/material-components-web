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
import {strings, cssClasses} from './constants';

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];

class MDCListFoundation extends MDCFoundation {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter() {
    return /** {MDCListAdapter */ ({
      getListItemCount: () => {},
      getFocusedElementIndex: () => {},
      getListItemIndex: () => {},
      focusItemAtIndex: () => {},
      setTabIndexForListItemChildren: () => {},
    });
  }

  constructor(adapter = /** @type {!MDCListFoundation} */ ({})) {
    super(Object.assign(MDCListFoundation.defaultAdapter, adapter));
    /** {boolean} */
    this.wrapFocus_ = false;
    /** {boolean} */
    this.isVertical_ = true;
  }

  /**
   * Sets the private wrapFocus_ variable.
   * @param {boolean} value
   */
  setWrapFocus(value) {
    this.wrapFocus_ = value;
  }

  /**
   * Sets the isVertical_ private variable.
   * @param {boolean} value
   */
  setVerticalOrientation(value) {
    this.isVertical_ = value;
  }

  /**
   * Focus in handler for the list items.
   * @param evt
   */
  handleFocusIn(evt) {
    const listItem = this.getListItem_(evt.target);
    if (!listItem) return;

    this.adapter_.setTabIndexForListItemChildren(this.adapter_.getListItemIndex(listItem), 0);
  }

  /**
   * Focus out handler for the list items.
   * @param {Event} evt
   */
  handleFocusOut(evt) {
    const listItem = this.getListItem_(evt.target);
    if (!listItem) return;

    this.adapter_.setTabIndexForListItemChildren(this.adapter_.getListItemIndex(listItem), -1);
  }

  /**
   * Key handler for the list.
   * @param {Event} evt
   */
  handleKeydown(evt) {
    const arrowLeft = evt.key === 'ArrowLeft' || evt.keyCode === 37;
    const arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const arrowRight = evt.key === 'ArrowRight' || evt.keyCode === 39;
    const arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
    const isHome = evt.key === 'Home' || evt.keyCode === 36;
    const isEnd = evt.key === 'End' || evt.keyCode === 35;
    let currentIndex = this.adapter_.getFocusedElementIndex();

    if (currentIndex === -1) {
      currentIndex = this.adapter_.getListItemIndex(this.getListItem_(evt.target));

      if (currentIndex < 0) {
        // If this event doesn't have a mdc-list-item ancestor from the
        // current list (not from a sublist), return early.
        return;
      }
    }

    if ((this.isVertical_ && arrowDown) || (!this.isVertical_ && arrowRight)) {
      this.preventDefaultEvent_(evt);
      this.focusNextElement(currentIndex);
    } else if ((this.isVertical_ && arrowUp) || (!this.isVertical_ && arrowLeft)) {
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

  /**
   * Focuses the next element on the list.
   * @param {Number} index
   */
  focusNextElement(index) {
    const count = this.adapter_.getListItemCount();
    let nextIndex = index + 1;
    if (nextIndex >= count) {
      if (this.wrapFocus_) {
        nextIndex = 0;
      } else {
        // Return early because last item is already focused.
        return;
      }
    }
    this.adapter_.focusItemAtIndex(nextIndex);
  }

  /**
   * Focuses the previous element on the list.
   * @param {Number} index
   */
  focusPrevElement(index) {
    let prevIndex = index - 1;
    if (prevIndex < 0) {
      if (this.wrapFocus_) {
        prevIndex = this.adapter_.getListItemCount() - 1;
      } else {
        // Return early because first item is already focused.
        return;
      }
    }
    this.adapter_.focusItemAtIndex(prevIndex);
  }

  focusFirstElement() {
    if (this.adapter_.getListItemCount() > 0) {
      this.adapter_.focusItemAtIndex(0);
    }
  }

  focusLastElement() {
    const lastIndex = this.adapter_.getListItemCount() - 1;
    if (lastIndex >= 0) {
      this.adapter_.focusItemAtIndex(lastIndex);
    }
  }

  /**
   * Utility method to find the first ancestor with the mdc-list-item class.
   * @param {EventTarget} target
   * @return {?Element}
   * @private
   */
  getListItem_(target) {
    while (!target.classList.contains(cssClasses.LIST_ITEM_CLASS)) {
      if (!target.parentElement) return null;
      target = target.parentElement;
    }
    return target;
  }
}

export {MDCListFoundation};
