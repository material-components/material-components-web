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
import {MDCTextFieldHelperTextAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCTextFieldHelperTextFoundation extends MDCFoundation<MDCTextFieldHelperTextAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  /**
   * See {@link MDCTextFieldHelperTextAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCTextFieldHelperTextAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      getAttr: () => null,
      setAttr: () => undefined,
      removeAttr: () => undefined,
      setContent: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  constructor(adapter?: Partial<MDCTextFieldHelperTextAdapter>) {
    super({...MDCTextFieldHelperTextFoundation.defaultAdapter, ...adapter});
  }


  getId(): string|null {
    return this.adapter.getAttr('id');
  }

  isVisible(): boolean {
    return this.adapter.getAttr(strings.ARIA_HIDDEN) !== 'true';
  }

  /**
   * Sets the content of the helper text field.
   */
  setContent(content: string) {
    this.adapter.setContent(content);
  }

  isPersistent(): boolean {
    return this.adapter.hasClass(cssClasses.HELPER_TEXT_PERSISTENT);
  }

  /**
   * @param isPersistent Sets the persistency of the helper text.
   */
  setPersistent(isPersistent: boolean) {
    if (isPersistent) {
      this.adapter.addClass(cssClasses.HELPER_TEXT_PERSISTENT);
    } else {
      this.adapter.removeClass(cssClasses.HELPER_TEXT_PERSISTENT);
    }
  }

  /**
   * @return whether the helper text acts as an error validation message.
   */
  isValidation(): boolean {
    return this.adapter.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
  }

  /**
   * @param isValidation True to make the helper text act as an error validation message.
   */
  setValidation(isValidation: boolean) {
    if (isValidation) {
      this.adapter.addClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    } else {
      this.adapter.removeClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    }
  }

  /**
   * Makes the helper text visible to the screen reader.
   */
  showToScreenReader() {
    this.adapter.removeAttr(strings.ARIA_HIDDEN);
  }

  /**
   * Sets the validity of the helper text based on the input validity.
   */
  setValidity(inputIsValid: boolean) {
    const helperTextIsPersistent = this.adapter.hasClass(cssClasses.HELPER_TEXT_PERSISTENT);
    const helperTextIsValidationMsg = this.adapter.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    const validationMsgNeedsDisplay = helperTextIsValidationMsg && !inputIsValid;

    if (validationMsgNeedsDisplay) {
      this.showToScreenReader();
      // If role is already alert, refresh it to trigger another announcement
      // from screenreader.
      if (this.adapter.getAttr(strings.ROLE) === 'alert') {
        this.refreshAlertRole();
      } else {
        this.adapter.setAttr(strings.ROLE, 'alert');
      }
    } else {
      this.adapter.removeAttr(strings.ROLE);
    }

    if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
      this.hide();
    }
  }

  /**
   * Hides the help text from screen readers.
   */
  private hide() {
    this.adapter.setAttr(strings.ARIA_HIDDEN, 'true');
  }

  private refreshAlertRole() {
    this.adapter.removeAttr(strings.ROLE);
    requestAnimationFrame(() => {
      this.adapter.setAttr(strings.ROLE, 'alert');
    });
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTextFieldHelperTextFoundation;
