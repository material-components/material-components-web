const cssClasses = {
  PREV: 'mdc-tabz-pager--prev',
  NEXT: 'mdc-tabz-pager--next',
};

const strings = {
  NEXT: 'MDCTabzPager:next',
  PREV: 'MDCTabzPager:prev',
};

class MDCTabzPager {
  static attachTo(root) {
    return new MDCTabzPager(root);
  }

  static get strings() {
    return strings;
  }

  constructor(root) {
    this.root_ = root;

    this.adapter_ = {
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      hasClass: (className) =>
        this.root_.classList.contains(className),
      notifyPrev: () =>
        this.emitPrevEvent_(),
      notifyNext: () =>
        this.emitNextEvent_(),
    };

    this.handleClick_ = () => this.handleClick();

    this.init();
  }

  init() {
    this.adapter_.registerEventListener('click', this.handleClick_);
  }

  handleClick() {
    if (this.isPrev_()) {
      this.adapter_.notifyPrev();
    } else if (this.isNext_()) {
      this.adapter_.notifyNext();
    }
  }

  isPrev_() {
    return this.adapter_.hasClass(cssClasses.PREV);
  }

  isNext_() {
    return this.adapter_.hasClass(cssClasses.NEXT);
  }

  emitPrevEvent_() {
    const ce = new CustomEvent(strings.PREV, {
      bubbles: true,
    });
    this.root_.dispatchEvent(ce);
  }

  emitNextEvent_() {
    const ce = new CustomEvent(strings.NEXT, {
      bubbles: true,
    });
    this.root_.dispatchEvent(ce);
  }
}

export {
  MDCTabzPager,
};
