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
import {matches} from '@material/dom/ponyfill';
import {cssClasses, strings, Index} from './constants'; // eslint-disable-line no-unused-vars

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
    this.handleClick_ = this.handleClickEvent_.bind(this);
    this.handleKeydown_ = this.handleKeydownEvent_.bind(this);
    this.focusInEventListener_ = this.handleFocusInEvent_.bind(this);
    this.focusOutEventListener_ = this.handleFocusOutEvent_.bind(this);
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('focusin', this.focusInEventListener_);
    this.root_.addEventListener('focusout', this.focusOutEventListener_);
    this.root_.addEventListener('click', this.handleClick_);
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

    // Child button/a elements are not tabbable until the list item is focused.
    [].slice.call(this.root_.querySelectorAll(strings.FOCUSABLE_CHILD_ELEMENTS))
      .forEach((ele) => ele.setAttribute('tabindex', -1));

    this.foundation_.layout();
  }

  /**
   * Used to figure out which list item this event is targetting. Or returns -1 if
   * there is no list item
   * @param {Event} evt
   * @private
   */
  getListItemIndex_(evt) {
    let eventTarget = /** @type {HTMLElement} */ (evt.target);
    let index = -1;

    // Find the first ancestor that is a list item or the list.
    while (!eventTarget.classList.contains(cssClasses.LIST_ITEM_CLASS)
    && !eventTarget.classList.contains(cssClasses.ROOT)) {
      eventTarget = eventTarget.parentElement;
    }

    // Get the index of the element if it is a list item.
    if (eventTarget.classList.contains(cssClasses.LIST_ITEM_CLASS)) {
      index = this.listElements.indexOf(eventTarget);
    }

    return index;
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   * @param {Event} evt
   * @private
   */
  handleFocusInEvent_(evt) {
    const index = this.getListItemIndex_(evt);
    this.foundation_.handleFocusIn(evt, index);
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   * @param {Event} evt
   * @private
   */
  handleFocusOutEvent_(evt) {
    const index = this.getListItemIndex_(evt);
    this.foundation_.handleFocusOut(evt, index);
  }

  /**
   * Used to figure out which element was focused when keydown event occurred before sending the event to the
   * foundation.
   * @param {Event} evt
   * @private
   */
  handleKeydownEvent_(evt) {
    const index = this.getListItemIndex_(evt);

    if (index >= 0) {
      this.foundation_.handleKeydown(evt, evt.target.classList.contains(cssClasses.LIST_ITEM_CLASS), index);
    }
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   * @param {Event} evt
   * @private
   */
  handleClickEvent_(evt) {
    const index = this.getListItemIndex_(evt);

    // Toggle the checkbox only if it's not the target of the event, or the checkbox will have 2 change events.
    const toggleCheckbox = !matches(/** @type {!Element} */ (evt.target), strings.CHECKBOX_RADIO_SELECTOR);
    this.foundation_.handleClick(index, toggleCheckbox);
  }

  /**
   * Initialize selectedIndex value based on pre-selected checkbox list items, single selection or radio.
   */
  initializeListType() {
    const checkboxListItems = this.root_.querySelectorAll(strings.ARIA_ROLE_CHECKBOX_SELECTOR);
    const singleSelectedListItem = this.root_.querySelector(`.${cssClasses.LIST_ITEM_ACTIVATED_CLASS},
        .${cssClasses.LIST_ITEM_SELECTED_CLASS}`);
    const radioSelectedListItem = this.root_.querySelector(strings.ARIA_CHECKED_RADIO_SELECTOR);

    if (checkboxListItems.length) {
      const preselectedItems = this.root_.querySelectorAll(strings.ARIA_CHECKED_CHECKBOX_SELECTOR);
      this.selectedIndex = [].map.call(preselectedItems, (listItem) => this.listElements.indexOf(listItem));
    } else if (singleSelectedListItem) {
      if (singleSelectedListItem.classList.contains(cssClasses.LIST_ITEM_ACTIVATED_CLASS)) {
        this.foundation_.setUseActivatedClass(true);
      }

      this.singleSelection = true;
      this.selectedIndex = this.listElements.indexOf(singleSelectedListItem);
    } else if (radioSelectedListItem) {
      this.selectedIndex = this.listElements.indexOf(radioSelectedListItem);
    }
  }

  /** @param {boolean} value */
  set vertical(value) {
    this.foundation_.setVerticalOrientation(value);
  }

  /** @return Array<!Element>*/
  get listElements() {
    return [].slice.call(this.root_.querySelectorAll(strings.ENABLED_ITEMS_SELECTOR));
  }

  /** @param {boolean} value */
  set wrapFocus(value) {
    this.foundation_.setWrapFocus(value);
  }

  /** @param {boolean} isSingleSelectionList */
  set singleSelection(isSingleSelectionList) {
    this.foundation_.setSingleSelection(isSingleSelectionList);
  }

  /** @return {!Index} */
  get selectedIndex() {
    return this.foundation_.getSelectedIndex();
  }

  /** @param {!Index} index */
  set selectedIndex(index) {
    this.foundation_.setSelectedIndex(index);
  }

  /** @return {!MDCListFoundation} */
  getDefaultFoundation() {
    return new MDCListFoundation(/** @type {!MDCListAdapter} */ (Object.assign({
      getListItemCount: () => this.listElements.length,
      getFocusedElementIndex: () => this.listElements.indexOf(document.activeElement),
      setAttributeForElementIndex: (index, attr, value) => {
        const element = this.listElements[index];
        if (element) {
          element.setAttribute(attr, value);
        }
      },
      removeAttributeForElementIndex: (index, attr) => {
        const element = this.listElements[index];
        if (element) {
          element.removeAttribute(attr);
        }
      },
      addClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.add(className);
        }
      },
      removeClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.remove(className);
        }
      },
      focusItemAtIndex: (index) => {
        const element = this.listElements[index];
        if (element) {
          element.focus();
        }
      },
      setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
        const element = this.listElements[listItemIndex];
        const listItemChildren = [].slice.call(element.querySelectorAll(strings.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX));
        listItemChildren.forEach((ele) => ele.setAttribute('tabindex', tabIndexValue));
      },
      followHref: (index) => {
        const listItem = this.listElements[index];
        if (listItem && listItem.href) {
          listItem.click();
        }
      },
      hasCheckboxAtIndex: (index) => {
        const listItem = this.listElements[index];
        return !!listItem.querySelector(strings.CHECKBOX_SELECTOR);
      },
      hasRadioAtIndex: (index) => {
        const listItem = this.listElements[index];
        return !!listItem.querySelector(strings.RADIO_SELECTOR);
      },
      isCheckboxCheckedAtIndex: (index) => {
        const listItem = this.listElements[index];
        const toggleEl = listItem.querySelector(strings.CHECKBOX_SELECTOR);
        return toggleEl.checked;
      },
      setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
        const listItem = this.listElements[index];
        const toggleEl = listItem.querySelector(strings.CHECKBOX_RADIO_SELECTOR);
        toggleEl.checked = isChecked;

        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        toggleEl.dispatchEvent(event);
      },
      isFocusInsideList: () => {
        return this.root_.contains(document.activeElement);
      },
    })));
  }
}

export {MDCList, MDCListFoundation};
