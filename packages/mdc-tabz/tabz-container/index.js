const cssClasses = {
  ANIMATING: 'mdc-tabz-container--animating',
};

const strings = {
  INNER_SELECTOR: '.mdc-tabz-container__inner',
};

class MDCTabzContainer {
  static attachTo(root) {
    return new MDCTabzContainer(root);
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
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
    };

    this.shouldUpdateScrollPosition_ = false;
    this.targetScrollPosition_ = 0;

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
    if (this.shouldUpdateScrollPosition_) {
      this.updateScrollPosition_();
    }
  }

  /**
   * Updates the scroll position to the saved value
   * @private
   */
  updateScrollPosition_() {
    this.resetTransform_();
    const currentScrollLeft = this.adapter_.getRootScrollLeft();
    this.adapter_.setRootScrollLeft(currentScrollLeft - this.targetScrollPosition_);
    this.targetScrollPosition_ = 0;
    this.shouldUpdateScrollPosition_ = false;
  }

  /**
   * Animates fake scrolling from currentX to targetX
   * @param {number} targetX The target scrollLeft value
   * @param {number=} currentX The current scrollLeft value
   */
  slideTo(targetX, currentX=0) {
    this.adapter_.setInnerStyleProp('transform', `translateX(${currentX}px)`);
    this.adapter_.addClass(cssClasses.ANIMATING);
    // Force reflow so style changes get picked up
    this.adapter_.getRootBoundingClientRect();
    // Listen for transition end
    this.adapter_.registerEventListener('transitionend', this.handleTransitionEnd_);
    // Update the position
    requestAnimationFrame(() => {
      this.adapter_.setInnerStyleProp('transform', `translateX(${targetX}px)`);
    });
  }

  /**
   * Fake scrolling from currentX to targetX
   * @param {number} targetX The target scrollLeft value
   * @param {?number} currentX The current scrollLeft value
   */
  scrollTo(targetX, currentX) {
    this.shouldUpdateScrollPosition_ = true;
    this.targetScrollPosition_ = targetX;
    this.slideTo(targetX, currentX);
  }

  resetTransform_() {
    this.adapter_.setInnerStyleProp('transform', '');
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

  /**
   * Returns the scroll offset
   * @return {number}
   */
  getRootScrollOffset() {
    return this.adapter_.getRootScrollLeft();
  }
}

export {
  MDCTabzContainer,
};
