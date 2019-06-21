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

import {MDCComponent} from '@material/base/component';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';
import {MDCTopAppBarAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCFixedTopAppBarFoundation} from './fixed/foundation';
import {MDCTopAppBarBaseFoundation} from './foundation';
import {MDCShortTopAppBarFoundation} from './short/foundation';
import {MDCTopAppBarFoundation} from './standard/foundation';

export class MDCTopAppBar extends MDCComponent<MDCTopAppBarBaseFoundation> {
  static attachTo(root: Element): MDCTopAppBar {
    return new MDCTopAppBar(root);
  }

  private navIcon_!: Element | null;
  private iconRipples_!: MDCRipple[];
  private scrollTarget_!: EventTarget;

  initialize(rippleFactory: MDCRippleFactory = (el) => MDCRipple.attachTo(el)) {
    this.navIcon_ = this.root_.querySelector(strings.NAVIGATION_ICON_SELECTOR);

    // Get all icons in the toolbar and instantiate the ripples
    const icons: Element[] = [].slice.call(this.root_.querySelectorAll(strings.ACTION_ITEM_SELECTOR));
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

  setScrollTarget(target: EventTarget) {
    // Remove scroll handler from the previous scroll target
    this.foundation_.destroyScrollHandler();

    this.scrollTarget_ = target;

    // Initialize scroll handler on the new scroll target
    this.foundation_.initScrollHandler();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTopAppBarAdapter = {
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setStyle: (property, value) => (this.root_ as HTMLElement).style.setProperty(property, value),
      getTopAppBarHeight: () => this.root_.clientHeight,
      registerNavigationIconInteractionHandler: (evtType, handler) => {
        if (this.navIcon_) {
          (this.navIcon_ as HTMLElement).addEventListener(evtType, handler);
        }
      },
      deregisterNavigationIconInteractionHandler: (evtType, handler) => {
        if (this.navIcon_) {
          (this.navIcon_ as HTMLElement).removeEventListener(evtType, handler);
        }
      },
      notifyNavigationIconClicked: () => this.emit(strings.NAVIGATION_EVENT, {}),
      registerScrollHandler: (handler) => this.scrollTarget_.addEventListener('scroll', handler as EventListener),
      deregisterScrollHandler: (handler) => this.scrollTarget_.removeEventListener('scroll', handler as EventListener),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      getViewportScrollY: () => {
        const win = this.scrollTarget_ as Window;
        const el = this.scrollTarget_ as Element;
        return win.pageYOffset !== undefined ? win.pageYOffset : el.scrollTop;
      },
      getTotalActionItems: () => this.root_.querySelectorAll(strings.ACTION_ITEM_SELECTOR).length,
    };
    // tslint:enable:object-literal-sort-keys

    let foundation: MDCTopAppBarBaseFoundation;
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
