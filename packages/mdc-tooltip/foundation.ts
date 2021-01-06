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
import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';
import {KEY, normalizeKey} from '@material/dom/keyboard';

import {MDCTooltipAdapter} from './adapter';
import {AnchorBoundaryType, attributes, CssClasses, numbers, XPosition, YPosition} from './constants';
import {ShowTooltipOptions} from './types';

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

export class MDCTooltipFoundation extends MDCFoundation<MDCTooltipAdapter> {
  static get defaultAdapter(): MDCTooltipAdapter {
    return {
      getAttribute: () => null,
      setAttribute: () => undefined,
      addClass: () => undefined,
      hasClass: () => false,
      removeClass: () => undefined,
      setStyleProperty: () => undefined,
      getViewportWidth: () => 0,
      getViewportHeight: () => 0,
      getTooltipSize: () => ({width: 0, height: 0}),
      getAnchorBoundingRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0}),
      getAnchorAttribute: () => null,
      setAnchorAttribute: () => null,
      isRTL: () => false,
      anchorContainsElement: () => false,
      tooltipContainsElement: () => false,
      focusAnchorElement: () => undefined,
      registerEventHandler: () => undefined,
      deregisterEventHandler: () => undefined,
      registerDocumentEventHandler: () => undefined,
      deregisterDocumentEventHandler: () => undefined,
      registerWindowEventHandler: () => undefined,
      deregisterWindowEventHandler: () => undefined,
      notifyHidden: () => undefined,
    };
  }

  private interactiveTooltip!: boolean;  // assigned in init()
  private richTooltip!: boolean;         // assigned in init()
  private persistentTooltip!: boolean;   // assigned in init()
  private tooltipShown = false;
  private anchorGap = numbers.BOUNDED_ANCHOR_GAP;
  private xTooltipPos = XPosition.DETECTED;
  private yTooltipPos = YPosition.DETECTED;
  // Minimum threshold distance needed between the tooltip and the viewport.
  private readonly minViewportTooltipThreshold =
      numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD;
  private readonly hideDelayMs = numbers.HIDE_DELAY_MS;
  private readonly showDelayMs = numbers.SHOW_DELAY_MS;

  private anchorRect: ClientRect|null = null;
  private frameId: number|null = null;
  private hideTimeout: number|null = null;
  private showTimeout: number|null = null;
  private readonly animFrame: AnimationFrame;
  private readonly documentClickHandler: SpecificEventListener<'click'>;
  private readonly documentKeydownHandler: SpecificEventListener<'keydown'>;
  private readonly richTooltipMouseEnterHandler:
      SpecificEventListener<'mouseenter'>;
  private readonly richTooltipMouseLeaveHandler:
      SpecificEventListener<'mouseleave'>;
  private readonly richTooltipFocusOutHandler:
      SpecificEventListener<'focusout'>;
  private readonly windowScrollHandler: SpecificEventListener<'scroll'>;
  private readonly windowResizeHandler: SpecificEventListener<'resize'>;

  constructor(adapter?: Partial<MDCTooltipAdapter>) {
    super({...MDCTooltipFoundation.defaultAdapter, ...adapter});
    this.animFrame = new AnimationFrame();

    this.documentClickHandler = (evt) => {
      this.handleDocumentClick(evt);
    };

    this.documentKeydownHandler = (evt) => {
      this.handleKeydown(evt);
    };

    this.richTooltipMouseEnterHandler = () => {
      this.handleRichTooltipMouseEnter();
    };

    this.richTooltipMouseLeaveHandler = () => {
      this.handleRichTooltipMouseLeave();
    };

    this.richTooltipFocusOutHandler = (evt) => {
      this.handleRichTooltipFocusOut(evt);
    };

    this.windowScrollHandler = () => {
      this.handleWindowChangeEvent();
    };

    this.windowResizeHandler = () => {
      this.handleWindowChangeEvent();
    };
  }

  init() {
    this.richTooltip = this.adapter.hasClass(RICH);
    this.persistentTooltip =
        this.adapter.getAttribute(attributes.PERSISTENT) === 'true';
    this.interactiveTooltip =
        !!this.adapter.getAnchorAttribute(attributes.ARIA_EXPANDED) &&
        this.adapter.getAnchorAttribute(attributes.ARIA_HASPOPUP) === 'true';
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

  handleAnchorFocus(evt: FocusEvent) {
    // TODO(b/157075286): Need to add some way to distinguish keyboard
    // navigation focus events from other focus events, and only show the
    // tooltip on the former of these events.
    const {relatedTarget} = evt;
    const tooltipContainsRelatedTarget = relatedTarget instanceof HTMLElement &&
        this.adapter.tooltipContainsElement(relatedTarget);
    // Do not show tooltip if the previous focus was on a tooltip element. This
    // occurs when a rich tooltip is closed and focus is restored to the anchor
    // or when user tab-navigates back into the anchor from the rich tooltip.
    if (tooltipContainsRelatedTarget) {
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

  handleAnchorBlur(evt: FocusEvent) {
    if (this.richTooltip) {
      const tooltipContainsRelatedTargetElement =
          evt.relatedTarget instanceof HTMLElement &&
          this.adapter.tooltipContainsElement(evt.relatedTarget);
      // If focus changed to the tooltip element, don't hide the tooltip.
      if (tooltipContainsRelatedTargetElement) {
        return;
      }
    }
    // Hide tooltip immediately on focus change.
    this.hide();
  }

  handleAnchorClick() {
    if (this.tooltipShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  handleDocumentClick(evt: MouseEvent) {
    const anchorOrTooltipContainsTargetElement =
        evt.target instanceof HTMLElement &&
        (this.adapter.anchorContainsElement(evt.target) ||
         this.adapter.tooltipContainsElement(evt.target));
    // For persistent rich tooltips, we will not hide if:
    // - The click target is within the anchor element. Otherwise, both
    //   the anchor element's click handler and this handler will handle the
    //   click (due to event propagation), resulting in a shown tooltip
    //   being immediately hidden if the tooltip was initially hidden.
    // - The click target is within the tooltip element, since clicks
    //   on the tooltip do not close the tooltip.
    if (this.richTooltip && this.persistentTooltip &&
        anchorOrTooltipContainsTargetElement) {
      return;
    }
    // Hide the tooltip immediately on click.
    this.hide();
  }

  handleKeydown(evt: KeyboardEvent) {
    // Hide the tooltip immediately on ESC key.
    const key = normalizeKey(evt);
    if (key === KEY.ESCAPE) {
      const tooltipContainsActiveElement =
          document.activeElement instanceof HTMLElement &&
          this.adapter.tooltipContainsElement(document.activeElement);
      if (tooltipContainsActiveElement) {
        this.adapter.focusAnchorElement();
      }
      this.hide();
    }
  }

  private handleRichTooltipMouseEnter() {
    this.show();
  }

  private handleRichTooltipMouseLeave() {
    this.clearShowTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelayMs);
  }

  private handleRichTooltipFocusOut(evt: FocusEvent) {
    const anchorOrTooltipContainsRelatedTargetElement =
        evt.relatedTarget instanceof HTMLElement &&
        (this.adapter.anchorContainsElement(evt.relatedTarget) ||
         this.adapter.tooltipContainsElement(evt.relatedTarget));
    // If the focus is still within the anchor or the tooltip, do not hide the
    // tooltip.
    if (anchorOrTooltipContainsRelatedTargetElement) {
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
    const showTooltipOptions = this.parseShowTooltipOptions();
    if (!showTooltipOptions.hideFromScreenreader) {
      this.adapter.setAttribute('aria-hidden', 'false');
    }
    if (this.richTooltip) {
      if (this.interactiveTooltip) {
        this.adapter.setAnchorAttribute('aria-expanded', 'true');
      }
      this.adapter.registerEventHandler(
          'focusout', this.richTooltipFocusOutHandler);
      if (!this.persistentTooltip) {
        this.adapter.registerEventHandler(
            'mouseenter', this.richTooltipMouseEnterHandler);
        this.adapter.registerEventHandler(
            'mouseleave', this.richTooltipMouseLeaveHandler);
      }
    }
    this.adapter.removeClass(HIDE);
    this.adapter.addClass(SHOWING);
    if (this.isTooltipMultiline() && !this.richTooltip) {
      this.adapter.addClass(MULTILINE_TOOLTIP);
    }
    this.anchorRect = this.adapter.getAnchorBoundingRect();
    this.positionTooltip();

    this.adapter.registerDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.registerDocumentEventHandler(
        'keydown', this.documentKeydownHandler);

    this.adapter.registerWindowEventHandler('scroll', this.windowScrollHandler);
    this.adapter.registerWindowEventHandler('resize', this.windowResizeHandler);

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
      if (!this.persistentTooltip) {
        this.adapter.deregisterEventHandler(
            'mouseenter', this.richTooltipMouseEnterHandler);
        this.adapter.deregisterEventHandler(
            'mouseleave', this.richTooltipMouseLeaveHandler);
      }
    }
    this.clearAllAnimationClasses();
    this.adapter.addClass(HIDE);
    this.adapter.addClass(HIDE_TRANSITION);
    this.adapter.removeClass(SHOWN);

    this.adapter.deregisterDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.deregisterDocumentEventHandler(
        'keydown', this.documentKeydownHandler);
    this.adapter.deregisterWindowEventHandler(
        'scroll', this.windowScrollHandler);
    this.adapter.deregisterWindowEventHandler(
        'resize', this.windowResizeHandler);
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
    if (isHidingTooltip) {
      this.adapter.notifyHidden();
    }
  }

  private clearAllAnimationClasses() {
    this.adapter.removeClass(SHOWING_TRANSITION);
    this.adapter.removeClass(HIDE_TRANSITION);
  }

  setTooltipPosition(position: {xPos?: XPosition, yPos?: YPosition}) {
    const {xPos, yPos} = position;
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

  private parseShowTooltipOptions(): ShowTooltipOptions {
    const hideFromScreenreader =
        Boolean(this.adapter.getAnchorAttribute('data-tooltip-id'));
    return {hideFromScreenreader};
  }

  private isTooltipMultiline() {
    const tooltipSize = this.adapter.getTooltipSize();
    return tooltipSize.height > numbers.MIN_HEIGHT &&
        tooltipSize.width >= numbers.MAX_WIDTH;
  }

  private positionTooltip() {
    const {top, left} = this.calculateTooltipDistance(this.anchorRect);
    this.adapter.setStyleProperty('top', `${top}px`);
    this.adapter.setStyleProperty('left', `${left}px`);
  }

  /**
   * Calculates the position of the tooltip. A tooltip will be placed beneath
   * the anchor element and aligned either with the 'start'/'end' edge of the
   * anchor element or the 'center'.
   *
   * Tooltip alignment is selected such that the tooltip maintains a threshold
   * distance away from the viewport (defaulting to 'center' alignment). If the
   * placement of the anchor prevents this threshold distance from being
   * maintained, the tooltip is positioned so that it does not collide with the
   * viewport.
   *
   * Users can specify an alignment, however, if this alignment results in the
   * tooltip colliding with the viewport, this specification is overwritten.
   */
  private calculateTooltipDistance(anchorRect: ClientRect|null) {
    if (!anchorRect) {
      return {top: 0, left: 0};
    }

    const tooltipSize = this.adapter.getTooltipSize();
    const top = this.calculateYTooltipDistance(anchorRect, tooltipSize.height);
    const left = this.calculateXTooltipDistance(anchorRect, tooltipSize.width);
    return {top, left};
  }

  /**
   * Calculates the `left` distance for the tooltip.
   */
  private calculateXTooltipDistance(
      anchorRect: ClientRect, tooltipWidth: number) {
    const isLTR = !this.adapter.isRTL();
    let startPos, endPos, centerPos: number|undefined;
    if (this.richTooltip) {
      startPos = isLTR ? anchorRect.left - tooltipWidth : anchorRect.right;
      endPos = isLTR ? anchorRect.right : anchorRect.left - tooltipWidth;
    } else {
      startPos = isLTR ? anchorRect.left : anchorRect.right - tooltipWidth;
      endPos = isLTR ? anchorRect.right - tooltipWidth : anchorRect.left;
      centerPos = anchorRect.left + (anchorRect.width - tooltipWidth) / 2;
    }

    const positionOptions = this.richTooltip ?
        this.determineValidPositionOptions(startPos, endPos) :
        // For plain tooltips, centerPos is defined
        this.determineValidPositionOptions(centerPos!, startPos, endPos);

    if (this.xTooltipPos === XPosition.START && positionOptions.has(startPos)) {
      return startPos;
    }
    if (this.xTooltipPos === XPosition.END && positionOptions.has(endPos)) {
      return endPos;
    }
    if (this.xTooltipPos === XPosition.CENTER &&
        positionOptions.has(centerPos)) {
      return centerPos;
    }

    // If no user position is supplied, rich tooltips default to end pos, then
    // start position. Plain tooltips default to center, start, then end.
    const possiblePositions =
        this.richTooltip ? [endPos, startPos] : [centerPos, startPos, endPos];

    const validPosition =
        possiblePositions.find(pos => positionOptions.has(pos));
    if (validPosition) {
      return validPosition;
    }

    // Indicates that all potential positions would result in the tooltip
    // colliding with the viewport. This would only occur when the anchor
    // element itself collides with the viewport, or the viewport is very
    // narrow. In this case, we allow the tooltip to be mis-aligned from the
    // anchor element.
    if (anchorRect.left < 0) {
      return this.minViewportTooltipThreshold;
    } else {
      const viewportWidth = this.adapter.getViewportWidth();
      return viewportWidth - (tooltipWidth + this.minViewportTooltipThreshold);
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
   */
  private calculateYTooltipDistance(
      anchorRect: ClientRect, tooltipHeight: number) {
    const belowYPos = anchorRect.bottom + this.anchorGap;
    const aboveYPos = anchorRect.top - (this.anchorGap + tooltipHeight);
    const yPositionOptions =
        this.determineValidYPositionOptions(aboveYPos, belowYPos);

    if (this.yTooltipPos === YPosition.ABOVE &&
        yPositionOptions.has(aboveYPos)) {
      return aboveYPos;
    } else if (
        this.yTooltipPos === YPosition.BELOW &&
        yPositionOptions.has(belowYPos)) {
      return belowYPos;
    }

    if (yPositionOptions.has(belowYPos)) {
      return belowYPos;
    }

    if (yPositionOptions.has(aboveYPos)) {
      return aboveYPos;
    }

    // Indicates that all potential positions would result in the tooltip
    // colliding with the viewport. This would only occur when the viewport is
    // very short.
    return belowYPos;
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
  private determineValidYPositionOptions(
      aboveAnchorPos: number, belowAnchorPos: number) {
    const posWithinThreshold = new Set();
    const posWithinViewport = new Set();

    if (this.yPositionHonorsViewportThreshold(aboveAnchorPos)) {
      posWithinThreshold.add(aboveAnchorPos);
    } else if (this.yPositionDoesntCollideWithViewport(aboveAnchorPos)) {
      posWithinViewport.add(aboveAnchorPos);
    }

    if (this.yPositionHonorsViewportThreshold(belowAnchorPos)) {
      posWithinThreshold.add(belowAnchorPos);
    } else if (this.yPositionDoesntCollideWithViewport(belowAnchorPos)) {
      posWithinViewport.add(belowAnchorPos);
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

  private repositionTooltipOnAnchorMove() {
    const newAnchorRect = this.adapter.getAnchorBoundingRect();
    if (!newAnchorRect || !this.anchorRect) return;

    if (newAnchorRect.top !== this.anchorRect.top ||
        newAnchorRect.left !== this.anchorRect.left ||
        newAnchorRect.height !== this.anchorRect.height ||
        newAnchorRect.width !== this.anchorRect.width) {
      this.anchorRect = newAnchorRect;
      this.positionTooltip();
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

  destroy() {
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
      if (!this.persistentTooltip) {
        this.adapter.deregisterEventHandler(
            'mouseenter', this.richTooltipMouseEnterHandler);
        this.adapter.deregisterEventHandler(
            'mouseleave', this.richTooltipMouseLeaveHandler);
      }
    }

    this.adapter.deregisterDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.deregisterDocumentEventHandler(
        'keydown', this.documentKeydownHandler);

    this.adapter.deregisterWindowEventHandler(
        'scroll', this.windowScrollHandler);
    this.adapter.deregisterWindowEventHandler(
        'resize', this.windowResizeHandler);

    this.animFrame.cancelAll();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTooltipFoundation;
