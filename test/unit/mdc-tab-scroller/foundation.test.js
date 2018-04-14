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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabScrollerFoundation from '../../../packages/mdc-tab-scroller/foundation';

suite('MDCTabScrollerFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabScrollerFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabScrollerFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabScrollerFoundation, [
    'registerEventHandler', 'deregisterEventHandler',
    'addClass', 'removeClass',
    'setContentStyleProperty', 'getContentStyleValue',
    'setScrollLeft', 'getScrollLeft',
    'computeContentClientRect', 'computeClientRect',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabScrollerFoundation);

test('#scrollTo is abstract and does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.scrollTo(999);
  td.verify(mockAdapter.setScrollLeft(td.matchers.anything), {times: 0});
  td.verify(mockAdapter.setContentStyleProperty(td.matchers.anything, td.matchers.anything), {times: 0});
});

test('#calculateCurrentTranslateX() returns 0 when transform is none', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn('none');
  assert.strictEqual(foundation.calculateCurrentTranslateX(), 0);
});

test('#calculateCurrentTranslateX() returns the translateX value from the matrix transformation', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getContentStyleValue('transform')).thenReturn('matrix(1, 0, 0, 0, 416, 0)');
  assert.strictEqual(foundation.calculateCurrentTranslateX(), 416);
});

test('#calculateSafeScrollValue() returns 0 when given a negative value', () => {
  const {foundation} = setupTest();
  assert.strictEqual(foundation.calculateSafeScrollValue(-1), 0);
});

test('#calculateSafeScrollValue() returns the given value when less than max scroll value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 1000});
  td.when(mockAdapter.computeClientRect()).thenReturn({width: 100});
  assert.strictEqual(foundation.calculateSafeScrollValue(101), 101);
});

test('#calculateSafeScrollValue() returns the max scroll value when greater than max scroll value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 1000});
  td.when(mockAdapter.computeClientRect()).thenReturn({width: 100});
  assert.strictEqual(foundation.calculateSafeScrollValue(901), 900);
});
