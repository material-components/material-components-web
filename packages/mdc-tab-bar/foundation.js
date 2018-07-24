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
      getScrollContentWidth: () => {},
      getOffsetWidth: () => {},
      isRTL: () => {},
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
    this.activateTab(this.tabs_.indexOf(evt.detail.tab));
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

    // Early exit if the event key isn't one of the keyboard navigation keys
    if (keyboardNavigation.indexOf(evt.key) === -1) {
      return;
    }

    evt.preventDefault();
    this.activateTabFromKeydown_(evt);
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
    const previousActiveTab = this.tabs_[this.activeIndex_];
    this.activeIndex_ = index;
    previousActiveTab.deactivate();
    tabToActivate.activate(previousActiveTab.computeIndicatorClientRect());
    this.scrollIntoView(index);
  }

  /**
   * Scrolls the tab at the given index into view
   * @param {number} index The tab index to make visible
   */
  scrollIntoView(index) {
    // Early exit if the index is out of range
    if (!this.indexIsInRange_(index)) {
      return;
    }

    // Always scroll to 0 if scrolling to the 0th index
    if (index === 0) {
      return this.adapter_.scrollTo(0);
    }

    // Always scroll to the max value if scrolling to the Nth index
    // MDCTabScroller.scrollTo() will never scroll past the max possible value
    if (index === this.tabs_.length - 1) {
      return this.adapter_.scrollTo(this.adapter_.getScrollContentWidth());
    }

    if (this.isRTL_()) {
      return this.scrollIntoViewRTL_(index);
    }

    this.scrollIntoView_(index);
  }

  /**
   * Scrolls the tab at the given index into view for left-to-right useragents
   * @param {number} index The index of the tab to scroll into view
   * @private
   */
  scrollIntoView_(index) {
    const scrollPosition = this.adapter_.computeScrollPosition();
    const barWidth = this.adapter_.getOffsetWidth();
    const tabDimensions = this.tabs_[index].computeDimensions();
    const nextIndex = this.findIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth);

    if (!this.indexIsInRange_(nextIndex)) {
      return;
    }

    const scrollIncrement = this.calculateScrollIncrement_(index, nextIndex, scrollPosition, barWidth);
    this.adapter_.incrementScroll(scrollIncrement);
  }

  calculateScrollIncrement_(index, nextTabIndex, scrollPosition, barWidth) {
    const nextTabDimensions = this.tabs_[nextTabIndex].computeDimensions();
    const relativeContentLeft = nextTabDimensions.contentLeft - scrollPosition - barWidth;
    const relativeContentRight = nextTabDimensions.contentRight - scrollPosition;
    const leftIncrement = relativeContentRight - numbers.EXTRA_SCROLL_AMOUNT;
    const rightIncrement = relativeContentLeft + numbers.EXTRA_SCROLL_AMOUNT;

    if (nextTabIndex < index) {
      return Math.min(leftIncrement, 0);
    }

    return Math.max(rightIncrement, 0);
  }

  /**
   * Scrolls the tab at the given index into view in RTL
   * @param {number} index The tab index to make visible
   * @private
   */
  scrollIntoViewRTL_(index) {
    const barWidth = this.adapter_.getOffsetWidth();
    const scrollWidth = this.adapter_.getScrollContentWidth();
    const scrollPosition = this.adapter_.computeScrollPosition();
    const tabDimensions = this.tabs_[index].computeDimensions();
    const nextIndex = this.findIndexClosestToEdgeRTL_(index, tabDimensions, scrollPosition, scrollWidth, barWidth);

    if (!this.indexIsInRange_(nextIndex)) {
      return;
    }

    const scrollIncrement = this.calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, scrollWidth, barWidth);
    this.adapter_.incrementScroll(scrollIncrement);
  }

  calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, scrollWidth, barWidth) {
    const nextTabDimensions = this.tabs_[nextIndex].computeDimensions();
    const relativeContentLeft = scrollWidth - nextTabDimensions.contentLeft - scrollPosition;
    const relativeContentRight = scrollWidth - nextTabDimensions.contentRight - scrollPosition - barWidth;
    const leftIncrement = relativeContentRight + numbers.EXTRA_SCROLL_AMOUNT;
    const rightIncrement = relativeContentLeft - numbers.EXTRA_SCROLL_AMOUNT;

    if (nextIndex > index) {
      return Math.max(leftIncrement, 0);
    }

    return Math.min(rightIncrement, 0);
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
   * Determines the index of the next adjacent tab
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions Whether the next tab is left or right
   * @param {number} scrollPosition The current scroll position
   * @param {number} barWidth The width of the tab bar
   * @return {number}
   * @private
   */
  findIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth) {
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
    const rootLeft = tabDimensions.rootLeft - scrollPosition;
    const rootRight = tabDimensions.rootRight - scrollPosition - barWidth;
    const rootDelta = rootLeft + rootRight;
    const leftEdgeIsCloser = rootLeft < 0 || rootDelta < 0;
    const rightEdgeIsCloser = rootRight > 0 || rootDelta > 0;

    if (leftEdgeIsCloser) {
      return index - 1;
    }

    if (rightEdgeIsCloser) {
      return index + 1;
    }

    return -1;
  }

  /**
   * Determines the index of the next adjacent tab in RTL
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions Whether the next tab is left or right
   * @param {number} scrollDistance The distance scrolled
   * @param {number} scrollWidth The width of the scroller
   * @param {number} barWidth The width of the bar
   * @return {number}
   * @private
   */
  findIndexClosestToEdgeRTL_(index, tabDimensions, scrollDistance, scrollWidth, barWidth) {
    const rootLeft = scrollWidth - tabDimensions.rootLeft - barWidth - scrollDistance;
    const rootRight = scrollWidth - tabDimensions.rootRight - scrollDistance;
    const rootDelta = rootLeft + rootRight;
    const leftEdgeIsCloser = rootLeft > 0 || rootDelta > 0;
    const rightEdgeIsCloser = rootRight < 0 || rootDelta < 0;

    if (leftEdgeIsCloser) {
      return index + 1;
    }

    if (rightEdgeIsCloser) {
      return index - 1;
    }

    return -1;
  }

  /**
   * Initializes the active Tab
   * @private
   */
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
    return this.adapter_.isRTL();
  }

  activateTabFromKeydown_(evt) {
    if (this.isRTL_()) {
      return this.activateTabFromKeydownRTL_(evt);
    }

    const maxTabIndex = this.tabs_.length - 1;

    let nextTabIndex = this.activeIndex_;
    switch (evt.key) {
    case 'Home':
      nextTabIndex = 0;
      break;
    case 'End':
      nextTabIndex = maxTabIndex;
      break;
    case 'ArrowLeft':
      nextTabIndex -= 1;
      break;
    case 'ArrowRight':
      nextTabIndex += 1;
      break;
    }

    if (nextTabIndex < 0) {
      nextTabIndex = maxTabIndex;
    } else if (nextTabIndex > maxTabIndex) {
      nextTabIndex = 0;
    }

    this.activateTab(nextTabIndex);
  }

  activateTabFromKeydownRTL_(evt) {
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
