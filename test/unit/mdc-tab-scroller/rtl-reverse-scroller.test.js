/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import {setupFoundationTest} from '../helpers/setup';
import MDCTabScrollerFoundation from '../../../packages/mdc-tab-scroller/foundation';
import MDCTabScrollerRTLReverse from '../../../packages/mdc-tab-scroller/rtl-reverse-scroller';

suite('MDCTabScrollerRTLReverse');

const setupTest = ({rootWidth, contentWidth, scrollLeft}) => {
  const {mockAdapter} = setupFoundationTest(MDCTabScrollerFoundation);
  const scroller = new MDCTabScrollerRTLReverse(mockAdapter);
  td.when(mockAdapter.getOffsetWidth()).thenReturn(rootWidth);
  td.when(mockAdapter.getContentOffsetWidth()).thenReturn(contentWidth);
  td.when(mockAdapter.getScrollLeft()).thenReturn(scrollLeft);
  return {scroller, mockAdapter};
};

test('#computeCurrentScrollPositionRTL() returns the negated scrollLeft value', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.computeCurrentScrollPositionRTL(0), -677);
});

test('#computeCurrentScrollPositionRTL() returns the negated current scroll distance minus translateX', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.computeCurrentScrollPositionRTL(11), -666);
});

test('#scrollToRTL() returns a normalized scrollX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(-111).scrollX, 111);
});

test('#scrollToRTL() returns a normalized translateX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 145});
  assert.strictEqual(scroller.scrollToRTL(-111).translateX, 34);
});

test('#scrollToRTL() returns 0 for scrollX property when scrollLeft would be too far right', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(10).scrollX, 0);
});

test('#scrollToRTL() returns 0 for translateX property when scrollLeft would be the same', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(-677).translateX, 0);
});

test('#scrollToRTL() returns max scroll value for scrollX property when scrollLeft would be too far left', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(-801).scrollX, 800);
});

test('#incrementScrollRTL() returns a normalized scrollX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 202});
  assert.strictEqual(scroller.incrementScrollRTL(-50).scrollX, 252);
});

test('#incrementScrollRTL() returns a normalized translateX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 212});
  assert.strictEqual(scroller.incrementScrollRTL(-50).translateX, -50);
});

test('#incrementScrollRTL() returns 0 for scrollX property when scrollLeft would be too far right', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 45});
  assert.strictEqual(scroller.incrementScrollRTL(50).scrollX, 0);
});

test('#incrementScrollRTL() returns 0 for translateX property when scrollLeft would be the same', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 0});
  assert.strictEqual(scroller.incrementScrollRTL(50).translateX, 0);
});

test('#incrementScrollRTL() returns max scroll value for scrollX property when scrollLeft would be too far left',
  () => {
    const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    assert.strictEqual(scroller.incrementScrollRTL(-124).scrollX, 800);
  }
);
