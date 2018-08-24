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

const temporaryDrawerEl = document.querySelector('.mdc-drawer--temporary');
const persistentDrawerEl = document.querySelector('.mdc-drawer--persistent');

if (temporaryDrawerEl) {
  const MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
  const temporaryDrawer = new MDCTemporaryDrawer(temporaryDrawerEl);

  document.querySelector('#test-drawer-menu-button').addEventListener('click', () => {
    temporaryDrawer.open = !temporaryDrawer.open;
  });
}

if (persistentDrawerEl) {
  const MDCPersistentDrawer = mdc.drawer.MDCPersistentDrawer;
  const persistentDrawer = new MDCPersistentDrawer(persistentDrawerEl);

  document.querySelector('#test-drawer-menu-button').addEventListener('click', () => {
    persistentDrawer.open = !persistentDrawer.open;
  });
}
