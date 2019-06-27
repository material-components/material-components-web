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

import {DefaultFocusState} from '../../../../packages/mdc-menu/constants';

window.mdc.testFixture.fontsLoaded.then(() => {
  const buttonEl = document.querySelector('.test-menu-button');
  const menuEl = document.querySelector('.mdc-menu');
  const multipleSelectionGroupMenuEl = document.getElementById('test-multiple-selection-group-menu');
  const menu = mdc.menu.MDCMenu.attachTo(menuEl);
  menu.setAnchorCorner(mdc.menu.Corner.BOTTOM_LEFT);
  menu.open = true;

  buttonEl.addEventListener('click', () => {
    menu.setDefaultFocusState(DefaultFocusState.LIST_ROOT);
    menu.open = !menu.open;
  });

  buttonEl.addEventListener('keydown', (evt) => {
    const arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;
    const isSpace = evt.key === 'Space' || evt.keyCode === 32;

    if (isSpace || isEnter || arrowDown) {
      evt.preventDefault();
      menu.setDefaultFocusState(DefaultFocusState.FIRST_ITEM);
      menu.open = !menu.open;
    } else if (arrowUp) {
      evt.preventDefault();
      menu.setDefaultFocusState(DefaultFocusState.LAST_ITEM);
      menu.open = !menu.open;
    }
  });
  if (multipleSelectionGroupMenuEl) {
    menu.setSelectedIndex(3);
    menu.setSelectedIndex(5);
  }

  window.mdc.testFixture.notifyDomReady();
});
