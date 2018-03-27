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

import {assert} from 'chai';
import lolex from 'lolex';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import MDCSelectFoundation from '../../../packages/mdc-select/foundation';

suite('MDCSelectFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSelectFoundation);
});

test('exports numbers', () => {
  assert.isOk('numbers' in MDCSelectFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCSelectFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectFoundation, [
    'addClass', 'removeClass', 'floatLabel', 'activateBottomLine',
    'deactivateBottomLine',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'getNumberOfOptions', 'getIndexForOptionValue', 'getValueForOptionAtIndex',
    'getValue', 'setValue', 'getSelectedIndex', 'setSelectedIndex', 'setDisabled',
  ]);
});

function setupTest() {
  const {mockAdapter, foundation} = setupFoundationTest(MDCSelectFoundation);
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  return {mockAdapter, foundation};
}

test('get disabled', () => {
  const {foundation} = setupTest();
  assert.isFalse(foundation.disabled);
});

test('set disabled to true calls adapter.setDisabled', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.disabled = true;
  td.verify(mockAdapter.setDisabled(true));
});

test('set disabled to true calls adapter.addClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.disabled = true;
  td.verify(mockAdapter.addClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('set disabled to true and calling get disabled returns true', () => {
  const {foundation} = setupTest();
  foundation.disabled = true;
  assert.isTrue(foundation.disabled);
});

test('set disabled to false calls adapter.setDisabled false', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.disabled = false;
  td.verify(mockAdapter.setDisabled(false));
});

test('set disabled to false removes disabled class', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.disabled = false;
  td.verify(mockAdapter.removeClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('set disabled to false and get disabled returns false', () => {
  const {foundation} = setupTest();
  foundation.disabled = false;
  assert.isFalse(foundation.disabled);
});

test('#init registers focus, blur, and change handler', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInteractionHandler('focus', foundation.focusHandler_));
  td.verify(mockAdapter.registerInteractionHandler('blur', foundation.blurHandler_));
  td.verify(mockAdapter.registerInteractionHandler('change', foundation.selectionHandler_));
});


test('#destroy deregisters focus, blur, and change handler', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('focus', foundation.focusHandler_));
  td.verify(mockAdapter.deregisterInteractionHandler('blur', foundation.blurHandler_));
  td.verify(mockAdapter.deregisterInteractionHandler('change', foundation.selectionHandler_));
});

test('#getSelectedIndex returns correct value', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getSelectedIndex()).thenReturn(-1);
  assert.equal(foundation.getSelectedIndex(), -1);
});

test('#setSelectedIndex calls setSelectedIndex', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.setSelectedIndex(1));
});

test(`#setSelectedIndex calls addClass ${MDCSelectFoundation.cssClasses.IS_CHANGING}`, () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.addClass(MDCSelectFoundation.cssClasses.IS_CHANGING));
});

test('#setSelectedIndex floats label', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValueForOptionAtIndex(1)).thenReturn('value');
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.floatLabel(true));
});

test('#setSelectedIndex defloats label', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValueForOptionAtIndex(1)).thenReturn('');
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.floatLabel(false));
});

test('#setSelectedIndex defloats label if called with a number out of range', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValueForOptionAtIndex(1)).thenReturn('value');
  foundation.setSelectedIndex(4);
  td.verify(mockAdapter.floatLabel(false));
});

test(`#setSelectedIndex removesClass ${MDCSelectFoundation.cssClasses.IS_CHANGING}`, () => {
  const {mockAdapter, foundation} = setupTest();
  const clock = lolex.install();
  foundation.setSelectedIndex(1);
  clock.tick(MDCSelectFoundation.numbers.SELECT_TEXT_TRANSITION_TIME);
  td.verify(mockAdapter.removeClass(MDCSelectFoundation.cssClasses.IS_CHANGING));
});

test('#getValue will return the adapter getValue', () => {
  const {mockAdapter, foundation} = setupTest();
  assert.equal(foundation.getValue(), mockAdapter.getValue());
});

test('#setValue will call setValue on adapter', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getIndexForOptionValue('value')).thenReturn(1);
  foundation.setValue('value');
  td.verify(mockAdapter.setValue('value'));
});

test('#setValue calls setSelectedIndex, which calls floatLabel true', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValueForOptionAtIndex(1)).thenReturn('value');
  td.when(mockAdapter.getIndexForOptionValue('value')).thenReturn(1);
  foundation.setValue('value');
  td.verify(mockAdapter.floatLabel(true));
});
