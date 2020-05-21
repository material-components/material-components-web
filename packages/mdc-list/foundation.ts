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
import {MDCListIndex, MDCListTextAndIndex} from './types';

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];

function isNumberArray(selectedIndex: MDCListIndex): selectedIndex is number[] {
  return selectedIndex instanceof Array;
}

export class MDCListFoundation extends MDCFoundation<MDCListAdapter> {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter(): MDCListAdapter {
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

  private wrapFocus_ = false;
  private isVertical_ = true;
  private isSingleSelectionList_ = false;
  private selectedIndex_: MDCListIndex = numbers.UNSET_INDEX;
  private focusedItemIndex_ = numbers.UNSET_INDEX;
  private useActivatedClass_ = false;
  private ariaCurrentAttrValue_: string | null = null;
  private isCheckboxList_ = false;
  private isRadioList_ = false;

  private hasTypeahead = false;
  // Transiently holds current typeahead prefix from user.
  private typeaheadBuffer = '';
  private typeaheadBufferClearTimeout = 0;
  // Persistently holds most recent first character typed by user.
  private currentFirstChar = '';
  private readonly sortedIndexByFirstChar =
      new Map<string, MDCListTextAndIndex[]>();
  private sortedIndexCursor = 0;

  constructor(adapter?: Partial<MDCListAdapter>) {
    super({...MDCListFoundation.defaultAdapter, ...adapter});
  }

  layout() {
    if (this.adapter.getListItemCount() === 0) {
      return;
    }

    if (this.adapter.hasCheckboxAtIndex(0)) {
      this.isCheckboxList_ = true;
    } else if (this.adapter.hasRadioAtIndex(0)) {
      this.isRadioList_ = true;
    }

    if (this.hasTypeahead) {
      this.initTypeaheadState();
    }
  }

  /**
   * Sets the private wrapFocus_ variable.
   */
  setWrapFocus(value: boolean) {
    this.wrapFocus_ = value;
  }

  /**
   * Sets the isVertical_ private variable.
   */
  setVerticalOrientation(value: boolean) {
    this.isVertical_ = value;
  }

  /**
   * Sets the isSingleSelectionList_ private variable.
   */
  setSingleSelection(value: boolean) {
    this.isSingleSelectionList_ = value;
  }

  /**
   * Sets whether typeahead is enabled on the list.
   * @param hasTypeahead Whether typeahead is enabled.
   */
  setHasTypeahead(hasTypeahead: boolean) {
    this.hasTypeahead = hasTypeahead;
    if (hasTypeahead) {
      this.initTypeaheadState();
    }
  }

  /**
   * @return Whether typeahead is currently matching a user-specified prefix.
   */
  isTypeaheadInProgress(): boolean {
    return this.hasTypeahead && this.typeaheadBuffer.length > 0;
  }

  /**
   * Sets the useActivatedClass_ private variable.
   */
  setUseActivatedClass(useActivated: boolean) {
    this.useActivatedClass_ = useActivated;
  }

  getSelectedIndex(): MDCListIndex {
    return this.selectedIndex_;
  }

  setSelectedIndex(index: MDCListIndex) {
    if (!this.isIndexValid_(index)) {
      return;
    }

    if (this.isCheckboxList_) {
      this.setCheckboxAtIndex_(index as number[]);
    } else if (this.isRadioList_) {
      this.setRadioAtIndex_(index as number);
    } else {
      this.setSingleSelectionAtIndex_(index as number);
    }
  }

  /**
   * Focus in handler for the list items.
   */
  handleFocusIn(_: FocusEvent, listItemIndex: number) {
    if (listItemIndex >= 0) {
      this.focusedItemIndex_ = listItemIndex;
      this.adapter.setTabIndexForListItemChildren(listItemIndex, '0');
    }
  }

  /**
   * Focus out handler for the list items.
   */
  handleFocusOut(_: FocusEvent, listItemIndex: number) {
    if (listItemIndex >= 0) {
      this.adapter.setTabIndexForListItemChildren(listItemIndex, '-1');
    }

    /**
     * Between Focusout & Focusin some browsers do not have focus on any element. Setting a delay to wait till the focus
     * is moved to next element.
     */
    setTimeout(() => {
      if (!this.adapter.isFocusInsideList()) {
        this.setTabindexToFirstSelectedItem_();
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

    if (this.adapter.isRootFocused()) {
      if (isArrowUp || isEnd) {
        event.preventDefault();
        this.focusLastElement();
      } else if (isArrowDown || isHome) {
        event.preventDefault();
        this.focusFirstElement();
      } else if (this.hasTypeahead && event.key.length === 1) {
        // focus first item matching prefix
        event.preventDefault();
        this.typeaheadMatchItem(event.key.toLowerCase());
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

    if ((this.isVertical_ && isArrowDown) || (!this.isVertical_ && isArrowRight)) {
      this.preventDefaultEvent_(event);
      this.focusNextElement(currentIndex);
    } else if ((this.isVertical_ && isArrowUp) || (!this.isVertical_ && isArrowLeft)) {
      this.preventDefaultEvent_(event);
      this.focusPrevElement(currentIndex);
    } else if (isHome) {
      this.preventDefaultEvent_(event);
      this.focusFirstElement();
    } else if (isEnd) {
      this.preventDefaultEvent_(event);
      this.focusLastElement();
    } else if (isEnter || isSpace) {
      if (isRootListItem) {
        // Return early if enter key is pressed on anchor element which triggers synthetic MouseEvent event.
        const target = event.target as Element | null;
        if (target && target.tagName === 'A' && isEnter) {
          return;
        }
        this.preventDefaultEvent_(event);

        if (this.adapter.listItemAtIndexHasClass(
                currentIndex, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
          return;
        }

        if (isSpace && this.isTypeaheadInProgress()) {
          // space participates in typeahead matching if in rapid typing mode
          this.typeaheadMatchItem(' ');
        } else {
          if (this.isSelectableList_()) {
            this.setSelectedIndexOnAction_(currentIndex);
          }
          this.adapter.notifyAction(currentIndex);
        }
      }
    } else if (this.hasTypeahead && event.key.length === 1) {
      this.preventDefaultEvent_(event);
      this.typeaheadMatchItem(event.key.toLowerCase());
    }
  }

  /**
   * Click handler for the list.
   */
  handleClick(index: number, toggleCheckbox: boolean) {
    if (index === numbers.UNSET_INDEX) {
      return;
    }

    this.setTabindexAtIndex_(index);
    this.focusedItemIndex_ = index;

    if (this.adapter.listItemAtIndexHasClass(
            index, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
      return;
    }
    if (this.isSelectableList_()) {
      this.setSelectedIndexOnAction_(index, toggleCheckbox);
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
      if (this.wrapFocus_) {
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
      if (this.wrapFocus_) {
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

  /**
   * @param itemIndex Index of the list item
   * @param isEnabled Sets the list item to enabled or disabled.
   */
  setEnabled(itemIndex: number, isEnabled: boolean): void {
    if (!this.isIndexValid_(itemIndex)) {
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

  /**
   * Ensures that preventDefault is only called if the containing element doesn't
   * consume the event, and it will cause an unintended scroll.
   */
  private preventDefaultEvent_(evt: KeyboardEvent) {
    const target = evt.target as Element;
    const tagName = `${target.tagName}`.toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
      evt.preventDefault();
    }
  }

  private setSingleSelectionAtIndex_(index: number) {
    if (this.selectedIndex_ === index) {
      return;
    }

    let selectedClassName = cssClasses.LIST_ITEM_SELECTED_CLASS;
    if (this.useActivatedClass_) {
      selectedClassName = cssClasses.LIST_ITEM_ACTIVATED_CLASS;
    }

    if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
      this.adapter.removeClassForElementIndex(
          this.selectedIndex_ as number, selectedClassName);
    }
    this.adapter.addClassForElementIndex(index, selectedClassName);
    this.setAriaForSingleSelectionAtIndex_(index);

    this.selectedIndex_ = index;
  }

  /**
   * Sets aria attribute for single selection at given index.
   */
  private setAriaForSingleSelectionAtIndex_(index: number) {
    // Detect the presence of aria-current and get the value only during list initialization when it is in unset state.
    if (this.selectedIndex_ === numbers.UNSET_INDEX) {
      this.ariaCurrentAttrValue_ =
          this.adapter.getAttributeForElementIndex(index, strings.ARIA_CURRENT);
    }

    const isAriaCurrent = this.ariaCurrentAttrValue_ !== null;
    const ariaAttribute = isAriaCurrent ? strings.ARIA_CURRENT : strings.ARIA_SELECTED;

    if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
      this.adapter.setAttributeForElementIndex(
          this.selectedIndex_ as number, ariaAttribute, 'false');
    }

    const ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue_ : 'true';
    this.adapter.setAttributeForElementIndex(
        index, ariaAttribute, ariaAttributeValue as string);
  }

  /**
   * Toggles radio at give index. Radio doesn't change the checked state if it is already checked.
   */
  private setRadioAtIndex_(index: number) {
    this.adapter.setCheckedCheckboxOrRadioAtIndex(index, true);

    if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
      this.adapter.setAttributeForElementIndex(
          this.selectedIndex_ as number, strings.ARIA_CHECKED, 'false');
    }

    this.adapter.setAttributeForElementIndex(
        index, strings.ARIA_CHECKED, 'true');

    this.selectedIndex_ = index;
  }

  private setCheckboxAtIndex_(index: number[]) {
    for (let i = 0; i < this.adapter.getListItemCount(); i++) {
      let isChecked = false;
      if (index.indexOf(i) >= 0) {
        isChecked = true;
      }

      this.adapter.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
      this.adapter.setAttributeForElementIndex(
          i, strings.ARIA_CHECKED, isChecked ? 'true' : 'false');
    }

    this.selectedIndex_ = index;
  }

  private setTabindexAtIndex_(index: number) {
    if (this.focusedItemIndex_ === numbers.UNSET_INDEX && index !== 0) {
      // If no list item was selected set first list item's tabindex to -1.
      // Generally, tabindex is set to 0 on first list item of list that has no preselected items.
      this.adapter.setAttributeForElementIndex(0, 'tabindex', '-1');
    } else if (this.focusedItemIndex_ >= 0 && this.focusedItemIndex_ !== index) {
      this.adapter.setAttributeForElementIndex(
          this.focusedItemIndex_, 'tabindex', '-1');
    }

    this.adapter.setAttributeForElementIndex(index, 'tabindex', '0');
  }

  /**
   * @return Return true if it is single selectin list, checkbox list or radio list.
   */
  private isSelectableList_() {
    return this.isSingleSelectionList_ || this.isCheckboxList_ || this.isRadioList_;
  }

  private setTabindexToFirstSelectedItem_() {
    let targetIndex = 0;

    if (this.isSelectableList_()) {
      if (typeof this.selectedIndex_ === 'number' && this.selectedIndex_ !== numbers.UNSET_INDEX) {
        targetIndex = this.selectedIndex_;
      } else if (isNumberArray(this.selectedIndex_) && this.selectedIndex_.length > 0) {
        targetIndex = this.selectedIndex_.reduce((currentIndex, minIndex) => Math.min(currentIndex, minIndex));
      }
    }

    this.setTabindexAtIndex_(targetIndex);
  }

  private isIndexValid_(index: MDCListIndex) {
    if (index instanceof Array) {
      if (!this.isCheckboxList_) {
        throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
      }

      if (index.length === 0) {
        return true;
      } else {
        return index.some((i) => this.isIndexInRange_(i));
      }
    } else if (typeof index === 'number') {
      if (this.isCheckboxList_) {
        throw new Error('MDCListFoundation: Expected array of index for checkbox based list but got number: ' + index);
      }
      return this.isIndexInRange_(index);
    } else {
      return false;
    }
  }

  private isIndexInRange_(index: number) {
    const listSize = this.adapter.getListItemCount();
    return index >= 0 && index < listSize;
  }

  /**
   * Sets selected index on user action, toggles checkbox / radio based on toggleCheckbox value.
   * User interaction should not toggle list item(s) when disabled.
   */
  private setSelectedIndexOnAction_(index: number, toggleCheckbox = true) {
    if (this.isCheckboxList_) {
      this.toggleCheckboxAtIndex_(index, toggleCheckbox);
    } else {
      this.setSelectedIndex(index);
    }
  }

  private toggleCheckboxAtIndex_(index: number, toggleCheckbox: boolean) {
    let isChecked = this.adapter.isCheckboxCheckedAtIndex(index);

    if (toggleCheckbox) {
      isChecked = !isChecked;
      this.adapter.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
    }

    this.adapter.setAttributeForElementIndex(
        index, strings.ARIA_CHECKED, isChecked ? 'true' : 'false');

    // If none of the checkbox items are selected and selectedIndex is not initialized then provide a default value.
    let selectedIndexes = this.selectedIndex_ === numbers.UNSET_INDEX ? [] : (this.selectedIndex_ as number[]).slice();

    if (isChecked) {
      selectedIndexes.push(index);
    } else {
      selectedIndexes = selectedIndexes.filter((i) => i !== index);
    }

    this.selectedIndex_ = selectedIndexes;
  }

  private focusItemAtIndex(index: number) {
    this.setTabindexAtIndex_(index);
    this.adapter.focusItemAtIndex(index);
    this.focusedItemIndex_ = index;
  }

  /**
   * Initializes typeahead state by indexing the current list items by primary
   * text into the sortedIndexByFirstChar data structure.
   */
  private initTypeaheadState() {
    this.sortedIndexByFirstChar.clear();

    // Aggregate item text to index mapping
    for (let i = 0; i < this.adapter.getListItemCount(); i++) {
      const textAtIndex = this.adapter.getPrimaryTextAtIndex(i).trim();
      if (!textAtIndex) {
        continue;
      }

      const firstChar = textAtIndex[0].toLowerCase();
      if (!this.sortedIndexByFirstChar.has(firstChar)) {
        this.sortedIndexByFirstChar.set(firstChar, []);
      }
      this.sortedIndexByFirstChar.get(firstChar)!.push({
        text: this.adapter.getPrimaryTextAtIndex(i).toLowerCase(),
        index: i
      });
    }

    // Sort the mapping
    // TODO(b/157162694): Investigate replacing forEach with Map.values()
    this.sortedIndexByFirstChar.forEach((values) => {
      values.sort((first: MDCListTextAndIndex, second: MDCListTextAndIndex) => {
        return first.index - second.index;
      });
    });
  }

  /**
   * Given the next desired character from the user, adds it to the typeahead
   * buffer; then, beginning from the currently focused option, attempts to
   * find the next option matching the buffer. Wraps around if at the
   * end of options.
   */
  private typeaheadMatchItem(nextChar: string) {
    clearTimeout(this.typeaheadBufferClearTimeout);

    this.typeaheadBufferClearTimeout = setTimeout(() => {
      this.typeaheadBuffer = '';
    }, numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

    this.typeaheadBuffer += nextChar;

    let index: number;
    if (this.typeaheadBuffer.length === 1) {
      index = this.matchFirstChar();
    } else {
      index = this.matchAllChars();
    }

    if (index !== -1) {
      this.focusItemAtIndex(index);
    }
    return index;
  }

  /**
   * Matches the user's single input character in the buffer to the
   * next option that begins with such character. Wraps around if at
   * end of options.
   */
  private matchFirstChar(): number {
    const firstChar = this.typeaheadBuffer[0];
    const itemsMatchingFirstChar = this.sortedIndexByFirstChar.get(firstChar);
    if (!itemsMatchingFirstChar) {
      return -1;
    }

    // Has the same firstChar been recently matched?
    // Also, did focus remain the same between key presses?
    // If both hold true, simply increment index.
    if (firstChar === this.currentFirstChar &&
        itemsMatchingFirstChar[this.sortedIndexCursor].index ===
            this.focusedItemIndex_) {
      this.sortedIndexCursor =
          (this.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;

      return itemsMatchingFirstChar[this.sortedIndexCursor].index;
    }

    // If we're here, either firstChar changed, or focus was moved between
    // keypresses thus invalidating the cursor.
    this.currentFirstChar = firstChar;
    this.sortedIndexCursor = 0;

    // Advance cursor to first item matching the firstChar that is positioned
    // after focused item. Cursor is unchanged if there's no such item.
    for (let cursorPosition = 0; cursorPosition < itemsMatchingFirstChar.length;
         cursorPosition++) {
      if (itemsMatchingFirstChar[cursorPosition].index >
          this.focusedItemIndex_) {
        this.sortedIndexCursor = cursorPosition;
        break;
      }
    }

    return itemsMatchingFirstChar[this.sortedIndexCursor].index;
  }

  /**
   * Attempts to find the next item that matches all of the typeahead buffer.
   * Wraps around if at end of options.
   */
  private matchAllChars(): number {
    const firstChar = this.typeaheadBuffer[0];
    const itemsMatchingFirstChar = this.sortedIndexByFirstChar.get(firstChar);
    if (!itemsMatchingFirstChar) {
      return -1;
    }

    // Do nothing if text already matches
    if (itemsMatchingFirstChar[this.sortedIndexCursor].text.lastIndexOf(
            this.typeaheadBuffer, 0) === 0) {
      return itemsMatchingFirstChar[this.sortedIndexCursor].index;
    }

    // Find next item that matches completely; if no match, we'll eventually
    // loop around to same position
    let cursorPosition =
        (this.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;
    while (cursorPosition !== this.sortedIndexCursor) {
      const matches = itemsMatchingFirstChar[cursorPosition].text.lastIndexOf(
                          this.typeaheadBuffer, 0) === 0;
      if (matches) {
        this.sortedIndexCursor = cursorPosition;
        break;
      }

      cursorPosition = (cursorPosition + 1) % itemsMatchingFirstChar.length;
    }
    return itemsMatchingFirstChar[this.sortedIndexCursor].index;
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCListFoundation;
