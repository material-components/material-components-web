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
 *   surfaceHeight: number,
 *   surfaceWidth: number,
 * }}
 */
let AutoLayoutMeasurements;
/* eslint-enable no-unused-vars */

import MDCFoundation from '@material/base/foundation';
import {MDCMenuSurfaceAdapter} from './adapter';
import {cssClasses, strings, numbers, Corner, CornerBit} from './constants';

const ELEMENTS_SPACE_IS_ALLOWED_IN = ['index', 'button', 'textarea'];

/**
 * @extends {MDCFoundation<!MDCMenuSurfaceAdapter>}
 */
class MDCMenuSurfaceFoundation extends MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{string} */
  static get strings() {
    return strings;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /** @return enum{number} */
  static get Corner() {
    return Corner;
  }

  /**
   * {@see MDCMenuSurfaceAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCMenuSurfaceAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCMenuSurfaceAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => false,
      getAttributeForEventTarget: () => {},
      getIndexForEventTarget: () => {},
      hasAnchor: () => false,
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      registerBodyClickHandler: () => {},
      deregisterBodyClickHandler: () => {},
      notifyClose: () => {},
      isElementInContainer: () => false,
      isRtl: () => false,
      setTransformOrigin: () => {},
      focus: () => {},
      isFocused: () => false,
      saveFocus: () => {},
      restoreFocus: () => {},
      getNumberFocusableElements: () => 0,
      getFocusedElementIndex: () => 0,
      focusElementAtIndex: () => {},
      getInnerDimensions: () => ({}),
      getAnchorDimensions: () => ({}),
      getWindowDimensions: () => ({}),
      setPosition: () => {},
      setMaxHeight: () => {},
    });
  }

  /** @param {!MDCMenuSurfaceAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuSurfaceFoundation.defaultAdapter, adapter));

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
    this.animationRequestId_ = 0;
    /** @private {!{ width: number, height: number }} */
    this.dimensions_;
    /** @private {Corner} */
    this.anchorCorner_ = Corner.TOP_START;
    /** @private {AnchorMargin} */
    this.anchorMargin_ = {top: 0, right: 0, bottom: 0, left: 0};
    /** @private {?AutoLayoutMeasurements} */
    this.measures_ = null;
    /** @private {boolean} */
    this.quickOpen_ = false;

    // A keyup event on the menu surface needs to have a corresponding keydown
    // event on the menu surface. If the user opens the menu surface with a keydown event on a
    // button, the menu surface will only get the key up event causing buggy behavior with selected elements.
    /** @private {boolean} */
    this.keyDownWithinMenu_ = false;
  }

  init() {
    const {ROOT, OPEN} = MDCMenuSurfaceFoundation.cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }

    this.adapter_.registerInteractionHandler('keyup', this.keyupHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
  }

  destroy() {
    clearTimeout(this.openAnimationEndTimerId_);
    clearTimeout(this.closeAnimationEndTimerId_);
    // Cancel any currently running animations.
    cancelAnimationFrame(this.animationRequestId_);
    this.adapter_.deregisterInteractionHandler('keyup', this.keyupHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterBodyClickHandler(this.documentClickHandler_);
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left menu surface corner.
   */
  setAnchorCorner(corner) {
    this.anchorCorner_ = corner;
  }

  /**
   * @param {!AnchorMargin} margin 4-plet of margins from anchor.
   */
  setAnchorMargin(margin) {
    this.anchorMargin_.top = typeof margin.top === 'number' ? margin.top : 0;
    this.anchorMargin_.right = typeof margin.right === 'number' ? margin.right : 0;
    this.anchorMargin_.bottom = typeof margin.bottom === 'number' ? margin.bottom : 0;
    this.anchorMargin_.left = typeof margin.left === 'number' ? margin.left : 0;
  }

  /** @param {boolean} quickOpen */
  setQuickOpen(quickOpen) {
    this.quickOpen_ = quickOpen;
  }

  /**
   * @param {?number} focusIndex
   * @private
   */
  focusOnOpen_(focusIndex) {
    if (focusIndex === null) {
      this.adapter_.focus();
      // If that doesn't work, focus first focusable element instead.
      if (!this.adapter_.isFocused()) {
        this.adapter_.focusElementAtIndex(0);
      }
    } else {
      this.adapter_.focusElementAtIndex(focusIndex);
    }
  }

  /**
   * Handle clicks and close if not within menu-surface element.
   * @param {!Event} evt
   * @private
   */
  handleDocumentClick_(evt) {
    const el = evt.target;

    if (this.adapter_.isElementInContainer(el)) {
      return;
    }

    this.close();
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
    const isArrowLeft = key === 'ArrowLeft' || keyCode === 37;
    const isArrowUp = key === 'ArrowUp' || keyCode === 38;
    const isArrowRight = key === 'ArrowRight' || keyCode === 39;
    const isArrowDown = key === 'ArrowDown' || keyCode === 40;
    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    // The menu surface needs to know if the keydown event was triggered on the menu surface.
    this.keyDownWithinMenu_ = isEnter || isSpace;

    const focusedItemIndex = this.adapter_.getFocusedElementIndex();
    const lastItemIndex = this.adapter_.getNumberFocusableElements() - 1;

    // Ensure Arrow keys and space do not cause inadvertent scrolling.
    if (isArrowUp || isArrowDown || isArrowLeft || isArrowRight || isTab) {
      evt.preventDefault();
    } else if (isSpace && this.isSpaceKeyAllowedOnTarget_(evt)) {
      evt.preventDefault();
    }

    if (isArrowUp || (isTab && shiftKey)) {
      if (focusedItemIndex === 0 || this.adapter_.isFocused()) {
        this.adapter_.focusElementAtIndex(lastItemIndex);
      } else {
        this.adapter_.focusElementAtIndex(focusedItemIndex - 1);
      }
    } else if (isArrowDown || (isTab && !shiftKey)) {
      if (focusedItemIndex === lastItemIndex || this.adapter_.isFocused()) {
        this.adapter_.focusElementAtIndex(0);
      } else {
        this.adapter_.focusElementAtIndex(focusedItemIndex + 1);
      }
    }

    return true;
  }

  /**
   * Returns true if the event will cause a scroll event.
   * @param evt
   * @return {boolean}
   * @private
   */
  isSpaceKeyAllowedOnTarget_(evt) {
    const tagName = ('' + evt.target.tagName).toLowerCase();

    return ELEMENTS_SPACE_IS_ALLOWED_IN.indexOf(tagName) === -1;
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
    const isEscape = key === 'Escape' || keyCode === 27;

    if (isEscape) {
      this.close();
    }

    return true;
  }

  /**
   * @return {AutoLayoutMeasurements} Measurements used to position menu surface popup.
   */
  getAutoLayoutMeasurements_() {
    const anchorRect = this.adapter_.getAnchorDimensions();
    const viewport = this.adapter_.getWindowDimensions();

    return {
      viewport: viewport,
      viewportDistance: {
        top: anchorRect.top,
        right: viewport.width - anchorRect.right,
        left: anchorRect.left,
        bottom: viewport.height - anchorRect.bottom,
      },
      anchorHeight: anchorRect.height,
      anchorWidth: anchorRect.width,
      surfaceHeight: this.dimensions_.height,
      surfaceWidth: this.dimensions_.width,
    };
  }

  /**
   * Computes the corner of the anchor from which to animate and position the menu surface.
   * @return {Corner}
   * @private
   */
  getOriginCorner_() {
    // Defaults: open from the top left.
    let corner = Corner.TOP_LEFT;

    const {viewportDistance, anchorHeight, anchorWidth, surfaceHeight, surfaceWidth} = this.measures_;
    const isBottomAligned = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    const availableTop = isBottomAligned ? viewportDistance.top + anchorHeight + this.anchorMargin_.bottom
      : viewportDistance.top + this.anchorMargin_.top;
    const availableBottom = isBottomAligned ? viewportDistance.bottom - this.anchorMargin_.bottom
      : viewportDistance.bottom + anchorHeight - this.anchorMargin_.top;

    const topOverflow = surfaceHeight - availableTop;
    const bottomOverflow = surfaceHeight - availableBottom;
    if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
      corner |= CornerBit.BOTTOM;
    }

    const isRtl = this.adapter_.isRtl();
    const isFlipRtl = Boolean(this.anchorCorner_ & CornerBit.FLIP_RTL);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);
    const isAlignedRight = (avoidHorizontalOverlap && !isRtl) ||
      (!avoidHorizontalOverlap && isFlipRtl && isRtl);
    const availableLeft = isAlignedRight ? viewportDistance.left + anchorWidth + this.anchorMargin_.right :
      viewportDistance.left + this.anchorMargin_.left;
    const availableRight = isAlignedRight ? viewportDistance.right - this.anchorMargin_.right :
      viewportDistance.right + anchorWidth - this.anchorMargin_.left;

    const leftOverflow = surfaceWidth - availableLeft;
    const rightOverflow = surfaceWidth - availableRight;

    if ((leftOverflow < 0 && isAlignedRight && isRtl) ||
        (avoidHorizontalOverlap && !isAlignedRight && leftOverflow < 0) ||
        (rightOverflow > 0 && leftOverflow < rightOverflow)) {
      corner |= CornerBit.RIGHT;
    }

    return corner;
  }

  /**
   * @param {Corner} corner Origin corner of the menu surface.
   * @return {number} Horizontal offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getHorizontalOriginOffset_(corner) {
    const {anchorWidth} = this.measures_;
    const isRightAligned = Boolean(corner & CornerBit.RIGHT);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);
    let x = 0;
    if (isRightAligned) {
      const rightOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.left : this.anchorMargin_.right;
      x = rightOffset;
    } else {
      const leftOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.right : this.anchorMargin_.left;
      x = leftOffset;
    }
    return x;
  }

  /**
   * @param {Corner} corner Origin corner of the menu surface.
   * @return {number} Vertical offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getVerticalOriginOffset_(corner) {
    const {viewport, viewportDistance, anchorHeight, surfaceHeight} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;
    const avoidVerticalOverlap = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    const canOverlapVertically = !avoidVerticalOverlap;
    let y = 0;

    if (isBottomAligned) {
      y = avoidVerticalOverlap ? anchorHeight - this.anchorMargin_.top : -this.anchorMargin_.bottom;
      // adjust for when menu surface can overlap anchor, but too tall to be aligned to bottom
      // anchor corner. Bottom margin is ignored in such cases.
      if (canOverlapVertically && surfaceHeight > viewportDistance.top + anchorHeight) {
        y = -(Math.min(surfaceHeight, viewport.height - MARGIN_TO_EDGE) - (viewportDistance.top + anchorHeight));
      }
    } else {
      y = avoidVerticalOverlap ? (anchorHeight + this.anchorMargin_.bottom) : this.anchorMargin_.top;
      // adjust for when menu surface can overlap anchor, but too tall to be aligned to top
      // anchor corners. Top margin is ignored in that case.
      if (canOverlapVertically && surfaceHeight > viewportDistance.bottom + anchorHeight) {
        y = -(Math.min(surfaceHeight, viewport.height - MARGIN_TO_EDGE) - (viewportDistance.bottom + anchorHeight));
      }
    }
    return y;
  }

  /**
   * @param {Corner} corner Origin corner of the menu surface.
   * @return {number} Maximum height of the menu surface, based on available space. 0 indicates should not be set.
   * @private
   */
  getMenuSurfaceMaxHeight_(corner) {
    let maxHeight = 0;
    const {viewportDistance} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);

    // When maximum height is not specified, it is handled from css.
    if (this.anchorCorner_ & CornerBit.BOTTOM) {
      if (isBottomAligned) {
        maxHeight = viewportDistance.top + this.anchorMargin_.top;
      } else {
        maxHeight = viewportDistance.bottom - this.anchorMargin_.bottom;
      }
    }

    return maxHeight;
  }

  /** @private */
  autoPosition_() {
    if (!this.adapter_.hasAnchor()) {
      return;
    }

    // Compute measurements for autoposition methods reuse.
    this.measures_ = this.getAutoLayoutMeasurements_();

    const corner = this.getOriginCorner_();
    const maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight_(corner);
    let verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment = (corner & CornerBit.RIGHT) ? 'right' : 'left';
    const horizontalOffset = this.getHorizontalOriginOffset_(corner);
    const verticalOffset = this.getVerticalOriginOffset_(corner);
    const position = {
      [horizontalAlignment]: horizontalOffset ? horizontalOffset + 'px' : '0',
      [verticalAlignment]: verticalOffset ? verticalOffset + 'px' : '0',
    };
    const {anchorWidth, surfaceHeight, surfaceWidth} = this.measures_;
    // Center align when anchor width is comparable or greater than menu surface, otherwise keep corner.
    if (anchorWidth / surfaceWidth > numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
      horizontalAlignment = 'center';
    }

    // Adjust vertical origin when menu surface is positioned with significant offset from anchor. This is done so that
    // scale animation is "anchored" on the anchor.
    if (!(this.anchorCorner_ & CornerBit.BOTTOM) &&
        Math.abs(verticalOffset / surfaceHeight) > numbers.OFFSET_TO_MENU_SURFACE_HEIGHT_RATIO) {
      const verticalOffsetPercent = Math.abs(verticalOffset / surfaceHeight) * 100;
      const originPercent = (corner & CornerBit.BOTTOM) ? 100 - verticalOffsetPercent : verticalOffsetPercent;
      verticalAlignment = Math.round(originPercent * 100) / 100 + '%';
    }

    this.adapter_.setTransformOrigin(`${horizontalAlignment} ${verticalAlignment}`);
    this.adapter_.setPosition(position);
    this.adapter_.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');

    // Clear measures after positioning is complete.
    this.measures_ = null;
  }

  /**
   * Open the menu surface.
   * @param {{focusIndex: ?number}=} options
   */
  open({focusIndex = null} = {}) {
    this.adapter_.saveFocus();

    if (!this.quickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
    }

    this.animationRequestId_ = requestAnimationFrame(() => {
      this.dimensions_ = this.adapter_.getInnerDimensions();
      this.autoPosition_();
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.focusOnOpen_(focusIndex);
      this.adapter_.registerBodyClickHandler(this.documentClickHandler_);
      if (!this.quickOpen_) {
        this.openAnimationEndTimerId_ = setTimeout(() => {
          this.openAnimationEndTimerId_ = 0;
          this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
        }, numbers.TRANSITION_OPEN_DURATION);
      }
    });
    this.isOpen_ = true;
  }

  /**
   * Closes the menu surface.
   */
  close() {
    this.adapter_.deregisterBodyClickHandler(this.documentClickHandler_);

    if (!this.quickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
    }

    requestAnimationFrame(() => {
      this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      if (!this.quickOpen_) {
        this.closeAnimationEndTimerId_ = setTimeout(() => {
          this.closeAnimationEndTimerId_ = 0;
          this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
          this.adapter_.notifyClose();
        }, numbers.TRANSITION_CLOSE_DURATION);
      }
    });

    this.isOpen_ = false;
    this.shouldRestoreFocus_();
  }

  /**
   * If the user is focused on or within the menu surface when it is closed, the last focused
   * element when the menu surface was opened is focused.
   * @private
   */
  shouldRestoreFocus_() {
    if (this.adapter_.isFocused() || this.adapter_.isElementInContainer(document.activeElement)) {
      this.adapter_.restoreFocus();
    }
  }

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }
}

export {MDCMenuSurfaceFoundation, AnchorMargin};
