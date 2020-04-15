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
import {MDCMenuSurfaceAdapter} from './adapter';
import {Corner, CornerBit, cssClasses, numbers, strings} from './constants';
import {MDCMenuDimensions, MDCMenuDistance, MDCMenuPoint} from './types';

interface AutoLayoutMeasurements {
  anchorSize: MDCMenuDimensions;
  bodySize: MDCMenuDimensions;
  surfaceSize: MDCMenuDimensions;
  viewportDistance: MDCMenuDistance;
  viewportSize: MDCMenuDimensions;
  windowScroll: MDCMenuPoint;
}

export class MDCMenuSurfaceFoundation extends MDCFoundation<MDCMenuSurfaceAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get Corner() {
    return Corner;
  }

  /**
   * @see {@link MDCMenuSurfaceAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCMenuSurfaceAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      hasAnchor: () => false,

      isElementInContainer: () => false,
      isFocused: () => false,
      isRtl: () => false,

      getInnerDimensions: () => ({height: 0, width: 0}),
      getAnchorDimensions: () => null,
      getWindowDimensions: () => ({height: 0, width: 0}),
      getBodyDimensions: () => ({height: 0, width: 0}),
      getWindowScroll: () => ({x: 0, y: 0}),
      setPosition: () => undefined,
      setMaxHeight: () => undefined,
      setTransformOrigin: () => undefined,

      saveFocus: () => undefined,
      restoreFocus: () => undefined,

      notifyClose: () => undefined,
      notifyOpen: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private isOpen_ = false;
  private isQuickOpen_ = false;
  private isHoistedElement_ = false;
  private isFixedPosition_ = false;

  private openAnimationEndTimerId_ = 0;
  private closeAnimationEndTimerId_ = 0;
  private animationRequestId_ = 0;

  private anchorCorner_: Corner = Corner.TOP_START;
  private anchorMargin_: MDCMenuDistance = {top: 0, right: 0, bottom: 0, left: 0};
  private position_: MDCMenuPoint = {x: 0, y: 0};

  private dimensions_!: MDCMenuDimensions; // assigned in open()
  private measurements_!: AutoLayoutMeasurements; // assigned in open()

  constructor(adapter?: Partial<MDCMenuSurfaceAdapter>) {
    super({...MDCMenuSurfaceFoundation.defaultAdapter, ...adapter});
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
   * @param corner Default anchor corner alignment of top-left menu surface corner.
   */
  setAnchorCorner(corner: Corner) {
    this.anchorCorner_ = corner;
  }

  /**
   * @param margin Set of margin values from anchor.
   */
  setAnchorMargin(margin: Partial<MDCMenuDistance>) {
    this.anchorMargin_.top = margin.top || 0;
    this.anchorMargin_.right = margin.right || 0;
    this.anchorMargin_.bottom = margin.bottom || 0;
    this.anchorMargin_.left = margin.left || 0;
  }

  /** Used to indicate if the menu-surface is hoisted to the body. */
  setIsHoisted(isHoisted: boolean) {
    this.isHoistedElement_ = isHoisted;
  }

  /** Used to set the menu-surface calculations based on a fixed position menu. */
  setFixedPosition(isFixedPosition: boolean) {
    this.isFixedPosition_ = isFixedPosition;
  }

  /** Sets the menu-surface position on the page. */
  setAbsolutePosition(x: number, y: number) {
    this.position_.x = this.isFinite_(x) ? x : 0;
    this.position_.y = this.isFinite_(y) ? y : 0;
  }

  setQuickOpen(quickOpen: boolean) {
    this.isQuickOpen_ = quickOpen;
  }

  isOpen() {
    return this.isOpen_;
  }

  /**
   * Open the menu surface.
   */
  open() {
    this.adapter_.saveFocus();

    if (!this.isQuickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
    }

    this.animationRequestId_ = requestAnimationFrame(() => {
      this.dimensions_ = this.adapter_.getInnerDimensions();
      this.autoPosition_();
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      if (this.isQuickOpen_) {
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
  close(skipRestoreFocus = false) {
    if (!this.isQuickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
    }

    requestAnimationFrame(() => {
      this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
      if (this.isQuickOpen_) {
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
    if (!skipRestoreFocus) {
      this.maybeRestoreFocus_();
    }
  }

  /** Handle clicks and close if not within menu-surface element. */
  handleBodyClick(evt: MouseEvent) {
    const el = evt.target as Element;
    if (this.adapter_.isElementInContainer(el)) {
      return;
    }
    this.close();
  }

  /** Handle keys that close the surface. */
  handleKeydown(evt: KeyboardEvent) {
    const {keyCode, key} = evt;

    const isEscape = key === 'Escape' || keyCode === 27;
    if (isEscape) {
      this.close();
    }
  }

  private autoPosition_() {
    // Compute measurements for autoposition methods reuse.
    this.measurements_ = this.getAutoLayoutMeasurements_();

    const corner = this.getOriginCorner_();
    const maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight_(corner);
    const verticalAlignment = this.hasBit_(corner, CornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment = this.hasBit_(corner, CornerBit.RIGHT) ? 'right' : 'left';
    const horizontalOffset = this.getHorizontalOriginOffset_(corner);
    const verticalOffset = this.getVerticalOriginOffset_(corner);
    const {anchorSize, surfaceSize} = this.measurements_;

    const position: Partial<MDCMenuDistance> = {
      [horizontalAlignment]: horizontalOffset,
      [verticalAlignment]: verticalOffset,
    };

    // Center align when anchor width is comparable or greater than menu surface, otherwise keep corner.
    if (anchorSize.width / surfaceSize.width > numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
      horizontalAlignment = 'center';
    }

    // If the menu-surface has been hoisted to the body, it's no longer relative to the anchor element
    if (this.isHoistedElement_ || this.isFixedPosition_) {
      this.adjustPositionForHoistedElement_(position);
    }

    this.adapter_.setTransformOrigin(`${horizontalAlignment} ${verticalAlignment}`);
    this.adapter_.setPosition(position);
    this.adapter_.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');

    // If it is opened from the top then add is-open-below class
    if (!this.hasBit_(corner, CornerBit.BOTTOM)) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
    }
  }

  /**
   * @return Measurements used to position menu surface popup.
   */
  private getAutoLayoutMeasurements_(): AutoLayoutMeasurements {
    let anchorRect = this.adapter_.getAnchorDimensions();
    const bodySize = this.adapter_.getBodyDimensions();
    const viewportSize = this.adapter_.getWindowDimensions();
    const windowScroll = this.adapter_.getWindowScroll();

    if (!anchorRect) {
      // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
      anchorRect = {
        top: this.position_.y,
        right: this.position_.x,
        bottom: this.position_.y,
        left: this.position_.x,
        width: 0,
        height: 0,
      };
      // tslint:enable:object-literal-sort-keys
    }

    return {
      anchorSize: anchorRect,
      bodySize,
      surfaceSize: this.dimensions_,
      viewportDistance: {
        // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
        top: anchorRect.top,
        right: viewportSize.width - anchorRect.right,
        bottom: viewportSize.height - anchorRect.bottom,
        left: anchorRect.left,
        // tslint:enable:object-literal-sort-keys
      },
      viewportSize,
      windowScroll,
    };
  }

  /**
   * Computes the corner of the anchor from which to animate and position the menu surface.
   */
  private getOriginCorner_(): Corner {
    // Defaults: open from the top left.
    let corner = Corner.TOP_LEFT;

    const {viewportDistance, anchorSize, surfaceSize} = this.measurements_;

    const isBottomAligned = this.hasBit_(this.anchorCorner_, CornerBit.BOTTOM);
    const availableTop = isBottomAligned ? viewportDistance.top + anchorSize.height + this.anchorMargin_.bottom
        : viewportDistance.top + this.anchorMargin_.top;
    const availableBottom = isBottomAligned ? viewportDistance.bottom - this.anchorMargin_.bottom
        : viewportDistance.bottom + anchorSize.height - this.anchorMargin_.top;

    const topOverflow = surfaceSize.height - availableTop;
    const bottomOverflow = surfaceSize.height - availableBottom;
    if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
      corner = this.setBit_(corner, CornerBit.BOTTOM);
    }

    const isRtl = this.adapter_.isRtl();
    const isFlipRtl = this.hasBit_(this.anchorCorner_, CornerBit.FLIP_RTL);
    const avoidHorizontalOverlap = this.hasBit_(this.anchorCorner_, CornerBit.RIGHT);
    const isAlignedRight = (avoidHorizontalOverlap && !isRtl) ||
        (!avoidHorizontalOverlap && isFlipRtl && isRtl);
    const availableLeft = isAlignedRight ? viewportDistance.left + anchorSize.width + this.anchorMargin_.right :
        viewportDistance.left + this.anchorMargin_.left;
    const availableRight = isAlignedRight ? viewportDistance.right - this.anchorMargin_.right :
        viewportDistance.right + anchorSize.width - this.anchorMargin_.left;

    const leftOverflow = surfaceSize.width - availableLeft;
    const rightOverflow = surfaceSize.width - availableRight;

    if ((leftOverflow < 0 && isAlignedRight && isRtl) ||
        (avoidHorizontalOverlap && !isAlignedRight && leftOverflow < 0) ||
        (rightOverflow > 0 && leftOverflow < rightOverflow)) {
      corner = this.setBit_(corner, CornerBit.RIGHT);
    }

    return corner;
  }

  /**
   * @param corner Origin corner of the menu surface.
   * @return Maximum height of the menu surface, based on available space. 0 indicates should not be set.
   */
  private getMenuSurfaceMaxHeight_(corner: Corner): number {
    const {viewportDistance} = this.measurements_;

    let maxHeight = 0;
    const isBottomAligned = this.hasBit_(corner, CornerBit.BOTTOM);
    const isBottomAnchored = this.hasBit_(this.anchorCorner_, CornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;

    // When maximum height is not specified, it is handled from CSS.
    if (isBottomAligned) {
      maxHeight = viewportDistance.top + this.anchorMargin_.top - MARGIN_TO_EDGE;
      if (!isBottomAnchored) {
        maxHeight += this.measurements_.anchorSize.height;
      }
    } else {
      maxHeight =
          viewportDistance.bottom - this.anchorMargin_.bottom + this.measurements_.anchorSize.height - MARGIN_TO_EDGE;
      if (isBottomAnchored) {
        maxHeight -= this.measurements_.anchorSize.height;
      }
    }

    return maxHeight;
  }

  /**
   * @param corner Origin corner of the menu surface.
   * @return Horizontal offset of menu surface origin corner from corresponding anchor corner.
   */
  private getHorizontalOriginOffset_(corner: Corner): number {
    const {anchorSize} = this.measurements_;

    // isRightAligned corresponds to using the 'right' property on the surface.
    const isRightAligned = this.hasBit_(corner, CornerBit.RIGHT);
    const avoidHorizontalOverlap = this.hasBit_(this.anchorCorner_, CornerBit.RIGHT);

    if (isRightAligned) {
      const rightOffset =
          avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin_.left : this.anchorMargin_.right;

      // For hoisted or fixed elements, adjust the offset by the difference between viewport width and body width so
      // when we calculate the right value (`adjustPositionForHoistedElement_`) based on the element position,
      // the right property is correct.
      if (this.isHoistedElement_ || this.isFixedPosition_) {
        return rightOffset - (this.measurements_.viewportSize.width - this.measurements_.bodySize.width);
      }

      return rightOffset;
    }

    return avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin_.right : this.anchorMargin_.left;
  }

  /**
   * @param corner Origin corner of the menu surface.
   * @return Vertical offset of menu surface origin corner from corresponding anchor corner.
   */
  private getVerticalOriginOffset_(corner: Corner): number {
    const {anchorSize} = this.measurements_;
    const isBottomAligned = this.hasBit_(corner, CornerBit.BOTTOM);
    const avoidVerticalOverlap = this.hasBit_(this.anchorCorner_, CornerBit.BOTTOM);

    let y = 0;
    if (isBottomAligned) {
      y = avoidVerticalOverlap ? anchorSize.height - this.anchorMargin_.top : -this.anchorMargin_.bottom;
    } else {
      y = avoidVerticalOverlap ? (anchorSize.height + this.anchorMargin_.bottom) : this.anchorMargin_.top;
    }
    return y;
  }

  /** Calculates the offsets for positioning the menu-surface when the menu-surface has been hoisted to the body. */
  private adjustPositionForHoistedElement_(position: Partial<MDCMenuDistance>) {
    const {windowScroll, viewportDistance} = this.measurements_;

    const props = Object.keys(position) as Array<keyof Partial<MDCMenuDistance>>;

    for (const prop of props) {
      let value = position[prop] || 0;

      // Hoisted surfaces need to have the anchor elements location on the page added to the
      // position properties for proper alignment on the body.
      value += viewportDistance[prop];

      // Surfaces that are absolutely positioned need to have additional calculations for scroll
      // and bottom positioning.
      if (!this.isFixedPosition_) {
        if (prop === 'top') {
          value += windowScroll.y;
        } else if (prop === 'bottom') {
          value -= windowScroll.y;
        } else if (prop === 'left') {
          value += windowScroll.x;
        } else { // prop === 'right'
          value -= windowScroll.x;
        }
      }

      position[prop] = value;
    }
  }

  /**
   * The last focused element when the menu surface was opened should regain focus, if the user is
   * focused on or within the menu surface when it is closed.
   */
  private maybeRestoreFocus_() {
    const isRootFocused = this.adapter_.isFocused();
    const childHasFocus = document.activeElement && this.adapter_.isElementInContainer(document.activeElement);
    if (isRootFocused || childHasFocus) {
      this.adapter_.restoreFocus();
    }
  }

  private hasBit_(corner: Corner, bit: CornerBit): boolean {
    return Boolean(corner & bit); // tslint:disable-line:no-bitwise
  }

  private setBit_(corner: Corner, bit: CornerBit): Corner {
    return corner | bit; // tslint:disable-line:no-bitwise
  }

  /**
   * isFinite that doesn't force conversion to number type.
   * Equivalent to Number.isFinite in ES2015, which is not supported in IE.
   */
  private isFinite_(num: number): boolean {
    return typeof num === 'number' && isFinite(num);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCMenuSurfaceFoundation;
