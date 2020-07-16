/**
 * @license
 * Copyright 2020 Google Inc.
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

import * as fs from 'fs';
import * as path from 'path';

describe('theme.test.scss', () => {
  it('emits custom properties using theme.property()', () => {
    const filePath = path.join(__dirname, 'theme.test.css');
    const css = fs.readFileSync(filePath, 'utf8').trim();
    expect(css).toEqual(`.test {
  /* @noflip */
  margin-left: 0;
  /* @noflip */
  margin-right: 8px;
  /* @alternate */
  /* @noflip */
  margin-right: var(--margin-prop, 8px);
}
[dir=rtl] .test, .test[dir=rtl] {
  /* @noflip */
  margin-left: 8px;
  /* @alternate */
  /* @noflip */
  margin-left: var(--margin-prop, 8px);
  /* @noflip */
  margin-right: 0;
}`);
  });
});
