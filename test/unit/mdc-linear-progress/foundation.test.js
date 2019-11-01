/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import {MDCLinearProgressFoundation} from '../../../packages/mdc-linear-progress/foundation';

const {cssClasses, strings} = MDCLinearProgressFoundation;

suite('MDCLinearProgressFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCLinearProgressFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCLinearProgressFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCLinearProgressFoundation, [
    'addClass',
    'getPrimaryBar',
    'forceLayout',
    'getBuffer',
    'hasClass',
    'removeAttribute',
    'removeClass',
    'setAttribute',
    'setStyle',
  ]);
});

const setupTest = () => setupFoundationTest(MDCLinearProgressFoundation);

test('#setDeterminate false adds class, resets transforms, and removes aria-valuenow', () => {
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
  td.verify(mockAdapter.removeAttribute(strings.ARIA_VALUENOW));
});

test('#setDeterminate removes class', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(false);
  foundation.init();
  foundation.setDeterminate(true);
  td.verify(mockAdapter.removeClass(cssClasses.INDETERMINATE_CLASS));
});

test('#setDeterminate false calls forceLayout to correctly reset animation timers when reversed', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.REVERSED_CLASS)).thenReturn(true);
  foundation.init();
  foundation.setDeterminate(false);
  td.verify(mockAdapter.forceLayout());
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
  td.verify(mockAdapter.setAttribute(strings.ARIA_VALUENOW, '0.123'), {times: 2});
});

test('#setDeterminate restores previous buffer value after toggled from false to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const buffer = {};
  td.when(mockAdapter.getBuffer()).thenReturn(buffer);
  foundation.init();
  foundation.setBuffer(0.123);
  foundation.setDeterminate(false);
  foundation.setDeterminate(true);
  td.verify(mockAdapter.setStyle(buffer, 'transform', 'scaleX(0.123)'), {times: 2});
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
  td.verify(mockAdapter.setAttribute(strings.ARIA_VALUENOW, '0.123'));
});

test('#setProgress sets transform and aria-valuenow', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(false);
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  foundation.init();
  foundation.setProgress(0.5);
  td.verify(mockAdapter.setStyle(primaryBar, 'transform', 'scaleX(0.5)'));
  td.verify(mockAdapter.setAttribute(strings.ARIA_VALUENOW, '0.5'));
});

test('#setProgress on indeterminate does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(true);
  const primaryBar = {};
  td.when(mockAdapter.getPrimaryBar()).thenReturn(primaryBar);
  foundation.init();
  foundation.setProgress(0.5);
  td.verify(mockAdapter.setStyle(), {times: 0, ignoreExtraArgs: true});
  td.verify(mockAdapter.setAttribute(), {times: 0, ignoreExtraArgs: true});
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

test('#setReverse true calls forceLayout to correctly reset animation timers when indeterminate', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(true);
  foundation.init();
  foundation.setReverse(true);
  td.verify(mockAdapter.forceLayout());
});

test('#setReverse false calls forceLayout to correctly reset animation timers when indeterminate', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.INDETERMINATE_CLASS)).thenReturn(true);
  foundation.init();
  foundation.setReverse(false);
  td.verify(mockAdapter.forceLayout());
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
