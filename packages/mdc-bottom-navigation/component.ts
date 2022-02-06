/**
 * @license
 * Copyright 2019 Google Inc.
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
import {MDCBottomNavigationAdapter} from './adapter';
import {strings} from './constants';
import {MDCBottomNavigationFoundation} from './foundation';

export class MDCBottomNavigation extends MDCComponent<MDCBottomNavigationFoundation> {
  static attachTo(root: Element): MDCBottomNavigation {
    return new MDCBottomNavigation(root);
  }

  private handleTargetScroll_!: SpecificEventListener<'scroll'>;
  private ripples_!: MDCRipple[];
  private scrollTarget_!: EventTarget;

  initialize(rippleFactory: MDCRippleFactory = (el) => MDCRipple.attachTo(el)) {
    this.ripples_ = Array.prototype.slice
      .call(this.root_.querySelectorAll(strings.MENU_SELECTOR))
      .map((icon) => {
        const ripple = rippleFactory(icon);
        ripple.unbounded = true;
        return ripple;
      });

    this.scrollTarget_ = window;
  }

  initialSyncWithDOM() {
    this.handleTargetScroll_ = this.foundation_.handleTargetScroll.bind(this.foundation_);
    this.scrollTarget_.addEventListener('scroll', this.handleTargetScroll_ as EventListener);
  }

  destroy() {
    this.ripples_.forEach((iconRipple) => iconRipple.destroy());
    this.scrollTarget_.removeEventListener('scroll', this.handleTargetScroll_ as EventListener);
    super.destroy();
  }

  setScrollTarget(target: EventTarget) {
    this.scrollTarget_.removeEventListener('scroll', this.handleTargetScroll_ as EventListener);
    this.scrollTarget_ = target;
    this.handleTargetScroll_ = this.foundation_.handleTargetScroll.bind(this.foundation_);
    this.scrollTarget_.addEventListener('scroll', this.handleTargetScroll_ as EventListener);
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    const adapter: MDCBottomNavigationAdapter = {
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setStyle: (property, value) => (this.root_ as HTMLElement).style.setProperty(property, value),
      getHeight: () => this.root_.clientHeight,
      getViewportScrollY: () => this.scrollTarget_ === window ? (this.scrollTarget_ as Window).pageYOffset :
          (this.scrollTarget_ as Element).scrollTop,
    };
    // tslint:enable:object-literal-sort-keys

    return new MDCBottomNavigationFoundation(adapter);
  }
}
