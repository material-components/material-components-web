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

import {MDCFoundation} from '@material/base/foundation';
import {MDCSelectHelperTextAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCSelectHelperTextFoundation extends MDCFoundation<MDCSelectHelperTextAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  /**
   * See {@link MDCSelectHelperTextAdapter} for typing information on parameters and return types.
   */
  static get defaultAdapter(): MDCSelectHelperTextAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      setAttr: () => undefined,
      getAttr: () => null,
      removeAttr: () => undefined,
      setContent: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  constructor(adapter?: Partial<MDCSelectHelperTextAdapter>) {
    super({...MDCSelectHelperTextFoundation.defaultAdapter, ...adapter});
  }

  /**
   * @return The ID of the helper text, or null if none is set.
   */
  getId(): string|null {
    return this.adapter.getAttr('id');
  }

  /**
   * @return Whether the helper text is currently visible.
   */
  isVisible(): boolean {
    return this.adapter.getAttr(strings.ARIA_HIDDEN) !== 'true';
  }

  /**
   * Sets the content of the helper text field.
   */
  setContent(content: string) {
    this.adapter.setContent(content);
  }

  /**
   * Sets the helper text to act as a validation message.
   * By default, validation messages are hidden when the select is valid and
   * visible when the select is invalid.
   *
   * @param isValidation True to make the helper text act as an error validation
   *     message.
   */
  setValidation(isValidation: boolean) {
    if (isValidation) {
      this.adapter.addClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    } else {
      this.adapter.removeClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    }
  }

  /**
   * Sets the persistency of the validation helper text.
   * This keeps the validation message visible even if the select is valid,
   * though it will be displayed in the normal (grey) color.
   */
  setValidationMsgPersistent(isPersistent: boolean) {
    if (isPersistent) {
      this.adapter.addClass(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
    } else {
      this.adapter.removeClass(
          cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);
    }
  }

  /**
   * When acting as a validation message, shows/hides the helper text and
   * triggers alerts as necessary based on the select's validity.
   */
  setValidity(selectIsValid: boolean) {
    const isValidationMsg =
        this.adapter.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);

    if (!isValidationMsg) {
      // Non-validating helper-text is always displayed and does not participate
      // in validation logic.
      return;
    }

    const isPersistentValidationMsg =
        this.adapter.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG_PERSISTENT);

    // Validating helper text is displayed if select is invalid, unless it is
    // set as persistent, in which case it always displays.
    const msgShouldDisplay = !selectIsValid || isPersistentValidationMsg;
    if (msgShouldDisplay) {
      this.showToScreenReader();

      // In addition to displaying, also trigger an alert if the select
      // has become invalid.
      if (!selectIsValid) {
        this.adapter.setAttr(strings.ROLE, 'alert');
      } else {
        this.adapter.removeAttr(strings.ROLE);
      }
      return;
    }

    // Hide everything.
    this.adapter.removeAttr(strings.ROLE);
    this.hide();
  }

  /**
   * Makes the helper text visible to screen readers.
   */
  private showToScreenReader() {
    this.adapter.removeAttr(strings.ARIA_HIDDEN);
  }

  /**
   * Hides the help text from screen readers.
   */
  private hide() {
    this.adapter.setAttr(strings.ARIA_HIDDEN, 'true');
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSelectHelperTextFoundation;
