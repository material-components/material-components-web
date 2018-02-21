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
  getSelectedTabIndex_(target) {
    return this.tabz_.findIndex((tab) => tab === target);
  }

  handleScrollFakery() {
    this.container_.resetTransform();
    this.adapter_.setScrollLeft(this.scroll_);
  }

  handleTabSelection(e) {
    this.activateTab(this.getSelectedTabIndex_(e.detail.tab));
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

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab to activate
   */
  activateTab(index) {
    if (index < 0 || index >= this.tabz_.length || index === this.activeIndex_) {
      return;
    }
    this.activeTab.deactivate();
    this.activeIndex_ = index;
    this.scrollTabIntoView_();
    this.activeTab.activate();
    this.calculateIndicatorPosition();
    this.indicator_.animatePosition();
  }

  scrollTabIntoView_() {
    // Calculate the bounding boxes of the selected tab and the container
    const barBbox = this.adapter_.getRootBoundingClientRect();
    const containerBbox = this.container_.getRootBoundingClientRect();
    if (containerBbox.width <= barBbox.width) {
      return;
    }
    const activeTabBbox = this.activeTab.getRootBoundingClientRect();
    const activeTabContentBbox = this.activeTab.getContentBoundingClientRect();
    const scrollExtra = activeTabBbox.width - activeTabContentBbox.width;
    // Determine the left and right gaps
    let leftGap = activeTabBbox.right - barBbox.right;
    let rightGap = barBbox.left - activeTabBbox.left;
    // Determine the scrollLeft
    const currentScroll = this.adapter_.getScrollLeft();
    // Scroll to either left or right if necessary
    if (leftGap > 0) {
      if (this.isActiveTabBetweenEnds_()) {
        leftGap += scrollExtra;
      }
      this.scroll_ = currentScroll + leftGap;
      this.container_.fakeScroll(leftGap * -1, currentScroll);
    } else if (Math.abs(leftGap) < scrollExtra) {
      leftGap += scrollExtra;
      this.scroll_ = currentScroll + leftGap;
      this.container_.fakeScroll(leftGap * -1, currentScroll);
    } else if (rightGap > 0) {
      if (this.isActiveTabBetweenEnds_()) {
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
   * Determines if the active tab is between the end tabs
   * @return {boolean}
   * @private
   */
  isActiveTabBetweenEnds_() {
    return this.activeIndex_ > 0 && this.activeIndex_ < this.tabz_.length - 1
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
