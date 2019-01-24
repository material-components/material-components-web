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

import MDCComponent from '@material/base/component';
import {Corner, CornerBit, cssClasses, MenuPosition, strings} from './constants';
import {MDCMenuSurfaceFoundation} from './foundation';
import * as util from './util';

type RegisterFunction = () => void;

class MDCMenuSurface extends MDCComponent<MDCMenuSurfaceFoundation> {
  static attachTo(root: Element): MDCMenuSurface {
    return new MDCMenuSurface(root);
  }

  anchorElement!: Element | null;

  private previousFocus_!: HTMLElement | SVGElement | null;
  private firstFocusableElement_!: HTMLElement | SVGElement | null;
  private lastFocusableElement_!: HTMLElement | SVGElement | null;

  private handleKeydown_!: EventListener;
  private handleBodyClick_!: EventListener;
  private registerBodyClickListener_!: RegisterFunction;
  private deregisterBodyClickListener_!: RegisterFunction;

  get open(): boolean {
    return this.foundation_.isOpen();
  }

  set open(value: boolean) {
    if (value) {
      const focusableElements = this.root_.querySelectorAll<HTMLElement | SVGElement>(strings.FOCUSABLE_ELEMENTS);
      this.firstFocusableElement_ = focusableElements[0] || null;
      this.lastFocusableElement_ = focusableElements[focusableElements.length - 1] || null;
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  set quickOpen(quickOpen: boolean) {
    this.foundation_.setQuickOpen(quickOpen);
  }

  initialSyncWithDOM() {
    const parentEl = this.root_.parentElement;
    const hasParentAnchor = parentEl && parentEl.classList.contains(cssClasses.ANCHOR);

    this.anchorElement = hasParentAnchor ? parentEl : null;
    this.previousFocus_ = null;
    this.firstFocusableElement_ = null;
    this.lastFocusableElement_ = null;

    if (this.root_.classList.contains(cssClasses.FIXED)) {
      this.setFixedPosition(true);
    }

    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt as KeyboardEvent);
    this.handleBodyClick_ = (evt) => this.foundation_.handleBodyClick(evt as MouseEvent);

    this.registerBodyClickListener_ = () => document.body.addEventListener('click', this.handleBodyClick_);
    this.deregisterBodyClickListener_ = () => document.body.removeEventListener('click', this.handleBodyClick_);

    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener(strings.OPENED_EVENT, this.registerBodyClickListener_);
    this.root_.addEventListener(strings.CLOSED_EVENT, this.deregisterBodyClickListener_);
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener(strings.OPENED_EVENT, this.registerBodyClickListener_);
    this.root_.removeEventListener(strings.CLOSED_EVENT, this.deregisterBodyClickListener_);
    super.destroy();
  }

  /**
   * Removes the menu-surface from it's current location and appends it to the
   * body to overcome any overflow:hidden issues.
   */
  hoistMenuToBody() {
    document.body.appendChild(this.root_);
    this.setIsHoisted(true);
  }

  /** Sets the foundation to use page offsets for an positioning when the menu is hoisted to the body. */
  setIsHoisted(isHoisted: boolean) {
    this.foundation_.setIsHoisted(isHoisted);
  }

  /** Sets the element that the menu-surface is anchored to. */
  setMenuSurfaceAnchorElement(element: Element) {
    this.anchorElement = element;
  }

  /** Sets the menu-surface to position: fixed. */
  setFixedPosition(isFixed: boolean) {
    if (isFixed) {
      this.root_.classList.add(cssClasses.FIXED);
    } else {
      this.root_.classList.remove(cssClasses.FIXED);
    }

    this.foundation_.setFixedPosition(isFixed);
  }

  /** Sets the absolute x/y position to position based on. Requires the menu to be hoisted. */
  setAbsolutePosition(x: number, y: number) {
    this.foundation_.setAbsolutePosition(x, y);
    this.setIsHoisted(true);
  }

  /** @param corner Default anchor corner alignment of top-left surface corner. */
  setAnchorCorner(corner: Corner) {
    this.foundation_.setAnchorCorner(corner);
  }

  setAnchorMargin(margin: MenuPosition) {
    this.foundation_.setAnchorMargin(margin);
  }

  getDefaultFoundation(): MDCMenuSurfaceFoundation {
    const rootEl = this.root_ as HTMLElement;

    // tslint:disable:object-literal-sort-keys
    return new MDCMenuSurfaceFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      hasAnchor: () => !!this.anchorElement,
      notifyClose: () => this.emit(MDCMenuSurfaceFoundation.strings.CLOSED_EVENT, {}),
      notifyOpen: () => this.emit(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, {}),
      isElementInContainer: (el) => this.root_.contains(el),
      isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      setTransformOrigin: (origin) => {
        const propertyName = `${util.getTransformPropertyName(window)}-origin`;
        rootEl.style.setProperty(propertyName, origin);
      },

      isFocused: () => document.activeElement === rootEl,
      saveFocus: () => {
        this.previousFocus_ = document.activeElement as HTMLElement | SVGElement;
      },
      restoreFocus: () => {
        if (rootEl.contains(document.activeElement)) {
          if (this.previousFocus_ && this.previousFocus_.focus) {
            this.previousFocus_.focus();
          }
        }
      },
      isFirstElementFocused: () =>
          this.firstFocusableElement_ ? this.firstFocusableElement_ === document.activeElement : false,
      isLastElementFocused: () =>
          this.lastFocusableElement_ ? this.lastFocusableElement_ === document.activeElement : false,
      focusFirstElement: () =>
          this.firstFocusableElement_ && this.firstFocusableElement_.focus && this.firstFocusableElement_.focus(),
      focusLastElement: () =>
          this.lastFocusableElement_ && this.lastFocusableElement_.focus && this.lastFocusableElement_.focus(),

      getInnerDimensions: () => {
        return {width: rootEl.offsetWidth, height: rootEl.offsetHeight};
      },
      getAnchorDimensions: () => this.anchorElement ? this.anchorElement.getBoundingClientRect() : null,
      getWindowDimensions: () => {
        return {width: window.innerWidth, height: window.innerHeight};
      },
      getBodyDimensions: () => {
        return {width: document.body.clientWidth, height: document.body.clientHeight};
      },
      getWindowScroll: () => {
        return {x: window.pageXOffset, y: window.pageYOffset};
      },
      setPosition: (position) => {
        rootEl.style.left = 'left' in position ? `${position.left}px` : null;
        rootEl.style.right = 'right' in position ? `${position.right}px` : null;
        rootEl.style.top = 'top' in position ? `${position.top}px` : null;
        rootEl.style.bottom = 'bottom' in position ? `${position.bottom}px` : null;
      },
      setMaxHeight: (height) => {
        rootEl.style.maxHeight = height;
      },
    });
    // tslint:enable:object-literal-sort-keys
  }
}

export {MDCMenuSurfaceFoundation, MDCMenuSurface, MenuPosition, Corner, CornerBit, util};
