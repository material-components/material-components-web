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

const {cssClasses} = MDCTextFieldIconFoundation;

suite('MDCTextFieldIconFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextFieldIconFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldIconFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldIconFoundation, [
    'setAttr', 'eventTargetHasClass', 'notifyIconAction',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldIconFoundation);

test('#setDisabled sets icon tabindex to -1 when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr('tabindex', '-1'));
});

test('#setDisabled sets icon tabindex to 0 when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.setAttr('tabindex', '0'));
});

test('#handleTextFieldInteraction notifies icon event if event target is an icon for click event', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {
    target: {},
    type: 'click',
  };
  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.TEXT_FIELD_ICON)).thenReturn(true);

  foundation.handleTextFieldInteraction(evt);
  td.verify(mockAdapter.notifyIconAction());
});
