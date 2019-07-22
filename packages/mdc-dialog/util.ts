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

import {default as createFocusTrap, FocusTarget, FocusTrap, Options} from 'focus-trap';

export type MDCDialogFocusTrapFactory = (
    element: HTMLElement | string,
    userOptions?: Options,
) => FocusTrap;

/**
 * Creates a properly configured [focus-trap][] instance.
 * @param surfaceEl
 * @param focusTrapFactory
 * @param initialFocusEl
 */
export function createFocusTrapInstance(
    surfaceEl: HTMLElement,
    focusTrapFactory: MDCDialogFocusTrapFactory = createFocusTrap as unknown as MDCDialogFocusTrapFactory,
    initialFocusEl?: FocusTarget,
): FocusTrap {
  return focusTrapFactory(surfaceEl, {
    clickOutsideDeactivates: true, // Allow handling of scrim clicks.
    escapeDeactivates: false, // Foundation handles ESC key.
    initialFocus: initialFocusEl,
  });
}

/**
 * Determines if the given element is scrollable.
 * @param el
 */
export function isScrollable(el: HTMLElement | null): boolean {
  return el ? el.scrollHeight > el.offsetHeight : false;
}

/**
 * Determines if two or more of the given elements have different `offsetTop` values.
 * @param els
 */
export function areTopsMisaligned(els: HTMLElement[]): boolean {
  const tops = new Set();
  [].forEach.call(els, (el: HTMLElement) => tops.add(el.offsetTop));
  return tops.size > 1;
}
