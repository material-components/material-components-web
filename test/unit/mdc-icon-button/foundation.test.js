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

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCIconButtonToggleFoundation from '../../../packages/mdc-icon-button/foundation';

const {strings, cssClasses} = MDCIconButtonToggleFoundation;

suite('MDCIconButtonToggleFoundation');

test('exports strings', () => {
  assert.isTrue('strings' in MDCIconButtonToggleFoundation);
});

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCIconButtonToggleFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCIconButtonToggleFoundation, [
    'addClass', 'removeClass', 'hasClass', 'setAttr', 'notifyChange',
  ]);
});

const setupTest = () => setupFoundationTest(MDCIconButtonToggleFoundation);

test(`isOn is false if hasClass{${cssClasses.ICON_BUTTON_ON}) returns false`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ICON_BUTTON_ON)).thenReturn(false);
  assert.isFalse(foundation.isOn());
});

test(`isOn is true if hasClass{${cssClasses.ICON_BUTTON_ON}) returns true`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ICON_BUTTON_ON)).thenReturn(true);
  assert.isTrue(foundation.isOn());
});

test('#handleClick calls #toggle', () => {
  const {foundation} = setupTest();
  foundation.init();
  foundation.toggle = td.func();
  foundation.handleClick();
  td.verify(foundation.toggle(), {times: 1});
});

test('#handleClick calls notifyChange', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ICON_BUTTON_ON)).thenReturn(true);
  foundation.init();
  foundation.handleClick();
  td.verify(mockAdapter.notifyChange({isOn: true}), {times: 1});
});

test('#toggle flips on', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.when(mockAdapter.hasClass(cssClasses.ICON_BUTTON_ON)).thenReturn(true, false);

  foundation.toggle();
  td.verify(mockAdapter.removeClass(cssClasses.ICON_BUTTON_ON), {times: 1});
  foundation.toggle();
  td.verify(mockAdapter.addClass(cssClasses.ICON_BUTTON_ON), {times: 1});
});

test('#toggle accepts boolean argument denoting toggle state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.removeClass(cssClasses.ICON_BUTTON_ON), {times: 1});
  foundation.toggle(true);
  td.verify(mockAdapter.addClass(cssClasses.ICON_BUTTON_ON), {times: 1});
});

test('#toggle sets "aria-pressed" to true when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.toggle(true);
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'true'));
});

test('#toggle sets "aria-pressed" to false when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.toggle(false);
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'false'), {times: 1});
});
