const cssClasses = {
  PREVIOUS: 'mdc-tabz-pager--previous',
  NEXT: 'mdc-tabz-pager--next',
  HIDE: 'mdc-tabz-pager--hide',
};

const strings = {
  PAGING_EVENT: 'MDCTabzPager:paging',
  NEXT: 'next',
  PREVIOUS: 'previous',
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
      registerEventHandler: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) =>
        this.root_.removeEventListener(evtType, handler),
      hasClass: (className) =>
        this.root_.classList.contains(className),
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      notifyPagingEvent: (data) => {
        const ce = new CustomEvent(strings.PAGING_EVENT, {
          detail: data,
          bubbles: true,
        });
        this.root_.dispatchEvent(ce);
      },
    };

    this.handleClick_ = () => this.handleClick();

    this.init();
  }

  init() {
    this.adapter_.registerEventHandler('click', this.handleClick_);
  }

  handleClick() {
    let direction;
    if (this.adapter_.hasClass(cssClasses.PREVIOUS)) {
      direction = strings.PREVIOUS;
    } else if (this.adapter_.hasClass(cssClasses.NEXT)) {
      direction = strings.NEXT;
    }
    this.adapter_.notifyPagingEvent({
      direction,
    });
  }

  hide() {
    this.adapter_.addClass(cssClasses.HIDE);
  }

  show() {
    this.adapter_.removeClass(cssClasses.HIDE);
  }
}

export {
  MDCTabzPager,
};
