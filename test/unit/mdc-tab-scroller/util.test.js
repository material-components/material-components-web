/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
