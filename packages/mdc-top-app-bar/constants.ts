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

const cssClasses = {
  DENSE: 'mdc-top-app-bar--dense',
  DENSE_FIXED_ADJUST: 'mdc-top-app-bar--dense-fixed-adjust',
  DENSE_PROMINENT_FIXED_ADJUST: 'mdc-top-app-bar--dense-prominent-fixed-adjust',
  FIXED: 'mdc-top-app-bar--fixed',
  FIXED_ADJUST: 'mdc-top-app-bar--fixed-adjust',
  FIXED_SCROLLED: 'mdc-top-app-bar--fixed-scrolled',
  PROMINENT: 'mdc-top-app-bar--prominent',
  PROMINENT_FIXED_ADJUST: 'mdc-top-app-bar--prominent-fixed-adjust',
  ROOT: 'mdc-top-app-bar',
  SHORT: 'mdc-top-app-bar--short',
  SHORT_COLLAPSED: 'mdc-top-app-bar--short-collapsed',
  SHORT_FIXED_ADJUST: 'mdc-top-app-bar--short-fixed-adjust',
  SHORT_HAS_ACTION_ITEM: 'mdc-top-app-bar--short-has-action-item',
};

const numbers = {
  DEBOUNCE_THROTTLE_RESIZE_TIME_MS: 100,
  MAX_TOP_APP_BAR_HEIGHT: 128,
};

const strings = {
  ACTION_ITEM_SELECTOR: '.mdc-top-app-bar__action-item',
  NAVIGATION_EVENT: 'MDCTopAppBar:nav',
  NAVIGATION_ICON_SELECTOR: '.mdc-top-app-bar__navigation-icon',
  ROOT_SELECTOR: '.mdc-top-app-bar',
  TITLE_SELECTOR: '.mdc-top-app-bar__title',
};

export {cssClasses, numbers, strings};
