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
import {SpecificEventListener} from '@material/base/index';
import {matches} from '@material/dom/ponyfill';
import {cssClasses, Index, strings} from './constants'; // eslint-disable-line no-unused-vars
import {MDCListFoundation} from './foundation';

class MDCList extends MDCComponent<MDCListFoundation> {
  set vertical(value: boolean) {
    this.foundation_.setVerticalOrientation(value);
  }

  get listElements(): Element[] {
    return [].slice.call(this.root_.querySelectorAll(strings.ENABLED_ITEMS_SELECTOR));
  }

  set wrapFocus(value: boolean) {
    this.foundation_.setWrapFocus(value);
  }

  set singleSelection(isSingleSelectionList: boolean) {
    this.foundation_.setSingleSelection(isSingleSelectionList);
  }

  get selectedIndex(): Index {
    return this.foundation_.getSelectedIndex();
  }

  set selectedIndex(index: Index) {
    this.foundation_.setSelectedIndex(index);
  }

  static attachTo(root: Element) {
    return new MDCList(root);
  }

  protected root_!: HTMLElement; // assigned in MDCComponent constructor

  private handleKeydown_!: SpecificEventListener<'keydown'>; // assigned in initialSyncWithDOM()
  private handleClick_!: SpecificEventListener<'click'>; // assigned in initialSyncWithDOM()
  private focusInEventListener_!: EventListener; // assigned in initialSyncWithDOM()
  private focusOutEventListener_!: EventListener; // assigned in initialSyncWithDOM()

  initialSyncWithDOM() {
    this.handleClick_ = this.handleClickEvent_.bind(this);
    this.handleKeydown_ = this.handleKeydownEvent_.bind(this);
    this.focusInEventListener_ = this.handleFocusInEvent_.bind(this);
    this.focusOutEventListener_ = this.handleFocusOutEvent_.bind(this);
    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('click', this.handleClick_);
    this.root_.addEventListener('focusin', this.focusInEventListener_);
    this.root_.addEventListener('focusout', this.focusOutEventListener_);
    this.layout();
    this.initializeListType();
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('click', this.handleClick_);
    this.root_.removeEventListener('focusin', this.focusInEventListener_);
    this.root_.removeEventListener('focusout', this.focusOutEventListener_);
  }

  layout() {
    const direction = this.root_.getAttribute(strings.ARIA_ORIENTATION);
    this.vertical = direction !== strings.ARIA_ORIENTATION_HORIZONTAL;

    // List items need to have at least tabindex=-1 to be focusable.
    [].slice.call(this.root_.querySelectorAll('.mdc-list-item:not([tabindex])'))
      .forEach((el: Element) => {
        el.setAttribute('tabindex', '-1');
      });

    // Child button/a elements are not tabbable until the list item is focused.
    [].slice.call(this.root_.querySelectorAll(strings.FOCUSABLE_CHILD_ELEMENTS))
      .forEach((el: Element) => el.setAttribute('tabindex', '-1'));

    this.foundation_.layout();
  }

  /**
   * Initialize selectedIndex value based on pre-selected checkbox list items, single selection or radio.
   */
  initializeListType() {
    const checkboxListItems = this.root_.querySelectorAll(strings.ARIA_ROLE_CHECKBOX_SELECTOR);
    const singleSelectedListItem = this.root_.querySelector(`
      .${cssClasses.LIST_ITEM_ACTIVATED_CLASS},
      .${cssClasses.LIST_ITEM_SELECTED_CLASS}
    `);
    const radioSelectedListItem = this.root_.querySelector(strings.ARIA_CHECKED_RADIO_SELECTOR);

    if (checkboxListItems.length) {
      const preselectedItems = this.root_.querySelectorAll(strings.ARIA_CHECKED_CHECKBOX_SELECTOR);
      this.selectedIndex =
        [].map.call(preselectedItems, (listItem: Element) => this.listElements.indexOf(listItem)) as number[];
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

  getDefaultFoundation() {
    return new MDCListFoundation({
      addClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.add(className);
        }
      },
      focusItemAtIndex: (index) => {
        const element = this.listElements[index] as HTMLElement;
        if (element) {
          element.focus();
        }
      },
      getFocusedElementIndex: () => this.listElements.indexOf(document.activeElement as Element),
      getListItemCount: () => this.listElements.length,
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
        const toggleEl = listItem.querySelector(strings.CHECKBOX_SELECTOR) as HTMLInputElement;
        return toggleEl.checked;
      },
      isFocusInsideList: () => {
        return this.root_.contains(document.activeElement);
      },
      notifyAction: (index) => {
        this.emit(strings.ACTION_EVENT, {index}, /** shouldBubble */ true);
      },
      removeAttributeForElementIndex: (index, attr) => {
        const element = this.listElements[index];
        if (element) {
          element.removeAttribute(attr);
        }
      },
      removeClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.remove(className);
        }
      },
      setAttributeForElementIndex: (index, attr, value) => {
        const element = this.listElements[index];
        if (element) {
          element.setAttribute(attr, value);
        }
      },
      setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
        const listItem = this.listElements[index];
        const toggleEl = listItem.querySelector(strings.CHECKBOX_RADIO_SELECTOR) as HTMLInputElement;
        toggleEl.checked = isChecked;

        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        toggleEl.dispatchEvent(event);
      },
      setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
        const element = this.listElements[listItemIndex];
        const listItemChildren: Element[] =
          [].slice.call(element.querySelectorAll(strings.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX));
        listItemChildren.forEach((el) => el.setAttribute('tabindex', tabIndexValue));
      },
    });
  }

  /**
   * Used to figure out which list item this event is targetting. Or returns -1 if
   * there is no list item
   */
  private getListItemIndex_(evt: Event) {
    let eventTarget = evt.target as HTMLElement;
    let index = -1;

    const eventTargetHasClass = (className: string) => eventTarget.classList.contains(className);

    // Find the first ancestor that is a list item or the list.
    while (!eventTargetHasClass(cssClasses.LIST_ITEM_CLASS) && !eventTargetHasClass(cssClasses.ROOT)) {
      eventTarget = eventTarget.parentElement as HTMLElement;
    }

    // Get the index of the element if it is a list item.
    if (eventTargetHasClass(cssClasses.LIST_ITEM_CLASS)) {
      index = this.listElements.indexOf(eventTarget);
    }

    return index;
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   */
  private handleFocusInEvent_(evt: Event) {
    const index = this.getListItemIndex_(evt);
    this.foundation_.handleFocusIn(evt as FocusEvent, index);
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   */
  private handleFocusOutEvent_(evt: Event) {
    const index = this.getListItemIndex_(evt);
    this.foundation_.handleFocusOut(evt as FocusEvent, index);
  }

  /**
   * Used to figure out which element was focused when keydown event occurred before sending the event to the
   * foundation.
   */
  private handleKeydownEvent_(evt: KeyboardEvent) {
    const index = this.getListItemIndex_(evt);

    if (index >= 0) {
      this.foundation_.handleKeydown(
        evt, (evt.target as Element).classList.contains(cssClasses.LIST_ITEM_CLASS), index);
    }
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   */
  private handleClickEvent_(evt: Event) {
    const index = this.getListItemIndex_(evt);

    // Toggle the checkbox only if it's not the target of the event, or the checkbox will have 2 change events.
    const toggleCheckbox = !matches(evt.target as Element, strings.CHECKBOX_RADIO_SELECTOR);
    this.foundation_.handleClick(index, toggleCheckbox);
  }
}

export {MDCList, MDCListFoundation};
