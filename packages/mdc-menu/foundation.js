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
import {MDCMenuAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';
import MDCListFoundation from '@material/list/foundation';

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select', 'a'];

/**
 * @extends {MDCFoundation<!MDCMenuAdapter>}
 */
class MDCMenuFoundation extends MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{strings} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCMenuAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCMenuAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCMenuAdapter} */ ({
      addClassToElementAtIndex: () => {},
      removeClassFromElementAtIndex: () => {},
      addAttributeToElementAtIndex: () => {},
      removeAttributeFromElementAtIndex: () => {},
      elementContainsClass: () => {},
      closeSurface: () => {},
      getElementIndex: () => {},
      getParentElement: () => {},
      getSelectedElementIndex: () => {},
      notifySelected: () => {},
    });
  }

  /** @param {!MDCMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuFoundation.defaultAdapter, adapter));

    /** @type {number} */
    this.closeAnimationEndTimerId_ = 0;
  }

  destroy() {
    if (this.closeAnimationEndTimerId_) {
      clearTimeout(this.closeAnimationEndTimerId_);
    }

    this.adapter_.closeSurface();
  }

  /**
   * Handler function for the keydown events.
   * @param {!Event} evt
   */
  handleKeydown(evt) {
    const {key, keyCode} = evt;

    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isTab = key === 'Tab' || keyCode === 9;

    if (isSpace || isEnter) {
      this.handleAction_(evt);
    } else if (isTab) {
      this.adapter_.closeSurface();
    }
  }

  /**
   * Handler function for the click events.
   * @param {!Event} evt
   */
  handleClick(evt) {
    this.handleAction_(evt);
  }

  /**
   * Combined action handling for click/keypress events.
   * @param {!Event} evt
   * @private
   */
  handleAction_(evt) {
    const listItem = this.getListItem_(/** @type {HTMLElement} */ (evt.target));
    if (listItem) {
      this.handleSelection(listItem);
      this.preventDefaultEvent_(evt);
    }
  }

  /**
   * Handler for a selected list item.
   * @param {?HTMLElement} listItem
   */
  handleSelection(listItem) {
    const index = this.adapter_.getElementIndex(listItem);
    if (index < 0) {
      return;
    }

    this.adapter_.notifySelected({index});
    this.adapter_.closeSurface();

    // Wait for the menu to close before adding/removing classes that affect styles.
    this.closeAnimationEndTimerId_ = setTimeout(() => {
      const selectionGroup = this.getSelectionGroup_(listItem);

      if (selectionGroup !== null) {
        this.handleSelectionGroup_(/** @type {!HTMLElement} */ (selectionGroup), index);
      }
    }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
  }

  /**
   * Handles toggling the selected classes in a selection group when a
   * selection is made.
   * @param {!HTMLElement} selectionGroup
   * @param {number} index The selected index value
   * @private
   */
  handleSelectionGroup_(selectionGroup, index) {
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
   * @param listItem
   * @return {?HTMLElement} parent selection group element or null.
   * @private
   */
  getSelectionGroup_(listItem) {
    let parent = this.adapter_.getParentElement(listItem);
    let isGroup = this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP);

    // Iterate through ancestors until we find the group or get to the list.
    while (!isGroup && !this.adapter_.elementContainsClass(parent, MDCListFoundation.cssClasses.ROOT)) {
      parent = this.adapter_.getParentElement(parent);
      isGroup = this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP);
    }

    if (isGroup) {
      return parent;
    } else {
      return null;
    }
  }

  /**
   * Find the first ancestor with the mdc-list-item class.
   * @param {?HTMLElement} target
   * @return {?HTMLElement}
   * @private
   */
  getListItem_(target) {
    let isListItem = this.adapter_.elementContainsClass(target, MDCListFoundation.cssClasses.LIST_ITEM_CLASS);

    while (!isListItem) {
      target = this.adapter_.getParentElement(target);
      if (target) {
        isListItem = this.adapter_.elementContainsClass(target, MDCListFoundation.cssClasses.LIST_ITEM_CLASS);
      } else { // target has no parent element.
        return null;
      }
    }

    return target;
  }

  /**
   * Ensures that preventDefault is only called if the containing element doesn't
   * consume the event, and it will cause an unintended scroll.
   * @param {!Event} evt
   * @private
   */
  preventDefaultEvent_(evt) {
    const target = /** @type {!HTMLElement} */ (evt.target);
    const tagName = `${target.tagName}`.toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
      evt.preventDefault();
    }
  }
}

export {MDCMenuFoundation};
