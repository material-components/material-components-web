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
import MDCTextFieldIconFoundation from '../../../packages/mdc-textfield/icon/foundation';

suite('MDCTextFieldIconFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldIconFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldIconFoundation, [
    'setAttr', 'getAttr', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'notifyIconAction', 'getTabIndex', 'setTabIndex',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldIconFoundation);

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

test('#setDisabled restores the previously set tab index when enabled', () => {
  const {foundation, mockAdapter} = setupTest();
  const tabIndex = 5;
  td.when(mockAdapter.getTabIndex()).thenReturn(tabIndex);
  foundation.setDisabled(true);

  foundation.setDisabled(false);
  td.verify(mockAdapter.setTabIndex(tabIndex));
});

test('on click notifies custom icon event', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {
    target: {},
    type: 'click',
  };
  let click;

  td.when(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function))).thenDo((evtType, handler) => {
    click = handler;
  });

  foundation.init();
  click(evt);
  td.verify(mockAdapter.notifyIconAction());
});
