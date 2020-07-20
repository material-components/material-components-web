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
  it('should transform theme keys to custom property for theme.property()',
     () => {
       const filePath = path.join(__dirname, 'theme.test.css');
       const css = fs.readFileSync(filePath, 'utf8').trim();
       expect(css).toEqual(`.test {
  color: #6200ee;
  /* @alternate */
  color: var(--mdc-theme-primary, #6200ee);
}`);
     });

  it('host-aware test produces expected output',
     () => {
       const filePath = path.join(__dirname, 'shadow-dom.test.css');
       const css = fs.readFileSync(filePath, 'utf8').trim();
       expect(css).toEqual(`:host([lowered]), :host(:not(.hidden)[outlined][lowered]), :host .my-class[lowered], gm-fab[lowered] {
  color: blue;
}
:host([lowered]:hover), :host(:not(.hidden)[outlined][lowered]:hover), :host .my-class[lowered]:hover, gm-fab[lowered]:hover {
  background-color: red;
}

:host(:focus), :host(:not(.hidden)[outlined]:focus), :host .my-class:focus, gm-fab:focus, :host, :host(:not(.hidden)[outlined]), :host .my-class, gm-fab, .visible {
  border-color: green;
}`);
     });
});
