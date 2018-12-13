/**
 * @license
 * Copyright 2017 Google Inc.
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

import MDCNotchedOutlineAdapter from './adapter';
import MDCNotchedOutlineFoundation from './foundation';
import {MDCFloatingLabelFoundation} from '@material/floating-label/index';
import {cssClasses, strings} from './constants';

/**
 * @extends {MDCComponent<!MDCNotchedOutlineFoundation>}
 * @final
 */
class MDCNotchedOutline extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCNotchedOutline}
   */
  static attachTo(root) {
    return new MDCNotchedOutline(root);
  }
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {Element} */
    this.notchElement_;
  }

  initialSyncWithDOM() {
    const label = this.root_.querySelector('.' + MDCFloatingLabelFoundation.cssClasses.ROOT);
    this.notchElement_ = this.root_.querySelector(strings.NOTCH_ELEMENT_SELECTOR);

    if (label) {
      label.style.transitionDuration = '0s';
      this.root_.classList.add(cssClasses.OUTLINE_UPGRADED);
      requestAnimationFrame(() => {
        label.style.transitionDuration = '';
      });
    } else {
      this.root_.classList.add(cssClasses.NO_LABEL);
    }
  }

  /**
    * Updates classes and styles to open the notch to the specified width.
    * @param {number} notchWidth The notch width in the outline.
    */
  notch(notchWidth) {
    this.foundation_.notch(notchWidth);
  }

  /**
   * Updates classes and styles to close the notch.
   */
  closeNotch() {
    this.foundation_.closeNotch();
  }

  /**
   * @return {!MDCNotchedOutlineFoundation}
   */
  getDefaultFoundation() {
    return new MDCNotchedOutlineFoundation(
      /** @type {!MDCNotchedOutlineAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        setNotchWidthProperty: (width) => this.notchElement_.style.setProperty('width', width + 'px'),
        removeNotchWidthProperty: () => this.notchElement_.style.removeProperty('width'),
      })));
  }
}

export {MDCNotchedOutline, MDCNotchedOutlineFoundation};
