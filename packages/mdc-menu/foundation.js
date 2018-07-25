/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCFoundation from '@material/base/foundation';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/foundation';

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];

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
      closeSurface: () => {},
      getElementIndex: () => {},
      getParentElement: () => {},
      notifySelected: () => {},
      toggleCheckbox: () => {},
    });
  }

  /** @param {!MDCMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuFoundation.defaultAdapter, adapter));

    /** @param {number} value */
    this.closeAnimationEndTimerId_;
  }

  init() {}

  destroy() {
    clearTimeout(this.closeAnimationEndTimerId_);
  }

  /**
   * Handler function for the keydown event.
   * @param {Event} evt
   */
  handleKeydown(evt) {
    const {key, keyCode} = evt;

    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isTab = key === 'Tab' || keyCode === 13;

    if (isSpace || isEnter) {
      this.handleClick(evt);
    } else if (isTab) {
      this.adapter_.closeSurface();
    }
  }

  /**
   * Handler function for the click and space/enter key events.
   * @param {Event} evt
   */
  handleClick(evt) {
    const listItem = this.getListItem_(evt.target);
    if (listItem) {
      this.handleSelection_(listItem);
      this.preventDefaultEvent_(evt);
      this.adapter_.toggleCheckbox(evt.target);
    }
  }

  handleSelection_(listItem) {
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
        this.handleSelectionGroup_(selectionGroup, index);
      }
    }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
  }

  /**
   * Handles toggling the selected classes in a selection group when a
   * selection is made.
   * @param {Element} selectionGroup
   * @param {number} index The selected index value
   * @private
   */
  handleSelectionGroup_(selectionGroup, index) {
    if (selectionGroup !== null) {
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
  }

  /**
   * Returns the parent selection group of an element or the
   * @param listItem
   * @return {*}
   * @private
   */
  getSelectionGroup_(listItem) {
    let parent = this.adapter_.getParentElement(listItem);
    let isGroup = this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP);
    // Iterate through ancestors until we find the group or get to the list.
    while (!isGroup && !this.adapter_.elementContainsClass(parent, cssClasses.LIST_CLASS)) {
      parent = this.adapter_.getParentElement(listItem);
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
   * @param {Element} target
   * @return {Element|null}
   * @private
   */
  getListItem_(target) {
    let isListItem = this.adapter_.elementContainsClass(target, cssClasses.LIST_ITEM_CLASS);

    while (!isListItem) {
      target = this.adapter_.getParentElement(target);
      if (target) {
        isListItem = this.adapter_.elementContainsClass(target, cssClasses.LIST_ITEM_CLASS);
      } else { // target has no parent element.
        return null;
      }
    }

    return target;
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
}

export {MDCMenuFoundation};
