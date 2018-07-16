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
import {strings} from '../../../packages/mdc-textfield/icon/constants';

suite('MDCTextFieldIconFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCTextFieldIconFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldIconFoundation, [
    'getAttr', 'setAttr', 'removeAttr', 'setContent', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'notifyIconAction',
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

test('#setDisabled sets icon tabindex to -1 and removes role when set to true if icon initially had a tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr('tabindex')).thenReturn('1');
  foundation.init();

  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr('tabindex', '-1'));
  td.verify(mockAdapter.removeAttr('role'));
});

test('#setDisabled does not change icon tabindex or role when set to true if icon initially had no tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr('tabindex')).thenReturn(null);
  foundation.init();

  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr('tabindex', td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.removeAttr('role'), {times: 0});
});

test('#setDisabled restores icon tabindex and role when set to false if icon initially had a tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  const expectedTabIndex = '1';
  td.when(mockAdapter.getAttr('tabindex')).thenReturn(expectedTabIndex);
  foundation.init();

  foundation.setDisabled(false);
  td.verify(mockAdapter.setAttr('tabindex', expectedTabIndex));
  td.verify(mockAdapter.setAttr('role', strings.ICON_ROLE));
});

test('#setDisabled does not change icon tabindex or role when set to false if icon initially had no tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr('tabindex')).thenReturn(null);
  foundation.init();

  foundation.setDisabled(false);
  td.verify(mockAdapter.setAttr('tabindex', td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setAttr('role', td.matchers.isA(String)), {times: 0});
});

test('#setAriaLabel updates the aria-label', () => {
  const {foundation, mockAdapter} = setupTest();
  const ariaLabel = 'Test label';
  foundation.init();

  foundation.setAriaLabel(ariaLabel);
  td.verify(mockAdapter.setAttr('aria-label', ariaLabel));
});

test('#setContent updates the text content', () => {
  const {foundation, mockAdapter} = setupTest();
  const content = 'test';
  foundation.init();

  foundation.setContent(content);
  td.verify(mockAdapter.setContent(content));
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
