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
import {cssClasses as listCssClasses} from '@material/list/constants';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, DefaultFocusState, numbers, strings} from './constants';

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
      notifySelected: () => undefined,	
      getMenuItemCount: () => 0,	
      focusItemAtIndex: () => undefined,	
      focusListRoot: () => undefined,	
      getSelectedSiblingOfItemAtIndex: () => -1,
      isSelectableItemAtIndex: () => false,	
    };	
    // tslint:enable:object-literal-sort-keys
  }

  private closeAnimationEndTimerId_ = 0;
  private defaultFocusState_ = DefaultFocusState.LIST_ROOT;

  destroy() {
    if (this.closeAnimationEndTimerId_) {
      clearTimeout(this.closeAnimationEndTimerId_);
    }

    this.adapter.closeSurface();
  }

  handleKeydown(evt: KeyboardEvent) {
    const {key, keyCode} = evt;
    const isTab = key === 'Tab' || keyCode === 9;

    if (isTab) {
      this.adapter.closeSurface(/** skipRestoreFocus */ true);
    }
  }

  handleItemAction(listItem: Element) {
    const index = this.adapter.getElementIndex(listItem);
    if (index < 0) {
      return;
    }

    this.adapter.notifySelected({index});
    this.adapter.closeSurface();

    // Wait for the menu to close before adding/removing classes that affect styles.
    this.closeAnimationEndTimerId_ = setTimeout(() => {
      // Recompute the index in case the menu contents have changed.
      const recomputedIndex = this.adapter.getElementIndex(listItem);
      if (recomputedIndex >= 0 &&
          this.adapter.isSelectableItemAtIndex(recomputedIndex)) {
        this.setSelectedIndex(recomputedIndex);
      }
    }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
  }

  handleMenuSurfaceOpened() {
    switch (this.defaultFocusState_) {
      case DefaultFocusState.FIRST_ITEM:
        this.adapter.focusItemAtIndex(0);
        break;
      case DefaultFocusState.LAST_ITEM:
        this.adapter.focusItemAtIndex(this.adapter.getMenuItemCount() - 1);
        break;
      case DefaultFocusState.NONE:
        // Do nothing.
        break;
      default:
        this.adapter.focusListRoot();
        break;
    }
  }

  /**
   * Sets default focus state where the menu should focus every time when menu
   * is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by
   * default.
   */
  setDefaultFocusState(focusState: DefaultFocusState) {
    this.defaultFocusState_ = focusState;
  }

  /**
   * Selects the list item at `index` within the menu.
   * @param index Index of list item within the menu.
   */
  setSelectedIndex(index: number) {
    this.validatedIndex_(index);

    if (!this.adapter.isSelectableItemAtIndex(index)) {
      throw new Error('MDCMenuFoundation: No selection group at specified index.');
    }

    const prevSelectedIndex =
        this.adapter.getSelectedSiblingOfItemAtIndex(index);
    if (prevSelectedIndex >= 0) {
      this.adapter.removeAttributeFromElementAtIndex(
          prevSelectedIndex, strings.ARIA_CHECKED_ATTR);
      this.adapter.removeClassFromElementAtIndex(
          prevSelectedIndex, cssClasses.MENU_SELECTED_LIST_ITEM);
    }

    this.adapter.addClassToElementAtIndex(
        index, cssClasses.MENU_SELECTED_LIST_ITEM);
    this.adapter.addAttributeToElementAtIndex(
        index, strings.ARIA_CHECKED_ATTR, 'true');
  }

  /**
   * Sets the enabled state to isEnabled for the menu item at the given index.
   * @param index Index of the menu item
   * @param isEnabled The desired enabled state of the menu item.
   */
  setEnabled(index: number, isEnabled: boolean): void {
    this.validatedIndex_(index);

    if (isEnabled) {
      this.adapter.removeClassFromElementAtIndex(
          index, listCssClasses.LIST_ITEM_DISABLED_CLASS);
      this.adapter.addAttributeToElementAtIndex(
          index, strings.ARIA_DISABLED_ATTR, 'false');
    } else {
      this.adapter.addClassToElementAtIndex(
          index, listCssClasses.LIST_ITEM_DISABLED_CLASS);
      this.adapter.addAttributeToElementAtIndex(
          index, strings.ARIA_DISABLED_ATTR, 'true');
    }
  }

  private validatedIndex_(index: number): void {
    const menuSize = this.adapter.getMenuItemCount();
    const isIndexInRange = index >= 0 && index < menuSize;

    if (!isIndexInRange) {
      throw new Error('MDCMenuFoundation: No list item at specified index.');
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCMenuFoundation;
