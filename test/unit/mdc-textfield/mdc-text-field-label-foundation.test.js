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
    'addClass', 'removeClass',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTextFieldLabelFoundation);

test('#floatAbove adds mdc-text-field__label--float-above class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.floatAbove();
  td.verify(mockAdapter.addClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#deactivateFocus does not remove mdc-text-field__label--float-above class' +
  'if shouldRemoveLabelFloat=false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivateFocus(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#deactivateFocus removes mdc-text-field__label--float-above class if shouldRemoveLabelFloat=true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivateFocus(true);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#setValidity adds mdc-text-field__label--shake class if isValid is false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setValidity(false);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_SHAKE));
});
