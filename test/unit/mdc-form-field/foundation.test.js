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

import MDCFormFieldFoundation from '../../../packages/mdc-form-field/foundation';
import {cssClasses, strings} from '../../../packages/mdc-form-field/constants';
import {verifyDefaultAdapter} from '../helpers/foundation';

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCFormFieldFoundation);
  assert.deepEqual(MDCFormFieldFoundation.cssClasses, cssClasses);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCFormFieldFoundation);
  assert.deepEqual(MDCFormFieldFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCFormFieldFoundation, [
    'registerInteractionHandler', 'deregisterInteractionHandler', 'activateInputRipple', 'deactivateInputRipple',
  ]);
});

function setupTest() {
  const mockAdapter = td.object(MDCFormFieldFoundation.defaultAdapter);
  const foundation = new MDCFormFieldFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#init calls event registrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerInteractionHandler('click', isA(Function)));
});

test('#destroy calls event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('click', isA(Function)));
});
