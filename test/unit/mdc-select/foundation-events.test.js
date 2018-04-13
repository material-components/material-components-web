/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import td from 'testdouble';
import lolex from 'lolex';

import {setupFoundationTest} from '../helpers/setup';
import {captureHandlers} from '../helpers/foundation';

import MDCSelectFoundation from '../../../packages/mdc-select/foundation';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCSelectFoundation);

  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  foundation.init();

  return {foundation, mockAdapter, handlers};
}

suite('MDCSelectFoundation - Events');

test('on focus activates bottom line', () => {
  const {mockAdapter, handlers} = setupTest();
  handlers.focus();
  td.verify(mockAdapter.activateBottomLine(), {times: 1});
});

test('on blur deactivates bottom line', () => {
  const {mockAdapter, handlers} = setupTest();
  handlers.blur();
  td.verify(mockAdapter.deactivateBottomLine(), {times: 1});
});

test('on select value change with option value', () => {
  const clock = lolex.install();
  const {mockAdapter, handlers} = setupTest();
  td.when(mockAdapter.getSelectedIndex()).thenReturn(1);
  td.when(mockAdapter.getValue()).thenReturn('abc');
  td.when(mockAdapter.setSelectedIndex(1)).thenReturn();
  handlers.change({
    target: {value: 'abc'},
  });
  td.verify(mockAdapter.addClass(MDCSelectFoundation.cssClasses.IS_CHANGING), {times: 1});
  td.verify(mockAdapter.floatLabel(true), {times: 1});
  clock.tick(MDCSelectFoundation.numbers.FLOAT_NATIVE_CONTROL_TRANSITION_TIME_MS);
  td.verify(mockAdapter.removeClass(MDCSelectFoundation.cssClasses.IS_CHANGING), {times: 1});
});
