const cssClasses = {
  ANIMATING: 'mdc-tabz-bar__container--animating',
};

const strings = {
  SCROLL_FAKERY_EVENT: 'MDCTabzContainer:scrollfakery',
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

    this.adapter_ = {
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      setStyleProp: (prop, value) =>
        this.root_.style[prop] = value,
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      notifyScrollFakery: () => {
        this.emitScrollFakery_();
      },
    };

    /** @type {boolean} */
    this.shouldNotifyScrollFakery_ = false;

    this.handleTransitionEnd_ = (e) => this.handleTransitionEnd(e);

    this.init();
  }

  init() {
  }

  /** @private */
  emitScrollFakery_() {
    const ce = new CustomEvent(strings.SCROLL_FAKERY_EVENT, {
      bubbles: true,
    });
    this.root_.dispatchEvent(ce);
  }

  handleTransitionEnd(e) {
    // Ignore all events that aren't from the root
    if (e.target !== this.root_) return;
    // Remove the animating class
    this.adapter_.removeClass(cssClasses.ANIMATING);
    if (this.shouldNotifyScrollFakery_) {
      this.adapter_.notifyScrollFakery();
      this.shouldNotifyScrollFakery_ = false;
    }
  }

  /**
   * Animates fake scrolling from currentX to targetX
   * @param {number} targetX The target scrollLeft value
   * @param {number=} currentX The current scrollLeft value
   */
  animateFakeScroll(targetX, currentX=0) {
    console.log('currentX', currentX, 'targetX', targetX);
    this.adapter_.setStyleProp('transform', `translateX(${currentX}px)`);
    this.adapter_.addClass(cssClasses.ANIMATING);
    // Force reflow so style changes get picked up
    this.adapter_.getBoundingClientRect();
    // Listen for transition end
    this.adapter_.registerEventListener('transitionend', this.handleTransitionEnd_);
    // Update the position
    requestAnimationFrame(() => {
      this.adapter_.setStyleProp('transform', `translateX(${targetX}px)`);
    });
  }

  /**
   * Fake scrolling from currentX to targetX
   * @param {number} targetX The target scrollLeft value
   * @param {?number} currentX The current scrollLeft value
   */
  fakeScroll(targetX, currentX) {
    this.shouldNotifyScrollFakery_ = true;
    this.animateFakeScroll(targetX, currentX);
  }

  /** Resets the root element's transform property */
  resetTransform() {
    this.adapter_.setStyleProp('transform', '');
  }

  /**
   * Returns the bounding client rect of the root
   * @return {!ClientRect}
   */
  getRootBoundingClientRect() {
    return this.adapter_.getBoundingClientRect();
  }
}

export {
  MDCTabzContainer,
};
