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
import {cssClasses as listItemClasses} from './list-item/constants';
import {MDCListItem, MDCListItemFoundation} from './list-item/index';

/**
 * @extends MDCComponent<!MDCListFoundation>
 */
class MDCList extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!Array<Function>} */
    this.keydownHandler_;
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
    this.root_.removeEventListener('keydown', this.keydownHandler_);
  }

  cleanUpListItemDOM(listItemElement, index) {
    listItemElement.removeEventListener('keydown', this.keydownHandlerArray_[index]);
  }

  initialSyncWithDOM() {
    this.handleClick_ = this.foundation_.handleClick.bind(this.foundation_);
    this.keydownHandler_ = this.handleKeydownEvent_.bind(this);
    this.root_.addEventListener('keydown', this.keydownHandler_);
    this.layout();
    this.initializeListType();
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

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   * @param {Event} evt
   * @private
   */
  handleKeydownEvent_(evt) {
    let eventTarget = /** @type {HTMLElement} */ (evt.target);
    let ndx = -1;

    // Find the first ancestor that is a list item or the list.
    while (!eventTarget.classList.contains(listItemClasses.LIST_ITEM_CLASS)
    && !eventTarget.classList.contains(cssClasses.ROOT)) {
      eventTarget = eventTarget.parentElement;
    }

    // Get the index of the element if it is a list item.
    if (eventTarget.classList.contains(listItemClasses.LIST_ITEM_CLASS)) {
      ndx = this.listElements_.indexOf(eventTarget);
    }

    if (ndx >= 0) {
      this.foundation_.handleKeydown(evt, evt.target.classList.contains(listItemClasses.LIST_ITEM_CLASS), ndx);
    }
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
