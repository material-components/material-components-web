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

import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';
import {KEY, normalizeKey} from '@material/dom/keyboard';
import {MDCTooltipAdapter} from './adapter';
import {AnchorBoundaryType, cssClasses, numbers, Position} from './constants';

const {SHOWN, SHOWING, HIDE} = cssClasses;

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
      isRTL: () => false,
      registerDocumentEventHandler: () => undefined,
      deregisterDocumentEventHandler: () => undefined,
      notifyHidden: () => undefined,
    };
  }

  private isShown = false;
  private anchorGap = numbers.BOUNDED_ANCHOR_GAP;
  private tooltipPos = Position.DETECTED;
  // Minimum threshold distance needed between the tooltip and the viewport.
  private readonly minViewportTooltipThreshold =
      numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD;
  private readonly hideDelayMs = numbers.HIDE_DELAY_MS;

  private frameId: number|null = null;
  private hideTimeout: number|null = null;
  private readonly documentClickHandler: SpecificEventListener<'click'>;
  private readonly documentKeydownHandler: SpecificEventListener<'keydown'>;

  constructor(adapter?: Partial<MDCTooltipAdapter>) {
    super({...MDCTooltipFoundation.defaultAdapter, ...adapter});

    this.documentClickHandler = () => {
      this.handleClick();
    };

    this.documentKeydownHandler = (evt) => {
      this.handleKeydown(evt);
    };
  }

  handleAnchorMouseEnter() {
    this.show();
  }

  handleAnchorFocus() {
    // TODO(b/157075286): Need to add some way to distinguish keyboard
    // navigation focus events from other focus events, and only show the
    // tooltip on the former of these events.
    this.show();
  }

  handleAnchorMouseLeave() {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelayMs);
  }

  handleAnchorBlur() {
    // Hide tooltip immediately on focus change.
    this.hide();
  }

  handleClick() {
    // Hide the tooltip immediately on click.
    this.hide();
  }

  handleKeydown(evt: KeyboardEvent) {
    // Hide the tooltip immediately on ESC key.
    const key = normalizeKey(evt);
    if (key === KEY.ESCAPE) {
      this.hide();
    }
  }

  show() {
    this.clearHideTimeout();

    if (this.isShown) {
      return;
    }

    this.isShown = true;
    this.adapter.setAttribute('aria-hidden', 'false');
    this.adapter.removeClass(HIDE);
    this.adapter.addClass(SHOWING);
    const {top, left} = this.calculateTooltipDistance();
    this.adapter.setStyleProperty('top', `${top}px`);
    this.adapter.setStyleProperty('left', `${left}px`);

    this.adapter.registerDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.registerDocumentEventHandler(
        'keydown', this.documentKeydownHandler);

    this.frameId = requestAnimationFrame(() => {
      this.adapter.addClass(SHOWN);
    });
  }

  hide() {
    this.clearHideTimeout();

    if (!this.isShown) {
      return;
    }

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }

    this.isShown = false;
    this.adapter.setAttribute('aria-hidden', 'true');
    this.adapter.addClass(HIDE);
    this.adapter.removeClass(SHOWN);

    this.adapter.deregisterDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.deregisterDocumentEventHandler(
        'keydown', this.documentKeydownHandler);
  }

  handleTransitionEnd() {
    const isHidingTooltip = this.adapter.hasClass(HIDE);

    this.adapter.removeClass(SHOWING);
    this.adapter.removeClass(HIDE);

    // If handleTransitionEnd is called after hiding the tooltip, the tooltip
    // will have the HIDE class (before calling the adapter removeClass method).
    // If tooltip is now hidden, send a notification that the animation has
    // completed and the tooltip is no longer visible.
    if (isHidingTooltip) {
      this.adapter.notifyHidden();
    }
  }

  setTooltipPosition(pos: Position) {
    this.tooltipPos = pos;
  }

  setAnchorBoundaryType(type: AnchorBoundaryType) {
    if (type === AnchorBoundaryType.UNBOUNDED) {
      this.anchorGap = numbers.UNBOUNDED_ANCHOR_GAP;
    } else {
      this.anchorGap = numbers.BOUNDED_ANCHOR_GAP;
    }
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
  private calculateTooltipDistance() {
    const anchorRect = this.adapter.getAnchorBoundingRect();
    const tooltipSize = this.adapter.getTooltipSize();
    if (!anchorRect) {
      return {top: 0, left: 0};
    }
    const yPos = anchorRect.bottom + this.anchorGap;

    let startPos = anchorRect.left;
    let endPos = anchorRect.right - tooltipSize.width;
    const centerPos =
        anchorRect.left + (anchorRect.width - tooltipSize.width) / 2;

    if (this.adapter.isRTL()) {
      startPos = anchorRect.right - tooltipSize.width;
      endPos = anchorRect.left;
    }

    const positionOptions =
        this.determineValidPositionOptions(centerPos, startPos, endPos);

    if (this.tooltipPos === Position.START && positionOptions.has(startPos)) {
      return {top: yPos, left: startPos};
    }
    if (this.tooltipPos === Position.END && positionOptions.has(endPos)) {
      return {top: yPos, left: endPos};
    }
    if (this.tooltipPos === Position.CENTER && positionOptions.has(centerPos)) {
      return {top: yPos, left: centerPos};
    }

    if (positionOptions.has(centerPos)) {
      return {top: yPos, left: centerPos};
    }
    if (positionOptions.has(startPos)) {
      return {top: yPos, left: startPos};
    }
    if (positionOptions.has(endPos)) {
      return {top: yPos, left: endPos};
    }

    // Indicates that all potential positions would result in the tooltip
    // colliding with the viewport. This would only occur when the anchor
    // element itself collides with the viewport, or the viewport is very
    // narrow.
    return {top: yPos, left: centerPos};
  }

  /**
   * Given the values for center/start/end alignment of the tooltip, calculates
   * which of these options would result in the tooltip maintaining the required
   * threshold distance vs which would result in the tooltip staying within the
   * viewport.
   *
   * A Set of values is returned holding the distances that would honor the
   * above requirements. Following the logic for determining the tooltip
   * position, if all three alignments violate the threshold, then the returned
   * Set contains values that keep the tooltip within the viewport.
   */
  private determineValidPositionOptions(
      centerPos: number, startPos: number, endPos: number) {
    const posWithinThreshold = new Set();
    const posWithinViewport = new Set();

    if (this.positionHonorsViewportThreshold(centerPos)) {
      posWithinThreshold.add(centerPos);
    } else if (this.positionDoesntCollideWithViewport(centerPos)) {
      posWithinViewport.add(centerPos);
    }

    if (this.positionHonorsViewportThreshold(startPos)) {
      posWithinThreshold.add(startPos);
    } else if (this.positionDoesntCollideWithViewport(startPos)) {
      posWithinViewport.add(startPos);
    }

    if (this.positionHonorsViewportThreshold(endPos)) {
      posWithinThreshold.add(endPos);
    } else if (this.positionDoesntCollideWithViewport(endPos)) {
      posWithinViewport.add(endPos);
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

    this.adapter.removeClass(SHOWN);
    this.adapter.removeClass(SHOWING);
    this.adapter.removeClass(HIDE);

    this.adapter.deregisterDocumentEventHandler(
        'click', this.documentClickHandler);
    this.adapter.deregisterDocumentEventHandler(
        'keydown', this.documentKeydownHandler);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTooltipFoundation;
