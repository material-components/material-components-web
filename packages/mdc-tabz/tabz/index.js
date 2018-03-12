import {MDCRipple} from '@material/ripple/index';

const cssClasses = {
  UPGRADED: 'mdc-tabz--upgraded',
  ACTIVE: 'mdc-tabz--active',
  ANIMATING_ACTIVATE: 'mdc-tabz--animating-activate',
  ANIMATING_DEACTIVATE: 'mdc-tabz--animating-deactivate',
};

const strings = {
  RIPPLE_SURFACE_SELECTOR: '.mdc-tabz__ripple',
  CONTENT_SELECTOR: '.mdc-tabz__content',
  SELECTED_EVENT: 'MDCTabz:selected',
  KEYBOARD_EVENT: 'MDCTabz:keyboard',
  TABZ_NEXT_EVENT: 'MDCTabz:next',
  TABZ_PREVIOUS_EVENT: 'MDCTabz:previous',
  ARIA_SELECTED: 'aria-selected',
  KEYBOARD_NEXT: 'next',
  KEYBOARD_PREVIOUS: 'previous',
  KEYBOARD_HOME: 'home',
  KEYBOARD_END: 'end',
};

const direction = {
  35: strings.KEYBOARD_END,
  36: strings.KEYBOARD_HOME,
  37: strings.KEYBOARD_PREVIOUS,
  38: strings.KEYBOARD_PREVIOUS,
  39: strings.KEYBOARD_NEXT,
  40: strings.KEYBOARD_NEXT,
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
    this.content_ = this.root_.querySelector(strings.CONTENT_SELECTOR);
    this.ripple_ = MDCRipple.attachTo(this.root_);

    this.adapter_ = {
      registerEventHandler: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) =>
        this.root_.addEventListener(evtType, handler),
      getRootOffsetLeft: () =>
        this.root_.offsetLeft,
      getRootOffsetWidth: () =>
        this.root_.offsetWidth,
      getContentOffsetLeft: () =>
        this.content_.offsetLeft,
      getContentOffsetWidth: () =>
        this.content_.offsetWidth,
      addClass: (className) =>
        this.root_.classList.add(className),
      removeClass: (className) =>
        this.root_.classList.remove(className),
      hasClass: (className) =>
        this.root_.classList.contains(className),
      setAttributeValue: (attr, value) =>
        this.root_.setAttribute(attr, value),
      notifyTabSelected: (data) => {
        const evt = new CustomEvent(strings.SELECTED_EVENT, {
          detail: data,
          bubbles: true,
        });
        this.root_.dispatchEvent(evt);
      },
      notifyTabKeyboardAction: (data) => {
        const evt = new CustomEvent(strings.KEYBOARD_EVENT, {
          detail: data,
          bubbles: true,
        });
        this.root_.dispatchEvent(evt);
      },
      giveFocus: () =>
        this.root_.focus(),
    };

    this.rootOffsetLeftCache_ = null;
    this.rootOffsetWidthCache_ = null;
    this.contentOffsetLeftCache_ = null;
    this.contentOffsetWidthCache_ = null;

    this.handleClick_ = () => this.handleClick();
    this.handleKeyPress_ = (e) => this.handleKeyPress(e);
    this.handleTransitionEnd_ = (e) => this.handleTransitionEnd(e);

    this.init();
  }

  init() {
    this.adapter_.registerEventHandler('click', this.handleClick_);
    this.adapter_.registerEventHandler('keydown', this.handleKeyPress_);
    this.adapter_.addClass(cssClasses.UPGRADED);
    this.adapter_.setAttributeValue(strings.ARIA_SELECTED, this.isActive() ? 'true' : 'false');
  }

  /** Handles the click event */
  handleClick() {
    this.adapter_.notifyTabSelected({
      tab: this,
    });
  }

  /** Handles the transitionend event */
  handleTransitionEnd(e) {
    // Early exit
    if (e.pseudoElement) {
      return;
    }
    this.adapter_.removeClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.removeClass(cssClasses.ANIMATING_DEACTIVATE);
    this.adapter_.removeClass(cssClasses.ANIMATING_ACTIVATE_CUSTOM_INDICATOR);
    this.adapter_.removeClass(cssClasses.ANIMATING_DEACTIVATE_CUSTOM_INDICATOR);
    this.adapter_.deregisterEventHandler('transitionend', this.handleTransitionEnd_);
  }

  handleKeyPress(e) {
    const dir = direction[e.keyCode];
    if (!dir) {
      // Early exit
      return;
    }

    e.preventDefault();
    this.adapter_.notifyTabKeyboardAction({
      tab: this,
      direction: dir,
    });
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
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_ACTIVATE);
    this.adapter_.addClass(cssClasses.ACTIVE);
    this.adapter_.setAttributeValue(strings.ARIA_SELECTED, 'true');
    this.adapter_.giveFocus();
  }

  /** Deactivates the tab */
  deactivate() {
    this.adapter_.registerEventHandler('transitionend', this.handleTransitionEnd_);
    this.adapter_.addClass(cssClasses.ANIMATING_DEACTIVATE);
    this.adapter_.removeClass(cssClasses.ACTIVE);
    this.adapter_.setAttributeValue(strings.ARIA_SELECTED, 'false');
  }

  /**
   * Returns the offset left of the root
   * @return {number}
   */
  getRootOffsetLeft() {
    return this.adapter_.getRootOffsetLeft();
  }

  /**
   * Returns the offset width of the root
   * @return {number}
   */
  getRootOffsetWidth() {
    return this.adapter_.getRootOffsetWidth();
  }

  /**
   * Returns the offset left of the content
   * @return {number}
   */
  getContentOffsetLeft() {
    return this.adapter_.getContentOffsetLeft();
  }

  /**
   * Returns the offset width of the content
   * @return {number}
   */
  getContentOffsetWidth() {
    return this.adapter_.getContentOffsetWidth();
  }
}

export {
  MDCTabz,
};
