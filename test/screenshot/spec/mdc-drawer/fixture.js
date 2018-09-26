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

import {MDCDismissibleDrawerFoundation} from '../../../../packages/mdc-drawer';

window.mdc.testFixture.fontsLoaded.then(() => {
  const {DISMISSIBLE, MODAL} = MDCDismissibleDrawerFoundation.cssClasses;
  const dismissibleDrawerSelector = [DISMISSIBLE, MODAL].map((className) => `.${className}`).join(', ');
  const dismissibleDrawerEl = document.querySelector(dismissibleDrawerSelector);

  // Don't instantiate permanent drawers
  if (!dismissibleDrawerEl) {
    const list = mdc.list.MDCList.attachTo(document.querySelector('.mdc-list'));
    list.wrapFocus = true;
    return;
  }

  /** @type {!MDCDrawer} */
  const drawer = mdc.drawer.MDCDrawer.attachTo(dismissibleDrawerEl);

  const menuButtonEl = document.querySelector('#test-drawer-menu-button');
  if (menuButtonEl) {
    menuButtonEl.addEventListener('click', () => {
      drawer.open = !drawer.open;
    });
  }

  window.mdc.testFixture.notifyDomReady();
});
