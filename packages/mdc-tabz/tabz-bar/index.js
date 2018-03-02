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
    this.tabz_ = [].slice.call(tabz).map((tab) => MDCTabz.attachTo(tab));

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
      isRTL: () =>
        window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
    };

    /** @private {number} */
    this.activeIndex_ = 0;
    for (let i = 0; i < this.tabz_.length; i++) {
      if (this.tabz_[i].isActive()) {
        this.activeIndex_ = i;
        break;
      }
    }

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
      this.container_.slideTo(slideTo);
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
    this.slideTabIntoView(index);
    this.getActiveTab().activate();
    this.calculateIndicatorPosition_();
    this.indicator_.animatePosition();
  }

  /**
   * Calculate a tab's respective edge distances from the container, where a
   * positive number indicates that the edge is outside the container while a
   * negative number indicates that the edge is inside the container
   * @param {number} index The index of the tab
   * @return {{left: number, right: number}}
   * @private
   */
  calculateTabEdgeDistances_(index) {
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
    // The distance from the left edge of the tab to the left edge of the container
    const tabLeftEdgeDistance = innerScroll - tabRootLeft - innerLeft;
    const tabRootRight = tabRootLeft + tab.getRootOffsetWidth();
    // The distance from the right edge of the tab to the right edge of the container
    const tabRightEdgeDistance = tabRootRight + innerOffset - containerBbox.width;

    return {
      left: tabLeftEdgeDistance,
      right: tabRightEdgeDistance,
    };
  }

  /**
   * Slides the tab at the given index into view
   * @param {number} index The index of the tab to slide into view
   */
  slideTabIntoView(index) {
    // Early exit
    if (!this.isIndexInRange_(index)) {
      return;
    }

    const edgeDistance = this.calculateTabEdgeDistances_(index);
    // Check if tabs are between ends
    const tabIsBetweenEnds = this.isIndexBetweenEnds_(index);
    // Get the current tab
    const tab = this.getTabAtIndex_(index);
    // Extra scrollage FTW
    const slideToExtra = tab.getContentOffsetLeft() * 2;
    let shouldSlideLeft = false;
    let slideTo;

    if (edgeDistance.left > 0) {
      slideTo = edgeDistance.left;
    } else if (edgeDistance.right > 0) {
      slideTo = edgeDistance.right;
      shouldSlideLeft = true;
    } else {
      // Early exit
      return;
    }

    if (tabIsBetweenEnds) {
      slideTo += slideToExtra;
    }

    // Sliding left is a negative translation so we invert the value
    if (shouldSlideLeft) {
      slideTo *= -1;
    }

    this.container_.scrollTo(slideTo);
  }

  /**
   * Calculates the indicator's new position
   */
  calculateIndicatorPosition_() {
    const tabRootLeft = this.getActiveTab().getRootOffsetLeft();
    const tabRootWidth = this.getActiveTab().getRootOffsetWidth();
    const tabContentLeft = this.getActiveTab().getContentOffsetLeft();
    const tabContentWidth = this.getActiveTab().getContentOffsetWidth();
    this.indicator_.calculatePosition(tabRootLeft, tabRootWidth, tabContentLeft, tabContentWidth);
  }

  /**
   * Updates the indicator size
   */
  updateIndicator() {
    this.calculateIndicatorPosition_();
    this.indicator_.updatePosition();
  }
}

export {
  MDCTabzBar,
};
