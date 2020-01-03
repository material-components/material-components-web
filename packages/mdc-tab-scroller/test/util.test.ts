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

import {cssClasses} from '../constants';
import * as util from '../util';

function createMockDocumentForHorizontalScrollbarHeight(height: number) {
  const classListAddFunc = jasmine.createSpy('classList.add');
  const mockDocument = {
    appendedNodes: 0,
    body: {
      appendChild: () => mockDocument.appendedNodes++,
      removeChild: () => mockDocument.appendedNodes--,
    },
    createElement: () => {
      return {
        classList: {add: classListAddFunc},
        // Populate both offsetHeight and contentHeight such that the difference
        // is the intended height, to test that the util function is computing
        // based on both
        clientHeight: height,
        offsetHeight: height * 2,
      };
    },
  };

  return {mockDocument, classListAddFunc};
}

describe('MDCTabScroller - util', () => {
  it('#computeHorizontalScrollbarHeight returns value based on difference between offset and client height',
     () => {
       const expectedHeight = 17;
       const {mockDocument, classListAddFunc} =
           createMockDocumentForHorizontalScrollbarHeight(expectedHeight);

       expect(
           util.computeHorizontalScrollbarHeight(
               mockDocument as any, false /* shouldCacheResult */) ===
           expectedHeight)
           .toBe(true);
       expect(classListAddFunc).toHaveBeenCalledWith(cssClasses.SCROLL_TEST);
     });
});
