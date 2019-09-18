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

import {MDCComponent} from '@material/base/component';
import {SpecificEventListener} from '@material/base/types';
import {closest, matches} from '@material/dom/ponyfill';
import {MDCListAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCListFoundation} from './foundation';
import {MDCListActionEventDetail, MDCListIndex} from './types';

export type MDCListFactory = (el: Element, foundation?: MDCListFoundation) => MDCList;

export class MDCList extends MDCComponent<MDCListFoundation> {
  set vertical(value: boolean) {
    this.foundation_.setVerticalOrientation(value);
  }

  get listElements(): Element[] {
    return [].slice.call(this.root_.querySelectorAll(`.${cssClasses.LIST_ITEM_CLASS}`));
  }

  set wrapFocus(value: boolean) {
    this.foundation_.setWrapFocus(value);
  }

  set singleSelection(isSingleSelectionList: boolean) {
    this.foundation_.setSingleSelection(isSingleSelectionList);
  }

  get selectedIndex(): MDCListIndex {
    return this.foundation_.getSelectedIndex();
  }

  set selectedIndex(index: MDCListIndex) {
    this.foundation_.setSelectedIndex(index);
  }

  static attachTo(root: Element) {
    return new MDCList(root);
  }

  private handleKeydown_!: SpecificEventListener<'keydown'>; // assigned in initialSyncWithDOM()
  private handleClick_!: SpecificEventListener<'click'>; // assigned in initialSyncWithDOM()
  private focusInEventListener_!: SpecificEventListener<'focus'>; // assigned in initialSyncWithDOM()
  private focusOutEventListener_!: SpecificEventListener<'focus'>; // assigned in initialSyncWithDOM()

  initialSyncWithDOM() {
    this.handleClick_ = this.handleClickEvent_.bind(this);
    this.handleKeydown_ = this.handleKeydownEvent_.bind(this);
    this.focusInEventListener_ = this.handleFocusInEvent_.bind(this);
    this.focusOutEventListener_ = this.handleFocusOutEvent_.bind(this);
    this.listen('keydown', this.handleKeydown_);
    this.listen('click', this.handleClick_);
    this.listen('focusin', this.focusInEventListener_);
    this.listen('focusout', this.focusOutEventListener_);
    this.layout();
    this.initializeListType();
  }

  destroy() {
    this.unlisten('keydown', this.handleKeydown_);
    this.unlisten('click', this.handleClick_);
    this.unlisten('focusin', this.focusInEventListener_);
    this.unlisten('focusout', this.focusOutEventListener_);
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

  /**
   * Updates the list item at itemIndex to the desired isEnabled state.
   * @param itemIndex Index of the list item
   * @param isEnabled Sets the list item to enabled or disabled.
   */
  setEnabled(itemIndex: number, isEnabled: boolean) {
    this.foundation_.setEnabled(itemIndex, isEnabled);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCListAdapter = {
      addClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.add(className);
        }
      },
      focusItemAtIndex: (index) => {
        const element = this.listElements[index] as HTMLElement | undefined;
        if (element) {
          element.focus();
        }
      },
      getAttributeForElementIndex: (index, attr) => this.listElements[index].getAttribute(attr),
      getFocusedElementIndex: () => this.listElements.indexOf(document.activeElement!),
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
        const toggleEl = listItem.querySelector<HTMLInputElement>(strings.ENABLED_CHECKBOX_SELECTOR);
        return toggleEl!.checked;
      },
      isFocusInsideList: () => {
        return this.root_.contains(document.activeElement);
      },
      isListItemDisabled: (index) => this.listElements[index].classList.contains(cssClasses.LIST_ITEM_DISABLED_CLASS),
      isRootFocused: () => document.activeElement === this.root_,
      notifyAction: (index) => {
        this.emit<MDCListActionEventDetail>(strings.ACTION_EVENT, {index}, /** shouldBubble */ true);
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
        const toggleEl = listItem.querySelector<HTMLInputElement>(strings.ENABLED_CHECKBOX_RADIO_SELECTOR);
        toggleEl!.checked = isChecked;

        const event = document.createEvent('Event');
        event.initEvent('change', true, true);
        toggleEl!.dispatchEvent(event);
      },
      setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
        const element = this.listElements[listItemIndex];
        const listItemChildren: Element[] =
            [].slice.call(element.querySelectorAll(strings.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX));
        listItemChildren.forEach((el) => el.setAttribute('tabindex', tabIndexValue));
      },
    };
    return new MDCListFoundation(adapter);
  }

  /**
   * Used to figure out which list item this event is targetting. Or returns -1 if
   * there is no list item
   */
  private getListItemIndex_(evt: Event) {
    const eventTarget = evt.target as Element;
    const nearestParent = closest(eventTarget, `.${cssClasses.LIST_ITEM_CLASS}, .${cssClasses.ROOT}`);

    // Get the index of the element if it is a list item.
    if (nearestParent && matches(nearestParent, `.${cssClasses.LIST_ITEM_CLASS}`)) {
      return this.listElements.indexOf(nearestParent);
    }

    return -1;
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   */
  private handleFocusInEvent_(evt: FocusEvent) {
    const index = this.getListItemIndex_(evt);
    this.foundation_.handleFocusIn(evt, index);
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   */
  private handleFocusOutEvent_(evt: FocusEvent) {
    const index = this.getListItemIndex_(evt);
    this.foundation_.handleFocusOut(evt, index);
  }

  /**
   * Used to figure out which element was focused when keydown event occurred before sending the event to the
   * foundation.
   */
  private handleKeydownEvent_(evt: KeyboardEvent) {
    const index = this.getListItemIndex_(evt);
    const target = evt.target as Element;
    this.foundation_.handleKeydown(evt, target.classList.contains(cssClasses.LIST_ITEM_CLASS), index);
  }

  /**
   * Used to figure out which element was clicked before sending the event to the foundation.
   */
  private handleClickEvent_(evt: MouseEvent) {
    const index = this.getListItemIndex_(evt);
    const target = evt.target as Element;

    // Toggle the checkbox only if it's not the target of the event, or the checkbox will have 2 change events.
    const toggleCheckbox = !matches(target, strings.CHECKBOX_RADIO_SELECTOR);
    this.foundation_.handleClick(index, toggleCheckbox);
  }
}
