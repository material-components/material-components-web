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
/* eslint-disable no-unused-vars */
import {MDCIconButtonToggleAdapter, IconButtonToggleEvent} from './adapter';
import {cssClasses, strings} from './constants';

/**
 * @extends {MDCFoundation<!MDCIconButtonToggleAdapter>}
 */
class MDCIconButtonToggleFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      setAttr: () => {},
      notifyChange: () => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCIconButtonToggleFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.disabled_ = false;
  }

  init() {
    this.adapter_.setAttr(strings.ARIA_PRESSED, `${this.isOn()}`);
  }

  handleClick() {
    this.toggle();
    this.adapter_.notifyChange(/** @type {!IconButtonToggleEvent} */ ({isOn: this.isOn()}));
  }

  /** @return {boolean} */
  isOn() {
    return this.adapter_.hasClass(cssClasses.ICON_BUTTON_ON);
  }

  /** @param {boolean=} isOn */
  toggle(isOn = !this.isOn()) {
    if (isOn) {
      this.adapter_.addClass(cssClasses.ICON_BUTTON_ON);
    } else {
      this.adapter_.removeClass(cssClasses.ICON_BUTTON_ON);
    }

    this.adapter_.setAttr(strings.ARIA_PRESSED, `${isOn}`);
  }
}

/** @record */
class IconButtonToggleState {}

export default MDCIconButtonToggleFoundation;
