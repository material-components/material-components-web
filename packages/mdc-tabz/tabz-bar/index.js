import {MDCTabz} from '../tabz';
import {MDCTabzIndicator} from '../tabz-indicator';

const strings = {
  TABZ_SELECTOR: '.mdc-tabz',
  RESIZE_INDICATOR_SELECTOR: '.mdc-tabz-indicator',
};

const numbers = {
  // TODO: Determine an appropriate magic number
  PIXEL_TOLERANCE: 0.4,
};

class MDCTabzBar {
  static attachTo(root) {
    return new MDCTabzBar(root);
  }

  constructor(root) {
    this.root_ = root;
    const indicatorRoot = this.root_.querySelector(strings.RESIZE_INDICATOR_SELECTOR);
    this.indicator_ = MDCTabzIndicator.attachTo(indicatorRoot);
    const tabz = Array.from(this.root_.querySelectorAll(strings.TABZ_SELECTOR));
    this.tabz_ = tabz.map((tab) => MDCTabz.attachTo(tab));
    this.handleTabChange_ = (e) => this.handleTabChange(e);
    this.handleResize_ = () => this.handleResize();
    this.handleClick_ = (e) => this.handleClick(e);
    this.root_.addEventListener('tabchange', this.handleTabChange_);
    this.root_.addEventListener('click', this.handleClick_);

    /** @private {number} */
    this.activeIndex_ = this.getActiveTabIndex_();

    /** @private {?ClientRect} The cached bounding box */
    this.bbox_;

    /** @private {number} The ID of the requestAnimationFrame */
    this.layoutFrame_ = 0;

    this.init();
  }

  init() {
    this.handleResize();
    this._adapterAddWindowEventListener('resize', this.handleResize_);
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
   * Returns the active tab
   * @return {MDCTabz}
   * @private
   */
  getActiveTab_() {
    return this.tabz_[this.activeIndex_];
  }

  /**
   * Get the bounding box of the root element
   * @return {!ClientRect}
   * @private
   */
  _adapterGetBoundingClientRect() {
    return this.root_.getBoundingClientRect();
  }

  /**
   * Adds an event listener to the window object
   * @param {string} evtType The event name to bind
   * @param {!EventListener} handler The event handler
   */
  _adapterAddWindowEventListener(evtType, handler) {
    window.addEventListener(evtType, handler);
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
    const bbox = this.getActiveTab_().getBoundingClientRect();
    if (!this.bboxIsEqual_(bbox)) {
      this.bbox_ = bbox;
      this.throttleIndicatorResize(bbox);
    }
  }

  /**
   * Activates the tab at the given index
   * @param {number} index The index of the tab to activate
   */
  activateTab(index) {
    if (index < 0 || index >= this.tabz_.length || index === this.activeIndex_) {
      return;
    }
    this.getActiveTab_().deactivate();
    this.activeIndex_ = index;
    this.getActiveTab_().activate();
    this.updateIndicator(this.getActiveTab_().getBoundingClientRect());
  }

  /**
   * Compares the given bounding box against the cached one
   * @param {!ClientRect} bbox The bounding box for comparison
   * @return {boolean}
   * @private
   */
  bboxIsEqual_(bbox) {
    if (!this.bbox_) {
      return false;
    }
    if (Math.abs(bbox.width - this.bbox_.width) > numbers.PIXEL_TOLERANCE) {
      return false;
    }
    if (Math.abs(bbox.x - this.bbox_.x) > numbers.PIXEL_TOLERANCE) {
      return false;
    }
    return true;
  }

  calculateIndicatorPosition(activeBbox) {
    const barBbox = this._adapterGetBoundingClientRect();
    return activeBbox.left - barBbox.left;
  }

  /**
   * Updates the indicator size
   * @param {!ClientRect} activeBbox The bounding box of the active element
   * @param {boolean=} shouldAnimate Whether the update should be animated (defaults to true)
   */
  updateIndicator(activeBbox, shouldAnimate=true) {
    this.indicator_.updatePosition(activeBbox, this._adapterGetBoundingClientRect(), shouldAnimate);
  }

  /**
   * Throttles the indicator updates to only occur once per frame
   * @param {!ClientRect} activeBbox The bounding box of the active element
   */
  throttleIndicatorResize(activeBbox) {
    if (this.layoutFrame_ !== 0) {
      cancelAnimationFrame(this.layoutFrame_);
    }
    this.layoutFrame_ = requestAnimationFrame(() => {
      this.updateIndicator(activeBbox, false);
    });
  }
}

export {
  MDCTabzBar,
};
