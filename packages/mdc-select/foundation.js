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
      setValue: () => {},
      getValue: () => {},
      isRtl: () => false,
      floatLabel: (/* value: boolean */) => {},
      getLabelWidth: () => {},
      hasOutline: () => false,
      notchOutline: (/* labelWidth: number, isRtl: boolean */) => {},
      closeOutline: () => {},
      openMenu: () => {},
      closeMenu: () => {},
      isMenuOpened: () => {},
      setSelectedIndex: () => {},
      setDisabled: () => {},
      setRippleCenter: () => {},
    });
  }

  /**
   * @param {!MDCSelectAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));
  }

  setSelectedIndex(index) {
    this.adapter_.setSelectedIndex(index);
    this.adapter_.closeMenu();
    this.handleChange();
  }

  setValue(value) {
    this.adapter_.setValue(value);
    this.handleChange();
  }

  getValue() {
    return this.adapter_.getValue();
  }

  setDisabled(isDisabled) {
    this.adapter_.setDisabled(isDisabled);
    this.adapter_.closeMenu();
    this.updateDisabledStyle(isDisabled);
  }

  layout() {
    const openNotch = this.adapter_.getValue().length > 0;
    this.notchOutline(openNotch);
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
   * Handles focus events from select element.
   */
  handleFocus() {
    if (this.adapter_.isMenuOpened()) return;
    this.adapter_.addClass(cssClasses.FOCUSED);
    this.adapter_.floatLabel(true);
    this.notchOutline(true);
    this.adapter_.addClass('mdc-select--focused');
    this.adapter_.activateBottomLine();
    this.adapter_.openMenu();
  }

  /**
   * Handles blur events from select element.
   */
  handleBlur() {
    if (this.adapter_.isMenuOpened()) return;
    this.adapter_.removeClass(cssClasses.FOCUSED);
    this.handleChange();
    this.adapter_.removeClass('mdc-select--focused');
    this.adapter_.deactivateBottomLine();
  }

  handleClick(normalizedX) {
    if (this.adapter_.isMenuOpened()) return;
    this.adapter_.setRippleCenter(normalizedX);

    if (this.adapter_.hasClass(cssClasses.FOCUSED)) {
      this.adapter_.openMenu();
    }
  }

  handleKeydown(event) {
    if (this.adapter_.isMenuOpened()) return;

    const isEnter = event.key === 'Enter' || event.keyCode === 13;
    const isSpace = event.key === 'Space' || event.keyCode === 32;

    if (this.adapter_.hasClass(cssClasses.FOCUSED) && (isEnter || isSpace)) {
      this.adapter_.openMenu();
      event.preventDefault();
    }
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
