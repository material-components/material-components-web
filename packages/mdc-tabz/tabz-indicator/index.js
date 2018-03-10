const cssClasses = {
  ANIMATING: 'mdc-tabz-indicator--animating',
  ANIMATING_ICON: 'mdc-tabz-indicator--animating-icon',
  UPGRADED: 'mdc-tabz-indicator--upgraded',
  CUSTOM: 'mdc-tabz-indicator--custom',
  MATCH_TAB_CONTENT: 'mdc-tabz-indicator--match-tab-content',
  ICON: 'mdc-tabz-indicator--icon',
  ICON_HIDE: 'mdc-tabz-indicator--icon-hide',
};

class MDCTabzIndicator {
  static attachTo(root) {
    return new MDCTabzIndicator(root);
  }

  static get strings() {
    return strings;
  }

  /**
   * Returns whether the indicator is a custom indicator
   * @return {boolean}
   * @private
   */
  isCustom_() {
    return this.adapter_.hasClass(cssClasses.CUSTOM);
  }

  /**
   * Returns whether the indicator is an icon indicator
   * @return {boolean}
   * @private
   */
  isIcon_() {
    return this.adapter_.hasClass(cssClasses.ICON);
  }

  /**
   * Returns whether the indicator icon is hidden
   * @return {boolean}
   * @private
   */
  isIconHidden_() {
    return this.adapter_.hasClass(cssClasses.ICON_HIDE);
  }

  constructor(root) {
    this.root_ = root;

    this.adapter_ = {
      registerEventHandler: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      getRootOffsetWidth: () =>
        this.root_.offsetWidth,
      setRootStyle: (prop, value) =>
        this.root_.style[prop] = value,
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      hasClass: (className) =>
        this.root_.classList.contains(className),
    };

    /** @private {!EventListener} */
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();

    /** @private {string} */
    this.transformation_ = '';

    this.init();
  }

  init() {
    this.adapter_.addClass(cssClasses.UPGRADED);
  }

  /**
   * Returns whether the indicator should match the width of the tab content
   * @return {boolean}
   * @private
   */
  shouldMatchTabContentWidth_() {
    return this.adapter_.hasClass(cssClasses.MATCH_TAB_CONTENT);
  }

  /** Handles the transitionend event */
  handleTransitionEnd() {
    if (this.isIcon_() && this.isIconHidden_()) {
      this.adapter_.removeClass(cssClasses.ICON_HIDE);
      this.updatePosition();
    } else {
      this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
      this.adapter_.removeClass(cssClasses.ANIMATING_ICON);
      this.adapter_.removeClass(cssClasses.ANIMATING);
    }
  }

  /** Animates the position of the indicator */
  animatePosition() {
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    if (this.isIcon_()) {
      this.adapter_.addClass(cssClasses.ANIMATING_ICON);
      this.adapter_.addClass(cssClasses.ICON_HIDE);
    } else {
      this.adapter_.addClass(cssClasses.ANIMATING);
      this.updatePosition();
    }
  }

  /** Updates the position of the indicator */
  updatePosition() {
    this.adapter_.setRootStyle('transform', this.transformation_);
  }

  /**
   * Calculates the position of the Tab
   * @param {!MDCTabz} tab The active MDCTabz
   */
  calculatePosition2(tab) {
    const tabRootLeft = tab.getRootOffsetLeft();
    const tabRootWidth = tab.getRootOffsetWidth();

    let translateX = tabRootLeft;
    let scaleX = tabRootWidth;

    if (this.shouldMatchTabContentWidth_()) {
      translateX += tab.getContentOffsetLeft();
      scaleX = tab.getContentOffsetWidth();
    } else if (this.isIcon_()) {
      translateX += (tabRootWidth / 2) - (this.adapter_.getRootOffsetWidth() / 2);
      scaleX = 1;
    }

    this.transformation_ = `translateX(${translateX}px) scaleX(${scaleX})`;
  }

  calculatePosition(tabRootLeft, tabRootWidth, tabContentLeft, tabContentWidth) {
    let translateX = tabRootLeft;
    let scaleX = tabRootWidth;
    if (this.shouldMatchTabContentWidth_()) {
      translateX += tabContentLeft;
      scaleX = tabContentWidth;
    } else if (this.isIcon_()) {
      translateX += (tabRootWidth / 2) - (this.adapter_.getRootOffsetWidth() / 2);
      scaleX = 1;
    }
    this.transformation_ = `translateX(${translateX}px) scaleX(${scaleX})`;
  }
}

export {
  MDCTabzIndicator,
};
