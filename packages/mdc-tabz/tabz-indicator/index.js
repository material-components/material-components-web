const cssClasses = {
  ANIMATING: 'mdc-tabz-indicator--animating',
  UPGRADED: 'mdc-tabz-indicator--upgraded',
  CUSTOM: 'mdc-tabz-indicator--custom',
};

class MDCTabzIndicator {
  static attachTo(root) {
    return new MDCTabzIndicator(root);
  }

  constructor(root) {
    this.root_ = root;
    this.handleTransitionend_ = () => this.handleTransitionEnd();

    this.adapter_ = {
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      addEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      removeEventListener: (evtType, handler) =>
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

    this.init();

    this.isCustomIndicator_ = this.isCustom_();
  }

  init() {
    this.adapter_.addClass(cssClasses.UPGRADED);
  }

  /**
   * Called on transitionend
   */
  handleTransitionEnd() {
    this.adapter_.removeEventListener('transitionend', this.handleTransitionend_);
    this.adapter_.removeClass(cssClasses.ANIMATING);
  }

  /**
   * Animates the position of the indicator
   * @param {!ClientRect} activeBbox The bounding box of the active element
   * @param {!ClientRect} barBbox The bounding box of the tab bar
   */
  animatePosition(activeBbox, barBbox) {
    this.adapter_.addEventListener('transitionend', this.handleTransitionend_);
    this.adapter_.addClass(cssClasses.ANIMATING);
    this.updatePosition(activeBbox, barBbox);
  }

  /**
   * Updates the position of the indicator after resize
   * @param {!ClientRect} activeBbox The bounding box of the active element
   * @param {!ClientRect} barBbox The bounding box of the tab bar
   */
  updatePosition(activeBbox, barBbox) {
    let translateX = activeBbox.left - barBbox.left;
    let scaleX = activeBbox.width;
    if (this.isCustomIndicator_) {
      const indicatorBbox = this.adapter_.getBoundingClientRect();
      translateX += activeBbox.width / 2 - indicatorBbox.width / 2;
      scaleX = 1;
    }
    this.transform_(`translateX(${translateX}px) scaleX(${scaleX})`);
  }

  /**
   * Set the root element's transform property
   * @param {string} transformation The value for the transform property
   * @private
   */
  transform_(transformation) {
    requestAnimationFrame(() => {
      this.adapter_.setRootStyle('transform', transformation);
    });
  }

  isCustom_() {
    return this.adapter_.hasClass(cssClasses.CUSTOM);
  }
}

export {
  MDCTabzIndicator,
};
