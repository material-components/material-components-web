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
import {MDCComponent} from '@material/base/component';
import {MDCTabBar, MDCTabBarFactory} from '../tab-bar/component';
import {MDCTabBarScrollerAdapter} from './adapter';
import {MDCTabBarScrollerFoundation} from './foundation';

export class MDCTabBarScroller extends MDCComponent<MDCTabBarScrollerFoundation> {
  static attachTo(root: Element) {
    return new MDCTabBarScroller(root);
  }

  get tabBar() {
    return this.tabBar_;
  }

  protected root_!: HTMLElement; // assigned in MDCComponent constructor

  private tabBar_!: MDCTabBar; // assigned in initialize()
  private scrollFrame_!: HTMLElement; // assigned in initialize()
  private tabBarEl_!: HTMLElement; // assigned in initialize()
  private forwardIndicator_!: HTMLElement; // assigned in initialize()
  private backIndicator_!: HTMLElement; // assigned in initialize()

  initialize(tabBarFactory: MDCTabBarFactory = (el) => new MDCTabBar(el)) {
    this.scrollFrame_ =
        this.root_.querySelector<HTMLElement>(MDCTabBarScrollerFoundation.strings.FRAME_SELECTOR)!;
    this.tabBarEl_ =
        this.root_.querySelector<HTMLElement>(MDCTabBarScrollerFoundation.strings.TABS_SELECTOR)!;
    this.forwardIndicator_ =
        this.root_.querySelector<HTMLElement>(MDCTabBarScrollerFoundation.strings.INDICATOR_FORWARD_SELECTOR)!;
    this.backIndicator_ =
        this.root_.querySelector<HTMLElement>(MDCTabBarScrollerFoundation.strings.INDICATOR_BACK_SELECTOR)!;

    this.tabBar_ = tabBarFactory(this.tabBarEl_);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTabBarScrollerAdapter = {
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      addClassToForwardIndicator: (className) => this.forwardIndicator_.classList.add(className),
      removeClassFromForwardIndicator: (className) => this.forwardIndicator_.classList.remove(className),
      addClassToBackIndicator: (className) => this.backIndicator_.classList.add(className),
      removeClassFromBackIndicator: (className) => this.backIndicator_.classList.remove(className),
      isRTL: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      registerBackIndicatorClickHandler: (handler) => this.backIndicator_.addEventListener('click', handler),
      deregisterBackIndicatorClickHandler: (handler) => this.backIndicator_.removeEventListener('click', handler),
      registerForwardIndicatorClickHandler: (handler) => this.forwardIndicator_.addEventListener('click', handler),
      deregisterForwardIndicatorClickHandler: (handler) => this.forwardIndicator_.removeEventListener('click', handler),
      registerCapturedInteractionHandler: (evt, handler) => this.root_.addEventListener(evt, handler, true),
      deregisterCapturedInteractionHandler: (evt, handler) => this.root_.removeEventListener(evt, handler, true),
      registerWindowResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterWindowResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getNumberOfTabs: () => this.tabBar.tabs.length,
      getComputedWidthForTabAtIndex: (index) => this.tabBar.tabs[index].computedWidth,
      getComputedLeftForTabAtIndex: (index) => this.tabBar.tabs[index].computedLeft,
      getOffsetWidthForScrollFrame: () => this.scrollFrame_.offsetWidth,
      getScrollLeftForScrollFrame: () => this.scrollFrame_.scrollLeft,
      setScrollLeftForScrollFrame: (scrollLeftAmount) => this.scrollFrame_.scrollLeft = scrollLeftAmount,
      getOffsetWidthForTabBar: () => this.tabBarEl_.offsetWidth,
      setTransformStyleForTabBar: (value) => {
        this.tabBarEl_.style.setProperty(getCorrectPropertyName(window, 'transform'), value);
      },
      getOffsetLeftForEventTarget: (target) => target.offsetLeft,
      getOffsetWidthForEventTarget: (target) => target.offsetWidth,
    };
    // tslint:enable:object-literal-sort-keys
    return new MDCTabBarScrollerFoundation(adapter);
  }

  layout() {
    this.foundation_.layout();
  }
}
