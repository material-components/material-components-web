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

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCLinearProgressFoundation from '../../../packages/mdc-linear-progress/foundation';

const {cssClasses} = MDCLinearProgressFoundation;

suite('MDCLinearProgressFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCLinearProgressFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCLinearProgressFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCLinearProgressFoundation, [
    'addClass', 'getPrimaryBar', 'getBuffer', 'hasClass', 'removeClass', 'setStyle',
  ]);
});

const setupTest = () => setupFoundationTest(MDCLinearProgressFoundation);

test('#setDeterminate adds class and resets transforms', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(false);
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  const buffer = {};
  td.when(mockAdapter.getBuffer()).thenReturn(buffer);
  foundation.init();
  foundation.setDeterminate(false);
  td.verify(mockAdapter.addClass(cssClasses.INDETERMINATE_CLASS));
  td.verify(mockAdapter.setStyle(primaryBar, 'transform', 'scaleX(1)'));
  td.verify(mockAdapter.setStyle(buffer, 'transform', 'scaleX(1)'));
});

test('#setDeterminate removes class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(false);
  foundation.init();
  foundation.setDeterminate(true);
  td.verify(mockAdapter.removeClass(cssClasses.INDETERMINATE_CLASS));
});

test('#setDeterminate restores previous progress value after toggled from false to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  foundation.init();
  foundation.setProgress(0.123);
  foundation.setDeterminate(false);
  foundation.setDeterminate(true);
  td.verify(mockAdapter.setStyle(primaryBar, 'transform', 'scaleX(0.123)'), {times: 2});
});

test('#setDeterminate updates progress value set while determinate is false after determinate is true', () => {
  const {foundation, mockAdapter} = setupTest();
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  foundation.init();
  foundation.setDeterminate(false);
  foundation.setProgress(0.123);
  foundation.setDeterminate(true);
  td.verify(mockAdapter.setStyle(primaryBar, 'transform', 'scaleX(0.123)'));
});

test('#setProgress sets transform', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(false);
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  foundation.init();
  foundation.setProgress(0.5);
  td.verify(mockAdapter.setStyle(primaryBar, 'transform', 'scaleX(0.5)'));
});

test('#setProgress on indeterminate does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(true);
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  foundation.init();
  foundation.setProgress(0.5);
  td.verify(mockAdapter.setStyle(), {times: 0, ignoreExtraArgs: true});
});

test('#setBuffer sets transform', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(false);
  const buffer = {};
  td.when(mockAdapter.getBuffer()).thenReturn(buffer);
  foundation.init();
  foundation.setBuffer(0.5);
  td.verify(mockAdapter.setStyle(buffer, 'transform', 'scaleX(0.5)'));
});

test('#setBuffer on indeterminate does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(true);
  const buffer = {};
  td.when(mockAdapter.getBuffer()).thenReturn(buffer);
  foundation.init();
  foundation.setBuffer(0.5);
  td.verify(mockAdapter.setStyle(), {times: 0, ignoreExtraArgs: true});
});

test('#setReverse adds class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.REVERSED_CLASS)).thenReturn(false);
  foundation.init();
  foundation.setReverse(true);
  td.verify(mockAdapter.addClass(cssClasses.REVERSED_CLASS));
});

test('#setReverse removes class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.REVERSED_CLASS)).thenReturn(true);
  foundation.init();
  foundation.setReverse(false);
  td.verify(mockAdapter.removeClass(cssClasses.REVERSED_CLASS));
});

test('#open removes class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.REVERSED_CLASS)).thenReturn(true);
  foundation.init();
  foundation.open();
  td.verify(mockAdapter.removeClass(cssClasses.CLOSED_CLASS));
});

test('#close adds class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.REVERSED_CLASS)).thenReturn(true);
  foundation.init();
  foundation.close();
  td.verify(mockAdapter.addClass(cssClasses.CLOSED_CLASS));
});
