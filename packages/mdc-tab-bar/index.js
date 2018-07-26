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

    /** @private {!Array<!MDCTab>} */
    this.tabList_;

    /** @type {(function(!Element): !MDCTab)} */
    this.tabFactory_;

    /** @private {?MDCTabScroller} */
    this.tabScroller_;

    /** @type {(function(!Element): !MDCTabScroller)} */
    this.tabScrollerFactory_;

    /** @private {?function(?Event): undefined} */
    this.handleTabInteraction_;

    /** @private {?function(?Event): undefined} */
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
   * @param {(function(!Element): !MDCTabScroller)=} tabScrollerFactory A function which creates a new MDCTabScroller
   */
  initialize(
    tabFactory = (el) => new MDCTab(el),
    tabScrollerFactory = (el) => new MDCTabScroller(el),
  ) {
    this.tabFactory_ = tabFactory;
    this.tabScrollerFactory_ = tabScrollerFactory;

    const tabElements = [].slice.call(this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR));
    this.tabList_ = tabElements.map((el) => this.tabFactory_(el));

    const tabScrollerElement = this.root_.querySelector(MDCTabBarFoundation.strings.TAB_SCROLLER_SELECTOR);
    if (tabScrollerElement) {
      this.tabScroller_ = this.tabScrollerFactory_(tabScrollerElement);
    }
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
    this.tabList_.forEach((tab) => tab.destroy());
    this.tabScroller_.destroy();
  }

  /**
   * @return {!MDCTabBarFoundation}
   */
  getDefaultFoundation() {
    return new MDCTabBarFoundation(
      /** @type {!MDCTabBarAdapter} */ ({
        scrollTo: (scrollX) => this.tabScroller_.scrollTo(scrollX),
        incrementScroll: (scrollXIncrement) => this.tabScroller_.incrementScroll(scrollXIncrement),
        getScrollPosition: () => this.tabScroller_.getScrollPosition(),
        getScrollContentWidth: () => this.tabScroller_.getScrollContentWidth(),
        getOffsetWidth: () => this.root_.offsetWidth,
        isRTL: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        activateTabAtIndex: (index, clientRect) => this.tabList_[index].activate(clientRect),
        deactivateTabAtIndex: (index) => this.tabList_[index].deactivate(),
        getTabIndicatorClientRectAtIndex: (index) => this.tabList_[index].computeIndicatorClientRect(),
        getTabDimensionsAtIndex: (index) => this.tabList_[index].computeDimensions(),
        getActiveTabIndex: () => {
          for (let i = 0; i < this.tabList_.length; i++) {
            if (this.tabList_[i].active) {
              return i;
            }
          }
          return -1;
        },
        getIndexOfTab: (tabToFind) => this.tabList_.indexOf(tabToFind),
        getTabListLength: () => this.tabList_.length,
        notifyTabActivated: (index) => this.emit(MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT, {index}, true),
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
