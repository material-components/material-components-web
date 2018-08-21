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

import {setupFoundationTest} from '../helpers/setup';
import MDCTabScrollerFoundation from '../../../packages/mdc-tab-scroller/foundation';
import MDCTabScrollerRTL from '../../../packages/mdc-tab-scroller/rtl-scroller';

suite('MDCTabScrollerRTL');

const setup = () => {
  const {mockAdapter} = setupFoundationTest(MDCTabScrollerFoundation);
  const scroller = new MDCTabScrollerRTL(mockAdapter);
  return {scroller};
};

test('#getScrollPositionRTL() is abstract and does nothing', () => {
  const {scroller} = setup();
  assert.isUndefined(scroller.getScrollPositionRTL());
});

test('#scrollToRTL() is abstract and does nothing', () => {
  const {scroller} = setup();
  assert.isUndefined(scroller.scrollToRTL());
});

test('#incrementScrollRTL() is abstract and does nothing', () => {
  const {scroller} = setup();
  assert.isUndefined(scroller.incrementScrollRTL());
});

test('#getAnimatingScrollPosition() is abstract and does nothing', () => {
  const {scroller} = setup();
  assert.isUndefined(scroller.getAnimatingScrollPosition());
});
