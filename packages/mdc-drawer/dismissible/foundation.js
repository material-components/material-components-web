/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import MDCDrawerAdapter from '../adapter';
import MDCFoundation from '@material/base/foundation';
import {cssClasses, strings} from '../constants';

/**
 * @extends {MDCFoundation<!MDCDrawerAdapter>}
 */
class MDCDismissibleDrawerFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter() {
    return /** @type {!MDCDrawerAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      elementHasClass: (/* element: !Element, className: string */) => {},
      notifyClose: () => {},
      notifyOpen: () => {},
      saveFocus: () => {},
      restoreFocus: () => {},
      focusActiveNavigationItem: () => {},
      trapFocus: () => {},
      releaseFocus: () => {},
    });
  }

  constructor(adapter) {
    super(Object.assign(MDCDismissibleDrawerFoundation.defaultAdapter, adapter));

    /** @private {number} */
    this.animationFrame_ = 0;

    /** @private {number} */
    this.animationTimer_ = 0;
  }

  destroy() {
    if (this.animationFrame_) {
      cancelAnimationFrame(this.animationFrame_);
    }
    if (this.animationTimer_) {
      clearTimeout(this.animationTimer_);
    }
  }

  /**
   * Function to open the drawer.
   */
  open() {
    if (this.isOpen() || this.isOpening() || this.isClosing()) {
      return;
    }

    this.adapter_.addClass(cssClasses.OPEN);
    this.adapter_.addClass(cssClasses.ANIMATE);

    // Wait a frame once display is no longer "none", to establish basis for animation
    this.runNextAnimationFrame_(() => {
      this.adapter_.addClass(cssClasses.OPENING);
    });

    this.adapter_.saveFocus();
  }

  /**
   * Function to close the drawer.
   */
  close() {
    if (!this.isOpen() || this.isOpening() || this.isClosing()) {
      return;
    }

    this.adapter_.addClass(cssClasses.CLOSING);
  }

  /**
   * Extension point for when drawer finishes open animation.
   * @protected
   */
  opened() {}

  /**
   * Extension point for when drawer finishes close animation.
   * @protected
   */
  closed() {}

  /**
   * Returns true if drawer is in open state.
   * @return {boolean}
   */
  isOpen() {
    return this.adapter_.hasClass(cssClasses.OPEN);
  }

  /**
   * Returns true if drawer is animating open.
   * @return {boolean}
   */
  isOpening() {
    return this.adapter_.hasClass(cssClasses.OPENING);
  }

  /**
   * Returns true if drawer is animating closed.
   * @return {boolean}
   */
  isClosing() {
    return this.adapter_.hasClass(cssClasses.CLOSING);
  }

  /**
   * Keydown handler to close drawer when key is escape.
   * @param evt
   */
  handleKeydown(evt) {
    const {keyCode, key} = evt;

    const isEscape = key === 'Escape' || keyCode === 27;
    if (isEscape) {
      this.close();
    }
  }

  /**
   * Handles a transition end event on the root element.
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    const {OPENING, CLOSING, OPEN, ANIMATE, ROOT} = cssClasses;

    // In Edge, transitionend on ripple pseudo-elements yields a target without classList, so check for Element first.
    const isElement = evt.target instanceof Element;
    if (!isElement || !this.adapter_.elementHasClass(/** @type {!Element} */ (evt.target), ROOT)) {
      return;
    }

    if (this.isClosing()) {
      this.adapter_.removeClass(OPEN);
      this.adapter_.restoreFocus();
      this.closed();
      this.adapter_.notifyClose();
    } else {
      this.adapter_.focusActiveNavigationItem();
      this.opened();
      this.adapter_.notifyOpen();
    }

    this.adapter_.removeClass(ANIMATE);
    this.adapter_.removeClass(OPENING);
    this.adapter_.removeClass(CLOSING);
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
   * @param {Function} callback
   * @private
   */
  runNextAnimationFrame_(callback) {
    cancelAnimationFrame(this.animationFrame_);
    this.animationFrame_ = requestAnimationFrame(() => {
      this.animationFrame_ = 0;
      clearTimeout(this.animationTimer_);
      this.animationTimer_ = setTimeout(callback, 0);
    });
  }
}

export default MDCDismissibleDrawerFoundation;
