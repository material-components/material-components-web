/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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

/**
 * @typedef {{
 *   top: number,
 *   right: number,
 *   bottom: number,
 *   left: number
 * }}
 */
let AnchorMargin;

/* eslint-disable no-unused-vars */
/**
 * @typedef {{
 *   viewport: { width: number, height: number },
 *   viewportDistance: {top: number, right: number, bottom: number, left: number},
 *   anchorHeight: number,
 *   anchorWidth: number,
 *   menuHeight: number,
 *   menuWidth: number,
 * }}
 */
let AutoLayoutMeasurements;
/* eslint-enable no-unused-vars */

import MDCFoundation from '@material/base/foundation';
import {MDCMenuAdapter} from './adapter';
import {cssClasses, strings, numbers, Corner, CornerBit} from './constants';

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

  /** @return enum{numbers} */
  static get numbers() {
    return numbers;
  }

  /** @return enum{number} */
  static get Corner() {
    return Corner;
  }

  /**
   * {@see MDCMenuAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCMenuAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCMenuAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => false,
      hasNecessaryDom: () => false,
      getAttributeForEventTarget: () => {},
      getInnerDimensions: () => ({}),
      hasAnchor: () => false,
      getAnchorDimensions: () => ({}),
      getWindowDimensions: () => ({}),
      getNumberOfItems: () => 0,
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      registerBodyClickHandler: () => {},
      deregisterBodyClickHandler: () => {},
      getIndexForEventTarget: () => 0,
      notifySelected: () => {},
      notifyCancel: () => {},
      saveFocus: () => {},
      restoreFocus: () => {},
      isFocused: () => false,
      focus: () => {},
      getFocusedItemIndex: () => -1,
      focusItemAtIndex: () => {},
      isRtl: () => false,
      setTransformOrigin: () => {},
      setPosition: () => {},
      setMaxHeight: () => {},
      setAttrForOptionAtIndex: () => {},
      rmAttrForOptionAtIndex: () => {},
      addClassForOptionAtIndex: () => {},
      rmClassForOptionAtIndex: () => {},
    });
  }

  /** @param {!MDCMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuFoundation.defaultAdapter, adapter));

    /** @private {function(!Event)} */
    this.clickHandler_ = (evt) => this.handlePossibleSelected_(evt);
    /** @private {function(!Event)} */
    this.keydownHandler_ = (evt) => this.handleKeyboardDown_(evt);
    /** @private {function(!Event)} */
    this.keyupHandler_ = (evt) => this.handleKeyboardUp_(evt);
    /** @private {function(!Event)} */
    this.documentClickHandler_ = (evt) => this.handleDocumentClick_(evt);
    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {number} */
    this.openAnimationEndTimerId_ = 0;
    /** @private {number} */
    this.closeAnimationEndTimerId_ = 0;
    /** @private {number} */
    this.selectedTriggerTimerId_ = 0;
    /** @private {number} */
    this.animationRequestId_ = 0;
    /** @private {!{ width: number, height: number }} */
    this.dimensions_;
    /** @private {number} */
    this.itemHeight_;
    /** @private {Corner} */
    this.anchorCorner_ = Corner.TOP_START;
    /** @private {AnchorMargin} */
    this.anchorMargin_ = {top: 0, right: 0, bottom: 0, left: 0};
    /** @private {?AutoLayoutMeasurements} */
    this.measures_ = null;
    /** @private {number} */
    this.selectedIndex_ = -1;
    /** @private {boolean} */
    this.rememberSelection_ = false;
    /** @private {boolean} */
    this.quickOpen_ = false;

    // A keyup event on the menu needs to have a corresponding keydown
    // event on the menu. If the user opens the menu with a keydown event on a
    // button, the menu will only get the key up event causing buggy behavior with selected elements.
    /** @private {boolean} */
    this.keyDownWithinMenu_ = false;
  }

  init() {
    const {ROOT, OPEN} = MDCMenuFoundation.cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }

    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerInteractionHandler('keyup', this.keyupHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
  }

  destroy() {
    clearTimeout(this.selectedTriggerTimerId_);
    clearTimeout(this.openAnimationEndTimerId_);
    clearTimeout(this.closeAnimationEndTimerId_);
    // Cancel any currently running animations.
    cancelAnimationFrame(this.animationRequestId_);
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    this.adapter_.deregisterInteractionHandler('keyup', this.keyupHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterBodyClickHandler(this.documentClickHandler_);
  }

  /** @param {boolean} rememberSelection */
  setRememberSelection(rememberSelection) {
    this.rememberSelection_ = rememberSelection;
    this.setSelectedIndex(-1);
  }

  /**
   * @param {?number} focusIndex
   * @private
   */
  focusOnOpen_(focusIndex) {
    if (focusIndex === null) {
      // If this instance of MDCMenu remembers selections, and the user has
      // made a selection, then focus the last selected item
      if (this.rememberSelection_ && this.selectedIndex_ >= 0) {
        this.adapter_.focusItemAtIndex(this.selectedIndex_);
        return;
      }

      this.adapter_.focus();
      // If that doesn't work, focus first item instead.
      if (!this.adapter_.isFocused()) {
        this.adapter_.focusItemAtIndex(0);
      }
    } else {
      this.adapter_.focusItemAtIndex(focusIndex);
    }
  }

  /**
   * Handle clicks and cancel the menu if not a child list-item
   * @param {!Event} evt
   * @private
   */
  handleDocumentClick_(evt) {
    let el = evt.target;

    while (el && el !== document.documentElement) {
      if (this.adapter_.getIndexForEventTarget(el) !== -1) {
        return;
      }
      el = el.parentNode;
    }
  };

  /**
   * Handle keys that we want to repeat on hold (tab and arrows).
   * @param {!Event} evt
   * @return {boolean}
   * @private
   */
  handleKeyboardDown_(evt) {
    // Do nothing if Alt, Ctrl or Meta are pressed.
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
      return true;
    }

    const {keyCode, key, shiftKey} = evt;
    const isTab = key === 'Tab' || keyCode === 9;
    const isArrowUp = key === 'ArrowUp' || keyCode === 38;
    const isArrowDown = key === 'ArrowDown' || keyCode === 40;
    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    // The menu needs to know if the keydown event was triggered on the menu
    this.keyDownWithinMenu_ = isEnter || isSpace;

    const focusedItemIndex = this.adapter_.getFocusedItemIndex();
    const lastItemIndex = this.adapter_.getNumberOfItems() - 1;

    if (shiftKey && isTab && focusedItemIndex === 0) {
      this.adapter_.focusItemAtIndex(lastItemIndex);
      evt.preventDefault();
      return false;
    }

    if (!shiftKey && isTab && focusedItemIndex === lastItemIndex) {
      this.adapter_.focusItemAtIndex(0);
      evt.preventDefault();
      return false;
    }

    // Ensure Arrow{Up,Down} and space do not cause inadvertent scrolling
    if (isArrowUp || isArrowDown || isSpace) {
      evt.preventDefault();
    }

    if (isArrowUp) {
      if (focusedItemIndex === 0 || this.adapter_.isFocused()) {
        this.adapter_.focusItemAtIndex(lastItemIndex);
      } else {
        this.adapter_.focusItemAtIndex(focusedItemIndex - 1);
      }
    } else if (isArrowDown) {
      if (focusedItemIndex === lastItemIndex || this.adapter_.isFocused()) {
        this.adapter_.focusItemAtIndex(0);
      } else {
        this.adapter_.focusItemAtIndex(focusedItemIndex + 1);
      }
    }

    return true;
  }

  /**
   * Handle keys that we don't want to repeat on hold (Enter, Space, Escape).
   * @param {!Event} evt
   * @return {boolean}
   * @private
   */
  handleKeyboardUp_(evt) {
    // Do nothing if Alt, Ctrl or Meta are pressed.
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
      return true;
    }

    const {keyCode, key} = evt;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isSpace = key === 'Space' || keyCode === 32;
    const isEscape = key === 'Escape' || keyCode === 27;

    if (isEnter || isSpace) {
      // If the keydown event didn't occur on the menu, then it should
      // disregard the possible selected event.
      if (this.keyDownWithinMenu_) {
        this.handlePossibleSelected_(evt);
      }
      this.keyDownWithinMenu_ = false;
    }

    if (isEscape) {
      this.adapter_.notifyCancel();
      this.close();
    }

    return true;
  }

  /**
   * @param {!Event} evt
   * @private
   */
  handlePossibleSelected_(evt) {
    if (this.adapter_.getAttributeForEventTarget(evt.target, strings.ARIA_DISABLED_ATTR) === 'true') {
      return;
    }
    const targetIndex = this.adapter_.getIndexForEventTarget(evt.target);
    if (targetIndex < 0) {
      return;
    }
    // Debounce multiple selections
    if (this.selectedTriggerTimerId_) {
      return;
    }
    this.selectedTriggerTimerId_ = setTimeout(() => {
      this.selectedTriggerTimerId_ = 0;
      this.close();
      if (this.rememberSelection_) {
        this.setSelectedIndex(targetIndex);
      }
      this.adapter_.notifySelected({index: targetIndex});
    }, numbers.SELECTED_TRIGGER_DELAY);
  }

  /** @return {number} */
  getSelectedIndex() {
    return this.selectedIndex_;
  }

  /**
   * @param {number} index Index of the item to set as selected.
   */
  setSelectedIndex(index) {
    if (index === this.selectedIndex_) {
      return;
    }

    const prevSelectedIndex = this.selectedIndex_;
    if (prevSelectedIndex >= 0) {
      this.adapter_.rmAttrForOptionAtIndex(prevSelectedIndex, 'aria-selected');
      this.adapter_.rmClassForOptionAtIndex(prevSelectedIndex, cssClasses.SELECTED_LIST_ITEM);
    }

    this.selectedIndex_ = index >= 0 && index < this.adapter_.getNumberOfItems() ? index : -1;
    if (this.selectedIndex_ >= 0) {
      this.adapter_.setAttrForOptionAtIndex(this.selectedIndex_, 'aria-selected', 'true');
      this.adapter_.addClassForOptionAtIndex(this.selectedIndex_, cssClasses.SELECTED_LIST_ITEM);
    }
  }
}

export {MDCMenuFoundation, AnchorMargin};
