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

:host(:focus), :host(:not(.hidden)[outlined]:focus), :host .my-class:focus, gm-fab:focus, :host, :host(:not(.hidden)[outlined]), :host .my-class, gm-fab {
  border-color: green;
}`);
     });

  it('should replace values provided to $replace for theme.property()', () => {
    const filePath = path.join(__dirname, 'replace.test.css');
    const css = fs.readFileSync(filePath, 'utf8').trim();
    expect(css).toEqual(`.simple {
  width: calc(100% - 20px);
}

.var {
  width: calc(16px + 8px);
  /* @alternate */
  width: calc(var(--m-foo, 16px) + var(--m-bar, 8px));
}

.multiple {
  width: calc(8px + 8px + 8px);
}

.list {
  padding: 0 16px;
}`);
  });

  it('should allow overriding theme color values using @use/with', () => {
    const filePath = path.join(__dirname, 'override.test.css');
    const css = fs.readFileSync(filePath, 'utf8').trim();
    expect(css).toContain('--mdc-theme-primary: teal');
    expect(css).toContain('--mdc-theme-secondary: crimson');
  });

  it('validate-keys Should throw error when unsupported key is provided',
     () => {
       const filePath = path.join(__dirname, 'theme-validate-keys.test.css');
       const css = fs.readFileSync(filePath, 'utf8').trim();
       expect(css).toContain('Unsupported keys found: foobar.');
     });
});
