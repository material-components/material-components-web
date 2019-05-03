/**
 * @license
 * Copyright 2017 Google Inc.
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
import {MDCToolbarAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

interface Calculations {
  toolbarRowHeight: number;

  /*
   * Calculated height ratios. We use ratio to calculate corresponding heights in resize event.
   */

  /** The ratio of toolbar height to row height. */
  toolbarRatio: number;

  /** The ratio of flexible space height to row height. */
  flexibleExpansionRatio: number;

  /** The ratio of max toolbar move up distance to row height. */
  maxTranslateYRatio: number;

  /** The ratio of max scrollTop that we should listen to to row height. */
  scrollThresholdRatio: number;

  /*
   * Derived heights based on the above ratios.
   */

  toolbarHeight: number;

  /** Flexible row minus toolbar height (derived). */
  flexibleExpansionHeight: number;

  /** When toolbar only fix last row (derived). */
  maxTranslateYDistance: number;

  scrollThreshold: number;
}

export class MDCToolbarFoundation extends MDCFoundation<MDCToolbarAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter(): MDCToolbarAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      hasClass: () => false,
      addClass: () => undefined,
      removeClass: () => undefined,
      registerScrollHandler: () => undefined,
      deregisterScrollHandler: () => undefined,
      registerResizeHandler: () => undefined,
      deregisterResizeHandler: () => undefined,
      getViewportWidth: () => 0,
      getViewportScrollY: () => 0,
      getOffsetHeight: () => 0,
      getFirstRowElementOffsetHeight: () => 0,
      notifyChange: () => undefined,
      setStyle: () => undefined,
      setStyleForTitleElement: () => undefined,
      setStyleForFlexibleRowElement: () => undefined,
      setStyleForFixedAdjustElement: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private checkRowHeightFrame_ = 0;
  private scrollFrame_ = 0;
  private executedLastChange_ = false;
  private isFixed_ = false;
  private isFixedLastRow_ = false;
  private hasFlexibleFirstRow_ = false;
  private useFlexDefaultBehavior_ = false;
  private calculations_: Calculations = {
    flexibleExpansionHeight: 0,
    flexibleExpansionRatio: 0,
    maxTranslateYDistance: 0,
    maxTranslateYRatio: 0,
    scrollThreshold: 0,
    scrollThresholdRatio: 0,
    toolbarHeight: 0,
    toolbarRatio: 0,
    toolbarRowHeight: 0,
  };

  private resizeHandler_!: SpecificEventListener<'resize'>; // assigned in init()
  private scrollHandler_!: SpecificEventListener<'scroll'>; // assigned in init()

  constructor(adapter?: Partial<MDCToolbarAdapter>) {
    super({...MDCToolbarFoundation.defaultAdapter, ...adapter});
  }

  init() {
    this.isFixed_ = this.adapter_.hasClass(cssClasses.FIXED);
    this.isFixedLastRow_ = this.adapter_.hasClass(cssClasses.FIXED_LASTROW) && this.isFixed_;
    this.hasFlexibleFirstRow_ = this.adapter_.hasClass(cssClasses.TOOLBAR_ROW_FLEXIBLE);

    if (this.hasFlexibleFirstRow_) {
      this.useFlexDefaultBehavior_ = this.adapter_.hasClass(cssClasses.FLEXIBLE_DEFAULT_BEHAVIOR);
    }

    this.resizeHandler_ = () => this.checkRowHeight_();
    this.scrollHandler_ = () => this.updateToolbarStyles_();

    this.adapter_.registerResizeHandler(this.resizeHandler_);
    this.adapter_.registerScrollHandler(this.scrollHandler_);

    this.initKeyRatio_();
    this.setKeyHeights_();
  }

  destroy() {
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    this.adapter_.deregisterScrollHandler(this.scrollHandler_);
  }

  updateAdjustElementStyles() {
    if (this.isFixed_) {
      this.adapter_.setStyleForFixedAdjustElement('margin-top', `${this.calculations_.toolbarHeight}px`);
    }
  }

  private getFlexibleExpansionRatio_(scrollTop: number) {
    // To prevent division by zero when there is no flexibleExpansionHeight
    const delta = 0.0001;
    return Math.max(0, 1 - scrollTop / (this.calculations_.flexibleExpansionHeight + delta));
  }

  private checkRowHeight_() {
    cancelAnimationFrame(this.checkRowHeightFrame_);
    this.checkRowHeightFrame_ = requestAnimationFrame(() => this.setKeyHeights_());
  }

  private setKeyHeights_() {
    const newToolbarRowHeight = this.getRowHeight_();
    if (newToolbarRowHeight !== this.calculations_.toolbarRowHeight) {
      this.calculations_.toolbarRowHeight = newToolbarRowHeight;
      this.calculations_.toolbarHeight = this.calculations_.toolbarRatio * this.calculations_.toolbarRowHeight;
      this.calculations_.flexibleExpansionHeight =
          this.calculations_.flexibleExpansionRatio * this.calculations_.toolbarRowHeight;
      this.calculations_.maxTranslateYDistance =
          this.calculations_.maxTranslateYRatio * this.calculations_.toolbarRowHeight;
      this.calculations_.scrollThreshold =
          this.calculations_.scrollThresholdRatio * this.calculations_.toolbarRowHeight;
      this.updateAdjustElementStyles();
      this.updateToolbarStyles_();
    }
  }

  private updateToolbarStyles_() {
    cancelAnimationFrame(this.scrollFrame_);
    this.scrollFrame_ = requestAnimationFrame(() => {
      const scrollTop = this.adapter_.getViewportScrollY();
      const hasScrolledOutOfThreshold = this.scrolledOutOfThreshold_(scrollTop);

      if (hasScrolledOutOfThreshold && this.executedLastChange_) {
        return;
      }

      const flexibleExpansionRatio = this.getFlexibleExpansionRatio_(scrollTop);

      this.updateToolbarFlexibleState_(flexibleExpansionRatio);
      if (this.isFixedLastRow_) {
        this.updateToolbarFixedState_(scrollTop);
      }
      if (this.hasFlexibleFirstRow_) {
        this.updateFlexibleRowElementStyles_(flexibleExpansionRatio);
      }
      this.executedLastChange_ = hasScrolledOutOfThreshold;
      this.adapter_.notifyChange({flexibleExpansionRatio});
    });
  }

  private scrolledOutOfThreshold_(scrollTop: number) {
    return scrollTop > this.calculations_.scrollThreshold;
  }

  private initKeyRatio_() {
    const toolbarRowHeight = this.getRowHeight_();
    const firstRowMaxRatio = this.adapter_.getFirstRowElementOffsetHeight() / toolbarRowHeight;
    this.calculations_.toolbarRatio = this.adapter_.getOffsetHeight() / toolbarRowHeight;
    this.calculations_.flexibleExpansionRatio = firstRowMaxRatio - 1;
    this.calculations_.maxTranslateYRatio =
        this.isFixedLastRow_ ? this.calculations_.toolbarRatio - firstRowMaxRatio : 0;
    this.calculations_.scrollThresholdRatio =
        (this.isFixedLastRow_ ? this.calculations_.toolbarRatio : firstRowMaxRatio) - 1;
  }

  private getRowHeight_() {
    const breakpoint = numbers.TOOLBAR_MOBILE_BREAKPOINT;
    return this.adapter_.getViewportWidth() < breakpoint ?
        numbers.TOOLBAR_ROW_MOBILE_HEIGHT : numbers.TOOLBAR_ROW_HEIGHT;
  }

  private updateToolbarFlexibleState_(flexibleExpansionRatio: number) {
    this.adapter_.removeClass(cssClasses.FLEXIBLE_MAX);
    this.adapter_.removeClass(cssClasses.FLEXIBLE_MIN);
    if (flexibleExpansionRatio === 1) {
      this.adapter_.addClass(cssClasses.FLEXIBLE_MAX);
    } else if (flexibleExpansionRatio === 0) {
      this.adapter_.addClass(cssClasses.FLEXIBLE_MIN);
    }
  }

  private updateToolbarFixedState_(scrollTop: number) {
    const translateDistance = Math.max(0, Math.min(
        scrollTop - this.calculations_.flexibleExpansionHeight,
        this.calculations_.maxTranslateYDistance));
    this.adapter_.setStyle('transform', `translateY(${-translateDistance}px)`);

    if (translateDistance === this.calculations_.maxTranslateYDistance) {
      this.adapter_.addClass(cssClasses.FIXED_AT_LAST_ROW);
    } else {
      this.adapter_.removeClass(cssClasses.FIXED_AT_LAST_ROW);
    }
  }

  private updateFlexibleRowElementStyles_(flexibleExpansionRatio: number) {
    if (this.isFixed_) {
      const height = this.calculations_.flexibleExpansionHeight * flexibleExpansionRatio;
      this.adapter_.setStyleForFlexibleRowElement('height',
          `${height + this.calculations_.toolbarRowHeight}px`);
    }
    if (this.useFlexDefaultBehavior_) {
      this.updateElementStylesDefaultBehavior_(flexibleExpansionRatio);
    }
  }

  private updateElementStylesDefaultBehavior_(flexibleExpansionRatio: number) {
    const maxTitleSize = numbers.MAX_TITLE_SIZE;
    const minTitleSize = numbers.MIN_TITLE_SIZE;
    const currentTitleSize = (maxTitleSize - minTitleSize) * flexibleExpansionRatio + minTitleSize;

    this.adapter_.setStyleForTitleElement('font-size', `${currentTitleSize}rem`);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCToolbarFoundation;
