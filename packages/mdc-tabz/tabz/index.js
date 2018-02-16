import {MDCRipple} from '@material/ripple/index';

const cssClasses = {
  ACTIVE: 'mdc-tabz--active',
  ANIMATING_ACTIVATE: 'mdc-tabz--animating-activate',
  ANIMATING_DEACTIVATE: 'mdc-tabz--animating-deactivate',
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
      addEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      removeEventListener: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
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

    this.handleTransitionEnd_ = () => this.handleTransitionEnd();
  }

  handleTransitionEnd() {
    this.adapter_.removeClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.removeClass(cssClasses.ANIMATING_DEACTIVATE);
  }

  /**
   * Returns whether the target exists in the tree at or below this element.
   * @param {Node} target The element to check the presence of
   */
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
    this.adapter_.addEventListener('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.addClass(cssClasses.ACTIVE);
  }

  /** Deactivates the tab */
  deactivate() {
    this.adapter_.addEventListener('transitionend', this.handleTransitionEnd_);
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
