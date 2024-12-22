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
import {SpecificEventListener} from '@material/base/types';

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

/** MDC Menu Surface Foundation */
export class MDCMenuSurfaceFoundation extends
    MDCFoundation<MDCMenuSurfaceAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get numbers() {
    return numbers;
  }

  static get Corner() {
    return Corner;
  }

  /**
   * @see {@link MDCMenuSurfaceAdapter} for typing information on parameters and return types.
   */
  static override get defaultAdapter(): MDCMenuSurfaceAdapter {
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
      getViewportDimensions: () => ({height: 0, width: 0}),
      getBodyDimensions: () => ({height: 0, width: 0}),
      getWindowScroll: () => ({x: 0, y: 0}),
      setPosition: () => undefined,
      setMaxHeight: () => undefined,
      setTransformOrigin: () => undefined,

      saveFocus: () => undefined,
      restoreFocus: () => undefined,

      notifyClose: () => undefined,
      notifyClosing: () => undefined,
      notifyOpen: () => undefined,
      notifyOpening: () => undefined,
      registerWindowEventHandler: () => undefined,
      deregisterWindowEventHandler: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private isSurfaceOpen = false;
  private isQuickOpen = false;
  private isHoistedElement = false;
  private isFixedPosition = false;
  private isHorizontallyCenteredOnViewport = false;

  private maxHeight = 0;
  private openBottomBias = 0;

  private openAnimationEndTimerId = 0;
  private closeAnimationEndTimerId = 0;
  private animationRequestId = 0;

  private anchorCorner: Corner = Corner.TOP_START;

  private resizeListener!:
      SpecificEventListener<'resize'>;  // Assigned in #initialize.

  /**
   * Corner of the menu surface to which menu surface is attached to anchor.
   *
   *  Anchor corner --->+----------+
   *                    |  ANCHOR  |
   *                    +----------+
   *  Origin corner --->+--------------+
   *                    |              |
   *                    |              |
   *                    | MENU SURFACE |
   *                    |              |
   *                    |              |
   *                    +--------------+
   */
  private originCorner: Corner = Corner.TOP_START;
  private readonly anchorMargin:
      MDCMenuDistance = {top: 0, right: 0, bottom: 0, left: 0};
  private readonly position: MDCMenuPoint = {x: 0, y: 0};

  private dimensions!: MDCMenuDimensions;         // assigned in open()
  private measurements!: AutoLayoutMeasurements;  // assigned in open()

  constructor(adapter?: Partial<MDCMenuSurfaceAdapter>) {
    super({...MDCMenuSurfaceFoundation.defaultAdapter, ...adapter});
  }

  override init() {
    const {ROOT, OPEN} = MDCMenuSurfaceFoundation.cssClasses;

    if (!this.adapter.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (this.adapter.hasClass(OPEN)) {
      this.isSurfaceOpen = true;
    }

    this.resizeListener = this.handleResize.bind(this);
    this.adapter.registerWindowEventHandler('resize', this.resizeListener);
  }

  override destroy() {
    clearTimeout(this.openAnimationEndTimerId);
    clearTimeout(this.closeAnimationEndTimerId);
    // Cancel any currently running animations.
    cancelAnimationFrame(this.animationRequestId);

    this.adapter.deregisterWindowEventHandler('resize', this.resizeListener);
  }

  /**
   * @param corner Default anchor corner alignment of top-left menu surface
   *     corner.
   */
  setAnchorCorner(corner: Corner) {
    this.anchorCorner = corner;
  }

  /**
   * Flip menu corner horizontally.
   */
  flipCornerHorizontally() {
    this.originCorner = this.originCorner ^ CornerBit.RIGHT;
  }

  /**
   * @param margin Set of margin values from anchor.
   */
  setAnchorMargin(margin: Partial<MDCMenuDistance>) {
    this.anchorMargin.top = margin.top || 0;
    this.anchorMargin.right = margin.right || 0;
    this.anchorMargin.bottom = margin.bottom || 0;
    this.anchorMargin.left = margin.left || 0;
  }

  /** Used to indicate if the menu-surface is hoisted to the body. */
  setIsHoisted(isHoisted: boolean) {
    this.isHoistedElement = isHoisted;
  }

  /**
   * Used to set the menu-surface calculations based on a fixed position menu.
   */
  setFixedPosition(isFixedPosition: boolean) {
    this.isFixedPosition = isFixedPosition;
  }

  /**
   * @return Returns true if menu is in fixed (`position: fixed`) position.
   */
  isFixed() {
    return this.isFixedPosition;
  }

  /** Sets the menu-surface position on the page. */
  setAbsolutePosition(x: number, y: number) {
    this.position.x = this.isFinite(x) ? x : 0;
    this.position.y = this.isFinite(y) ? y : 0;
  }

  /** Sets whether menu-surface should be horizontally centered to viewport. */
  setIsHorizontallyCenteredOnViewport(isCentered: boolean) {
    this.isHorizontallyCenteredOnViewport = isCentered;
  }

  setQuickOpen(quickOpen: boolean) {
    this.isQuickOpen = quickOpen;
  }

  /**
   * Sets maximum menu-surface height on open.
   * @param maxHeight The desired max-height. Set to 0 (default) to
   *     automatically calculate max height based on available viewport space.
   */
  setMaxHeight(maxHeight: number) {
    this.maxHeight = maxHeight;
  }

  /**
   * Set to a positive integer to influence the menu to preferentially open
   * below the anchor instead of above.
   * @param bias A value of `x` simulates an extra `x` pixels of available space
   *     below the menu during positioning calculations.
   */
  setOpenBottomBias(bias: number) {
    this.openBottomBias = bias;
  }

  isOpen() {
    return this.isSurfaceOpen;
  }

  /**
   * Open the menu surface.
   */
  open() {
    if (this.isSurfaceOpen) {
      return;
    }

    this.adapter.notifyOpening();
    this.adapter.saveFocus();

    if (this.isQuickOpen) {
      this.isSurfaceOpen = true;
      this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.dimensions = this.adapter.getInnerDimensions();
      this.autoposition();
      this.adapter.notifyOpen();
    } else {
      this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
      this.animationRequestId = requestAnimationFrame(() => {
        this.dimensions = this.adapter.getInnerDimensions();
        this.autoposition();
        this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
        this.openAnimationEndTimerId = setTimeout(() => {
          this.openAnimationEndTimerId = 0;
          this.adapter.removeClass(
              MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
          this.adapter.notifyOpen();
        }, numbers.TRANSITION_OPEN_DURATION);
      });

      this.isSurfaceOpen = true;
    }

    this.adapter.registerWindowEventHandler('resize', this.resizeListener);
  }

  /**
   * Closes the menu surface.
   */
  close(skipRestoreFocus = false) {
    if (!this.isSurfaceOpen) {
      return;
    }

    this.adapter.notifyClosing();
    this.adapter.deregisterWindowEventHandler('resize', this.resizeListener);

    if (this.isQuickOpen) {
      this.isSurfaceOpen = false;
      if (!skipRestoreFocus) {
        this.maybeRestoreFocus();
      }

      this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.adapter.removeClass(
          MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
      this.adapter.notifyClose();

      return;
    }

    this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
    requestAnimationFrame(() => {
      this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.adapter.removeClass(
          MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
      this.closeAnimationEndTimerId = setTimeout(() => {
        this.closeAnimationEndTimerId = 0;
        this.adapter.removeClass(
            MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
        this.adapter.notifyClose();
      }, numbers.TRANSITION_CLOSE_DURATION);
    });

    this.isSurfaceOpen = false;
    if (!skipRestoreFocus) {
      this.maybeRestoreFocus();
    }
  }

  /** Handle clicks and close if not within menu-surface element. */
  handleBodyClick(event: MouseEvent) {
    const el = event.target as Element;
    if (this.adapter.isElementInContainer(el)) {
      return;
    }
    this.close();
  }

  /** Handle keys that close the surface. */
  handleKeydown(event: KeyboardEvent) {
    const {keyCode, key} = event;

    const isEscape = key === 'Escape' || keyCode === 27;
    if (isEscape) {
      this.close();
    }
  }

  /** Handles resize events on the window. */
  private handleResize() {
    this.dimensions = this.adapter.getInnerDimensions();
    this.autoposition();
  }

  private autoposition() {
    // Compute measurements for autoposition methods reuse.
    this.measurements = this.getAutoLayoutmeasurements();

    const corner = this.getoriginCorner();
    const maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight(corner);
    const verticalAlignment =
        this.hasBit(corner, CornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment =
        this.hasBit(corner, CornerBit.RIGHT) ? 'right' : 'left';
    const horizontalOffset = this.getHorizontalOriginOffset(corner);
    const verticalOffset = this.getVerticalOriginOffset(corner);
    const {anchorSize, surfaceSize} = this.measurements;

    const position: Partial<MDCMenuDistance> = {
      [horizontalAlignment]: horizontalOffset,
      [verticalAlignment]: verticalOffset,
    };

    // Center align when anchor width is comparable or greater than menu
    // surface, otherwise keep corner.
    if (anchorSize.width / surfaceSize.width >
        numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
      horizontalAlignment = 'center';
    }

    // If the menu-surface has been hoisted to the body, it's no longer relative
    // to the anchor element
    if (this.isHoistedElement || this.isFixedPosition) {
      this.adjustPositionForHoistedElement(position);
    }

    this.adapter.setTransformOrigin(
        `${horizontalAlignment} ${verticalAlignment}`);
    this.adapter.setPosition(position);
    this.adapter.setMaxHeight(
        maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');

    // If it is opened from the top then add is-open-below class
    if (!this.hasBit(corner, CornerBit.BOTTOM)) {
      this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
    }
  }

  /**
   * @return Measurements used to position menu surface popup.
   */
  private getAutoLayoutmeasurements(): AutoLayoutMeasurements {
    let anchorRect = this.adapter.getAnchorDimensions();
    const bodySize = this.adapter.getBodyDimensions();
    const viewportSize = this.adapter.getViewportDimensions();
    const windowScroll = this.adapter.getWindowScroll();

    if (!anchorRect) {
      // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
      anchorRect = {
        top: this.position.y,
        right: this.position.x,
        bottom: this.position.y,
        left: this.position.x,
        width: 0,
        height: 0,
      } as any;
      // tslint:enable:object-literal-sort-keys
    }

    return {
      anchorSize: anchorRect!,
      bodySize,
      surfaceSize: this.dimensions,
      viewportDistance: {
        // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
        top: anchorRect!.top,
        right: viewportSize.width - anchorRect!.right,
        bottom: viewportSize.height - anchorRect!.bottom,
        left: anchorRect!.left,
        // tslint:enable:object-literal-sort-keys
      },
      viewportSize,
      windowScroll,
    };
  }

  /**
   * Computes the corner of the anchor from which to animate and position the
   * menu surface.
   *
   * Only LEFT or RIGHT bit is used to position the menu surface ignoring RTL
   * context. E.g., menu surface will be positioned from right side on TOP_END.
   */
  private getoriginCorner(): Corner {
    let corner = this.originCorner;

    const {viewportDistance, anchorSize, surfaceSize} = this.measurements;
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;

    const isAnchoredToBottom = this.hasBit(this.anchorCorner, CornerBit.BOTTOM);

    let availableTop;
    let availableBottom;
    if (isAnchoredToBottom) {
      availableTop =
          viewportDistance.top - MARGIN_TO_EDGE + this.anchorMargin.bottom;
      availableBottom =
          viewportDistance.bottom - MARGIN_TO_EDGE - this.anchorMargin.bottom;
    } else {
      availableTop =
          viewportDistance.top - MARGIN_TO_EDGE + this.anchorMargin.top;
      availableBottom = viewportDistance.bottom - MARGIN_TO_EDGE +
          anchorSize.height - this.anchorMargin.top;
    }

    const isAvailableBottom = availableBottom - surfaceSize.height > 0;
    if (!isAvailableBottom &&
        availableTop > availableBottom + this.openBottomBias) {
      // Attach bottom side of surface to the anchor.
      corner = this.setBit(corner, CornerBit.BOTTOM);
    }

    const isRtl = this.adapter.isRtl();
    const isFlipRtl = this.hasBit(this.anchorCorner, CornerBit.FLIP_RTL);
    const hasRightBit = this.hasBit(this.anchorCorner, CornerBit.RIGHT) ||
        this.hasBit(corner, CornerBit.RIGHT);

    // Whether surface attached to right side of anchor element.
    let isAnchoredToRight = false;

    // Anchored to start
    if (isRtl && isFlipRtl) {
      isAnchoredToRight = !hasRightBit;
    } else {
      // Anchored to right
      isAnchoredToRight = hasRightBit;
    }

    let availableLeft;
    let availableRight;
    if (isAnchoredToRight) {
      availableLeft =
          viewportDistance.left + anchorSize.width + this.anchorMargin.left;
      availableRight = viewportDistance.right - this.anchorMargin.left;
    } else {
      availableLeft = viewportDistance.left + this.anchorMargin.left;
      availableRight =
          viewportDistance.right + anchorSize.width - this.anchorMargin.left;
    }

    const isAvailableLeft = availableLeft - surfaceSize.width > 0;
    const isAvailableRight = availableRight - surfaceSize.width > 0;
    const isOriginCornerAlignedToEnd =
        this.hasBit(corner, CornerBit.FLIP_RTL) &&
        this.hasBit(corner, CornerBit.RIGHT);

    if (isAvailableRight && isOriginCornerAlignedToEnd && isRtl ||
        !isAvailableLeft && isOriginCornerAlignedToEnd) {
      // Attach left side of surface to the anchor.
      corner = this.unsetBit(corner, CornerBit.RIGHT);
    } else if (
        isAvailableLeft && isAnchoredToRight && isRtl ||
        (isAvailableLeft && !isAnchoredToRight && hasRightBit) ||
        (!isAvailableRight && availableLeft >= availableRight)) {
      // Attach right side of surface to the anchor.
      corner = this.setBit(corner, CornerBit.RIGHT);
    }

    return corner;
  }

  /**
   * @param corner Origin corner of the menu surface.
   * @return Maximum height of the menu surface, based on available space. 0
   *     indicates should not be set.
   */
  private getMenuSurfaceMaxHeight(corner: Corner): number {
    if (this.maxHeight > 0) {
      return this.maxHeight;
    }

    const {viewportDistance} = this.measurements;

    let maxHeight = 0;
    const isBottomAligned = this.hasBit(corner, CornerBit.BOTTOM);
    const isBottomAnchored = this.hasBit(this.anchorCorner, CornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;

    // When maximum height is not specified, it is handled from CSS.
    if (isBottomAligned) {
      maxHeight = viewportDistance.top + this.anchorMargin.top - MARGIN_TO_EDGE;
      if (!isBottomAnchored) {
        maxHeight += this.measurements.anchorSize.height;
      }
    } else {
      maxHeight = viewportDistance.bottom - this.anchorMargin.bottom +
          this.measurements.anchorSize.height - MARGIN_TO_EDGE;
      if (isBottomAnchored) {
        maxHeight -= this.measurements.anchorSize.height;
      }
    }

    return maxHeight;
  }

  /**
   * @param corner Origin corner of the menu surface.
   * @return Horizontal offset of menu surface origin corner from corresponding
   *     anchor corner.
   */
  private getHorizontalOriginOffset(corner: Corner): number {
    const {anchorSize} = this.measurements;

    // isRightAligned corresponds to using the 'right' property on the surface.
    const isRightAligned = this.hasBit(corner, CornerBit.RIGHT);
    const avoidHorizontalOverlap =
        this.hasBit(this.anchorCorner, CornerBit.RIGHT);

    if (isRightAligned) {
      const rightOffset = avoidHorizontalOverlap ?
          anchorSize.width - this.anchorMargin.left :
          this.anchorMargin.right;

      // For hoisted or fixed elements, adjust the offset by the difference
      // between viewport width and body width so when we calculate the right
      // value (`adjustPositionForHoistedElement`) based on the element
      // position, the right property is correct.
      if (this.isHoistedElement || this.isFixedPosition) {
        return rightOffset -
            (this.measurements.viewportSize.width -
             this.measurements.bodySize.width);
      }

      return rightOffset;
    }

    return avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin.right :
                                    this.anchorMargin.left;
  }

  /**
   * @param corner Origin corner of the menu surface.
   * @return Vertical offset of menu surface origin corner from corresponding
   *     anchor corner.
   */
  private getVerticalOriginOffset(corner: Corner): number {
    const {anchorSize} = this.measurements;
    const isBottomAligned = this.hasBit(corner, CornerBit.BOTTOM);
    const avoidVerticalOverlap =
        this.hasBit(this.anchorCorner, CornerBit.BOTTOM);

    let y = 0;
    if (isBottomAligned) {
      y = avoidVerticalOverlap ? anchorSize.height - this.anchorMargin.top :
                                 -this.anchorMargin.bottom;
    } else {
      y = avoidVerticalOverlap ?
          (anchorSize.height + this.anchorMargin.bottom) :
          this.anchorMargin.top;
    }
    return y;
  }

  /**
   * Calculates the offsets for positioning the menu-surface when the
   * menu-surface has been hoisted to the body.
   */
  private adjustPositionForHoistedElement(position: Partial<MDCMenuDistance>) {
    const {windowScroll, viewportDistance, surfaceSize, viewportSize} =
        this.measurements;

    const props =
        Object.keys(position) as Array<keyof Partial<MDCMenuDistance>>;

    for (const prop of props) {
      let value = position[prop] || 0;

      if (this.isHorizontallyCenteredOnViewport &&
          (prop === 'left' || prop === 'right')) {
        position[prop] = (viewportSize.width - surfaceSize.width) / 2;
        continue;
      }

      // Hoisted surfaces need to have the anchor elements location on the page
      // added to the position properties for proper alignment on the body.
      value += viewportDistance[prop];

      // Surfaces that are absolutely positioned need to have additional
      // calculations for scroll and bottom positioning.
      if (!this.isFixedPosition) {
        if (prop === 'top') {
          value += windowScroll.y;
        } else if (prop === 'bottom') {
          value -= windowScroll.y;
        } else if (prop === 'left') {
          value += windowScroll.x;
        } else {  // prop === 'right'
          value -= windowScroll.x;
        }
      }

      position[prop] = value;
    }
  }

  /**
   * The last focused element when the menu surface was opened should regain
   * focus, if the user is focused on or within the menu surface when it is
   * closed.
   */
  private maybeRestoreFocus() {
    // Wait before restoring focus when closing the menu surface. This is
    // important because if a touch event triggered the menu close, and the
    // subsequent mouse event occurs after focus is restored, then the
    // restored focus would be lost.
    setTimeout(() => {
      const isRootFocused = this.adapter.isFocused();
      const ownerDocument = this.adapter.getOwnerDocument ?
          this.adapter.getOwnerDocument() :
          document;
      const childHasFocus = ownerDocument.activeElement &&
          this.adapter.isElementInContainer(ownerDocument.activeElement);
      if (isRootFocused || childHasFocus) {
        this.adapter.restoreFocus();
      }
    }, numbers.TOUCH_EVENT_WAIT_MS);
  }

  private hasBit(corner: Corner, bit: CornerBit): boolean {
    return Boolean(corner & bit);  // tslint:disable-line:no-bitwise
  }

  private setBit(corner: Corner, bit: CornerBit): Corner {
    return corner | bit;  // tslint:disable-line:no-bitwise
  }

  private unsetBit(corner: Corner, bit: CornerBit): Corner {
    return corner ^ bit;
  }

  /**
   * isFinite that doesn't force conversion to number type.
   * Equivalent to Number.isFinite in ES2015, which is not supported in IE.
   */
  private isFinite(num: number): boolean {
    return typeof num === 'number' && isFinite(num);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCMenuSurfaceFoundation;
