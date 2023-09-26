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

import {MDCRipplePoint} from './types';

/**
 * Stores result from supportsCssVariables to avoid redundant processing to
 * detect CSS custom variable support.
 */
let supportsCssVariablesCache: boolean|undefined;

/** Checks if the window supports CSS Variables */
export function supportsCssVariables(
    windowObj: typeof globalThis, forceRefresh = false): boolean {
  const {CSS} = windowObj;
  let supportsCssVars = supportsCssVariablesCache;
  if (typeof supportsCssVariablesCache === 'boolean' && !forceRefresh) {
    return supportsCssVariablesCache;
  }

  const supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
  if (!supportsFunctionPresent) {
    return false;
  }

  const explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
  // See: https://bugs.webkit.org/show_bug.cgi?id=154669
  // See: README section on Safari
  const weAreFeatureDetectingSafari10plus =
      (CSS.supports('(--css-vars: yes)') && CSS.supports('color', '#00000000'));

  supportsCssVars =
      explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;

  if (!forceRefresh) {
    supportsCssVariablesCache = supportsCssVars;
  }
  return supportsCssVars;
}

/** Gets the normalized events coordinates */
export function getNormalizedEventCoords(
    event: Event|undefined, pageOffset: MDCRipplePoint,
    clientRect: DOMRect): MDCRipplePoint {
  if (!event) {
    return {x: 0, y: 0};
  }
  const {x, y} = pageOffset;
  const documentX = x + clientRect.left;
  const documentY = y + clientRect.top;

  let normalizedX;
  let normalizedY;
  // Determine touch point relative to the ripple container.
  if (event.type === 'touchstart') {
    const touchEvent = event as TouchEvent;
    normalizedX = touchEvent.changedTouches[0].pageX - documentX;
    normalizedY = touchEvent.changedTouches[0].pageY - documentY;
  } else {
    const mouseEvent = event as MouseEvent;
    normalizedX = mouseEvent.pageX - documentX;
    normalizedY = mouseEvent.pageY - documentY;
  }

  return {x: normalizedX, y: normalizedY};
}
