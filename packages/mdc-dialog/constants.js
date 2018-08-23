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

const cssClasses = {
  ROOT: 'mdc-dialog',
  OPEN: 'mdc-dialog--open',
  ANIMATING: 'mdc-dialog--animating',
  BACKDROP: 'mdc-dialog__scrim',
  SCROLL_LOCK: 'mdc-dialog-scroll-lock',
};

const strings = {
  OPEN_DIALOG_SELECTOR: '.mdc-dialog--open',
  DIALOG_SURFACE_SELECTOR: '.mdc-dialog__container',

  YES_BTN_SELECTOR: '[data-mdc-dialog-action="yes"]',
  NO_BTN_SELECTOR: '[data-mdc-dialog-action="no"]',
  CANCEL_BTN_SELECTOR: '[data-mdc-dialog-action="cancel"]',

  YES_EVENT: 'MDCDialog:yes',
  NO_EVENT: 'MDCDialog:no',
  CANCEL_EVENT: 'MDCDialog:cancel',

  OPEN_START_EVENT: 'MDCDialog:openStart',
  OPEN_END_EVENT: 'MDCDialog:openEnd',
  CLOSE_START_EVENT: 'MDCDialog:closeStart',
  CLOSE_END_EVENT: 'MDCDialog:closeEnd',
};

const numbers = {
  DIALOG_ANIMATION_TIME_MS: 120,
};

export {cssClasses, strings, numbers};
