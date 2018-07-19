/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Computes the height of browser-rendered horizontal scrollbars, given an element to test with.
 * May return 0 (e.g. on OS X browsers under default configuration).
 * @param {!Element} el
 * @return {number}
 */
function computeHorizontalScrollbarHeight(el) {
  return el.offsetHeight - el.clientHeight;
}

/**
 * Applies an inline style to an element to hide its horizontal scrollbar.
 * @param {!Element} el
 */
function hideHorizontalScrollbar(el) {
  el.style.marginBottom = -computeHorizontalScrollbarHeight(el) + 'px';
}

export {computeHorizontalScrollbarHeight, hideHorizontalScrollbar};
