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

import MDCSelectFoundation from '../../../packages/mdc-select/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-select/constants';

suite('MDCSelectFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCSelectFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCSelectFoundation.numbers, numbers);
});

test('exports strings', () => {
  assert.deepEqual(MDCSelectFoundation.strings, strings);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectFoundation, [
    'addClass', 'removeClass', 'hasClass', 'floatLabel', 'activateBottomLine',
    'deactivateBottomLine', 'getValue',
    'isRtl', 'hasLabel', 'getLabelWidth', 'hasOutline',
    'notchOutline', 'closeOutline',
  ]);
});

function setupTest() {
  const {mockAdapter, foundation} = setupFoundationTest(MDCSelectFoundation);
  td.when(mockAdapter.getValue()).thenReturn('');
  return {mockAdapter, foundation};
}

test('#updateDisabledStyle(true) calls adapter.addClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.updateDisabledStyle(true);
  td.verify(mockAdapter.addClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('#updateDisabledStyle(false) calls adapter.removeClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.updateDisabledStyle(false);
  td.verify(mockAdapter.removeClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('#notchOutline updates the SVG path of the outline element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getLabelWidth()).thenReturn(30);
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.isRtl()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(30 * numbers.LABEL_SCALE, false));
});

test('#notchOutline does nothing if no outline is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(false);
  td.when(mockAdapter.hasLabel()).thenReturn(true);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline does nothing if no label is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.hasLabel()).thenReturn(false);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline calls updates notched outline to return to idle state when ' +
  'openNotch is false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasLabel()).thenReturn(true);
  td.when(mockAdapter.hasOutline()).thenReturn(true);

  foundation.notchOutline(false);
  td.verify(mockAdapter.closeOutline());
});

test('#handleChange calls adapter.floatLabel(true) when there is a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('value');

  foundation.handleChange();
  td.verify(mockAdapter.floatLabel(true), {times: 1});
});

test('#handleChange calls adapter.floatLabel(false) when there is no value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('');

  foundation.handleChange();
  td.verify(mockAdapter.floatLabel(false), {times: 1});
});

test('#handleChange calls foundation.notchOutline(true) when there is a value', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.notchOutline = td.func();
  td.when(mockAdapter.getValue()).thenReturn('value');

  foundation.handleChange();
  td.verify(foundation.notchOutline(true), {times: 1});
});

test('#handleChange calls foundation.notchOutline(false) when there is no value', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.notchOutline = td.func();
  td.when(mockAdapter.getValue()).thenReturn('');

  foundation.handleChange();
  td.verify(foundation.notchOutline(false), {times: 1});
});

test('#handleFocus calls adapter.floatLabel(true)', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleFocus();
  td.verify(mockAdapter.floatLabel(true), {times: 1});
});

test('#handleFocus calls foundation.notchOutline(true)', () => {
  const {foundation} = setupTest();
  foundation.notchOutline = td.func();
  foundation.handleFocus();
  td.verify(foundation.notchOutline(true), {times: 1});
});

test('#handleFocus calls adapter.activateBottomLine()', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleFocus();
  td.verify(mockAdapter.activateBottomLine(), {times: 1});
});

test('#handleBlur calls foundation.handleChange()', () => {
  const {foundation} = setupTest();
  foundation.handleChange = td.func();
  foundation.handleBlur();
  td.verify(foundation.handleChange(), {times: 1});
});

test('#handleBlur calls adapter.deactivateBottomLine()', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleBlur();
  td.verify(mockAdapter.deactivateBottomLine(), {times: 1});
});
