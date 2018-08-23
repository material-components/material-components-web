/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import MDCComponent from '@material/base/component';
import MDCListFoundation from './foundation';
import MDCListAdapter from './adapter';
import {cssClasses, strings} from './constants';
import {MDCListItem, MDCListItemFoundation} from './list-item/index';

/**
 * @extends MDCComponent<!MDCListFoundation>
 */
class MDCList extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!Array<Function>} */
    this.keydownHandlerArray_;
    /** @private {!Function} */
    this.handleClick_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCList}
   */
  static attachTo(root) {
    return new MDCList(root);
  }

  initialize() {
    [].slice.call(this.root_.querySelectorAll(MDCListFoundation.strings.LIST_ITEM_SELECTOR))
      .forEach((listItemElement) => {
        MDCListItem.attachTo(listItemElement);
      });
  }

  destroy() {
    this.root_.removeEventListener('click', this.handleClick_);
    [].slice.call(this.root_.querySelectorAll(MDCListFoundation.strings.LIST_ITEM_SELECTOR))
      .forEach(this.cleanUpListItemDOM.bind(this));
  }

  cleanUpListItemDOM(listItemElement, index) {
    listItemElement.removeEventListener('keydown', this.keydownHandlerArray_[index]);
  }

  initialSyncWithDOM() {
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_);
    this.keydownHandlerArray_ = [];
    [].slice.call(this.root_.querySelectorAll(MDCListFoundation.strings.LIST_ITEM_SELECTOR))
      .forEach(this.initialSyncWithListItemDOM.bind(this));
    this.layout();
    this.initializeListType();
  }

  initialSyncWithListItemDOM(listItemElement) {
    const keydownHandler = (event) => {
      const listItemIndex = this.listElements_.indexOf(listItemElement);
      this.foundation_.handleKeydown(event, event.target === listItemElement, listItemIndex);
    };
    const boundKeydownHandler = keydownHandler.bind(this);
    this.keydownHandlerArray_.push(boundKeydownHandler);
    listItemElement.addEventListener('keydown', boundKeydownHandler);
  }

  layout() {
    const direction = this.root_.getAttribute(strings.ARIA_ORIENTATION);
    this.vertical = direction !== strings.ARIA_ORIENTATION_HORIZONTAL;

    // List items need to have at least tabindex=-1 to be focusable.
    [].slice.call(this.root_.querySelectorAll('.mdc-list-item:not([tabindex])'))
      .forEach((ele) => {
        ele.setAttribute('tabindex', -1);
      });
  }

  initializeListType() {
    // Automatically set single selection if selected/activated classes are present.
    const preselectedElement =
      this.root_.querySelector(`.${cssClasses.LIST_ITEM_ACTIVATED_CLASS}, .${cssClasses.LIST_ITEM_SELECTED_CLASS}`);

    if (preselectedElement) {
      if (preselectedElement.classList.contains(cssClasses.LIST_ITEM_ACTIVATED_CLASS)) {
        this.foundation_.setUseActivatedClass(true);
      }

      this.singleSelection = true;
      this.selectedIndex = this.listElements_.indexOf(preselectedElement);
    }
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
      focusItemAtIndex: (index) => {
        const element = this.listElements_[index];
        if (element) {
          element.focus();
        }
      },
    })));
  }
}

export {MDCList, MDCListFoundation, MDCListItem, MDCListItemFoundation};
