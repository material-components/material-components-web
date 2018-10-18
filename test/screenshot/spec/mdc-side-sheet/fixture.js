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

import {MDCDismissibleSideSheetFoundation} from '../../../../packages/mdc-side-sheet/index';
import * as ponyfill from '../../../../packages/mdc-dom/ponyfill';

window.mdc.testFixture.fontsLoaded.then(() => {
  const {DISMISSIBLE, MODAL} = MDCDismissibleSideSheetFoundation.cssClasses;
  const dismissibleSideSheetSelector = [DISMISSIBLE, MODAL].map((className) => `.${className}`).join(', ');
  const dismissibleSideSheetEl = document.querySelector(dismissibleSideSheetSelector);

  // Don't instantiate permanent side sheets
  if (!dismissibleSideSheetEl) {
    return;
  }

  /** @type {!MDCSideSheet} */
  const sideSheet = mdc.sideSheet.MDCSideSheet.attachTo(dismissibleSideSheetEl);

  document.addEventListener('click', (evt) => {
    const {target} = evt;
    if (ponyfill.closest(target, '.test-side-sheet-toggle-button')) {
      sideSheet.open = !sideSheet.open;
    }
  });

  window.mdc.testFixture.notifyDomReady();
});
