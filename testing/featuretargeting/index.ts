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

/**
 * Tests if generated CSS with no features in feature targeting expected to be
 * empty. Use this from Jasmine node test suite.
 * @param filePath File path of CSS files that you want to test.
 */
export const expectStylesWithNoFeaturesToBeEmpty = (filePath: string) => {
  it('Sass produces no CSS properties when we ask for no features in feature targeting',
     () => {
       // RTL annotations are not feature targetted. Remove RTL annotations and
       // empty RTL selectors from the CSS result.
       const css = fs.readFileSync(filePath, 'utf8')
                       .replace(/\/\*rtl:(begin|end):ignore\*\//g, '')
                       .replace(/\[dir=rtl\].*\{\s+\}/g, '')
                       .trim();
       expect(css).toEqual('');
     });
};
