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

const {cssClasses, strings} = MDCNotchedOutlineFoundation;

suite('MDCNotchedOutlineFoundation');


test('exports cssClasses', () => {
  assert.deepEqual(MDCNotchedOutlineFoundation.cssClasses, cssClasses);
});

test('exports strings', () => {
  assert.deepEqual(MDCNotchedOutlineFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCNotchedOutlineFoundation, [
    'addClass', 'removeClass', 'getWidth', 'getHeight',
    'setOutlinePathAttr', 'getIdleOutlineStyleValue',
  ]);
});

const setupTest = () => setupFoundationTest(MDCNotchedOutlineFoundation);

test('#notch sets the path of the outline element and adds the notch selector', () => {
  const {foundation, mockAdapter} = setupTest();
  const notchWidth = 30;
  foundation.notch(notchWidth);
  td.verify(mockAdapter.addClass(MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED));
  td.verify(mockAdapter.setOutlinePathAttr(td.matchers.anything()));
});

test('#closeNotch removes the notch selector', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.closeNotch();
  td.verify(mockAdapter.removeClass(MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED));
});

test('#updateSvgPath_ sets the path of the outline element', () => {
  const {foundation, mockAdapter} = setupTest();
  const notchWidth = 30;
  const isRtl = true;
  foundation.updateSvgPath_(notchWidth, isRtl);
  td.verify(mockAdapter.setOutlinePathAttr(td.matchers.anything()));
});

test('#updateSvgPath_ sets the path of the outline element if not isRtl', () => {
  const {foundation, mockAdapter} = setupTest();
  const notchWidth = 30;
  const isRtl = false;
  foundation.updateSvgPath_(notchWidth, isRtl);
  td.verify(mockAdapter.setOutlinePathAttr(td.matchers.anything()));
});
