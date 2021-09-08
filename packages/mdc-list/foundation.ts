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

import {MDCFoundation} from '@material/base/foundation';
import {normalizeKey} from '@material/dom/keyboard';

import {MDCListAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';
import {preventDefaultEvent} from './events';
import * as typeahead from './typeahead';
import {MDCListIndex, MDCListTextAndIndex} from './types';

function isNumberArray(selectedIndex: MDCListIndex): selectedIndex is number[] {
  return selectedIndex instanceof Array;
}

export class MDCListFoundation extends MDCFoundation<MDCListAdapter> {
  static override get strings() {
    return strings;
  }

  static override get cssClasses() {
    return cssClasses;
  }

  static override get numbers() {
    return numbers;
  }

  static override get defaultAdapter(): MDCListAdapter {
    return {
      addClassForElementIndex: () => undefined,
      focusItemAtIndex: () => undefined,
      getAttributeForElementIndex: () => null,
      getFocusedElementIndex: () => 0,
      getListItemCount: () => 0,
      hasCheckboxAtIndex: () => false,
      hasRadioAtIndex: () => false,
      isCheckboxCheckedAtIndex: () => false,
      isFocusInsideList: () => false,
      isRootFocused: () => false,
      listItemAtIndexHasClass: () => false,
      notifyAction: () => undefined,
      removeClassForElementIndex: () => undefined,
      setAttributeForElementIndex: () => undefined,
      setCheckedCheckboxOrRadioAtIndex: () => undefined,
      setTabIndexForListItemChildren: () => undefined,
      getPrimaryTextAtIndex: () => '',
    };
  }

  private wrapFocus = false;
  private isVertical = true;
  private isSingleSelectionList = false;
  private selectedIndex: MDCListIndex = numbers.UNSET_INDEX;
  private focusedItemIndex = numbers.UNSET_INDEX;
  private useActivatedClass = false;
  private useSelectedAttr = false;
  private ariaCurrentAttrValue: string|null = null;
  private isCheckboxList = false;
  private isRadioList = false;

  private hasTypeahead = false;
  // Transiently holds current typeahead prefix from user.
  private readonly typeaheadState = typeahead.initState();
  private sortedIndexByFirstChar = new Map<string, MDCListTextAndIndex[]>();

  constructor(adapter?: Partial<MDCListAdapter>) {
    super({...MDCListFoundation.defaultAdapter, ...adapter});
  }

  layout() {
    if (this.adapter.getListItemCount() === 0) {
      return;
    }

    // TODO(b/172274142): consider all items when determining the list's type.
    if (this.adapter.hasCheckboxAtIndex(0)) {
      this.isCheckboxList = true;
    } else if (this.adapter.hasRadioAtIndex(0)) {
      this.isRadioList = true;
    } else {
      this.maybeInitializeSingleSelection();
    }

    if (this.hasTypeahead) {
      this.sortedIndexByFirstChar = this.typeaheadInitSortedIndex();
    }
  }

  /** Returns the index of the item that was last focused. */
  getFocusedItemIndex() {
    return this.focusedItemIndex;
  }

  /** Toggles focus wrapping with keyboard navigation. */
  setWrapFocus(value: boolean) {
    this.wrapFocus = value;
  }

  /**
   * Toggles orientation direction for keyboard navigation (true for vertical,
   * false for horizontal).
   */
  setVerticalOrientation(value: boolean) {
    this.isVertical = value;
  }

  /** Toggles single-selection behavior. */
  setSingleSelection(value: boolean) {
    this.isSingleSelectionList = value;
    if (value) {
      this.maybeInitializeSingleSelection();
      this.selectedIndex = this.getSelectedIndexFromDOM();
    }
  }

  /**
   * Automatically determines whether the list is single selection list. If so,
   * initializes the internal state to match the selected item.
   */
  private maybeInitializeSingleSelection() {
    const selectedItemIndex = this.getSelectedIndexFromDOM();
    if (selectedItemIndex === numbers.UNSET_INDEX) return;

    const hasActivatedClass = this.adapter.listItemAtIndexHasClass(
        selectedItemIndex, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
    if (hasActivatedClass) {
      this.setUseActivatedClass(true);
    }
    this.isSingleSelectionList = true;
    this.selectedIndex = selectedItemIndex;
  }

  /** @return Index of the first selected item based on the DOM state. */
  private getSelectedIndexFromDOM() {
    let selectedIndex = numbers.UNSET_INDEX;
    const listItemsCount = this.adapter.getListItemCount();
    for (let i = 0; i < listItemsCount; i++) {
      const hasSelectedClass = this.adapter.listItemAtIndexHasClass(
          i, cssClasses.LIST_ITEM_SELECTED_CLASS);
      const hasActivatedClass = this.adapter.listItemAtIndexHasClass(
          i, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
      if (!(hasSelectedClass || hasActivatedClass)) {
        continue;
      }

      selectedIndex = i;
      break;
    }

    return selectedIndex;
  }

  /**
   * Sets whether typeahead is enabled on the list.
   * @param hasTypeahead Whether typeahead is enabled.
   */
  setHasTypeahead(hasTypeahead: boolean) {
    this.hasTypeahead = hasTypeahead;
    if (hasTypeahead) {
      this.sortedIndexByFirstChar = this.typeaheadInitSortedIndex();
    }
  }

  /**
   * @return Whether typeahead is currently matching a user-specified prefix.
   */
  isTypeaheadInProgress(): boolean {
    return this.hasTypeahead &&
        typeahead.isTypingInProgress(this.typeaheadState);
  }

  /** Toggle use of the "activated" CSS class. */
  setUseActivatedClass(useActivated: boolean) {
    this.useActivatedClass = useActivated;
  }

  /**
   * Toggles use of the selected attribute (true for aria-selected, false for
   * aria-checked).
   */
  setUseSelectedAttribute(useSelected: boolean) {
    this.useSelectedAttr = useSelected;
  }

  getSelectedIndex(): MDCListIndex {
    return this.selectedIndex;
  }

  setSelectedIndex(index: MDCListIndex, {forceUpdate}: {forceUpdate?:
                                                            boolean} = {}) {
    if (!this.isIndexValid(index)) {
      return;
    }

    if (this.isCheckboxList) {
      this.setCheckboxAtIndex(index as number[]);
    } else if (this.isRadioList) {
      this.setRadioAtIndex(index as number);
    } else {
      this.setSingleSelectionAtIndex(index as number, {forceUpdate});
    }
  }

  /**
   * Focus in handler for the list items.
   */
  handleFocusIn(listItemIndex: number) {
    if (listItemIndex >= 0) {
      this.focusedItemIndex = listItemIndex;
      this.adapter.setAttributeForElementIndex(listItemIndex, 'tabindex', '0');
      this.adapter.setTabIndexForListItemChildren(listItemIndex, '0');
    }
  }

  /**
   * Focus out handler for the list items.
   */
  handleFocusOut(listItemIndex: number) {
    if (listItemIndex >= 0) {
      this.adapter.setAttributeForElementIndex(listItemIndex, 'tabindex', '-1');
      this.adapter.setTabIndexForListItemChildren(listItemIndex, '-1');
    }

    /**
     * Between Focusout & Focusin some browsers do not have focus on any
     * element. Setting a delay to wait till the focus is moved to next element.
     */
    setTimeout(() => {
      if (!this.adapter.isFocusInsideList()) {
        this.setTabindexToFirstSelectedOrFocusedItem();
      }
    }, 0);
  }

  /**
   * Key handler for the list.
   */
  handleKeydown(
      event: KeyboardEvent, isRootListItem: boolean, listItemIndex: number) {
    const isArrowLeft = normalizeKey(event) === 'ArrowLeft';
    const isArrowUp = normalizeKey(event) === 'ArrowUp';
    const isArrowRight = normalizeKey(event) === 'ArrowRight';
    const isArrowDown = normalizeKey(event) === 'ArrowDown';
    const isHome = normalizeKey(event) === 'Home';
    const isEnd = normalizeKey(event) === 'End';
    const isEnter = normalizeKey(event) === 'Enter';
    const isSpace = normalizeKey(event) === 'Spacebar';

    // Have to check both upper and lower case, because having caps lock on
    // affects the value.
    const isLetterA = event.key === 'A' || event.key === 'a';

    if (this.adapter.isRootFocused()) {
      if (isArrowUp || isEnd) {
        event.preventDefault();
        this.focusLastElement();
      } else if (isArrowDown || isHome) {
        event.preventDefault();
        this.focusFirstElement();
      }

      if (this.hasTypeahead) {
        const handleKeydownOpts: typeahead.HandleKeydownOpts = {
          event,
          focusItemAtIndex: (index) => {
            this.focusItemAtIndex(index);
          },
          focusedItemIndex: -1,
          isTargetListItem: isRootListItem,
          sortedIndexByFirstChar: this.sortedIndexByFirstChar,
          isItemAtIndexDisabled: (index) =>
              this.adapter.listItemAtIndexHasClass(
                  index, cssClasses.LIST_ITEM_DISABLED_CLASS),
        };

        typeahead.handleKeydown(handleKeydownOpts, this.typeaheadState);
      }

      return;
    }

    let currentIndex = this.adapter.getFocusedElementIndex();
    if (currentIndex === -1) {
      currentIndex = listItemIndex;
      if (currentIndex < 0) {
        // If this event doesn't have a mdc-list-item ancestor from the
        // current list (not from a sublist), return early.
        return;
      }
    }

    if ((this.isVertical && isArrowDown) ||
        (!this.isVertical && isArrowRight)) {
      preventDefaultEvent(event);
      this.focusNextElement(currentIndex);
    } else if (
        (this.isVertical && isArrowUp) || (!this.isVertical && isArrowLeft)) {
      preventDefaultEvent(event);
      this.focusPrevElement(currentIndex);
    } else if (isHome) {
      preventDefaultEvent(event);
      this.focusFirstElement();
    } else if (isEnd) {
      preventDefaultEvent(event);
      this.focusLastElement();
    } else if (isLetterA && event.ctrlKey && this.isCheckboxList) {
      event.preventDefault();
      this.toggleAll(
          this.selectedIndex === numbers.UNSET_INDEX ?
              [] :
              this.selectedIndex as number[]);
    } else if (isEnter || isSpace) {
      if (isRootListItem) {
        // Return early if enter key is pressed on anchor element which triggers
        // synthetic MouseEvent event.
        const target = event.target as Element | null;
        if (target && target.tagName === 'A' && isEnter) {
          return;
        }
        preventDefaultEvent(event);

        if (this.adapter.listItemAtIndexHasClass(
                currentIndex, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
          return;
        }

        if (!this.isTypeaheadInProgress()) {
          if (this.isSelectableList()) {
            this.setSelectedIndexOnAction(currentIndex);
          }
          this.adapter.notifyAction(currentIndex);
        }
      }
    }

    if (this.hasTypeahead) {
      const handleKeydownOpts: typeahead.HandleKeydownOpts = {
        event,
        focusItemAtIndex: (index) => {
          this.focusItemAtIndex(index)
        },
        focusedItemIndex: this.focusedItemIndex,
        isTargetListItem: isRootListItem,
        sortedIndexByFirstChar: this.sortedIndexByFirstChar,
        isItemAtIndexDisabled: (index) => this.adapter.listItemAtIndexHasClass(
            index, cssClasses.LIST_ITEM_DISABLED_CLASS),
      };

      typeahead.handleKeydown(handleKeydownOpts, this.typeaheadState);
    }
  }

  /**
   * Click handler for the list.
   */
  handleClick(index: number, toggleCheckbox: boolean) {
    if (index === numbers.UNSET_INDEX) {
      return;
    }

    if (this.adapter.listItemAtIndexHasClass(
            index, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
      return;
    }
    if (this.isSelectableList()) {
      this.setSelectedIndexOnAction(index, toggleCheckbox);
    }

    this.adapter.notifyAction(index);
  }

  /**
   * Focuses the next element on the list.
   */
  focusNextElement(index: number) {
    const count = this.adapter.getListItemCount();
    let nextIndex = index + 1;
    if (nextIndex >= count) {
      if (this.wrapFocus) {
        nextIndex = 0;
      } else {
        // Return early because last item is already focused.
        return index;
      }
    }
    this.focusItemAtIndex(nextIndex);

    return nextIndex;
  }

  /**
   * Focuses the previous element on the list.
   */
  focusPrevElement(index: number) {
    let prevIndex = index - 1;
    if (prevIndex < 0) {
      if (this.wrapFocus) {
        prevIndex = this.adapter.getListItemCount() - 1;
      } else {
        // Return early because first item is already focused.
        return index;
      }
    }
    this.focusItemAtIndex(prevIndex);
    return prevIndex;
  }

  focusFirstElement() {
    this.focusItemAtIndex(0);
    return 0;
  }

  focusLastElement() {
    const lastIndex = this.adapter.getListItemCount() - 1;
    this.focusItemAtIndex(lastIndex);
    return lastIndex;
  }

  focusInitialElement() {
    const initialIndex = this.getFirstSelectedOrFocusedItemIndex();
    this.focusItemAtIndex(initialIndex);
    return initialIndex;
  }

  /**
   * @param itemIndex Index of the list item
   * @param isEnabled Sets the list item to enabled or disabled.
   */
  setEnabled(itemIndex: number, isEnabled: boolean): void {
    if (!this.isIndexValid(itemIndex)) {
      return;
    }

    if (isEnabled) {
      this.adapter.removeClassForElementIndex(
          itemIndex, cssClasses.LIST_ITEM_DISABLED_CLASS);
      this.adapter.setAttributeForElementIndex(
          itemIndex, strings.ARIA_DISABLED, 'false');
    } else {
      this.adapter.addClassForElementIndex(
          itemIndex, cssClasses.LIST_ITEM_DISABLED_CLASS);
      this.adapter.setAttributeForElementIndex(
          itemIndex, strings.ARIA_DISABLED, 'true');
    }
  }

  private setSingleSelectionAtIndex(index: number, {forceUpdate}: {
    forceUpdate?: boolean
  } = {}) {
    if (this.selectedIndex === index && !forceUpdate) {
      return;
    }

    let selectedClassName = cssClasses.LIST_ITEM_SELECTED_CLASS;
    if (this.useActivatedClass) {
      selectedClassName = cssClasses.LIST_ITEM_ACTIVATED_CLASS;
    }

    if (this.selectedIndex !== numbers.UNSET_INDEX) {
      this.adapter.removeClassForElementIndex(
          this.selectedIndex as number, selectedClassName);
    }

    this.setAriaForSingleSelectionAtIndex(index);
    this.setTabindexAtIndex(index);
    if (index !== numbers.UNSET_INDEX) {
      this.adapter.addClassForElementIndex(index, selectedClassName);
    }

    this.selectedIndex = index;
  }

  /**
   * Sets aria attribute for single selection at given index.
   */
  private setAriaForSingleSelectionAtIndex(index: number) {
    // Detect the presence of aria-current and get the value only during list
    // initialization when it is in unset state.
    if (this.selectedIndex === numbers.UNSET_INDEX) {
      this.ariaCurrentAttrValue =
          this.adapter.getAttributeForElementIndex(index, strings.ARIA_CURRENT);
    }

    const isAriaCurrent = this.ariaCurrentAttrValue !== null;
    const ariaAttribute =
        isAriaCurrent ? strings.ARIA_CURRENT : strings.ARIA_SELECTED;

    if (this.selectedIndex !== numbers.UNSET_INDEX) {
      this.adapter.setAttributeForElementIndex(
          this.selectedIndex as number, ariaAttribute, 'false');
    }

    if (index !== numbers.UNSET_INDEX) {
      const ariaAttributeValue =
          isAriaCurrent ? this.ariaCurrentAttrValue : 'true';
      this.adapter.setAttributeForElementIndex(
          index, ariaAttribute, ariaAttributeValue as string);
    }
  }

  /**
   * Returns the attribute to use for indicating selection status.
   */
  private getSelectionAttribute(): string {
    return this.useSelectedAttr ? strings.ARIA_SELECTED : strings.ARIA_CHECKED;
  }

  /**
   * Toggles radio at give index. Radio doesn't change the checked state if it
   * is already checked.
   */
  private setRadioAtIndex(index: number) {
    const selectionAttribute = this.getSelectionAttribute();
    this.adapter.setCheckedCheckboxOrRadioAtIndex(index, true);

    if (this.selectedIndex !== numbers.UNSET_INDEX) {
      this.adapter.setAttributeForElementIndex(
          this.selectedIndex as number, selectionAttribute, 'false');
    }

    this.adapter.setAttributeForElementIndex(index, selectionAttribute, 'true');

    this.selectedIndex = index;
  }

  private setCheckboxAtIndex(index: number[]) {
    const selectionAttribute = this.getSelectionAttribute();
    for (let i = 0; i < this.adapter.getListItemCount(); i++) {
      let isChecked = false;
      if (index.indexOf(i) >= 0) {
        isChecked = true;
      }

      this.adapter.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
      this.adapter.setAttributeForElementIndex(
          i, selectionAttribute, isChecked ? 'true' : 'false');
    }

    this.selectedIndex = index;
  }

  private setTabindexAtIndex(index: number) {
    if (this.focusedItemIndex === numbers.UNSET_INDEX && index !== 0) {
      // If some list item was selected set first list item's tabindex to -1.
      // Generally, tabindex is set to 0 on first list item of list that has no
      // preselected items.
      this.adapter.setAttributeForElementIndex(0, 'tabindex', '-1');
    } else if (this.focusedItemIndex >= 0 && this.focusedItemIndex !== index) {
      this.adapter.setAttributeForElementIndex(
          this.focusedItemIndex, 'tabindex', '-1');
    }

    // Set the previous selection's tabindex to -1. We need this because
    // in selection menus that are not visible, programmatically setting an
    // option will not change focus but will change where tabindex should be 0.
    if (!(this.selectedIndex instanceof Array) &&
        this.selectedIndex !== index) {
      this.adapter.setAttributeForElementIndex(
          this.selectedIndex, 'tabindex', '-1');
    }

    if (index !== numbers.UNSET_INDEX) {
      this.adapter.setAttributeForElementIndex(index, 'tabindex', '0');
    }
  }

  /**
   * @return Return true if it is single selectin list, checkbox list or radio
   *     list.
   */
  private isSelectableList() {
    return this.isSingleSelectionList || this.isCheckboxList ||
        this.isRadioList;
  }

  private setTabindexToFirstSelectedOrFocusedItem() {
    const targetIndex = this.getFirstSelectedOrFocusedItemIndex();
    this.setTabindexAtIndex(targetIndex);
  }

  private getFirstSelectedOrFocusedItemIndex(): number {
    // Action lists retain focus on the most recently focused item.
    if (!this.isSelectableList()) {
      return Math.max(this.focusedItemIndex, 0);
    }

    // Single-selection lists focus the selected item.
    if (typeof this.selectedIndex === 'number' &&
        this.selectedIndex !== numbers.UNSET_INDEX) {
      return this.selectedIndex;
    }

    // Multiple-selection lists focus the first selected item.
    if (isNumberArray(this.selectedIndex) && this.selectedIndex.length > 0) {
      return this.selectedIndex.reduce(
          (minIndex, currentIndex) => Math.min(minIndex, currentIndex));
    }

    // Selection lists without a selection focus the first item.
    return 0;
  }

  private isIndexValid(index: MDCListIndex) {
    if (index instanceof Array) {
      if (!this.isCheckboxList) {
        throw new Error(
            'MDCListFoundation: Array of index is only supported for checkbox based list');
      }

      if (index.length === 0) {
        return true;
      } else {
        return index.some((i) => this.isIndexInRange(i));
      }
    } else if (typeof index === 'number') {
      if (this.isCheckboxList) {
        throw new Error(
            `MDCListFoundation: Expected array of index for checkbox based list but got number: ${
                index}`);
      }
      return this.isIndexInRange(index) ||
          this.isSingleSelectionList && index === numbers.UNSET_INDEX;
    } else {
      return false;
    }
  }

  private isIndexInRange(index: number) {
    const listSize = this.adapter.getListItemCount();
    return index >= 0 && index < listSize;
  }

  /**
   * Sets selected index on user action, toggles checkbox / radio based on
   * toggleCheckbox value. User interaction should not toggle list item(s) when
   * disabled.
   */
  private setSelectedIndexOnAction(index: number, toggleCheckbox = true) {
    if (this.isCheckboxList) {
      this.toggleCheckboxAtIndex(index, toggleCheckbox);
    } else {
      this.setSelectedIndex(index);
    }
  }

  private toggleCheckboxAtIndex(index: number, toggleCheckbox: boolean) {
    const selectionAttribute = this.getSelectionAttribute();
    let isChecked = this.adapter.isCheckboxCheckedAtIndex(index);

    if (toggleCheckbox) {
      isChecked = !isChecked;
      this.adapter.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
    }

    this.adapter.setAttributeForElementIndex(
        index, selectionAttribute, isChecked ? 'true' : 'false');

    // If none of the checkbox items are selected and selectedIndex is not
    // initialized then provide a default value.
    let selectedIndexes = this.selectedIndex === numbers.UNSET_INDEX ?
        [] :
        (this.selectedIndex as number[]).slice();

    if (isChecked) {
      selectedIndexes.push(index);
    } else {
      selectedIndexes = selectedIndexes.filter((i) => i !== index);
    }

    this.selectedIndex = selectedIndexes;
  }

  private focusItemAtIndex(index: number) {
    this.adapter.focusItemAtIndex(index);
    this.focusedItemIndex = index;
  }

  private toggleAll(currentlySelectedIndexes: number[]) {
    const count = this.adapter.getListItemCount();

    // If all items are selected, deselect everything.
    if (currentlySelectedIndexes.length === count) {
      this.setCheckboxAtIndex([]);
    } else {
      // Otherwise select all enabled options.
      const allIndexes: number[] = [];
      for (let i = 0; i < count; i++) {
        if (!this.adapter.listItemAtIndexHasClass(
                i, cssClasses.LIST_ITEM_DISABLED_CLASS) ||
            currentlySelectedIndexes.indexOf(i) > -1) {
          allIndexes.push(i);
        }
      }
      this.setCheckboxAtIndex(allIndexes);
    }
  }

  /**
   * Given the next desired character from the user, adds it to the typeahead
   * buffer. Then, attempts to find the next option matching the buffer. Wraps
   * around if at the end of options.
   *
   * @param nextChar The next character to add to the prefix buffer.
   * @param startingIndex The index from which to start matching. Only relevant
   *     when starting a new match sequence. To start a new match sequence,
   *     clear the buffer using `clearTypeaheadBuffer`, or wait for the buffer
   *     to clear after a set interval defined in list foundation. Defaults to
   *     the currently focused index.
   * @return The index of the matched item, or -1 if no match.
   */
  typeaheadMatchItem(
      nextChar: string, startingIndex?: number, skipFocus = false) {
    const opts: typeahead.TypeaheadMatchItemOpts = {
      focusItemAtIndex: (index) => {
        this.focusItemAtIndex(index);
      },
      focusedItemIndex: startingIndex ? startingIndex : this.focusedItemIndex,
      nextChar,
      sortedIndexByFirstChar: this.sortedIndexByFirstChar,
      skipFocus,
      isItemAtIndexDisabled: (index) => this.adapter.listItemAtIndexHasClass(
          index, cssClasses.LIST_ITEM_DISABLED_CLASS)
    };
    return typeahead.matchItem(opts, this.typeaheadState);
  }

  /**
   * Initializes the MDCListTextAndIndex data structure by indexing the current
   * list items by primary text.
   *
   * @return The primary texts of all the list items sorted by first character.
   */
  private typeaheadInitSortedIndex() {
    return typeahead.initSortedIndex(
        this.adapter.getListItemCount(), this.adapter.getPrimaryTextAtIndex);
  }

  /**
   * Clears the typeahead buffer.
   */
  clearTypeaheadBuffer() {
    typeahead.clearBuffer(this.typeaheadState);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCListFoundation;
