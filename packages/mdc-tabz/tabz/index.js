import {MDCRipple} from '@material/ripple/index';

const cssClasses = {
  ACTIVE: 'mdc-tabz--active',
  ANIMATING_ACTIVATE: 'mdc-tabz--animating-activate',
  ANIMATING_DEACTIVATE: 'mdc-tabz--animating-deactivate',
};

const strings = {
  RIPPLE_SURFACE: '.mdc-tabz__ripple',
  TABZ_EVENT: 'MDCTabz:selected',
};

class MDCTabz {
  static attachTo(root) {
    return new MDCTabz(root);
  }

  static get strings() {
    return strings;
  }

  constructor(root) {
    this.root_ = root;

    const rippleRoot_ = this.root_.querySelector(strings.RIPPLE_SURFACE);
    this.ripple_ = MDCRipple.attachTo(rippleRoot_);

    this.adapter_ = {
      registerEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      hasClass: (className) =>
        this.root_.classList.contains(className),
      notifyTabSelection: () => {
        const evt = new CustomEvent(strings.TABZ_EVENT, {
          detail: {
            tab: this,
          },
          bubbles: true,
        });
        this.root_.dispatchEvent(evt);
      },
    };

    this.handleClick_ = () => this.handleClick();
    this.handleTransitionEnd_ = () => this.handleTransitionEnd();

    this.init();
  }

  init() {
    this.adapter_.registerEventListener('click', this.handleClick_);
  }

  handleClick() {
    this.adapter_.notifyTabSelection();
  }

  handleTransitionEnd() {
    this.adapter_.removeClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.removeClass(cssClasses.ANIMATING_DEACTIVATE);
  }

  /**
   * Returns the active state of the tab
   * @return {boolean}
   */
  isActive() {
    return this.adapter_.hasClass(cssClasses.ACTIVE);
  }

  /** Activates the tab */
  activate() {
    this.adapter_.registerEventListener('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.addClass(cssClasses.ACTIVE);
  }

  /** Deactivates the tab */
  deactivate() {
    this.adapter_.registerEventListener('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_DEACTIVATE);
    this.adapter_.removeClass(cssClasses.ACTIVE);
  }

  /**
   * Returns the bounding rect of the element
   * @return {!ClientRect}
   */
  getBoundingClientRect() {
    return this.adapter_.getBoundingClientRect();
  }
}

export {
  MDCTabz,
};
