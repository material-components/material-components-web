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

import 'jasmine';

import * as fs from 'fs';
import * as path from 'path';
import {expectStylesWithNoFeaturesToBeEmpty} from '../../../testing/featuretargeting';

describe('mdc-typography.scss', () => {
  expectStylesWithNoFeaturesToBeEmpty(
      path.join(__dirname, 'feature-targeting-any.test.css'));

  it('should allow global variable overrides with @import', () => {
    const css = fs.readFileSync(
                      path.join(__dirname, 'global-variables.test.css'), 'utf8')
                    .trim();
    const headline1Start = css.indexOf('.mdc-typography--headline1 {');
    const headline1End = css.indexOf('}', headline1Start);
    const headline1Css = css.substring(headline1Start, headline1End);
    expect(headline1Css.includes('font-family: Arial'))
        .toBe(true, '$mdc-typography-font-family should override');
    expect(headline1Css.includes('font-size: 1rem'))
        .toBe(
            true, '$mdc-typography-styles-headline1-font-size should override');
  });
});
