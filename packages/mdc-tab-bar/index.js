/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import MDCComponent from '@material/base/component';

import {MDCTab, MDCTabFoundation} from '@material/tab/index';
import {MDCTabScroller} from '@material/tab-scroller/index';

import MDCTabBarAdapter from './adapter';
import MDCTabBarFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCTabBarFoundation>}
 * @final
 */
class MDCTabBar extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @type {!Array<!MDCTab>} */
    this.tabList;

    /** @type {(function(!Element): !MDCTab)} */
    this.tabFactory_;

    /** @type {?MDCTabScroller} */
    this.tabScroller;

    /** @type {(function(!Element): !MDCTabScroller)} */
    this.tabScrollerFactory_;

    /** @private {EventHandler} */
    this.handleTabInteraction_;

    /** @private {EventHandler} */
    this.handleKeyDown_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTabBar}
   */
  static attachTo(root) {
    return new MDCTabBar(root);
  }

  /**
   * @param {(function(!Element): !MDCTab)=} tabFactory A function which creates a new MDCTab
   * @param {(function(!Element): !MDCTab)=} tabScrollerFactory A function which creates a new MDCTabScroller
   */
  initialize(
    tabFactory = (el) => new MDCTab(el),
    tabScrollerFactory = (el) => new MDCTabScroller(el),
  ) {
    this.tabFactory_ = tabFactory;
    this.tabScrollerFactory_ = tabScrollerFactory;

    const tabElements = [].slice.call(this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR));
    this.tabList = tabElements.map((el) => this.tabFactory_(el));

    const tabScrollerElement = this.root_.querySelector(MDCTabBarFoundation.strings.TAB_SCROLLER_SELECTOR);
    this.tabScroller = this.tabScrollerFactory_(tabScrollerElement);
  }

  initialSyncWithDOM() {
    this.handleTabInteraction_ = (evt) => this.foundation_.handleTabInteraction(evt);
    this.handleKeyDown_ = (evt) => this.foundation_.handleKeyDown(evt);

    this.root_.addEventListener(MDCTabFoundation.strings.INTERACTED_EVENT, this.handleTabInteraction_);
    this.root_.addEventListener('keydown', this.handleKeyDown_);
  }

  destroy() {
    super.destroy();
    this.root_.removeEventListener(MDCTabFoundation.strings.INTERACTED_EVENT, this.handleTabInteraction_);
    this.root_.removeEventListener('keydown', this.handleKeyDown_);
    this.tabList.forEach((tab) => tab.destroy());
    this.tabScroller.destroy();
  }

  /**
   * @return {!MDCTabBarAdapter}
   */
  getDefaultFoundation() {
    return new MDCTabBarFoundation(
      /** @type {!MDCTabBarAdapter} */ ({
        scrollTo: (scrollX) => this.tabScroller.scrollTo(scrollX),
        incrementScroll: (scrollXIncrement) => this.tabScroller.incrementScroll(scrollXIncrement),
        getScrollPosition: () => this.tabScroller.getScrollPosition(),
        getScrollContentWidth: () => this.tabScroller.getScrollContentWidth(),
        getOffsetWidth: () => this.root_.offsetWidth,
        isRTL: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        activateTabAtIndex: (index, clientRect) => this.tabList[index].activate(clientRect),
        deactivateTabAtIndex: (index) => this.tabList[index].deactivate(),
        getTabIndicatorClientRectAtIndex: (index) => this.tabList[index].computeIndicatorClientRect(),
        getTabDimensionsAtIndex: (index) => this.tabList[index].computeDimensions(),
        getActiveTabIndex: () => this.tabList.findIndex((tab) => tab.active),
        getIndexOfTab: (tabToFind) => this.tabList.indexOf(tabToFind),
        getTabListLength: () => this.tabList.length,
      })
    );
  }

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab
   */
  activateTab(index) {
    this.foundation_.activateTab(index);
  }

  /**
   * Scrolls the tab at the given index into view
   * @param {number} index THe index of the tab
   */
  scrollIntoView(index) {
    this.foundation_.scrollIntoView(index);
  }
}

export {MDCTabBar, MDCTabBarFoundation};
