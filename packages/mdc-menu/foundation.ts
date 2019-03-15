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
import {MDCListFoundation} from '@material/list/foundation';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

export class MDCMenuFoundation extends MDCFoundation<MDCMenuAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  private closeAnimationEndTimerId_ = 0;
  private defaultFocusItemIndex_ = numbers.FOCUS_ROOT_INDEX;

  /**
   * @see {@link MDCMenuAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCMenuAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClassToElementAtIndex: () => undefined,
      removeClassFromElementAtIndex: () => undefined,
      addAttributeToElementAtIndex: () => undefined,
      removeAttributeFromElementAtIndex: () => undefined,
      elementContainsClass: () => false,
      closeSurface: () => undefined,
      getElementIndex: () => -1,
      getParentElement: () => null,
      getSelectedElementIndex: () => -1,
      notifySelected: () => undefined,
      getMenuItemCount: () => 0,
      focusItemAtIndex: () => undefined,
      isRootFocused: () => false,
      focusRoot: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  constructor(adapter?: Partial<MDCMenuAdapter>) {
    super({...MDCMenuFoundation.defaultAdapter, ...adapter});
  }

  destroy() {
    if (this.closeAnimationEndTimerId_) {
      clearTimeout(this.closeAnimationEndTimerId_);
    }

    this.adapter_.closeSurface();
  }

  handleKeydown(evt: KeyboardEvent) {
    const {key, keyCode} = evt;
    const isTab = key === 'Tab' || keyCode === 9;

    if (isTab) {
      this.adapter_.closeSurface();
    }

    const arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;

    if (!this.adapter_.isRootFocused()) {
      return;
    }

    if (arrowUp || arrowDown) {
      evt.preventDefault();
      const focusItemIndex = arrowDown ? 0 : (this.adapter_.getMenuItemCount() - 1);
      this.focusItemAtIndex_(focusItemIndex);
    }
  }

  handleItemAction(listItem: Element) {
    const index = this.adapter_.getElementIndex(listItem);
    if (index < 0) {
      return;
    }

    this.adapter_.notifySelected({index});
    this.adapter_.closeSurface();

    // Wait for the menu to close before adding/removing classes that affect styles.
    this.closeAnimationEndTimerId_ = setTimeout(() => {
      const selectionGroup = this.getSelectionGroup_(listItem);
      if (selectionGroup) {
        this.handleSelectionGroup_(selectionGroup, index);
      }
    }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
  }

  handleMenuSurfaceOpened() {
    this.focusItemAtIndex_(this.defaultFocusItemIndex_);
  }

  /**
   * Sets the focus item index where the menu should focus on open. Focuses
   * the menu root element by default.
   */
  setDefaultFocusItemIndex(index: number) {
    const isIndexInRange = index >= 0 && index < this.adapter_.getMenuItemCount();

    if (index === numbers.FOCUS_ROOT_INDEX || isIndexInRange) {
      this.defaultFocusItemIndex_ = index;
    } else {
      throw new Error(`MDCMenuFoundation: Expected index to be in range or ${numbers.FOCUS_ROOT_INDEX} ` +
          `but got: ${index}`);
    }
  }

  private focusItemAtIndex_(index: number) {
    if (index === numbers.FOCUS_ROOT_INDEX) {
      this.adapter_.focusRoot();
    } else {
      this.adapter_.focusItemAtIndex(index);
    }
  }

  /**
   * Handles toggling the selected classes in a selection group when a selection is made.
   */
  private handleSelectionGroup_(selectionGroup: Element, index: number) {
    // De-select the previous selection in this group.
    const selectedIndex = this.adapter_.getSelectedElementIndex(selectionGroup);
    if (selectedIndex >= 0) {
      this.adapter_.removeAttributeFromElementAtIndex(selectedIndex, strings.ARIA_SELECTED_ATTR);
      this.adapter_.removeClassFromElementAtIndex(selectedIndex, cssClasses.MENU_SELECTED_LIST_ITEM);
    }
    // Select the new list item in this group.
    this.adapter_.addClassToElementAtIndex(index, cssClasses.MENU_SELECTED_LIST_ITEM);
    this.adapter_.addAttributeToElementAtIndex(index, strings.ARIA_SELECTED_ATTR, 'true');
  }

  /**
   * Returns the parent selection group of an element if one exists.
   */
  private getSelectionGroup_(listItem: Element): Element | null {
    let parent = this.adapter_.getParentElement(listItem);
    if (!parent) {
      return null;
    }

    let isGroup = this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP);

    // Iterate through ancestors until we find the group or get to the list.
    while (!isGroup && parent && !this.adapter_.elementContainsClass(parent, MDCListFoundation.cssClasses.ROOT)) {
      parent = this.adapter_.getParentElement(parent);
      isGroup = parent ? this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP) : false;
    }

    if (isGroup) {
      return parent;
    } else {
      return null;
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCMenuFoundation;
