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

type SelectionUpdateOptions = {
  /** Whether the update was triggered by a user interaction. */
  isUserInteraction?: boolean;
  /**
   * Whether the UI should be updated regardless of whether the
   * selection would be a noop according to the foundation state.
   * https://github.com/material-components/material-components-web/commit/5d060518804437aa1ae3152562f1bb78b1af4aa6.
   */
  forceUpdate?: boolean;
}

/** List of modifier keys to consider while handling keyboard events. */
const handledModifierKeys = ['Alt', 'Control', 'Meta', 'Shift'] as const;

/** Type representing a modifier key we handle. */
type ModifierKey = NonNullable<(typeof handledModifierKeys)[number]>;

/** Checks if the event has the given modifier keys. */
function createModifierChecker(event?: KeyboardEvent|MouseEvent) {
  const eventModifiers = new Set(
      event ? handledModifierKeys.filter(m => event.getModifierState(m)) : []);
  return (modifiers: ModifierKey[]) =>
             modifiers.every(m => eventModifiers.has(m)) &&
      modifiers.length === eventModifiers.size;
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
      notifySelectionChange: () => {},
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
  private areDisabledItemsFocusable = true;
  private selectedIndex: MDCListIndex = numbers.UNSET_INDEX;
  private focusedItemIndex = numbers.UNSET_INDEX;
  private useActivatedClass = false;
  private useSelectedAttr = false;
  private ariaCurrentAttrValue: string|null = null;
  private isCheckboxList = false;
  private isRadioList = false;
  private lastSelectedIndex: number|null = null;

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

  setDisabledItemsFocusable(value: boolean) {
    this.areDisabledItemsFocusable = value;
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

  setSelectedIndex(index: MDCListIndex, options: SelectionUpdateOptions = {}) {
    if (!this.isIndexValid(index)) {
      return;
    }

    if (this.isCheckboxList) {
      this.setCheckboxAtIndex(index as number[], options);
    } else if (this.isRadioList) {
      this.setRadioAtIndex(index as number, options);
    } else {
      this.setSingleSelectionAtIndex(index as number, options);
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

  private isIndexDisabled(index: number) {
    return this.adapter.listItemAtIndexHasClass(
        index, cssClasses.LIST_ITEM_DISABLED_CLASS);
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

    // The keys for forward and back differ based on list orientation.
    const isForward =
        (this.isVertical && isArrowDown) || (!this.isVertical && isArrowRight);
    const isBack =
        (this.isVertical && isArrowUp) || (!this.isVertical && isArrowLeft);

    // Have to check both upper and lower case, because having caps lock on
    // affects the value.
    const isLetterA = event.key === 'A' || event.key === 'a';

    const eventHasModifiers = createModifierChecker(event);

    if (this.adapter.isRootFocused()) {
      if ((isBack || isEnd) && eventHasModifiers([])) {
        event.preventDefault();
        this.focusLastElement();
      } else if ((isForward || isHome) && eventHasModifiers([])) {
        event.preventDefault();
        this.focusFirstElement();
      } else if (
          isBack && eventHasModifiers(['Shift']) && this.isCheckboxList) {
        event.preventDefault();
        const focusedIndex = this.focusLastElement();
        if (focusedIndex !== -1) {
          this.setSelectedIndexOnAction(focusedIndex, false);
        }
      } else if (
          isForward && eventHasModifiers(['Shift']) && this.isCheckboxList) {
        event.preventDefault();
        const focusedIndex = this.focusFirstElement();
        if (focusedIndex !== -1) {
          this.setSelectedIndexOnAction(focusedIndex, false);
        }
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
          isItemAtIndexDisabled: (index) => this.isIndexDisabled(index),
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

    if (isForward && eventHasModifiers([])) {
      preventDefaultEvent(event);
      this.focusNextElement(currentIndex);
    } else if (isBack && eventHasModifiers([])) {
      preventDefaultEvent(event);
      this.focusPrevElement(currentIndex);
    } else if (
        isForward && eventHasModifiers(['Shift']) && this.isCheckboxList) {
      preventDefaultEvent(event);
      const focusedIndex = this.focusNextElement(currentIndex);
      if (focusedIndex !== -1) {
        this.setSelectedIndexOnAction(focusedIndex, false);
      }
    } else if (isBack && eventHasModifiers(['Shift']) && this.isCheckboxList) {
      preventDefaultEvent(event);
      const focusedIndex = this.focusPrevElement(currentIndex);
      if (focusedIndex !== -1) {
        this.setSelectedIndexOnAction(focusedIndex, false);
      }
    } else if (isHome && eventHasModifiers([])) {
      preventDefaultEvent(event);
      this.focusFirstElement();
    } else if (isEnd && eventHasModifiers([])) {
      preventDefaultEvent(event);
      this.focusLastElement();
    } else if (
        isHome && eventHasModifiers(['Control', 'Shift']) &&
        this.isCheckboxList) {
      preventDefaultEvent(event);
      if (this.isIndexDisabled(currentIndex)) {
        return;
      }
      this.focusFirstElement();
      this.toggleCheckboxRange(0, currentIndex, currentIndex);
    } else if (
        isEnd && eventHasModifiers(['Control', 'Shift']) &&
        this.isCheckboxList) {
      preventDefaultEvent(event);
      if (this.isIndexDisabled(currentIndex)) {
        return;
      }
      this.focusLastElement();
      this.toggleCheckboxRange(
          currentIndex, this.adapter.getListItemCount() - 1, currentIndex);
    } else if (
        isLetterA && eventHasModifiers(['Control']) && this.isCheckboxList) {
      event.preventDefault();
      this.checkboxListToggleAll(
          this.selectedIndex === numbers.UNSET_INDEX ?
              [] :
              this.selectedIndex as number[],
          true);
    } else if ((isEnter || isSpace) && eventHasModifiers([])) {
      if (isRootListItem) {
        // Return early if enter key is pressed on anchor element which triggers
        // synthetic MouseEvent event.
        const target = event.target as Element | null;
        if (target && target.tagName === 'A' && isEnter) {
          return;
        }
        preventDefaultEvent(event);

        if (this.isIndexDisabled(currentIndex)) {
          return;
        }

        if (!this.isTypeaheadInProgress()) {
          if (this.isSelectableList()) {
            this.setSelectedIndexOnAction(currentIndex, false);
          }
          this.adapter.notifyAction(currentIndex);
        }
      }
    } else if (
        (isEnter || isSpace) && eventHasModifiers(['Shift']) &&
        this.isCheckboxList) {
      // Return early if enter key is pressed on anchor element which triggers
      // synthetic MouseEvent event.
      const target = event.target as Element | null;
      if (target && target.tagName === 'A' && isEnter) {
        return;
      }
      preventDefaultEvent(event);

      if (this.isIndexDisabled(currentIndex)) {
        return;
      }

      if (!this.isTypeaheadInProgress()) {
        this.toggleCheckboxRange(
            this.lastSelectedIndex ?? currentIndex, currentIndex, currentIndex);
        this.adapter.notifyAction(currentIndex);
      }
    }

    if (this.hasTypeahead) {
      const handleKeydownOpts: typeahead.HandleKeydownOpts = {
        event,
        focusItemAtIndex: (index) => {this.focusItemAtIndex(index)},
        focusedItemIndex: this.focusedItemIndex,
        isTargetListItem: isRootListItem,
        sortedIndexByFirstChar: this.sortedIndexByFirstChar,
        isItemAtIndexDisabled: (index) => this.isIndexDisabled(index),
      };

      typeahead.handleKeydown(handleKeydownOpts, this.typeaheadState);
    }
  }

  /**
   * Click handler for the list.
   *
   * @param index Index for the item that has been clicked.
   * @param isCheckboxAlreadyUpdatedInAdapter Whether the checkbox for
   *   the list item has already been updated in the adapter. This attribute
   *   should be set to `true` when e.g. the click event directly landed on
   *   the underlying native checkbox element which would cause the checked
   *   state to be already toggled within `adapter.isCheckboxCheckedAtIndex`.
   */
  handleClick(
      index: number, isCheckboxAlreadyUpdatedInAdapter: boolean,
      event?: MouseEvent) {
    const eventHasModifiers = createModifierChecker(event);

    if (index === numbers.UNSET_INDEX) {
      return;
    }

    if (this.isIndexDisabled(index)) {
      return;
    }

    if (eventHasModifiers([])) {
      if (this.isSelectableList()) {
        this.setSelectedIndexOnAction(index, isCheckboxAlreadyUpdatedInAdapter);
      }
      this.adapter.notifyAction(index);
    } else if (this.isCheckboxList && eventHasModifiers(['Shift'])) {
      this.toggleCheckboxRange(this.lastSelectedIndex ?? index, index, index);
      this.adapter.notifyAction(index);
    }
  }

  /**
   * Focuses the next element on the list.
   */
  focusNextElement(index: number) {
    const count = this.adapter.getListItemCount();
    let nextIndex = index;
    let firstChecked = null;

    do {
      nextIndex++;
      if (nextIndex >= count) {
        if (this.wrapFocus) {
          nextIndex = 0;
        } else {
          // Return early because last item is already focused.
          return index;
        }
      }
      if (nextIndex === firstChecked) {
        return -1;
      }
      firstChecked = firstChecked ?? nextIndex;
    } while (!this.areDisabledItemsFocusable && this.isIndexDisabled(nextIndex));

    this.focusItemAtIndex(nextIndex);
    return nextIndex;
  }

  /**
   * Focuses the previous element on the list.
   */
  focusPrevElement(index: number) {
    const count = this.adapter.getListItemCount();
    let prevIndex = index;
    let firstChecked = null;

    do {
      prevIndex--;
      if (prevIndex < 0) {
        if (this.wrapFocus) {
          prevIndex = count - 1;
        } else {
          // Return early because first item is already focused.
          return index;
        }
      }
      if (prevIndex === firstChecked) {
        return -1;
      }
      firstChecked = firstChecked ?? prevIndex;
    } while (!this.areDisabledItemsFocusable && this.isIndexDisabled(prevIndex));

    this.focusItemAtIndex(prevIndex);
    return prevIndex;
  }

  focusFirstElement() {
    // Pass -1 to `focusNextElement`, since it will incremement to 0 and focus
    // the first element.
    return this.focusNextElement(-1);
  }

  focusLastElement() {
    // Pass the length of the list to `focusNextElement` since it will decrement
    // to length - 1 and focus the last element.
    return this.focusPrevElement(this.adapter.getListItemCount());
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
    if (!this.isIndexValid(itemIndex, false)) {
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

  private setSingleSelectionAtIndex(
      index: number, options: SelectionUpdateOptions = {}) {
    if (this.selectedIndex === index && !options.forceUpdate) {
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

    // If the selected value has changed through user interaction,
    // we want to notify the selection change to the adapter.
    if (options.isUserInteraction && !options.forceUpdate) {
      this.adapter.notifySelectionChange([index]);
    }
  }

  /**
   * Sets aria attribute for single selection at given index.
   */
  private setAriaForSingleSelectionAtIndex(index: number) {
    // Detect the presence of aria-current and get the value only during list
    // initialization when it is in unset state.
    if (this.selectedIndex === numbers.UNSET_INDEX &&
        index !== numbers.UNSET_INDEX) {
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
  private setRadioAtIndex(index: number, options: SelectionUpdateOptions = {}) {
    const selectionAttribute = this.getSelectionAttribute();
    this.adapter.setCheckedCheckboxOrRadioAtIndex(index, true);

    if (this.selectedIndex === index && !options.forceUpdate) {
      return;
    }

    if (this.selectedIndex !== numbers.UNSET_INDEX) {
      this.adapter.setAttributeForElementIndex(
          this.selectedIndex as number, selectionAttribute, 'false');
    }

    this.adapter.setAttributeForElementIndex(index, selectionAttribute, 'true');

    this.selectedIndex = index;

    // If the selected value has changed through user interaction,
    // we want to notify the selection change to the adapter.
    if (options.isUserInteraction && !options.forceUpdate) {
      this.adapter.notifySelectionChange([index]);
    }
  }

  private setCheckboxAtIndex(
      index: number[], options: SelectionUpdateOptions = {}) {
    const currentIndex = this.selectedIndex;
    // If this update is not triggered by a user interaction, we do not
    // need to know about the currently selected indices and can avoid
    // constructing the `Set` for performance reasons.
    const currentlySelected = options.isUserInteraction ?
        new Set(
            currentIndex === numbers.UNSET_INDEX ? [] :
                                                   currentIndex as number[]) :
        null;
    const selectionAttribute = this.getSelectionAttribute();
    const changedIndices = [];

    for (let i = 0; i < this.adapter.getListItemCount(); i++) {
      const previousIsChecked = currentlySelected?.has(i);
      const newIsChecked = index.indexOf(i) >= 0;

      // If the selection has changed for this item, we keep track of it
      // so that we can notify the adapter.
      if (newIsChecked !== previousIsChecked) {
        changedIndices.push(i);
      }

      this.adapter.setCheckedCheckboxOrRadioAtIndex(i, newIsChecked);
      this.adapter.setAttributeForElementIndex(
          i, selectionAttribute, newIsChecked ? 'true' : 'false');
    }

    this.selectedIndex = index;

    // If the selected value has changed through user interaction,
    // we want to notify the selection change to the adapter.
    if (options.isUserInteraction && changedIndices.length) {
      this.adapter.notifySelectionChange(changedIndices);
    }
  }

  /**
   * Toggles the state of all checkboxes in the given range (inclusive) based on
   * the state of the checkbox at the `toggleIndex`. To determine whether to set
   * the given range to checked or unchecked, read the value of the checkbox at
   * the `toggleIndex` and negate it. Then apply that new checked state to all
   * checkboxes in the range.
   * @param fromIndex The start of the range of checkboxes to toggle
   * @param toIndex The end of the range of checkboxes to toggle
   * @param toggleIndex The index that will be used to determine the new state
   *     of the given checkbox range.
   */
  private toggleCheckboxRange(
      fromIndex: number, toIndex: number, toggleIndex: number) {
    this.lastSelectedIndex = toggleIndex;
    const currentlySelected = new Set(
        this.selectedIndex === numbers.UNSET_INDEX ?
            [] :
            this.selectedIndex as number[]);
    const newIsChecked = !currentlySelected?.has(toggleIndex);

    const [startIndex, endIndex] = [fromIndex, toIndex].sort();
    const selectionAttribute = this.getSelectionAttribute();
    const changedIndices = [];

    for (let i = startIndex; i <= endIndex; i++) {
      if (this.isIndexDisabled(i)) {
        continue;
      }
      const previousIsChecked = currentlySelected.has(i);

      // If the selection has changed for this item, we keep track of it
      // so that we can notify the adapter.
      if (newIsChecked !== previousIsChecked) {
        changedIndices.push(i);
        this.adapter.setCheckedCheckboxOrRadioAtIndex(i, newIsChecked);
        this.adapter.setAttributeForElementIndex(
            i, selectionAttribute, `${newIsChecked}`);
        if (newIsChecked) {
          currentlySelected.add(i);
        } else {
          currentlySelected.delete(i);
        }
      }
    }

    // If the selected value has changed, update and notify the selection change
    // to the adapter.
    if (changedIndices.length) {
      this.selectedIndex = [...currentlySelected];
      this.adapter.notifySelectionChange(changedIndices);
    }
  }

  private setTabindexAtIndex(index: number) {
    if (this.focusedItemIndex === numbers.UNSET_INDEX && index !== 0 &&
        index !== numbers.UNSET_INDEX) {
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
        this.selectedIndex !== index &&
        this.focusedItemIndex !== numbers.UNSET_INDEX) {
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

  private isIndexValid(index: MDCListIndex, validateListType: boolean = true) {
    if (index instanceof Array) {
      if (!this.isCheckboxList && validateListType) {
        throw new Error(
            'MDCListFoundation: Array of index is only supported for checkbox based list');
      }

      if (index.length === 0) {
        return true;
      } else {
        return index.some((i) => this.isIndexInRange(i));
      }
    } else if (typeof index === 'number') {
      if (this.isCheckboxList && validateListType) {
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
   * Sets selected index on user action, toggles checkboxes in checkbox lists
   * by default, unless `isCheckboxAlreadyUpdatedInAdapter` is set to `true`.
   *
   * In cases where `isCheckboxAlreadyUpdatedInAdapter` is set to `true`, the
   * UI is just updated to reflect the value returned by the adapter.
   *
   * When calling this, make sure user interaction does not toggle disabled
   * list items.
   */
  private setSelectedIndexOnAction(
      index: number, isCheckboxAlreadyUpdatedInAdapter: boolean) {
    this.lastSelectedIndex = index;
    if (this.isCheckboxList) {
      this.toggleCheckboxAtIndex(index, isCheckboxAlreadyUpdatedInAdapter);
      this.adapter.notifySelectionChange([index]);
    } else {
      this.setSelectedIndex(index, {isUserInteraction: true});
    }
  }

  private toggleCheckboxAtIndex(
      index: number, isCheckboxAlreadyUpdatedInAdapter: boolean) {
    const selectionAttribute = this.getSelectionAttribute();
    const adapterIsChecked = this.adapter.isCheckboxCheckedAtIndex(index);

    // By default the checked value from the adapter is toggled unless the
    // checked state in the adapter has already been updated beforehand.
    // This can be happen when the underlying native checkbox has already
    // been updated through the native click event.
    let newCheckedValue;
    if (isCheckboxAlreadyUpdatedInAdapter) {
      newCheckedValue = adapterIsChecked;
    } else {
      newCheckedValue = !adapterIsChecked;
      this.adapter.setCheckedCheckboxOrRadioAtIndex(index, newCheckedValue)
    }

    this.adapter.setAttributeForElementIndex(
        index, selectionAttribute, newCheckedValue ? 'true' : 'false');

    // If none of the checkbox items are selected and selectedIndex is not
    // initialized then provide a default value.
    let selectedIndexes = this.selectedIndex === numbers.UNSET_INDEX ?
        [] :
        (this.selectedIndex as number[]).slice();

    if (newCheckedValue) {
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

  private checkboxListToggleAll(
      currentlySelectedIndexes: number[], isUserInteraction: boolean) {
    const count = this.adapter.getListItemCount();

    // If all items are selected, deselect everything.
    if (currentlySelectedIndexes.length === count) {
      this.setCheckboxAtIndex([], {isUserInteraction});
    } else {
      // Otherwise select all enabled options.
      const allIndexes: number[] = [];
      for (let i = 0; i < count; i++) {
        if (!this.isIndexDisabled(i) ||
            currentlySelectedIndexes.indexOf(i) > -1) {
          allIndexes.push(i);
        }
      }
      this.setCheckboxAtIndex(allIndexes, {isUserInteraction});
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
      isItemAtIndexDisabled: (index) => this.isIndexDisabled(index)
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
