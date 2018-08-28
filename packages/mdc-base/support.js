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

class MDCSupport {
  constructor() {
    /**
     * @type {boolean|undefined}
     * @private
     */
    this.hasFlexItemMaxHeightBug_;
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
   * @return {boolean}
   */
  get hasFlexItemMaxHeightBug() {
    if (typeof this.hasFlexItemMaxHeightBug_ === 'undefined') {
      this.hasFlexItemMaxHeightBug_ = this.detectFlexItemMaxHeightBug_();
    }
    return this.hasFlexItemMaxHeightBug_;
  }

  /**
   * {@see hasFlexItemMaxHeightBug} for more information.
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
   * {@see hasFlexItemMaxHeightBug} for more information.
   * @return {boolean}
   * @private
   */
  detectFlexItemMaxHeightBug_() {
    /** @type {!HTMLElement} */
    const tempEl = document.createElement('div');

    // The 1px borders are necessary to force IE to calculate box sizing correctly.
    tempEl.innerHTML = `
<section style="box-sizing: border-box; display: flex; flex-direction: column; max-height: 200px;
                opacity: 0.001; position: fixed; top: -9999px; left: -9999px;
                border: 1px solid transparent;">
  <header style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Header</header>
  <article style="box-sizing: border-box; flex-grow: 1; overflow: auto;
                  border: 1px solid transparent;">
    <div style="height: 500px;">Content</div>
  </article>
  <footer style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Footer</footer>
<section>
`;

    document.body.appendChild(tempEl);

    const flexItemEl = tempEl.querySelector('article');
    const isScrollable = this.isScrollable(flexItemEl);

    document.body.removeChild(tempEl);

    return !isScrollable;
  }

  /**
   * @param {!HTMLElement} element
   * @return {boolean}
   */
  isScrollable(element) {
    return element.scrollHeight > element.offsetHeight;
  }
}

export {MDCSupport};
