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

import MDCFoundation from '@material/base/foundation';
/* eslint-disable no-unused-vars */
import {MDCSelectAdapter, FoundationMapType} from './adapter';
import {MDCSelectIconFoundation} from './icon/index';
import {MDCSelectHelperTextFoundation} from './helper-text/index';
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
      floatLabel: (/* value: boolean */) => {},
      getLabelWidth: () => {},
      hasOutline: () => false,
      notchOutline: (/* labelWidth: number, */) => {},
      closeOutline: () => {},
      openMenu: () => {},
      closeMenu: () => {},
      isMenuOpen: () => {},
      setSelectedIndex: () => {},
      setDisabled: () => {},
      setRippleCenter: () => {},
      notifyChange: () => {},
      checkValidity: () => {},
      setValid: () => {},
    });
  }

  /**
   * @param {!MDCSelectAdapter} adapter
   * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter, foundationMap = /** @type {!FoundationMapType} */ ({})) {
    super(Object.assign(MDCSelectFoundation.defaultAdapter, adapter));

    /** @type {!MDCSelectIconFoundation|undefined} */
    this.leadingIcon_ = foundationMap.leadingIcon;
    /** @type {!MDCSelectHelperTextFoundation|undefined} */
    this.helperText_ = foundationMap.helperText;
  }

  setSelectedIndex(index) {
    this.adapter_.setSelectedIndex(index);
    this.adapter_.closeMenu();
    const didChange = true;
    this.handleChange(didChange);
  }

  setValue(value) {
    this.adapter_.setValue(value);
    const didChange = true;
    this.handleChange(didChange);
  }

  getValue() {
    return this.adapter_.getValue();
  }

  setDisabled(isDisabled) {
    isDisabled ? this.adapter_.addClass(cssClasses.DISABLED) : this.adapter_.removeClass(cssClasses.DISABLED);
    this.adapter_.setDisabled(isDisabled);
    this.adapter_.closeMenu();

    if (this.leadingIcon_) {
      this.leadingIcon_.setDisabled(isDisabled);
    }
  }

  /**
   * @param {string} content Sets the content of the helper text.
   */
  setHelperTextContent(content) {
    if (this.helperText_) {
      this.helperText_.setContent(content);
    }
  }

  layout() {
    const openNotch = this.getValue().length > 0;
    this.notchOutline(openNotch);
  }

  /**
   * Handles value changes, via change event or programmatic updates.
   */
  handleChange(didChange = true) {
    const value = this.getValue();
    const optionHasValue = value.length > 0;
    const isRequired = this.adapter_.hasClass(cssClasses.REQUIRED);

    this.notchOutline(optionHasValue);

    if (!this.adapter_.hasClass(cssClasses.FOCUSED)) {
      this.adapter_.floatLabel(optionHasValue);
    }

    if (didChange) {
      this.adapter_.notifyChange(value);

      if (isRequired) {
        this.setValid(this.isValid());
        if (this.helperText_) {
          this.helperText_.setValidity(this.isValid());
        }
      }
    }
  }

  /**
   * Handles focus events from select element.
   */
  handleFocus() {
    this.adapter_.addClass(cssClasses.FOCUSED);
    this.adapter_.floatLabel(true);
    this.notchOutline(true);
    this.adapter_.activateBottomLine();
    if (this.helperText_) {
      this.helperText_.showToScreenReader();
    }
  }

  /**
   * Handles blur events from select element.
   */
  handleBlur() {
    if (this.adapter_.isMenuOpen()) return;
    this.adapter_.removeClass(cssClasses.FOCUSED);
    this.handleChange(false);
    this.adapter_.deactivateBottomLine();

    const isRequired = this.adapter_.hasClass(cssClasses.REQUIRED);

    if (isRequired) {
      this.setValid(this.isValid());
      if (this.helperText_) {
        this.helperText_.setValidity(this.isValid());
      }
    }
  }

  handleClick(normalizedX) {
    if (this.adapter_.isMenuOpen()) return;
    this.adapter_.setRippleCenter(normalizedX);

    this.adapter_.openMenu();
  }

  handleKeydown(event) {
    if (this.adapter_.isMenuOpen()) return;

    const isEnter = event.key === 'Enter' || event.keyCode === 13;
    const isSpace = event.key === 'Space' || event.keyCode === 32;
    const arrowUp = event.key === 'ArrowUp' || event.keyCode === 38;
    const arrowDown = event.key === 'ArrowDown' || event.keyCode === 40;

    if (this.adapter_.hasClass(cssClasses.FOCUSED) && (isEnter || isSpace || arrowUp || arrowDown)) {
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
    const isFocused = this.adapter_.hasClass(cssClasses.FOCUSED);

    if (openNotch) {
      const labelScale = numbers.LABEL_SCALE;
      const labelWidth = this.adapter_.getLabelWidth() * labelScale;
      this.adapter_.notchOutline(labelWidth);
    } else if (!isFocused) {
      this.adapter_.closeOutline();
    }
  }

  /**
   * Sets the aria label of the leading icon.
   * @param {string} label
   */
  setLeadingIconAriaLabel(label) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   * @param {string} content
   */
  setLeadingIconContent(content) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setContent(content);
    }
  }

  setValid(isValid) {
    this.adapter_.setValid(isValid);
  }

  isValid() {
    return this.adapter_.checkValidity();
  }
}

export default MDCSelectFoundation;
