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

import {MDCFoundation} from '@material/base/index';
/* eslint-disable no-unused-vars */
import MDCSelectAdapter from './adapter';
/* eslint-enable no-unused-vars */
import {cssClasses, strings, numbers} from './constants';

/**
 * @extends {MDCFoundation<!MDCSelectAdapter>}
 * @final
 */
class MDCSelectFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCSelectAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCSelectAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCSelectAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => false,
      activateBottomLine: () => {},
      deactivateBottomLine: () => {},
      getValue: () => {},
      isRtl: () => false,
      hasLabel: () => false,
      floatLabel: (/* value: boolean */) => {},
      getLabelWidth: () => {},
      hasOutline: () => false,
      notchOutline: (/* labelWidth: number, isRtl: boolean */) => {},
      closeOutline: () => {},
    });
  }

  /**
   * @param {!MDCSelectAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));
  }

  /**
   * Updates the styles of the select to show the disasbled state.
   * @param {boolean} disabled
   */
  updateDisabledStyle(disabled) {
    const {DISABLED} = MDCSelectFoundation.cssClasses;
    if (disabled) {
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.removeClass(DISABLED);
    }
  }

  /**
   * Handles value changes, via change event or programmatic updates.
   */
  handleChange() {
    const optionHasValue = this.adapter_.getValue().length > 0;
    this.adapter_.floatLabel(optionHasValue);
    this.notchOutline(optionHasValue);
  }

  /**
   * Handles focus events from root element.
   */
  handleFocus() {
    this.adapter_.floatLabel(true);
    this.notchOutline(true);
    this.adapter_.activateBottomLine();
  }

  /**
   * Handles blur events from root element.
   */
  handleBlur() {
    this.handleChange();
    this.adapter_.deactivateBottomLine();
  }

  /**
   * Opens/closes the notched outline.
   * @param {boolean} openNotch
   */
  notchOutline(openNotch) {
    if (!this.adapter_.hasOutline()) {
      return;
    }

    if (openNotch) {
      const labelScale = numbers.LABEL_SCALE;
      const labelWidth = this.adapter_.getLabelWidth() * labelScale;
      const isRtl = this.adapter_.isRtl();
      this.adapter_.notchOutline(labelWidth, isRtl);
    } else {
      this.adapter_.closeOutline();
    }
  }
}

export default MDCSelectFoundation;
