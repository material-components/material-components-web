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
  assert.deepEqual(methods, ['addClass', 'removeClass', 'setNativeControlChecked', 'setNativeControlDisabled']);
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

function setupTest() {
  const mockAdapter = td.object(MDCSwitchFoundation.defaultAdapter);
  const foundation = new MDCSwitchFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#setChecked updates the checked state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(true);
  td.verify(mockAdapter.setNativeControlChecked(true));

  foundation.setChecked(false);
  td.verify(mockAdapter.setNativeControlChecked(false));
});

test('#setChecked adds mdc-switch--checked to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#setChecked removes mdc-switch--checked from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#setDisabled updates the disabled state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setNativeControlDisabled(true));

  foundation.setDisabled(false);
  td.verify(mockAdapter.setNativeControlDisabled(false));
});

test('#setDisabled adds mdc-switch--disabled to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#setDisabled removes mdc-switch--disabled from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#handleChange adds mdc-switch--checked to the switch when it is a checked state', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChange({target: {checked: true}});
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#handleChange removes mdc-switch--checked from the switch when it is an unchecked state', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChange({target: {checked: false}});
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.CHECKED));
});
