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

    /** @private {!Array<MDCTab>} */
    this.tabList_ = [];

    /** @private {?MDCTabScroller} */
    this.tabScroller_;

    this.handleTabInteraction_;

    this.handleKeyDown_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTabBar}
   */
  static attachTo(root) {
    return new MDCTabBar(root);
  }

  initialize(
    tabFactory = (el) => new MDCTab(el),
    tabScrollerFactory = (el) => new MDCTabScroller(el),
  ) {
    const tabElements = this.root_.querySelectorAll(MDCTabBarFoundation.strings.TAB_SELECTOR);
    this.tabList_ = [].map.call(tabElements, tabFactory);

    const tabScrollerElement = this.root_.querySelector(MDCTabBarFoundation.strings.TAB_SCROLLER_SELECTOR);
    this.tabScroller_ = tabScrollerFactory(tabScrollerElement);
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
  }

  /**
   * @return {!MDCTabBarAdapter}
   */
  getDefaultFoundation() {
    return new MDCTabBarFoundation(
      /** @type {!MDCTabBarAdapter} */ ({
        scrollTo: (scrollX) => this.tabScroller_.scrollTo(scrollX),
        incrementScroll: (scrollXIncrement) => this.tabScroller_.incrementScroll(scrollXIncrement),
        computeScrollPosition: () => this.tabScroller_.getScrollPosition(),
        getOffsetWidth: () => this.root_.offsetWidth,
      }),
      this.tabList_,
    );
  }

  destroy() {
    this.tabScroller_.destroy();
    this.tabList_.forEach((tab) => tab.destroy());
  }
}

export {MDCTabBar, MDCTabBarFoundation};
