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

export const cssClasses = {
  ROOT: 'mdc-snackbar',
  TEXT: 'mdc-snackbar__text',
  ACTION_WRAPPER: 'mdc-snackbar__action-wrapper',
  ACTION_BUTTON: 'mdc-snackbar__action-button',
  OPEN: 'mdc-snackbar--open',
  CLOSING: 'mdc-snackbar--closing',
  MULTILINE: 'mdc-snackbar--multiline',
  ACTION_ON_BOTTOM: 'mdc-snackbar--action-on-bottom',
};

export const strings = {
  CONTAINER_SELECTOR: '.mdc-snackbar__surface',
  LABEL_SELECTOR: '.mdc-snackbar__label',
  ACTION_WRAPPER_SELECTOR: '.mdc-snackbar__actions',
  ACTION_BUTTON_SELECTOR: '.mdc-snackbar__action-button',
  LABEL_TEXT_ATTR: 'data-mdc-snackbar-label-text',
  OPENING_EVENT: 'MDCSnackbar:opening',
  OPENED_EVENT: 'MDCSnackbar:opened',
  CLOSING_EVENT: 'MDCSnackbar:closing',
  CLOSED_EVENT: 'MDCSnackbar:closed',
  REASON_ESCAPE: 'escape',
  REASON_ACTION: 'action',
  REASON_SURFACE: 'surface',
  REASON_TIMEOUT: 'timeout',
  REASON_PROGRAMMATIC: 'programmatic',
};

export const numbers = {
  MIN_AUTO_DISMISS_TIMEOUT_MS: 4000,
  MAX_AUTO_DISMISS_TIMEOUT_MS: 10000,
  DEFAULT_AUTO_DISMISS_TIMEOUT_MS: 5000,

  /**
   * Number of milliseconds to wait between temporarily clearing the label text
   * in the DOM and subsequently restoring it. This is necessary to force NVDA
   * to pick up the `aria-live` content change and announce it to the user.
   * Most browsers only need a ~5 millisecond delay, but IE 11 requires
   * at least 200ms to detect the DOM mutation.
   */
  ARIA_LIVE_DELAY_MS: 200,
};
