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
import {MDCListFoundation} from './foundation';
import {strings} from './constants';

/**
 * @extends MDCComponent<!MDCListFoundation>
 */
export class MDCList extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!Function} */
    this.handleKeydown_;
    /** @private {!Function} */
    this.focusInEventListener_;
    /** @private {!Function} */
    this.focusOutEventListener_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCList}
   */
  static attachTo(root) {
    return new MDCList(root);
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('focusin', this.focusInEventListener_);
    this.root_.removeEventListener('focusout', this.focusOutEventListener_);
  }

  initialSyncWithDOM() {
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_);
    this.focusInEventListener_ = this.foundation_.handleFocusIn.bind(this.foundation_);
    this.focusOutEventListener_ = this.foundation_.handleFocusOut.bind(this.foundation_);
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('focusin', this.focusInEventListener_);
    this.root_.addEventListener('focusout', this.focusOutEventListener_);
    this.layout();
  }

  layout() {
    const direction = this.root_.getAttribute(strings.ARIA_ORIENTATION);
    this.vertical = direction === strings.ARIA_ORIENTATION_VERTICAL;

    // List items need to have at least tabindex=-1 to be focusable.
    [].slice.call(this.root_.querySelectorAll('.mdc-list-item:not([tabindex])'))
      .forEach((ele) => {
        ele.setAttribute('tabindex', -1);
      });

    // Child button/a elements are not tabbable until the list item is focused.
    [].slice.call(this.root_.querySelectorAll(strings.FOCUSABLE_CHILD_ELEMENTS))
      .forEach((ele) => ele.setAttribute('tabindex', -1));
  }

  /** @param {boolean} value */
  set vertical(value) {
    this.foundation_.setVerticalOrientation(value);
  }

  /** @return Array<!Element>*/
  get listElements_() {
    return [].slice.call(this.root_.querySelectorAll(strings.ITEMS_SELECTOR))
      .filter((ele) => ele.parentElement === this.root_);
  }

  /** @param {boolean} value */
  set wrapFocus(value) {
    this.foundation_.setWrapFocus(value);
  }

  /** @return {!MDCListFoundation} */
  getDefaultFoundation() {
    return new MDCListFoundation(/** @type {!MDCListAdapter} */{
      getListItemCount: () => this.listElements_.length,
      getFocusedElementIndex: () => this.listElements_.indexOf(document.activeElement),
      getListItemIndex: (node) => this.listElements_.indexOf(node),
      focusItemAtIndex: (ndx) => this.listElements_[ndx].focus(),
      setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
        const listItemChildren = [].slice.call(this.listElements_[listItemIndex]
          .querySelectorAll(strings.FOCUSABLE_CHILD_ELEMENTS));
        listItemChildren.forEach((ele) => ele.setAttribute('tabindex', tabIndexValue));
      },
    });
  }
}
