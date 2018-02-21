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

    this.handleTransitionEnd_ = (e) => this.handleTransitionEnd(e);

    this.init();
  }

  init() {
  }

  handleTransitionEnd(e) {
    if (e.target !== this.root_) return;
    this.adapter_.removeClass(cssClasses.ANIMATING);
    this.adapter_.notifyScrollFakery();
  }

  emitScrollFakery_() {
    const ce = new CustomEvent(strings.SCROLL_FAKERY_EVENT, {
      bubbles: true,
    });
    this.root_.dispatchEvent(ce);
  }

  animateToPosition(currentScrollX, targetScrollX) {
    this.adapter_.setStyleProp('transform', `translateX(${currentScrollX}px)`);
    this.adapter_.addClass(cssClasses.ANIMATING);
    // Cause reflow
    this.adapter_.getBoundingClientRect();
    // Listen for transition end
    this.adapter_.registerEventListener('transitionend', this.handleTransitionEnd_);
    // Update the position
    requestAnimationFrame(() => {
      this.adapter_.setStyleProp('transform', `translateX(${targetScrollX}px)`);
    });
  }

  resetTransform() {
    this.adapter_.setStyleProp('transform', '');
  }

  // animateToPosition(xPosition) {
  //   requestAnimationFrame(() => {
  //     this.animateToPosition_(xPosition);
  //   });
  // }

  // animateToPosition_(xPosition) {
  //   this.translateX_ += (xPosition - this.translateX_) / 4;
  //   this.adapter_.setStyleProp('transform', `translateX(${this.translateX_}px)`);
  //   if (Math.abs(xPosition - this.translateX_) < 1) {
  //     this.translateX_ = xPosition;
  //     this.adapter_.setStyleProp('transform', `translateX(${this.translateX_}px)`);
  //   } else {
  //     requestAnimationFrame(() => {
  //       this.animateToPosition_(xPosition);
  //     });
  //   }
  // }

  // cancelScrollAnimation() {
  //   cancelAnimationFrame(this.scrollFrame_);
  // }

  getBoundingClientRect() {
    return this.adapter_.getBoundingClientRect();
  }
}

export {
  MDCTabzContainer,
};
