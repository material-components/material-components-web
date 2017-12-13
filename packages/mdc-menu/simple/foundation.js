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

import MDCFoundation from '@material/base/foundation';
import {MDCSimpleMenuAdapter} from './adapter';
import {cssClasses, strings, numbers, Corner, CornerBit} from './constants';
import {clamp, bezierProgress} from '../util';

/**
 * @extends {MDCFoundation<!MDCSimpleMenuAdapter>}
 */
class MDCSimpleMenuFoundation extends MDCFoundation {
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

  /**
   * {@see MDCSimpleMenuAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCSimpleMenuAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSimpleMenuAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => false,
      hasNecessaryDom: () => false,
      getAttributeForEventTarget: () => {},
      eventTargetHasClass: () => {},
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
      getAccurateTime: () => 0,
    });
  }

  /** @param {!MDCSimpleMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCSimpleMenuFoundation.defaultAdapter, adapter));

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
  }

  init() {
    const {ROOT, OPEN} = MDCSimpleMenuFoundation.cssClasses;

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

  /**
   * @param {Corner} corner Default anchor corner alignment of top-left menu corner.
   */
  setAnchorCorner(corner) {
    this.anchorCorner_ = corner;
  }

  /**
   * @param {AnchorMargin} margin 4-plet of margins from anchor.
   */
  setAnchorMargin(margin) {
    this.anchorMargin_ = margin;
  }

  /**
   * @param {?number} focusIndex
   * @private
   */
  focusOnOpen_(focusIndex) {
    if (focusIndex === null) {
      // First, try focusing the menu.
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
   * Handle clicks and cancel the menu if not a list item
   * @param {!Event} evt
   * @private
   */
  handleDocumentClick_(evt) {
    let el = evt.target;

    while (el && el !== document.documentElement) {
      if (this.adapter_.eventTargetHasClass(el, cssClasses.LIST_ITEM)) {
        return;
      }
      el = el.parentNode;
    }

    this.adapter_.notifyCancel();
    this.close(evt);
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
      this.handlePossibleSelected_(evt);
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
      this.adapter_.notifySelected({index: targetIndex});
    }, numbers.SELECTED_TRIGGER_DELAY);
  }


  /**
   * @return {bool} Indicates whether menu can cover the whole anchor (ignoring margins).
   * @private
   */
  canOverlapAnchor_() {
    return this.adapter_.hasAnchor() && !(this.anchorCorner_ & CornerBit.BOTTOM);
  }

  /**
   * Computes the corner of the anchor from which to animate and position the menu.
   * @return {Corner}
   * @private
   */
  getOriginCorner_() {
    // Defaults: open from the top left.
    let corner = Corner.TOP_LEFT;

    const anchorRect = this.adapter_.getAnchorDimensions();
    const windowDimensions = this.adapter_.getWindowDimensions();

    const screenMargin = {top: anchorRect.top, right: windowDimensions.width - anchorRect.right,
      left: anchorRect.left, bottom: windowDimensions.height - anchorRect.bottom};
    const anchorHeight = anchorRect.height;
    const anchorWidth = anchorRect.width;
    const menuHeight = this.dimensions_.height;
    const menuWidth = this.dimensions_.width;

    const bottomAligned = this.anchorCorner_ & CornerBit.BOTTOM;
    const availableTop = bottomAligned ? anchorRect.top + anchorHeight + this.anchorMargin_.bottom
      : screenMargin.top + this.anchorMargin_.top;
    const availableBottom = bottomAligned ? screenMargin.bottom - this.anchorMargin_.bottom
      : screenMargin.bottom + anchorHeight - this.anchorMargin_.bottom;

    const topOverflow = menuHeight - availableTop;
    const bottomOverflow = menuHeight - availableBottom;
    if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
      corner |= CornerBit.BOTTOM;
    }

    const leftAligned = this.adapter_.isRtl() ? (this.anchorCorner_ & CornerBit.FLIP_RTL & CornerBit.RIGHT) :
      (this.anchorCorner_ & ~CornerBit.RIGHT);
    const availableLeft = leftAligned ? screenMargin.left + this.anchorMargin_.left :
      screenMargin.left + anchorWidth + this.anchorMargin_.right;
    const availableRight = leftAligned ? anchorWidth - this.anchorMargin_.left + screenMargin.right :
      screenMargin.right - this.anchorMargin_.right;

    const leftOverflow = menuWidth - availableLeft;
    const rightOverflow = menuWidth - availableRight;
    if (rightOverflow > 0 && leftOverflow < rightOverflow) {
      corner |= CornerBit.RIGHT;
    }

    return corner;
  }

  /**
   * @param {Corner} corner Origin corner of the menu.
   * @return {{x: string, y: string}} Offset from one of the anchor corners to
   *   origin corner of the menu in pixels.
   * @private
   */
  getOffsetOfOriginCorner_(corner) {
    let x = 0;
    let y = 0;
    const canOverlap = this.canOverlapAnchor_();
    const anchorRect = this.adapter_.getAnchorDimensions();
    const windowDimensions = this.adapter_.getWindowDimensions();
    const screenMargin = {top: anchorRect.top, right: windowDimensions.width - anchorRect.right,
      left: anchorRect.left, bottom: windowDimensions.height - anchorRect.bottom};

    const anchorHeight = anchorRect.height;
    const anchorWidth = anchorRect.width;
    const menuHeight = this.dimensions_.height;
    const menuWidth = this.dimensions_.width;

    const verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    const {MARGIN_TO_EDGE} = MDCSimpleMenuFoundation.numbers;

    const canOverlapVertically = !(this.anchorCorner_ & CornerBit.BOTTOM);
    if (verticalAlignment === 'bottom') {
      const bottomOffset = (this.anchorCorner_ & CornerBit.BOTTOM) ?
        anchorRect.height - this.anchorMargin_.top : -this.anchorMargin_.bottom;
      y = bottomOffset;
      // adjust for when menu can overlap anchor, but too tall to be aligned to bottom
      // anchor corner. Bottom margin is ignored in such cases.
      if (canOverlapVertically && menuHeight > screenMargin.top + anchorHeight) {
        y = -(Math.min(menuHeight, windowDimensions.height - MARGIN_TO_EDGE) - (screenMargin.top + anchorHeight));
      }
    } else {
      const topOffset = (this.anchorCorner_ & CornerBit.BOTTOM) ?
        (anchorRect.height + this.anchorMargin_.bottom) : this.anchorMargin_.top;
      y = topOffset;
      // adjust for when menu can overlap anchor, but too tall to be aligned to top
      // anchor corners. Top margin is ignored in that case.
      if (canOverlapVertically && menuHeight > screenMargin.bottom + anchorHeight) {
        y = -(Math.min(menuHeight, windowDimensions.height - MARGIN_TO_EDGE) - (screenMargin.bottom + anchorHeight));
      }
    }

    const horizontalAlignment = (corner & CornerBit.RIGHT) ? 'right' : 'left';
    if (horizontalAlignment === 'right') {
      const rightOffset = (this.anchorCorner_ & CornerBit.RIGHT) ?
        anchorRect.width - this.anchorMargin_.left : this.anchorMargin_.right;
      x = rightOffset;
    } else {
      const leftOffset = (this.anchorCorner_ & CornerBit.RIGHT) ?
        anchorRect.width - this.anchorMargin_.right : this.anchorMargin_.left;
      x = leftOffset;
    }

    return {'x': x ? x + 'px' : x + '', 'y': y ? y + 'px' : y + ''};
  }

  /**
   * @param {Corner} corner Origin corner of the menu.
   * @return {string}
   * @private
   */
  getMenuMaxHeight_(corner) {
    const anchorRect = this.adapter_.getAnchorDimensions();
    const windowDimensions = this.adapter_.getWindowDimensions();
    const screenMargin = {top: anchorRect.top, right: windowDimensions.width - anchorRect.right,
      left: anchorRect.left, bottom: windowDimensions.height - anchorRect.bottom};
    let maxHeight = 0;

    const verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    if (this.anchorCorner_ & CornerBit.BOTTOM) {
      if (verticalAlignment === 'top') {
        maxHeight = screenMargin.bottom - this.anchorMargin_.bottom;
      } else {
        maxHeight = screenMargin.top + this.anchorMargin_.top;
      }
    }
    return maxHeight;
  }

  /** @private */
  autoPosition_() {
    if (!this.adapter_.hasAnchor()) {
      return;
    }

    const corner = this.getOriginCorner_();
    const offsets = this.getOffsetOfOriginCorner_(corner);
    const maxMenuHeight = this.getMenuMaxHeight_(corner);
    const verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    const horizontalAlignment = (corner & CornerBit.RIGHT) ? 'right' : 'left';
    const position = {
      [horizontalAlignment]: offsets.x,
      [verticalAlignment]: offsets.y,
    };

    this.adapter_.setTransformOrigin(`${verticalAlignment} ${horizontalAlignment}`);
    this.adapter_.setPosition(position);
    this.adapter_.setMaxHeight(maxMenuHeight ? maxMenuHeight + 'px' : '');
  }

  /**
   * Open the menu.
   * @param {{focusIndex: ?number}=} options
   */
  open({focusIndex = null} = {}) {
    this.adapter_.saveFocus();
    this.adapter_.addClass(MDCSimpleMenuFoundation.cssClasses.ANIMATING_OPEN);

    this.animationRequestId_ = requestAnimationFrame(() => {
      this.dimensions_ = this.adapter_.getInnerDimensions();
      this.autoPosition_();
      this.adapter_.addClass(MDCSimpleMenuFoundation.cssClasses.OPEN);
      this.focusOnOpen_(focusIndex);
      this.adapter_.registerBodyClickHandler(this.documentClickHandler_);
      this.openAnimationEndTimerId_ = setTimeout(() => {
        this.openAnimationEndTimerId_ = 0;
        this.adapter_.removeClass(MDCSimpleMenuFoundation.cssClasses.ANIMATING_OPEN);
      }, numbers.TRANSITION_OPEN_DURATION);
    });
    this.isOpen_ = true;
  }

  /**
   * Closes the menu.
   * @param {Event=} evt
   */
  close(evt = null) {
    const targetIsDisabled = evt ?
      this.adapter_.getAttributeForEventTarget(evt.target, strings.ARIA_DISABLED_ATTR) === 'true' :
      false;

    if (targetIsDisabled) {
      return;
    }

    this.adapter_.deregisterBodyClickHandler(this.documentClickHandler_);
    this.adapter_.addClass(MDCSimpleMenuFoundation.cssClasses.ANIMATING_CLOSE);
    requestAnimationFrame(() => {
      this.adapter_.removeClass(MDCSimpleMenuFoundation.cssClasses.OPEN);
      this.closeAnimationEndTimerId_ = setTimeout(() => {
        this.closeAnimationEndTimerId_ = 0;
        this.adapter_.removeClass(MDCSimpleMenuFoundation.cssClasses.ANIMATING_CLOSE);
      }, numbers.TRANSITION_CLOSE_DURATION);

    });
    this.isOpen_ = false;
    this.adapter_.restoreFocus();
  }

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }
}

export {MDCSimpleMenuFoundation, AnchorMargin};
