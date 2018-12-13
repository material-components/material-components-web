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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabIndicatorFoundation from '../../../packages/mdc-tab-indicator/foundation';

suite('MDCTabIndicatorFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabIndicatorFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabIndicatorFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabIndicatorFoundation, [
    'addClass', 'removeClass',
    'setContentStyleProperty',
    'computeContentClientRect',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabIndicatorFoundation);

test('#computeContentClientRect returns the client rect', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.computeContentClientRect();
  td.verify(mockAdapter.computeContentClientRect(), {times: 1});
});

test('#activate is abstract and does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.removeClass(td.matchers.isA(String)), {times: 0});
});

test('#deactivate is abstract and does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.removeClass(td.matchers.isA(String)), {times: 0});
});
