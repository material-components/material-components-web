/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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


import MDCFoundation from '@material/base/foundation';

import {cssClasses, strings} from './constants';

export default class MDCTabBarScrollerFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      eventTargetHasClass: (/* target: EventTarget, className: string */) => /* boolean */ false,
      addClassToForwardIndicator: (/* className: string */) => {},
      removeClassFromForwardIndicator: (/* className: string */) => {},
      addClassToBackIndicator: (/* className: string */) => {},
      removeClassFromBackIndicator: (/* className: string */) => {},
      isRTL: () => /* boolean */ false,
      registerBackIndicatorClickHandler: (/* handler: EventListener */) => {},
      deregisterBackIndicatorClickHandler: (/* handler: EventListener */) => {},
      registerForwardIndicatorClickHandler: (/* handler: EventListener */) => {},
      deregisterForwardIndicatonClickHandler: (/* handler: EventListener */) => {},
      registerCapturedFocusHandler: (/* handler: EventListener */) => {},
      deregisterCapturedFocusHandler: (/* handler: EventListener */) => {},
      registerWindowResizeHandler: (/* handler: EventListener */) => {},
      deregisterWindowResizeHandler: (/* handler: EventListener */) => {},
      getNumberOfTabs: () => /* number */ 0,
      getComputedWidthForTabAtIndex: () => /* number */ 0,
      getComputedLeftForTabAtIndex: () => /* number */ 0,
      getOffsetWidthForScrollFrame: () => /* number */ 0,
      getScrollLeftForScrollFrame: () => /* number */ 0,
      addClassToTabBar: (/* className: string */) => {},
      removeClassFromTabBar: (/* className: string */) => {},
      getOffsetWidthForTabBar: () => /* number */ 0,
      setTransformStyleForTabBar: (/* value: string */) => {},
      getOffsetLeftForEventTarget: (/* target: EventTarget */) => /* number */ 0,
      getOffsetWidthForEventTarget: (/* target: EventTarget */) => /* number */ 0,
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCTabBarScrollerFoundation.defaultAdapter, adapter));

    this.currentTranslateOffset_ = 0;
    this.focusedTarget_ = null;
    this.layoutFrame_ = 0;
    this.forwardIndicatorClickHandler_ = (evt) => this.scrollForward(evt);
    this.backIndicatorClickHandler_ = (evt) => this.scrollBack(evt);
    this.resizeHandler_ = () => this.layout();
    this.focusHandler_ = (evt) => this.handlePossibleTabFocus_(evt);
  }

  init() {
    this.adapter_.registerBackIndicatorClickHandler(this.backIndicatorClickHandler_);
    this.adapter_.registerForwardIndicatorClickHandler(this.forwardIndicatorClickHandler_);
    this.adapter_.registerWindowResizeHandler(this.resizeHandler_);
    this.adapter_.registerCapturedFocusHandler(this.focusHandler_);
    this.layout();
  }

  destroy() {
    this.adapter_.deregisterBackIndicatorClickHandler(this.backIndicatorClickHandler_);
    this.adapter_.deregisterForwardIndicatorClickHandler(this.forwardIndicatorClickHandler_);
    this.adapter_.deregisterWindowResizeHandler(this.resizeHandler_);
    this.adapter_.deregisterCapturedFocusHandler(this.focusHandler_);
  }

  scrollBack(evt) {
    if (evt) {
      evt.preventDefault();
    }

    let tabWidthAccumulator = 0;
    let scrollTargetIndex = 0;

    for (let i = this.adapter_.getNumberOfTabs() - 1; i > 0; i--) {
      const tabOffsetX = this.getOffsetXForTabAtIndex_(i);

      if (tabOffsetX >= this.currentTranslateOffset_) {
        continue;
      }

      tabWidthAccumulator += this.adapter_.getComputedWidthForTabAtIndex(i);
      if (tabWidthAccumulator > this.adapter_.getOffsetWidthForScrollFrame()) {
        scrollTargetIndex = i;
        break;
      }
    }

    this.scrollToTabAtIndex_(scrollTargetIndex);
  }

  scrollForward(evt) {
    if (evt) {
      evt.preventDefault();
    }

    const totalOffset = this.adapter_.getOffsetWidthForScrollFrame() + this.currentTranslateOffset_;
    let scrollTargetIndex = 0;

    for (let i = 0; i < this.adapter_.getNumberOfTabs(); i++) {
      const tabOffsetX = this.getOffsetXForTabAtIndex_(i);
      const offsetWidth = this.adapter_.getComputedWidthForTabAtIndex(i);

      if (tabOffsetX + offsetWidth >= totalOffset) {
        scrollTargetIndex = i;
        break;
      }
    }

    this.scrollToTabAtIndex_(scrollTargetIndex);
  }

  handlePossibleTabFocus_({target}) {
    if (!this.adapter_.eventTargetHasClass(target, cssClasses.TAB)) {
      return;
    }

    this.focusedTarget_ = target;
    const focusedTargetOffsetLeft = this.adapter_.getOffsetLeftForEventTarget(this.focusedTarget_);
    const focusedTargetOffsetWidth = this.adapter_.getOffsetWidthForEventTarget(this.focusedTarget_);

    const rightEdge = focusedTargetOffsetLeft + focusedTargetOffsetWidth;
    const leftEdge = focusedTargetOffsetLeft;
    const scrollFrameWidth = this.adapter_.getOffsetWidthForScrollFrame();
    const tabBarWidth = this.adapter_.getOffsetWidthForTabBar();
    // Because clicking on an element that's partially visible would normally
    // shift the frame because of the focus event it generates—thus losing the
    // ability to finish the click on the tab and thus persisting the ripple
    // deactivation and not selecting the tab—we only shift if the _entire_
    // tab is occluded by the scroll frame.
    let shouldScrollForward = leftEdge > this.currentTranslateOffset_ + scrollFrameWidth;
    let shouldScrollBack = rightEdge <= this.currentTranslateOffset_;

    if (this.isRTL()) {
      shouldScrollForward = rightEdge < tabBarWidth - (this.currentTranslateOffset_ + scrollFrameWidth);
      shouldScrollBack = leftEdge < scrollFrameWidth + this.currentTranslateOffset_;
    }

    if (shouldScrollForward) {
      this.scrollForward();
    } else if (shouldScrollBack) {
      this.scrollBack();
    }

    this.updateIndicatorEnabledStates_();
  }

  layout() {
    cancelAnimationFrame(this.layoutFrame_);
    this.layoutFrame_ = requestAnimationFrame(() => this.layout_());
  }

  layout_() {
    const frameWidth = this.adapter_.getOffsetWidthForScrollFrame();
    const isOverflowing = this.adapter_.getOffsetWidthForTabBar() > frameWidth;

    if (!isOverflowing) {
      this.currentTranslateOffset_ = 0;
      this.shiftFrame_();
    }

    this.updateIndicatorEnabledStates_();
  }

  scrollToTabAtIndex_(index) {
    const scrollTargetOffsetLeft = this.adapter_.getComputedLeftForTabAtIndex(index);
    const scrollTargetOffsetWidth = this.adapter_.getComputedWidthForTabAtIndex(index);

    this.currentTranslateOffset_ =
      this.normalizeForRTL_(scrollTargetOffsetLeft, scrollTargetOffsetWidth);
    debugger;
    requestAnimationFrame(() => this.shiftFrame_());
  }

  getOffsetXForTabAtIndex_(index) {
    const offsetLeft = this.adapter_.getComputedLeftForTabAtIndex(index);
    const offsetWidth = this.adapter_.getComputedWidthForTabAtIndex(index);
    return this.normalizeForRTL_(offsetLeft, offsetWidth);
  }

  normalizeForRTL_(left, width) {
    return this.isRTL() ? this.adapter_.getOffsetWidthForTabBar() - (left + width) : left;
  }

  shiftFrame_() {
    const shiftAmount = this.isRTL() ?
      this.currentTranslateOffset_ :
      -this.currentTranslateOffset_ + this.adapter_.getScrollLeftForScrollFrame();

    this.adapter_.setTransformStyleForTabBar(`translateX(${shiftAmount}px)`);
    this.updateIndicatorEnabledStates_();
  }

  updateIndicatorEnabledStates_() {
    const {INDICATOR_ENABLED} = cssClasses;
    if (this.currentTranslateOffset_ === 0) {
      this.adapter_.removeClassFromBackIndicator(INDICATOR_ENABLED);
    } else {
      this.adapter_.addClassToBackIndicator(INDICATOR_ENABLED);
    }

    const remainingTabBarWidth = this.adapter_.getOffsetWidthForTabBar() - this.currentTranslateOffset_;
    if (remainingTabBarWidth > this.adapter_.getOffsetWidthForScrollFrame()) {
      this.adapter_.addClassToForwardIndicator(INDICATOR_ENABLED);
    } else {
      this.adapter_.removeClassFromForwardIndicator(INDICATOR_ENABLED);
    }
  }

  isRTL() {
    return this.adapter_.isRTL();
  }
}
