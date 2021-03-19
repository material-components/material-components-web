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

import {computePrimaryActionRippleClientRect} from '../component-ripple';

describe('ripple', () => {
  describe('computePrimaryActionRippleClientRect', () => {
    it('returns the base dimensions when given an empty style prop', () => {
      const rect = {
        width: 100,
        height: 32,
        top: 10,
        left: 10,
        bottom: 42,
        right: 110,
      };

      expect(computePrimaryActionRippleClientRect(rect, '')).toEqual(rect);
    });

    it('returns the base dimensions when given a non-numeric style prop',
       () => {
         const rect = {
           width: 100,
           height: 32,
           top: 10,
           left: 10,
           bottom: 42,
           right: 110,
         };

         expect(computePrimaryActionRippleClientRect(rect, 'xyz'))
             .toEqual(rect);
       });

    it('returns the base dimensions when given a non-pixel style prop', () => {
      const rect = {
        width: 100,
        height: 32,
        top: 10,
        left: 10,
        bottom: 42,
        right: 110,
      };

      expect(computePrimaryActionRippleClientRect(rect, '20YYpx'))
          .toEqual(rect);
    });

    it('adds a valid style prop to the width property', () => {
      const rect = {
        width: 100,
        height: 32,
        top: 10,
        left: 10,
        bottom: 42,
        right: 110,
      };

      expect(computePrimaryActionRippleClientRect(rect, '20px')).toEqual({
        ...rect,
        width: rect.width + 20,
      });
    });
  });
});
