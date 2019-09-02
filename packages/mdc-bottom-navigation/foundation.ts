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

  private lastScrollY_ = this.adapter_.getViewportScrollY();

  private currentPositionY_ = 0;

  private animatingPositionY_ = 0;

  private animationKey_: number | null = null;

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
    const currentY = this.currentPositionY_;
    const scrollY = this.adapter_.getViewportScrollY();

    this.setCurrentPositionY_(currentY + (scrollY - this.lastScrollY_));
    if (this.animationKey_ === null) {
      this.moveBottomNavigation_();
    }
    this.lastScrollY_ = scrollY;
  }

  private setCurrentPositionY_(y: number) {
    const height = this.adapter_.getHeight();
    if (y < 0) {
      this.currentPositionY_ = 0;
    } else if (height < y) {
      this.currentPositionY_ = height;
    } else {
      this.currentPositionY_ = y;
    }
  }

  private setAnimatingPositionY_(y: number, isUpDirection: boolean) {
    const currentY = this.currentPositionY_;
    if (y < 0) {
      this.animatingPositionY_ = 0;
    } else if (
        (isUpDirection && y < currentY) ||
        (!isUpDirection && currentY < y)
    ) {
      this.animatingPositionY_ = currentY;
    } else {
      this.animatingPositionY_ = y;
    }
  }

  private moveBottomNavigation_() {
    const currentY = this.currentPositionY_;
    const animatingY = this.animatingPositionY_;
    if (animatingY === currentY) {
      this.animationKey_ = null;
    } else {
      const isUpDirection = currentY < animatingY;
      this.setAnimatingPositionY_(
          animatingY + 4 * (isUpDirection ? -1 : 1),
          isUpDirection,
      );
      this.adapter_.setStyle(
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
