/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class MDCFeatureDetector {
  constructor() {
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
     * NOTE: The second value MUST be set inside a `requestAnimationFrame()` or it will not work. E.g.:
     *
     * ```js
     * childFlexItem.style.flexBasis = 'auto';
     * requestAnimationFrame(() => {
     *   childFlexItem.style.flexBasis = '';
     * });
     * ```
     *
     * For whatever reason, IE seems to render correctly after that.
     *
     * See https://github.com/philipwalton/flexbugs/issues/216 for more information.
     *
     * @type {boolean}
     */
    this.hasFlexItemMaxHeightBug = this.ignoresOverflowAutoOnChildFlexItemsThatExceedMaxHeight_();
  }

  /**
   * @param {!HTMLElement} element
   */
  fixFlexItemMaxHeightBug(element) {
    if (!this.hasFlexItemMaxHeightBug) {
      return;
    }

    const oldValue = element.style.flexBasis;
    element.style.flexBasis = oldValue === 'auto' ? '' : 'auto';
    requestAnimationFrame(() => {
      element.style.flexBasis = oldValue;
    });
  }

  /**
   * @return {boolean}
   * @private
   */
  ignoresOverflowAutoOnChildFlexItemsThatExceedMaxHeight_() {
    const tempEl = document.createElement('div');

    tempEl.innerHTML = `
<section style="display: flex; flex-direction: column; max-height: 200px; opacity: 0.001;">
  <header style="flex-shrink: 0; height: 50px;"></header>
  <article style="flex-grow: 1; overflow: auto;">
    1 <br>
    2 <br>
    3 <br>
    4 <br>
    5 <br>
    6 <br>
    7 <br>
    8 <br>
    9 <br>
  </article>
  <footer style="flex-shrink: 0; height: 50px;"></footer>
<section>
`;

    // TODO(acdvorak): Use `position: fixed` (or similar) to prevent jank on page load, if necessary.
    document.body.appendChild(tempEl);

    const contentEl = tempEl.querySelector('article');
    const isScrollable = contentEl.scrollHeight > contentEl.offsetHeight;

    document.body.removeChild(tempEl);

    return !isScrollable;
  }
}

export default MDCFeatureDetector;
