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
  STACKED: 'mdc-dialog--stacked',
  SCROLLABLE: 'mdc-dialog--scrollable',
  SCRIM: 'mdc-dialog__scrim',
  CONTENT: 'mdc-dialog__content',
  BUTTON: 'mdc-dialog__button',
  SCROLL_LOCK: 'mdc-dialog-scroll-lock',
};

const strings = {
  OPEN_DIALOG_SELECTOR: '.mdc-dialog--open',
  CONTAINER_SELECTOR: '.mdc-dialog__container',
  CONTENT_SELECTOR: '.mdc-dialog__content',

  YES_EVENT: 'MDCDialog:yes',
  NO_EVENT: 'MDCDialog:no',
  CANCEL_EVENT: 'MDCDialog:cancel',

  OPENING_EVENT: 'MDCDialog:opening',
  OPENED_EVENT: 'MDCDialog:opened',
  CLOSING_EVENT: 'MDCDialog:closing',
  CLOSED_EVENT: 'MDCDialog:closed',

  ACTION_ATTRIBUTE: 'data-mdc-dialog-action',
};

const numbers = {
  DIALOG_ANIMATION_TIME_MS: 120,
};

export {cssClasses, strings, numbers};
