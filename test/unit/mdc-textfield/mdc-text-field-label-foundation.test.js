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
import MDCTextFieldLabelFoundation from '../../../packages/mdc-textfield/label/foundation';

const {cssClasses} = MDCTextFieldLabelFoundation;

suite('MDCTextFieldLabelFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextFieldLabelFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldLabelFoundation, [
    'addClass', 'removeClass', 'getWidth',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldLabelFoundation);

test('#getWidth returns the width of the label element scaled by 75%', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 100;
  td.when(mockAdapter.getWidth()).thenReturn(width);
  assert.equal(foundation.getWidth(), width);
});

test('#style with non-empty value floats the label', () => {
  const value = 'new value';
  const {foundation, mockAdapter} = setupTest();
  foundation.style(value);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#style with empty value de-floats the label', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.style('');
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#style with valid and invalid input', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.style('invalid', false);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_SHAKE));

  foundation.style('valid', true);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test('#style with empty value and badInput does not touch floating label', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.style('', false, true);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#style updates shake class', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.style('', false);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_SHAKE));

  foundation.style('', true);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test('#setValidity does nothing if isValid is true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setValidity(true);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_SHAKE), {times: 0});
});
