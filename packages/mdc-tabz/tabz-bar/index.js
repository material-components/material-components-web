import {MDCTabz} from '../tabz';
import {MDCTabzIndicator} from '../tabz-indicator';
import {MDCTabzContainer} from '../tabz-container';
import {MDCTabzPager} from '../tabz-pager';

const strings = {
  TABZ_SELECTOR: '.mdc-tabz',
  RESIZE_INDICATOR_SELECTOR: '.mdc-tabz-indicator',
  CONTAINER_SELECTOR: '.mdc-tabz-container',
  PAGER_SELECTOR: '.mdc-tabz-pager',
};

const cssClasses = {
  PAGING: 'mdc-tabz-bar--paging',
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

    const pagerz = this.root_.querySelectorAll(strings.PAGER_SELECTOR);
    this.pagerz_ = Array.from(pagerz).map((pager) => MDCTabzPager.attachTo(pager));

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
   * Returns whether the tab is paging
   * @return {boolean}
   * @private
   */
  isPaging_() {
    return this.adapter_.hasClass(cssClasses.PAGING);
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
    const index = this.calculatePageEdgeIndex_('next');
    // this.slideTabIntoView_(index);
  }

  /** Handles the prev page click */
  handlePrevPageClick() {
    const index = this.calculatePageEdgeIndex_('prev');
    // this.slideTabIntoView_(index);
  }

  /**
   * @param {string} direction The direction to scroll
   */
  calculatePageSize_(direction) {
    if (direction !== 'prev' && direction !== 'next') {
      throw new Error('WHOA THERE BUDDY WHAT DO YOU THINK YOU\'RE DOING?!');
    }

    const shouldContinue = (dir, i) => {
      let shouldContinue_ = false;
      if (dir === 'next') {
        shouldContinue_ = i < this.tabz_.length;
      } else if (dir === 'prev') {
        shouldContinue_ = i >= 0;
      }
      return shouldContinue_;
    };

    const nextIteration = (dir, i) => {
      if (dir === 'next') {
        return i + 1;
      } else if (dir === 'prev') {
        return i - 1;
      }
    };

    const iteratorValue = (dir) => {
      if (dir === 'next') {
        return 0;
      } else if (dir === 'prev') {
        return this.tabz_.length - 1;
      }
    };

    const barBbox = this.adapter_.getRootBoundingClientRect();
    let i = iteratorValue(direction);
    let current = 0;
    let next = 0;
    while (shouldContinue(direction, i)) {
      const tabBbox = this.tabz_[i].getRootBoundingClientRect();
      if (tabBbox.left >= barBbox.left && tabBbox.right <= barBbox.right) {
        current += tabBbox.width;
      } else {
        const newPageSize_ = next + tabBbox.width;
        if (newPageSize_ < barBbox.width) {
          next = newPageSize_;
        } else {
          break;
        }
      }
      i = nextIteration(direction, i);
    }

    return current;
  }

  getTabVisibilityBuckets_() {
    const visibleBbox = this.container_.getRootBoundingClientRect();
    const innerOffset = this.container_.getInnerOffsetLeft();
    const innerBbox = this.container_.getInnerBoundingClientRect();
    const offset = innerBbox.left - visibleBbox.left - innerOffset;

    // Keep track of occluded and visible tabs
    const occludedLeft = [];
    const occludedRight = [];
    const visible = [];

    // For loop because speed?
    for (let i = 0; i < this.tabz_.length; i++) {
      const tab = this.tabz_[i];
      const left = tab.getRootOffsetLeft() + offset;
      const width = tab.getRootOffsetWidth();
      const right = left + width;
      const vbox = {
        left,
        width,
        right,
        index: i,
      };

      if (left < 0) {
        occludedLeft.push(vbox);
      } else if (left >= 0 && right <= visibleBbox.width) {
        visible.push(vbox);
      } else {
        occludedRight.push(vbox);
      }
    }

    return {
      occludedLeft,
      occludedRight,
      visible,
    };
  }

  calculatePageEdgeIndex_(direction) {
    const tabs = this.getTabVisibilityBuckets_();
    console.log(tabs);
  }

  /**
   * Calculates the edge tab to scroll to
   * @return {number}
   * @private
   */
  calculatePageEdgeTabIndex_(direction) {
    const containerBbox = this.container_.getRootBoundingClientRect();
    const tabBoxes = this.tabz_.map((tab) => tab.getRootBoundingClientRect());
    const visibleTabs = tabBoxes.reduce((acc, bbox, i) => {
      if (bbox.left >= containerBbox.left && bbox.right <= containerBbox.right) {
        acc.push(i);
      }
      return acc;
    }, []);

    let pageSize = 0;
    let activeIndex;

    if (direction === 'next') {
      const start = visibleTabs[visibleTabs.length - 1] + 1;
      activeIndex = start;
      for (let i = start; i < tabBoxes.length; i++) {
        const bbox = tabBoxes[i];
        const pageSize_ = pageSize + bbox.width;
        if (pageSize_ < containerBbox.width) {
          pageSize = pageSize_;
          activeIndex = i;
        } else {
          break;
        }
      }
    } else {
      const start = visibleTabs[0] - 1;
      activeIndex = start;
      for (let i = start; i > -1; i--) {
        const bbox = tabBoxes[i];
        const pageSize_ = pageSize + bbox.width;
        if (pageSize_ < containerBbox.width) {
          pageSize = pageSize_;
          activeIndex = i;
        } else {
          break;
        }
      }
    }
    return activeIndex;
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

  /**
   * Slides the tab at the given index into view
   * @param {number} index The index of the tab to slide into view
   * @private
   */
  slideTabIntoView_(index) {
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
    const currentScroll = this.container_.getRootScrollOffset();
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
        leftGap += scrollExtra * 1.5;
      }
      targetScroll = leftGap * -1;
    } else if (Math.abs(leftGap) < scrollExtra) {
      leftGap += scrollExtra;
      targetScroll = leftGap * -1;
    } else if (rightGap > 0) {
      if (tabIsBetweenEnds) {
        rightGap += scrollExtra * 1.5;
      }
      targetScroll = rightGap;
    } else if (Math.abs(rightGap) < scrollExtra) {
      rightGap += scrollExtra;
      targetScroll = rightGap;
    }

    if (this.isPaging_()) {
      this.container_.slideTo(targetScroll, currentScroll);
    } else {
      this.container_.scrollTo(targetScroll, currentScroll);
    }
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
