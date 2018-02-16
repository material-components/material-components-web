const cssClasses = {
  ANIMATING: 'mdc-tabz-indicator--animating',
  ANIMATING_ICON: 'mdc-tabz-indicator--animating-icon',
  UPGRADED: 'mdc-tabz-indicator--upgraded',
  CUSTOM: 'mdc-tabz-indicator--custom',
  ICON: 'mdc-tabz-indicator--icon',
  ICON_HIDE: 'mdc-tabz-indicator--icon-hide',
};

class MDCTabzIndicator {
  static attachTo(root) {
    return new MDCTabzIndicator(root);
  }

  /** @private */
  get isCustom_() {
    return this.adapter_.hasClass(cssClasses.CUSTOM);
  }

  /** @private */
  get isIcon_() {
    return this.adapter_.hasClass(cssClasses.ICON);
  }

  /** @private */
  get isIconHidden_() {
    return this.adapter_.hasClass(cssClasses.ICON_HIDE);
  }

  constructor(root) {
    this.root_ = root;

    this.adapter_ = {
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      setRootStyle: (prop, value) =>
        this.root_.style[prop] = value,
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      hasClass: (className) =>
        this.root_.classList.contains(className),
    };

    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
    this.transformation_ = '';

    this.init();
  }

  init() {
    this.adapter_.addClass(cssClasses.UPGRADED);
  }

  /**
   * Returns the bounding rect of the element
   * @return {!ClientRect}
   */
  getBoundingClientRect() {
    return this.adapter_.getBoundingClientRect();
  }

  /** Handles the transitionend event */
  handleTransitionEnd() {
    if (this.isIcon_ && this.isIconHidden_) {
      this.adapter_.removeClass(cssClasses.ICON_HIDE);
      this.updatePosition();
    } else if (this.isIcon_) {
      this.adapter_.deregisterEventListener('transitionend', this.handleTransitionEnd_);
      this.adapter_.removeClass(cssClasses.ANIMATING_ICON);
    } else {
      this.adapter_.deregisterEventListener('transitionend', this.handleTransitionEnd_);
      this.adapter_.removeClass(cssClasses.ANIMATING);
    }
  }

  /** Animates the position of the indicator */
  animatePosition() {
    this.animatePosition_();
  }

  /**
   * Animates the position of the indicator. Depending on whether the indicator
   * is an icon indicator, the indicator position change happens either
   * immediately or after the icon transition
   * @private
   */
  animatePosition_() {
    this.adapter_.registerEventListener('transitionend', this.handleTransitionEnd_);
    if (this.isIcon_) {
      this.adapter_.addClass(cssClasses.ANIMATING_ICON);
      this.adapter_.addClass(cssClasses.ICON_HIDE);
    } else {
      this.adapter_.addClass(cssClasses.ANIMATING);
      this.updatePosition();
    }
  }

  /** Updates the position of the indicator */
  updatePosition() {
    this.updatePosition_();
  }

  /**
   * Set the root element's transform property from the calculated position
   * @private
   */
  updatePosition_() {
    this.adapter_.setRootStyle('transform', this.transformation_);
  }

  /**
   * Calculates and stores the position of the indicator
   * @param {!ClientRect} activeBbox The active tab's bounding box
   * @param {!ClientRect} containerBbox The container's bounding box
   */
  calculatePosition(activeBbox, containerBbox) {
    this.calculatePosition_(activeBbox, containerBbox);
  }

  /**
   * Calculates and stores the position of the indicator for use in updatePosition
   * @param {!ClientRect} activeBbox The active tab's bounding box
   * @param {!ClientRect} containerBbox The container's bounding box
   * @private
   */
  calculatePosition_(activeBbox, containerBbox) {
    let translateX = activeBbox.left - containerBbox.left;
    let scaleX = activeBbox.width;
    if (this.isCustom_ || this.isIcon_) {
      const indicatorBbox = this.adapter_.getBoundingClientRect();
      translateX += (activeBbox.width / 2) - (indicatorBbox.width / 2);
      scaleX = 1;
    }
    this.transformation_ = `translateX(${translateX}px) scaleX(${scaleX})`;
  }
}

export {
  MDCTabzIndicator,
};
