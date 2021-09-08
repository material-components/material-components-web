/**
 * @license
 * Copyright 2018 Google Inc.
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

import {MDCFoundation} from '@material/base/foundation';
import {MDCTabDimensions, MDCTabInteractionEvent} from '@material/tab/types';
import {MDCTabBarAdapter} from './adapter';
import {numbers, strings} from './constants';

const ACCEPTABLE_KEYS = new Set<string>();
// IE11 has no support for new Set with iterable so we need to initialize this by hand
ACCEPTABLE_KEYS.add(strings.ARROW_LEFT_KEY);
ACCEPTABLE_KEYS.add(strings.ARROW_RIGHT_KEY);
ACCEPTABLE_KEYS.add(strings.END_KEY);
ACCEPTABLE_KEYS.add(strings.HOME_KEY);
ACCEPTABLE_KEYS.add(strings.ENTER_KEY);
ACCEPTABLE_KEYS.add(strings.SPACE_KEY);

const KEYCODE_MAP = new Map<number, string>();
// IE11 has no support for new Map with iterable so we need to initialize this by hand
KEYCODE_MAP.set(numbers.ARROW_LEFT_KEYCODE, strings.ARROW_LEFT_KEY);
KEYCODE_MAP.set(numbers.ARROW_RIGHT_KEYCODE, strings.ARROW_RIGHT_KEY);
KEYCODE_MAP.set(numbers.END_KEYCODE, strings.END_KEY);
KEYCODE_MAP.set(numbers.HOME_KEYCODE, strings.HOME_KEY);
KEYCODE_MAP.set(numbers.ENTER_KEYCODE, strings.ENTER_KEY);
KEYCODE_MAP.set(numbers.SPACE_KEYCODE, strings.SPACE_KEY);

export class MDCTabBarFoundation extends MDCFoundation<MDCTabBarAdapter> {
  static override get strings() {
    return strings;
  }

  static override get numbers() {
    return numbers;
  }

  static override get defaultAdapter(): MDCTabBarAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      scrollTo: () => undefined,
      incrementScroll: () => undefined,
      getScrollPosition: () => 0,
      getScrollContentWidth: () => 0,
      getOffsetWidth: () => 0,
      isRTL: () => false,
      setActiveTab: () => undefined,
      activateTabAtIndex: () => undefined,
      deactivateTabAtIndex: () => undefined,
      focusTabAtIndex: () => undefined,
      getTabIndicatorClientRectAtIndex: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      getTabDimensionsAtIndex: () =>
          ({rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0}),
      getPreviousActiveTabIndex: () => -1,
      getFocusedTabIndex: () => -1,
      getIndexOfTabById: () => -1,
      getTabListLength: () => 0,
      notifyTabActivated: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private useAutomaticActivation = false;

  constructor(adapter?: Partial<MDCTabBarAdapter>) {
    super({...MDCTabBarFoundation.defaultAdapter, ...adapter});
  }

  /**
   * Switches between automatic and manual activation modes.
   * See https://www.w3.org/TR/wai-aria-practices/#tabpanel for examples.
   */
  setUseAutomaticActivation(useAutomaticActivation: boolean) {
    this.useAutomaticActivation = useAutomaticActivation;
  }

  activateTab(index: number) {
    const previousActiveIndex = this.adapter.getPreviousActiveTabIndex();
    if (!this.indexIsInRange(index) || index === previousActiveIndex) {
      return;
    }

    let previousClientRect;
    if (previousActiveIndex !== -1) {
      this.adapter.deactivateTabAtIndex(previousActiveIndex);
      previousClientRect =
          this.adapter.getTabIndicatorClientRectAtIndex(previousActiveIndex);
    }

    this.adapter.activateTabAtIndex(index, previousClientRect);
    this.scrollIntoView(index);

    this.adapter.notifyTabActivated(index);
  }

  handleKeyDown(evt: KeyboardEvent) {
    // Get the key from the event
    const key = this.getKeyFromEvent(evt);

    // Early exit if the event key isn't one of the keyboard navigation keys
    if (key === undefined) {
      return;
    }

    // Prevent default behavior for movement keys, but not for activation keys, since :active is used to apply ripple
    if (!this.isActivationKey(key)) {
      evt.preventDefault();
    }

    if (this.useAutomaticActivation) {
      if (this.isActivationKey(key)) {
        return;
      }

      const index = this.determineTargetFromKey(
          this.adapter.getPreviousActiveTabIndex(), key);
      this.adapter.setActiveTab(index);
      this.scrollIntoView(index);
    } else {
      const focusedTabIndex = this.adapter.getFocusedTabIndex();
      if (this.isActivationKey(key)) {
        this.adapter.setActiveTab(focusedTabIndex);
      } else {
        const index = this.determineTargetFromKey(focusedTabIndex, key);
        this.adapter.focusTabAtIndex(index);
        this.scrollIntoView(index);
      }
    }
  }

  /**
   * Handles the MDCTab:interacted event
   */
  handleTabInteraction(evt: MDCTabInteractionEvent) {
    this.adapter.setActiveTab(this.adapter.getIndexOfTabById(evt.detail.tabId));
  }

  /**
   * Scrolls the tab at the given index into view
   * @param index The tab index to make visible
   */
  scrollIntoView(index: number) {
    // Early exit if the index is out of range
    if (!this.indexIsInRange(index)) {
      return;
    }

    // Always scroll to 0 if scrolling to the 0th index
    if (index === 0) {
      this.adapter.scrollTo(0);
      return;
    }

    // Always scroll to the max value if scrolling to the Nth index
    // MDCTabScroller.scrollTo() will never scroll past the max possible value
    if (index === this.adapter.getTabListLength() - 1) {
      this.adapter.scrollTo(this.adapter.getScrollContentWidth());
      return;
    }

    if (this.isRTL()) {
      this.scrollIntoViewImplRTL(index);
      return;
    }

    this.scrollIntoViewImpl(index);
  }

  /**
   * Private method for determining the index of the destination tab based on what key was pressed
   * @param origin The original index from which to determine the destination
   * @param key The name of the key
   */
  private determineTargetFromKey(origin: number, key: string): number {
    const isRTL = this.isRTL();
    const maxIndex = this.adapter.getTabListLength() - 1;
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
   * @param index The index of the tab
   * @param nextIndex The index of the next tab
   * @param scrollPosition The current scroll position
   * @param barWidth The width of the Tab Bar
   */
  private calculateScrollIncrement(
      index: number,
      nextIndex: number,
      scrollPosition: number,
      barWidth: number,
      ): number {
    const nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
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
   * @param index The index of the tab
   * @param nextIndex The index of the next tab
   * @param scrollPosition The current scroll position
   * @param barWidth The width of the Tab Bar
   * @param scrollContentWidth The width of the scroll content
   */
  private calculateScrollIncrementRTL(
      index: number,
      nextIndex: number,
      scrollPosition: number,
      barWidth: number,
      scrollContentWidth: number,
      ): number {
    const nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
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
   * @param index The index of the tab
   * @param tabDimensions The dimensions of the tab
   * @param scrollPosition The current scroll position
   * @param barWidth The width of the tab bar
   */
  private findAdjacentTabIndexClosestToEdge(
      index: number,
      tabDimensions: MDCTabDimensions,
      scrollPosition: number,
      barWidth: number,
      ): number {
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
   * @param index The index of the tab
   * @param tabDimensions The dimensions of the tab
   * @param scrollPosition The current scroll position
   * @param barWidth The width of the tab bar
   * @param scrollContentWidth The width of the scroller content
   */
  private findAdjacentTabIndexClosestToEdgeRTL(
      index: number,
      tabDimensions: MDCTabDimensions,
      scrollPosition: number,
      barWidth: number,
      scrollContentWidth: number,
      ): number {
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
   * @param evt The keydown event
   */
  private getKeyFromEvent(evt: KeyboardEvent): string {
    if (ACCEPTABLE_KEYS.has(evt.key)) {
      return evt.key;
    }
    return KEYCODE_MAP.get(evt.keyCode)!;
  }

  private isActivationKey(key: string) {
    return key === strings.SPACE_KEY || key === strings.ENTER_KEY;
  }

  /**
   * Returns whether a given index is inclusively between the ends
   * @param index The index to test
   */
  private indexIsInRange(index: number) {
    return index >= 0 && index < this.adapter.getTabListLength();
  }

  /**
   * Returns the view's RTL property
   */
  private isRTL(): boolean {
    return this.adapter.isRTL();
  }

  /**
   * Scrolls the tab at the given index into view for left-to-right user agents.
   * @param index The index of the tab to scroll into view
   */
  private scrollIntoViewImpl(index: number) {
    const scrollPosition = this.adapter.getScrollPosition();
    const barWidth = this.adapter.getOffsetWidth();
    const tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
    const nextIndex = this.findAdjacentTabIndexClosestToEdge(
        index, tabDimensions, scrollPosition, barWidth);

    if (!this.indexIsInRange(nextIndex)) {
      return;
    }

    const scrollIncrement = this.calculateScrollIncrement(
        index, nextIndex, scrollPosition, barWidth);
    this.adapter.incrementScroll(scrollIncrement);
  }

  /**
   * Scrolls the tab at the given index into view in RTL
   * @param index The tab index to make visible
   */
  private scrollIntoViewImplRTL(index: number) {
    const scrollPosition = this.adapter.getScrollPosition();
    const barWidth = this.adapter.getOffsetWidth();
    const tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
    const scrollWidth = this.adapter.getScrollContentWidth();
    const nextIndex = this.findAdjacentTabIndexClosestToEdgeRTL(
        index, tabDimensions, scrollPosition, barWidth, scrollWidth);

    if (!this.indexIsInRange(nextIndex)) {
      return;
    }

    const scrollIncrement = this.calculateScrollIncrementRTL(
        index, nextIndex, scrollPosition, barWidth, scrollWidth);
    this.adapter.incrementScroll(scrollIncrement);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabBarFoundation;
