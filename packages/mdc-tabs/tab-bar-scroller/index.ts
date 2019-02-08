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

import {getCorrectPropertyName} from '@material/animation';
import {MDCComponent} from '@material/base/component';

import {MDCTabBar} from '../tab-bar/index';
import MDCTabBarScrollerFoundation from './foundation';

export {MDCTabBarScrollerFoundation};

export class MDCTabBarScroller extends MDCComponent<MDCTabBarScrollerFoundation> {
  static attachTo(root: Element) {
    return new MDCTabBarScroller(root);
  }

  backIndicator_!: Element;
  forwardIndicator_!: Element;
  scrollFrame_!: HTMLElement;
  tabBarEl_!: HTMLElement;
  tabBar_!: MDCTabBar;

  get tabBar() {
    return this.tabBar_;
  }

  initialize(tabBarFactory = (root: Element) => new MDCTabBar(root)) {
    this.scrollFrame_ = this.root_.querySelector(MDCTabBarScrollerFoundation.strings.FRAME_SELECTOR) as HTMLElement;
    this.tabBarEl_ = this.root_.querySelector(MDCTabBarScrollerFoundation.strings.TABS_SELECTOR) as HTMLElement;
    this.forwardIndicator_ = this.root_.querySelector(
      MDCTabBarScrollerFoundation.strings.INDICATOR_FORWARD_SELECTOR) as Element;
    this.backIndicator_ = this.root_.querySelector(
      MDCTabBarScrollerFoundation.strings.INDICATOR_BACK_SELECTOR) as Element;
    this.tabBar_ = tabBarFactory(this.tabBarEl_);
  }

  getDefaultFoundation() {
    return new MDCTabBarScrollerFoundation({
      addClass: (className) => this.root_.classList.add(className),
      addClassToBackIndicator: (className) => this.backIndicator_.classList.add(className),
      addClassToForwardIndicator: (className) => this.forwardIndicator_.classList.add(className),
      deregisterBackIndicatorClickHandler: (handler) =>
        this.backIndicator_.removeEventListener('click', handler),
      deregisterCapturedInteractionHandler: (evt, handler) =>
        this.root_.removeEventListener(evt, handler, true),
      deregisterForwardIndicatorClickHandler: (handler) =>
        this.forwardIndicator_.removeEventListener('click', handler),
      deregisterWindowResizeHandler: (handler) =>
        window.removeEventListener('resize', handler),
      eventTargetHasClass: (target, className) => (target as HTMLElement).classList.contains(className),
      getComputedLeftForTabAtIndex: (index) => this.tabBar.tabs[index].computedLeft,
      getComputedWidthForTabAtIndex: (index) => this.tabBar.tabs[index].computedWidth,
      getNumberOfTabs: () => this.tabBar.tabs.length,
      getOffsetLeftForEventTarget: (target) => (target as HTMLElement).offsetLeft,
      getOffsetWidthForEventTarget: (target) => (target as HTMLElement).offsetWidth,
      getOffsetWidthForScrollFrame: () => this.scrollFrame_.offsetWidth,
      getOffsetWidthForTabBar: () => this.tabBarEl_.offsetWidth,
      getScrollLeftForScrollFrame: () => this.scrollFrame_.scrollLeft,
      isRTL: () =>
        getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      registerBackIndicatorClickHandler: (handler) =>
        this.backIndicator_.addEventListener('click', handler),
      registerCapturedInteractionHandler: (evt, handler) =>
        this.root_.addEventListener(evt, handler, true),
      registerForwardIndicatorClickHandler: (handler) =>
        this.forwardIndicator_.addEventListener('click', handler),
      registerWindowResizeHandler: (handler) =>
        window.addEventListener('resize', handler),
      removeClass: (className) => this.root_.classList.remove(className),
      removeClassFromBackIndicator: (className) => this.backIndicator_.classList.remove(className),
      removeClassFromForwardIndicator: (className) => this.forwardIndicator_.classList.remove(className),
      setScrollLeftForScrollFrame: (scrollLeftAmount) => this.scrollFrame_.scrollLeft = scrollLeftAmount,
      setTransformStyleForTabBar: (value) => {
        this.tabBarEl_.style.setProperty(getCorrectPropertyName(window, 'transform'), value);
      },
    });
  }

  layout() {
    this.foundation_.layout();
  }
}
