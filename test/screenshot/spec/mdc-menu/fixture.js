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

window.mdc.testFixture.fontsLoaded.then(() => {
  const buttonEl = document.querySelector('.test-menu-button');
  const menuEl = document.querySelector('.mdc-menu');
  const menu = mdc.menu.MDCMenu.attachTo(menuEl);
  menu.setAnchorCorner(mdc.menu.Corner.BOTTOM_LEFT);
  menu.open = true;

  buttonEl.addEventListener('click', () => {
    menu.setDefaultFocusItemIndex(mdc.menu.MDCMenuFoundation.numbers.FOCUS_ROOT_INDEX);
    menu.open = !menu.open;
  });

  buttonEl.addEventListener('keydown', (evt) => {
    const arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
    const arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;
    const isSpace = evt.key === 'Space' || evt.keyCode === 32;

    if (arrowUp || arrowDown || isEnter || isSpace) {
      evt.preventDefault();
    } else {
      return;
    }

    if (isSpace) {
      menu.setDefaultFocusItemIndex(0);
    } else if (isEnter) {
      menu.setDefaultFocusItemIndex(0);
    } else if (arrowDown) {
      menu.setDefaultFocusItemIndex(0);
    } else if (arrowUp) {
      menu.setDefaultFocusItemIndex(menu.items.length - 1);
    }

    menu.open = !menu.open;
  });

  window.mdc.testFixture.notifyDomReady();
});
