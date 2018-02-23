import {MDCTabz} from '../tabz';
import {MDCTabzIndicator} from '../tabz-indicator';
import {MDCTabzContainer} from '../tabz-container';
import {MDCTabzPager} from '../tabz-pager';

const strings = {
  TABZ_SELECTOR: '.mdc-tabz',
  RESIZE_INDICATOR_SELECTOR: '.mdc-tabz-indicator',
  CONTAINER_SELECTOR: '.mdc-tabz-bar__container',
  PAGER_SELECTOR: '.mdc-tabz-pager',
};

const numbers = {
  // TODO: Determine an appropriate magic number or if this is even necessary
  PIXEL_TOLERANCE: 0.6,
  SCROLL_EXTRA: 48,
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

  get activeTab() {
    return this.tabz_[this.activeIndex_];
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
    this.handleScrollFakery_ = () => this.handleScrollFakery();

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
      getScrollLeft: () =>
        this.root_.scrollLeft,
      setScrollLeft: (value) =>
        this.root_.scrollLeft = value,
    };

    /** @private {number} */
    this.activeIndex_ = this.tabz_.findIndex((tab) => tab.isActive()) || 0;

    /** @private {?ClientRect} The cached bounding box */
    this.bbox_;

    /** @private {number} The ID of the requestAnimationFrame */
    this.updateFrame_ = 0;

    /** @private {number} The pixel value to scroll */
    this.scroll_ = 0;

    this.pageOffset_ = 0;

    this.init();
  }

  init() {
    this.updateIndicator();
    // Window events
    this.adapter_.registerWindowEventListener('resize', this.handleResize_);
    // Tab events
    this.adapter_.registerEventListener(MDCTabz.strings.TABZ_EVENT, this.handleTabSelection_);
    // Container events
    this.adapter_.registerEventListener(MDCTabzContainer.strings.SCROLL_FAKERY_EVENT, this.handleScrollFakery_);
    // Pager events
    this.adapter_.registerEventListener(MDCTabzPager.strings.NEXT, this.handleNextPageClick_);
    this.adapter_.registerEventListener(MDCTabzPager.strings.PREV, this.handlePrevPageClick_);
  }

  /**
   * Returns the index of the selected tab
   * @return {number}
   * @private
   */
  getTabIndex_(target) {
    return this.tabz_.findIndex((tab) => tab === target);
  }

  handleScrollFakery() {
    this.container_.resetTransform();
    this.adapter_.setScrollLeft(this.scroll_);
  }

  handleTabSelection(e) {
    this.activateTab(this.getTabIndex_(e.detail.tab));
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

  handleNextPageClick() {
    // const barBbox = this.adapter_.getRootBoundingClientRect();
    // let currentPageSize = 0;
    // let newPageSize = 0;

    // for (let i = 0; i < this.tabz_.length; i++) {
    //   const bbox = this.tabz_[i].getRootBoundingClientRect();
    //   if (bbox.left >= barBbox.left && bbox.right <= barBbox.right) {
    //     currentPageSize += bbox.width;
    //   } else {
    //     const newPageSize_ = newPageSize + bbox.width;
    //     if (newPageSize_ < barBbox.width) {
    //       newPageSize = newPageSize_;
    //     } else {
    //       break;
    //     }
    //   }
    // }

    const index = this.calculatePageEdgeTabIndex_('next');
    const tab = this.tabz_[index];
    if (tab) {
      this.scrollTabIntoView_(tab);
    }
    // const currentPageSize = this.calculatePageSize_('next');
    // const scrollTarget = currentPageSize + this.pageOffset_;
    // this.container_.animateFakeScroll(scrollTarget * -1, this.pageOffset_);
    // this.pageOffset_ = scrollTarget;
  }

  handlePrevPageClick() {
    const index = this.calculatePageEdgeTabIndex_('prev');
    const tab = this.tabz_[index];
    if (tab) {
      this.scrollTabIntoView_(tab);
    }
    // const currentPageSize = this.calculatePageSize_('prev');
    // const scrollTarget = currentPageSize - this.pageOffset_;
    // this.container_.animateFakeScroll(scrollTarget, this.pageOffset_);
    // this.pageOffset_ = scrollTarget;
  }

  /**
   * 
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

  /**
   * Calculates the edge tab to scroll to
   * @return {number}
   * @private
   */
  calculatePageEdgeTabIndex_(direction) {
    const barBbox = this.adapter_.getRootBoundingClientRect();
    const tabBoxes = this.tabz_.map((tab) => tab.getRootBoundingClientRect());
    const visibleTabs = tabBoxes.reduce((acc, bbox, i) => {
      if (bbox.left >= barBbox.left && bbox.right <= barBbox.right) {
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
        if (pageSize_ < barBbox.width) {
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
        if (pageSize_ < barBbox.width) {
          pageSize = pageSize_;
          activeIndex = i;
        } else {
          break;
        }
      }
    }
    console.log('activeIndex', activeIndex);
    return activeIndex;
  }

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab to activate
   */
  activateTab(index) {
    performance.mark('startActivate');
    if (index < 0 || index >= this.tabz_.length || index === this.activeIndex_) {
      return;
    }
    this.activeTab.deactivate();
    this.activeIndex_ = index;
    this.scrollTabIntoView_(this.activeTab);
    this.activeTab.activate();
    this.calculateIndicatorPosition();
    this.indicator_.animatePosition();
    performance.mark('endActivate');
    performance.measure('activate', 'startActivate', 'endActivate');
  }

  scrollTabIntoView_(tab) {
    // Calculate the bounding boxes of the selected tab and the container
    const barBbox = this.adapter_.getRootBoundingClientRect();
    const containerBbox = this.container_.getRootBoundingClientRect();
    if (containerBbox.width <= barBbox.width) {
      return;
    }

    // Get initial bounding boxes
    const activeTabBbox = tab.getRootBoundingClientRect();
    const activeTabContentBbox = tab.getContentBoundingClientRect();
    const scrollExtra = activeTabBbox.width - activeTabContentBbox.width;

    // Determine the left and right gaps
    let leftGap = activeTabBbox.right - barBbox.right;
    let rightGap = barBbox.left - activeTabBbox.left;

    // Determine the scrollLeft
    const currentScroll = this.adapter_.getScrollLeft();
    const tabIsBetweenEnds = this.isTabBetweenEnds_(tab);

    // Scroll to either left or right if necessary
    if (leftGap > 0) {
      if (tabIsBetweenEnds) {
        leftGap += scrollExtra;
      }
      this.scroll_ = currentScroll + leftGap;
      this.container_.fakeScroll(leftGap * -1, currentScroll);
    } else if (Math.abs(leftGap) < scrollExtra) {
      leftGap += scrollExtra;
      this.scroll_ = currentScroll + leftGap;
      this.container_.fakeScroll(leftGap * -1, currentScroll);
    } else if (rightGap > 0) {
      if (tabIsBetweenEnds) {
        rightGap += scrollExtra;
      }
      this.scroll_ = currentScroll - rightGap;
      this.container_.fakeScroll(rightGap, currentScroll);
    } else if (Math.abs(rightGap) < scrollExtra) {
      rightGap += scrollExtra;
      this.scroll_ = currentScroll - rightGap;
      this.container_.fakeScroll(rightGap, currentScroll);
    }
  }

  /**
   * Determines if the index is between the end tabs
   * @param {number} index The index to
   * @return {boolean}
   * @private
   */
  isTabBetweenEnds_(tab) {
    const tabIndex = this.getTabIndex_(tab);
    return tabIndex > 0 && tabIndex < this.tabz_.length - 1;
  }

  /**
   * Compares the given bounding box against the cached one
   * @param {!ClientRect} bbox The bounding box for comparison
   * @return {boolean}
   * @private
   */
  bboxDeltaIsPerceptible_(bbox) {
    if (!this.bbox_) {
      return true;
    }
    if (Math.abs(bbox.width - this.bbox_.width) > numbers.PIXEL_TOLERANCE) {
      return true;
    }
    if (Math.abs(bbox.x - this.bbox_.x) > numbers.PIXEL_TOLERANCE) {
      return true;
    }
    return false;
  }

  /**
   * Calculates the indicator's new position
   */
  calculateIndicatorPosition() {
    const tabBbox = this.indicator_.shouldMatchTabContentWidth
      ? this.activeTab.getContentBoundingClientRect()
      : this.activeTab.getRootBoundingClientRect();
    if (this.bboxDeltaIsPerceptible_(tabBbox)) {
      this.bbox_ = tabBbox;
      const containerBbox = this.container_.getRootBoundingClientRect();
      this.indicator_.calculatePosition(this.bbox_, containerBbox);
    }
  }

  /**
   * Get the width of the tab
   * @return {!ClientRect}
   * @private
   */
  getTabBboxForIndicator_() {
    if (this.indicator_.shouldMatchTabContentWidth) {
      return this.activeTab.getContentBoundingClientRect();
    } else {
      return this.activeTab.getRootBoundingClientRect();
    }
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
