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

import {MDCFoundation} from '@material/base/foundation';
import {MDCBottomNavigationAdapter} from './adapter';
import {cssClasses} from './constants';

export class MDCBottomNavigationFoundation extends MDCFoundation<MDCBottomNavigationAdapter> {

  private lastScrollY_ = this.adapter.getViewportScrollY();

  private currentPositionY_ = 0;

  private animationKey_: number | null = null;

  private animatingPositionY_ = 0;

  private get animationAcceleration_() {
    return 5;
  }

  static get cssClasses() {
    return cssClasses;
  }

  /**
   * See {@link MDCBottomNavigationAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCBottomNavigationAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      setStyle: () => undefined,
      getHeight: () => 0,
      getViewportScrollY: () => 0,
    };
    // tslint:enable:object-literal-sort-keys
  }

  /* istanbul ignore next: optional argument is not a branch statement */
  constructor(adapter?: Partial<MDCBottomNavigationAdapter>) {
    super({...MDCBottomNavigationFoundation.defaultAdapter, ...adapter});
  }

  /**
   * Scroll handler for the default scroll behavior of the bottom navigation.
   */
  handleTargetScroll() {
    const scrollY = this.adapter.getViewportScrollY();
    const scrollDistance = scrollY - this.lastScrollY_;

    this.setCurrentPositionY_(this.currentPositionY_ + scrollDistance);
    this.lastScrollY_ = scrollY;

    if (this.animationKey_ === null) {
      this.moveBottomNavigation_();
    }
  }

  /**
   * Set currentPositionY_ between 0 to [height].
   */
  private setCurrentPositionY_(y: number) {
    const height = this.adapter.getHeight();
    if (y < 0) {
      this.currentPositionY_ = 0;
    } else if (height < y) {
      this.currentPositionY_ = height;
    } else {
      this.currentPositionY_ = y;
    }
  }

  /**
   * Set animatingPositionY_ between 0 to [height].
   */
  private setAnimatingPositionY_(y: number) {
    const height = this.adapter.getHeight();
    if (y < 0) {
      this.animatingPositionY_ = 0;
    } else if (height < y) {
      this.animatingPositionY_ = height;
    } else {
      this.animatingPositionY_ = y;
    }
  }

  /**
   * Get animatingY applying acceleration.
   */
  private getAccelerationAnimatingY_() {
    const currentY = this.currentPositionY_;
    const animatingY = this.animatingPositionY_;
    const acceleration = this.animationAcceleration_;
    const accelerationAnimatingY = animatingY + (currentY - animatingY) / acceleration;

    return Math.abs(currentY - accelerationAnimatingY) < 1 ? currentY : accelerationAnimatingY;
  }

  /**
   * Move bottom navigation to currentY with animation.
   */
  private moveBottomNavigation_() {
    if (this.animatingPositionY_ === this.currentPositionY_) {
      this.animationKey_ = null;
    } else {
      const moveY = this.getAccelerationAnimatingY_();
      this.setAnimatingPositionY_(moveY);
      this.adapter.setStyle(
          'transform',
          `translateY(${this.animatingPositionY_}px)`,
      );
      this.animationKey_ = requestAnimationFrame(() => {
        this.moveBottomNavigation_();
      });
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCBottomNavigationFoundation;
