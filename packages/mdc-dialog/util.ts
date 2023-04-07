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

import {FocusOptions, FocusTrap} from '@material/dom/focus-trap';

export type MDCDialogFocusTrapFactory = (
    element: HTMLElement,
    options: FocusOptions,
    ) => FocusTrap;

export function createFocusTrapInstance(
    surfaceEl: HTMLElement,
    focusTrapFactory: MDCDialogFocusTrapFactory,
    initialFocusEl?: HTMLElement,
    ): FocusTrap {
  return focusTrapFactory(surfaceEl, {initialFocusEl});
}

export function isScrollable(el: HTMLElement|null): boolean {
  return el ? el.scrollHeight > el.offsetHeight : false;
}

/**
 * For scrollable content, returns true if the content has not been scrolled
 * (that is, the scroll content is as the "top"). This is used in full-screen
 * dialogs, where the scroll divider is expected only to appear once the
 * content has been scrolled "underneath" the header bar.
 */
export function isScrollAtTop(el: HTMLElement|null) {
  return el ? el.scrollTop === 0 : false;
}

/**
 * For scrollable content, returns true if the content has been scrolled all the
 * way to the bottom. This is used in full-screen dialogs, where the footer
 * scroll divider is expected only to appear when the content is "cut-off" by
 * the footer bar.
 */
export function isScrollAtBottom(el: HTMLElement|null) {
  return el ? Math.ceil(el.scrollHeight - el.scrollTop) === el.clientHeight :
              false;
}

export function areTopsMisaligned(els: HTMLElement[]): boolean {
  const tops = new Set();
  [].forEach.call(els, (el: HTMLElement) => tops.add(el.offsetTop));
  return tops.size > 1;
}
