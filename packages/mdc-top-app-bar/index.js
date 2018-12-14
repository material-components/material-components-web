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

import MDCTopAppBarAdapter from './adapter';
import MDCComponent from '@material/base/component';
import {MDCRipple} from '@material/ripple/index';
import {cssClasses, strings} from './constants';
import MDCTopAppBarBaseFoundation from './foundation';
import MDCFixedTopAppBarFoundation from './fixed/foundation';
import MDCShortTopAppBarFoundation from './short/foundation';
import MDCTopAppBarFoundation from './standard/foundation';

/**
 * @extends {MDCComponent<!MDCTopAppBarBaseFoundation>}
 * @final
 */
class MDCTopAppBar extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.navIcon_;
    /** @type {?Array<MDCRipple>} */
    this.iconRipples_;
    /** @type {Object} */
    this.scrollTarget_;
  }

  initialize(
    rippleFactory = (el) => MDCRipple.attachTo(el)) {
    this.navIcon_ = this.root_.querySelector(strings.NAVIGATION_ICON_SELECTOR);

    // Get all icons in the toolbar and instantiate the ripples
    const icons = [].slice.call(this.root_.querySelectorAll(strings.ACTION_ITEM_SELECTOR));
    if (this.navIcon_) {
      icons.push(this.navIcon_);
    }

    this.iconRipples_ = icons.map((icon) => {
      const ripple = rippleFactory(icon);
      ripple.unbounded = true;
      return ripple;
    });

    this.scrollTarget_ = window;
  }

  destroy() {
    this.iconRipples_.forEach((iconRipple) => iconRipple.destroy());
    super.destroy();
  }

  setScrollTarget(target) {
    this.foundation_.destroyScrollHandler();
    this.scrollTarget_ = target;
    this.foundation_.initScrollHandler();
  }

  /**
   * @param {!Element} root
   * @return {!MDCTopAppBar}
   */
  static attachTo(root) {
    return new MDCTopAppBar(root);
  }

  /**
   * @return {!MDCTopAppBarBaseFoundation}
   */
  getDefaultFoundation() {
    /** @type {!MDCTopAppBarAdapter} */
    const adapter = /** @type {!MDCTopAppBarAdapter} */ (Object.assign({
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setStyle: (property, value) => this.root_.style.setProperty(property, value),
      getTopAppBarHeight: () => this.root_.clientHeight,
      registerNavigationIconInteractionHandler: (evtType, handler) => {
        if (this.navIcon_) {
          this.navIcon_.addEventListener(evtType, handler);
        }
      },
      deregisterNavigationIconInteractionHandler: (evtType, handler) => {
        if (this.navIcon_) {
          this.navIcon_.removeEventListener(evtType, handler);
        }
      },
      notifyNavigationIconClicked: () => {
        this.emit(strings.NAVIGATION_EVENT, {});
      },
      registerScrollHandler: (handler) => this.scrollTarget_.addEventListener('scroll', handler),
      deregisterScrollHandler: (handler) => this.scrollTarget_.removeEventListener('scroll', handler),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getViewportScrollY: () =>
        this.scrollTarget_[this.scrollTarget_ === window ? 'pageYOffset' : 'scrollTop'],
      getTotalActionItems: () =>
        this.root_.querySelectorAll(strings.ACTION_ITEM_SELECTOR).length,
    })
    );

    /** @type {!MDCTopAppBarBaseFoundation} */
    let foundation;
    if (this.root_.classList.contains(cssClasses.SHORT_CLASS)) {
      foundation = new MDCShortTopAppBarFoundation(adapter);
    } else if (this.root_.classList.contains(cssClasses.FIXED_CLASS)) {
      foundation = new MDCFixedTopAppBarFoundation(adapter);
    } else {
      foundation = new MDCTopAppBarFoundation(adapter);
    }

    return foundation;
  }
}

export {MDCTopAppBar, MDCTopAppBarBaseFoundation,
  MDCTopAppBarFoundation, MDCFixedTopAppBarFoundation,
  MDCShortTopAppBarFoundation};
