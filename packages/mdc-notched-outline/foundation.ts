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

import {MDCFoundation} from '@material/base/foundation';
import {MDCNotchedOutlineAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';

export class MDCNotchedOutlineFoundation extends MDCFoundation<MDCNotchedOutlineAdapter> {
  static get strings() {
    return strings;
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get numbers() {
    return numbers;
  }

  /**
   * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCNotchedOutlineAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      setNotchWidthProperty: () => undefined,
      removeNotchWidthProperty: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  constructor(adapter?: Partial<MDCNotchedOutlineAdapter>) {
    super({...MDCNotchedOutlineFoundation.defaultAdapter, ...adapter});
  }

  /**
   * Adds the `mdc-notched-outline--notched` class and updates the notch element's style based on `notchWidth`.
   */
  notch(notchWidth: number) {
    const {OUTLINE_NOTCHED} = MDCNotchedOutlineFoundation.cssClasses;

    if (notchWidth > 0) {
      notchWidth += numbers.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
    }

    this.adapter_.setNotchWidthProperty(notchWidth);
    this.adapter_.addClass(OUTLINE_NOTCHED);
  }

  /**
   * Removes the `mdc-notched-outline--notched` class.
   */
  closeNotch() {
    const {OUTLINE_NOTCHED} = MDCNotchedOutlineFoundation.cssClasses;
    this.adapter_.removeClass(OUTLINE_NOTCHED);
    this.adapter_.removeNotchWidthProperty();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCNotchedOutlineFoundation;
