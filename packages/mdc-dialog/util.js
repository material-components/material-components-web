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
import {numbers} from './constants';

/** @type {boolean|undefined} */
let hasFlexItemMaxHeightBug_;

/**
 * @param {!HTMLElement} surfaceEl
 * @param {?HTMLElement=} initialFocusEl
 * @param {function(!HTMLElement, !FocusTrapCreateOptions): !focusTrap} focusTrapFactory
 * @return {!focusTrap}
 */
export function createFocusTrapInstance(surfaceEl, initialFocusEl = null, focusTrapFactory = createFocusTrap) {
  return focusTrapFactory(surfaceEl, {
    initialFocus: initialFocusEl,
    clickOutsideDeactivates: true,
  });
}

/**
 * IE 11 flexbox bug. `overflow: auto` is ignored on child flex items when their height exceeds the `max-height` of
 * their parent flex container. The child ends up overflowing the parent instead of respecting `max-height`.
 *
 * Example: https://user-images.githubusercontent.com/409245/44505719-c27ae680-a657-11e8-9a10-509f7131036d.png
 *
 * I have yet to find any combination of CSS properties that can convince IE 💩 to render the child correctly.
 * Resizing the browser window seems to "fix" the glitch, however, so JS might be a viable "plan B".
 *
 * The most effective workaround I've found is to force IE to recalculate the child's height.
 * To do that, you can toggle one of the following CSS property values on the child element:
 *   - `height: auto` to "" (empty string).
 *   - `flex-basis: auto` to "" (empty string).
 *   - `max-height: none` to "" (empty string).
 *
 * NOTE: Depending on IE's temperament, you might need to set the second value inside a `setTimeout()`. E.g.:
 *
 * ```js
 * childFlexItem.style.flexBasis = 'auto';
 * setTimeout(() => {
 *   childFlexItem.style.flexBasis = '';
 * });
 * ```
 *
 * For whatever reason, IE seems to render correctly after that.
 * Oh, except sometimes you need to do it more than once.
 * Running it 5 times, with 100ms in between each invocation, usually seems to do the trick.
 *
 * See https://github.com/philipwalton/flexbugs/issues/216 for more information.
 *
 * @return {boolean}
 */
export function hasFlexItemMaxHeightBug() {
  if (typeof hasFlexItemMaxHeightBug_ === 'undefined') {
    hasFlexItemMaxHeightBug_ = ignoresOverflowAutoOnFlexItemsThatExceedMaxHeight_();
  }
  return hasFlexItemMaxHeightBug_;
}

/**
 * @param {!HTMLElement} flexItemEl
 * @param {function(): undefined} callback
 */
export function fixFlexItemMaxHeightBug(flexItemEl, callback) {
  if (!hasFlexItemMaxHeightBug()) {
    return;
  }

  const setAndRevert = (el, prop, firstValue, secondValue) => {
    const oldValue = el.style[prop];
    el.style[prop] = el.style[prop] === firstValue ? secondValue : firstValue;
    el.style[prop] = oldValue;
  };

  const tick = () => {
    setAndRevert(flexItemEl, 'flex-basis', 'auto', '');
    setTimeout(() => {
      callback();
    });
  };

  for (let i = 0; i < numbers.IE_FLEX_OVERFLOW_BUG_ITERATIONS; i++) {
    setTimeout(() => tick(), i * numbers.IE_FLEX_OVERFLOW_BUG_INTERVAL_MS);
  }
}

/**
 * @param {!HTMLElement} el
 * @return {boolean}
 */
export function isScrollable(el) {
  return el.scrollHeight > el.offsetHeight;
}

/**
 * @param {!Array<!HTMLElement>|!NodeList} els
 * @return {boolean}
 */
export function areTopsAligned(els) {
  const tops = new Set();
  [].forEach.call(els, (el) => tops.add(el.offsetTop));
  return tops.size > 1;
}

/**
 * @return {boolean}
 * @private
 */
function ignoresOverflowAutoOnFlexItemsThatExceedMaxHeight_() {
  const tempEl = document.createElement('div');

  // The 1px borders are necessary to force IE to calculate box sizing correctly.
  tempEl.innerHTML = `
<section style="box-sizing: border-box; display: flex; flex-direction: column; max-height: 200px;
                opacity: 0.001; position: fixed; top: -9999px; left: -9999px;
                border: 1px solid transparent;">
  <header style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Header</header>
  <article style="box-sizing: border-box; flex-grow: 1; overflow: auto;
                  border: 1px solid transparent;">
    <div style="height: 500px"></div>
  </article>
  <footer style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Footer</footer>
<section>
`;

  document.body.appendChild(tempEl);

  /** @type {!HTMLElement} */
  const flexItemEl = tempEl.querySelector('article');
  const canScroll = isScrollable(flexItemEl);

  document.body.removeChild(tempEl);

  return !canScroll;
}
