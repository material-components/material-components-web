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
import {SpecificEventListener} from '@material/base/types';
import {MDCRipple, MDCRippleFactory} from '@material/ripple/component';

import {MDCTopAppBarAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCFixedTopAppBarFoundation} from './fixed/foundation';
import {MDCTopAppBarBaseFoundation} from './foundation';
import {MDCShortTopAppBarFoundation} from './short/foundation';
import {MDCTopAppBarFoundation} from './standard/foundation';

/** MDC Top App Bar */
export class MDCTopAppBar extends MDCComponent<MDCTopAppBarBaseFoundation> {
  static override attachTo(root: Element): MDCTopAppBar {
    return new MDCTopAppBar(root);
  }

  private handleNavigationClick!:
      SpecificEventListener<'click'>;  // assigned in initialSyncWithDOM()
  private handleWindowResize!:
      SpecificEventListener<'resize'>;  // assigned in initialSyncWithDOM()
  private handleTargetScroll!:
      SpecificEventListener<'scroll'>;  // assigned in initialSyncWithDOM()
  private navIcon!: Element|null;
  private iconRipples!: MDCRipple[];
  private scrollTarget!: EventTarget;

  override initialize(
      rippleFactory: MDCRippleFactory = (el) => MDCRipple.attachTo(el)) {
    this.navIcon = this.root.querySelector(strings.NAVIGATION_ICON_SELECTOR);

    // Get all icons in the toolbar and instantiate the ripples
    const icons: Element[] =
        Array.from(this.root.querySelectorAll(strings.ACTION_ITEM_SELECTOR));
    if (this.navIcon) {
      icons.push(this.navIcon);
    }

    this.iconRipples = icons.map((icon) => {
      const ripple = rippleFactory(icon);
      ripple.unbounded = true;
      return ripple;
    });

    this.scrollTarget = window;
  }

  override initialSyncWithDOM() {
    this.handleNavigationClick =
        this.foundation.handleNavigationClick.bind(this.foundation);
    this.handleWindowResize =
        this.foundation.handleWindowResize.bind(this.foundation);
    this.handleTargetScroll =
        this.foundation.handleTargetScroll.bind(this.foundation);

    this.scrollTarget.addEventListener(
        'scroll', this.handleTargetScroll as EventListener);

    if (this.navIcon) {
      this.navIcon.addEventListener(
          'click', this.handleNavigationClick as EventListener);
    }

    const isFixed = this.root.classList.contains(cssClasses.FIXED_CLASS);
    const isShort = this.root.classList.contains(cssClasses.SHORT_CLASS);
    if (!isShort && !isFixed) {
      window.addEventListener(
          'resize', this.handleWindowResize as EventListener);
    }
  }

  override destroy() {
    for (const iconRipple of this.iconRipples) {
      iconRipple.destroy();
    }
    this.scrollTarget.removeEventListener(
        'scroll', this.handleTargetScroll as EventListener);
    if (this.navIcon) {
      this.navIcon.removeEventListener(
          'click', this.handleNavigationClick as EventListener);
    }
    const isFixed = this.root.classList.contains(cssClasses.FIXED_CLASS);
    const isShort = this.root.classList.contains(cssClasses.SHORT_CLASS);
    if (!isShort && !isFixed) {
      window.removeEventListener(
          'resize', this.handleWindowResize as EventListener);
    }
    super.destroy();
  }

  setScrollTarget(target: EventTarget) {
    // Remove scroll handler from the previous scroll target
    this.scrollTarget.removeEventListener(
        'scroll', this.handleTargetScroll as EventListener);

    this.scrollTarget = target;

    // Initialize scroll handler on the new scroll target
    this.handleTargetScroll =
        this.foundation.handleTargetScroll.bind(this.foundation);
    this.scrollTarget.addEventListener(
        'scroll', this.handleTargetScroll as EventListener);
  }

  override getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take
    // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
    // methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCTopAppBarAdapter = {
      hasClass: (className) => this.root.classList.contains(className),
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setStyle: (property, value) => {
        (this.root as HTMLElement).style.setProperty(property, value);
      },
      getTopAppBarHeight: () => this.root.clientHeight,
      notifyNavigationIconClicked: () => {
        this.emit(strings.NAVIGATION_EVENT, {});
      },
      getViewportScrollY: () => {
        const win = this.scrollTarget as Window;
        const el = this.scrollTarget as Element;
        return win.pageYOffset !== undefined ? win.pageYOffset : el.scrollTop;
      },
      getTotalActionItems: () =>
          this.root.querySelectorAll(strings.ACTION_ITEM_SELECTOR).length,
    };
    // tslint:enable:object-literal-sort-keys

    let foundation: MDCTopAppBarBaseFoundation;
    if (this.root.classList.contains(cssClasses.SHORT_CLASS)) {
      foundation = new MDCShortTopAppBarFoundation(adapter);
    } else if (this.root.classList.contains(cssClasses.FIXED_CLASS)) {
      foundation = new MDCFixedTopAppBarFoundation(adapter);
    } else {
      foundation = new MDCTopAppBarFoundation(adapter);
    }

    return foundation;
  }
}
