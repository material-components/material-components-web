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
import {cssClasses, strings, numbers, MenuSurfaceCorner, MenuSurfaceCornerBit} from './constants';

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
  static get MenuSurfaceCorner() {
    return MenuSurfaceCorner;
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
      hasAnchor: () => false,
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      registerBodyClickHandler: () => {},
      deregisterBodyClickHandler: () => {},
      notifyClose: () => {},
      isElementInContainer: () => false,
      isRtl: () => false,
      setTransformOrigin: () => {},
      isFocused: () => false,
      saveFocus: () => {},
      restoreFocus: () => {},
      isFirstElementFocused: () => {},
      isLastElementFocused: () => {},
      focusFirstElement: () => {},
      focusLastElement: () => {},
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
    this.keydownHandler_ = (evt) => this.handleKeyboardDown(evt);
    /** @private {function(!Event)} */
    this.documentClickHandler_ = (evt) => this.handleDocumentClick(evt);
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
    /** @private {MenuSurfaceCorner} */
    this.anchorCorner_ = MenuSurfaceCorner.TOP_START;
    /** @private {AnchorMargin} */
    this.anchorMargin_ = {top: 0, right: 0, bottom: 0, left: 0};
    /** @private {?AutoLayoutMeasurements} */
    this.measures_ = null;
    /** @private {boolean} */
    this.quickOpen_ = false;
  }

  init() {
    const {ROOT, OPEN} = MDCMenuSurfaceFoundation.cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }

    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
  }

  destroy() {
    clearTimeout(this.openAnimationEndTimerId_);
    clearTimeout(this.closeAnimationEndTimerId_);
    // Cancel any currently running animations.
    cancelAnimationFrame(this.animationRequestId_);
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterBodyClickHandler(this.documentClickHandler_);
  }

  /**
   * @param {!MenuSurfaceCorner} corner Default anchor corner alignment of top-left menu surface corner.
   */
  setAnchorCorner(corner) {
    this.anchorCorner_ = corner;
  }

  /**
   * @param {!AnchorMargin} margin set of margin values from anchor.
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
   * Handle clicks and close if not within menu-surface element.
   * @param {!Event} evt
   * @private
   */
  handleDocumentClick(evt) {
    const el = evt.target;

    if (this.adapter_.isElementInContainer(el)) {
      return;
    }

    this.close();
  };

  /**
   * Handle keys that close the surface.
   * @param {!Event} evt
   * @private
   */
  handleKeyboardDown(evt) {
    const {keyCode, key, shiftKey} = evt;

    const isEscape = key === 'Escape' || keyCode === 27;
    const isTab = key === 'Tab' || keyCode === 9;

    if (isEscape) {
      this.close();
    } else if (isTab) {
      if (this.adapter_.isLastElementFocused() && !shiftKey) {
        this.adapter_.focusFirstElement();
        evt.preventDefault();
      } else if (this.adapter_.isFirstElementFocused() && shiftKey) {
        this.adapter_.focusLastElement();
        evt.preventDefault();
      }
    }
  }

  /**
   * @return {AutoLayoutMeasurements} Measurements used to position menu surface popup.
   */
  getAutoLayoutMeasurements_() {
    const anchorRect = this.adapter_.getAnchorDimensions();
    const viewport = this.adapter_.getWindowDimensions();

    return {
      viewport,
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
   * @return {MenuSurfaceCorner}
   * @private
   */
  getOriginCorner_() {
    // Defaults: open from the top left.
    let corner = MenuSurfaceCorner.TOP_LEFT;

    const {viewportDistance, anchorHeight, anchorWidth, surfaceHeight, surfaceWidth} = this.measures_;
    const isBottomAligned = Boolean(this.anchorCorner_ & MenuSurfaceCornerBit.BOTTOM);
    const availableTop = isBottomAligned ? viewportDistance.top + anchorHeight + this.anchorMargin_.bottom
      : viewportDistance.top + this.anchorMargin_.top;
    const availableBottom = isBottomAligned ? viewportDistance.bottom - this.anchorMargin_.bottom
      : viewportDistance.bottom + anchorHeight - this.anchorMargin_.top;

    const topOverflow = surfaceHeight - availableTop;
    const bottomOverflow = surfaceHeight - availableBottom;
    if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
      corner |= MenuSurfaceCornerBit.BOTTOM;
    }

    const isRtl = this.adapter_.isRtl();
    const isFlipRtl = Boolean(this.anchorCorner_ & MenuSurfaceCornerBit.FLIP_RTL);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & MenuSurfaceCornerBit.RIGHT);
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
      corner |= MenuSurfaceCornerBit.RIGHT;
    }

    return corner;
  }

  /**
   * @param {MenuSurfaceCorner} corner Origin corner of the menu surface.
   * @return {number} Horizontal offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getHorizontalOriginOffset_(corner) {
    const {anchorWidth} = this.measures_;
    const isRightAligned = Boolean(corner & MenuSurfaceCornerBit.RIGHT);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & MenuSurfaceCornerBit.RIGHT);
    if (isRightAligned) {
      const rightOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.left : this.anchorMargin_.right;
      return rightOffset;
    }
    const leftOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.right : this.anchorMargin_.left;
    return leftOffset;
  }

  /**
   * @param {MenuSurfaceCorner} corner Origin corner of the menu surface.
   * @return {number} Vertical offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getVerticalOriginOffset_(corner) {
    const {viewport, viewportDistance, anchorHeight, surfaceHeight} = this.measures_;
    const isBottomAligned = Boolean(corner & MenuSurfaceCornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;
    const avoidVerticalOverlap = Boolean(this.anchorCorner_ & MenuSurfaceCornerBit.BOTTOM);
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
   * @param {MenuSurfaceCorner} corner Origin corner of the menu surface.
   * @return {number} Maximum height of the menu surface, based on available space. 0 indicates should not be set.
   * @private
   */
  getMenuSurfaceMaxHeight_(corner) {
    let maxHeight = 0;
    const {viewportDistance} = this.measures_;
    const isBottomAligned = Boolean(corner & MenuSurfaceCornerBit.BOTTOM);

    // When maximum height is not specified, it is handled from css.
    if (this.anchorCorner_ & MenuSurfaceCornerBit.BOTTOM) {
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
    let verticalAlignment = (corner & MenuSurfaceCornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment = (corner & MenuSurfaceCornerBit.RIGHT) ? 'right' : 'left';
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
    if (!(this.anchorCorner_ & MenuSurfaceCornerBit.BOTTOM) &&
        Math.abs(verticalOffset / surfaceHeight) > numbers.OFFSET_TO_MENU_SURFACE_HEIGHT_RATIO) {
      const verticalOffsetPercent = Math.abs(verticalOffset / surfaceHeight) * 100;
      const originPercent = (corner & MenuSurfaceCornerBit.BOTTOM)
        ? 100 - verticalOffsetPercent : verticalOffsetPercent;
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
   */
  open() {
    this.adapter_.saveFocus();

    if (!this.quickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
    }

    this.animationRequestId_ = requestAnimationFrame(() => {
      this.dimensions_ = this.adapter_.getInnerDimensions();
      this.autoPosition_();
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
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
   * The last focused element when the menu surface was opened should regain focus, if the user is
   * focused on or within the menu surface when it is closed.
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
