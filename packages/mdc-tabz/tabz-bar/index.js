import {MDCTabz} from '../tabz';
import {MDCTabzIndicator} from '../tabz-indicator';
import {MDCTabzContainer} from '../tabz-container';
import {MDCTabzPager} from '../tabz-pager';

const strings = {
  TABZ_SELECTOR: '.mdc-tabz',
  RESIZE_INDICATOR_SELECTOR: '.mdc-tabz-indicator',
  CONTAINER_SELECTOR: '.mdc-tabz-container',
  PAGER_SELECTOR: '.mdc-tabz-pager',
  PAGER_NEXT_SELECTOR: '.mdc-tabz-pager--next',
  PAGER_PREV_SELECTOR: '.mdc-tabz-pager--prev',
};

const cssClasses = {
  PAGING: 'mdc-tabz-bar--paging',
  PAGING_NEXT: '',
};

const numbers = {
  SCROLL_OFFSET_FACTOR: 1.5,
};

class MDCTabzBar {
  static attachTo(root) {
    return new MDCTabzBar(root);
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get cssClasses() {
    return cssClasses;
  }

  constructor(root) {
    // Component initialization
    this.root_ = root;

    const containerRoot = root.querySelector(strings.CONTAINER_SELECTOR);
    this.container_ = MDCTabzContainer.attachTo(containerRoot);

    const indicator = this.root_.querySelector(strings.RESIZE_INDICATOR_SELECTOR);
    this.indicator_ = MDCTabzIndicator.attachTo(indicator);

    const tabz = this.root_.querySelectorAll(strings.TABZ_SELECTOR);
    this.tabz_ = Array.from(tabz).map((tab) => MDCTabz.attachTo(tab));

    const pagerNext = this.root_.querySelector(strings.PAGER_NEXT_SELECTOR);
    if (pagerNext) {
      this.pagerNext_ = MDCTabzPager.attachTo(pagerNext);
    }

    // Event Handlers
    this.handleResize_ = () => this.handleResize();
    this.handleTabSelection_ = (e) => this.handleTabSelection(e);
    this.handleNextPageClick_ = () => this.handleNextPageClick();
    this.handlePrevPageClick_ = () => this.handlePrevPageClick();

    // Adapter initialization
    this.adapter_ = {
      getRootBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      registerWindowEventListener: (evtType, handler) =>
        window.addEventListener(evtType, handler),
      deregisterWindowEventListener: (evtType, handler) =>
        window.removeEventListener(evtType, handler),
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      hasClass: (className) =>
        this.root_.classList.contains(className),
    };

    /** @private {number} */
    this.activeIndex_ = this.tabz_.findIndex((tab) => tab.isActive()) || 0;

    /** @private {number} The ID of the requestAnimationFrame */
    this.updateFrame_ = 0;

    this.init();
  }

  init() {
    this.updateIndicator();
    // Window events
    this.adapter_.registerWindowEventListener('resize', this.handleResize_);
    // Tab events
    this.adapter_.registerEventListener(MDCTabz.strings.TABZ_EVENT, this.handleTabSelection_);
    // Pager events
    this.adapter_.registerEventListener(MDCTabzPager.strings.NEXT, this.handleNextPageClick_);
    this.adapter_.registerEventListener(MDCTabzPager.strings.PREV, this.handlePrevPageClick_);
  }

  /**
   * Returns the active tab
   * @return {!MDCTabz}
   * @private
   */
  getActiveTab() {
    return this.getTabAtIndex_(this.activeIndex_);
  }

  /**
   * Returns the index of the selected tab
   * @return {number}
   * @private
   */
  getIndexOfTab_(target) {
    return this.tabz_.indexOf(target);
  }

  /**
   * Returns the tab at the given index
   * @param {number} index The index of the tab to retrieve
   * @return {!MDCTabz}
   * @private
   */
  getTabAtIndex_(index) {
    return this.tabz_[index];
  }

  /**
   * Returns whether the index is within the tab range
   * @param {number} index The index to check
   * @return {boolean}
   * @private
   */
  isIndexInRange_(index) {
    return index >= 0 && index < this.tabz_.length;
  }

  /**
   * Returns whether the index is between the tab ends
   * @param {number} index The index to check
   * @return {boolean}
   * @private
   */
  isIndexBetweenEnds_(index) {
    return index > 0 && index < this.tabz_.length - 1;
  }

  /**
   * Handles the tab selection event
   * @param {!Event} e A browser event
   */
  handleTabSelection(e) {
    this.activateTab(this.getIndexOfTab_(e.detail.tab));
  }

  /**
   * Handles the window resize event
   */
  handleResize() {
    if (this.updateFrame_ !== 0) {
      cancelAnimationFrame(this.updateFrame_);
    }
    this.updateFrame_ = requestAnimationFrame(() => {
      this.updateIndicator();
    });
  }

  /** Handles the next page click */
  handleNextPageClick() {
    const containerBbox = this.container_.getRootBoundingClientRect();
    const innerBbox = this.container_.getInnerBoundingClientRect();
    const innerOffset = innerBbox.left - containerBbox.left;
    const tabLength = this.tabz_.length;
    let i = 0;
    let slideTo = 0;
    let tabsToRightAreOccluded = false;

    while (!tabsToRightAreOccluded && i < tabLength) {
      const tabLeft = this.tabz_[i].getRootOffsetLeft();
      const tabRight = tabLeft + this.tabz_[i].getRootOffsetWidth();
      const tabRightRelative = tabRight + innerOffset;
      slideTo = tabLeft;
      tabsToRightAreOccluded = tabRightRelative > containerBbox.width;
      i++;
    }

    if (tabsToRightAreOccluded) {
      this.container_.slideTo(slideTo * -1);
    }

    const remainingInnerWidth = innerBbox.width - slideTo;
    if (remainingInnerWidth < containerBbox.width) {
      this.pagerNext_.hide();
    }
  }

  /** Handles the prev page click */
  handlePrevPageClick() {
    const containerBbox = this.container_.getRootBoundingClientRect();
    const innerBbox = this.container_.getInnerBoundingClientRect();
    const innerOffset = innerBbox.left - containerBbox.left;
    const tabLength = this.tabz_.length;
    let i = tabLength - 1;
    let slideTo = 0;
    let tabsToLeftAreOccluded = false;

    while (!tabsToLeftAreOccluded && i > 0) {
      const tabLeft = this.tabz_[i].getRootOffsetLeft();
      const tabRight = tabLeft + this.tabz_[i].getRootOffsetWidth();
      const tabRightRelative = tabRight + innerOffset;
      slideTo = tabLeft;
      tabsToLeftAreOccluded = tabRightRelative > containerBbox.width;
      i++;
    }

    if (tabsToLeftAreOccluded) {
      this.slideToPosition(slideTo);
    }
  }

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab to activate
   */
  activateTab(index) {
    // Early exit
    if (index === this.activeIndex_ || !this.isIndexInRange_(index)) {
      return;
    }
    this.getActiveTab().deactivate();
    this.activeIndex_ = index;
    this.slideTabIntoView_(index);
    this.getActiveTab().activate();
    this.calculateIndicatorPosition();
    this.indicator_.animatePosition();
  }

  slideTabIntoView_(index) {
    // Early exit
    if (!this.isIndexInRange_(index)) {
      return;
    }

    // Check if tabs are between ends
    const tabIsBetweenEnds = this.isIndexBetweenEnds_(index);
    // Get the container and inner bounding rects
    const containerBbox = this.container_.getRootBoundingClientRect();
    const innerBbox = this.container_.getInnerBoundingClientRect();
    // Get the inner's offsetLeft
    const innerLeft = this.container_.getInnerOffsetLeft();
    // Calculate innerOffset
    const innerOffset = innerBbox.left - containerBbox.left;
    // Calculate innerScroll
    const innerScroll = containerBbox.left - innerBbox.left + innerLeft;
    // Get the current tab
    const tab = this.getTabAtIndex_(index);
    const tabRootLeft = tab.getRootOffsetLeft();
    const tabContentLeft = tab.getContentOffsetLeft();
    const tabLeftEdgeDistance = innerScroll - tabRootLeft;
    const tabRootRight = tabRootLeft + tab.getRootOffsetWidth();
    const tabRightEdgeDistance = tabRootRight + innerOffset - containerBbox.width;
    const slideToExtra = tabContentLeft * 2;
    let shouldSlide = false;
    let slideTo;

    console.log('innerScroll', innerScroll);
    console.log('tabLeftEdgeDistance', tabLeftEdgeDistance);
    console.log('tabRightEdgeDistance', tabRightEdgeDistance);
    console.log('tabRootLeft', tabRootLeft);
    console.log('tabContentLeft', tabContentLeft);

    // DEBUG
    const tabBbox = tab.root_.getBoundingClientRect();
    const containerBbox_ = this.container_.root_.getBoundingClientRect();
    console.log(tabBbox.right - containerBbox_.right);

    if (tabLeftEdgeDistance > 0) {
      slideTo = tabRootLeft;
    } else if (tabRightEdgeDistance > 0) {
      slideTo = tabRightEdgeDistance + innerScroll;
      if (tabIsBetweenEnds) {
        slideTo += slideToExtra;
      }
    }

    this.container_.slideTo(slideTo);

    // this.container_.scrollTo(slideTo);
    // console.log(tabLeft, tabRight, containerBbox.width);
  }

  /**
   * Slides the tab at the given index into view
   * @param {number} index The index of the tab to slide into view
   * @private
   */
  slideTabIntoView(index) {
    // Early exit
    if (!this.isIndexInRange_(index)) {
      return;
    }

    const tab = this.getTabAtIndex_(index);
    // Calculate the bounding boxes of the selected tab and the container
    const barBbox = this.container_.getRootBoundingClientRect();
    const containerBbox = this.container_.getInnerBoundingClientRect();
    if (containerBbox.width <= barBbox.width) {
      return;
    }

    // Determine the scrollLeft
    const tabIsBetweenEnds = this.isIndexBetweenEnds_(index);

    // Get initial bounding boxes
    const tabBbox = tab.getRootBoundingClientRect();
    const scrollExtra = tab.getContentOffsetLeft();

    // Determine the left and right gaps
    let leftGap = tabBbox.right - barBbox.right;
    let rightGap = barBbox.left - tabBbox.left;
    let targetScroll = 0;

    // Scroll to either left or right if necessary
    if (leftGap > 0) {
      if (tabIsBetweenEnds) {
        leftGap += scrollExtra * numbers.SCROLL_OFFSET_FACTOR;
      }
      targetScroll = leftGap * -1;
    } else if (Math.abs(leftGap) < scrollExtra) {
      leftGap += scrollExtra * numbers.SCROLL_OFFSET_FACTOR;
      targetScroll = leftGap * -1;
    } else if (rightGap > 0) {
      if (tabIsBetweenEnds) {
        rightGap += scrollExtra * numbers.SCROLL_OFFSET_FACTOR;
      }
      targetScroll = rightGap;
    } else if (Math.abs(rightGap) < scrollExtra) {
      rightGap += scrollExtra * numbers.SCROLL_OFFSET_FACTOR;
      targetScroll = rightGap;
    }

    this.container_.scrollTo(targetScroll);
  }

  /**
   * Calculates the indicator's new position
   */
  calculateIndicatorPosition() {
    let left = this.getActiveTab().getRootOffsetLeft();
    let width = this.getActiveTab().getRootOffsetWidth();
    if (this.indicator_.shouldMatchTabContentWidth()) {
      left += this.getActiveTab().getContentOffsetLeft();
      width = this.getActiveTab().getContentOffsetWidth();
    }
    this.indicator_.calculatePosition(left, width);
  }

  /**
   * Updates the indicator size
   */
  updateIndicator() {
    this.calculateIndicatorPosition();
    this.indicator_.updatePosition();
  }
}

export {
  MDCTabzBar,
};
