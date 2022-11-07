/**
 * @license
 * Copyright 2020 Google Inc.
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

import {AnimationFrame} from '@material/animation/animationframe';
import {getCorrectPropertyName} from '@material/animation/util';
import {MDCFoundation} from '@material/base/foundation';
import {EventType, SpecificEventListener} from '@material/base/types';
import {KEY, normalizeKey} from '@material/dom/keyboard';

import {MDCTooltipAdapter} from './adapter';
import {AnchorBoundaryType, attributes, CssClasses, numbers, PositionWithCaret, strings, XPosition, XPositionWithCaret, YPosition, YPositionWithCaret} from './constants';

const {
  RICH,
  SHOWN,
  SHOWING,
  SHOWING_TRANSITION,
  HIDE,
  HIDE_TRANSITION,
  MULTILINE_TOOLTIP
} = CssClasses;

enum AnimationKeys {
  POLL_ANCHOR = 'poll_anchor'
}

// Accessing `window` without a `typeof` check will throw on Node environments.
const HAS_WINDOW = typeof window !== 'undefined';

export class MDCTooltipFoundation extends MDCFoundation<MDCTooltipAdapter> {
  static override get defaultAdapter(): MDCTooltipAdapter {
    return {
      getAttribute: () => null,
      setAttribute: () => undefined,
      removeAttribute: () => undefined,
      addClass: () => undefined,
      hasClass: () => false,
      removeClass: () => undefined,
      getComputedStyleProperty: () => '',
      setStyleProperty: () => undefined,
      setSurfaceAnimationStyleProperty: () => undefined,
      getViewportWidth: () => 0,
      getViewportHeight: () => 0,
      getTooltipSize: () => ({width: 0, height: 0}),
      getAnchorBoundingRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      getParentBoundingRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      getAnchorAttribute: () => null,
      setAnchorAttribute: () => null,
      isRTL: () => false,
      anchorContainsElement: () => false,
      tooltipContainsElement: () => false,
      focusAnchorElement: () => undefined,
      registerEventHandler: () => undefined,
      deregisterEventHandler: () => undefined,
      registerAnchorEventHandler: () => undefined,
      deregisterAnchorEventHandler: () => undefined,
      registerDocumentEventHandler: () => undefined,
      deregisterDocumentEventHandler: () => undefined,
      registerWindowEventHandler: () => undefined,
      deregisterWindowEventHandler: () => undefined,
      notifyHidden: () => undefined,
      notifyShown: () => undefined,
      getTooltipCaretBoundingRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      setTooltipCaretStyle: () => undefined,
      clearTooltipCaretStyles: () => undefined,
      getActiveElement: () => null,
      isInstanceOfElement: () => false,
    };
  }

  private interactiveTooltip!: boolean;  // assigned in init()
  private richTooltip!: boolean;         // assigned in init()
  private persistentTooltip!: boolean;   // assigned in init()
  private hasCaret!: boolean;            // assigned in init()
  private tooltipShown = false;
  private anchorGap = numbers.BOUNDED_ANCHOR_GAP;
  private xTooltipPos = XPosition.DETECTED;
  private yTooltipPos = YPosition.DETECTED;
  private tooltipPositionWithCaret = PositionWithCaret.DETECTED;
  // Minimum threshold distance needed between the tooltip and the viewport.
  private readonly minViewportTooltipThreshold =
      numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD;
  private hideDelayMs = numbers.HIDE_DELAY_MS;
  private showDelayMs = numbers.SHOW_DELAY_MS;

  private anchorRect: DOMRect|null = null;
  private parentRect: DOMRect|null = null;
  private frameId: number|null = null;
  private hideTimeout: number|null = null;
  private showTimeout: number|null = null;
  private readonly animFrame: AnimationFrame;
  private readonly anchorBlurHandler: SpecificEventListener<'blur'>;
  private readonly documentClickHandler: SpecificEventListener<'click'>;
  private readonly documentKeydownHandler: SpecificEventListener<'keydown'>;
  private readonly tooltipMouseEnterHandler:
      SpecificEventListener<'mouseenter'>;
  private readonly tooltipMouseLeaveHandler:
      SpecificEventListener<'mouseleave'>;
  private readonly richTooltipFocusOutHandler:
      SpecificEventListener<'focusout'>;
  private readonly windowScrollHandler: SpecificEventListener<'scroll'>;
  private readonly windowResizeHandler: SpecificEventListener<'resize'>;

  private readonly addAncestorScrollEventListeners = new Array<() => void>();
  private readonly removeAncestorScrollEventListeners = new Array<() => void>();

  constructor(adapter?: Partial<MDCTooltipAdapter>) {
    super({...MDCTooltipFoundation.defaultAdapter, ...adapter});
    this.animFrame = new AnimationFrame();

    this.anchorBlurHandler = (evt) => {
      this.handleAnchorBlur(evt);
    };

    this.documentClickHandler = (evt) => {
      this.handleDocumentClick(evt);
    };

    this.documentKeydownHandler = (evt) => {
      this.handleKeydown(evt);
    };

    this.tooltipMouseEnterHandler = () => {
      this.handleTooltipMouseEnter();
    };

    this.tooltipMouseLeaveHandler = () => {
      this.handleTooltipMouseLeave();
    };

    this.richTooltipFocusOutHandler = (evt) => {
      this.handleRichTooltipFocusOut(evt);
    };

    this.windowScrollHandler = () => {
      this.handleWindowScrollEvent();
    };

    this.windowResizeHandler = () => {
      this.handleWindowChangeEvent();
    };
  }

  override init() {
    this.richTooltip = this.adapter.hasClass(RICH);
    this.persistentTooltip =
        this.adapter.getAttribute(attributes.PERSISTENT) === 'true';
    this.interactiveTooltip =
        !!this.adapter.getAnchorAttribute(attributes.ARIA_EXPANDED) &&
        this.adapter.getAnchorAttribute(attributes.ARIA_HASPOPUP) === 'dialog';
    this.hasCaret = this.richTooltip &&
        this.adapter.getAttribute(attributes.HAS_CARET) === 'true';
  }

  isShown() {
    return this.tooltipShown;
  }

  isRich() {
    return this.richTooltip;
  }

  isPersistent() {
    return this.persistentTooltip;
  }

  handleAnchorMouseEnter() {
    if (this.tooltipShown) {
      // Covers the instance where a user hovers over the anchor to reveal the
      // tooltip, and then quickly navigates away and then back to the anchor.
      // The tooltip should stay visible without animating out and then back in
      // again.
      this.show();
    } else {
      // clearHideTimeout here since handleAnchorMouseLeave sets a hideTimeout
      // and that can execute before the showTimeout executes, resulting in hide
      // being called and the showTimeout set below to be cleared.
      this.clearHideTimeout();
      this.showTimeout = setTimeout(() => {
        this.show();
      }, this.showDelayMs);
    }
  }

  handleAnchorTouchstart() {
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.showDelayMs);
    // Prevent a context menu from appearing if user is long-pressing on a
    // tooltip anchor.
    this.adapter.registerWindowEventHandler(
        'contextmenu', this.preventContextMenuOnLongTouch);
  }

  private preventContextMenuOnLongTouch(evt: MouseEvent) {
    evt.preventDefault();
  }

  /**
   * Helper methods for determining if the event target or related target
   * is contained inside the tooltip or the anchor. These methods are used to
   * determing when a tooltip should be closed of left open on blur and click
   * events.
   */
  private tooltipContainsRelatedTargetElement(target: EventTarget|
                                              null): boolean {
    return this.adapter.isInstanceOfElement(target) &&
        this.adapter.tooltipContainsElement((target as Element));
  }

  private anchorOrTooltipContainsTargetElement(target: EventTarget|
                                               null): boolean {
    return this.adapter.isInstanceOfElement(target) &&
        (this.adapter.tooltipContainsElement((target as Element)) ||
         this.adapter.anchorContainsElement((target as Element)));
  }

  handleAnchorTouchend() {
    this.clearShowTimeout();

    // Only remove the 'contextmenu' listener if the tooltip is not shown. When
    // the tooltip *is* shown, listener is removed in the close method.
    if (!this.isShown()) {
      this.adapter.deregisterWindowEventHandler(
          'contextmenu', this.preventContextMenuOnLongTouch);
    }
  }

  handleAnchorFocus(evt: FocusEvent) {
    // TODO(b/157075286): Need to add some way to distinguish keyboard
    // navigation focus events from other focus events, and only show the
    // tooltip on the former of these events.

    // Do not show tooltip if the previous focus was on a tooltip element. This
    // occurs when a rich tooltip is closed and focus is restored to the anchor
    // or when user tab-navigates back into the anchor from the rich tooltip.
    if (this.tooltipContainsRelatedTargetElement(evt.relatedTarget)) {
      return;
    }
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.showDelayMs);
  }

  handleAnchorMouseLeave() {
    this.clearShowTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelayMs);
  }

  handleAnchorClick() {
    if (this.tooltipShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  handleDocumentClick(evt: MouseEvent) {
    // For persistent rich tooltips, we will not hide if:
    // - The click target is within the anchor element. Otherwise, both
    //   the anchor element's click handler and this handler will handle the
    //   click (due to event propagation), resulting in a shown tooltip
    //   being immediately hidden if the tooltip was initially hidden.
    // - The click target is within the tooltip element, since clicks
    //   on the tooltip do not close the tooltip.
    if (this.richTooltip && this.persistentTooltip &&
        this.anchorOrTooltipContainsTargetElement(evt.target)) {
      return;
    }
    // Hide the tooltip immediately on click.
    this.hide();
  }

  handleKeydown(evt: KeyboardEvent) {
    // Hide the tooltip immediately on ESC key.
    const key = normalizeKey(evt);
    if (key === KEY.ESCAPE) {
      const activeElement = this.adapter.getActiveElement();
      let tooltipContainsActiveElement = false;
      if (this.adapter.isInstanceOfElement(activeElement)) {
        tooltipContainsActiveElement =
            this.adapter.tooltipContainsElement((activeElement as Element));
      }

      if (tooltipContainsActiveElement) {
        this.adapter.focusAnchorElement();
      }
      this.hide();
    }
  }

  private handleAnchorBlur(evt: FocusEvent) {
    if (this.richTooltip) {
      // If focus changed to the tooltip element, don't hide the tooltip.
      if (this.tooltipContainsRelatedTargetElement(evt.relatedTarget)) {
        return;
      }
      if (evt.relatedTarget === null && this.interactiveTooltip) {
        // If evt.relatedTarget is null, it is because focus is moving to an
        // element that is not focusable. This should only occur in instances
        // of a screen reader in browse mode/linear navigation mode. If the
        // tooltip is interactive (and so the entire content is not read by
        // the screen reader upon the tooltip being opened), we want to allow
        // users to read the content of the tooltip (and not just the focusable
        // elements).
        return;
      }
    }
    // Hide tooltip immediately on focus change.
    this.hide();
  }

  private handleTooltipMouseEnter() {
    this.show();
  }

  private handleTooltipMouseLeave() {
    this.clearShowTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelayMs);
  }

  private handleRichTooltipFocusOut(evt: FocusEvent) {
    // If the focus is still within the anchor or the tooltip, do not hide the
    // tooltip.
    if (this.anchorOrTooltipContainsTargetElement(evt.relatedTarget)) {
      return;
    }
    if (evt.relatedTarget === null && this.interactiveTooltip) {
      // If evt.relatedTarget is null, it is because focus is moving to an
      // element that is not focusable. This should only occur in instances
      // of a screen reader in browse mode/linear navigation mode. If the
      // tooltip is interactive (and so the entire content is not read by
      // the screen reader upon the tooltip being opened), we want to allow
      // users to read the content of the tooltip (and not just the focusable
      // elements).
      return;
    }

    this.hide();
  }

  private handleWindowScrollEvent() {
    if (this.persistentTooltip) {
      // Persistent tooltips remain visible on user scroll, call appropriate
      // handler to ensure the tooltip remains pinned to the anchor on page
      // scroll.
      this.handleWindowChangeEvent();
      return;
    }

    this.hide();
  }

  /**
   * On window resize or scroll, check the anchor position and size and
   * repostion tooltip if necessary.
   */
  private handleWindowChangeEvent() {
    // Since scroll and resize events can fire at a high rate, we throttle
    // the potential re-positioning of tooltip component using
    // requestAnimationFrame.
    this.animFrame.request(AnimationKeys.POLL_ANCHOR, () => {
      this.repositionTooltipOnAnchorMove();
    });
  }

  show() {
    this.clearHideTimeout();
    this.clearShowTimeout();

    if (this.tooltipShown) {
      return;
    }

    this.tooltipShown = true;
    this.adapter.removeAttribute('aria-hidden');

    if (this.richTooltip) {
      if (this.interactiveTooltip) {
        this.adapter.setAnchorAttribute('aria-expanded', 'true');
      }
      this.adapter.registerEventHandler(
          'focusout', this.richTooltipFocusOutHandler);
    }

    if (!this.persistentTooltip) {
      this.adapter.registerEventHandler(
          'mouseenter', this.tooltipMouseEnterHandler);
      this.adapter.registerEventHandler(
          'mouseleave', this.tooltipMouseLeaveHandler);
    }

    this.adapter.removeClass(HIDE);
    this.adapter.addClass(SHOWING);
    if (this.isTooltipMultiline() && !this.richTooltip) {
      this.adapter.addClass(MULTILINE_TOOLTIP);
    }
    this.anchorRect = this.adapter.getAnchorBoundingRect();
    this.parentRect = this.adapter.getParentBoundingRect();
    this.richTooltip ? this.positionRichTooltip() : this.positionPlainTooltip();
    this.adapter.registerAnchorEventHandler('blur', this.anchorBlurHandler);
    this.adapter.registerDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.registerDocumentEventHandler(
        'keydown', this.documentKeydownHandler);

    this.adapter.registerWindowEventHandler('scroll', this.windowScrollHandler);
    this.adapter.registerWindowEventHandler('resize', this.windowResizeHandler);
    // Register any additional scroll handlers
    for (const fn of this.addAncestorScrollEventListeners) {
      fn();
    }

    this.frameId = requestAnimationFrame(() => {
      this.clearAllAnimationClasses();
      this.adapter.addClass(SHOWN);
      this.adapter.addClass(SHOWING_TRANSITION);
    });
  }

  hide() {
    this.clearHideTimeout();
    this.clearShowTimeout();

    if (!this.tooltipShown) {
      return;
    }

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }

    this.tooltipShown = false;
    this.adapter.setAttribute('aria-hidden', 'true');
    this.adapter.deregisterEventHandler(
        'focusout', this.richTooltipFocusOutHandler);
    if (this.richTooltip) {
      if (this.interactiveTooltip) {
        this.adapter.setAnchorAttribute('aria-expanded', 'false');
      }
    }

    if (!this.persistentTooltip) {
      this.adapter.deregisterEventHandler(
          'mouseenter', this.tooltipMouseEnterHandler);
      this.adapter.deregisterEventHandler(
          'mouseleave', this.tooltipMouseLeaveHandler);
    }

    this.clearAllAnimationClasses();
    this.adapter.addClass(HIDE);
    this.adapter.addClass(HIDE_TRANSITION);
    this.adapter.removeClass(SHOWN);

    this.adapter.deregisterAnchorEventHandler('blur', this.anchorBlurHandler);
    this.adapter.deregisterDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.deregisterDocumentEventHandler(
        'keydown', this.documentKeydownHandler);
    this.adapter.deregisterWindowEventHandler(
        'scroll', this.windowScrollHandler);
    this.adapter.deregisterWindowEventHandler(
        'resize', this.windowResizeHandler);
    this.adapter.deregisterWindowEventHandler(
        'contextmenu', this.preventContextMenuOnLongTouch);

    // Deregister any additional scroll handlers
    for (const fn of this.removeAncestorScrollEventListeners) {
      fn();
    }
  }

  handleTransitionEnd() {
    const isHidingTooltip = this.adapter.hasClass(HIDE);

    this.adapter.removeClass(SHOWING);
    this.adapter.removeClass(SHOWING_TRANSITION);
    this.adapter.removeClass(HIDE);
    this.adapter.removeClass(HIDE_TRANSITION);

    // If handleTransitionEnd is called after hiding the tooltip, the tooltip
    // will have the HIDE class (before calling the adapter removeClass method).
    // If tooltip is now hidden, send a notification that the animation has
    // completed and the tooltip is no longer visible.
    // We don't send a notification of the animation completing if a showTimeout
    // value is set -- this happens when a user triggers a tooltip to be shown
    // while that tooltip is fading. Once this hide transition is completed,
    // that same tooltip will be re-shown.
    if (isHidingTooltip && this.showTimeout === null) {
      this.adapter.notifyHidden();
    } else if (!isHidingTooltip) {
      this.adapter.notifyShown();
    }
  }

  private clearAllAnimationClasses() {
    this.adapter.removeClass(SHOWING_TRANSITION);
    this.adapter.removeClass(HIDE_TRANSITION);
  }

  setTooltipPosition(position: {
    xPos?: XPosition,
    yPos?: YPosition,
    withCaretPos?: PositionWithCaret
  }) {
    const {xPos, yPos, withCaretPos} = position;
    if (this.hasCaret && withCaretPos) {
      this.tooltipPositionWithCaret = withCaretPos;
      return;
    }

    if (xPos) {
      this.xTooltipPos = xPos;
    }

    if (yPos) {
      this.yTooltipPos = yPos;
    }
  }

  setAnchorBoundaryType(type: AnchorBoundaryType) {
    if (type === AnchorBoundaryType.UNBOUNDED) {
      this.anchorGap = numbers.UNBOUNDED_ANCHOR_GAP;
    } else {
      this.anchorGap = numbers.BOUNDED_ANCHOR_GAP;
    }
  }

  setShowDelay(delayMs: number) {
    this.showDelayMs = delayMs;
  }

  setHideDelay(delayMs: number) {
    this.hideDelayMs = delayMs;
  }

  private isTooltipMultiline() {
    const tooltipSize = this.adapter.getTooltipSize();
    return tooltipSize.height > numbers.MIN_HEIGHT &&
        tooltipSize.width >= numbers.MAX_WIDTH;
  }

  private positionPlainTooltip() {
    // A plain tooltip has `fixed` positioning and is placed as an immediate
    // child of the document body. Its positioning is calculated with respect to
    // the viewport.
    const {top, yTransformOrigin, left, xTransformOrigin} =
        this.calculateTooltipStyles(this.anchorRect);

    const transformProperty =
        HAS_WINDOW ? getCorrectPropertyName(window, 'transform') : 'transform';
    this.adapter.setSurfaceAnimationStyleProperty(
        `${transformProperty}-origin`,
        `${xTransformOrigin} ${yTransformOrigin}`);
    this.adapter.setStyleProperty('top', `${top}px`);
    this.adapter.setStyleProperty('left', `${left}px`);
  }

  private positionRichTooltip() {
    // TODO(b/177686782): Remove width setting when max-content is used to style
    // the rich tooltip.

    // Reset rich tooltip positioning/styling so we can get an accurate
    // measurement of the rich tooltip width. Toolip has to be moved to the left
    // to ensure that the parent component does not restrict the size of the
    // tooltip. See b/245915536 for more info.
    this.adapter.setStyleProperty('width', '');
    this.adapter.setStyleProperty('left', `-${numbers.RICH_MAX_WIDTH}px`);
    // getComputedStyleProperty is used instead of getTooltipSize since
    // getTooltipSize returns the offSetWidth, which includes the border and
    // padding. What we need is the width of the tooltip without border and
    // padding.
    const width = this.adapter.getComputedStyleProperty('width');
    // When rich tooltips are positioned within their parent containers, the
    // tooltip width might be shrunk if it collides with the edge of the parent
    // container. We set the width of the tooltip to prevent this.
    this.adapter.setStyleProperty('width', width);

    const {top, yTransformOrigin, left, xTransformOrigin} = this.hasCaret ?
        this.calculateTooltipWithCaretStyles(this.anchorRect) :
        this.calculateTooltipStyles(this.anchorRect);

    const transformProperty =
        HAS_WINDOW ? getCorrectPropertyName(window, 'transform') : 'transform';
    this.adapter.setSurfaceAnimationStyleProperty(
        `${transformProperty}-origin`,
        `${xTransformOrigin} ${yTransformOrigin}`);
    // A rich tooltip has `absolute` positioning and is placed as a sibling to
    // the anchor element. Its positioning is calculated with respect to the
    // parent element, and so the values need to be adjusted against the parent
    // element.
    const leftAdjustment = left - (this.parentRect?.left ?? 0);
    const topAdjustment = top - (this.parentRect?.top ?? 0);
    this.adapter.setStyleProperty('top', `${topAdjustment}px`);
    this.adapter.setStyleProperty('left', `${leftAdjustment}px`);
  }

  /**
   * Calculates the position of the tooltip. A tooltip will be placed
   * beneath the anchor element and aligned either with the 'start'/'end'
   * edge of the anchor element or the 'center'.
   *
   * Tooltip alignment is selected such that the tooltip maintains a
   * threshold distance away from the viewport (defaulting to 'center'
   * alignment). If the placement of the anchor prevents this threshold
   * distance from being maintained, the tooltip is positioned so that it
   * does not collide with the viewport.
   *
   * Users can specify an alignment, however, if this alignment results in
   * the tooltip colliding with the viewport, this specification is
   * overwritten.
   */
  private calculateTooltipStyles(anchorRect: DOMRect|null) {
    if (!anchorRect) {
      return {top: 0, left: 0};
    }

    const tooltipSize = this.adapter.getTooltipSize();
    const top = this.calculateYTooltipDistance(anchorRect, tooltipSize.height);
    const left = this.calculateXTooltipDistance(anchorRect, tooltipSize.width);

    return {
      top: top.distance,
      yTransformOrigin: top.yTransformOrigin,
      left: left.distance,
      xTransformOrigin: left.xTransformOrigin
    };
  }

  /**
   * Calculates the `left` distance for the tooltip.
   * Returns the distance value and a string indicating the x-axis transform-
   * origin that should be used when animating the tooltip.
   */
  private calculateXTooltipDistance(anchorRect: DOMRect, tooltipWidth: number):
      ({distance: number, xTransformOrigin: string}) {
    const isLTR = !this.adapter.isRTL();
    let startPos: number|undefined, endPos: number|undefined,
        centerPos: number|undefined, sideStartPos: number|undefined,
        sideEndPos: number|undefined;
    let startTransformOrigin: string, endTransformOrigin: string;
    if (this.richTooltip) {
      startPos = isLTR ? anchorRect.left - tooltipWidth : anchorRect.right;
      endPos = isLTR ? anchorRect.right : anchorRect.left - tooltipWidth;

      startTransformOrigin = isLTR ? strings.RIGHT : strings.LEFT;
      endTransformOrigin = isLTR ? strings.LEFT : strings.RIGHT;
    } else {
      startPos = isLTR ? anchorRect.left : anchorRect.right - tooltipWidth;
      endPos = isLTR ? anchorRect.right - tooltipWidth : anchorRect.left;
      centerPos = anchorRect.left + (anchorRect.width - tooltipWidth) / 2;

      const sideLeftAligned = anchorRect.left - (tooltipWidth + this.anchorGap);
      const sideRightAligned = anchorRect.right + this.anchorGap;
      sideStartPos = isLTR ? sideLeftAligned : sideRightAligned;
      sideEndPos = isLTR ? sideRightAligned : sideLeftAligned;

      startTransformOrigin = isLTR ? strings.LEFT : strings.RIGHT;
      endTransformOrigin = isLTR ? strings.RIGHT : strings.LEFT;
    }
    // For plain tooltips, centerPos is defined
    const plainTooltipPosOptions = [startPos, centerPos!, endPos];

    // Side positioning should only be considered if it is specified by the
    // client.
    if (this.xTooltipPos === XPosition.SIDE_START) {
      plainTooltipPosOptions.push(sideStartPos!);
    } else if (this.xTooltipPos === XPosition.SIDE_END) {
      plainTooltipPosOptions.push(sideEndPos!);
    }

    const positionOptions = this.richTooltip ?
        this.determineValidPositionOptions(startPos, endPos) :
        this.determineValidPositionOptions(...plainTooltipPosOptions);

    if (this.xTooltipPos === XPosition.START && positionOptions.has(startPos)) {
      return {distance: startPos, xTransformOrigin: startTransformOrigin};
    } else if (
        this.xTooltipPos === XPosition.END && positionOptions.has(endPos)) {
      return {distance: endPos, xTransformOrigin: endTransformOrigin};
    } else if (
        this.xTooltipPos === XPosition.CENTER &&
        positionOptions.has(centerPos)) {
      // This code path is only executed if calculating the distance for plain
      // tooltips. In this instance, centerPos will always be defined, so we can
      // safely assert that the returned value is non-null/undefined.
      return {distance: centerPos!, xTransformOrigin: strings.CENTER};
    } else if (
        this.xTooltipPos === XPosition.SIDE_START &&
        positionOptions.has(sideStartPos)) {
      // This code path is only executed if calculating the distance for plain
      // tooltips. In this instance, sideStartPos will always be defined, so we
      // can safely assert that the returned value is non-null/undefined.
      return {distance: sideStartPos!, xTransformOrigin: endTransformOrigin};
    } else if (
        this.xTooltipPos === XPosition.SIDE_END &&
        positionOptions.has(sideEndPos)) {
      // This code path is only executed if calculating the distance for plain
      // tooltips. In this instance, sideEndPos will always be defined, so we
      // can safely assert that the returned value is non-null/undefined.
      return {distance: sideEndPos!, xTransformOrigin: startTransformOrigin};
    }

    // If no user position is supplied, rich tooltips default to end pos, then
    // start position. Plain tooltips default to center, start, then end.
    const possiblePositions = this.richTooltip ?
        [
          {distance: endPos, xTransformOrigin: endTransformOrigin},
          {distance: startPos, xTransformOrigin: startTransformOrigin}
        ] :
        [
          {distance: centerPos!, xTransformOrigin: strings.CENTER},
          {distance: startPos, xTransformOrigin: startTransformOrigin},
          {distance: endPos, xTransformOrigin: endTransformOrigin}
        ];

    const validPosition =
        possiblePositions.find(({distance}) => positionOptions.has(distance));
    if (validPosition) {
      return validPosition;
    }

    // Indicates that all potential positions would result in the tooltip
    // colliding with the viewport. This would only occur when the anchor
    // element itself collides with the viewport, or the viewport is very
    // narrow. In this case, we allow the tooltip to be mis-aligned from the
    // anchor element.
    if (anchorRect.left < 0) {
      return {
        distance: this.minViewportTooltipThreshold,
        xTransformOrigin: strings.LEFT
      };
    } else {
      const viewportWidth = this.adapter.getViewportWidth();
      const distance =
          viewportWidth - (tooltipWidth + this.minViewportTooltipThreshold);
      return {distance, xTransformOrigin: strings.RIGHT};
    }
  }

  /**
   * Given the values for the horizontal alignments of the tooltip, calculates
   * which of these options would result in the tooltip maintaining the required
   * threshold distance vs which would result in the tooltip staying within the
   * viewport.
   *
   * A Set of values is returned holding the distances that would honor the
   * above requirements. Following the logic for determining the tooltip
   * position, if all alignments violate the threshold, then the returned Set
   * contains values that keep the tooltip within the viewport.
   */
  private determineValidPositionOptions(...positions: number[]) {
    const posWithinThreshold = new Set();
    const posWithinViewport = new Set();

    for (const position of positions) {
      if (this.positionHonorsViewportThreshold(position)) {
        posWithinThreshold.add(position);
      } else if (this.positionDoesntCollideWithViewport(position)) {
        posWithinViewport.add(position);
      }
    }

    return posWithinThreshold.size ? posWithinThreshold : posWithinViewport;
  }

  private positionHonorsViewportThreshold(leftPos: number) {
    const viewportWidth = this.adapter.getViewportWidth();
    const tooltipWidth = this.adapter.getTooltipSize().width;

    return leftPos + tooltipWidth <=
        viewportWidth - this.minViewportTooltipThreshold &&
        leftPos >= this.minViewportTooltipThreshold;
  }

  private positionDoesntCollideWithViewport(leftPos: number) {
    const viewportWidth = this.adapter.getViewportWidth();
    const tooltipWidth = this.adapter.getTooltipSize().width;

    return leftPos + tooltipWidth <= viewportWidth && leftPos >= 0;
  }

  /**
   * Calculates the `top` distance for the tooltip.
   * Returns the distance value and a string indicating the y-axis transform-
   * origin that should be used when animating the tooltip.
   */
  private calculateYTooltipDistance(
      anchorRect: DOMRect, tooltipHeight: number) {
    const belowYPos = anchorRect.bottom + this.anchorGap;
    const aboveYPos = anchorRect.top - (this.anchorGap + tooltipHeight);
    const anchorMidpoint = anchorRect.top + anchorRect.height / 2;
    const sideYPos = anchorMidpoint - (tooltipHeight / 2);
    const posOptions = [aboveYPos, belowYPos];
    if (this.yTooltipPos === YPosition.SIDE) {
      // Side positioning should only be considered if it is specified by the
      // client.
      posOptions.push(sideYPos);
    }
    const yPositionOptions = this.determineValidYPositionOptions(...posOptions);

    if (this.yTooltipPos === YPosition.ABOVE &&
        yPositionOptions.has(aboveYPos)) {
      return {distance: aboveYPos, yTransformOrigin: strings.BOTTOM};
    } else if (
        this.yTooltipPos === YPosition.BELOW &&
        yPositionOptions.has(belowYPos)) {
      return {distance: belowYPos, yTransformOrigin: strings.TOP};
    } else if (
        this.yTooltipPos === YPosition.SIDE && yPositionOptions.has(sideYPos)) {
      return {distance: sideYPos, yTransformOrigin: strings.CENTER};
    }

    if (yPositionOptions.has(belowYPos)) {
      return {distance: belowYPos, yTransformOrigin: strings.TOP};
    }

    if (yPositionOptions.has(aboveYPos)) {
      return {distance: aboveYPos, yTransformOrigin: strings.BOTTOM};
    }

    // Indicates that all potential positions would result in the tooltip
    // colliding with the viewport. This would only occur when the viewport is
    // very short.
    return {distance: belowYPos, yTransformOrigin: strings.TOP};
  }

  /**
   * Given the values for above/below alignment of the tooltip, calculates
   * which of these options would result in the tooltip maintaining the required
   * threshold distance vs which would result in the tooltip staying within the
   * viewport.
   *
   * A Set of values is returned holding the distances that would honor the
   * above requirements. Following the logic for determining the tooltip
   * position, if all possible alignments violate the threshold, then the
   * returned Set contains values that keep the tooltip within the viewport.
   */
  private determineValidYPositionOptions(...positions: number[]) {
    const posWithinThreshold = new Set();
    const posWithinViewport = new Set();
    for (const position of positions) {
      if (this.yPositionHonorsViewportThreshold(position)) {
        posWithinThreshold.add(position);
      } else if (this.yPositionDoesntCollideWithViewport(position)) {
        posWithinViewport.add(position);
      }
    }
    return posWithinThreshold.size ? posWithinThreshold : posWithinViewport;
  }

  private yPositionHonorsViewportThreshold(yPos: number) {
    const viewportHeight = this.adapter.getViewportHeight();
    const tooltipHeight = this.adapter.getTooltipSize().height;

    return yPos + tooltipHeight + this.minViewportTooltipThreshold <=
        viewportHeight &&
        yPos >= this.minViewportTooltipThreshold;
  }

  private yPositionDoesntCollideWithViewport(yPos: number) {
    const viewportHeight = this.adapter.getViewportHeight();
    const tooltipHeight = this.adapter.getTooltipSize().height;

    return yPos + tooltipHeight <= viewportHeight && yPos >= 0;
  }

  private calculateTooltipWithCaretStyles(anchorRect: DOMRect|null) {
    // Prior to grabbing the caret bounding rect, we clear all styles set on the
    // caret. This will ensure the width/height is consistent (since we rotate
    // the caret 90deg in some positions which would result in the height and
    // width bounding rect measurements flipping).
    this.adapter.clearTooltipCaretStyles();
    const caretSize = this.adapter.getTooltipCaretBoundingRect();
    if (!anchorRect || !caretSize) {
      return {position: PositionWithCaret.DETECTED, top: 0, left: 0};
    }

    // The caret for the rich tooltip is created by rotating/skewing/scaling
    // square div into a diamond shape and then hiding half of it so it looks
    // like a triangle. We use the boundingClientRect to calculate the
    // width/height of the element after the transforms (to the caret) have been
    // applied. Since the full tooltip is scaled by 0.8 for the entrance
    // animation, we divide by this value to retrieve the actual caret
    // dimensions.
    const caretWidth = caretSize.width / numbers.ANIMATION_SCALE;
    // Since we hide half of caret, we divide the returned DOMRect height
    // by 2.
    const caretHeight = (caretSize.height / numbers.ANIMATION_SCALE) / 2;
    const tooltipSize = this.adapter.getTooltipSize();

    const yOptions = this.calculateYWithCaretDistanceOptions(
        anchorRect, tooltipSize.height, {caretWidth, caretHeight});
    const xOptions = this.calculateXWithCaretDistanceOptions(
        anchorRect, tooltipSize.width, {caretWidth, caretHeight});

    let positionOptions =
        this.validateTooltipWithCaretDistances(yOptions, xOptions);
    if (positionOptions.size < 1) {
      positionOptions = this.generateBackupPositionOption(
          anchorRect, tooltipSize, {caretWidth, caretHeight});
    }

    const {position, xDistance, yDistance} =
        this.determineTooltipWithCaretDistance(positionOptions);

    // After determining the position of the tooltip relative to the anchor,
    // place the caret in the corresponding position and retrieve the necessary
    // x/y transform origins needed to properly animate the tooltip entrance.
    const {yTransformOrigin, xTransformOrigin} =
        this.setCaretPositionStyles(position, {caretWidth, caretHeight});

    return {
      yTransformOrigin,
      xTransformOrigin,
      top: yDistance,
      left: xDistance
    };
  }

  private calculateXWithCaretDistanceOptions(
      anchorRect: DOMRect, tooltipWidth: number,
      caretSize: {caretHeight: number, caretWidth: number}):
      Map<XPositionWithCaret, number> {
    const {caretWidth, caretHeight} = caretSize;
    const isLTR = !this.adapter.isRTL();
    const anchorMidpoint = anchorRect.left + anchorRect.width / 2;

    const sideLeftAligned =
        anchorRect.left - (tooltipWidth + this.anchorGap + caretHeight);
    const sideRightAligned = anchorRect.right + this.anchorGap + caretHeight;
    const sideStartPos = isLTR ? sideLeftAligned : sideRightAligned;
    const sideEndPos = isLTR ? sideRightAligned : sideLeftAligned;

    const verticalLeftAligned =
        anchorMidpoint - (numbers.CARET_INDENTATION + caretWidth / 2);
    const verticalRightAligned = anchorMidpoint -
        (tooltipWidth - numbers.CARET_INDENTATION - caretWidth / 2);
    const verticalStartPos = isLTR ? verticalLeftAligned : verticalRightAligned;
    const verticalEndPos = isLTR ? verticalRightAligned : verticalLeftAligned;
    const verticalCenterPos = anchorMidpoint - tooltipWidth / 2;

    const possiblePositionsMap = new Map([
      [XPositionWithCaret.START, verticalStartPos],
      [XPositionWithCaret.CENTER, verticalCenterPos],
      [XPositionWithCaret.END, verticalEndPos],
      [XPositionWithCaret.SIDE_END, sideEndPos],
      [XPositionWithCaret.SIDE_START, sideStartPos],
    ]);
    return possiblePositionsMap;
  }

  private calculateYWithCaretDistanceOptions(
      anchorRect: DOMRect, tooltipHeight: number,
      caretSize: {caretHeight: number, caretWidth: number}):
      Map<YPositionWithCaret, number> {
    const {caretWidth, caretHeight} = caretSize;
    const anchorMidpoint = anchorRect.top + anchorRect.height / 2;

    const belowYPos = anchorRect.bottom + this.anchorGap + caretHeight;
    const aboveYPos =
        anchorRect.top - (this.anchorGap + tooltipHeight + caretHeight);
    const sideTopYPos =
        anchorMidpoint - (numbers.CARET_INDENTATION + caretWidth / 2);
    const sideCenterYPos = anchorMidpoint - (tooltipHeight / 2);
    const sideBottomYPos = anchorMidpoint -
        (tooltipHeight - numbers.CARET_INDENTATION - caretWidth / 2);

    const possiblePositionsMap = new Map([
      [YPositionWithCaret.ABOVE, aboveYPos],
      [YPositionWithCaret.BELOW, belowYPos],
      [YPositionWithCaret.SIDE_TOP, sideTopYPos],
      [YPositionWithCaret.SIDE_CENTER, sideCenterYPos],
      [YPositionWithCaret.SIDE_BOTTOM, sideBottomYPos],
    ]);

    return possiblePositionsMap;
  }

  private repositionTooltipOnAnchorMove() {
    const newAnchorRect = this.adapter.getAnchorBoundingRect();
    if (!newAnchorRect || !this.anchorRect) return;

    if (newAnchorRect.top !== this.anchorRect.top ||
        newAnchorRect.left !== this.anchorRect.left ||
        newAnchorRect.height !== this.anchorRect.height ||
        newAnchorRect.width !== this.anchorRect.width) {
      this.anchorRect = newAnchorRect;
      this.parentRect = this.adapter.getParentBoundingRect();
      this.richTooltip ? this.positionRichTooltip() :
                         this.positionPlainTooltip();
    }
  }

  /**
   * Given a list of x/y position options for a rich tooltip with caret, checks
   * if valid x/y combinations of these position options are either within the
   * viewport threshold, or simply within the viewport. Returns a map with the
   * valid x/y position combinations that all either honor the viewport
   * threshold or are simply inside within the viewport.
   */
  private validateTooltipWithCaretDistances(
      yOptions: Map<YPositionWithCaret, number>,
      xOptions: Map<XPositionWithCaret, number>) {
    const posWithinThreshold =
        new Map<PositionWithCaret, {xDistance: number, yDistance: number}>();
    const posWithinViewport =
        new Map<PositionWithCaret, {xDistance: number, yDistance: number}>();

    // If a tooltip has a caret, not all combinations of YPositionWithCarets and
    // XPositionWithCarets are possible. Because of this we only check the
    // validity of a given XPositionWithCaret if a potential corresponding
    // YPositionWithCaret is valid.
    const validMappings = new Map([
      [
        YPositionWithCaret.ABOVE,
        [
          XPositionWithCaret.START, XPositionWithCaret.CENTER,
          XPositionWithCaret.END
        ]
      ],
      [
        YPositionWithCaret.BELOW,
        [
          XPositionWithCaret.START, XPositionWithCaret.CENTER,
          XPositionWithCaret.END
        ]
      ],
      [
        YPositionWithCaret.SIDE_TOP,
        [XPositionWithCaret.SIDE_START, XPositionWithCaret.SIDE_END]
      ],
      [
        YPositionWithCaret.SIDE_CENTER,
        [XPositionWithCaret.SIDE_START, XPositionWithCaret.SIDE_END]
      ],
      [
        YPositionWithCaret.SIDE_BOTTOM,
        [XPositionWithCaret.SIDE_START, XPositionWithCaret.SIDE_END]
      ],
    ]);

    // TODO(b/227383292): Handle instances where one direction can fit in
    // in the viewport (whether honoring the threshold or not), and the
    // other direction does not.
    for (const y of validMappings.keys()) {
      const yDistance = yOptions.get(y)!;
      if (this.yPositionHonorsViewportThreshold(yDistance)) {
        for (const x of validMappings.get(y)!) {
          const xDistance = xOptions.get(x)!;
          if (this.positionHonorsViewportThreshold(xDistance)) {
            const caretPositionName = this.caretPositionOptionsMapping(x, y);
            posWithinThreshold.set(caretPositionName, {xDistance, yDistance});
          }
        }
      }

      if (this.yPositionDoesntCollideWithViewport(yDistance)) {
        for (const x of validMappings.get(y)!) {
          const xDistance = xOptions.get(x)!;
          if (this.positionDoesntCollideWithViewport(xDistance)) {
            const caretPositionName = this.caretPositionOptionsMapping(x, y);
            posWithinViewport.set(caretPositionName, {xDistance, yDistance});
          }
        }
      }
    }

    return posWithinThreshold.size ? posWithinThreshold : posWithinViewport;
  }

  /**
   * Method for generating a horizontal and vertical position for the tooltip if
   * all other calculated values are considered invalid. This would only happen
   * in situations of very small viewports/large tooltips.
   */
  private generateBackupPositionOption(
      anchorRect: DOMRect, tooltipSize: {width: number, height: number},
      caretSize: {caretHeight: number, caretWidth: number}) {
    const isLTR = !this.adapter.isRTL();
    let xDistance: number;
    let xPos: XPositionWithCaret;
    if (anchorRect.left < 0) {
      xDistance = this.minViewportTooltipThreshold + caretSize.caretHeight;
      xPos = isLTR ? XPositionWithCaret.END : XPositionWithCaret.START;
    } else {
      const viewportWidth = this.adapter.getViewportWidth();
      xDistance = viewportWidth -
          (tooltipSize.width + this.minViewportTooltipThreshold +
           caretSize.caretHeight);
      xPos = isLTR ? XPositionWithCaret.START : XPositionWithCaret.END;
    }

    let yDistance: number;
    let yPos: YPositionWithCaret;
    if (anchorRect.top < 0) {
      yDistance = this.minViewportTooltipThreshold + caretSize.caretHeight;
      yPos = YPositionWithCaret.BELOW;
    } else {
      const viewportHeight = this.adapter.getViewportHeight();
      yDistance = viewportHeight -
          (tooltipSize.height + this.minViewportTooltipThreshold +
           caretSize.caretHeight);
      yPos = YPositionWithCaret.ABOVE;
    }

    const caretPositionName = this.caretPositionOptionsMapping(xPos, yPos);
    return new Map<PositionWithCaret, {xDistance: number, yDistance: number}>(
        [[caretPositionName, {xDistance, yDistance}]]);
  }

  /**
   * Given a list of valid position options for a rich tooltip with caret,
   * returns the option that should be used.
   */
  private determineTooltipWithCaretDistance(
      options: Map<PositionWithCaret, {xDistance: number, yDistance: number}>):
      {position: PositionWithCaret, xDistance: number, yDistance: number} {
    if (options.has(this.tooltipPositionWithCaret)) {
      const tooltipPos = options.get(this.tooltipPositionWithCaret)!;
      return {
        position: this.tooltipPositionWithCaret,
        xDistance: tooltipPos.xDistance,
        yDistance: tooltipPos.yDistance,
      };
    }

    const orderPref = [
      PositionWithCaret.ABOVE_START, PositionWithCaret.ABOVE_CENTER,
      PositionWithCaret.ABOVE_END, PositionWithCaret.TOP_SIDE_START,
      PositionWithCaret.CENTER_SIDE_START, PositionWithCaret.BOTTOM_SIDE_START,
      PositionWithCaret.TOP_SIDE_END, PositionWithCaret.CENTER_SIDE_END,
      PositionWithCaret.BOTTOM_SIDE_END, PositionWithCaret.BELOW_START,
      PositionWithCaret.BELOW_CENTER, PositionWithCaret.BELOW_END
    ];

    // Before calling this method we check whether or not the "options" param
    // is empty and invoke a different method. We, therefore, can be certain
    // that "validPosition" will always be defined.
    const validPosition = orderPref.find((pos) => options.has(pos))!;
    const pos = options.get(validPosition)!;
    return {
      position: validPosition,
      xDistance: pos.xDistance,
      yDistance: pos.yDistance,
    };
  }

  /**
   * Returns the corresponding PositionWithCaret enum for the proivded
   * XPositionWithCaret and YPositionWithCaret enums. This mapping exists so our
   * public API accepts only PositionWithCaret enums (as all combinations of
   * XPositionWithCaret and YPositionWithCaret are not valid), but internally we
   * can calculate the X and Y positions of a rich tooltip with caret
   * separately.
   */
  private caretPositionOptionsMapping(
      xPos: XPositionWithCaret, yPos: YPositionWithCaret): PositionWithCaret {
    switch (yPos) {
      case YPositionWithCaret.ABOVE:
        if (xPos === XPositionWithCaret.START) {
          return PositionWithCaret.ABOVE_START;
        } else if (xPos === XPositionWithCaret.CENTER) {
          return PositionWithCaret.ABOVE_CENTER;
        } else if (xPos === XPositionWithCaret.END) {
          return PositionWithCaret.ABOVE_END;
        }
        break;
      case YPositionWithCaret.BELOW:
        if (xPos === XPositionWithCaret.START) {
          return PositionWithCaret.BELOW_START;
        } else if (xPos === XPositionWithCaret.CENTER) {
          return PositionWithCaret.BELOW_CENTER;
        } else if (xPos === XPositionWithCaret.END) {
          return PositionWithCaret.BELOW_END;
        }
        break;
      case YPositionWithCaret.SIDE_TOP:
        if (xPos === XPositionWithCaret.SIDE_START) {
          return PositionWithCaret.TOP_SIDE_START;
        } else if (xPos === XPositionWithCaret.SIDE_END) {
          return PositionWithCaret.TOP_SIDE_END;
        }
        break;
      case YPositionWithCaret.SIDE_CENTER:
        if (xPos === XPositionWithCaret.SIDE_START) {
          return PositionWithCaret.CENTER_SIDE_START;
        } else if (xPos === XPositionWithCaret.SIDE_END) {
          return PositionWithCaret.CENTER_SIDE_END;
        }
        break;
      case YPositionWithCaret.SIDE_BOTTOM:
        if (xPos === XPositionWithCaret.SIDE_START) {
          return PositionWithCaret.BOTTOM_SIDE_START;
        } else if (xPos === XPositionWithCaret.SIDE_END) {
          return PositionWithCaret.BOTTOM_SIDE_END;
        }
        break;
      default:
        break;
    }
    throw new Error(
        `MDCTooltipFoundation: Invalid caret position of ${xPos}, ${yPos}`);
  }

  /**
   * Given a PositionWithCaret, applies the correct styles to the caret element
   * so that it is positioned properly on the rich tooltip.
   * Returns the x and y positions of the caret, to be used as the
   * transform-origin on the tooltip itself for entrance animations.
   */
  private setCaretPositionStyles(position: PositionWithCaret, caretSize: {
    caretWidth: number,
    caretHeight: number
  }) {
    const values = this.calculateCaretPositionOnTooltip(position, caretSize);
    if (!values) {
      return {yTransformOrigin: 0, xTransformOrigin: 0};
    }
    // Prior to setting the caret position styles, clear any previous styles
    // set. This is necessary as all position options do not use the same
    // properties (e.g. using 'left' or 'right') and so old style properties
    // might not get overridden, causing misplaced carets.
    this.adapter.clearTooltipCaretStyles();

    this.adapter.setTooltipCaretStyle(values.yAlignment, values.yAxisPx);
    this.adapter.setTooltipCaretStyle(values.xAlignment, values.xAxisPx);
    // Value of scaleX is cos(skew), Math.cos() expects radians though, so we
    // must first convert the skew value (which is in degrees) to radians.
    const skewRadians = values.skew * (Math.PI / 180);
    const scaleX = Math.cos(skewRadians);

    this.adapter.setTooltipCaretStyle(
        'transform',
        `rotate(${values.rotation}deg) skewY(${values.skew}deg) scaleX(${
            scaleX})`);
    this.adapter.setTooltipCaretStyle(
        'transform-origin', `${values.xAlignment} ${values.yAlignment}`);
    for (const corner of values.caretCorners) {
      this.adapter.setTooltipCaretStyle(corner, '0');
    }
    return {
      yTransformOrigin: values.yTransformOrigin,
      xTransformOrigin: values.xTransformOrigin
    };
  }

  /**
   * Given a PositionWithCaret, determines the correct styles to position the
   * caret properly on the rich tooltip.
   */
  private calculateCaretPositionOnTooltip(
      tooltipPos: PositionWithCaret,
      caretSize: {caretWidth: number, caretHeight: number}): CaretPosOnTooltip
      |undefined {
    const isLTR = !this.adapter.isRTL();
    const tooltipWidth = this.adapter.getComputedStyleProperty('width');
    const tooltipHeight = this.adapter.getComputedStyleProperty('height');
    if (!tooltipWidth || !tooltipHeight || !caretSize) {
      return;
    }

    const midpointWidth =
        `calc((${tooltipWidth} - ${caretSize.caretWidth}px) / 2)`;
    const midpointHeight =
        `calc((${tooltipHeight} - ${caretSize.caretWidth}px) / 2)`;
    const flushWithEdge = '0';
    const indentedFromEdge = `${numbers.CARET_INDENTATION}px`;
    const indentedFromWidth = `calc(${tooltipWidth} - ${indentedFromEdge})`;
    const indentedFromHeight = `calc(${tooltipHeight} - ${indentedFromEdge})`;
    const verticalRotation = 35;
    const horizontalRotation = Math.abs(90 - verticalRotation);
    const bottomRightTopLeftBorderRadius =
        ['border-bottom-right-radius', 'border-top-left-radius'];
    const bottomLeftTopRightBorderRadius =
        ['border-bottom-left-radius', 'border-top-right-radius'];
    const skewDeg = 20;

    switch (tooltipPos) {
      case PositionWithCaret.BELOW_CENTER:
        return {
          yAlignment: strings.TOP,
          xAlignment: strings.LEFT,
          yAxisPx: flushWithEdge,
          xAxisPx: midpointWidth,
          rotation: -1 * verticalRotation,
          skew: -1 * skewDeg,
          xTransformOrigin: midpointWidth,
          yTransformOrigin: flushWithEdge,
          caretCorners: bottomRightTopLeftBorderRadius,
        };
      case PositionWithCaret.BELOW_END:
        return {
          yAlignment: strings.TOP,
          xAlignment: isLTR ? strings.RIGHT : strings.LEFT,
          yAxisPx: flushWithEdge,
          xAxisPx: indentedFromEdge,
          rotation: isLTR ? verticalRotation : -1 * verticalRotation,
          skew: isLTR ? skewDeg : -1 * skewDeg,
          xTransformOrigin: isLTR ? indentedFromWidth : indentedFromEdge,
          yTransformOrigin: flushWithEdge,
          caretCorners: isLTR ? bottomLeftTopRightBorderRadius :
                                bottomRightTopLeftBorderRadius,
        };
      case PositionWithCaret.BELOW_START:
        return {
          yAlignment: strings.TOP,
          xAlignment: isLTR ? strings.LEFT : strings.RIGHT,
          yAxisPx: flushWithEdge,
          xAxisPx: indentedFromEdge,
          rotation: isLTR ? -1 * verticalRotation : verticalRotation,
          skew: isLTR ? -1 * skewDeg : skewDeg,
          xTransformOrigin: isLTR ? indentedFromEdge : indentedFromWidth,
          yTransformOrigin: flushWithEdge,
          caretCorners: isLTR ? bottomRightTopLeftBorderRadius :
                                bottomLeftTopRightBorderRadius,
        };

      case PositionWithCaret.TOP_SIDE_END:
        return {
          yAlignment: strings.TOP,
          xAlignment: isLTR ? strings.LEFT : strings.RIGHT,
          yAxisPx: indentedFromEdge,
          xAxisPx: flushWithEdge,
          rotation: isLTR ? horizontalRotation : -1 * horizontalRotation,
          skew: isLTR ? -1 * skewDeg : skewDeg,
          xTransformOrigin: isLTR ? flushWithEdge : tooltipWidth,
          yTransformOrigin: indentedFromEdge,
          caretCorners: isLTR ? bottomRightTopLeftBorderRadius :
                                bottomLeftTopRightBorderRadius,
        };
      case PositionWithCaret.CENTER_SIDE_END:
        return {
          yAlignment: strings.TOP,
          xAlignment: isLTR ? strings.LEFT : strings.RIGHT,
          yAxisPx: midpointHeight,
          xAxisPx: flushWithEdge,
          rotation: isLTR ? horizontalRotation : -1 * horizontalRotation,
          skew: isLTR ? -1 * skewDeg : skewDeg,
          xTransformOrigin: isLTR ? flushWithEdge : tooltipWidth,
          yTransformOrigin: midpointHeight,
          caretCorners: isLTR ? bottomRightTopLeftBorderRadius :
                                bottomLeftTopRightBorderRadius,
        };
      case PositionWithCaret.BOTTOM_SIDE_END:
        return {
          yAlignment: strings.BOTTOM,
          xAlignment: isLTR ? strings.LEFT : strings.RIGHT,
          yAxisPx: indentedFromEdge,
          xAxisPx: flushWithEdge,
          rotation: isLTR ? -1 * horizontalRotation : horizontalRotation,
          skew: isLTR ? skewDeg : -1 * skewDeg,
          xTransformOrigin: isLTR ? flushWithEdge : tooltipWidth,
          yTransformOrigin: indentedFromHeight,
          caretCorners: isLTR ? bottomLeftTopRightBorderRadius :
                                bottomRightTopLeftBorderRadius,
        };

      case PositionWithCaret.TOP_SIDE_START:
        return {
          yAlignment: strings.TOP,
          xAlignment: isLTR ? strings.RIGHT : strings.LEFT,
          yAxisPx: indentedFromEdge,
          xAxisPx: flushWithEdge,
          rotation: isLTR ? -1 * horizontalRotation : horizontalRotation,
          skew: isLTR ? skewDeg : -1 * skewDeg,
          xTransformOrigin: isLTR ? tooltipWidth : flushWithEdge,
          yTransformOrigin: indentedFromEdge,
          caretCorners: isLTR ? bottomLeftTopRightBorderRadius :
                                bottomRightTopLeftBorderRadius,
        };
      case PositionWithCaret.CENTER_SIDE_START:
        return {
          yAlignment: strings.TOP,
          xAlignment: isLTR ? strings.RIGHT : strings.LEFT,
          yAxisPx: midpointHeight,
          xAxisPx: flushWithEdge,
          rotation: isLTR ? -1 * horizontalRotation : horizontalRotation,
          skew: isLTR ? skewDeg : -1 * skewDeg,
          xTransformOrigin: isLTR ? tooltipWidth : flushWithEdge,
          yTransformOrigin: midpointHeight,
          caretCorners: isLTR ? bottomLeftTopRightBorderRadius :
                                bottomRightTopLeftBorderRadius,
        };
      case PositionWithCaret.BOTTOM_SIDE_START:
        return {
          yAlignment: strings.BOTTOM,
          xAlignment: isLTR ? strings.RIGHT : strings.LEFT,
          yAxisPx: indentedFromEdge,
          xAxisPx: flushWithEdge,
          rotation: isLTR ? horizontalRotation : -1 * horizontalRotation,
          skew: isLTR ? -1 * skewDeg : skewDeg,
          xTransformOrigin: isLTR ? tooltipWidth : flushWithEdge,
          yTransformOrigin: indentedFromHeight,
          caretCorners: isLTR ? bottomRightTopLeftBorderRadius :
                                bottomLeftTopRightBorderRadius,
        };

      case PositionWithCaret.ABOVE_CENTER:
        return {
          yAlignment: strings.BOTTOM,
          xAlignment: strings.LEFT,
          yAxisPx: flushWithEdge,
          xAxisPx: midpointWidth,
          rotation: verticalRotation,
          skew: skewDeg,
          xTransformOrigin: midpointWidth,
          yTransformOrigin: tooltipHeight,
          caretCorners: bottomLeftTopRightBorderRadius,
        };
      case PositionWithCaret.ABOVE_END:
        return {
          yAlignment: strings.BOTTOM,
          xAlignment: isLTR ? strings.RIGHT : strings.LEFT,
          yAxisPx: flushWithEdge,
          xAxisPx: indentedFromEdge,
          rotation: isLTR ? -1 * verticalRotation : verticalRotation,
          skew: isLTR ? -1 * skewDeg : skewDeg,
          xTransformOrigin: isLTR ? indentedFromWidth : indentedFromEdge,
          yTransformOrigin: tooltipHeight,
          caretCorners: isLTR ? bottomRightTopLeftBorderRadius :
                                bottomLeftTopRightBorderRadius,
        };
      default:
      case PositionWithCaret.ABOVE_START:
        return {
          yAlignment: strings.BOTTOM,
          xAlignment: isLTR ? strings.LEFT : strings.RIGHT,
          yAxisPx: flushWithEdge,
          xAxisPx: indentedFromEdge,
          rotation: isLTR ? verticalRotation : -1 * verticalRotation,
          skew: isLTR ? skewDeg : -1 * skewDeg,
          xTransformOrigin: isLTR ? indentedFromEdge : indentedFromWidth,
          yTransformOrigin: tooltipHeight,
          caretCorners: isLTR ? bottomLeftTopRightBorderRadius :
                                bottomRightTopLeftBorderRadius,
        };
    }
  }

  private clearShowTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  private clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Method that allows user to specify additional elements that should have a
   * scroll event listener attached to it. This should be used in instances
   * where the anchor element is placed inside a scrollable container, and will
   * ensure that the tooltip will stay attached to the anchor on scroll.
   */
  attachScrollHandler(
      addEventListenerFn: <K extends EventType>(
          event: K, handler: SpecificEventListener<K>) => void) {
    this.addAncestorScrollEventListeners.push(() => {
      addEventListenerFn('scroll', this.windowScrollHandler);
    });
  }

  /**
   * Must be used in conjunction with #attachScrollHandler. Removes the scroll
   * event handler from elements on the page.
   */
  removeScrollHandler(
      removeEventHandlerFn: <K extends EventType>(
          event: K, handler: SpecificEventListener<K>) => void) {
    this.removeAncestorScrollEventListeners.push(() => {
      removeEventHandlerFn('scroll', this.windowScrollHandler);
    });
  }


  override destroy() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.clearHideTimeout();
    this.clearShowTimeout();

    this.adapter.removeClass(SHOWN);
    this.adapter.removeClass(SHOWING_TRANSITION);
    this.adapter.removeClass(SHOWING);
    this.adapter.removeClass(HIDE);
    this.adapter.removeClass(HIDE_TRANSITION);

    if (this.richTooltip) {
      this.adapter.deregisterEventHandler(
          'focusout', this.richTooltipFocusOutHandler);
    }

    if (!this.persistentTooltip) {
      this.adapter.deregisterEventHandler(
          'mouseenter', this.tooltipMouseEnterHandler);
      this.adapter.deregisterEventHandler(
          'mouseleave', this.tooltipMouseLeaveHandler);
    }

    this.adapter.deregisterAnchorEventHandler('blur', this.anchorBlurHandler);

    this.adapter.deregisterDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.deregisterDocumentEventHandler(
        'keydown', this.documentKeydownHandler);

    this.adapter.deregisterWindowEventHandler(
        'scroll', this.windowScrollHandler);
    this.adapter.deregisterWindowEventHandler(
        'resize', this.windowResizeHandler);
    for (const fn of this.removeAncestorScrollEventListeners) {
      fn();
    }

    this.animFrame.cancelAll();
  }
}

interface CaretPosOnTooltip {
  // Either 'top' or 'bottom', indicating which should be used with the yAxisPx
  // value to position the caret.
  yAlignment: string;
  // Either 'left' or 'right', indicating which should be used with the xAxisPx
  // value to position the caret.
  xAlignment: string;
  // Indicates the vertical px alignment of the caret.
  yAxisPx: string;
  // Indicates the horizontal px alignment of the caret.
  xAxisPx: string;
  // Value (in degrees) by which the caret will be rotated.
  rotation: number;
  // Value (in degrees) by which the caret will be skewed.
  skew: number;
  // The x-axis of the transform-origin property for the whole tooltip. This
  // ensures that, during the opening animation of the tooltip, it expands from
  // the caret.
  xTransformOrigin: string;
  // The y-axis of the transform-origin property for the whole tooltip. This
  // ensures that, during the opening animation of the tooltip, it expands from
  // the caret.
  yTransformOrigin: string;
  // List of border-radius properites (e.g. border-radius-top-left, etc) that
  // indicate which corners of the caret element should have a border-radius of
  // 0. Certain corners use a 0 border radius to ensure a clean junction between
  // the tooltip and the caret.
  caretCorners: Array<string>;
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTooltipFoundation;
