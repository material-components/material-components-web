/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
import MDCChipFoundation from '../../../packages/mdc-chips/chip/foundation';

suite('MDCChipFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCChipFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCChipFoundation, [
    'registerInteractionHandler', 'deregisterInteractionHandler', 'notifyInteraction',
  ]);
});

const setupTest = () => setupFoundationTest(MDCChipFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('keydown', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keydown', td.matchers.isA(Function)));
});

test('on click, emit custom event', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'click',
  };
  let click;

  td.when(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function))).thenDo((evtType, handler) => {
    click = handler;
  });

  foundation.init();
  click(mockEvt);

  td.verify(mockAdapter.notifyInteraction());
});
