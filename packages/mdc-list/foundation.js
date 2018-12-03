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

import MDCFoundation from '@material/base/foundation';
import MDCListAdapter from './adapter';
import {strings, cssClasses, Index} from './constants'; // eslint-disable-line no-unused-vars

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];

class MDCListFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCListAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCListAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCListAdapter} */ ({
      getListItemCount: () => {},
      getFocusedElementIndex: () => {},
      setAttributeForElementIndex: () => {},
      removeAttributeForElementIndex: () => {},
      addClassForElementIndex: () => {},
      removeClassForElementIndex: () => {},
      focusItemAtIndex: () => {},
      setTabIndexForListItemChildren: () => {},
      followHref: () => {},
      hasRadioAtIndex: () => {},
      hasCheckboxAtIndex: () => {},
      isCheckboxCheckedAtIndex: () => {},
      setCheckedCheckboxOrRadioAtIndex: () => {},
      isFocusInsideList: () => {},
    });
  }

  /**
   * @param {!MDCListAdapter=} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCListFoundation.defaultAdapter, adapter));
    /** @private {boolean} */
    this.wrapFocus_ = false;

    /** @private {boolean} */
    this.isVertical_ = true;

    /** @private {boolean} */
    this.isSingleSelectionList_ = false;

    /** @private {!Index} */
    this.selectedIndex_ = -1;

    /** @private {number} */
    this.focusedItemIndex_ = -1;

    /** @private {boolean} */
    this.useActivatedClass_ = false;

    /** @private {boolean} */
    this.programmaticSelection_ = true;

    /** @private {boolean} */
    this.toggleCheckbox_ = true;
  }

  /**
   * Sets the private wrapFocus_ variable.
   * @param {boolean} value
   */
  setWrapFocus(value) {
    this.wrapFocus_ = value;
  }

  /**
   * Sets the isVertical_ private variable.
   * @param {boolean} value
   */
  setVerticalOrientation(value) {
    this.isVertical_ = value;
  }

  /**
   * Sets the isSingleSelectionList_ private variable.
   * @param {boolean} value
   */
  setSingleSelection(value) {
    this.isSingleSelectionList_ = value;
  }

  /**
   * Sets the useActivatedClass_ private variable.
   * @param {boolean} useActivated
   */
  setUseActivatedClass(useActivated) {
    this.useActivatedClass_ = useActivated;
  }

  /** @return {!Index} */
  getSelectedIndex() {
    return this.selectedIndex_;
  }

  /** @param {!Index} index */
  setSelectedIndex(index) {
    if (!this.isIndexValid_(index)) return;

    if (this.hasCheckboxAtIndex_(index)) {
      this.setCheckboxAtIndex_(index);
    } else if (this.adapter_.hasRadioAtIndex(index)) {
      this.setRadioAtIndex_(/** @type {number} */ (index));
    } else {
      this.setSingleSelectionAtIndex_(/** @type {number} */ (index));
    }
  }

  /**
   * Focus in handler for the list items.
   * @param evt
   * @param {number} listItemIndex
   */
  handleFocusIn(evt, listItemIndex) {
    if (listItemIndex >= 0) {
      this.adapter_.setTabIndexForListItemChildren(listItemIndex, 0);
    }
  }

  /**
   * Focus out handler for the list items.
   * @param {Event} evt
   * @param {number} listItemIndex
   */
  handleFocusOut(evt, listItemIndex) {
    if (listItemIndex >= 0) {
      this.adapter_.setTabIndexForListItemChildren(listItemIndex, -1);
    }

    /**
     * Between Focusout & Focusin some browsers do not have focus on any element. Setting a delay to wait till the focus
     * is moved to next element.
     */
    setTimeout(() => {
      if (!this.adapter_.isFocusInsideList()) {
        this.setTabindexToSelectedItem_(listItemIndex);
      }
    }, 0);
  }

  /**
   * Key handler for the list.
   * @param {Event} evt
   * @param {boolean} isRootListItem
   * @param {number} listItemIndex
   */
  handleKeydown(evt, isRootListItem, listItemIndex) {
    const arrowLeft = evt.key === 'ArrowLeft' || evt.keyCode === 37;
    const arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const arrowRight = evt.key === 'ArrowRight' || evt.keyCode === 39;
    const arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
    const isHome = evt.key === 'Home' || evt.keyCode === 36;
    const isEnd = evt.key === 'End' || evt.keyCode === 35;
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;
    const isSpace = evt.key === 'Space' || evt.keyCode === 32;
    this.programmaticSelection_ = false;

    let currentIndex = this.adapter_.getFocusedElementIndex();
    let nextIndex = -1;
    if (currentIndex === -1) {
      currentIndex = listItemIndex;
      if (currentIndex < 0) {
        // If this event doesn't have a mdc-list-item ancestor from the
        // current list (not from a sublist), return early.
        return;
      }
    }

    this.focusedItemIndex_ = currentIndex;

    if ((this.isVertical_ && arrowDown) || (!this.isVertical_ && arrowRight)) {
      this.preventDefaultEvent_(evt);
      nextIndex = this.focusNextElement(currentIndex);
    } else if ((this.isVertical_ && arrowUp) || (!this.isVertical_ && arrowLeft)) {
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
        if (this.isSingleSelectionList_ || this.hasCheckboxOrRadioAtIndex_(listItemIndex)) {
          this.setSelectedIndex(currentIndex);
          this.preventDefaultEvent_(evt);
        }

        // Explicitly activate links, since we're preventing default on Enter, and Space doesn't activate them.
        this.adapter_.followHref(currentIndex);
      }
    }

    if (nextIndex >= 0) {
      this.setTabindexAtIndex_(nextIndex);
      this.focusedItemIndex_ = nextIndex;
    }

    this.programmaticSelection_ = true;
    this.focusedItemIndex_ = currentIndex;
  }

  /**
   * Click handler for the list.
   * @param {number} index
   * @param {boolean} toggleCheckbox
   */
  handleClick(index, toggleCheckbox) {
    if (index === -1) return;

    this.programmaticSelection_ = false;
    this.toggleCheckbox_ = toggleCheckbox;

    if (this.isSingleSelectionList_ || this.hasCheckboxOrRadioAtIndex_(index)) {
      this.setSelectedIndex(index);
    }

    this.setTabindexAtIndex_(index);

    this.programmaticSelection_ = true;
    this.toggleCheckbox_ = true;
    this.focusedItemIndex_ = index;
  }

  /**
   * Ensures that preventDefault is only called if the containing element doesn't
   * consume the event, and it will cause an unintended scroll.
   * @param {Event} evt
   * @private
   */
  preventDefaultEvent_(evt) {
    const tagName = `${evt.target.tagName}`.toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
      evt.preventDefault();
    }
  }

  /**
   * Focuses the next element on the list.
   * @param {number} index
   * @return {number}
   */
  focusNextElement(index) {
    const count = this.adapter_.getListItemCount();
    let nextIndex = index + 1;
    if (nextIndex >= count) {
      if (this.wrapFocus_) {
        nextIndex = 0;
      } else {
        // Return early because last item is already focused.
        return;
      }
    }
    this.adapter_.focusItemAtIndex(nextIndex);

    return nextIndex;
  }

  /**
   * Focuses the previous element on the list.
   * @param {number} index
   * @return {number}
   */
  focusPrevElement(index) {
    let prevIndex = index - 1;
    if (prevIndex < 0) {
      if (this.wrapFocus_) {
        prevIndex = this.adapter_.getListItemCount() - 1;
      } else {
        // Return early because first item is already focused.
        return;
      }
    }
    this.adapter_.focusItemAtIndex(prevIndex);

    return prevIndex;
  }

  /**
   * @return {number}
   */
  focusFirstElement() {
    if (this.adapter_.getListItemCount() > 0) {
      this.adapter_.focusItemAtIndex(0);
      return 0;
    }
  }

  /**
   * @return {number}
   */
  focusLastElement() {
    const lastIndex = this.adapter_.getListItemCount() - 1;
    if (lastIndex >= 0) {
      this.adapter_.focusItemAtIndex(lastIndex);
      return lastIndex;
    }
  }

  /**
   * @param {number} index
   * @private
   */
  setSingleSelectionAtIndex_(index) {
    let selectedClassName = cssClasses.LIST_ITEM_SELECTED_CLASS;
    if (this.useActivatedClass_) {
      selectedClassName = cssClasses.LIST_ITEM_ACTIVATED_CLASS;
    }

    if (this.selectedIndex_ >= 0 && this.selectedIndex_ !== index) {
      this.adapter_.removeClassForElementIndex(this.selectedIndex_, selectedClassName);
      this.adapter_.setAttributeForElementIndex(this.selectedIndex_, strings.ARIA_SELECTED, 'false');
    }

    this.adapter_.addClassForElementIndex(index, selectedClassName);
    this.adapter_.setAttributeForElementIndex(index, strings.ARIA_SELECTED, 'true');

    this.selectedIndex_ = index;
  }

  /**
   * Toggles checkbox or radio at give index. Radio doesn't change the checked state if it is already checked.
   * @param {number} index
   * @private
   */
  setRadioAtIndex_(index) {
    this.adapter_.setCheckedCheckboxOrRadioAtIndex(index, true);

    if (this.selectedIndex_ >= 0) {
      this.adapter_.setAttributeForElementIndex(this.selectedIndex_, strings.ARIA_CHECKED, 'false');
    }

    this.adapter_.setAttributeForElementIndex(index, strings.ARIA_CHECKED, 'true');

    this.selectedIndex_ = index;
  }

  /**
   * @param {!Index} index
   * @private
   */
  setCheckboxAtIndex_(index) {
    if (this.programmaticSelection_) {
      for (let i = 0; i < this.adapter_.getListItemCount(); i++) {
        let isChecked = false;
        if (index.indexOf(i) >= 0) {
          isChecked = true;
        }

        this.adapter_.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
        this.adapter_.setAttributeForElementIndex(i, strings.ARIA_CHECKED, isChecked ? 'true' : 'false');
      }

      this.selectedIndex_ = index;
    } else {
      let isChecked = this.adapter_.isCheckboxCheckedAtIndex(index);
      if (this.toggleCheckbox_) {
        isChecked = !isChecked;
      }
      if (this.toggleCheckbox_) {
        this.adapter_.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
      }

      this.adapter_.setAttributeForElementIndex(index, strings.ARIA_CHECKED, isChecked ? 'true' : 'false');

      if (isChecked) {
        this.selectedIndex_.push(index);
      } else {
        this.selectedIndex_ = this.selectedIndex_.filter((i) => i !== index);
      }
    }
  }

  /**
   * @param {number} index
   * @private
   */
  setTabindexAtIndex_(index) {
    if (this.focusedItemIndex_ === -1 && index !== 0) {
      // If no list item was selected set first list item's tabindex to -1.
      // Generally, tabindex is set to 0 on first list item of list that has no preselected items.
      this.adapter_.setAttributeForElementIndex(0, 'tabindex', -1);
    } else if (this.focusedItemIndex_ >= 0 && this.focusedItemIndex_ !== index) {
      this.adapter_.setAttributeForElementIndex(this.focusedItemIndex_, 'tabindex', -1);
    }

    this.adapter_.setAttributeForElementIndex(index, 'tabindex', 0);
  }

  /**
   * @param {!Index} index
   * @return {boolean}
   * @private
   */
  hasCheckboxAtIndex_(index) {
    if (index instanceof Array) {
      return index.some((i) => this.adapter_.hasCheckboxAtIndex(i));
    } else {
      return this.adapter_.hasCheckboxAtIndex(index);
    }
  }

  /**
   * @param {number} index
   * @return {boolean} Return true if list item contains checkbox or radio input at given index.
   * @private
   */
  hasCheckboxOrRadioAtIndex_(index) {
    return this.adapter_.hasCheckboxAtIndex(index) || this.adapter_.hasRadioAtIndex(index);
  }

  /**
   * @param {number} index
   * @private
   */
  setTabindexToSelectedItem_(index) {
    if (this.isSingleSelectionList_ || this.hasCheckboxOrRadioAtIndex_(index)) {
      let firstSelectedIndex = -1;
      if (typeof this.selectedIndex_ === 'number' && this.selectedIndex_ !== -1) {
        firstSelectedIndex = this.selectedIndex_;
      } else if (this.selectedIndex_ instanceof Array && this.selectedIndex_.length > 0) {
        firstSelectedIndex = this.selectedIndex_[0];
      }

      this.setTabindexAtIndex_(firstSelectedIndex);
    }
  }

  /**
   * @param {!Index} index
   * @return {boolean}
   * @private
   */
  isIndexValid_(index) {
    if (index instanceof Array) {
      const isFirstItemHasCheckbox = this.adapter_.getListItemCount() > 0 && this.adapter_.hasCheckboxAtIndex(0);
      if (index.length === 0 && isFirstItemHasCheckbox) {
        return true;
      }

      if (!this.hasCheckboxAtIndex_(index)) {
        throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
      }
      return index.some((i) => this.isIndexInRange_(i));
    } else if (typeof index === 'number' && index !== -1) {
      if (this.programmaticSelection_ && this.hasCheckboxAtIndex_(index)) {
        throw new Error('MDCListFoundation: Expected array of index for checkbox based list but got number: ' + index);
      }
      return this.isIndexInRange_(index);
    } else {
      return false;
    }
  }

  /**
   * @param {number} index
   * @return {boolean}
   * @private
   */
  isIndexInRange_(index) {
    const listSize = this.adapter_.getListItemCount();
    return index >= 0 && index < listSize;
  }
}

export default MDCListFoundation;
