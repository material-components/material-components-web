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
import MDCListFoundation from './foundation';
import MDCListAdapter from './adapter';
import {cssClasses, strings} from './constants';

/**
 * @extends MDCComponent<!MDCListFoundation>
 */
class MDCList extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!Function} */
    this.handleKeydown_;
    /** @private {!Function} */
    this.handleClick_;
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
    this.root_.removeEventListener('click', this.handleClick_);
    this.root_.removeEventListener('focusin', this.focusInEventListener_);
    this.root_.removeEventListener('focusout', this.focusOutEventListener_);
  }

  initialSyncWithDOM() {
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_);
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_);
    this.focusInEventListener_ = this.foundation_.handleFocusIn.bind(this.foundation_);
    this.focusOutEventListener_ = this.foundation_.handleFocusOut.bind(this.foundation_);
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('focusin', this.focusInEventListener_);
    this.root_.addEventListener('focusout', this.focusOutEventListener_);
    this.layout();
  }

  layout() {
    const direction = this.root_.getAttribute(strings.ARIA_ORIENTATION);
    this.vertical = direction !== strings.ARIA_ORIENTATION_HORIZONTAL;

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
    return [].slice.call(this.root_.querySelectorAll(strings.ENABLED_ITEMS_SELECTOR));
  }

  /** @param {boolean} value */
  set wrapFocus(value) {
    this.foundation_.setWrapFocus(value);
  }

  /** @param {boolean} isSingleSelectionList */
  set singleSelection(isSingleSelectionList) {
    if (isSingleSelectionList) {
      this.root_.addEventListener('click', this.handleClick_);
    } else {
      this.root_.removeEventListener('click', this.handleClick_);
    }

    this.foundation_.setSingleSelection(isSingleSelectionList);
    const selectedElement = this.root_.querySelector('.mdc-list-item--selected');

    if (selectedElement) {
      this.selectedIndex = this.listElements_.indexOf(selectedElement);
    }
  }

  /** @param {number} index */
  set selectedIndex(index) {
    this.foundation_.setSelectedIndex(index);
  }

  /** @return {!MDCListFoundation} */
  getDefaultFoundation() {
    return new MDCListFoundation(/** @type {!MDCListAdapter} */ (Object.assign({
      getListItemCount: () => this.listElements_.length,
      getFocusedElementIndex: () => this.listElements_.indexOf(document.activeElement),
      getListItemIndex: (node) => this.listElements_.indexOf(node),
      setAttributeForElementIndex: (index, attr, value) => {
        const element = this.listElements_[index];
        if (element) {
          element.setAttribute(attr, value);
        }
      },
      removeAttributeForElementIndex: (index, attr) => {
        const element = this.listElements_[index];
        if (element) {
          element.removeAttribute(attr);
        }
      },
      addClassForElementIndex: (index, className) => {
        const element = this.listElements_[index];
        if (element) {
          element.classList.add(className);
        }
      },
      removeClassForElementIndex: (index, className) => {
        const element = this.listElements_[index];
        if (element) {
          element.classList.remove(className);
        }
      },
      isListItem: (target) => target.classList.contains(cssClasses.LIST_ITEM_CLASS),
      focusItemAtIndex: (index) => {
        const element = this.listElements_[index];
        if (element) {
          element.focus();
        }
      },
      isElementFocusable: (ele) => {
        if (!ele) return false;
        let matches = Element.prototype.matches;
        if (!matches) { // IE uses a different name for the same functionality
          matches = Element.prototype.msMatchesSelector;
        }
        return matches.call(ele, strings.FOCUSABLE_CHILD_ELEMENTS);
      },
      setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
        const element = this.listElements_[listItemIndex];
        const listItemChildren = [].slice.call(element.querySelectorAll(strings.FOCUSABLE_CHILD_ELEMENTS));
        listItemChildren.forEach((ele) => ele.setAttribute('tabindex', tabIndexValue));
      },
    })));
  }
}

export {MDCList, MDCListFoundation};
