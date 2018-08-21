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
import td from 'testdouble';
import {cssClasses} from '../../../packages/mdc-tab-scroller/constants';
import * as util from '../../../packages/mdc-tab-scroller/util';

suite('MDCTabScroller - util');

function createMockDocumentForHorizontalScrollbarHeight(height) {
  const classListAddFunc = td.func('classList.add');
  const mockDocument = {
    appendedNodes: 0,
    body: {
      appendChild: () => mockDocument.appendedNodes++,
      removeChild: () => mockDocument.appendedNodes--,
    },
    createElement: () => {
      return {
        classList: {add: classListAddFunc},
        // Populate both offsetHeight and contentHeight such that the difference is the intended height,
        // to test that the util function is computing based on both
        clientHeight: height,
        offsetHeight: height * 2,
      };
    },
  };

  return {mockDocument, classListAddFunc};
}

test('#computeHorizontalScrollbarHeight returns value based on difference between offset and client height', () => {
  const expectedHeight = 17;
  const {mockDocument, classListAddFunc} = createMockDocumentForHorizontalScrollbarHeight(expectedHeight);

  assert.strictEqual(util.computeHorizontalScrollbarHeight(mockDocument, false /* shouldCacheResult */),
    expectedHeight);
  td.verify(classListAddFunc(cssClasses.SCROLL_TEST));
});

test('#getMatchesProperty returns the correct property for selector matching', () => {
  assert.strictEqual(util.getMatchesProperty({matches: () => {}}), 'matches');
  assert.strictEqual(util.getMatchesProperty({msMatchesSelector: () => {}}), 'msMatchesSelector');
});

test('#getMatchesProperty returns the standard function if more than one method is present', () => {
  assert.strictEqual(util.getMatchesProperty({matches: () => {}, msMatchesSelector: () => {}}), 'matches');
});
