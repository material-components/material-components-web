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

import MDCFoundation from '@material/base/foundation';
import MDCTabIndicatorAdapter from './adapter';
import {
  cssClasses,
  strings,
} from './constants';

/**
 * @extends {MDCFoundation<!MDCTabIndicatorAdapter>}
 * @abstract
 */
class MDCTabIndicatorFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * @see MDCTabIndicatorAdapter for typing information
   * @return {!MDCTabIndicatorAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabIndicatorAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      computeContentClientRect: () => {},
      setContentStyleProperty: () => {},
    });
  }

  /** @param {!MDCTabIndicatorAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCTabIndicatorFoundation.defaultAdapter, adapter));
  }

  /** @return {!ClientRect} */
  computeContentClientRect() {
    return this.adapter_.computeContentClientRect();
  }

  /**
   * Activates the indicator
   * @param {!ClientRect=} previousIndicatorClientRect
   * @abstract
   */
  activate(previousIndicatorClientRect) {} // eslint-disable-line no-unused-vars

  /** @abstract */
  deactivate() {}
}

export default MDCTabIndicatorFoundation;
