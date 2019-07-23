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

import {MDCFoundation} from '@material/base/foundation';
import {MDCSelectAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';
import {MDCSelectHelperTextFoundation} from './helper-text/foundation';
import {MDCSelectIconFoundation} from './icon/foundation';
import {MDCSelectFoundationMap} from './types';

export class MDCSelectFoundation extends MDCFoundation<MDCSelectAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get numbers() {
    return numbers;
  }

  static get strings() {
    return strings;
  }

  /**
   * See {@link MDCSelectAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCSelectAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      activateBottomLine: () => undefined,
      deactivateBottomLine: () => undefined,
      setValue: () => undefined,
      getValue: () => '',
      floatLabel: () => undefined,
      getLabelWidth: () => 0,
      hasOutline: () => false,
      notchOutline: () => undefined,
      closeOutline: () => undefined,
      openMenu: () => undefined,
      closeMenu: () => undefined,
      isMenuOpen: () => false,
      setSelectedIndex: () => undefined,
      setDisabled: () => undefined,
      setRippleCenter: () => undefined,
      notifyChange: () => undefined,
      checkValidity: () => false,
      setValid: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private readonly leadingIcon_: MDCSelectIconFoundation | undefined;
  private readonly helperText_: MDCSelectHelperTextFoundation | undefined;

  /* istanbul ignore next: optional argument is not a branch statement */
  /**
   * @param adapter
   * @param foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter?: Partial<MDCSelectAdapter>, foundationMap: Partial<MDCSelectFoundationMap> = {}) {
    super({...MDCSelectFoundation.defaultAdapter, ...adapter});

    this.leadingIcon_ = foundationMap.leadingIcon;
    this.helperText_ = foundationMap.helperText;
  }

  /**
   * Handles setting the `mdc-select__selected-text` element and closing the menu
   * (enhanced select only). Also causes the label to float and outline to notch if needed.
   * @param index
   */
  setSelectedIndex(index: number) {
    this.adapter_.setSelectedIndex(index);
    this.adapter_.closeMenu();
    const didChange = true;
    this.handleChange(didChange);
  }

  /**
   * Handles setting the value through the adapter and causes the label to float and outline to notch if needed.
   * @param value
   */
  setValue(value: string) {
    this.adapter_.setValue(value);
    const didChange = true;
    this.handleChange(didChange);
  }

  /**
   * Handles getting the value through the adapter.
   */
  getValue() {
    return this.adapter_.getValue();
  }

  /**
   * Updates appearance based on disabled state. This must be called whenever the `disabled` state changes.
   * @param isDisabled
   */
  setDisabled(isDisabled: boolean) {
    if (isDisabled) {
      this.adapter_.addClass(cssClasses.DISABLED);
    } else {
      this.adapter_.removeClass(cssClasses.DISABLED);
    }
    this.adapter_.setDisabled(isDisabled);
    this.adapter_.closeMenu();

    if (this.leadingIcon_) {
      this.leadingIcon_.setDisabled(isDisabled);
    }
  }

  /**
   * Sets the content of the helper text.
   * @param content Sets the content of the helper text.
   */
  setHelperTextContent(content: string) {
    if (this.helperText_) {
      this.helperText_.setContent(content);
    }
  }

  /**
   * Handles determining if the notched outline should be notched.
   */
  layout() {
    const openNotch = this.getValue().length > 0;
    this.notchOutline(openNotch);
  }

  /**
   * Handles menu or menu surface opened event.
   */
  handleMenuOpened() {
    this.adapter_.addClass(cssClasses.ACTIVATED);
  }

  /**
   * Handles menu or menu surface closed event.
   */
  handleMenuClosed() {
    this.adapter_.removeClass(cssClasses.ACTIVATED);
  }

  /**
   * Handles a change to the `select` element's value. This must be called both for `change`
   * events and programmatic changes requested via the component API.
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
   * Handles a focus event on the `select` element.
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
   * Handles a blur event on the `select` element.
   */
  handleBlur() {
    if (this.adapter_.isMenuOpen()) {
      return;
    }
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

  /**
   * Sets the line ripple center to the normalizedX for the line ripple.
   * @param normalizedX
   */
  handleClick(normalizedX: number) {
    if (this.adapter_.isMenuOpen()) {
      return;
    }
    this.adapter_.setRippleCenter(normalizedX);

    this.adapter_.openMenu();
  }

  /**
   * Handles opening the menu (enhanced select) when the `mdc-select__selected-text`
   * element is focused and the user presses the `Enter` or `Space` key.
   * @param event
   */
  handleKeydown(event: KeyboardEvent) {
    if (this.adapter_.isMenuOpen()) {
      return;
    }

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
   */
  notchOutline(openNotch: boolean) {
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
   */
  setLeadingIconAriaLabel(label: string) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setAriaLabel(label);
    }
  }

  /**
   * Sets the text content of the leading icon.
   */
  setLeadingIconContent(content: string) {
    if (this.leadingIcon_) {
      this.leadingIcon_.setContent(content);
    }
  }

  /**
   * Sets the valid state through the adapter.
   * @param isValid
   */
  setValid(isValid: boolean) {
    this.adapter_.setValid(isValid);
  }

  /**
   * Gets the valid state through the adapter's `checkValidity` API.
   */
  isValid() {
    return this.adapter_.checkValidity();
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSelectFoundation;
