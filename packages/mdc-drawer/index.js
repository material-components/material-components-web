/**
 * @license
 * Copyright 2016 Google Inc.
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
import {MDCComponent} from '@material/base/index';
import MDCDismissibleDrawerFoundation from './dismissible/foundation';
import {strings} from './constants';

/**
 * @extends {MDCComponent<!MDCDismissibleDrawerFoundation>}
 * @final
 */
export class MDCDrawer extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /** @private {?Element} */
    this.appContent_;
    /** @private {?Function} */
    this.handleKeydown_;
    /** @private {?Function} */
    this.handleTransitionEnd_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCDrawer}
   */
  static attachTo(root) {
    return new MDCDrawer(root);
  }

  initialize() {
    const appContent = this.root_.parentElement.querySelector(
      MDCDismissibleDrawerFoundation.strings.APP_CONTENT_SELECTOR);
    if (appContent) {
      this.appContent_= appContent;
    }
  }

  /**
   * Returns true if drawer is in the open position.
   * @return {boolean}
   */
  get open() {
    return this.foundation_.isOpen();
  }

  /**
   * Toggles the drawer open and closed.
   * @param {boolean} isOpen
   */
  set open(isOpen) {
    if (isOpen) {
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  initialSyncWithDOM() {
    this.handleKeydown_ = this.foundation_.handleKeydown.bind(this.foundation_);
    this.handleTransitionEnd_ = this.foundation_.handleTransitionEnd.bind(this.foundation_);
    document.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  getDefaultFoundation() {
    /** @type {!MDCDrawerAdapter} */
    const adapter = /** @type {!MDCDrawerAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setStyleAppContent: (propertyName, value) => {
        if (this.appContent_) {
          return this.appContent_.style.setProperty(propertyName, value);
        }
      },
      computeBoundingRect: () => this.root_.getBoundingClientRect(),
      addClassAppContent: (className) => {
        if (this.appContent_) {
          this.appContent_.classList.add(className);
        }
      },
      removeClassAppContent: (className) => {
        if (this.appContent_) {
          this.appContent_.classList.remove(className);
        }
      },
      isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      notifyClose: () => this.emit(strings.CLOSE_EVENT, null, true /* shouldBubble */),
      notifyOpen: () => this.emit(strings.OPEN_EVENT, null, true /* shouldBubble */),
    }));

    if (this.root_.classList.contains(MDCDismissibleDrawerFoundation.cssClasses.DISMISSIBLE)) {
      return new MDCDismissibleDrawerFoundation(adapter);
    }
  }
}
