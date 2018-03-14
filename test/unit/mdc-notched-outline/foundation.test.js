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
import MDCNotchedOutlineFoundation from '../../../packages/mdc-notched-outline/foundation';

suite('MDCNotchedOutlineFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCNotchedOutlineFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCNotchedOutlineFoundation, [
    'addClass', 'removeClass', 'getWidth', 'getHeight',
    'setOutlinePathAttr', 'getIdleOutlineStyleValue',
  ]);
});

const setupTest = () => setupFoundationTest(MDCNotchedOutlineFoundation);

test('#notch sets the path of the outline element when called with a width > 0', () => {
  const {foundation, mockAdapter} = setupTest();
  const notchWidth = 30;
  const isRtl = true;
  foundation.notch(notchWidth, isRtl);
  td.verify(mockAdapter.setOutlinePathAttr(td.matchers.anything()));
  td.verify(mockAdapter.addClass(MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED));
});

test(`#notch removes ${MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED} when called with a width <= 0`, () => {
  const {foundation, mockAdapter} = setupTest();
  const notchWidth = 0;
  foundation.notch(notchWidth);
  td.verify(mockAdapter.setOutlinePathAttr(td.matchers.anything()), {times: 0});
  td.verify(mockAdapter.removeClass(MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED));
});
