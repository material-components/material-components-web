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

import {setupFoundationTest} from '../helpers/setup';
import MDCTabScrollerFoundation from '../../../packages/mdc-tab-scroller/foundation';
import MDCTabScrollerRTLReverse from '../../../packages/mdc-tab-scroller/rtl-reverse-scroller';

suite('MDCTabScrollerRTLReverse');

const setupTest = ({rootWidth, contentWidth, scrollLeft}) => {
  const {mockAdapter} = setupFoundationTest(MDCTabScrollerFoundation);
  const scroller = new MDCTabScrollerRTLReverse(mockAdapter);
  td.when(mockAdapter.getScrollAreaOffsetWidth()).thenReturn(rootWidth);
  td.when(mockAdapter.getScrollContentOffsetWidth()).thenReturn(contentWidth);
  td.when(mockAdapter.getScrollAreaScrollLeft()).thenReturn(scrollLeft);
  return {scroller, mockAdapter};
};

test('#getScrollPositionRTL() returns the negated scrollLeft value', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.getScrollPositionRTL(0), 677);
});

test('#getScrollPositionRTL() returns the negated current scroll distance minus translateX', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.getScrollPositionRTL(11), 666);
});

test('#scrollToRTL() returns a normalized scrollX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(111).finalScrollPosition, 111);
});

test('#scrollToRTL() returns a normalized translateX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 145});
  assert.strictEqual(scroller.scrollToRTL(111).scrollDelta, 34);
});

test('#scrollToRTL() returns 0 for scrollX property when scrollLeft would be too far right', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(-10).finalScrollPosition, 0);
});

test('#scrollToRTL() returns 0 for translateX property when scrollLeft would be the same', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(677).scrollDelta, 0);
});

test('#scrollToRTL() returns max scroll value for scrollX property when scrollLeft would be too far left', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.scrollToRTL(801).finalScrollPosition, 800);
});

test('#incrementScrollRTL() returns a normalized scrollX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 202});
  assert.strictEqual(scroller.incrementScrollRTL(50).finalScrollPosition, 252);
});

test('#incrementScrollRTL() returns a normalized translateX property', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 212});
  assert.strictEqual(scroller.incrementScrollRTL(50).scrollDelta, -50);
});

test('#incrementScrollRTL() returns 0 for scrollX property when scrollLeft would be too far right', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 45});
  assert.strictEqual(scroller.incrementScrollRTL(-50).finalScrollPosition, 0);
});

test('#incrementScrollRTL() returns 0 for translateX property when scrollLeft would be the same', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 0});
  assert.strictEqual(scroller.incrementScrollRTL(-50).scrollDelta, 0);
});

test('#incrementScrollRTL() returns max scroll value for scrollX property when scrollLeft would be too far left',
  () => {
    const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
    assert.strictEqual(scroller.incrementScrollRTL(124).finalScrollPosition, 800);
  }
);

test('#getAnimatingScrollPosition() returns the sum of the scrollX value and the translateX value', () => {
  const {scroller} = setupTest({rootWidth: 200, contentWidth: 1000, scrollLeft: 677});
  assert.strictEqual(scroller.getAnimatingScrollPosition(123, 11), 134);
});
