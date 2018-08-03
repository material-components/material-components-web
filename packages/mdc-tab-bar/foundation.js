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
 * @type {Set<string>}
 */
const ACCEPTABLE_KEYS = new Set();
// IE11 has no support for new Set with iterable so we need to initialize this by hand
ACCEPTABLE_KEYS.add(strings.ARROW_LEFT_KEY);
ACCEPTABLE_KEYS.add(strings.ARROW_RIGHT_KEY);
ACCEPTABLE_KEYS.add(strings.END_KEY);
ACCEPTABLE_KEYS.add(strings.HOME_KEY);
ACCEPTABLE_KEYS.add(strings.SPACE_KEY);
ACCEPTABLE_KEYS.add(strings.ENTER_KEY);

/**
 * @type {Map<number, string>}
 */
const KEYCODE_MAP = new Map();
// IE11 has no support for new Map with iterable so we need to initialize this by hand
KEYCODE_MAP.set(numbers.HOME_KEYCODE, strings.HOME_KEY);
KEYCODE_MAP.set(numbers.END_KEYCODE, strings.END_KEY);
KEYCODE_MAP.set(numbers.ARROW_LEFT_KEYCODE, strings.ARROW_LEFT_KEY);
KEYCODE_MAP.set(numbers.ARROW_RIGHT_KEYCODE, strings.ARROW_RIGHT_KEY);

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
      getScrollPosition: () => {},
      getScrollContentWidth: () => {},
      getOffsetWidth: () => {},
      isRTL: () => {},
      activateTabAtIndex: () => {},
      deactivateTabAtIndex: () => {},
      getTabIndicatorClientRectAtIndex: () => {},
      getTabDimensionsAtIndex: () => {},
      getActiveTabIndex: () => {},
      getIndexOfTab: () => {},
      getTabListLength: () => {},
      notifyTabActivated: () => {},
    });
  }

  /**
   * @param {!MDCTabBarAdapter} adapter
   * */
  constructor(adapter) {
    super(Object.assign(MDCTabBarFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.useAutomaticActivation_ = true;
  }

  init() {
    const activeIndex = this.adapter_.getActiveTabIndex();
    this.scrollIntoView(activeIndex);
  }

  /**
   * Switches between automatic and manual activation models.
   * See https://www.w3.org/TR/wai-aria-practices/#tabpanel for examples.
   * @param {boolean} useAutomaticActivation
   */
  setUseAutomaticActivation(useAutomaticActivation) {
    this.useAutomaticActivation_ = useAutomaticActivation;
  }

  /**
   * Activates the tab at the given index
   * @param {number} index
   */
  activateTab(index) {
    const previousActiveIndex = this.adapter_.getActiveTabIndex();
    if (!this.indexIsInRange_(index)) {
      return;
    }

    this.adapter_.deactivateTabAtIndex(previousActiveIndex);
    this.adapter_.activateTabAtIndex(index, this.adapter_.getTabIndicatorClientRectAtIndex(previousActiveIndex));
    this.scrollIntoView(index);

    // Only notify the tab activation if the index is different than the previously active index
    if (index !== previousActiveIndex) {
      this.adapter_.notifyTabActivated(index);
    }
  }

  /**
   * Handles the keydown event
   * @param {!Event} evt
   */
  handleKeyDown(evt) {
    // Get the key from the event
    const key = this.getKeyFromEvent_(evt);

    // Early exit if the event key isn't one of the keyboard navigation keys
    if (key === undefined) {
      return;
    }

    evt.preventDefault();

    if (this.useAutomaticActivation_) {
      let index = this.determineTargetFromKey_(this.adapter_.getActiveTabIndex(), key);
      this.activateTab(index);
      this.scrollIntoView(index);
    } else {
      const focusedTabIndex = this.adapter_.getFocusedTabIndex();
      if (key === strings.SPACE_KEY || key === strings.ENTER_KEY) {
        this.activateTab(focusedTabIndex);
      } else {
        let index = this.determineTargetFromKey_(focusedTabIndex, key);
        this.adapter_.focusTabAtIndex(index);
        this.scrollIntoView(index);
      }
    }
  }

  /**
   * Handles the MDCTab:interacted event
   * @param {!Event} evt
   */
  handleTabInteraction(evt) {
    this.activateTab(this.adapter_.getIndexOfTab(evt.detail.tab));
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
    if (index === this.adapter_.getTabListLength() - 1) {
      return this.adapter_.scrollTo(this.adapter_.getScrollContentWidth());
    }

    if (this.isRTL_()) {
      return this.scrollIntoViewRTL_(index);
    }

    this.scrollIntoView_(index);
  }

  /**
   * Private method for determining the index of the destination tab based on what key was pressed
   * @param {number} origin The original index from which to determine the destination
   * @param {string} key The name of the key
   * @return {number}
   * @private
   */
  determineTargetFromKey_(origin, key) {
    const isRTL = this.isRTL_();
    const maxIndex = this.adapter_.getTabListLength() - 1;
    const shouldGoToEnd = key === strings.END_KEY;
    const shouldDecrement = key === strings.ARROW_LEFT_KEY && !isRTL || key === strings.ARROW_RIGHT_KEY && isRTL;
    const shouldIncrement = key === strings.ARROW_RIGHT_KEY && !isRTL || key === strings.ARROW_LEFT_KEY && isRTL;
    let index = origin;

    if (shouldGoToEnd) {
      index = maxIndex;
    } else if (shouldDecrement) {
      index -= 1;
    } else if (shouldIncrement) {
      index += 1;
    } else {
      index = 0;
    }

    if (index < 0) {
      index = maxIndex;
    } else if (index > maxIndex) {
      index = 0;
    }

    return index;
  }

  /**
   * Calculates the scroll increment that will make the tab at the given index visible
   * @param {number} index The index of the tab
   * @param {number} nextIndex The index of the next tab
   * @param {number} scrollPosition The current scroll position
   * @param {number} barWidth The width of the Tab Bar
   * @return {number}
   * @private
   */
  calculateScrollIncrement_(index, nextIndex, scrollPosition, barWidth) {
    const nextTabDimensions = this.adapter_.getTabDimensionsAtIndex(nextIndex);
    const relativeContentLeft = nextTabDimensions.contentLeft - scrollPosition - barWidth;
    const relativeContentRight = nextTabDimensions.contentRight - scrollPosition;
    const leftIncrement = relativeContentRight - numbers.EXTRA_SCROLL_AMOUNT;
    const rightIncrement = relativeContentLeft + numbers.EXTRA_SCROLL_AMOUNT;

    if (nextIndex < index) {
      return Math.min(leftIncrement, 0);
    }

    return Math.max(rightIncrement, 0);
  }

  /**
   * Calculates the scroll increment that will make the tab at the given index visible in RTL
   * @param {number} index The index of the tab
   * @param {number} nextIndex The index of the next tab
   * @param {number} scrollPosition The current scroll position
   * @param {number} barWidth The width of the Tab Bar
   * @param {number} scrollContentWidth The width of the scroll content
   * @return {number}
   * @private
   */
  calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, barWidth, scrollContentWidth) {
    const nextTabDimensions = this.adapter_.getTabDimensionsAtIndex(nextIndex);
    const relativeContentLeft = scrollContentWidth - nextTabDimensions.contentLeft - scrollPosition;
    const relativeContentRight = scrollContentWidth - nextTabDimensions.contentRight - scrollPosition - barWidth;
    const leftIncrement = relativeContentRight + numbers.EXTRA_SCROLL_AMOUNT;
    const rightIncrement = relativeContentLeft - numbers.EXTRA_SCROLL_AMOUNT;

    if (nextIndex > index) {
      return Math.max(leftIncrement, 0);
    }

    return Math.min(rightIncrement, 0);
  }

  /**
   * Determines the index of the adjacent tab closest to either edge of the Tab Bar
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions The dimensions of the tab
   * @param {number} scrollPosition The current scroll position
   * @param {number} barWidth The width of the tab bar
   * @return {number}
   * @private
   */
  findAdjacentTabIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth) {
    /**
     * Tabs are laid out in the Tab Scroller like this:
     *
     *    Scroll Position
     *    +---+
     *    |   |   Bar Width
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
     * Tab root right, both relative to the scroll position. If the Tab root
     * left is less than 0, then we know it's out of view to the left. If the
     * Tab root right minus the bar width is greater than 0, we know the Tab is
     * out of view to the right. From there, we either increment or decrement
     * the index.
     */
    const relativeRootLeft = tabDimensions.rootLeft - scrollPosition;
    const relativeRootRight = tabDimensions.rootRight - scrollPosition - barWidth;
    const relativeRootDelta = relativeRootLeft + relativeRootRight;
    const leftEdgeIsCloser = relativeRootLeft < 0 || relativeRootDelta < 0;
    const rightEdgeIsCloser = relativeRootRight > 0 || relativeRootDelta > 0;

    if (leftEdgeIsCloser) {
      return index - 1;
    }

    if (rightEdgeIsCloser) {
      return index + 1;
    }

    return -1;
  }

  /**
   * Determines the index of the adjacent tab closest to either edge of the Tab Bar in RTL
   * @param {number} index The index of the tab
   * @param {!MDCTabDimensions} tabDimensions The dimensions of the tab
   * @param {number} scrollPosition The current scroll position
   * @param {number} barWidth The width of the tab bar
   * @param {number} scrollContentWidth The width of the scroller content
   * @return {number}
   * @private
   */
  findAdjacentTabIndexClosestToEdgeRTL_(index, tabDimensions, scrollPosition, barWidth, scrollContentWidth) {
    const rootLeft = scrollContentWidth - tabDimensions.rootLeft - barWidth - scrollPosition;
    const rootRight = scrollContentWidth - tabDimensions.rootRight - scrollPosition;
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
   * Returns the key associated with a keydown event
   * @param {!Event} evt The keydown event
   * @return {string}
   * @private
   */
  getKeyFromEvent_(evt) {
    if (ACCEPTABLE_KEYS.has(evt.key)) {
      return evt.key;
    }

    return KEYCODE_MAP.get(evt.keyCode);
  }

  /**
   * Returns whether a given index is inclusively between the ends
   * @param {number} index The index to test
   * @private
   */
  indexIsInRange_(index) {
    return index >= 0 && index < this.adapter_.getTabListLength();
  }

  /**
   * Returns the view's RTL property
   * @return {boolean}
   * @private
   */
  isRTL_() {
    return this.adapter_.isRTL();
  }

  /**
   * Scrolls the tab at the given index into view for left-to-right useragents
   * @param {number} index The index of the tab to scroll into view
   * @private
   */
  scrollIntoView_(index) {
    const scrollPosition = this.adapter_.getScrollPosition();
    const barWidth = this.adapter_.getOffsetWidth();
    const tabDimensions = this.adapter_.getTabDimensionsAtIndex(index);
    const nextIndex = this.findAdjacentTabIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth);

    if (!this.indexIsInRange_(nextIndex)) {
      return;
    }

    const scrollIncrement = this.calculateScrollIncrement_(index, nextIndex, scrollPosition, barWidth);
    this.adapter_.incrementScroll(scrollIncrement);
  }

  /**
   * Scrolls the tab at the given index into view in RTL
   * @param {number} index The tab index to make visible
   * @private
   */
  scrollIntoViewRTL_(index) {
    const scrollPosition = this.adapter_.getScrollPosition();
    const barWidth = this.adapter_.getOffsetWidth();
    const tabDimensions = this.adapter_.getTabDimensionsAtIndex(index);
    const scrollWidth = this.adapter_.getScrollContentWidth();
    const nextIndex = this.findAdjacentTabIndexClosestToEdgeRTL_(
      index, tabDimensions, scrollPosition, barWidth, scrollWidth);

    if (!this.indexIsInRange_(nextIndex)) {
      return;
    }

    const scrollIncrement = this.calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, barWidth, scrollWidth);
    this.adapter_.incrementScroll(scrollIncrement);
  }
}

export default MDCTabBarFoundation;
