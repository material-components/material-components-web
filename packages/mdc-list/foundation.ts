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
import {MDCListAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';
import {MDCListIndex} from './types';

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

  constructor(adapter?: Partial<MDCListAdapter>) {
    super({...MDCListFoundation.defaultAdapter, ...adapter});
  }

  layout() {
    if (this.adapter_.getListItemCount() === 0) {
      return;
    }

    if (this.adapter_.hasCheckboxAtIndex(0)) {
      this.isCheckboxList_ = true;
    } else if (this.adapter_.hasRadioAtIndex(0)) {
      this.isRadioList_ = true;
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
      this.adapter_.setTabIndexForListItemChildren(listItemIndex, '0');
    }
  }

  /**
   * Focus out handler for the list items.
   */
  handleFocusOut(_: FocusEvent, listItemIndex: number) {
    if (listItemIndex >= 0) {
      this.adapter_.setTabIndexForListItemChildren(listItemIndex, '-1');
    }

    /**
     * Between Focusout & Focusin some browsers do not have focus on any element. Setting a delay to wait till the focus
     * is moved to next element.
     */
    setTimeout(() => {
      if (!this.adapter_.isFocusInsideList()) {
        this.setTabindexToFirstSelectedItem_();
      }
    }, 0);
  }

  /**
   * Key handler for the list.
   */
  handleKeydown(evt: KeyboardEvent, isRootListItem: boolean, listItemIndex: number) {
    const isArrowLeft = evt.key === 'ArrowLeft' || evt.keyCode === 37;
    const isArrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const isArrowRight = evt.key === 'ArrowRight' || evt.keyCode === 39;
    const isArrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
    const isHome = evt.key === 'Home' || evt.keyCode === 36;
    const isEnd = evt.key === 'End' || evt.keyCode === 35;
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;
    const isSpace = evt.key === 'Space' || evt.keyCode === 32;

    if (this.adapter_.isRootFocused()) {
      if (isArrowUp || isEnd) {
        evt.preventDefault();
        this.focusLastElement();
      } else if (isArrowDown || isHome) {
        evt.preventDefault();
        this.focusFirstElement();
      }

      return;
    }

    let currentIndex = this.adapter_.getFocusedElementIndex();
    if (currentIndex === -1) {
      currentIndex = listItemIndex;
      if (currentIndex < 0) {
        // If this event doesn't have a mdc-list-item ancestor from the
        // current list (not from a sublist), return early.
        return;
      }
    }

    let nextIndex;
    if ((this.isVertical_ && isArrowDown) || (!this.isVertical_ && isArrowRight)) {
      this.preventDefaultEvent_(evt);
      nextIndex = this.focusNextElement(currentIndex);
    } else if ((this.isVertical_ && isArrowUp) || (!this.isVertical_ && isArrowLeft)) {
      this.preventDefaultEvent_(evt);
      nextIndex = this.focusPrevElement(currentIndex);
    } else if (isHome) {
      this.preventDefaultEvent_(evt);
      nextIndex = this.focusFirstElement();
    } else if (isEnd) {
      this.preventDefaultEvent_(evt);
      nextIndex = this.focusLastElement();
    } else if (isEnter || isSpace) {
      if (isRootListItem) {
        // Return early if enter key is pressed on anchor element which triggers synthetic MouseEvent event.
        const target = evt.target as Element | null;
        if (target && target.tagName === 'A' && isEnter) {
          return;
        }
        this.preventDefaultEvent_(evt);

        if (this.adapter_.listItemAtIndexHasClass(
                currentIndex, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
          return;
        }
        if (this.isSelectableList_()) {
          this.setSelectedIndexOnAction_(currentIndex);
        }

        this.adapter_.notifyAction(currentIndex);
      }
    }

    this.focusedItemIndex_ = currentIndex;

    if (nextIndex !== undefined) {
      this.setTabindexAtIndex_(nextIndex);
      this.focusedItemIndex_ = nextIndex;
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

    if (this.adapter_.listItemAtIndexHasClass(
            index, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
      return;
    }
    if (this.isSelectableList_()) {
      this.setSelectedIndexOnAction_(index, toggleCheckbox);
    }

    this.adapter_.notifyAction(index);
  }

  /**
   * Focuses the next element on the list.
   */
  focusNextElement(index: number) {
    const count = this.adapter_.getListItemCount();
    let nextIndex = index + 1;
    if (nextIndex >= count) {
      if (this.wrapFocus_) {
        nextIndex = 0;
      } else {
        // Return early because last item is already focused.
        return index;
      }
    }
    this.adapter_.focusItemAtIndex(nextIndex);

    return nextIndex;
  }

  /**
   * Focuses the previous element on the list.
   */
  focusPrevElement(index: number) {
    let prevIndex = index - 1;
    if (prevIndex < 0) {
      if (this.wrapFocus_) {
        prevIndex = this.adapter_.getListItemCount() - 1;
      } else {
        // Return early because first item is already focused.
        return index;
      }
    }
    this.adapter_.focusItemAtIndex(prevIndex);

    return prevIndex;
  }

  focusFirstElement() {
    this.adapter_.focusItemAtIndex(0);
    return 0;
  }

  focusLastElement() {
    const lastIndex = this.adapter_.getListItemCount() - 1;
    this.adapter_.focusItemAtIndex(lastIndex);
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
      this.adapter_.removeClassForElementIndex(itemIndex, cssClasses.LIST_ITEM_DISABLED_CLASS);
      this.adapter_.setAttributeForElementIndex(itemIndex, strings.ARIA_DISABLED, 'false');
    } else {
      this.adapter_.addClassForElementIndex(itemIndex, cssClasses.LIST_ITEM_DISABLED_CLASS);
      this.adapter_.setAttributeForElementIndex(itemIndex, strings.ARIA_DISABLED, 'true');
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
      this.adapter_.removeClassForElementIndex(this.selectedIndex_ as number, selectedClassName);
    }
    this.adapter_.addClassForElementIndex(index, selectedClassName);
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
            this.adapter_.getAttributeForElementIndex(index, strings.ARIA_CURRENT);
    }

    const isAriaCurrent = this.ariaCurrentAttrValue_ !== null;
    const ariaAttribute = isAriaCurrent ? strings.ARIA_CURRENT : strings.ARIA_SELECTED;

    if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
      this.adapter_.setAttributeForElementIndex(this.selectedIndex_ as number, ariaAttribute, 'false');
    }

    const ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue_ : 'true';
    this.adapter_.setAttributeForElementIndex(index, ariaAttribute, ariaAttributeValue as string);
  }

  /**
   * Toggles radio at give index. Radio doesn't change the checked state if it is already checked.
   */
  private setRadioAtIndex_(index: number) {
    this.adapter_.setCheckedCheckboxOrRadioAtIndex(index, true);

    if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
      this.adapter_.setAttributeForElementIndex(this.selectedIndex_ as number, strings.ARIA_CHECKED, 'false');
    }

    this.adapter_.setAttributeForElementIndex(index, strings.ARIA_CHECKED, 'true');

    this.selectedIndex_ = index;
  }

  private setCheckboxAtIndex_(index: number[]) {
    for (let i = 0; i < this.adapter_.getListItemCount(); i++) {
      let isChecked = false;
      if (index.indexOf(i) >= 0) {
        isChecked = true;
      }

      this.adapter_.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
      this.adapter_.setAttributeForElementIndex(i, strings.ARIA_CHECKED, isChecked ? 'true' : 'false');
    }

    this.selectedIndex_ = index;
  }

  private setTabindexAtIndex_(index: number) {
    if (this.focusedItemIndex_ === numbers.UNSET_INDEX && index !== 0) {
      // If no list item was selected set first list item's tabindex to -1.
      // Generally, tabindex is set to 0 on first list item of list that has no preselected items.
      this.adapter_.setAttributeForElementIndex(0, 'tabindex', '-1');
    } else if (this.focusedItemIndex_ >= 0 && this.focusedItemIndex_ !== index) {
      this.adapter_.setAttributeForElementIndex(this.focusedItemIndex_, 'tabindex', '-1');
    }

    this.adapter_.setAttributeForElementIndex(index, 'tabindex', '0');
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
    const listSize = this.adapter_.getListItemCount();
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
    let isChecked = this.adapter_.isCheckboxCheckedAtIndex(index);

    if (toggleCheckbox) {
      isChecked = !isChecked;
      this.adapter_.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
    }

    this.adapter_.setAttributeForElementIndex(index, strings.ARIA_CHECKED, isChecked ? 'true' : 'false');

    // If none of the checkbox items are selected and selectedIndex is not initialized then provide a default value.
    let selectedIndexes = this.selectedIndex_ === numbers.UNSET_INDEX ? [] : (this.selectedIndex_ as number[]).slice();

    if (isChecked) {
      selectedIndexes.push(index);
    } else {
      selectedIndexes = selectedIndexes.filter((i) => i !== index);
    }

    this.selectedIndex_ = selectedIndexes;
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCListFoundation;
