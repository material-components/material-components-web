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
import MDCSelectBottomLineFoundation from '../../../packages/mdc-select/bottom-line/foundation';
import {cssClasses} from '../../../packages/mdc-select/bottom-line/constants';

suite('MDCSelectBottomLineFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCSelectBottomLineFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectBottomLineFoundation, [
    'addClass', 'removeClass',
  ]);
});

const setupTest = () => setupFoundationTest(MDCSelectBottomLineFoundation);

test(`#activate adds ${cssClasses.BOTTOM_LINE_ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.activate();
  td.verify(mockAdapter.addClass(cssClasses.BOTTOM_LINE_ACTIVE));
});

test(`#deactivate removes ${cssClasses.BOTTOM_LINE_ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(cssClasses.BOTTOM_LINE_ACTIVE));
});
