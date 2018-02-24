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

  /** @public */
  shouldMatchTabContentWidth() {
    return this.adapter_.hasClass(cssClasses.MATCH_TAB_CONTENT);
  }

  constructor(root) {
    this.root_ = root;

    this.adapter_ = {
      getRootOffsetWidth: () =>
        this.root_.offsetWidth,
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      setRootStyle: (prop, value) =>
        this.root_.style[prop] = value,
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      hasClass: (className) =>
        this.root_.classList.contains(className),
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
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
    this.adapter_.setRootStyle('transform', this.transformation_);
  }

  calculatePosition(translateX, scaleX) {
    if (this.isCustom_ || this.isIcon_) {
      translateX += (scaleX / 2) - (this.adapter_.getRootOffsetWidth() / 2);
      scaleX = 1;
    }
    this.transformation_ = `translateX(${translateX}px) scaleX(${scaleX})`;
  }
}

export {
  MDCTabzIndicator,
};
