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

import createFocusTrap from 'focus-trap';
import {matches} from '@material/base/ponyfill';

/**
 * @param {!HTMLElement} surfaceEl
 * @param {?HTMLElement=} initialFocusEl
 * @param {function(!HTMLElement, !FocusTrapCreateOptions): !focusTrap} focusTrapFactory
 * @return {!focusTrap}
 */
export function createFocusTrapInstance(surfaceEl, initialFocusEl = null, focusTrapFactory = createFocusTrap) {
  return focusTrapFactory(surfaceEl, {
    initialFocus: initialFocusEl || getFirstFocusableElement(surfaceEl),
    clickOutsideDeactivates: true,
  });
}

/**
 * TODO(acdvorak): Add unit test for this?
 * See https://allyjs.io/data-tables/focusable.html
 * @param {!HTMLElement} surfaceEl
 * @return {!HTMLElement|undefined}
 */
function getFirstFocusableElement(surfaceEl) {
  const includeSelectors = [
    'a',
    'button',
    'input',
    'select',
    'summary',
    'textarea',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]',
    '[tabIndex]',
  ];

  const excludeSelectors = [
    'input[type="radio"]',
    'input[type="checkbox"]',
    'input[type="hidden"]',
    '[disabled]',
    '[tabIndex="-1"]',
  ];

  const isExcluded = (el) => {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.01) {
      return true;
    }

    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return true;
    }

    if (excludeSelectors.some((excludeSelector) => matches(el, excludeSelector))) {
      return true;
    }

    return false;
  };

  /** @type {!Array<!HTMLElement>} */
  const includedEls = [].slice.call(surfaceEl.querySelectorAll(includeSelectors.join(', ')));

  const focusableEls = includedEls.filter((el) => {
    while (el) {
      if (isExcluded(el)) {
        return false;
      }
      el = el.parentElement;
    }
    return true;
  });

  const autoFocusEls = focusableEls.filter((el) => {
    return el.autofocus;
  });

  return autoFocusEls[0] || focusableEls[0];
}

