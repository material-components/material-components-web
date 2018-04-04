const cssClasses = {
  ANIMATING: 'mdc-tabz-container--animating',
};

const strings = {
  INNER_SELECTOR: '.mdc-tabz-container__inner',
};

class MDCTabzScroller {
  static attachTo(root) {
    return new MDCTabzScroller(root);
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  constructor(root) {
    this.root_ = root;
    this.inner_ = root.querySelector(strings.INNER_SELECTOR);

    this.adapter_ = {
      registerEventHandler: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      getRootBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      getInnerBoundingClientRect: () =>
        this.inner_.getBoundingClientRect(),
      getInnerOffsetLeft: () =>
        this.inner_.offsetLeft,
      getRootScrollLeft: () =>
        this.root_.scrollLeft,
      setRootScrollLeft: (scrollLeft) =>
        this.root_.scrollLeft = scrollLeft,
      setInnerStyleProp: (prop, value) =>
        this.inner_.style[prop] = value,
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      isRTL: () =>
        window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
    };

    this.shouldUpdateScrollPosition_ = false;
    this.targetScrollPosition_;

    this.handleTransitionEnd_ = (e) => this.handleTransitionEnd(e);

    this.init();
  }

  init() {
  }

  handleTransitionEnd(e) {
    // Ignore all events that aren't from the root
    if (e.target !== this.inner_) return;
    // Remove the animating class
    this.adapter_.removeClass(cssClasses.ANIMATING);
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
  }

  /**
   * Fake scrolling from targetX
   * @param {number} targetX The target scrollLeft value
   */
  scrollTo(targetX) {
    this.adapter_.removeClass(cssClasses.ANIMATING);
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
    // const scrollLeft = this.adapter_.getRootScrollLeft();
    this.adapter_.setInnerStyleProp('transform', `translateX(${targetX}px)`);
    this.adapter_.setRootScrollLeft(this.adapter_.getRootScrollLeft() + targetX);
    requestAnimationFrame(() => {
      this.adapter_.addClass(cssClasses.ANIMATING);
      this.adapter_.setInnerStyleProp('transform', '');
    });
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
  }

  /**
   * Animates fake scrolling to targetX
   * @param {number} targetX The target scrollLeft value
   */
  slideTo(targetX) {
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.setInnerStyleProp('transform', `translateX(${targetX}px)`);
  }

  /**
   * Returns the bounding client rect of the root
   * @return {!ClientRect}
   */
  getRootBoundingClientRect() {
    return this.adapter_.getRootBoundingClientRect();
  }

  /**
   * Returns the bounding client rect of the inner
   * @return {!ClientRect}
   */
  getInnerBoundingClientRect() {
    return this.adapter_.getInnerBoundingClientRect();
  }

  /**
   * Returns the left offet
   * @return {number}
   */
  getInnerOffsetLeft() {
    return this.adapter_.getInnerOffsetLeft();
  }
}

export {
  MDCTabzScroller,
};
