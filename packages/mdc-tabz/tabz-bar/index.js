import {MDCTabz} from '../tabz';
import {MDCTabzIndicator} from '../tabz-indicator';

const strings = {
  TABZ_SELECTOR: '.mdc-tabz',
  RESIZE_INDICATOR_SELECTOR: '.mdc-tabz-indicator',
  CONTAINER_SELECTOR: '.mdc-tabz-bar__container',
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
    this.root_ = root;
    this.container_ = root.querySelector(strings.CONTAINER_SELECTOR);
    const indicatorRoot = this.root_.querySelector(strings.RESIZE_INDICATOR_SELECTOR);
    this.indicator_ = MDCTabzIndicator.attachTo(indicatorRoot);
    const tabz = Array.from(this.root_.querySelectorAll(strings.TABZ_SELECTOR));
    this.tabz_ = tabz.map((tab) => MDCTabz.attachTo(tab));
    this.handleTabChange_ = (e) => this.handleTabChange(e);
    this.handleResize_ = () => this.handleResize();
    this.handleClick_ = (e) => this.handleClick(e);

    this.adapter_ = {
      getContainerBoundingClientRect: () =>
        this.container_.getBoundingClientRect(),
      registerWindowEventListener: (evtType, handler) =>
        window.addEventListener(evtType, handler),
      deregisterWindowEventListener: (evtType, handler) =>
        window.removeEventListener(evtType, handler),
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
    };

    this.adapter_.registerEventListener('click', this.handleClick_);

    /** @private {number} */
    this.activeIndex_ = this.getActiveTabIndex_();

    /** @private {?ClientRect} The cached bounding box */
    this.bbox_;

    /** @private {number} The ID of the requestAnimationFrame */
    this.updateFrame_ = 0;

    this.init();
  }

  init() {
    this.updateIndicator();
    this.adapter_.registerWindowEventListener('resize', this.handleResize_);
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
    return this.tabz_.findIndex((tab) => tab.hasChildElement(target));
  }

  /**
   * Handles the click event
   * @param {!Event} e The event object from the click event
   */
  handleClick(e) {
    this.activateTab(this.getSelectedTabIndex_(e.target));
  }

  /**
   * Handles the window resize event
   */
  handleResize() {
    this.throttleIndicatorUpdates();
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
      this.indicator_.calculatePosition(this.bbox_, this.adapter_.getContainerBoundingClientRect());
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
