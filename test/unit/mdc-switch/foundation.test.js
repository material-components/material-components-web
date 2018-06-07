/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import MDCSwitchFoundation from '../../../packages/mdc-switch/foundation';

suite('MDCSwitchFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSwitchFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCSwitchFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  const {defaultAdapter} = MDCSwitchFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  assert.deepEqual(methods,
    ['addClass', 'removeClass', 'registerChangeHandler', 'deregisterChangeHandler', 'getNativeControl']);
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

function setupTest() {
  const mockAdapter = td.object(MDCSwitchFoundation.defaultAdapter);
  const foundation = new MDCSwitchFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#init calls adapter.registerChangeHandler() with a change handler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerChangeHandler(isA(Function)));
});

test('#destroy calls adapter.deregisterChangeHandler() with a registerChangeHandler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(isA(Function))).thenDo(function(handler) {
    changeHandler = handler;
  });
  foundation.init();

  foundation.destroy();
  td.verify(mockAdapter.deregisterChangeHandler(changeHandler));
});

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

test('#setChecked adds mdc-switch--toggled-on to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {checked: false};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setChecked(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.TOGGLED_ON));
});

test('#setChecked removes mdc-switch--toggled-on from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {checked: true};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setChecked(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.TOGGLED_ON));
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

test('#setDisabled adds mdc-switch--disabled to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: false};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#setDisabled removes mdc-switch--disabled from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: true};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#setDisabled exits gracefully if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('a native control change event fired when the switch changes to a checked state results in adding ' +
      'mdc-switch--toggled-on to the switch ', () => {
  const {foundation, mockAdapter} = setupTest();

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    changeHandler = handler;
  });
  foundation.init();

  td.when(mockAdapter.getNativeControl()).thenReturn({checked: true});

  changeHandler();
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.TOGGLED_ON));
});

test('a native control change event fired when the switch changes to an unchecked state results in removing ' +
      'mdc-switch--toggled-on from the switch ', () => {
  const {foundation, mockAdapter} = setupTest();

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    changeHandler = handler;
  });
  foundation.init();

  td.when(mockAdapter.getNativeControl()).thenReturn({checked: false});

  changeHandler();
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.TOGGLED_ON));
});
