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
    'registerEventHandler', 'deregisterEventHandler',
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
  td.verify(mockAdapter.addClass, {times: 0});
  td.verify(mockAdapter.removeClass, {times: 0});
});

test('#deactivate is abstract and does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.addClass, {times: 0});
  td.verify(mockAdapter.removeClass, {times: 0});
});
