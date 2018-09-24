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
 *   bodyDimensions,
 *   windowScroll,
 * }}
 */
let AutoLayoutMeasurements;
/* eslint-enable no-unused-vars */

import MDCFoundation from '@material/base/foundation';
import {MDCMenuSurfaceAdapter} from './adapter';
import {cssClasses, strings, numbers, Corner, CornerBit} from './constants';

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
      hasAnchor: () => false,
      notifyClose: () => {},
      notifyOpen: () => {},
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
      getBodyDimensions: () => ({}),
      getWindowScroll: () => ({}),
      setPosition: () => {},
      setMaxHeight: () => {},
    });
  }

  /** @param {!MDCMenuSurfaceAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuSurfaceFoundation.defaultAdapter, adapter));

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
    /** @private {!Corner} */
    this.anchorCorner_ = Corner.TOP_START;
    /** @private {!AnchorMargin} */
    this.anchorMargin_ = {top: 0, right: 0, bottom: 0, left: 0};
    /** @private {?AutoLayoutMeasurements} */
    this.measures_ = null;
    /** @private {boolean} */
    this.quickOpen_ = false;
    /** @private {boolean} */
    this.hoistedElement_ = false;
    /** @private {boolean} */
    this.isFixedPosition_ = false;
    /** @private {!{x: number, y: number}} */
    this.position_ = {x: 0, y: 0};
  }

  init() {
    const {ROOT, OPEN} = MDCMenuSurfaceFoundation.cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }
  }

  destroy() {
    clearTimeout(this.openAnimationEndTimerId_);
    clearTimeout(this.closeAnimationEndTimerId_);
    // Cancel any currently running animations.
    cancelAnimationFrame(this.animationRequestId_);
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left menu surface corner.
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

  /**
   * Used to indicate if the menu-surface is hoisted to the body.
   * @param {boolean} isHoisted
   */
  setIsHoisted(isHoisted) {
    this.hoistedElement_ = isHoisted;
  }

  /**
   * Used to set the menu-surface calculations based on a fixed position menu.
   * @param {boolean} isFixedPosition
   */
  setFixedPosition(isFixedPosition) {
    this.isFixedPosition_ = isFixedPosition;
  }

  /**
   * Sets the menu-surface position on the page.
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.position_.x = this.typeCheckisFinite_(x) ? x : 0;
    this.position_.y = this.typeCheckisFinite_(y) ? y : 0;
  }

  /** @param {boolean} quickOpen */
  setQuickOpen(quickOpen) {
    this.quickOpen_ = quickOpen;
  }

  /**
   * Handle clicks and close if not within menu-surface element.
   * @param {!Event} evt
   */
  handleBodyClick(evt) {
    const el = evt.target;

    if (this.adapter_.isElementInContainer(el)) {
      return;
    }

    this.close();
  };

  /**
   * Handle keys that close the surface.
   * @param {!Event} evt
   */
  handleKeydown(evt) {
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
   * @return {!AutoLayoutMeasurements} Measurements used to position menu surface popup.
   */
  getAutoLayoutMeasurements_() {
    let anchorRect = this.adapter_.getAnchorDimensions();
    const viewport = this.adapter_.getWindowDimensions();
    const bodyDimensions = this.adapter_.getBodyDimensions();
    const windowScroll = this.adapter_.getWindowScroll();

    if (!anchorRect) {
      anchorRect = /** @type {ClientRect} */ ({
        x: this.position_.x,
        y: this.position_.y,
        top: this.position_.y,
        bottom: this.position_.y,
        left: this.position_.x,
        right: this.position_.x,
        height: 0,
        width: 0,
      });
    }

    return {
      viewport,
      bodyDimensions,
      windowScroll,
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
   * @return {!Corner}
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

    return /** @type {Corner} */ (corner);
  }

  /**
   * @param {!Corner} corner Origin corner of the menu surface.
   * @return {number} Horizontal offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getHorizontalOriginOffset_(corner) {
    const {anchorWidth} = this.measures_;
    // isRightAligned corresponds to using the 'right' property on the surface.
    const isRightAligned = Boolean(corner & CornerBit.RIGHT);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);

    if (isRightAligned) {
      const rightOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.left : this.anchorMargin_.right;

      // For hoisted or fixed elements, adjust the offset by the difference between viewport width and body width so
      // when we calculate the right value (`adjustPositionForHoistedElement_`) based on the element position,
      // the right property is correct.
      if (this.hoistedElement_ || this.isFixedPosition_) {
        return rightOffset - (this.measures_.viewport.width - this.measures_.bodyDimensions.width);
      }

      return rightOffset;
    }

    return avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.right : this.anchorMargin_.left;
  }

  /**
   * @param {!Corner} corner Origin corner of the menu surface.
   * @return {number} Vertical offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getVerticalOriginOffset_(corner) {
    const {anchorHeight} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);
    const avoidVerticalOverlap = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    let y = 0;

    if (isBottomAligned) {
      y = avoidVerticalOverlap ? anchorHeight - this.anchorMargin_.top : -this.anchorMargin_.bottom;
    } else {
      y = avoidVerticalOverlap ? (anchorHeight + this.anchorMargin_.bottom) : this.anchorMargin_.top;
    }
    return y;
  }

  /**
   * @param {!Corner} corner Origin corner of the menu surface.
   * @return {number} Maximum height of the menu surface, based on available space. 0 indicates should not be set.
   * @private
   */
  getMenuSurfaceMaxHeight_(corner) {
    let maxHeight = 0;
    const {viewportDistance} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;

    // When maximum height is not specified, it is handled from css.
    if (isBottomAligned) {
      maxHeight = viewportDistance.top + this.anchorMargin_.top - MARGIN_TO_EDGE;
      if (!(this.anchorCorner_ & CornerBit.BOTTOM)) {
        maxHeight += this.measures_.anchorHeight;
      }
    } else {
      maxHeight = viewportDistance.bottom - this.anchorMargin_.bottom + this.measures_.anchorHeight - MARGIN_TO_EDGE;
      if (this.anchorCorner_ & CornerBit.BOTTOM) {
        maxHeight -= this.measures_.anchorHeight;
      }
    }

    return maxHeight;
  }

  /** @private */
  autoPosition_() {
    // Compute measurements for autoposition methods reuse.
    this.measures_ = this.getAutoLayoutMeasurements_();

    const corner = this.getOriginCorner_();
    const maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight_(corner);
    const verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment = (corner & CornerBit.RIGHT) ? 'right' : 'left';
    const horizontalOffset = this.getHorizontalOriginOffset_(corner);
    const verticalOffset = this.getVerticalOriginOffset_(corner);
    let position = {
      [horizontalAlignment]: horizontalOffset ? horizontalOffset : '0',
      [verticalAlignment]: verticalOffset ? verticalOffset : '0',
    };
    const {anchorWidth, surfaceWidth} = this.measures_;
    // Center align when anchor width is comparable or greater than menu surface, otherwise keep corner.
    if (anchorWidth / surfaceWidth > numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
      horizontalAlignment = 'center';
    }

    // If the menu-surface has been hoisted to the body, it's no longer relative to the anchor element
    if (this.hoistedElement_ || this.isFixedPosition_) {
      position = this.adjustPositionForHoistedElement_(position);
    }

    for (const prop in position) {
      if (position.hasOwnProperty(prop) && position[prop] !== '0') {
        position[prop] = `${parseInt(position[prop], 10)}px`;
      }
    }

    this.adapter_.setTransformOrigin(`${horizontalAlignment} ${verticalAlignment}`);
    this.adapter_.setPosition(position);
    this.adapter_.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');

    // Clear measures after positioning is complete.
    this.measures_ = null;
  }

  /**
   * Calculates the offsets for positioning the menu-surface when the menu-surface has been
   * hoisted to the body.
   * @param {!{
   *   top: (string|undefined),
   *   right: (string|undefined),
   *   bottom: (string|undefined),
   *   left: (string|undefined)
   * }} position
   * @return {!{
   *   top: (string|undefined),
   *   right: (string|undefined),
   *   bottom: (string|undefined),
   *   left: (string|undefined)
   * }} position
   * @private
   */
  adjustPositionForHoistedElement_(position) {
    const {windowScroll, viewportDistance} = this.measures_;

    for (const prop in position) {
      if (position.hasOwnProperty(prop)) {
        // Hoisted surfaces need to have the anchor elements location on the page added to the
        // position properties for proper alignment on the body.
        if (viewportDistance.hasOwnProperty(prop)) {
          position[prop] = parseInt(position[prop], 10) + viewportDistance[prop];
        }

        // Surfaces that are absolutely positioned need to have additional calculations for scroll
        // and bottom positioning.
        if (!this.isFixedPosition_) {
          if (prop === 'top') {
            position[prop] = parseInt(position[prop], 10) + windowScroll.y;
          } else if (prop === 'bottom') {
            position[prop] = parseInt(position[prop], 10) - windowScroll.y;
          } else if (prop === 'left') {
            position[prop] = parseInt(position[prop], 10) + windowScroll.x;
          } else if (prop === 'right') {
            position[prop] = parseInt(position[prop], 10) - windowScroll.x;
          }
        }
      }
    }

    return position;
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
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.dimensions_ = this.adapter_.getInnerDimensions();
      this.autoPosition_();
      if (this.quickOpen_) {
        this.adapter_.notifyOpen();
      } else {
        this.openAnimationEndTimerId_ = setTimeout(() => {
          this.openAnimationEndTimerId_ = 0;
          this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
          this.adapter_.notifyOpen();
        }, numbers.TRANSITION_OPEN_DURATION);
      }
    });
    this.isOpen_ = true;
  }

  /**
   * Closes the menu surface.
   */
  close() {
    if (!this.quickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
    }

    requestAnimationFrame(() => {
      this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      if (this.quickOpen_) {
        this.adapter_.notifyClose();
      } else {
        this.closeAnimationEndTimerId_ = setTimeout(() => {
          this.closeAnimationEndTimerId_ = 0;
          this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
          this.adapter_.notifyClose();
        }, numbers.TRANSITION_CLOSE_DURATION);
      }
    });

    this.isOpen_ = false;
    this.maybeRestoreFocus_();
  }

  /**
   * The last focused element when the menu surface was opened should regain focus, if the user is
   * focused on or within the menu surface when it is closed.
   * @private
   */
  maybeRestoreFocus_() {
    if (this.adapter_.isFocused() || this.adapter_.isElementInContainer(document.activeElement)) {
      this.adapter_.restoreFocus();
    }
  }

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }

  /**
   * isFinite that doesn't force conversion to number type.
   * Equivalent to Number.isFinite in ES2015, but is not included in IE11.
   * @param {number} num
   * @return {boolean}
   * @private
   */
  typeCheckisFinite_(num) {
    return typeof num === 'number' && isFinite(num);
  }
}

export {MDCMenuSurfaceFoundation, AnchorMargin};
