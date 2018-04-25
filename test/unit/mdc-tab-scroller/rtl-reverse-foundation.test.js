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

suite('MDCTabScrollerFoundation - RTL Reverse Scrolling');

test(`#computeRTLScrollDirection_() returns ${MDCTabScrollerFoundation.strings.RTL_REVERSE}`, () => {
  const {foundation, mockAdapter} = setupFoundationTest(MDCTabScrollerFoundation);
  let currentScrollLeft = 0;
  td.when(mockAdapter.computeContentClientRect()).thenDo(() => {
    return {right: 100 + currentScrollLeft};
  });
  td.when(mockAdapter.computeClientRect()).thenDo(() => {
    return {right: 100};
  });
  td.when(mockAdapter.getScrollLeft()).thenDo(() => {
    return currentScrollLeft;
  });
  td.when(mockAdapter.setScrollLeft(td.matchers.isA(Number))).thenDo((scrollLeft) => {
    if (scrollLeft > 0) {
      currentScrollLeft = scrollLeft;
    }
  });
  assert.strictEqual(foundation.computeRTLScrollDirection_(), MDCTabScrollerFoundation.strings.RTL_REVERSE);
});

const setupReverseTest = ({scrollLeft, contentWidth, rootWidth, transform='none'}) => {
  const {foundation, mockAdapter} = setupFoundationTest(MDCTabScrollerFoundation);
  td.when(mockAdapter.getScrollLeft()).thenReturn(scrollLeft);
  td.when(mockAdapter.getContentOffsetWidth()).thenReturn(contentWidth);
  td.when(mockAdapter.getOffsetWidth()).thenReturn(rootWidth);
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn(transform);
  td.when(mockAdapter.getContentStyleValue('direction')).thenReturn('rtl');
  foundation.rtlScrollType_ = MDCTabScrollerFoundation.strings.RTL_REVERSE;
  return {foundation, mockAdapter};
};

test('#computeCurrentScrollPosition() returns the negated current scroll values', () => {
  const {foundation} = setupReverseTest({
    scrollLeft: 10,
    contentWidth: 666,
    rootWidth: 200,
  });
  assert.strictEqual(foundation.computeCurrentScrollPosition(), -10);
});

test('#scrollTo() sets the scrollLeft property to positive scroll value', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 2000,
    rootWidth: 360,
  });
  foundation.scrollTo(-111);
  td.verify(mockAdapter.setScrollLeft(111), {times: 1});
});

test('#scrollTo() sets the transform property to incremental scroll value', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 2000,
    rootWidth: 360,
  });
  foundation.scrollTo(-111);
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(-11px)'), {times: 1});
});

test('#scrollTo() sets the scrollLeft property to the max scroll value when < max scroll value', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 2112,
    rootWidth: 360,
  });
  foundation.scrollTo(-2000);
  td.verify(mockAdapter.setScrollLeft(1752), {times: 1});
});

test('#scrollTo() sets the scrollLeft property to 0 when scroll value > 0', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 1234,
    rootWidth: 400,
  });
  foundation.scrollTo(10);
  td.verify(mockAdapter.setScrollLeft(0), {times: 1});
});

test('#scrollTo() does nothing when the scroll value === -current scroll value', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 2222,
    rootWidth: 400,
  });
  foundation.scrollTo(-100);
  td.verify(mockAdapter.setScrollLeft(td.matchers.isA(Number)), {times: 0});
});

test('#incrementScroll() sets the scrollLeft property to currentScrollLeft - value', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 2222,
    rootWidth: 400,
  });
  foundation.incrementScroll(-50);
  td.verify(mockAdapter.setScrollLeft(150), {times: 1});
});

test('#incrementScroll() sets the scrollLeft property to 0 when increment is too big', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 20,
    contentWidth: 2222,
    rootWidth: 400,
  });
  foundation.incrementScroll(30);
  td.verify(mockAdapter.setScrollLeft(0), {times: 1});
});

test('#incrementScroll() sets the scrollLeft property to max scroll value when increment is too small', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 1800,
    contentWidth: 2222,
    rootWidth: 400,
  });
  foundation.incrementScroll(-30);
  td.verify(mockAdapter.setScrollLeft(1822), {times: 1});
});

test('#incrementScroll() sets the transform property to increment scroll value', () => {
  const {foundation, mockAdapter} = setupReverseTest({
    scrollLeft: 100,
    contentWidth: 2222,
    rootWidth: 400,
  });
  foundation.incrementScroll(-50);
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(-50px)'), {times: 1});
});
