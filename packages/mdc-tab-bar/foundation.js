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

import {strings, numbers} from './constants';
import MDCTabBarAdapter from './adapter';

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
   * Handles the keydown event
   * @param {!Event} evt
   */
  handleKeyDown(evt) {
    const keyboardNavigation = [
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (keyboardNavigation.includes(evt.key)) {
      evt.preventDefault();
      this.nextTab_(evt);
    }
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
    activeTab.deactivate();
    tabToActivate.activate(activeTab.computeIndicatorClientRect());
    this.scrollIntoView(index);
  }

  /**
   * Scrolls the tab at the given index into view
   * @param {number} index The tab index to make visible
   */
  scrollIntoView(index) {
    if (!this.indexIsInRange_(index)) {
      return;
    }

    if (this.isRTL_()) {
      return this.scrollIntoViewRTL_(index);
    }

    const scrollPosition = this.adapter_.computeScrollPosition();
    const barWidth = this.adapter_.getOffsetWidth();

    const tabDimensions = this.tabs_[index].computeDimensions();
    const tabRelativeDimensions = this.computeTabRelativeDimensions_(tabDimensions, scrollPosition);

    const nextTabIndex = this.computeClosestOccludedTabIndex_(index, tabDimensions, scrollPosition, barWidth);
    const nextTabIsLeft = nextTabIndex < index;

    let scrollIncrement = 0;

    // Early exit if the next computed index is the same as the current. This
    // would only happen if the selected tab was exactly in the center.
    if (nextTabIndex === index) {
      return;
    } else if (nextTabIndex < 0) {
      scrollIncrement = tabRelativeDimensions.relativeRootLeft;
    } else if (nextTabIndex >= this.tabs_.length) {
      scrollIncrement = tabRelativeDimensions.relativeRootRight - barWidth;
    } else {
      const nextTabDimensions = this.tabs_[nextTabIndex].computeDimensions();
      const nextTabRelativeDimensions = this.computeTabRelativeDimensions_(nextTabDimensions, scrollPosition);
      if (nextTabIsLeft) {
        scrollIncrement = nextTabRelativeDimensions.relativeContentRight - numbers.EXTRA_SCROLL_AMOUNT;
      } else {
        scrollIncrement = nextTabRelativeDimensions.relativeContentLeft + numbers.EXTRA_SCROLL_AMOUNT - barWidth;
      }
    }

    if (nextTabIsLeft && scrollIncrement > 0 || !nextTabIsLeft && scrollIncrement < 0) {
      return;
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

  computeTabRelativeDimensions_(tabDimensions, scrollPosition) {
    return {
      relativeRootLeft: tabDimensions.rootLeft - scrollPosition,
      relativeRootRight: tabDimensions.rootRight - scrollPosition,
      relativeContentLeft: tabDimensions.contentLeft - scrollPosition,
      relativeContentRight: tabDimensions.contentRight - scrollPosition,
    };
  }

  /**
   * Determines the index of the next adjacent tab
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions Whether the next tab is left or right
   * @param {number} scrollPosition The current scroll position
   * @param {number} barWidth The width of the tab bar
   * @return {number}
   * @private
   */
  computeClosestOccludedTabIndex_(index, tabDimensions, scrollPosition, barWidth) {
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
      return this.computeNextAdjacentTabRTL_(index, tabDimensions, scrollPosition, barWidth);
    }

    const relativeTabRootLeft = tabDimensions.rootLeft - scrollPosition;
    const relativeTabRootRight = tabDimensions.rootRight - scrollPosition - barWidth;
    const relativeTabRootDelta = relativeTabRootLeft + relativeTabRootRight;

    const leftEdgeIsOccluded = relativeTabRootLeft < 0 || relativeTabRootDelta < 0;
    const rightEdgeIsOccluded = relativeTabRootRight > 0 || relativeTabRootDelta > 0;

    if (leftEdgeIsOccluded) {
      return index - 1;
    }

    if (rightEdgeIsOccluded) {
      return index + 1;
    }

    return index;
  }

  /**
   * Determines the index of the next adjacent tab in RTL
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions Whether the next tab is left or right
   * @param {number} scrollDistance The distance scrolled
   * @param {number} scrollWidth The width of the scroller
   * @return {number}
   * @private
   */
  computeNextAdjacentTabRTL_(index, tabDimensions, scrollDistance, scrollWidth) {
    const relativeTabRootLeft = tabDimensions.rootLeft - scrollDistance;
    const relativeTabRootRight = tabDimensions.rootRight - scrollDistance - scrollWidth;
    const relativeTabRootDelta = relativeTabRootLeft + relativeTabRootRight;

    if (relativeTabRootLeft < 0 || relativeTabRootDelta < 0) {
      return index + 1;
    }

    if (relativeTabRootRight > 0 || relativeTabRootDelta > 0) {
      return index - 1;
    }

    return index;
  }

  /**
   * Computes the distance between the content and the root
   * @param {!MDCTabDimensions} tabDimensions The dimensions of the tab
   * @param {boolean} isLeft Whether the tab is to the left or not
   * @return {number}
   * @private
   */
  computeTabContentDistance_(tabDimensions, isLeft) {
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
     *    +---+-------+---+
     */
    if (isLeft) {
      return tabDimensions.contentRight - tabDimensions.rootRight;
    }

    return tabDimensions.contentLeft - tabDimensions.rootLeft;
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

  nextTab_(evt) {
    if (this.isRTL_()) {
      return this.nextTabRTL_(evt);
    }

    const maxTabIndex = this.tabs_.length - 1;

    let nextTabIndex = this.activeIndex_;
    switch (evt.key) {
    case 'ArrowLeft':
      nextTabIndex -= 1;
      break;
    case 'ArrowRight':
      nextTabIndex += 1;
      break;
    case 'Home':
      nextTabIndex = 0;
      break;
    case 'End':
      nextTabIndex = maxTabIndex;
      break;
    }

    if (nextTabIndex === -1) {
      nextTabIndex = maxTabIndex;
    } else if (nextTabIndex > maxTabIndex) {
      nextTabIndex = 0;
    }

    this.activateTab(nextTabIndex);
  }

  nextTabRTL_(evt) {
    const maxTabIndex = this.tabs_.length - 1;
    let nextTabIndex = this.activeIndex_;
    switch (evt.key) {
    case 'ArrowLeft':
      nextTabIndex += 1;
      break;
    case 'ArrowRight':
      nextTabIndex -= 1;
      break;
    case 'Home':
      nextTabIndex = 0;
      break;
    case 'End':
      nextTabIndex = maxTabIndex;
      break;
    }

    if (nextTabIndex === -1) {
      nextTabIndex = maxTabIndex;
    } else if (nextTabIndex > maxTabIndex) {
      nextTabIndex = 0;
    }

    this.activateTab(nextTabIndex);
  }
}

export default MDCTabBarFoundation;
