import {MDCRipple} from '@material/ripple/index';

const cssClasses = {
  ACTIVE: 'mdc-tabz--active',
};

const strings = {
  RIPPLE_SURFACE: '.mdc-tabz__ripple',
};

class MDCTabz {
  static attachTo(root) {
    return new MDCTabz(root);
  }

  constructor(root) {
    this.root_ = root;

    const rippleRoot_ = this.root_.querySelector(strings.RIPPLE_SURFACE);
    this.ripple_ = MDCRipple.attachTo(rippleRoot_);

    this.adapter_ = {
      getBoundingClientRect: () =>
        this.root_.getBoundingClientRect(),
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      hasClass: (className) =>
        this.root_.classList.contains(className),
      hasChildElement: (element) =>
        this.root_.contains(element),
    };
  }

  hasChildElement(target) {
    return this.root_ === target || this.adapter_.hasChildElement(target);
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
    this.adapter_.addClass(cssClasses.ACTIVE);
  }

  /** Deactivates the tab */
  deactivate() {
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
