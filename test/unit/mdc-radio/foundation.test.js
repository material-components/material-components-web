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

import MDCRadioFoundation from '../../../packages/mdc-radio/foundation';

suite('MDCRadioFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCRadioFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCRadioFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  const {defaultAdapter} = MDCRadioFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  assert.deepEqual(methods, ['addClass', 'removeClass', 'getNativeControl']);
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

function setupTest() {
  const mockAdapter = td.object(MDCRadioFoundation.defaultAdapter);
  const foundation = new MDCRadioFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#isChecked returns the value of nativeControl.checked', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn({checked: true});
  assert.isOk(foundation.isChecked());
});

test('#isChecked returns false if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNotOk(foundation.isChecked());
});

test('#setChecked sets the value of nativeControl.checked', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {checked: false};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setChecked(true);
  assert.isOk(nativeControl.checked);
});

test('#setChecked exits gracefully if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setChecked(true));
});

test('#isDisabled returns the value of nativeControl.disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn({disabled: true});
  assert.isOk(foundation.isDisabled());
});

test('#isDisabled returns false if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled sets the value of nativeControl.disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: false};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(true);
  assert.isOk(nativeControl.disabled);
});

test('#setDisabled adds mdc-radio--disabled to the radio element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: false};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(MDCRadioFoundation.cssClasses.DISABLED));
});

test('#setDisabled removes mdc-radio--disabled from the radio element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: true};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(MDCRadioFoundation.cssClasses.DISABLED));
});

test('#setDisabled exits gracefully if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('#getValue returns the value of nativeControl.value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn({value: 'value'});
  assert.equal(foundation.getValue(), 'value');
});

test('#getValue returns null if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNull(foundation.getValue());
});

test('#setValue sets the value of nativeControl.value', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {value: null};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setValue('new value');
  assert.equal(nativeControl.value, 'new value');
});

test('#setValue exits gracefully if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setValue('new value'));
});
