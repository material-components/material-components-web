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

import {getCorrectPropertyName} from '@material/animation/util';
import {MDCFoundation} from '@material/base/foundation';
import {SpecificEventListener} from '@material/base/types';
import {MDCTabBarAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCTabBarFoundation extends MDCFoundation<MDCTabBarAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCTabBarAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      bindOnMDCTabSelectedEvent: () => undefined,
      unbindOnMDCTabSelectedEvent: () => undefined,
      registerResizeHandler: () => undefined,
      deregisterResizeHandler: () => undefined,
      getOffsetWidth: () => 0,
      setStyleForIndicator: () => undefined,
      getOffsetWidthForIndicator: () => 0,
      notifyChange: () => undefined,
      getNumberOfTabs: () => 0,
      isTabActiveAtIndex: () => false,
      setTabActiveAtIndex: () => undefined,
      isDefaultPreventedOnClickForTabAtIndex: () => false,
      setPreventDefaultOnClickForTabAtIndex: () => undefined,
      measureTabAtIndex: () => undefined,
      getComputedWidthForTabAtIndex: () => 0,
      getComputedLeftForTabAtIndex: () => 0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private isIndicatorShown_ = false;
  private activeTabIndex_ = 0;
  private layoutFrame_ = 0;

  private resizeHandler_!: SpecificEventListener<'resize'>; // assigned in init()

  constructor(adapter?: Partial<MDCTabBarAdapter>) {
    super({...MDCTabBarFoundation.defaultAdapter, ...adapter});
  }

  init() {
    this.resizeHandler_ = () => this.layout();
    this.adapter_.addClass(cssClasses.UPGRADED);
    this.adapter_.bindOnMDCTabSelectedEvent();
    this.adapter_.registerResizeHandler(this.resizeHandler_);
    const activeTabIndex = this.findActiveTabIndex_();
    if (activeTabIndex >= 0) {
      this.activeTabIndex_ = activeTabIndex;
    }
    this.layout();
  }

  destroy() {
    this.adapter_.removeClass(cssClasses.UPGRADED);
    this.adapter_.unbindOnMDCTabSelectedEvent();
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
  }

  layout() {
    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
    }

    this.layoutFrame_ = requestAnimationFrame(() => {
      this.layoutInternal_();
      this.layoutFrame_ = 0;
    });
  }

  switchToTabAtIndex(index: number, shouldNotify: boolean) {
    if (index === this.activeTabIndex_) {
      return;
    }

    if (index < 0 || index >= this.adapter_.getNumberOfTabs()) {
      throw new Error(`Out of bounds index specified for tab: ${index}`);
    }

    const prevActiveTabIndex = this.activeTabIndex_;
    this.activeTabIndex_ = index;
    requestAnimationFrame(() => {
      if (prevActiveTabIndex >= 0) {
        this.adapter_.setTabActiveAtIndex(prevActiveTabIndex, false);
      }
      this.adapter_.setTabActiveAtIndex(this.activeTabIndex_, true);
      this.layoutIndicator_();
      if (shouldNotify) {
        this.adapter_.notifyChange({activeTabIndex: this.activeTabIndex_});
      }
    });
  }

  getActiveTabIndex() {
    return this.findActiveTabIndex_();
  }

  private layoutInternal_() {
    this.forEachTabIndex_((index) => this.adapter_.measureTabAtIndex(index));
    this.layoutIndicator_();
  }

  private layoutIndicator_() {
    const isIndicatorFirstRender = !this.isIndicatorShown_;

    // Ensure that indicator appears in the right position immediately for correct first render.
    if (isIndicatorFirstRender) {
      this.adapter_.setStyleForIndicator('transition', 'none');
    }

    const translateAmtForActiveTabLeft = this.adapter_.getComputedLeftForTabAtIndex(this.activeTabIndex_);
    const scaleAmtForActiveTabWidth =
        this.adapter_.getComputedWidthForTabAtIndex(this.activeTabIndex_) / this.adapter_.getOffsetWidth();

    const transformValue = `translateX(${translateAmtForActiveTabLeft}px) scale(${scaleAmtForActiveTabWidth}, 1)`;
    this.adapter_.setStyleForIndicator(getCorrectPropertyName(window, 'transform'), transformValue);

    if (isIndicatorFirstRender) {
      // Force layout so that transform styles to take effect.
      this.adapter_.getOffsetWidthForIndicator();
      this.adapter_.setStyleForIndicator('transition', '');
      this.adapter_.setStyleForIndicator('visibility', 'visible');
      this.isIndicatorShown_ = true;
    }
  }

  private findActiveTabIndex_() {
    let activeTabIndex = -1;
    this.forEachTabIndex_((index) => {
      if (this.adapter_.isTabActiveAtIndex(index)) {
        activeTabIndex = index;
        return true;
      }
    });
    return activeTabIndex;
  }

  private forEachTabIndex_(iterator: (index: number) => boolean | void) {
    const numTabs = this.adapter_.getNumberOfTabs();
    for (let index = 0; index < numTabs; index++) {
      const shouldBreak = iterator(index);
      if (shouldBreak) {
        break;
      }
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabBarFoundation;
