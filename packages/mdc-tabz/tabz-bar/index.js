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
    this.handleTabSelection_ = (e) => this.handleTabSelection(e);
    this.handleResize_ = () => this.handleResize();
    this.handleClick_ = (e) => this.handleClick(e);
    this.handleNextPageClick_ = () => this.handleNextPageClick();
    this.handlePrevPageClick_ = () => this.handlePrevPageClick();
    this.handleScrollFakery_ = () => this.handleScrollFakery();

    // Adapter initialization
    this.adapter_ = {
      getBoundingClientRect: () =>
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
    this.activeIndex_ = this.getActiveTabIndex_();

    /** @private {?ClientRect} The cached bounding box */
    this.bbox_;

    /** @private {number} The ID of the requestAnimationFrame */
    this.updateFrame_ = 0;

    /** @private {number} The pixel value to scroll left */
    this.scrollLeft_ = 0;

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
   * Retuns the index of the active tab
   * @return {number}
   * @private
   */
  getActiveTabIndex_() {
    return this.tabz_.findIndex((tab) => tab.isActive()) || 0;
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
    this.adapter_.setScrollLeft(this.scrollLeft_);
  }

  /**
   * Handles the click event
   * @param {!Event} e The event object from the click event
   */
  handleClick(e) {
    this.activateTab(this.getSelectedTabIndex_(e.target));
  }

  handleTabSelection(e) {
    const index = this.getSelectedTabIndex_(e.detail.tab);
    this.activateTab(index);
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
    // Calculate the bounding boxes of the selected tab and the container
    const activeTabBbox = this.activeTab.getBoundingClientRect();
    const barBbox = this.adapter_.getBoundingClientRect();

    // Determine the left and right gaps
    const leftGap = activeTabBbox.right - barBbox.right;
    const rightGap = barBbox.left - activeTabBbox.left;
    // Determine the scrollLeft
    const currentScrollLeft = this.adapter_.getScrollLeft();
    // Scroll to either left or right if necessary
    if (leftGap > 0) {
      this.scrollLeft_ = currentScrollLeft + leftGap;
      this.container_.fakeScroll(leftGap * -1, currentScrollLeft);
    } else if (rightGap > 0) {
      this.scrollLeft_ = currentScrollLeft - rightGap;
      this.container_.fakeScroll(rightGap, currentScrollLeft);
    }

    // Get the bounding box of the container element
    const containerBbox = this.container_.getBoundingClientRect();
    this.activeTab.activate();
    this.calculateIndicatorPosition(activeTabBbox, containerBbox);
    this.indicator_.animatePosition();
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
   * @param {?ClientRect} activeTabBbox The bounding box of the active tab
   * @param {?ClientRect} containerBbox THe bounding box of the container
   */
  calculateIndicatorPosition(activeTabBbox, containerBbox) {
    const tabBbox_ = activeTabBbox ? activeTabBbox : this.activeTab.getBoundingClientRect();
    if (this.bboxDeltaIsPerceptible_(tabBbox_)) {
      this.bbox_ = tabBbox_;
      const containerBbox_ = containerBbox ? containerBbox : this.container_.getBoundingClientRect();
      this.indicator_.calculatePosition(this.bbox_, containerBbox_);
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
