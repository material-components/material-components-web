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

import MDCFoundation from '@material/base/foundation';
import MDCTabBarAdapter from './adapter';

import {strings, numbers} from './constants';

/* eslint-disable no-unused-vars */
import MDCTabFoundation from '@material/tab/foundation';
import {MDCTabDimensions} from '@material/tab/adapter';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCFoundation<!MDCTabBarAdapter>}
 * @final
 */
class MDCTabBarFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /**
   * @see MDCTabBarAdapter for typing information
   * @return {!MDCTabBarAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabBarAdapter} */ ({
      scrollTo: () => {},
      incrementScroll: () => {},
      computeScrollPosition: () => {},
      getOffsetWidth: () => {},
    });
  }

  /**
   * @param {!MDCTabBarAdapter} adapter
   * @param {Array<!MDCTabFoundation>} tabs
   * */
  constructor(adapter, tabs) {
    super(Object.assign(MDCTabBarFoundation.defaultAdapter, adapter));

    /** @private */
    this.tabs_ = tabs;

    /** @private {?number} */
    this.activeIndex_;

    this.initActiveTab_();
  }

  /**
   * Handles the MDCTab:interacted event
   * @param {!Event} evt
   */
  handleTabInteraction(evt) {
    this.activateTab(this.getIndexOfTab_(evt.detail.tab));
  }

  /**
   * Activates the tab at the given index
   * @param {number} index
   */
  activateTab(index) {
    if (!this.indexIsInRange_(index) || index === this.activeIndex_) {
      return;
    }

    const tabToActivate = this.tabs_[index];
    const activeTab = this.tabs_[this.activeIndex_];
    this.activeIndex_ = index;
    this.scrollIntoView(index);
    activeTab.deactivate();
    tabToActivate.activate(activeTab.computeIndicatorClientRect());
  }

  /**
   * Scrolls the tab at the given index into view
   * @param {number} index The tab index to make visible
   */
  scrollIntoView(index) {
    if (!this.indexIsInRange_(index)) {
      return;
    }

    const tab = this.tabs_[index];
    const tabDimensions = tab.computeDimensions();
    const scrollPosition = this.adapter_.computeScrollPosition();
    const scrollWidth = this.adapter_.getOffsetWidth();
    const nextTab = this.computeNextAdjacentTab_(index, tabDimensions, scrollPosition, scrollWidth);
    console.log({
      index,
      nextTab,
    })
    let scrollIncrement = this.computeAdjacentTabContentDistance_(nextTab);

    // TODO(prodee): Determine why LTR scroll decrementing is too large

    if (nextTab.isLeft) {
      scrollIncrement += tabDimensions.rootLeft - numbers.EXTRA_SCROLL_AMOUNT;
    } else {
      scrollIncrement += tabDimensions.rootRight - scrollPosition - scrollWidth + numbers.EXTRA_SCROLL_AMOUNT;
    }

    this.adapter_.incrementScroll(scrollIncrement);
  }

  /**
   * Returns the index of the given Tab
   * @param {!MDCTab} tabToFind
   * @return {number}
   * @private
   */
  getIndexOfTab_(tabToFind) {
    return this.tabs_.findIndex((tab) => tab === tabToFind);
  }

  /**
   * Returns whether a given index is inclusively between the ends
   * @param {number} index The index to test
   * @private
   */
  indexIsInRange_(index) {
    return index >= 0 && index < this.tabs_.length;
  }

  /**
   * Returns whether a given index is exclusively between the ends
   * @param {number} index The index to test
   * @private
   */
  indexIsBetweenEnds_(index) {
    return index > 0 && index < this.tabs_.length - 1;
  }

  /**
   * Returns the tab dimensions at the given index
   * @param {number} index The tab index
   * @return {!MDCTabDimensions}
   * @private
   */
  calculateTabDimensions_(index) {
    return this.tabs_[index].computeRootDimensions();
  }

  /**
   * Determines
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions Whether the next tab is left or right
   * @param {number} scrollDistance The distance scrolled
   * @param {number} scrollWidth The width of the scroller
   * @return {{index: number, isLeft: boolean}}
   * @private
   */
  computeNextAdjacentTab_(index, tabDimensions, scrollDistance, scrollWidth) {
    /**
     * Tabs are laid out in the Tab Scroller like this:
     *
     *    Scroll Distance
     *    +---+
     *    |   |   Scroller Width
     *    |   +-----------------------------------+
     *    |   |                                   |
     *    |   V                                   V
     *    |   +-----------------------------------+
     *    V   |             Tab Scroller          |
     *    +------------+--------------+-------------------+
     *    |    Tab     |      Tab     |        Tab        |
     *    +------------+--------------+-------------------+
     *        |                                   |
     *        +-----------------------------------+
     *
     * To determine the next adjacent index, we look at the Tab root left and
     * Tab root right, both relative to the scroll distance. If the Tab root
     * left is less than the scroll distance, then we know it's out of view to
     * the left. If the Tab root right minus the scroll distance is greater
     * than the scroller width, we know the Tab is out of view to the right.
     * From there, we either increment or decrement the index based on the
     * language direction of the content.
     */
    if (this.isRTL_()) {
      return this.computeNextAdjacentTabRTL_(index, tabDimensions, scrollDistance, scrollWidth);
    }

    const relativeTabRootLeft = tabDimensions.rootLeft - scrollDistance;
    const relativeTabRootRight = tabDimensions.rootRight - scrollDistance - scrollWidth;
    const relativeTabRootDelta = relativeTabRootLeft + relativeTabRootLeft;

    let index_ = index;
    let isLeft = false;

    if (relativeTabRootLeft < 0 || relativeTabRootDelta < 0) {
      isLeft = true;
      index_--;
    }

    if (relativeTabRootRight > 0 || relativeTabRootDelta > 0) {
      isLeft = false;
      index_++;
    }

    return {
      index: index_,
      isLeft,
    };
  }

  /**
   * Determines
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions Whether the next tab is left or right
   * @param {number} scrollDistance The distance scrolled
   * @param {number} scrollWidth The width of the scroller
   * @return {{index: number, isLeft: boolean}}
   * @private
   */
  computeNextAdjacentTabRTL_(index, tabDimensions, scrollDistance, scrollWidth) {
    const relativeTabRootLeft = tabDimensions.rootLeft - scrollDistance;
    const relativeTabRootRight = tabDimensions.rootRight - scrollDistance - scrollWidth;
    const relativeTabRootDelta = relativeTabRootLeft + relativeTabRootLeft;

    let index_ = index;
    let isLeft = false;

    if (relativeTabRootLeft < 0 || relativeTabRootDelta < 0) {
      isLeft = true;
      index_++;
    }

    if (relativeTabRootRight > 0 || relativeTabRootDelta > 0) {
      isLeft = false;
      index_--;
    }

    return {
      index: index_,
      isLeft,
    };
  }

  /**
   * Computes the distance between the content and the root
   * @param {{index: number, isLeft: boolean}} adjacentTab The next adjacent tab index and direction
   * @return {number}
   * @private
   */
  computeAdjacentTabContentDistance_(adjacentTab) {
    // Early exit
    if (!this.indexIsInRange_(adjacentTab.index)) {
      return 0;
    }

    /**
     * Tab dimensions are structured like this:
     *
     *    Root left
     *    |   Content left
     *    |   |       Content right
     *    |   |       |   Root right
     *    |   |       |   |
     *    V   V       V   V
     *    +---+-------+---+
     *    |   |       |   |
     *    |   |       |   |
     *    |   |       |   |
     *    +---+-------+---+
     */
    const adjacentTabDimensions = this.tabs_[adjacentTab.index].computeDimensions();
    if (adjacentTab.isLeft) {
      return adjacentTabDimensions.contentRight - adjacentTabDimensions.rootRight;
    }

    return adjacentTabDimensions.contentLeft - adjacentTabDimensions.rootLeft;
  }

  /** @private */
  initActiveTab_() {
    for (let i = 0; i < this.tabs_.length; i++) {
      if (this.tabs_[i].active) {
        this.activeIndex_ = i;
        break;
      }
    }
  }

  /**
   * Returns the view's RTL property
   * @return {boolean}
   * @private
   */
  isRTL_() {
    // TODO(prodee): Make this return the correct RTL state
    return false;
  }
}

export default MDCTabBarFoundation;
