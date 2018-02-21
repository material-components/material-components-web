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

import MDCSelectLabelFoundation from '../../../packages/mdc-select/label/foundation';
import {cssClasses} from '../../../packages/mdc-select/label/constants';

function setupTest() {
  return setupFoundationTest(MDCSelectLabelFoundation);
}

suite('MDCSelectLabelFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCSelectLabelFoundation.cssClasses, cssClasses);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectLabelFoundation, [
    'addClass', 'removeClass', 'getWidth',
  ]);
});

test('#styleFloat should add float above class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.styleFloat('selectedValue');
  td.verify(mockAdapter.addClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#styleFloat should remove float above class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.styleFloat(null);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE));
});
