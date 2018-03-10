import {MDCTabz} from '../tabz';
import {MDCTabzIndicator} from '../tabz-indicator';
import {MDCTabzScroller} from '../tabz-scroller';
import {MDCTabzPager} from '../tabz-pager';

const strings = {
  TABZ_SELECTOR: '.mdc-tabz',
  RESIZE_INDICATOR_SELECTOR: '.mdc-tabz-indicator',
  CONTAINER_SELECTOR: '.mdc-tabz-container',
  PAGER_SELECTOR: '.mdc-tabz-pager',
  PAGER_NEXT_SELECTOR: '.mdc-tabz-pager--next',
  PAGER_PREVIOUS_SELECTOR: '.mdc-tabz-pager--previous',
};

const cssClasses = {
  PAGING: 'mdc-tabz-bar--paging',
  PAGING_NEXT: '',
};

const numbers = {
  SCROLL_EXTRA: 16,
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

    const scrollerRoot = root.querySelector(strings.CONTAINER_SELECTOR);
    this.scroller_ = MDCTabzScroller.attachTo(scrollerRoot);

    const indicatorRoot = this.root_.querySelector(strings.RESIZE_INDICATOR_SELECTOR);
    this.indicator_ = MDCTabzIndicator.attachTo(indicatorRoot);

    const tabz = this.root_.querySelectorAll(strings.TABZ_SELECTOR);
    this.tabz_ = [].slice.call(tabz).map((tab) => MDCTabz.attachTo(tab));

    const pagerNext = this.root_.querySelector(strings.PAGER_NEXT_SELECTOR);
    if (pagerNext) {
      this.pagerNext_ = MDCTabzPager.attachTo(pagerNext);
    }

    const pagerPrevious = this.root_.querySelector(strings.PAGER_PREVIOUS_SELECTOR);
    if (pagerPrevious) {
      this.pagerPrevious_ = MDCTabzPager.attachTo(pagerPrevious);
    }

    // Event Handlers
    this.handleResize_ = () => this.handleResize();
    this.handleTabSelection_ = (e) => this.handleTabSelection(e);
    this.handlePagingEvent_ = (e) => this.handlePagingEvent(e);
    this.handleTabKeyboard_ = (e) => this.handleTabKeyboard(e);

    // Adapter initialization
    this.adapter_ = {
      registerWindowResizeHandler: (handler) =>
        window.addEventListener('resize', handler),
      deregisterWindowResizeHandler: (handler) =>
        window.removeEventListener('resize', handler),
      registerEventHandler: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) =>
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
    this.adapter_.registerWindowResizeHandler(this.handleResize_);
    // Tab events
    this.adapter_.registerEventHandler(MDCTabz.strings.SELECTED_EVENT, this.handleTabSelection_);
    // Pager events
    this.adapter_.registerEventHandler(MDCTabzPager.strings.PAGING_EVENT, this.handlePagingEvent_);
    // Keypress
    this.adapter_.registerEventHandler(MDCTabz.strings.KEYBOARD_EVENT, this.handleTabKeyboard_);
  }

  /**
   * Returns the active tab
   * @return {!MDCTabz}
   * @private
   */
  getActiveTab_() {
    return this.getTabAtIndex_(this.activeIndex_);
  }

  /**
   * Returns the index of the given tab
   * @return {number}
   * @private
   */
  getTabIndex_(target) {
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
   * @param {boolean=} inclusive Whether to include the end indices (defaults to true)
   * @return {boolean}
   * @private
   */
  isIndexInRange_(index, inclusive=true) {
    if (inclusive) {
      return index >= 0 && index < this.tabz_.length;
    } else {
      return index > 0 && index < this.tabz_.length - 1;
    }
  }

  /**
   * Returns whether the Tab Bar has paging enabled
   * @return {boolean}
   * @private
   */
  isPaging_() {
    return this.adapter_.hasClass(cssClasses.PAGING);
  }

  /**
   * Returns whether the Tab Bar text direction is RTL
   * @return {boolean}
   * @private
   */
  isRTL_() {
    return this.adapter_.isRTL();
  }

  /**
   * Handles the tab selection event
   * @param {!Event} e A browser event
   */
  handleTabSelection(e) {
    this.activateTab(this.getTabIndex_(e.detail.tab));
  }

  /**
   * Handles the paging event
   * @param {!Event} e A browser event
   */
  handlePagingEvent(e) {
    if (e.detail.direction === MDCTabzPager.strings.NEXT) {
      this.nextPage();
    } else if (e.detail.direction === MDCTabzPager.strings.PREVIOUS) {
      this.previousPage();
    }
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
   * Handles the Tab keyboard event
   * @param {!Event} e The Tab keyboard event
   */
  handleTabKeyboard(e) {
    const tabIndex = this.getTabIndex_(e.detail.tab);
    let nextIndex;

    switch (e.detail.direction) {
    case MDCTabz.strings.KEYBOARD_END:
      nextIndex = this.tabz_.length - 1;
      break;
    case MDCTabz.strings.KEYBOARD_HOME:
      nextIndex = 0;
      break;
    case MDCTabz.strings.KEYBOARD_NEXT:
      nextIndex = tabIndex + 1;
      break;
    case MDCTabz.strings.KEYBOARD_PREVIOUS:
      nextIndex = tabIndex - 1;
      break;
    }

    if (nextIndex < 0) {
      nextIndex = this.tabz_.length - 1;
    } else if (!this.isIndexInRange_(nextIndex)) {
      nextIndex = 0;
    }

    this.activateTab(nextIndex);
  }

  /** Shows the next page */
  nextPage() {
    const containerBbox = this.scroller_.getRootBoundingClientRect();
    const innerBbox = this.scroller_.getInnerBoundingClientRect();
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

    this.updatePagerVisibility_(containerBbox, innerBbox, slideTo);
    this.scroller_.slideTo(-slideTo);
  }

  /** Handles the previous page click */
  previousPage() {
    const containerBbox = this.scroller_.getRootBoundingClientRect();
    const innerBbox = this.scroller_.getInnerBoundingClientRect();
    const innerOffset = innerBbox.left - containerBbox.left;
    const tabLength = this.tabz_.length;
    let i = tabLength - 1;
    let slideTo = 0;
    let pageSize = containerBbox.width;

    while (i >= 0 && pageSize > 0) {
      const tabLeft = this.tabz_[i].getRootOffsetLeft();
      const tabWidth = this.tabz_[i].getRootOffsetWidth();
      const tabLeftRelative = tabLeft + innerOffset;

      if (tabLeftRelative < 0) {
        pageSize -= tabWidth;
      }

      if (pageSize >= 0) {
        slideTo = tabLeft;
      }

      i--;
    }

    this.updatePagerVisibility_(containerBbox, innerBbox, slideTo);
    this.scroller_.slideTo(-slideTo);
  }

  /**
   * Updates the visibility of the pagers
   * @param {!ClientRect} containerBbox The client rect of the container root element
   * @param {!ClientRect} innerBbox The client rect of the container inner element
   * @param {number} slideTo The distance to slide
   * @private
   */
  updatePagerVisibility_(containerBbox, innerBbox, slideTo) {
    const remainingInnerWidth = innerBbox.width - slideTo;
    if (remainingInnerWidth < containerBbox.width) {
      this.pagerNext_.hide();
    } else {
      this.pagerNext_.show();
    }

    if (slideTo === 0) {
      this.pagerPrevious_.hide();
    } else {
      this.pagerPrevious_.show();
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

    this.getActiveTab_().deactivate();
    this.activeIndex_ = index;
    this.slideTabIntoView(index);
    this.getActiveTab_().activate();
    this.calculateIndicatorPosition_();
    this.indicator_.animatePosition();
  }

  /**
   * Calculate a tab's respective edge distances from the container, where a
   * positive number indicates that the edge is outside the container while a
   * negative number indicates that the edge is inside the container
   * @param {number} index The index of the tab
   * @return {{left: number, right: number, scroll: number, offset: number}}
   * @private
   */
  calculateTabEdgeDistances_(index) {
    // Get the container and inner bounding rects
    const containerBbox = this.scroller_.getRootBoundingClientRect();
    const innerBbox = this.scroller_.getInnerBoundingClientRect();
    // Get the inner's offsetLeft
    const innerLeft = this.scroller_.getInnerOffsetLeft();
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
      scroll: innerScroll,
    };
  }

  /**
   * Calculate the distance between the current tab and the next adjacent tab's content
   * @param {number} index The index of the current tab
   * @param {number} adjacentIndex The direction as either -1 (left) or 1 (right)
   * @return {number}
   * @private
   */
  calculateAdjacentTabContentDistance_(index, adjacentIndex) {
    // Early exit
    if (!this.isIndexInRange_(adjacentIndex)) {
      return 0;
    }

    const tab = this.getTabAtIndex_(index);
    const tabLeft = tab.getRootOffsetLeft();
    const tabRight = tabLeft + tab.getRootOffsetWidth();

    const adjacentTab = this.getTabAtIndex_(adjacentIndex);
    const adjacentRootLeft = adjacentTab.getRootOffsetLeft();
    const adjacentContentLeft = adjacentTab.getContentOffsetLeft();
    const adjacentContentWidth = adjacentTab.getContentOffsetWidth();

    const leftExtra = tabLeft - adjacentRootLeft - adjacentContentLeft - adjacentContentWidth;
    const rightExtra = adjacentRootLeft + adjacentContentLeft - tabRight;

    let extra;

    if (adjacentIndex < index) {
      extra = this.isRTL_() ? rightExtra : leftExtra;
    } else {
      extra = this.isRTL_() ? leftExtra : rightExtra;
    }

    return extra + numbers.SCROLL_EXTRA;
  }

  /**
   * Calculates the adjacent tab index given the current index
   * @param {number} index The current index
   * @param {{left: number, right: number}} edge The calculated tab edges
   * @return {number}
   * @private
   */
  calculateAdjacentTabIndex_(index, edge) {
    let adjacentIndex;
    if (edge.left > 0) {
      adjacentIndex = this.isRTL_() ? index + 1 : index - 1;
    } else if (edge.right > 0) {
      adjacentIndex = this.isRTL_() ? index - 1 : index + 1;
    } else {
      adjacentIndex = edge.left > edge.right ? index - 1 : index + 1;
    }
    return adjacentIndex;
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

    const tabIsBetweenEnds = this.isIndexInRange_(index, false);
    const edge = this.calculateTabEdgeDistances_(index);
    const adjacentIndex = this.calculateAdjacentTabIndex_(index, edge);
    const adjacentTabContentDistance = this.calculateAdjacentTabContentDistance_(index, adjacentIndex);
    let shouldSlideLeft = false;
    let slideTo;

    if (edge.left > 0 || edge.left < 0 && edge.left > -adjacentTabContentDistance) {
      slideTo = edge.left;
    } else if (edge.right > 0 || edge.right < 0 && edge.right > -adjacentTabContentDistance) {
      slideTo = edge.right;
      shouldSlideLeft = true;
    } else {
      // Early exit
      return;
    }

    if (tabIsBetweenEnds) {
      slideTo += adjacentTabContentDistance;
    }

    // Sliding left is a negative translation so we invert the value
    if (shouldSlideLeft) {
      slideTo *= -1;
    }

    if (this.isPaging_()) {
      // Scroll is positive when scrolled to the left, negative when scrolled to the right.
      // We negate the value to account for transformations (used in paging)
      this.scroller_.slideTo(slideTo - edge.scroll);
    } else {
      this.scroller_.scrollTo(slideTo);
    }
  }

  /**
   * Calculates the indicator's new position
   */
  calculateIndicatorPosition_() {
    this.indicator_.calculatePosition2(this.getActiveTab_());
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
