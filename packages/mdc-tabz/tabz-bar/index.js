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
  // TODO: Determine an appropriate magic number or if this is necessary
  PIXEL_TOLERANCE: 0.6,
};

class MDCTabzBar {
  static attachTo(root) {
    return new MDCTabzBar(root);
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

    /** @private {number} The ID of the requestAnimationFrame */
    this.scrollFrame_ = 0;

    /** @private {number} The pixel value to scroll left */
    this.scrollLeft_ = 0;

    this.init();
  }

  init() {
    this.updateIndicator();
    this.adapter_.registerWindowEventListener('resize', this.handleResize_);
    this.adapter_.registerEventListener(MDCTabz.strings.TABZ_EVENT, this.handleTabSelection_);
    this.adapter_.registerEventListener(MDCTabzContainer.strings.SCROLL_FAKERY_EVENT, this.handleScrollFakery_);
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
    console.log(`this.scrollLeft_: ${this.scrollLeft_}`);
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
    this.activeTab.deactivate();
    this.activeIndex_ = index;

    const activeTabBbox = this.activeTab.getBoundingClientRect();
    const barBbox = this.adapter_.getBoundingClientRect();

    const leftGap = this.shouldScrollToLeft_(activeTabBbox, barBbox);
    const rightGap = this.shouldScrollToRight_(activeTabBbox, barBbox);
    const currentScrollLeft = this.adapter_.getScrollLeft();
    if (leftGap > 0) {
      this.scrollLeft_ = currentScrollLeft + leftGap;
      this.container_.animateToPosition(currentScrollLeft, leftGap * -1);
    } else if (rightGap > 0) {
      this.scrollLeft_ = currentScrollLeft - rightGap;
      this.container_.animateToPosition(currentScrollLeft, rightGap);
    }

    this.activeTab.activate();
    this.calculateIndicatorPosition();
    this.indicator_.animatePosition();
  }

  /**
   * Handles the window resize event
   */
  handleResize() {
    this.throttleIndicatorUpdates();
  }

  shouldScrollToLeft_(activeTabBbox, barBbox) {
    return activeTabBbox.right - barBbox.right;
  }

  shouldScrollToRight_(activeTabBbox, barBbox) {
    return barBbox.left - activeTabBbox.left;
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
    this.activeTab.activate();
    this.calculateIndicatorPosition();
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

  calculateIndicatorPosition() {
    const bbox = this.activeTab.getBoundingClientRect();
    if (this.bboxDeltaIsPerceptible_(bbox)) {
      this.bbox_ = bbox;
      this.indicator_.calculatePosition(this.bbox_, this.container_.getBoundingClientRect());
    }
  }

  /**
   * Throttles the indicator updates to only occur once per frame
   */
  throttleIndicatorUpdates() {
    if (this.updateFrame_ !== 0) {
      cancelAnimationFrame(this.updateFrame_);
    }
    this.updateFrame_ = requestAnimationFrame(() => {
      this.updateIndicator();
    });
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
