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
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import MDCSelectFoundation from '../../../packages/mdc-select/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-select/constants';

suite('MDCSelectFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCSelectFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCSelectFoundation.numbers, numbers);
});

test('exports strings', () => {
  assert.deepEqual(MDCSelectFoundation.strings, strings);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectFoundation, [
    'addClass', 'removeClass', 'hasClass', 'floatLabel', 'activateBottomLine',
    'deactivateBottomLine', 'setDisabled', 'registerInteractionHandler',
    'deregisterInteractionHandler', 'getValue', 'setValue', 'getSelectedIndex',
    'setSelectedIndex', 'isRtl', 'hasLabel', 'getLabelWidth', 'hasOutline',
    'notchOutline', 'closeOutline',
  ]);
});

function setupTest() {
  const {mockAdapter, foundation} = setupFoundationTest(MDCSelectFoundation);
  td.when(mockAdapter.getValue()).thenReturn('');
  return {mockAdapter, foundation};
}

test('#setDisabled to true calls adapter.setDisabled and adapter.addClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setDisabled(true));
  td.verify(mockAdapter.addClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('#setDisabled to false calls adapter.setDisabled false and adapter.removeClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.setDisabled(false));
  td.verify(mockAdapter.removeClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('#init registers focus, blur, and change handlers', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInteractionHandler('focus', foundation.focusHandler_));
  td.verify(mockAdapter.registerInteractionHandler('blur', foundation.blurHandler_));
  td.verify(mockAdapter.registerInteractionHandler('change', foundation.selectionHandler_));
});

test('#destroy deregisters focus, blur, and change handlers', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('focus', foundation.focusHandler_));
  td.verify(mockAdapter.deregisterInteractionHandler('blur', foundation.blurHandler_));
  td.verify(mockAdapter.deregisterInteractionHandler('change', foundation.selectionHandler_));
});

test('#setSelectedIndex calls adapter.setSelectedIndex', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.setSelectedIndex(1));
});


test('#setSelectedIndex floats label', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('value');
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.floatLabel(true));
});

test('#setSelectedIndex with index of an empty value defloats label', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValue(1)).thenReturn('');
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.floatLabel(false));
});

test('#setValue calls setValue on adapter', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getSelectedIndex()).thenReturn(1);
  foundation.setValue('value');
  td.verify(mockAdapter.setValue('value'));
});

test('#setValue calls setSelectedIndex, which calls floatLabel true', () => {
  const {mockAdapter, foundation} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('value');
  td.when(mockAdapter.getSelectedIndex()).thenReturn(1);
  foundation.setValue('value');
  td.verify(mockAdapter.floatLabel(true));
});

test('#notchOutline updates the SVG path of the outline element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getLabelWidth()).thenReturn(30);
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.isRtl()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(30 * numbers.LABEL_SCALE, false));
});

test('#notchOutline does nothing if no outline is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(false);
  td.when(mockAdapter.hasLabel()).thenReturn(true);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline does nothing if no label is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.hasLabel()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline calls updates notched outline to return to idle state when ' +
  'openNotch is false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);

  foundation.notchOutline(false);
  td.verify(mockAdapter.closeOutline());
});
