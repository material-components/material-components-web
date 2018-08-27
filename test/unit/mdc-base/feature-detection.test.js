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

import {assert} from 'chai';
import bel from 'bel';

import {fixFlexItemMaxHeightBug} from '../../../packages/mdc-base/feature-detection';

suite('MDCBase - feature-detection');

test('#fixFlexItemMaxHeightBug recalculates overflow and enables scrolling', function(done) {
  // The 1px borders are necessary to force IE to calculate box sizing correctly.
  const fixture = bel`
<section style="box-sizing: border-box; display: flex; flex-direction: column; max-height: 200px;
                opacity: 0.001; position: fixed; top: -9999px; left: -9999px;
                border: 1px solid transparent;">
  <header style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Header</header>
  <article style="box-sizing: border-box; flex-grow: 1; overflow: auto;
                  border: 1px solid transparent;">
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
  <footer style="box-sizing: border-box; flex-shrink: 0; height: 50px;">Footer</footer>
<section>
`;

  document.body.appendChild(fixture);

  const flexItemEl = fixture.querySelector('article');
  fixFlexItemMaxHeightBug(flexItemEl);

  requestAnimationFrame(() => {
    assert.isAbove(flexItemEl.scrollHeight, flexItemEl.offsetHeight);
    document.body.removeChild(fixture);
    done();
  });
});
